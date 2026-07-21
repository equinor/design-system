'use client'

import { useId } from 'react'
import type { SemanticColors } from '@/config/semanticColors'

type LoginFormPreviewProps = {
  colors: SemanticColors
}

/**
 * Wired to canonical EDS semantic tokens (Figma Color Map):
 *   card       → bg-neutral-surface + border-neutral-subtle
 *   input      → bg-neutral-canvas + border-neutral-{subtle,medium}, focus border-focus
 *   text       → text-neutral-{strong,subtle}
 *   link       → text-link
 *   button     → bg-accent-fill-emphasis-{default,hover,active} + text-accent-strong-on-emphasis
 */
export function LoginFormPreview({ colors: c }: LoginFormPreviewProps) {
  const uid = useId().replace(/:/g, '')

  return (
    <div
      data-lf={uid}
      style={
        {
          backgroundColor: c['bg-neutral-surface'],
          borderRadius: '8px',
          padding: '28px',
          border: `1px solid ${c['border-neutral-subtle']}`,
          maxWidth: '420px',
          '--_bg-input': c['bg-neutral-canvas'],
          '--_border': c['border-neutral-subtle'],
          '--_border-hover': c['border-neutral-medium'],
          '--_border-focus': c['border-focus'],
          '--_text': c['text-neutral-strong'],
          '--_placeholder': c['text-neutral-subtle'],
          '--_btn-bg': c['bg-accent-fill-emphasis-default'],
          '--_btn-hover': c['bg-accent-fill-emphasis-hover'],
          '--_btn-pressed': c['bg-accent-fill-emphasis-active'],
          '--_btn-text': c['text-accent-strong-on-emphasis'],
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
          color: c['text-neutral-strong'],
          marginBottom: '4px',
        }}
      >
        Sign in
      </div>
      <div
        style={{
          fontSize: '13px',
          color: c['text-neutral-subtle'],
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
          color: c['text-neutral-strong'],
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
          color: c['text-neutral-strong'],
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
          color: c['text-link'],
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
