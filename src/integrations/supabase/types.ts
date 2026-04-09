export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.1"
  }
  public: {
    Tables: {
      paypal_plans: {
        Row: {
          amount_usd: number
          billing_period: string
          created_at: string
          id: string
          paypal_plan_id: string
          paypal_product_id: string
          plan_name: string
        }
        Insert: {
          amount_usd: number
          billing_period: string
          created_at?: string
          id?: string
          paypal_plan_id: string
          paypal_product_id: string
          plan_name: string
        }
        Update: {
          amount_usd?: number
          billing_period?: string
          created_at?: string
          id?: string
          paypal_plan_id?: string
          paypal_product_id?: string
          plan_name?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          account_type: Database["public"]["Enums"]["account_type"]
          address: string | null
          assigned_plan: string | null
          city: string | null
          company_name: string | null
          contact_name: string | null
          country: string | null
          created_at: string
          document_number: string | null
          document_type: string | null
          email: string
          first_name: string | null
          id: string
          last_name: string | null
          nit: string | null
          phone: string | null
          privacy_accepted_at: string | null
          second_last_name: string | null
          second_name: string | null
          seller_id: string | null
          subscription_start_date: string | null
          terms_accepted_at: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          account_type: Database["public"]["Enums"]["account_type"]
          address?: string | null
          assigned_plan?: string | null
          city?: string | null
          company_name?: string | null
          contact_name?: string | null
          country?: string | null
          created_at?: string
          document_number?: string | null
          document_type?: string | null
          email: string
          first_name?: string | null
          id?: string
          last_name?: string | null
          nit?: string | null
          phone?: string | null
          privacy_accepted_at?: string | null
          second_last_name?: string | null
          second_name?: string | null
          seller_id?: string | null
          subscription_start_date?: string | null
          terms_accepted_at?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          account_type?: Database["public"]["Enums"]["account_type"]
          address?: string | null
          assigned_plan?: string | null
          city?: string | null
          company_name?: string | null
          contact_name?: string | null
          country?: string | null
          created_at?: string
          document_number?: string | null
          document_type?: string | null
          email?: string
          first_name?: string | null
          id?: string
          last_name?: string | null
          nit?: string | null
          phone?: string | null
          privacy_accepted_at?: string | null
          second_last_name?: string | null
          second_name?: string | null
          seller_id?: string | null
          subscription_start_date?: string | null
          terms_accepted_at?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      seller_commissions: {
        Row: {
          commission_amount: number
          commission_month: number
          commission_percentage: number
          created_at: string
          id: string
          notes: string | null
          paid_at: string | null
          plan_name: string
          plan_type: string
          seller_id: string
          status: string
          transaction_amount: number
          transaction_id: string
          user_id: string
        }
        Insert: {
          commission_amount: number
          commission_month: number
          commission_percentage: number
          created_at?: string
          id?: string
          notes?: string | null
          paid_at?: string | null
          plan_name: string
          plan_type: string
          seller_id: string
          status?: string
          transaction_amount: number
          transaction_id: string
          user_id: string
        }
        Update: {
          commission_amount?: number
          commission_month?: number
          commission_percentage?: number
          created_at?: string
          id?: string
          notes?: string | null
          paid_at?: string | null
          plan_name?: string
          plan_type?: string
          seller_id?: string
          status?: string
          transaction_amount?: number
          transaction_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "seller_commissions_transaction_id_fkey"
            columns: ["transaction_id"]
            isOneToOne: false
            referencedRelation: "transactions"
            referencedColumns: ["id"]
          },
        ]
      }
      subscriptions: {
        Row: {
          amount: number
          created_at: string
          currency: string
          id: string
          last_billing_date: string | null
          max_retries: number
          next_billing_date: string
          payment_gateway: string
          paypal_plan_id: string | null
          paypal_subscription_id: string | null
          plan_name: string
          retry_count: number
          status: string
          suspended_at: string | null
          updated_at: string
          user_id: string
          wompi_card_token: string | null
          wompi_payment_source_id: number | null
        }
        Insert: {
          amount: number
          created_at?: string
          currency?: string
          id?: string
          last_billing_date?: string | null
          max_retries?: number
          next_billing_date: string
          payment_gateway?: string
          paypal_plan_id?: string | null
          paypal_subscription_id?: string | null
          plan_name: string
          retry_count?: number
          status?: string
          suspended_at?: string | null
          updated_at?: string
          user_id: string
          wompi_card_token?: string | null
          wompi_payment_source_id?: number | null
        }
        Update: {
          amount?: number
          created_at?: string
          currency?: string
          id?: string
          last_billing_date?: string | null
          max_retries?: number
          next_billing_date?: string
          payment_gateway?: string
          paypal_plan_id?: string | null
          paypal_subscription_id?: string | null
          plan_name?: string
          retry_count?: number
          status?: string
          suspended_at?: string | null
          updated_at?: string
          user_id?: string
          wompi_card_token?: string | null
          wompi_payment_source_id?: number | null
        }
        Relationships: []
      }
      support_tickets: {
        Row: {
          created_at: string
          description: string
          id: string
          priority: string
          status: string
          subject: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          description: string
          id?: string
          priority?: string
          status?: string
          subject: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          description?: string
          id?: string
          priority?: string
          status?: string
          subject?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      ticket_messages: {
        Row: {
          created_at: string
          id: string
          is_from_support: boolean
          message: string
          ticket_id: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          is_from_support?: boolean
          message: string
          ticket_id: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          is_from_support?: boolean
          message?: string
          ticket_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "ticket_messages_ticket_id_fkey"
            columns: ["ticket_id"]
            isOneToOne: false
            referencedRelation: "support_tickets"
            referencedColumns: ["id"]
          },
        ]
      }
      transactions: {
        Row: {
          amount: number
          created_at: string
          currency: string
          id: string
          payment_gateway: string
          payment_method: string | null
          paypal_order_id: string | null
          plan_name: string
          reference: string
          siigo_invoice_id: string | null
          status: string
          updated_at: string
          user_id: string
          wompi_transaction_id: string | null
        }
        Insert: {
          amount: number
          created_at?: string
          currency?: string
          id?: string
          payment_gateway?: string
          payment_method?: string | null
          paypal_order_id?: string | null
          plan_name: string
          reference: string
          siigo_invoice_id?: string | null
          status?: string
          updated_at?: string
          user_id: string
          wompi_transaction_id?: string | null
        }
        Update: {
          amount?: number
          created_at?: string
          currency?: string
          id?: string
          payment_gateway?: string
          payment_method?: string | null
          paypal_order_id?: string | null
          plan_name?: string
          reference?: string
          siigo_invoice_id?: string | null
          status?: string
          updated_at?: string
          user_id?: string
          wompi_transaction_id?: string | null
        }
        Relationships: []
      }
      trm_rates: {
        Row: {
          fetched_at: string
          id: string
          rate: number
          rate_with_commission: number
          source: string
        }
        Insert: {
          fetched_at?: string
          id?: string
          rate: number
          rate_with_commission: number
          source?: string
        }
        Update: {
          fetched_at?: string
          id?: string
          rate?: number
          rate_with_commission?: number
          source?: string
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
      is_first_user: { Args: never; Returns: boolean }
    }
    Enums: {
      account_type: "persona" | "empresa"
      app_role: "admin" | "moderator" | "user" | "support" | "vendedor"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      account_type: ["persona", "empresa"],
      app_role: ["admin", "moderator", "user", "support", "vendedor"],
    },
  },
} as const
