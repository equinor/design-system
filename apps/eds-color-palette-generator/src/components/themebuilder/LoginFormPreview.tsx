'use client'

import { useId } from 'react'
import type { SemanticColors } from '@/utils/semanticTokens'

type LoginFormPreviewProps = {
  colors: SemanticColors
}

/**
 * Wired to Tokens Studio semantic tokens:
 *   card   → background.surface + border.non-interactive.neutral.muted
 *   input  → background.input
 *            + border.interactive.neutral.muted.{default,hover},
 *            focus border.interactive.focus
 *   text   → text.primary / text.secondary
 *   link   → text.interactive.link.default
 *   button → background.interactive.accent.emphasis.{default,hover,pressed}
 *            + text.on-emphasis.accent
 */
export function LoginFormPreview({ colors: c }: LoginFormPreviewProps) {
  const uid = useId().replace(/:/g, '')

  return (
    <div
      data-lf={uid}
      style={
        {
          backgroundColor: c['background.surface'],
          borderRadius: '8px',
          padding: '28px',
          border: `1px solid ${c['border.non-interactive.neutral.muted']}`,
          maxWidth: '420px',
          '--_bg-input': c['background.input'],
          '--_border': c['border.interactive.neutral.muted.default'],
          '--_border-hover': c['border.interactive.neutral.muted.hover'],
          '--_border-focus': c['border.interactive.focus'],
          '--_text': c['text.primary'],
          '--_placeholder': c['text.secondary'],
          '--_btn-bg': c['background.interactive.accent.emphasis.default'],
          '--_btn-hover': c['background.interactive.accent.emphasis.hover'],
          '--_btn-pressed': c['background.interactive.accent.emphasis.pressed'],
          '--_btn-text': c['text.on-emphasis.accent'],
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
          color: c['text.primary'],
          marginBottom: '4px',
        }}
      >
        Sign in
      </div>
      <div
        style={{
          fontSize: '13px',
          color: c['text.secondary'],
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
          color: c['text.primary'],
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
          color: c['text.primary'],
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
          color: c['text.interactive.link.default'],
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
