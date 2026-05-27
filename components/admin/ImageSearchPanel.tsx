'use client'

import { useState } from 'react'

type ImageResult = {
  url: string
  thumbnail: string
  title: string
}

type Props = {
  initialQuery?: string
  onSelect: (url: string) => void
  onClose: () => void
}

export default function ImageSearchPanel({ initialQuery = '', onSelect, onClose }: Props) {
  const [query, setQuery] = useState(initialQuery)
  const [results, setResults] = useState<ImageResult[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [searched, setSearched] = useState(false)

  async function handleSearch(e: React.FormEvent) {
    e.preventDefault()
    if (!query.trim()) return
    setLoading(true)
    setError(null)
    try {
      const res = await fetch(`/api/imagenes?q=${encodeURIComponent(query.trim())}`)
      const data = await res.json()
      if (!res.ok) {
        setError(data.error ?? 'Error al buscar imágenes')
        return
      }
      setResults(data.items ?? [])
      setSearched(true)
    } catch {
      setError('Error de conexión')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="rounded-xl border border-blue-100 bg-blue-50/60 p-4 flex flex-col gap-3">
      {/* Header */}
      <div className="flex items-center justify-between">
        <span className="text-sm font-semibold text-blue-800">Buscar imagen en la web</span>
        <button
          type="button"
          onClick={onClose}
          aria-label="Cerrar búsqueda"
          className="text-blue-400 hover:text-blue-700 transition-colors text-xl leading-none"
        >
          ×
        </button>
      </div>

      {/* Buscador */}
      <form onSubmit={handleSearch} className="flex gap-2">
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Ej: notebook dell latitude 5440"
          className="flex-1 rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          type="submit"
          disabled={loading || !query.trim()}
          className="inline-flex items-center gap-1.5 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50 transition-colors"
        >
          {loading ? (
            <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
          ) : (
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          )}
          Buscar
        </button>
      </form>

      {/* Error */}
      {error && (
        <p className="text-xs text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
          {error}
        </p>
      )}

      {/* Sin resultados */}
      {searched && !loading && results.length === 0 && !error && (
        <p className="text-sm text-gray-500 text-center py-4">No se encontraron imágenes.</p>
      )}

      {/* Resultados */}
      {results.length > 0 && (
        <div className="flex flex-col gap-2">
          <p className="text-xs text-gray-500">
            Hacé click en una imagen para usarla como imagen del producto.
          </p>
          <div className="grid grid-cols-3 gap-2">
            {results.map((img, i) => (
              <button
                key={i}
                type="button"
                onClick={() => { onSelect(img.url); onClose() }}
                title={img.title}
                className="group relative aspect-square overflow-hidden rounded-lg border-2 border-transparent hover:border-blue-500 bg-gray-100 transition-all"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={img.thumbnail}
                  alt={img.title}
                  className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-200"
                  onError={(e) => {
                    (e.target as HTMLImageElement).parentElement!.style.opacity = '0.3'
                  }}
                />
                <div className="absolute inset-0 bg-blue-600/0 group-hover:bg-blue-600/10 transition-colors" />
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
