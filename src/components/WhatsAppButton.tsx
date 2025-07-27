import { MessageCircle } from "lucide-react";

const WhatsAppButton = () => {
  return (
    <a
      href="https://wa.me/573009006005"
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-50 flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white px-4 py-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
      aria-label="Contactar por WhatsApp"
    >
      <MessageCircle size={24} />
      <span className="hidden sm:inline font-medium">WhatsApp</span>
    </a>
  );
};

export default WhatsAppButton;