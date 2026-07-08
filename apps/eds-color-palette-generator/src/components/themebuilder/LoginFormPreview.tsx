'use client'

import { useId } from 'react'

type LoginFormPreviewProps = {
  neutral: string[]
  accent: string[]
}

/**
 * Figma semantic → primitive mapping:
 *
 *   background/container/card/default             → neutral[14] (card fill, Gray/15 = white)
 *   background/surface/default/default  = Gray/1  → neutral[0]  (input bg)
 *   border/default                      = Gray/4  → neutral[3]  (input border default)
 *   border/hover                        = Gray/7  → neutral[6]  (input border hover)
 *   border/strong                       = Gray/9  → neutral[8]  (input border focus)
 *
 *   border/accent/default               = Accent/8 → accent[7]  (focus ring)
 *
 *   background/surface/accent/default/default = Accent/11 → accent[10] (button)
 *   background/surface/accent/default/hover   = Accent/12 → accent[11] (button hover)
 *   background/surface/accent/default/pressed = Accent/13 → accent[12] (button pressed)
 *
 *   text/primary                                 → neutral[11] (labels, Gray/12)
 *   text/subtle                                  → neutral[8]  (placeholder, Gray/9)
 *   text/link                                    → accent[12]  (link text)
 *   text/on-emphasis                             → accent[14]  (button text, L=1.00 = white)
 */
export function LoginFormPreview({ neutral, accent }: LoginFormPreviewProps) {
  const uid = useId().replace(/:/g, '')

  return (
    <div
      data-lf={uid}
      style={
        {
          backgroundColor: neutral[14],
          borderRadius: '8px',
          padding: '28px',
          border: `1px solid ${neutral[3]}`,
          maxWidth: '420px',
          '--_bg-input': neutral[0],
          '--_border': neutral[3],
          '--_border-hover': neutral[6],
          '--_border-focus': neutral[8],
          '--_focus-ring': accent[7],
          '--_text': neutral[11],
          '--_placeholder': neutral[8],
          '--_btn-bg': accent[10],
          '--_btn-hover': accent[11],
          '--_btn-pressed': accent[12],
          '--_btn-text': accent[14],
        } as React.CSSProperties
      }
    >
      <style>{`
        [data-lf="${uid}"] input {
          font-family: inherit;
          width: 100%;
          box-sizing: border-box;
          background: var(--_bg-input);
          border: 1px solid var(--_border);
          border-radius: 4px;
          padding: 8px 10px;
          font-size: 13px;
          color: var(--_text);
          outline: none;
          transition: border-color 100ms;
        }
        [data-lf="${uid}"] input::placeholder {
          color: var(--_placeholder);
        }
        [data-lf="${uid}"] input:hover {
          border-color: var(--_border-hover);
        }
        [data-lf="${uid}"] input:focus {
          border: 2px solid var(--_border-focus);
          padding: 7px 9px;
          box-shadow: 0 0 0 1px var(--_focus-ring);
        }
        [data-lf="${uid}"] [data-btn] {
          cursor: pointer;
          border: none;
          width: 100%;
          background: var(--_btn-bg);
          color: var(--_btn-text);
          border-radius: 4px;
          padding: 10px;
          font-size: 13px;
          font-weight: 600;
          font-family: inherit;
          text-align: center;
          transition: background-color 100ms;
        }
        [data-lf="${uid}"] [data-btn]:hover {
          background: var(--_btn-hover);
        }
        [data-lf="${uid}"] [data-btn]:active {
          background: var(--_btn-pressed);
        }
        [data-lf="${uid}"] [data-link] {
          cursor: pointer;
        }
        [data-lf="${uid}"] [data-link]:hover {
          opacity: 0.8;
        }
      `}</style>

      <div
        style={{
          fontSize: '18px',
          fontWeight: 700,
          color: neutral[11],
          marginBottom: '4px',
        }}
      >
        Sign in
      </div>
      <div
        style={{
          fontSize: '13px',
          color: neutral[11],
          marginBottom: '24px',
        }}
      >
        Enter your credentials to continue
      </div>

      <label
        style={{
          display: 'block',
          fontSize: '12px',
          fontWeight: 500,
          color: neutral[11],
          marginBottom: '4px',
        }}
      >
        Email
      </label>
      <input
        type="email"
        placeholder="name@example.com"
        style={{ marginBottom: '16px' }}
      />

      <label
        style={{
          display: 'block',
          fontSize: '12px',
          fontWeight: 500,
          color: neutral[11],
          marginBottom: '4px',
        }}
      >
        Password
      </label>
      <input
        type="password"
        defaultValue="password"
        style={{ marginBottom: '8px' }}
      />

      <div
        data-link=""
        style={{
          fontSize: '12px',
          color: accent[12],
          marginBottom: '20px',
          textDecoration: 'underline',
        }}
      >
        Forgot password?
      </div>

      <button data-btn="" type="button">
        Sign in
      </button>
    </div>
  )
}
