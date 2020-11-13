import { useEffect, useState } from 'react'

export function useKeyPress(
  targetKey: number,
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  onPressDown = () => {},
): boolean {
  const [keyPressed, setKeyPressed] = useState(false)

  function downHandler({ key }) {
    if (key === targetKey) {
      setKeyPressed(true)
      onPressDown()
    }
  }
  function upHandler({ key }) {
    if (key === targetKey) {
      setKeyPressed(false)
    }
  }

  useEffect(() => {
    window.addEventListener('keydown', downHandler)
    window.addEventListener('keyup', upHandler)

    return () => {
      window.removeEventListener('keydown', downHandler)
      window.removeEventListener('keyup', upHandler)
    }
  }, [])

  return keyPressed
}
