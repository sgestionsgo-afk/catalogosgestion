'use client'

import Link from 'next/link'
import { usePathname, useSearchParams } from 'next/navigation'

type Props = {
  categorias: string[]
}

export default function CategoryFilter({ categorias }: Props) {
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

  return (
    <div className="flex flex-wrap gap-2">
      <Link
        href={buildHref(null)}
        className={`px-4 py-1.5 rounded-full text-sm font-medium border transition-colors ${
          !categoriaActual
            ? 'bg-blue-600 text-white border-blue-600'
            : 'bg-white text-gray-600 border-gray-200 hover:border-blue-300'
        }`}
      >
        Todos
      </Link>
      {categorias.map((cat) => (
        <Link
          key={cat}
          href={buildHref(cat)}
          className={`px-4 py-1.5 rounded-full text-sm font-medium border transition-colors ${
            categoriaActual === cat
              ? 'bg-blue-600 text-white border-blue-600'
              : 'bg-white text-gray-600 border-gray-200 hover:border-blue-300'
          }`}
        >
          {cat}
        </Link>
      ))}
    </div>
  )
}
