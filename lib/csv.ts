export type ParsedCSV = {
  headers: string[]
  rows: Record<string, string>[]
}

/**
 * Parsea texto CSV con soporte básico de campos entre comillas.
 * Normaliza los headers a minúsculas para comparación case-insensitive.
 *
 * Para agregar soporte Excel en el futuro:
 *   1. npm install xlsx
 *   2. Agregar parseXLSX(buffer: ArrayBuffer): ParsedCSV aquí
 *   3. En ImportarForm.tsx detectar extensión y usar el parser adecuado
 */
export function parseCSV(text: string): ParsedCSV {
  const lines = text.trim().split(/\r?\n/)
  if (lines.length < 2) return { headers: [], rows: [] }

  const headers = splitCSVLine(lines[0]).map((h) => h.trim().toLowerCase())

  const rows = lines
    .slice(1)
    .filter((l) => l.trim())
    .map((line) => {
      const values = splitCSVLine(line)
      const row: Record<string, string> = {}
      headers.forEach((h, i) => {
        row[h] = values[i]?.trim() ?? ''
      })
      return row
    })

  return { headers, rows }
}

/**
 * Divide una línea CSV en valores, respetando campos entre comillas.
 * Soporta: comillas dobles escapadas ("") dentro de campos.
 */
function splitCSVLine(line: string): string[] {
  const result: string[] = []
  let current = ''
  let inQuotes = false

  for (let i = 0; i < line.length; i++) {
    const ch = line[i]
    if (ch === '"') {
      if (inQuotes && line[i + 1] === '"') {
        current += '"'
        i++
      } else {
        inQuotes = !inQuotes
      }
    } else if (ch === ',' && !inQuotes) {
      result.push(current)
      current = ''
    } else {
      current += ch
    }
  }
  result.push(current)
  return result
}
