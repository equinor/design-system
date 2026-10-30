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
      className="max-w-[420px] rounded border p-7"
      style={
        {
          backgroundColor: c['background.surface'],
          borderColor: c['border.non-interactive.neutral.muted'],
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
          border-radius: var(--eds-density-corner-radius-rounded);
          padding: 8px 10px;
          font-size: var(--eds-density-typography-ui-md-font-size);
          color: var(--_text);
          /* The focus state below draws a 2px focus border instead */
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
          border-radius: var(--eds-density-corner-radius-rounded);
          padding: 10px;
          font-size: var(--eds-density-typography-ui-md-font-size);
          font-weight: var(--eds-font-weight-bolder);
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
        className="mb-1 text-lg font-medium"
        style={{ color: c['text.primary'] }}
      >
        Sign in
      </div>
      <div className="mb-6 text-base" style={{ color: c['text.secondary'] }}>
        Enter your credentials to continue
      </div>

      <label
        htmlFor={`${uid}-email`}
        className="mb-1 block text-sm font-medium"
        style={{ color: c['text.primary'] }}
      >
        Email
      </label>
      <input
        id={`${uid}-email`}
        type="email"
        placeholder="name@example.com"
        className="mb-4"
      />

      <label
        htmlFor={`${uid}-password`}
        className="mb-1 block text-sm font-medium"
        style={{ color: c['text.primary'] }}
      >
        Password
      </label>
      <input
        id={`${uid}-password`}
        type="password"
        defaultValue="password"
        className="mb-2"
      />

      <div
        data-link=""
        className="mb-5 text-sm underline"
        style={{ color: c['text.interactive.link.default'] }}
      >
        Forgot password?
      </div>

      <button data-btn="" type="button">
        Sign in
      </button>
    </div>
  )
}
