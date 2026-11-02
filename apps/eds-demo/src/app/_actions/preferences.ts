'use server'

import { cookies } from 'next/headers'
import {
  COLOR_SCHEME_COOKIE,
  DENSITY_COOKIE,
  toColorScheme,
  toDensity,
} from '../_lib/preferences'

const ONE_YEAR = 60 * 60 * 24 * 365

export async function saveColorScheme(value: string) {
  ;(await cookies()).set(COLOR_SCHEME_COOKIE, toColorScheme(value), {
    maxAge: ONE_YEAR,
  })
}

export async function saveDensity(value: string) {
  ;(await cookies()).set(DENSITY_COOKIE, toDensity(value), {
    maxAge: ONE_YEAR,
  })
}
