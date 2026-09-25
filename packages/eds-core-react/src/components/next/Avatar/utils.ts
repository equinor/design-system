export function deriveInitials(name: string): string {
  const words = name.trim().split(/\s+/)
  if (!words[0]) return ''
  if (words.length === 1) return words[0][0].toUpperCase()
  return (words[0][0] + words[words.length - 1][0]).toUpperCase()
}
