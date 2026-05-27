import ImportarForm from '@/components/admin/ImportarForm'

export const metadata = { title: 'Importar productos' }

export default function ImportarProductosPage() {
  return (
    <div className="flex flex-col gap-6 max-w-3xl">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Importar productos</h1>
        <p className="text-sm text-gray-500">Cargá múltiples productos desde un archivo CSV</p>
      </div>
      <ImportarForm />
    </div>
  )
}

  ─────────────────────────────────────────────
  Cuando se implemente, esta página deberá:
  1. Mostrar un dropzone para arrastrar o seleccionar un archivo .csv / .xlsx
  2. Parsear las columnas: nombre, precio, categoria, descripcion, imagen_url, stock, destacado, activo
  3. Mostrar una tabla de previsualización antes de confirmar
  4. Llamar POST /api/productos en lote (o un endpoint dedicado /api/productos/bulk)
  5. Mostrar resultado: X creados, Y errores con detalle
*/

export default function ImportarProductosPage() {
  return (
    <div className="flex flex-col gap-6 max-w-2xl">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Importar productos</h1>
        <p className="text-sm text-gray-500">Cargá múltiples productos desde un archivo CSV o Excel</p>
      </div>

      {/* Dropzone placeholder */}
      <div className="flex flex-col items-center justify-center gap-4 rounded-2xl border-2 border-dashed border-gray-200 bg-white px-8 py-16 text-center">
        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-gray-100 text-gray-400">
          <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
              d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
          </svg>
        </div>
        <div>
          <p className="font-semibold text-gray-700">Importación desde CSV / Excel</p>
          <p className="mt-1 text-sm text-gray-400">Esta funcionalidad estará disponible próximamente</p>
        </div>
        <div className="mt-2 rounded-lg bg-gray-50 px-4 py-3 text-left text-xs text-gray-500 w-full max-w-sm">
          <p className="font-semibold mb-1">Columnas esperadas:</p>
          <code className="block text-gray-600">
            nombre, precio, categoria, descripcion,<br />
            imagen_url, stock, destacado, activo
          </code>
        </div>
      </div>

      <Link
        href="/admin/productos"
        className="self-start text-sm text-gray-500 hover:text-gray-700 transition-colors"
      >
        ← Volver a productos
      </Link>
    </div>
  )
}
