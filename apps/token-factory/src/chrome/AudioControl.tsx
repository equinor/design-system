import { useState } from 'react'
import './audioControl.css'

// Always-present audio control, pinned to the top-left corner above every
// scene + the lane-map modal. The speaker button is always visible; clicking
// it reveals a volume slider with a mute toggle beside it.

type Props = {
  muted: boolean
  volume: number
  onToggleMute: () => void
  onVolumeChange: (volume: number) => void
}

// Pixel-art speaker. `silent` draws a red mute slash instead of sound waves.
function SpeakerIcon({ silent }: { silent: boolean }) {
  return (
    <svg
      viewBox="0 0 16 16"
      width="16"
      height="16"
      shapeRendering="crispEdges"
      aria-hidden="true"
    >
      {/* speaker box + cone */}
      <rect x="2" y="6" width="3" height="4" fill="currentColor" />
      <rect x="5" y="5" width="1" height="6" fill="currentColor" />
      <rect x="6" y="4" width="1" height="8" fill="currentColor" />
      {silent ? (
        // mute slash (top-left → bottom-right)
        <>
          <rect x="9" y="5" width="1" height="1" fill="var(--pico-red)" />
          <rect x="10" y="6" width="1" height="1" fill="var(--pico-red)" />
          <rect x="11" y="7" width="1" height="1" fill="var(--pico-red)" />
          <rect x="12" y="8" width="1" height="1" fill="var(--pico-red)" />
          <rect x="13" y="9" width="1" height="1" fill="var(--pico-red)" />
        </>
      ) : (
        // sound waves
        <>
          <rect x="9" y="6" width="1" height="4" fill="currentColor" />
          <rect x="11" y="4" width="1" height="8" fill="currentColor" />
        </>
      )}
    </svg>
  )
}

export function AudioControl({
  muted,
  volume,
  onToggleMute,
  onVolumeChange,
}: Props) {
  const [open, setOpen] = useState(false)
  const silent = muted || volume === 0

  return (
    // Stop keys from leaking to Story's window-level handler — otherwise
    // arrowing the slider would also advance scenes and space would skip.
    <div className="audio-control" onKeyDown={(e) => e.stopPropagation()}>
      <button
        type="button"
        className="audio-control-trigger"
        data-on={!silent || undefined}
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        aria-label="Audio settings"
        title="Audio"
      >
        <SpeakerIcon silent={silent} />
      </button>

      {open && (
        <div
          className="audio-control-panel"
          role="group"
          aria-label="Audio controls"
        >
          <input
            type="range"
            className="audio-slider"
            min={0}
            max={100}
            step={1}
            value={Math.round(volume * 100)}
            onChange={(e) => onVolumeChange(Number(e.target.value) / 100)}
            aria-label="Music volume"
          />
          <button
            type="button"
            className="audio-mute"
            data-muted={muted || undefined}
            onClick={onToggleMute}
            aria-pressed={muted}
            aria-label={muted ? 'Unmute music' : 'Mute music'}
            title={muted ? 'Unmute' : 'Mute'}
          >
            <SpeakerIcon silent={muted} />
          </button>
        </div>
      )}
    </div>
  )
}
