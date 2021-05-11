import { useState, useEffect } from 'react'

export const useMockProgress = (value: number = null): number => {
  const [progress, setProgress] = useState(value)
  useEffect(() => {
    const timer = setInterval(() => {
      setProgress((oldProgress) => {
        if (oldProgress === null) return null
        if (oldProgress === 100) {
          return 100
        }
        const diff = Math.random() * 10
        return Math.min(oldProgress + diff, 100)
      })
    }, 500)

    return () => {
      clearInterval(timer)
    }
  }, [])
  return progress
}
