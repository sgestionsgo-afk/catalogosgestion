'use client'

import { useMemo, useState, useTransition } from 'react'
import { useSearchParams, useRouter, usePathname } from 'next/navigation'
import type { Producto } from '@/lib/supabase/types'
import SearchBar from './SearchBar'
import CategoryFilter from './CategoryFilter'
import ProductGrid from './ProductGrid'

type OrdenKey = 'relevancia' | 'precio_asc' | 'precio_desc' | 'nombre'

const ORDEN_OPCIONES: { value: OrdenKey; label: string }[] = [
  { value: 'relevancia', label: 'Más relevantes' },
  { value: 'precio_asc', label: 'Precio: menor a mayor' },
  { value: 'precio_desc', label: 'Precio: mayor a menor' },
  { value: 'nombre', label: 'Nombre A–Z' },
]

type Props = {
  productos: Producto[]
}

export default function CatalogClient({ productos }: Props) {
  const searchParams = useSearchParams()
  const router = useRouter()
  const pathname = usePathname()
  const [, startTransition] = useTransition()

  const q = searchParams.get('q')?.toLowerCase().trim() ?? ''
  const categoriaActual = searchParams.get('categoria') ?? ''
  const orden = (searchParams.get('orden') as OrdenKey) ?? 'relevancia'

  // Categorías únicas
  const categorias = useMemo(
    () => [...new Set(productos.map((p) => p.categoria))].sort(),
    [productos]
  )

  // Conteo por categoría (sobre todos los productos, sin filtro de búsqueda)
  const counts = useMemo(
    () =>
      Object.fromEntries(
        categorias.map((cat) => [cat, productos.filter((p) => p.categoria === cat && p.activo).length])
      ),
    [categorias, productos]
  )

  // Filtrar
  const filtrados = useMemo(() => {
    let lista = productos.filter((p) => p.activo)

    if (categoriaActual) {
      lista = lista.filter((p) => p.categoria === categoriaActual)
    }

    if (q) {
      lista = lista.filter(
        (p) =>
          p.nombre.toLowerCase().includes(q) ||
          (p.descripcion ?? '').toLowerCase().includes(q) ||
          p.categoria.toLowerCase().includes(q)
      )
    }

    // Ordenar
    switch (orden) {
      case 'precio_asc':
        lista = [...lista].sort((a, b) => a.precio - b.precio)
        break
      case 'precio_desc':
        lista = [...lista].sort((a, b) => b.precio - a.precio)
        break
      case 'nombre':
        lista = [...lista].sort((a, b) => a.nombre.localeCompare(b.nombre, 'es'))
        break
      default:
        // relevancia: destacados primero
        lista = [...lista].sort((a, b) => Number(b.destacado) - Number(a.destacado))
    }

    return lista
  }, [productos, categoriaActual, q, orden])

  function setOrden(value: OrdenKey) {
    const params = new URLSearchParams(searchParams.toString())
    if (value === 'relevancia') {
      params.delete('orden')
    } else {
      params.set('orden', value)
    }
    const qs = params.toString()
    startTransition(() => {
      router.push(qs ? `${pathname}?${qs}` : pathname)
    })
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Barra de búsqueda + selector de orden */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="flex-1">
          <SearchBar />
        </div>
        <div className="shrink-0">
          <select
            value={orden}
            onChange={(e) => setOrden(e.target.value as OrdenKey)}
            className="w-full sm:w-auto rounded-xl border border-gray-200 bg-white text-gray-700 px-3 py-3 text-sm font-medium shadow-sm focus:outline-none focus:ring-2 focus:ring-lime-500 cursor-pointer"
          >
            {ORDEN_OPCIONES.map((op) => (
              <option key={op.value} value={op.value}>{op.label}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Filtros de categoría */}
      <CategoryFilter categorias={categorias} counts={counts} />

      {/* Grid de productos */}
      <ProductGrid productos={filtrados} total={productos.filter((p) => p.activo).length} />
    </div>
  )
}
