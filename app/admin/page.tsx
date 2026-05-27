import Link from 'next/link'
import { getProductosAdmin } from '@/services/productos'

export const metadata = { title: 'Dashboard' }

export default async function AdminDashboard() {
  const productos = await getProductosAdmin()

  const total = productos.length
  const activos = productos.filter((p) => p.activo).length
  const destacados = productos.filter((p) => p.destacado).length
  const sinStock = productos.filter((p) => p.stock === 0).length

  const stats = [
    { label: 'Total productos', value: total, color: 'text-blue-600' },
    { label: 'Activos', value: activos, color: 'text-green-600' },
    { label: 'Destacados', value: destacados, color: 'text-amber-600' },
    { label: 'Sin stock', value: sinStock, color: 'text-red-500' },
  ]

  return (
    <div className="flex flex-col gap-8">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <Link
          href="/admin/productos/nuevo"
          className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700 transition-colors"
        >
          + Nuevo producto
        </Link>
      </div>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        {stats.map((s) => (
          <div key={s.label} className="rounded-xl bg-white border border-gray-100 p-5">
            <p className="text-sm text-gray-500">{s.label}</p>
            <p className={`mt-1 text-3xl font-bold ${s.color}`}>{s.value}</p>
          </div>
        ))}
      </div>

      <div className="flex flex-col gap-3">
        <h2 className="text-lg font-semibold text-gray-900">Accesos rápidos</h2>
        <div className="grid gap-3 sm:grid-cols-2">
          <Link
            href="/admin/productos"
            className="flex items-center gap-3 rounded-xl bg-white border border-gray-100 p-5 hover:border-blue-200 transition-colors"
          >
            <span className="text-2xl">📦</span>
            <div>
              <p className="font-semibold text-gray-900">Gestionar productos</p>
              <p className="text-sm text-gray-500">Crear, editar y eliminar</p>
            </div>
          </Link>
          <Link
            href="/admin/productos/nuevo"
            className="flex items-center gap-3 rounded-xl bg-white border border-gray-100 p-5 hover:border-blue-200 transition-colors"
          >
            <span className="text-2xl">➕</span>
            <div>
              <p className="font-semibold text-gray-900">Nuevo producto</p>
              <p className="text-sm text-gray-500">Agregar al catálogo</p>
            </div>
          </Link>
        </div>
      </div>
    </div>
  )
}
