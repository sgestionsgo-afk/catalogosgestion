import type { Producto } from '@/lib/supabase/types'
import ProductCard from './ProductCard'

type Props = {
  productos: Producto[]
}

export default function ProductGrid({ productos }: Props) {
  if (productos.length === 0) {
    return (
      <div className="py-20 text-center text-gray-400">
        <p>No hay productos disponibles.</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
      {productos.map((producto) => (
        <ProductCard key={producto.id} producto={producto} />
      ))}
    </div>
  )
}
