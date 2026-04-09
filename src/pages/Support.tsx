import { useEffect, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Bot, LogOut, Search, HelpCircle, MessageSquare, User } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";
import { es } from "date-fns/locale";

interface SupportTicket {
  id: string;
  user_id: string;
  subject: string;
  description: string;
  status: string;
  priority: string;
  created_at: string;
  updated_at: string;
}

interface Profile {
  user_id: string;
  email: string;
  first_name: string | null;
  last_name: string | null;
  company_name: string | null;
  account_type: "persona" | "empresa";
}

interface TicketMessage {
  id: string;
  ticket_id: string;
  user_id: string;
  message: string;
  is_from_support: boolean;
  created_at: string;
}

const Support = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [tickets, setTickets] = useState<SupportTicket[]>([]);
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [searchTicket, setSearchTicket] = useState("");
  const [filterTicketStatus, setFilterTicketStatus] = useState<string>("all");
  
  // Ticket messaging state
  const [viewTicketModal, setViewTicketModal] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState<SupportTicket | null>(null);
  const [ticketMessages, setTicketMessages] = useState<TicketMessage[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [loadingMessages, setLoadingMessages] = useState(false);

  useEffect(() => {
    const checkSupport = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        navigate("/auth");
        return;
      }

      // Check if user has support role
      const { data: role } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", session.user.id)
        .eq("role", "support")
        .maybeSingle();

      if (!role) {
        // Check if admin
        const { data: adminRole } = await supabase
          .from("user_roles")
          .select("role")
          .eq("user_id", session.user.id)
          .eq("role", "admin")
          .maybeSingle();

        if (adminRole) {
          navigate("/admin");
        } else {
          navigate("/dashboard");
        }
        return;
      }

      await loadData();
      setLoading(false);

      const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
        if (event === "SIGNED_OUT") {
          navigate("/");
        }
      });

      return () => subscription.unsubscribe();
    };

    checkSupport();
  }, [navigate]);

  const loadData = async () => {
    const [ticketsRes, profilesRes] = await Promise.all([
      supabase.from("support_tickets").select("*").order("created_at", { ascending: false }),
      supabase.from("profiles").select("user_id, email, first_name, last_name, company_name, account_type")
    ]);

    setTickets((ticketsRes.data as SupportTicket[]) || []);
    setProfiles((profilesRes.data as Profile[]) || []);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut({ scope: 'local' });
    Object.keys(localStorage).forEach((key) => {
      if (key.startsWith("sb-") && key.endsWith("-auth-token")) {
        localStorage.removeItem(key);
      }
    });
    navigate("/", { replace: true });
  };

  const getProfileInfo = (userId: string) => {
    const profile = profiles.find(p => p.user_id === userId);
    if (!profile) return { name: "Usuario desconocido", email: "" };
    
    const name = profile.account_type === "empresa" 
      ? profile.company_name || "Empresa"
      : `${profile.first_name || ""} ${profile.last_name || ""}`.trim() || "Usuario";
    
    return { name, email: profile.email };
  };

  const handleUpdateTicketStatus = async (ticketId: string, newStatus: string) => {
    const { error } = await supabase
      .from("support_tickets")
      .update({ status: newStatus })
      .eq("id", ticketId);

    if (error) {
      toast({
        title: "Error",
        description: "No se pudo actualizar el estado del ticket.",
        variant: "destructive",
      });
      return;
    }

    setTickets(tickets.map(t => 
      t.id === ticketId ? { ...t, status: newStatus } : t
    ));

    toast({
      title: "Ticket actualizado",
      description: `Estado cambiado a ${newStatus}.`,
    });
    
    // Update selectedTicket if it's the same ticket
    if (selectedTicket?.id === ticketId) {
      setSelectedTicket({ ...selectedTicket, status: newStatus });
    }
  };

  const handleOpenTicket = async (ticket: SupportTicket) => {
    setSelectedTicket(ticket);
    setViewTicketModal(true);
    setLoadingMessages(true);
    
    const { data: messages } = await supabase
      .from("ticket_messages")
      .select("*")
      .eq("ticket_id", ticket.id)
      .order("created_at", { ascending: true });

    setTicketMessages((messages as TicketMessage[]) || []);
    setLoadingMessages(false);
  };

  const handleSendSupportMessage = async () => {
    if (!selectedTicket || !newMessage.trim() || selectedTicket.status === "closed") return;

    const { data: session } = await supabase.auth.getSession();
    if (!session.session) return;

    const { error } = await supabase
      .from("ticket_messages")
      .insert({
        ticket_id: selectedTicket.id,
        user_id: session.session.user.id,
        message: newMessage.trim(),
        is_from_support: true
      });

    if (error) {
      toast({
        title: "Error",
        description: "No se pudo enviar el mensaje",
        variant: "destructive"
      });
    } else {
      setNewMessage("");
      // Refresh messages
      const { data: messages } = await supabase
        .from("ticket_messages")
        .select("*")
        .eq("ticket_id", selectedTicket.id)
        .order("created_at", { ascending: true });

      setTicketMessages((messages as TicketMessage[]) || []);
    }
  };

  const filteredTickets = useMemo(() => {
    return tickets.filter(ticket => {
      const profileInfo = getProfileInfo(ticket.user_id);
      const matchesSearch = searchTicket === "" || 
        ticket.subject.toLowerCase().includes(searchTicket.toLowerCase()) ||
        profileInfo.name.toLowerCase().includes(searchTicket.toLowerCase()) ||
        profileInfo.email.toLowerCase().includes(searchTicket.toLowerCase());
      
      const matchesStatus = filterTicketStatus === "all" || ticket.status === filterTicketStatus;
      
      return matchesSearch && matchesStatus;
    });
  }, [tickets, searchTicket, filterTicketStatus, profiles]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "open": return "text-yellow-400";
      case "in_progress": return "text-blue-400";
      case "resolved": return "text-green-400";
      case "closed": return "text-muted-foreground";
      default: return "text-muted-foreground";
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "open": return "Abierto";
      case "in_progress": return "En progreso";
      case "resolved": return "Resuelto";
      case "closed": return "Cerrado";
      default: return status;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high": return "text-red-400";
      case "medium": return "text-yellow-400";
      case "low": return "text-green-400";
      default: return "text-muted-foreground";
    }
  };

  const getPriorityLabel = (priority: string) => {
    switch (priority) {
      case "high": return "Alta";
      case "medium": return "Media";
      case "low": return "Baja";
      default: return priority;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="flex items-center gap-3">
          <Bot className="w-8 h-8 text-primary animate-pulse" />
          <span className="text-foreground">Cargando panel de soporte...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Bot className="w-8 h-8 text-primary" />
            <span className="text-xl font-bold text-foreground">Panel de Soporte</span>
          </div>
          <Button
            variant="ghost"
            onClick={handleLogout}
            className="text-muted-foreground hover:text-foreground"
          >
            <LogOut className="w-5 h-5 mr-2" />
            Cerrar Sesión
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="glass-card p-6">
            <div className="flex items-center gap-3 mb-6">
              <HelpCircle className="w-6 h-6 text-primary" />
              <h2 className="text-xl font-semibold text-foreground">Tickets de Soporte</h2>
              <span className="bg-primary/20 text-primary px-2 py-1 rounded-full text-sm">
                {filteredTickets.length} tickets
              </span>
            </div>

            <div className="flex flex-wrap items-center gap-4 mb-6">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input
                  placeholder="Buscar por asunto o usuario..."
                  value={searchTicket}
                  onChange={(e) => setSearchTicket(e.target.value)}
                  className="pl-10 bg-secondary border-border"
                />
              </div>
              <Select value={filterTicketStatus} onValueChange={setFilterTicketStatus}>
                <SelectTrigger className="w-48 bg-secondary border-border">
                  <SelectValue placeholder="Filtrar por estado" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos los estados</SelectItem>
                  <SelectItem value="open">Abierto</SelectItem>
                  <SelectItem value="in_progress">En progreso</SelectItem>
                  <SelectItem value="resolved">Resuelto</SelectItem>
                  <SelectItem value="closed">Cerrado</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left py-3 px-4 text-muted-foreground font-medium">Fecha</th>
                    <th className="text-left py-3 px-4 text-muted-foreground font-medium">Usuario</th>
                    <th className="text-left py-3 px-4 text-muted-foreground font-medium">Asunto</th>
                    <th className="text-left py-3 px-4 text-muted-foreground font-medium">Prioridad</th>
                    <th className="text-left py-3 px-4 text-muted-foreground font-medium">Estado</th>
                    <th className="text-left py-3 px-4 text-muted-foreground font-medium">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredTickets.map((ticket) => {
                    const profileInfo = getProfileInfo(ticket.user_id);
                    return (
                      <tr 
                        key={ticket.id} 
                        className="border-b border-border/50 hover:bg-secondary/50 cursor-pointer"
                        onClick={() => handleOpenTicket(ticket)}
                      >
                        <td className="py-3 px-4 text-foreground">
                          {format(new Date(ticket.created_at), "dd/MM/yyyy HH:mm", { locale: es })}
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-2">
                            <User className="w-4 h-4 text-muted-foreground" />
                            <div>
                              <div className="text-foreground">{profileInfo.name}</div>
                              <div className="text-xs text-muted-foreground">{profileInfo.email}</div>
                            </div>
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-2">
                            <MessageSquare className="w-4 h-4 text-primary" />
                            <div>
                              <div className="text-foreground">{ticket.subject}</div>
                              <div className="text-xs text-muted-foreground line-clamp-1">{ticket.description}</div>
                            </div>
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <span className={`${getPriorityColor(ticket.priority)} font-medium`}>
                            {getPriorityLabel(ticket.priority)}
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          <span className={`${getStatusColor(ticket.status)} font-medium`}>
                            {getStatusLabel(ticket.status)}
                          </span>
                        </td>
                        <td className="py-3 px-4" onClick={(e) => e.stopPropagation()}>
                          <Select
                            value={ticket.status}
                            onValueChange={(value) => handleUpdateTicketStatus(ticket.id, value)}
                          >
                            <SelectTrigger className="w-36 bg-secondary border-border">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="open">Abierto</SelectItem>
                              <SelectItem value="in_progress">En progreso</SelectItem>
                              <SelectItem value="resolved">Resuelto</SelectItem>
                              <SelectItem value="closed">Cerrado</SelectItem>
                            </SelectContent>
                          </Select>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
              {filteredTickets.length === 0 && (
                <div className="text-center py-12 text-muted-foreground">
                  <HelpCircle className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>No se encontraron tickets</p>
                </div>
              )}
            </div>
          </div>
        </motion.div>
      </main>

      {/* Ticket Messages Modal */}
      <Dialog open={viewTicketModal} onOpenChange={setViewTicketModal}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <MessageSquare className="w-5 h-5 text-primary" />
              {selectedTicket?.subject}
            </DialogTitle>
          </DialogHeader>
          
          {selectedTicket && (
            <div className="space-y-4">
              {/* User info */}
              <div className="p-3 bg-muted rounded-lg">
                <p className="text-sm text-muted-foreground">Usuario: {getProfileInfo(selectedTicket.user_id).name}</p>
                <p className="text-sm text-muted-foreground">Email: {getProfileInfo(selectedTicket.user_id).email}</p>
                <p className="text-sm text-muted-foreground">
                  Estado: <span className={getStatusColor(selectedTicket.status)}>{getStatusLabel(selectedTicket.status)}</span>
                </p>
              </div>

              {/* Original description */}
              <div className="p-3 bg-secondary rounded-lg">
                <p className="text-xs text-muted-foreground mb-1">Descripción original:</p>
                <p className="text-sm text-foreground">{selectedTicket.description}</p>
              </div>

              {/* Messages */}
              <div className="space-y-3 max-h-60 overflow-y-auto">
                {loadingMessages ? (
                  <p className="text-center text-muted-foreground">Cargando mensajes...</p>
                ) : ticketMessages.length === 0 ? (
                  <p className="text-center text-muted-foreground">No hay mensajes aún</p>
                ) : (
                  ticketMessages.map((msg) => (
                    <div
                      key={msg.id}
                      className={`p-3 rounded-lg ${
                        msg.is_from_support 
                          ? "bg-primary/10 ml-4" 
                          : "bg-secondary mr-4"
                      }`}
                    >
                      <p className="text-xs text-muted-foreground mb-1">
                        {msg.is_from_support ? "Soporte" : "Usuario"} - {format(new Date(msg.created_at), "dd/MM/yyyy HH:mm", { locale: es })}
                      </p>
                      <p className="text-sm text-foreground">{msg.message}</p>
                    </div>
                  ))
                )}
              </div>

              {/* New message input */}
              {selectedTicket.status !== "closed" ? (
                <div className="flex gap-2 mt-4">
                  <Input
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="Escribe una respuesta..."
                    className="flex-1"
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && !e.shiftKey) {
                        e.preventDefault();
                        handleSendSupportMessage();
                      }
                    }}
                  />
                  <Button onClick={handleSendSupportMessage} disabled={!newMessage.trim()}>
                    Enviar
                  </Button>
                </div>
              ) : (
                <p className="text-sm text-muted-foreground text-center mt-4 p-3 bg-muted rounded-md">
                  Este ticket está cerrado. No se pueden agregar más mensajes.
                </p>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Support;
