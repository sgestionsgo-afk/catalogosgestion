'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import type { Producto, ProductoInsert } from '@/lib/supabase/types'
import Button from '@/components/ui/Button'
import ImageSearchPanel from './ImageSearchPanel'

type Props = { producto?: Producto }

type FieldErrors = Partial<Record<keyof ProductoInsert, string>>

const CATEGORIAS = ['Sistemas', 'Software', 'Hardware', 'Servicios', 'Accesorios', 'Otros']
const DESC_MAX = 300

function validate(form: ProductoInsert): FieldErrors {
  const e: FieldErrors = {}
  if (!form.nombre.trim()) e.nombre = 'El nombre es obligatorio'
  else if (form.nombre.trim().length < 3) e.nombre = 'Mínimo 3 caracteres'
  if (!form.precio || form.precio <= 0) e.precio = 'Ingresá un precio mayor a 0'
  if (!form.categoria.trim()) e.categoria = 'Seleccioná una categoría'
  if ((form.descripcion?.length ?? 0) > DESC_MAX) e.descripcion = `Máximo ${DESC_MAX} caracteres`
  return e
}

export default function ProductForm({ producto }: Props) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [serverError, setServerError] = useState<string | null>(null)
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({})
  const [imageLoadError, setImageLoadError] = useState(false)
  const [showImageSearch, setShowImageSearch] = useState(false)

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

  function setField<K extends keyof ProductoInsert>(key: K, value: ProductoInsert[K]) {
    setForm((prev) => ({ ...prev, [key]: value }))
    if (fieldErrors[key]) setFieldErrors((prev) => ({ ...prev, [key]: undefined }))
  }

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    const { name, value, type } = e.target
    if (type === 'checkbox') {
      setField(name as keyof ProductoInsert, (e.target as HTMLInputElement).checked as any)
    } else if (name === 'precio') {
      setField('precio', parseFloat(value) || 0)
    } else if (name === 'stock') {
      setField('stock', value === '' ? null : parseInt(value, 10))
    } else {
      setField(name as keyof ProductoInsert, value as any)
    }
  }

  function submitForm(andAnother = false) {
    const errors = validate(form)
    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors)
      return
    }
    setServerError(null)
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
          setServerError(data.error ?? 'Error al guardar')
          return
        }
        if (andAnother) {
          setForm({
            nombre: '',
            descripcion: '',
            precio: 0,
            categoria: form.categoria,
            imagen_url: '',
            stock: null,
            destacado: false,
            activo: true,
          })
          setImageLoadError(false)
          setFieldErrors({})
          window.scrollTo({ top: 0, behavior: 'smooth' })
        } else {
          router.push('/admin/productos')
          router.refresh()
        }
      } catch {
        setServerError('Error de conexión')
      }
    })
  }

  const descLen = form.descripcion?.length ?? 0
  const imageUrl = form.imagen_url?.trim() ?? ''
  const hasImage = imageUrl.length > 0

  return (
    <form
      onSubmit={(e) => { e.preventDefault(); submitForm() }}
      className="flex flex-col gap-5 max-w-2xl"
    >
      {serverError && (
        <div className="rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
          {serverError}
        </div>
      )}

      {/* ── DATOS BÁSICOS ── */}
      <section className="rounded-xl border border-gray-100 bg-white p-5 flex flex-col gap-4">
        <h2 className="text-xs font-semibold uppercase tracking-wide text-gray-400">Datos básicos</h2>

        <div className="flex flex-col gap-1">
          <label htmlFor="nombre" className="text-sm font-medium text-gray-700">
            Nombre <span className="text-red-400">*</span>
          </label>
          <input
            id="nombre"
            name="nombre"
            value={form.nombre}
            onChange={handleChange}
            placeholder="Ej: Notebook Dell Latitude 5440"
            className={`rounded-lg border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              fieldErrors.nombre ? 'border-red-400' : 'border-gray-200'
            }`}
          />
          {fieldErrors.nombre && <p className="text-xs text-red-500">{fieldErrors.nombre}</p>}
        </div>

        <div className="flex flex-col gap-1">
          <div className="flex items-center justify-between">
            <label htmlFor="descripcion" className="text-sm font-medium text-gray-700">Descripción</label>
            <span className={`text-xs ${descLen > DESC_MAX ? 'text-red-500' : 'text-gray-400'}`}>
              {descLen}/{DESC_MAX}
            </span>
          </div>
          <textarea
            id="descripcion"
            name="descripcion"
            value={form.descripcion ?? ''}
            onChange={handleChange}
            rows={3}
            placeholder="Descripción corta visible en el catálogo"
            className={`rounded-lg border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none ${
              fieldErrors.descripcion ? 'border-red-400' : 'border-gray-200'
            }`}
          />
          {fieldErrors.descripcion && <p className="text-xs text-red-500">{fieldErrors.descripcion}</p>}
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium text-gray-700">
            Categoría <span className="text-red-400">*</span>
          </label>
          <div className="flex flex-wrap gap-2">
            {CATEGORIAS.map((c) => (
              <button
                key={c}
                type="button"
                onClick={() => setField('categoria', c)}
                className={`rounded-full px-3 py-1 text-xs font-medium border transition-colors ${
                  form.categoria === c
                    ? 'bg-blue-600 text-white border-blue-600'
                    : 'bg-white text-gray-600 border-gray-200 hover:border-blue-400'
                }`}
              >
                {c}
              </button>
            ))}
          </div>
          <input
            name="categoria"
            value={form.categoria}
            onChange={handleChange}
            placeholder="O escribí una categoría personalizada"
            className={`rounded-lg border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              fieldErrors.categoria ? 'border-red-400' : 'border-gray-200'
            }`}
          />
          {fieldErrors.categoria && <p className="text-xs text-red-500">{fieldErrors.categoria}</p>}
        </div>
      </section>

      {/* ── PRECIO Y STOCK ── */}
      <section className="rounded-xl border border-gray-100 bg-white p-5 flex flex-col gap-4">
        <h2 className="text-xs font-semibold uppercase tracking-wide text-gray-400">Precio y stock</h2>
        <div className="grid grid-cols-2 gap-4">
          <div className="flex flex-col gap-1">
            <label htmlFor="precio" className="text-sm font-medium text-gray-700">
              Precio <span className="text-red-400">*</span>
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-gray-400">$</span>
              <input
                id="precio"
                name="precio"
                type="number"
                min="0"
                step="0.01"
                value={form.precio || ''}
                onChange={handleChange}
                placeholder="0"
                className={`w-full rounded-lg border pl-7 pr-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  fieldErrors.precio ? 'border-red-400' : 'border-gray-200'
                }`}
              />
            </div>
            {fieldErrors.precio && <p className="text-xs text-red-500">{fieldErrors.precio}</p>}
          </div>

          <div className="flex flex-col gap-1">
            <label htmlFor="stock" className="text-sm font-medium text-gray-700">
              Stock <span className="text-xs font-normal text-gray-400">(opcional)</span>
            </label>
            <input
              id="stock"
              name="stock"
              type="number"
              min="0"
              value={form.stock ?? ''}
              onChange={handleChange}
              placeholder="Sin límite"
              className="rounded-lg border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
      </section>

      {/* ── IMAGEN ── */}
      <section className="rounded-xl border border-gray-100 bg-white p-5 flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xs font-semibold uppercase tracking-wide text-gray-400">Imagen</h2>
          <button
            type="button"
            onClick={() => setShowImageSearch((v) => !v)}
            className={`flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs font-medium transition-colors ${
              showImageSearch
                ? 'border-blue-500 bg-blue-50 text-blue-700'
                : 'border-gray-200 text-gray-600 hover:border-blue-400 hover:text-blue-600'
            }`}
          >
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            Buscar imagen en la web
          </button>
        </div>
          {showImageSearch && (
            <ImageSearchPanel
              initialQuery={form.nombre}
              onSelect={(url) => {
                setField('imagen_url', url)
                setImageLoadError(false)
              }}
              onClose={() => setShowImageSearch(false)}
            />
          )}
        <div className="flex gap-4 items-start">
          {/* Preview */}
          <div className="relative h-28 w-28 shrink-0 overflow-hidden rounded-xl border border-gray-200 bg-gray-50 flex items-center justify-center">
            {hasImage && !imageLoadError ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={imageUrl}
                alt="Vista previa"
                className="h-full w-full object-cover"
                onError={() => setImageLoadError(true)}
                onLoad={() => setImageLoadError(false)}
              />
            ) : (
              <div className="flex flex-col items-center gap-1 text-gray-300">
                <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1}
                    d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                {imageLoadError && <span className="text-xs text-red-400">URL inválida</span>}
              </div>
            )}
          </div>

          <div className="flex-1 flex flex-col gap-1">
            <label htmlFor="imagen_url" className="text-sm font-medium text-gray-700">URL de imagen</label>
            <input
              id="imagen_url"
              name="imagen_url"
              value={form.imagen_url ?? ''}
              onChange={(e) => {
                setImageLoadError(false)
                setField('imagen_url', e.target.value)
              }}
              placeholder="https://ejemplo.com/imagen.jpg"
              className="rounded-lg border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <p className="text-xs text-gray-400">Pegá la URL directamente. La vista previa se actualiza al instante.</p>
            {hasImage && !imageLoadError && (
              <button
                type="button"
                onClick={() => { setField('imagen_url', ''); setImageLoadError(false) }}
                className="self-start text-xs text-red-400 hover:text-red-600 transition-colors"
              >
                × Quitar imagen
              </button>
            )}
          </div>
        </div>
      </section>

      {/* ── CONFIGURACIÓN ── */}
      <section className="rounded-xl border border-gray-100 bg-white p-5">
        <h2 className="mb-3 text-xs font-semibold uppercase tracking-wide text-gray-400">Configuración</h2>
        <div className="flex gap-6">
          <label className="flex items-center gap-2 cursor-pointer select-none">
            <input
              type="checkbox"
              name="destacado"
              checked={form.destacado}
              onChange={handleChange}
              className="h-4 w-4 rounded border-gray-300 accent-blue-600"
            />
            <span className="text-sm font-medium text-gray-700">Destacado</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer select-none">
            <input
              type="checkbox"
              name="activo"
              checked={form.activo}
              onChange={handleChange}
              className="h-4 w-4 rounded border-gray-300 accent-blue-600"
            />
            <span className="text-sm font-medium text-gray-700">Activo (visible en catálogo)</span>
          </label>
        </div>
      </section>

      {/* ── ACCIONES ── */}
      <div className="flex flex-wrap gap-3 pt-1">
        <Button type="submit" loading={isPending}>
          {producto ? 'Guardar cambios' : 'Crear producto'}
        </Button>
        {!producto && (
          <Button
            type="button"
            variant="secondary"
            disabled={isPending}
            onClick={() => submitForm(true)}
          >
            Guardar y crear otro
          </Button>
        )}
        <Button
          type="button"
          variant="ghost"
          onClick={() => router.back()}
          disabled={isPending}
        >
          Cancelar
        </Button>
      </div>
    </form>
  )
}


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
