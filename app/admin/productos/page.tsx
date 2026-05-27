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
        <div className="flex items-center gap-2">
          {/*
            SLOT: importación CSV/Excel.
            Cuando se implemente, esta página en /admin/productos/importar
            procesará el archivo y creará productos en lote.
          */}
          <Link
            href="/admin/productos/importar"
            className="inline-flex items-center gap-1.5 rounded-lg border border-dashed border-gray-300 px-3 py-2 text-sm text-gray-400 hover:border-gray-400 hover:text-gray-600 transition-colors"
            title="Próximamente: importar productos desde CSV o Excel"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3V10" />
            </svg>
            Importar
          </Link>
          <Link
            href="/admin/productos/nuevo"
            className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700 transition-colors"
          >
            + Nuevo
          </Link>
        </div>
      </div>

      <ProductTable productos={productos} />
    </div>
  )
}

