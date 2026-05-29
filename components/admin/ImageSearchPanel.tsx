'use client'

import { useState } from 'react'

type Props = {
  initialQuery?: string
  onSelect: (url: string) => void
  onClose: () => void
}

export default function ImageSearchPanel({ initialQuery = '', onSelect, onClose }: Props) {
  const [url, setUrl] = useState('')
  const [previewOk, setPreviewOk] = useState<boolean | null>(null)

  const googleImagesUrl = `https://www.google.com/search?tbm=isch&q=${encodeURIComponent(initialQuery || 'producto')}`

  function handleUse() {
    const trimmed = url.trim()
    if (!trimmed) return
    onSelect(trimmed)
    onClose()
  }

  return (
    <div className="rounded-xl border border-blue-100 bg-blue-50/60 p-4 flex flex-col gap-3">
      {/* Header */}
      <div className="flex items-center justify-between">
        <span className="text-sm font-semibold text-blue-800">Agregar imagen desde la web</span>
        <button
          type="button"
          onClick={onClose}
          aria-label="Cerrar"
          className="text-blue-400 hover:text-blue-700 transition-colors text-xl leading-none"
        >
          ×
        </button>
      </div>

      {/* Instrucciones */}
      <div className="rounded-lg bg-white border border-blue-100 px-3 py-2.5 text-xs text-gray-600 leading-relaxed">
        <p className="font-medium text-gray-700 mb-1">Cómo encontrar la foto exacta del producto:</p>
        <ol className="list-decimal list-inside space-y-0.5">
          <li>Abrí Google Imágenes con el botón de abajo</li>
          <li>Encontrá la foto que querés</li>
          <li>Click derecho → <span className="font-medium">Copiar dirección de la imagen</span></li>
          <li>Pegala en el campo de abajo</li>
        </ol>
      </div>

      {/* Botón abrir Google Imágenes */}
      <a
        href={googleImagesUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center justify-center gap-2 rounded-lg bg-white border border-blue-300 px-4 py-2 text-sm font-medium text-blue-700 hover:bg-blue-50 transition-colors"
      >
        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
            d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
        </svg>
        Buscar &ldquo;{initialQuery || 'producto'}&rdquo; en Google Imágenes
      </a>

      {/* Input URL */}
      <div className="flex gap-2">
        <input
          value={url}
          onChange={(e) => { setUrl(e.target.value); setPreviewOk(null) }}
          onKeyDown={(e) => e.key === 'Enter' && handleUse()}
          placeholder="Pegá aquí la URL de la imagen (https://...)"
          className="flex-1 rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          type="button"
          onClick={handleUse}
          disabled={!url.trim()}
          className="inline-flex items-center gap-1.5 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-40 transition-colors"
        >
          Usar
        </button>
      </div>

      {/* Preview */}
      {url.trim() && (
        <div className="flex flex-col items-center gap-1">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={url.trim()}
            alt="Vista previa"
            onLoad={() => setPreviewOk(true)}
            onError={() => setPreviewOk(false)}
            className="max-h-40 max-w-full rounded-lg border border-gray-200 object-contain bg-gray-50"
          />
          {previewOk === false && (
            <p className="text-xs text-red-500">No se puede cargar esa URL. Verificá que sea una imagen directa.</p>
          )}
          {previewOk === true && (
            <p className="text-xs text-green-600">✓ Imagen válida</p>
          )}
        </div>
      )}
    </div>
  )
}

