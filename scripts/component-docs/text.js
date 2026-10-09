const stripQuotes = (s) => s.replace(/^['"]|['"]$/g, '')

// "InlineWithText" becomes "Inline with text".
const humanise = (name) => {
  const words = name.replace(/([a-z0-9])([A-Z])/g, '$1 $2').toLowerCase()
  return words.charAt(0).toUpperCase() + words.slice(1)
}

// Removes blank lines at both ends and the indentation shared by every line.
const dedent = (text) => {
  const lines = text.split('\n')
  while (lines.length && !lines[0].trim()) lines.shift()
  while (lines.length && !lines[lines.length - 1].trim()) lines.pop()
  const indent = Math.min(
    ...lines.filter((l) => l.trim()).map((l) => l.match(/^ */)[0].length),
  )
  return lines.map((l) => l.slice(indent)).join('\n')
}

module.exports = { stripQuotes, humanise, dedent }
