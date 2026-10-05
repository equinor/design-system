/** True when a link target leaves the site (absolute http/https URL). */
export const isExternal = (to: string): boolean => /^https?:\/\//.test(to)
