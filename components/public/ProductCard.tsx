import Image from 'next/image'
import Link from 'next/link'
import type { Producto } from '@/lib/supabase/types'
import { formatPrecio } from '@/lib/utils'

type Props = {
  producto: Producto
}

export default function ProductCard({ producto }: Props) {
  const { id, nombre, precio, imagen_url, categoria, descripcion, destacado, stock } = producto

  return (
    <Link
      href={`/productos/${id}`}
      className="group flex flex-col rounded-2xl border border-gray-100 bg-white shadow-sm hover:shadow-md transition-shadow overflow-hidden"
    >
      {/* Imagen */}
      <div className="relative aspect-square bg-gray-50 overflow-hidden">
        {imagen_url ? (
          <Image
            src={imagen_url}
            alt={nombre}
            fill
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            className="object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-gray-300">
            <svg className="w-14 h-14" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1}
                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
        )}
        {destacado && (
          <span className="absolute top-2 left-2 rounded-full bg-amber-400 px-2 py-0.5 text-xs font-semibold text-amber-900">
            Destacado
          </span>
        )}
        {stock === 0 && (
          <div className="absolute inset-0 bg-white/70 flex items-center justify-center">
            <span className="text-sm font-semibold text-gray-500">Sin stock</span>
          </div>
        )}
      </div>

      {/* Info */}
      <div className="flex flex-col gap-1 p-4">
        <span className="text-xs text-gray-400 uppercase tracking-wide">{categoria}</span>
        <h3 className="font-semibold text-gray-900 leading-tight line-clamp-2 group-hover:text-blue-600 transition-colors">
          {nombre}
        </h3>
        {descripcion && (
          <p className="text-sm text-gray-500 line-clamp-2">{descripcion}</p>
        )}
        <p className="mt-2 text-lg font-bold text-blue-600">{formatPrecio(precio)}</p>
      </div>
    </Link>
  )
}
