'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import type { Producto } from '@/lib/supabase/types'
import { formatPrecio } from '@/lib/utils'
import Badge from '@/components/ui/Badge'
import Button from '@/components/ui/Button'

type Props = {
  productos: Producto[]
}

export default function ProductTable({ productos }: Props) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [deletingId, setDeletingId] = useState<string | null>(null)

  async function handleDelete(id: string, nombre: string) {
    if (!confirm(`¿Eliminar "${nombre}"? Esta acción no se puede deshacer.`)) return

    setDeletingId(id)
    startTransition(async () => {
      try {
        await fetch(`/api/productos/${id}`, { method: 'DELETE' })
        router.refresh()
      } finally {
        setDeletingId(null)
      }
    })
  }

  if (productos.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-gray-200 py-16 text-center text-gray-400">
        <p>No hay productos. <Link href="/admin/productos/nuevo" className="text-blue-600 hover:underline">Crear el primero</Link></p>
      </div>
    )
  }

  return (
    <div className="overflow-x-auto rounded-xl border border-gray-100">
      <table className="w-full text-sm">
        <thead className="bg-gray-50 text-left text-xs uppercase tracking-wide text-gray-500">
          <tr>
            <th className="px-4 py-3">Producto</th>
            <th className="px-4 py-3 hidden sm:table-cell">Categoría</th>
            <th className="px-4 py-3">Precio</th>
            <th className="px-4 py-3 hidden md:table-cell">Stock</th>
            <th className="px-4 py-3 hidden md:table-cell">Estado</th>
            <th className="px-4 py-3 text-right">Acciones</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-50">
          {productos.map((p) => (
            <tr key={p.id} className="bg-white hover:bg-gray-50 transition-colors">
              <td className="px-4 py-3">
                <div className="flex items-center gap-3">
                  <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-lg bg-gray-100">
                    {p.imagen_url ? (
                      <Image src={p.imagen_url} alt={p.nombre} fill sizes="40px" className="object-cover" />
                    ) : (
                      <span className="flex h-full items-center justify-center text-gray-300 text-xs">?</span>
                    )}
                  </div>
                  <div>
                    <p className="font-medium text-gray-900 line-clamp-1">{p.nombre}</p>
                    {p.destacado && <Badge variant="destacado" className="mt-0.5">Destacado</Badge>}
                  </div>
                </div>
              </td>
              <td className="px-4 py-3 hidden sm:table-cell text-gray-500">{p.categoria}</td>
              <td className="px-4 py-3 font-semibold text-blue-600 whitespace-nowrap">{formatPrecio(p.precio)}</td>
              <td className="px-4 py-3 hidden md:table-cell text-gray-500">
                {p.stock === null ? '—' : p.stock === 0 ? <span className="text-red-500">Sin stock</span> : p.stock}
              </td>
              <td className="px-4 py-3 hidden md:table-cell">
                <Badge variant={p.activo ? 'activo' : 'inactivo'}>
                  {p.activo ? 'Activo' : 'Inactivo'}
                </Badge>
              </td>
              <td className="px-4 py-3">
                <div className="flex items-center justify-end gap-2">
                  <Link href={`/admin/productos/${p.id}`}>
                    <Button variant="ghost" size="sm">Editar</Button>
                  </Link>
                  <Button
                    variant="danger"
                    size="sm"
                    loading={deletingId === p.id && isPending}
                    onClick={() => handleDelete(p.id, p.nombre)}
                  >
                    Eliminar
                  </Button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
