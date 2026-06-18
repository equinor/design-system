import './startGate.css'

// Title-card gate shown before the story begins. Its button is the first
// user gesture, which lets `onStart` kick off the looping background music
// (browsers block autoplay until then). Dismissed by Story once playback
// has started. The audio note reflects the current mute preference so a
// muted visitor knows the audio control (top-left) is in charge.

type Props = {
  onStart: () => void
  muted: boolean
}

export function StartGate({ onStart, muted }: Props) {
  return (
    <div className="start-gate">
      <h1 className="start-gate-title">
        Token
        <br />
        Factory
      </h1>
      <p className="start-gate-sub">
        a short story about how a design token travels from Figma to the
        components your team ships
      </p>
      {/* autoFocus so the keyboard-first driver can hit space/enter to begin */}
      <button type="button" className="start-gate-btn" onClick={onStart}>
        Press start
      </button>
      <p className="start-gate-note">
        {muted ? 'music off' : '♪ music on'} · audio control top-left
      </p>
    </div>
  )
}
