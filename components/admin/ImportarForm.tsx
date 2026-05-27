'use client'

import { useState, useRef } from 'react'
import Link from 'next/link'
import { parseCSV } from '@/lib/csv'
import type { ProductoInsert } from '@/lib/supabase/types'

type ValidatedRow = {
  rowIndex: number
  raw: Record<string, string>
  data?: ProductoInsert
  error?: string
}

type Step = 'idle' | 'preview' | 'importing' | 'done'

const COLUMNAS_REQUERIDAS = ['nombre', 'precio', 'categoria']
const COLUMNAS_EJEMPLO = 'nombre,precio,categoria,descripcion,stock,imagen_url,destacado,activo'

function validateRow(raw: Record<string, string>, index: number): ValidatedRow {
  const nombre = raw.nombre?.trim()
  const precioRaw = raw.precio?.trim()
  const categoria = raw.categoria?.trim()

  if (!nombre) return { raw, rowIndex: index, error: 'Falta nombre' }
  if (nombre.length < 2) return { raw, rowIndex: index, error: 'Nombre muy corto' }
  if (!categoria) return { raw, rowIndex: index, error: 'Falta categoría' }
  if (!precioRaw) return { raw, rowIndex: index, error: 'Falta precio' }

  const precio = parseFloat(precioRaw)
  if (isNaN(precio) || precio <= 0) return { raw, rowIndex: index, error: 'Precio inválido' }

  const stockRaw = raw.stock?.trim()
  const stock = stockRaw ? parseInt(stockRaw, 10) : null
  const destacado = raw.destacado?.toLowerCase() === 'true' || raw.destacado?.trim() === '1'
  const activoRaw = raw.activo?.trim()
  const activo =
    !activoRaw || activoRaw === ''
      ? true
      : activoRaw.toLowerCase() !== 'false' && activoRaw !== '0'

  return {
    raw,
    rowIndex: index,
    data: {
      nombre,
      precio,
      categoria,
      descripcion: raw.descripcion?.trim() || null,
      stock: stock !== null && !isNaN(stock) ? stock : null,
      imagen_url: raw.imagen_url?.trim() || null,
      destacado,
      activo,
    },
  }
}

