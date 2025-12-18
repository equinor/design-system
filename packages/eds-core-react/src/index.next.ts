/**
 * EDS 2.0 Beta Components
 *
 * These components are experimental and under active development.
 * Breaking changes may occur between beta releases.
 *
 * Install: npm install @equinor/eds-core-react@beta
 *
 * CSS is auto-injected. For SSR or manual control, import separately:
 * import '@equinor/eds-core-react/next/index.css'
 *
 * @packageDocumentation
 */
'use client'

// Import global CSS for next components (auto-injected)
import './components/next/index.css'

// Re-export all next components
export * from './components/next'
