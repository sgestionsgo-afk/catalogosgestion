'use client'

import Link from 'next/link'
import { usePathname, useSearchParams } from 'next/navigation'

const CATEGORIA_ICONS: Record<string, string> = {
  Hardware: '🖥️',
  Sistemas: '⚙️',
  Servicios: '🛠️',
}

type Props = {
  categorias: string[]
  counts: Record<string, number>
}

export default function CategoryFilter({ categorias, counts }: Props) {
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const categoriaActual = searchParams.get('categoria')

  function buildHref(categoria: string | null) {
    const params = new URLSearchParams(searchParams.toString())
    if (categoria) {
      params.set('categoria', categoria)
    } else {
      params.delete('categoria')
    }
    const qs = params.toString()
    return qs ? `${pathname}?${qs}` : pathname
  }

  const total = Object.values(counts).reduce((a, b) => a + b, 0)

  return (
    <div className="flex flex-wrap gap-2" role="tablist" aria-label="Filtrar por categoría">
      <Link
        href={buildHref(null)}
        role="tab"
        aria-selected={!categoriaActual}
        className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-semibold border transition-all duration-200 ${
          !categoriaActual
            ? 'bg-lime-500 text-white border-lime-500 shadow-sm'
            : 'bg-white text-gray-800 border-gray-300 hover:border-lime-400 hover:text-lime-700 hover:bg-lime-50'
        }`}
      >
        Todos
        <span className={`text-xs rounded-full px-1.5 py-0.5 font-bold ${
          !categoriaActual ? 'bg-lime-400 text-white' : 'bg-gray-200 text-gray-700'
        }`}>{total}</span>
      </Link>
      {categorias.map((cat) => (
        <Link
          key={cat}
          href={buildHref(cat)}
          role="tab"
          aria-selected={categoriaActual === cat}
          className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-semibold border transition-all duration-200 ${
            categoriaActual === cat
              ? 'bg-lime-500 text-white border-lime-500 shadow-sm'
              : 'bg-white text-gray-800 border-gray-300 hover:border-lime-400 hover:text-lime-700 hover:bg-lime-50'
          }`}
        >
          <span className="text-base">{CATEGORIA_ICONS[cat] ?? ''}</span>
          {cat}
          <span className={`text-xs rounded-full px-1.5 py-0.5 font-bold ${
            categoriaActual === cat ? 'bg-lime-400 text-white' : 'bg-gray-200 text-gray-700'
          }`}>{counts[cat] ?? 0}</span>
        </Link>
      ))}
    </div>
  )
}
