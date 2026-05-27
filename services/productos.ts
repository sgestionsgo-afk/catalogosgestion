import { createClient } from '@/lib/supabase/server'
import type { Producto, ProductoInsert, ProductoUpdate } from '@/lib/supabase/types'

export async function getProductos(categoria?: string): Promise<Producto[]> {
  const supabase = await createClient()

  let query = supabase
    .from('productos')
    .select('*')
    .eq('activo', true)
    .order('destacado', { ascending: false })
    .order('nombre')

  if (categoria) {
    query = query.eq('categoria', categoria)
  }

  const { data, error } = await query
  if (error) throw new Error(error.message)
  return (data ?? []) as Producto[]
}

export async function getProductoDestacados(): Promise<Producto[]> {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('productos')
    .select('*')
    .eq('activo', true)
    .eq('destacado', true)
    .order('nombre')
    .limit(8)

  if (error) throw new Error(error.message)
  return (data ?? []) as Producto[]
}

export async function getProductoById(id: string): Promise<Producto> {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('productos')
    .select('*')
    .eq('id', id)
    .single()

  if (error) throw new Error(error.message)
  return data as Producto
}

export async function getCategorias(): Promise<string[]> {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('productos')
    .select('categoria')
    .eq('activo', true)

  if (error) throw new Error(error.message)

  const unicas = [...new Set((data ?? []).map((p) => (p as { categoria: string }).categoria))].sort()
  return unicas
}

// --- Admin (requieren service_role o RLS permisivo para auth) ---

export async function getProductosAdmin(): Promise<Producto[]> {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('productos')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) throw new Error(error.message)
  return (data ?? []) as Producto[]
}

export async function crearProducto(producto: ProductoInsert): Promise<Producto> {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('productos')
    .insert(producto)
    .select()
    .single()

  if (error) throw new Error(error.message)
  return data as Producto
}

export async function actualizarProducto(id: string, producto: ProductoUpdate): Promise<Producto> {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('productos')
    .update({ ...producto, updated_at: new Date().toISOString() })
    .eq('id', id)
    .select()
    .single()

  if (error) throw new Error(error.message)
  return data as Producto
}

export async function eliminarProducto(id: string): Promise<void> {
  const supabase = await createClient()

  const { error } = await supabase.from('productos').delete().eq('id', id)
  if (error) throw new Error(error.message)
}
