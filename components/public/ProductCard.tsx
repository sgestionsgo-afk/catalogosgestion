'use client'

import Image from 'next/image'
import Link from 'next/link'
import type { Producto } from '@/lib/supabase/types'
import { formatPrecio } from '@/lib/utils'

const CATEGORIA_COLORS: Record<string, string> = {
  Hardware: 'bg-violet-600 text-white',
  Sistemas: 'bg-blue-600 text-white',
  Servicios: 'bg-emerald-600 text-white',
}

type Props = {
  producto: Producto
}

export default function ProductCard({ producto }: Props) {
  const { id, nombre, precio, imagen_url, categoria, descripcion, destacado, stock } = producto
  const categoriaColor = CATEGORIA_COLORS[categoria] ?? 'bg-gray-700 text-white'

  return (
    <Link
      href={`/productos/${id}`}
      className="group flex flex-col rounded-2xl bg-white border border-gray-200 shadow-md hover:-translate-y-1 overflow-hidden"
      style={{ transition: 'box-shadow 0.3s ease, transform 0.3s ease', backgroundColor: '#ffffff' }}
      onMouseEnter={e => { e.currentTarget.style.boxShadow = '0 0 20px 5px rgba(255,255,255,0.4), 0 12px 40px rgba(0,0,0,0.18)'; e.currentTarget.style.backgroundColor = '#ffffff' }}
      onMouseLeave={e => { e.currentTarget.style.boxShadow = ''; e.currentTarget.style.backgroundColor = '#ffffff' }}
    >
      {/* Imagen con overlay */}
      <div className="relative aspect-[4/3] bg-white overflow-hidden border-b border-gray-200">
        {imagen_url ? (
          <>
            <Image
              src={imagen_url}
              alt={nombre}
              fill
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              className="object-cover group-hover:scale-110 transition-transform duration-700"
            />
            {/* Overlay gradient en hover */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          </>
        ) : (
          <div className="flex h-full flex-col items-center justify-center gap-2">
            <svg className="w-16 h-16 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <span className="text-xs text-gray-400 font-medium">Sin imagen</span>
          </div>
        )}

        {/* Badges superpuestos */}
        <div className="absolute top-3 left-3 flex flex-col gap-2">
          {destacado && (
            <span className="inline-flex items-center gap-1.5 rounded-full bg-gradient-to-r from-amber-400 to-amber-500 px-3 py-1.5 text-xs font-extrabold text-amber-950 shadow-lg shadow-amber-300/50 backdrop-blur-sm">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
              Destacado
            </span>
          )}
        </div>

        {/* Indicador de stock */}
        {stock === 0 && (
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center">
            <span className="rounded-full bg-red-600/90 px-4 py-2 text-xs font-bold text-white tracking-widest shadow-lg">SIN STOCK</span>
          </div>
        )}
        
        {stock > 0 && stock < 5 && (
          <div className="absolute top-3 right-3 bg-orange-500/90 backdrop-blur-sm rounded-full px-2.5 py-1 text-xs font-bold text-white shadow-lg">
            {stock} disponible{stock !== 1 ? 's' : ''}
          </div>
        )}
      </div>

      {/* Info */}
      <div className="flex flex-col flex-1 p-5 gap-3 bg-white">
        {/* Categoría mejorada */}
        <span className={`self-start rounded-lg px-3 py-1 text-xs font-bold ${categoriaColor}`}>
          {categoria}
        </span>

        {/* Título */}
        <h3 className="font-bold text-gray-900 leading-snug line-clamp-2 group-hover:text-green-700 transition-colors text-base">
          {nombre}
        </h3>

        {/* Descripción */}
        {descripcion && (
          <p className="text-sm text-gray-700 line-clamp-2 leading-relaxed flex-1 min-h-10">{descripcion}</p>
        )}

        {/* Precio y botón */}
        <div className="flex items-center justify-between mt-2 pt-4 border-t border-gray-100 gap-3">
          <div className="flex flex-col">
            <span className="text-xs text-gray-500 font-semibold">Precio</span>
            <p className="text-2xl font-extrabold text-green-600">
              {formatPrecio(precio)}
            </p>
          </div>
          <button className="inline-flex items-center gap-2 rounded-lg bg-gradient-to-r from-green-600 to-lime-500 hover:from-green-700 hover:to-lime-600 active:scale-95 px-4 py-2.5 text-xs font-bold text-white shadow-md shadow-green-500/20 transition-all duration-200">
            Ver
            <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </button>
        </div>
      </div>
    </Link>
  )
}
