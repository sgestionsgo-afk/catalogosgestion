export type Producto = {
  id: string
  nombre: string
  descripcion: string | null
  precio: number
  categoria: string
  imagen_url: string | null
  stock: number | null
  destacado: boolean
  activo: boolean
  created_at: string
  updated_at: string
}

export type ProductoInsert = Omit<Producto, 'id' | 'created_at' | 'updated_at'>
export type ProductoUpdate = Partial<ProductoInsert>

export type Database = {
  public: {
    Tables: {
      productos: {
        Row: Producto
        Insert: ProductoInsert
        Update: ProductoUpdate
      }
    }
    Views: Record<string, never>
    Functions: Record<string, never>
    Enums: Record<string, never>
    CompositeTypes: Record<string, never>
  }
}
