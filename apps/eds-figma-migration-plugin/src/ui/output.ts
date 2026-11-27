/**
 * Getting text out of the plugin window. The window is an iframe without
 * clipboard permission in some Figma clients, and downloads from it are not
 * documented for the desktop app, so both have a fallback.
 */

/** Copies text, first with the Clipboard API, then with a selected textarea. */
export async function copyText(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text)
    return true
  } catch {
    const area = document.createElement('textarea')
    area.value = text
    area.setAttribute('readonly', '')
    area.style.position = 'fixed'
    area.style.opacity = '0'
    document.body.appendChild(area)
    area.select()
    // execCommand is deprecated, but it is the only copy that works in an
    // iframe where the Clipboard API is blocked.
    const copied = document.execCommand('copy')
    area.remove()
    return copied
  }
}

/** Starts a download of a text file. Returns false when the browser refuses. */
export function downloadText(
  fileName: string,
  text: string,
  type = 'application/json',
): boolean {
  try {
    const url = URL.createObjectURL(new Blob([text], { type }))
    const link = document.createElement('a')
    link.href = url
    link.download = fileName
    document.body.appendChild(link)
    link.click()
    link.remove()
    setTimeout(() => URL.revokeObjectURL(url), 1000)
    return true
  } catch {
    return false
  }
}
