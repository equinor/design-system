import { useCallback, useEffect, useRef, useState } from 'react'

// Single looping background-music controller for the whole app.
//
//   - `started` — has the user kicked playback off yet? Browsers block
//     autoplay until a user gesture, so the StartGate's button calls
//     `start()` inside its click handler. Until then the gate is shown.
//   - `muted`  — the mute toggle in the audio control. Persisted.
//   - `volume` — 0..1, driven by the audio slider. Persisted.
//
// One <audio> element lives for the life of the app, created once and
// reused; the state only adjusts its `volume` / `muted` / play state.

// Served from public/audio. BASE_URL keeps the path correct if the app is
// ever deployed under a sub-path (defaults to '/').
const SRC = `${import.meta.env.BASE_URL}audio/token_factory_bgm.mp3`
const DEFAULT_VOLUME = 0.35
const VOLUME_KEY = 'tf-audio-volume'
const MUTED_KEY = 'tf-audio-muted'

function readStoredVolume(): number {
  if (typeof window === 'undefined') return DEFAULT_VOLUME
  const raw = window.localStorage.getItem(VOLUME_KEY)
  const n = raw === null ? NaN : Number(raw)
  return Number.isFinite(n) && n >= 0 && n <= 1 ? n : DEFAULT_VOLUME
}

function readStoredMuted(): boolean {
  if (typeof window === 'undefined') return false
  return window.localStorage.getItem(MUTED_KEY) === 'true'
}

export function useBackgroundMusic() {
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const [started, setStarted] = useState(false)
  const [muted, setMuted] = useState(readStoredMuted)
  const [volume, setVolumeState] = useState(readStoredVolume)

  // Create the single looping element once. The starting volume/muted are
  // read from the captured initial state — later changes flow through the
  // sync effects below.
  useEffect(() => {
    const audio = new Audio(SRC)
    audio.loop = true
    audio.preload = 'auto'
    audio.volume = volume
    audio.muted = muted
    audioRef.current = audio
    return () => {
      audio.pause()
      audioRef.current = null
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Keep the element in sync with the controls.
  useEffect(() => {
    if (audioRef.current) audioRef.current.volume = volume
  }, [volume])

  useEffect(() => {
    if (audioRef.current) audioRef.current.muted = muted
  }, [muted])

  // Kick playback off — must run inside a user gesture so autoplay
  // policies allow the first play(). Muted playback is always permitted.
  const start = useCallback(() => {
    setStarted(true)
    const audio = audioRef.current
    if (audio) void audio.play().catch(() => {})
  }, [])

  const setVolume = useCallback((next: number) => {
    const clamped = Math.min(1, Math.max(0, next))
    setVolumeState(clamped)
    window.localStorage.setItem(VOLUME_KEY, String(clamped))
  }, [])

  const toggleMute = useCallback(() => {
    setMuted((prev) => {
      const next = !prev
      window.localStorage.setItem(MUTED_KEY, String(next))
      return next
    })
  }, [])

  return { started, muted, volume, start, setVolume, toggleMute }
}
