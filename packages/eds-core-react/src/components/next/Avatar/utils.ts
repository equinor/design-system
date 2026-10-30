import { createContext } from 'react'

// False inside AvatarNameLabel, which announces the notification itself, after
// the name, so the avatar inside it stays quiet.
export const AnnounceNotificationContext = createContext(true)

// Array.from splits by code point, so a name starting with an emoji or another
// character outside the BMP keeps the whole character.
const firstChar = (word: string) => Array.from(word)[0]

export function deriveInitials(name: string): string {
  const words = name.trim().split(/\s+/)
  if (!words[0]) return ''
  if (words.length === 1) return firstChar(words[0]).toUpperCase()
  return (
    firstChar(words[0]) + firstChar(words[words.length - 1])
  ).toUpperCase()
}
