export const toPascalCase = (value: string) =>
  value
    .replace(/[-_ ]+/g, ' ')
    .split(' ')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ')

export const toTitleCase = (value?: string) => {
  if (!value) return ''
  return value
    .replace(/[-_]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
    .split(' ')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ')
}

export function splitArray<T>(array: T[], chunkSize: number): T[][] {
  const result: T[][] = []
  for (let i = 0; i < array.length; i += chunkSize) {
    result.push(array.slice(i, i + chunkSize))
  }
  return result
}

export function generateInitials(name: string): string {
  const names = name.split(' ')
  return names
    .map((n) => n.charAt(0))
    .join('')
    .toUpperCase()
}

export const abbreviatedNumber = (val: number) => {
  let s = ['', 'k', 'm', 'b', 't']
  if (val === 0) return 0
  let sNum = Math.floor(Math.log10(val) / 3)
  let sVal = parseFloat((sNum != 0 ? val / Math.pow(1000, sNum) : val).toPrecision(2))
  if (sVal % 1 != 0) {
    sVal = Number.parseInt(sVal.toFixed(1))
  }
  return sVal + s[sNum]
}

export function getColor(v: string, a: number = 1): string {
  if (typeof window === 'undefined' || typeof document === 'undefined') {
    return ''
  }
  const val = getComputedStyle(document.documentElement).getPropertyValue(`--theme-${v}`).trim()

  return v.includes('-rgb') ? `rgba(${val}, ${a})` : val
}

export const formatBytes = (bytes: number, decimals: number = 2) => {
  if (bytes === 0) return '0 Bytes'
  const k = 1024
  const dm = decimals < 0 ? 0 : decimals
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i]
}

export function icon(name: string) {
  return `<iconify-icon icon="tabler:${name}" width="16" height="16"></iconify-icon>`
}
