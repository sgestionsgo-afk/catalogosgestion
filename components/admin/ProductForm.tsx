'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import type { Producto, ProductoInsert } from '@/lib/supabase/types'
import Input from '@/components/ui/Input'
import Button from '@/components/ui/Button'

type Props = {
  producto?: Producto
}

const CATEGORIAS_SUGERIDAS = [
  'Sistemas',
  'Software',
  'Hardware',
  'Servicios',
  'Accesorios',
  'Otros',
]

export default function ProductForm({ producto }: Props) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [error, setError] = useState<string | null>(null)

  const [form, setForm] = useState<ProductoInsert>({
    nombre: producto?.nombre ?? '',
    descripcion: producto?.descripcion ?? '',
    precio: producto?.precio ?? 0,
    categoria: producto?.categoria ?? '',
    imagen_url: producto?.imagen_url ?? '',
    stock: producto?.stock ?? null,
    destacado: producto?.destacado ?? false,
    activo: producto?.activo ?? true,
  })

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) {
    const { name, value, type } = e.target
    setForm((prev) => ({
      ...prev,
      [name]:
        type === 'checkbox'
          ? (e.target as HTMLInputElement).checked
          : name === 'precio'
          ? parseFloat(value) || 0
          : name === 'stock'
          ? value === '' ? null : parseInt(value, 10)
          : value,
    }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)

    startTransition(async () => {
      try {
        const url = producto ? `/api/productos/${producto.id}` : '/api/productos'
        const method = producto ? 'PUT' : 'POST'

        const res = await fetch(url, {
          method,
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(form),
        })

        if (!res.ok) {
          const data = await res.json()
          setError(data.error ?? 'Error al guardar')
          return
        }

        router.push('/admin/productos')
        router.refresh()
      } catch {
        setError('Error de conexión')
      }
    })
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5 max-w-2xl">
      {error && (
        <div className="rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      <Input
        id="nombre"
        name="nombre"
        label="Nombre *"
        value={form.nombre}
        onChange={handleChange}
        required
        placeholder="Nombre del producto"
      />

      <div className="flex flex-col gap-1">
        <label htmlFor="descripcion" className="text-sm font-medium text-gray-700">
          Descripción
        </label>
        <textarea
          id="descripcion"
          name="descripcion"
          value={form.descripcion ?? ''}
          onChange={handleChange}
          rows={3}
          placeholder="Descripción corta del producto"
          className="rounded-lg border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <Input
          id="precio"
          name="precio"
          label="Precio *"
          type="number"
          min="0"
          step="0.01"
          value={form.precio}
          onChange={handleChange}
          required
        />

        <Input
          id="stock"
          name="stock"
          label="Stock (opcional)"
          type="number"
          min="0"
          value={form.stock ?? ''}
          onChange={handleChange}
          placeholder="Sin límite"
        />
      </div>

      <div className="flex flex-col gap-1">
        <label htmlFor="categoria" className="text-sm font-medium text-gray-700">
          Categoría *
        </label>
        <div className="flex gap-2">
          <input
            id="categoria"
            name="categoria"
            list="categorias-list"
            value={form.categoria}
            onChange={handleChange}
            required
            placeholder="Seleccionar o escribir"
            className="flex-1 rounded-lg border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <datalist id="categorias-list">
            {CATEGORIAS_SUGERIDAS.map((c) => (
              <option key={c} value={c} />
            ))}
          </datalist>
        </div>
      </div>

      <Input
        id="imagen_url"
        name="imagen_url"
        label="URL de imagen"
        type="url"
        value={form.imagen_url ?? ''}
        onChange={handleChange}
        placeholder="https://ejemplo.com/imagen.jpg"
      />

      {form.imagen_url && (
        <div className="relative h-32 w-32 overflow-hidden rounded-lg border border-gray-200">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={form.imagen_url}
            alt="Vista previa"
            className="h-full w-full object-cover"
            onError={(e) => { (e.target as HTMLImageElement).style.display = 'none' }}
          />
        </div>
      )}

      <div className="flex gap-6">
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            name="destacado"
            checked={form.destacado}
            onChange={handleChange}
            className="h-4 w-4 rounded border-gray-300 accent-blue-600"
          />
          <span className="text-sm font-medium text-gray-700">Destacado</span>
        </label>

        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            name="activo"
            checked={form.activo}
            onChange={handleChange}
            className="h-4 w-4 rounded border-gray-300 accent-blue-600"
          />
          <span className="text-sm font-medium text-gray-700">Activo (visible)</span>
        </label>
      </div>

      <div className="flex gap-3 pt-2">
        <Button type="submit" loading={isPending}>
          {producto ? 'Guardar cambios' : 'Crear producto'}
        </Button>
        <Button
          type="button"
          variant="secondary"
          onClick={() => router.back()}
          disabled={isPending}
        >
          Cancelar
        </Button>
      </div>
    </form>
  )
}
