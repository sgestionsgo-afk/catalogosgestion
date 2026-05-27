import Link from 'next/link'
import { getProductosAdmin } from '@/services/productos'
import ProductTable from '@/components/admin/ProductTable'

export const metadata = { title: 'Productos' }

export default async function AdminProductosPage() {
  const productos = await getProductosAdmin()

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Productos</h1>
          <p className="text-sm text-gray-500">{productos.length} en total</p>
        </div>
        <Link
          href="/admin/productos/nuevo"
          className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700 transition-colors"
        >
          + Nuevo
        </Link>
      </div>

      <ProductTable productos={productos} />
    </div>
  )
}
