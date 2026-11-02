import type { Metadata } from 'next'
import { Dashboard } from '../_components/Dashboard'
import styles from './tokens.module.css'

export const metadata: Metadata = {
  title: 'Exercise: EDS beta tokens demo',
}

export default function Page() {
  return <Dashboard styles={styles} />
}
