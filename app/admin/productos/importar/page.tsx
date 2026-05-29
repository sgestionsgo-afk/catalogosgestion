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
