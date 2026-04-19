export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          auth_user_id: string | null;
          email: string;
          password_hash: string;
          full_name: string;
          phone: string | null;
          role: 'admin' | 'manager' | 'employee';
          avatar_url: string | null;
          is_active: boolean;
          last_login: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          auth_user_id?: string | null;
          email: string;
          password_hash: string;
          full_name: string;
          phone?: string | null;
          role?: 'admin' | 'manager' | 'employee';
          avatar_url?: string | null;
          is_active?: boolean;
          last_login?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          auth_user_id?: string | null;
          email?: string;
          password_hash?: string;
          full_name?: string;
          phone?: string | null;
          role?: 'admin' | 'manager' | 'employee';
          avatar_url?: string | null;
          is_active?: boolean;
          last_login?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      Relationships: [];};
      categories: {
        Row: {
          id: string;
          name: string;
          description: string | null;
          parent_id: string | null;
          icon_name: string | null;
          sort_order: number;
          is_active: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          description?: string | null;
          parent_id?: string | null;
          icon_name?: string | null;
          sort_order?: number;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          description?: string | null;
          parent_id?: string | null;
          icon_name?: string | null;
          sort_order?: number;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
      Relationships: [];};
      products: {
        Row: {
          id: string;
          sku: string;
          barcode: string | null;
          name: string;
          description: string | null;
          category_id: string | null;
          supplier_id: string | null;
          purchase_price: number;
          sale_price: number;
          tax_rate: number;
          weight: number | null;
          dimensions: string | null;
          color: string | null;
          material: string | null;
          image_url: string | null;
          min_stock_level: number;
          max_stock_level: number;
          is_active: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          sku: string;
          barcode?: string | null;
          name: string;
          description?: string | null;
          category_id?: string | null;
          supplier_id?: string | null;
          purchase_price?: number;
          sale_price?: number;
          tax_rate?: number;
          weight?: number | null;
          dimensions?: string | null;
          color?: string | null;
          material?: string | null;
          image_url?: string | null;
          min_stock_level?: number;
          max_stock_level?: number;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          sku?: string;
          barcode?: string | null;
          name?: string;
          description?: string | null;
          category_id?: string | null;
          supplier_id?: string | null;
          purchase_price?: number;
          sale_price?: number;
          tax_rate?: number;
          weight?: number | null;
          dimensions?: string | null;
          color?: string | null;
          material?: string | null;
          image_url?: string | null;
          min_stock_level?: number;
          max_stock_level?: number;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
      Relationships: [];};
      stock: {
        Row: {
          id: string;
          product_id: string;
          warehouse_id: string;
          quantity: number;
          reserved_quantity: number;
          last_counted_at: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          product_id: string;
          warehouse_id: string;
          quantity?: number;
          reserved_quantity?: number;
          last_counted_at?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          product_id?: string;
          warehouse_id?: string;
          quantity?: number;
          reserved_quantity?: number;
          last_counted_at?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      Relationships: [];};
      customers: {
        Row: {
          id: string;
          full_name: string;
          email: string | null;
          phone: string | null;
          address: string | null;
          city: string | null;
          tax_number: string | null;
          tax_office: string | null;
          notes: string | null;
          total_orders: number;
          total_spent: number;
          is_active: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          full_name: string;
          email?: string | null;
          phone?: string | null;
          address?: string | null;
          city?: string | null;
          tax_number?: string | null;
          tax_office?: string | null;
          notes?: string | null;
          total_orders?: number;
          total_spent?: number;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          full_name?: string;
          email?: string | null;
          phone?: string | null;
          address?: string | null;
          city?: string | null;
          tax_number?: string | null;
          tax_office?: string | null;
          notes?: string | null;
          total_orders?: number;
          total_spent?: number;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
      Relationships: [];};
      orders: {
        Row: {
          id: string;
          order_no: string;
          customer_id: string | null;
          order_status: 'beklemede' | 'hazirlaniyor' | 'kargoda' | 'teslim_edildi' | 'iptal';
          payment_status: 'odenmedi' | 'kismi_odendi' | 'odendi' | 'iade';
          subtotal: number;
          tax_total: number;
          discount_total: number;
          grand_total: number;
          shipping_address: string | null;
          shipping_city: string | null;
          notes: string | null;
          created_by: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          order_no: string;
          customer_id?: string | null;
          order_status?: 'beklemede' | 'hazirlaniyor' | 'kargoda' | 'teslim_edildi' | 'iptal';
          payment_status?: 'odenmedi' | 'kismi_odendi' | 'odendi' | 'iade';
          subtotal?: number;
          tax_total?: number;
          discount_total?: number;
          grand_total?: number;
          shipping_address?: string | null;
          shipping_city?: string | null;
          notes?: string | null;
          created_by?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          order_no?: string;
          customer_id?: string | null;
          order_status?: 'beklemede' | 'hazirlaniyor' | 'kargoda' | 'teslim_edildi' | 'iptal';
          payment_status?: 'odenmedi' | 'kismi_odendi' | 'odendi' | 'iade';
          subtotal?: number;
          tax_total?: number;
          discount_total?: number;
          grand_total?: number;
          shipping_address?: string | null;
          shipping_city?: string | null;
          notes?: string | null;
          created_by?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      Relationships: [];};
      order_items: {
        Row: {
          id: string;
          order_id: string;
          product_id: string;
          quantity: number;
          unit_price: number;
          tax_rate: number;
          discount_rate: number;
          line_total: number;
          notes: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          order_id: string;
          product_id: string;
          quantity?: number;
          unit_price: number;
          tax_rate?: number;
          discount_rate?: number;
          line_total: number;
          notes?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          order_id?: string;
          product_id?: string;
          quantity?: number;
          unit_price?: number;
          tax_rate?: number;
          discount_rate?: number;
          line_total?: number;
          notes?: string | null;
          created_at?: string;
        };
      Relationships: [];};
      suppliers: {
        Row: {
          id: string;
          company_name: string;
          contact_name: string | null;
          email: string | null;
          phone: string | null;
          address: string | null;
          city: string | null;
          tax_number: string | null;
          tax_office: string | null;
          notes: string | null;
          is_active: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          company_name: string;
          contact_name?: string | null;
          email?: string | null;
          phone?: string | null;
          address?: string | null;
          city?: string | null;
          tax_number?: string | null;
          tax_office?: string | null;
          notes?: string | null;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          company_name?: string;
          contact_name?: string | null;
          email?: string | null;
          phone?: string | null;
          address?: string | null;
          city?: string | null;
          tax_number?: string | null;
          tax_office?: string | null;
          notes?: string | null;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
      Relationships: [];};
      warehouses: {
        Row: {
          id: string;
          name: string;
          address: string | null;
          city: string | null;
          manager_id: string | null;
          capacity: number;
          is_active: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          address?: string | null;
          city?: string | null;
          manager_id?: string | null;
          capacity?: number;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          address?: string | null;
          city?: string | null;
          manager_id?: string | null;
          capacity?: number;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
      Relationships: [];};
      notifications: {
        Row: {
          id: string;
          user_id: string;
          title: string;
          message: string;
          is_read: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          title: string;
          message: string;
          is_read?: boolean;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          title?: string;
          message?: string;
          is_read?: boolean;
          created_at?: string;
        };
      Relationships: [];};
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      [_ in never]: never;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
}