export default function ImportarForm() {
  const [step, setStep] = useState<Step>('idle')
  const [rows, setRows] = useState<ValidatedRow[]>([])
  const [fileName, setFileName] = useState('')
  const [importResult, setImportResult] = useState<{ created: number } | null>(null)
  const [error, setError] = useState<string | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  function reset() {
    setStep('idle')
    setRows([])
    setFileName('')
    setError(null)
    setImportResult(null)
    if (inputRef.current) inputRef.current.value = ''
  }

  function handleFile(file: File) {
    if (!file.name.endsWith('.csv')) {
      setError('Solo se aceptan archivos .csv')
      return
    }
    setError(null)
    setFileName(file.name)

    const reader = new FileReader()
    reader.onload = (e) => {
      const text = e.target?.result as string
      const { headers, rows: rawRows } = parseCSV(text)

      const missing = COLUMNAS_REQUERIDAS.filter((c) => !headers.includes(c))
      if (missing.length > 0) {
        setError(`Columnas requeridas no encontradas: ${missing.join(', ')}`)
        return
      }
      if (rawRows.length === 0) {
        setError('El archivo no tiene filas de datos.')
        return
      }

      const validated = rawRows.map((raw, i) => validateRow(raw, i + 2))
      setRows(validated)
      setStep('preview')
    }
    reader.onerror = () => setError('No se pudo leer el archivo.')
    reader.readAsText(file, 'UTF-8')
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault()
    const file = e.dataTransfer.files[0]
    if (file) handleFile(file)
  }

  async function handleImport() {
    const validRows = rows.filter((r) => r.data).map((r) => r.data!)
    if (validRows.length === 0) return

    setStep('importing')
    setError(null)

    try {
      const res = await fetch('/api/productos/bulk', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ rows: validRows }),
      })
      const data = await res.json()
      if (!res.ok) {
        setError(data.error ?? 'Error al importar')
        setStep('preview')
        return
      }
      setImportResult({ created: data.created })
      setStep('done')
    } catch {
      setError('Error de conexión')
      setStep('preview')
    }
  }

  const validCount = rows.filter((r) => r.data).length
  const errorCount = rows.filter((r) => r.error).length

  /* ── DONE ── */
  if (step === 'done') {
    return (
      <div className="flex flex-col items-center gap-6 py-12 text-center">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-green-100 text-green-600">
          <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <div>
          <p className="text-xl font-bold text-gray-900">
            {importResult?.created} producto{importResult?.created !== 1 ? 's' : ''} importado{importResult?.created !== 1 ? 's' : ''}
          </p>
          <p className="mt-1 text-sm text-gray-500">El catálogo fue actualizado correctamente.</p>
        </div>
        <div className="flex gap-3">
          <Link
            href="/admin/productos"
            className="rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-blue-700 transition-colors"
          >
            Ver productos
          </Link>
          <button
            onClick={reset}
            className="rounded-lg border border-gray-200 px-5 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
          >
            Importar otro archivo
          </button>
        </div>
      </div>
    )
  }

  /* ── IDLE ── */
  if (step === 'idle') {
    return (
      <div className="flex flex-col gap-5">
        <div
          onDrop={handleDrop}
          onDragOver={(e) => e.preventDefault()}
          onClick={() => inputRef.current?.click()}
          className="flex cursor-pointer flex-col items-center justify-center gap-4 rounded-2xl border-2 border-dashed border-gray-200 bg-white px-8 py-14 text-center hover:border-blue-400 hover:bg-blue-50/30 transition-colors"
        >
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-gray-100 text-gray-400">
            <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
            </svg>
          </div>
          <div>
            <p className="font-semibold text-gray-700">Arrastrá un archivo CSV o hacé click para seleccionarlo</p>
            <p className="mt-1 text-sm text-gray-400">Solo archivos .csv · Máx. 500 filas</p>
          </div>
          <input
            ref={inputRef}
            type="file"
            accept=".csv"
            className="hidden"
            onChange={(e) => { const f = e.target.files?.[0]; if (f) handleFile(f) }}
          />
        </div>

        {error && (
          <p className="rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">{error}</p>
        )}

        <div className="rounded-xl border border-gray-100 bg-gray-50 p-4">
          <p className="text-xs font-semibold uppercase tracking-wide text-gray-400 mb-2">
            Formato esperado — primera fila son los encabezados
          </p>
          <code className="block text-xs text-gray-600 overflow-x-auto whitespace-nowrap">{COLUMNAS_EJEMPLO}</code>
          <ul className="mt-3 flex flex-col gap-1 text-xs text-gray-500">
            <li><span className="font-semibold text-gray-700">nombre, precio, categoria</span> — obligatorios</li>
            <li><span className="font-semibold text-gray-700">descripcion, stock, imagen_url</span> — opcionales (dejar vacío si no aplica)</li>
            <li><span className="font-semibold text-gray-700">destacado, activo</span> — true/false · omitir = false y true respectivamente</li>
          </ul>
        </div>
      </div>
    )
  }

  /* ── PREVIEW / IMPORTING ── */
  return (
    <div className="flex flex-col gap-5">
      {/* Cabecera */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3 flex-wrap">
          <span className="text-sm text-gray-500 font-medium">{fileName}</span>
          <span className="rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-semibold text-green-700">
            {validCount} válida{validCount !== 1 ? 's' : ''}
          </span>
          {errorCount > 0 && (
            <span className="rounded-full bg-red-100 px-2.5 py-0.5 text-xs font-semibold text-red-700">
              {errorCount} con error
            </span>
          )}
        </div>
        <button
          onClick={reset}
          className="text-xs text-gray-400 hover:text-gray-600 transition-colors"
        >
          Cambiar archivo
        </button>
      </div>

      {error && (
        <p className="rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">{error}</p>
      )}

      {/* Tabla preview */}
      <div className="overflow-x-auto rounded-xl border border-gray-100">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 text-left text-xs uppercase tracking-wide text-gray-500">
            <tr>
              <th className="px-3 py-2 w-10">#</th>
              <th className="px-3 py-2">Nombre</th>
              <th className="px-3 py-2">Precio</th>
              <th className="px-3 py-2">Categoría</th>
              <th className="px-3 py-2 hidden sm:table-cell">Stock</th>
              <th className="px-3 py-2">Estado</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {rows.map((row) => (
              <tr key={row.rowIndex} className={row.error ? 'bg-red-50' : 'bg-white'}>
                <td className="px-3 py-2 text-gray-400 text-xs">{row.rowIndex}</td>
                <td className="px-3 py-2 font-medium text-gray-900 max-w-40 truncate">
                  {row.raw.nombre || <span className="italic text-red-400">vacío</span>}
                </td>
                <td className="px-3 py-2 text-gray-600 whitespace-nowrap">{row.raw.precio || '—'}</td>
                <td className="px-3 py-2 text-gray-600">{row.raw.categoria || '—'}</td>
                <td className="px-3 py-2 text-gray-600 hidden sm:table-cell">{row.raw.stock || '—'}</td>
                <td className="px-3 py-2">
                  {row.error ? (
                    <span className="text-xs font-medium text-red-600">{row.error}</span>
                  ) : (
                    <span className="text-xs font-medium text-green-600">✓ OK</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Acciones */}
      <div className="flex gap-3">
        <button
          onClick={handleImport}
          disabled={validCount === 0 || step === 'importing'}
          className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-50 transition-colors"
        >
          {step === 'importing' && (
            <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
          )}
          {step === 'importing'
            ? 'Importando...'
            : `Importar ${validCount} producto${validCount !== 1 ? 's' : ''}`}
        </button>
        <Link
          href="/admin/productos"
          className="rounded-lg border border-gray-200 px-5 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
        >
          Cancelar
        </Link>
      </div>
    </div>
  )
}
