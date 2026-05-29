import type { Producto } from '@/lib/supabase/types'
import ProductCard from './ProductCard'

type Props = {
  productos: Producto[]
  total: number
}

export default function ProductGrid({ productos, total }: Props) {
  if (productos.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-32 gap-6 text-center">
        <div className="relative">
          <svg className="w-24 h-24 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <div className="absolute inset-0 w-24 h-24 bg-lime-100/60 rounded-full blur-xl -z-10"></div>
        </div>
        <div className="flex flex-col gap-2">
          <p className="text-xl font-bold text-gray-700">Sin resultados</p>
          <p className="text-sm text-gray-500 max-w-xs">
            No encontramos productos que coincidan con tu búsqueda. Probá con otros términos o quitá los filtros activos.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Header con contador */}
      <div className="flex items-center justify-between gap-4 pb-4 border-b border-gray-200">
        <div className="flex items-baseline gap-2">
          <span className="text-2xl font-extrabold text-gray-900">{productos.length}</span>
          <span className="text-sm text-gray-500 font-medium">
            de <span className="font-bold text-gray-900">{total}</span> producto{total !== 1 ? 's' : ''}
          </span>
        </div>
        {productos.length !== total && (
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-lime-50 text-lime-700 text-xs font-semibold border border-lime-200">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M12.316 3.051a1 1 0 01.633 1.265l-4 12a1 1 0 11-1.898-.632l4-12a1 1 0 011.265-.633zM5.707 6.293a1 1 0 010 1.414L3.414 10l2.293 2.293a1 1 0 11-1.414 1.414l-3-3a1 1 0 010-1.414l3-3a1 1 0 011.414 0zm8.586 0a1 1 0 011.414 0l3 3a1 1 0 010 1.414l-3 3a1 1 0 11-1.414-1.414L16.586 10l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
            {total - productos.length} filtrado{total - productos.length !== 1 ? 's' : ''}
          </span>
        )}
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {productos.map((producto) => (
          <ProductCard key={producto.id} producto={producto} />
        ))}
      </div>
    </div>
  )
}
