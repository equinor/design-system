import { existsSync, rmSync, readFileSync } from 'node:fs'
import { rm, readdir, mkdir, writeFile, readFile } from 'node:fs/promises'
import path from 'node:path'

export type TokenConfig = {
  figmaProjectFoundationId?: string
  figmaProjectStaticId?: string
  figmaProjectDynamicId?: string
  schemeTokensPrefix?: string
  variablePrefix?: string
  buildPath?: string
  /** Color scheme configuration mapping semantic names to different palettes per mode */
  colorSchemeConfig?: Record<string, { Light: string; Dark: string }>
  /** Mappings for concept placeholders like {bg-floating} -> per-mode refs */
  conceptColorGroups?: Record<
    string,
    | string
    | {
        Light?: string
        Dark?: string
      }
  >
}

export function loadTokenConfig(): TokenConfig {
  const cfgPath = path.resolve('token-config.json')
  try {
    if (existsSync(cfgPath)) {
      return JSON.parse(readFileSync(cfgPath, 'utf8')) as TokenConfig
    }
  } catch (e) {
    console.warn('Warning: failed to read token-config.json:', e)
  }
  return {}
}

export function cleanBuildDir() {
  const dir = path.resolve('build')
  try {
    rmSync(dir, { recursive: true, force: true })
    console.log(`Removed ${dir}`)
  } catch (e) {
    console.warn(`Failed to remove ${dir}:`, e)
  }
}

export function sanitizeSubdir(p?: string) {
  return String(p || '')
    .replace(/^\/*/, '')
    .replace(/\/*$/, '')
}

export function extractRootInner(css: string): string {
  const match = css.match(/:root\s*\{([\s\S]*?)\}/)
  return match ? match[1].trim() : ''
}

export function indentLines(s: string) {
  return s
    .split(/\r?\n/)
    .map((l) => `  ${l.trimStart()}`)
    .join('\n')
}

// Shared helpers used across build scripts
export async function cleanBuildOutputsForSubdir(sub: string) {
  const safe = sanitizeSubdir(sub)
  const cssDir = path.resolve('build/css', safe)
  const jsonDir = path.resolve('build/json', safe)
  const jsDir = path.resolve('build/js', safe)
  await Promise.allSettled([
    rm(cssDir, { recursive: true, force: true }),
    rm(jsonDir, { recursive: true, force: true }),
    rm(jsDir, { recursive: true, force: true }),
  ])
}

export function slugifyAppearance(name: string) {
  return name.trim().toLowerCase()
}

export async function discoverAppearanceFiles(tokensDir: string) {
  const entries = await readdir(tokensDir, { withFileTypes: true })
  return entries
    .filter((e) => e.isFile())
    .map((e) => e.name)
    .filter((n) => n.startsWith('🎨 Appearance.') && n.endsWith('.json'))
    .map((n) => ({ name: n, abs: path.join(tokensDir, n) }))
}

// ---------------------- Shared token helpers ----------------------

export const DEFAULT_EXTENSIONS = {
  'com.figma': {
    hiddenFromPublishing: false,
    scopes: ['ALL_SCOPES'] as string[],
    codeSyntax: {} as Record<string, unknown>,
  },
}

export async function writeJson(filePath: string, data: unknown) {
  await mkdir(path.dirname(filePath), { recursive: true })
  const json = JSON.stringify(data, null, 2) + '\n'
  await writeFile(filePath, json, 'utf8')
}

export async function readJson<T = unknown>(filePath: string): Promise<T> {
  const s = await readFile(filePath, 'utf8')
  return JSON.parse(s) as T
}

export function isObject(v: unknown): v is Record<string, unknown> {
  return !!v && typeof v === 'object' && !Array.isArray(v)
}

// Generic CSS var names used by dynamic appearances do not include intent (accent, info, ...)
// They are scoped via selectors, so names are constant (bg-*, border-*, text-*)
export function varName(
  prefix: string,
  area: 'bg' | 'border' | 'text',
  slot: string,
): string {
  return `var(--${prefix}-color-${area}-${slot})`
}

export function buildToken($value: string, $description = '', webVar?: string) {
  return {
    $type: 'color',
    $value,
    $description,
    $extensions: {
      ...DEFAULT_EXTENSIONS,
      'com.figma': {
        ...DEFAULT_EXTENSIONS['com.figma'],
        codeSyntax: webVar ? { WEB: webVar } : {},
      },
    },
  }
}

export async function validatePaletteFamilies(
  foundationProjectId: string,
  mapping: Record<string, string>,
  scriptTag: string,
) {
  try {
    const lightPalettePath = path.join(
      'tokens',
      foundationProjectId,
      'Color Light.Mode 1.json',
    )
    const light = await readJson<Record<string, unknown>>(lightPalettePath)
    const lightData = light?.Light as Record<string, unknown> | undefined
    const families = new Set(Object.keys(lightData || {}))
    for (const [semantic, palette] of Object.entries(mapping)) {
      if (!families.has(String(palette))) {
        console.warn(
          `[${scriptTag}] Warning: Palette family '${palette}' (mapped from semantic '${semantic}') was not found in Light palette.`,
        )
      }
    }
  } catch (e) {
    console.warn(
      `[${scriptTag}] Warning: Failed to validate palette families against Light palette:`,
      (e as Error)?.message || e,
    )
  }
}
