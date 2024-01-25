/*
  {
    id: The key for this language
    title: The title as it will be labeled in Sanity studio
    iso: Iso version of the language, used by Next.js localisation and react-intl
    name: Name as used in the Sanity localisation feature (this one is hard to explain :sweat_smile:)
    locale: The actual locale name as used by Next.js and locale folders/structure ([site]/locale)
  }
*/
const languages = [
  {
    id: 'english',
    title: 'English (UK)',
    iso: 'en-GB',
    name: 'en_GB',
    locale: 'en',
  },
  {
    id: 'norwegian',
    title: 'Norwegian',
    iso: 'nb-NO',
    name: 'nb_NO',
    locale: 'no',
  },
  {
    id: 'portuguese',
    title: 'Portuguese (BR)',
    iso: 'pt-BR',
    name: 'pt_BR',
    locale: 'pt',
  },
  { id: 'german', title: 'German', iso: 'de-DE', name: 'de_DE', locale: 'de' },
  {
    id: 'spanish-ar',
    title: 'Spanish',
    iso: 'es-AR',
    name: 'es_AR',
    locale: 'es',
  },
  { id: 'polish', title: 'Polish', iso: 'pl-PL', name: 'pl_PL', locale: 'pl' },
  {
    id: 'japanese',
    title: 'Japanese',
    iso: 'ja-JP',
    name: 'ja_JP',
    locale: 'ja',
  },
  { id: 'korean', title: 'Korean', iso: 'ko-KR', name: 'ko_KR', locale: 'ko' },
  { id: 'welsh', title: 'Welsh', iso: 'cy-CY', name: 'cy_CY', locale: 'cy' },
]

/**
 * @type {Record<string, string>}
 */
export const newsSlug = {
  en_GB: 'news',
  nb_NO: 'nyheter',
  pt_BR: 'noticias',
  pl_PL: 'aktualnosci',
  de_DE: 'aktuelles',
  ja_JP: 'news',
  ko_KR: 'news',
  cy_CY: 'newyddion',
}

/**
 * @type {Record<string, string>}
 */
export const magazineSlug = {
  en_GB: 'magazine',
  nb_NO: 'magasin',
}

/*
  The first language will be set as the default language. The default language is used as
  1. The main language in Sanity studio for translations (base language)
  Example:
    norway: ['norwegian', 'english']
  Norwegian will be the default language for the dataset norway.

  In Sanity Norwegian will be the base language and English a translation of that
  In Next.js, the Norwegian version will be available as [site]/no and [site] where Next.js will
  redirect /no to /
  */
const datasets = {
  // The  equinor.com dataset
  global: ['english', 'norwegian'],
  secret: ['english', 'norwegian'],
  // Satellite pages
  brazil: ['portuguese'],
  germany: ['german'],
  argentina: ['english', 'spanish-ar'],
  poland: ['polish'],
  japan: ['english', 'japanese'],
  storage: ['english', 'german'],
  techstars: ['english'],
  equinorfunds: ['norwegian'],
  southkorea: ['english', 'korean'],
  celticsea: ['english', 'welsh'],
  sheringham: ['english'],
  dudgeon: ['english'],
  // Test datasets
  'global-development': ['english', 'norwegian', 'japanese'],
  'global-test': ['english', 'norwegian', 'japanese'],
}

/**
 * The default language to be used on the website
 * If not set, the first language of the datasets array will be used
 * @type {Record<string, string>}
 */
export const defaultWebLanguage = {
  argentina: 'spanish-ar',
  storage: 'german',
  southkorea: 'korean',
  japan: 'japanese',
}

/**
 * Link between domain and datasets
 * This is necessary for static generation
 * @type {Record<string, {url: string, meta: string}>}
 */
const websiteDomains = {
  global: {
    url: 'https://www.equinor.com',
    meta: 'Equinor',
  },
  poland: {
    url: 'https://www.equinor.pl',
    meta: 'equinor.pl',
  },
  brazil: {
    url: 'https://www.equinor.com.br',
    meta: 'equinor.com.br',
  },
  germany: {
    url: 'https://www.equinor.de',
    meta: 'equinor.de',
  },
  storage: {
    url: 'https://www.equinorstorage.de',
    meta: 'equinorstorage.de',
  },
  argentina: {
    url: 'https://www.equinor.ar',
    meta: 'equinor.ar',
  },
  equinorfunds: {
    url: 'https://www.equinorfondene.no',
    meta: 'equinorfondene.no',
  },
  japan: {
    url: 'https://www.equinor.jp',
    meta: 'equinor.jp',
  },
  southkorea: {
    url: 'https://www.equinor.co.kr',
    meta: 'equinor.co.kr',
  },
  celticsea: {
    url: 'https://www.equinorcelticsea.co.uk',
    meta: 'equinorcelticsea.co.uk',
  },
  dudgeon: {
    url: 'https://web-dudgeon-equinor-web-sites-preprod.c2.radix.equinor.com/',
    meta: 'Dudgeon',
  },
  sheringham: {
    url: 'https://web-sheringham-equinor-web-sites-preprod.c2.radix.equinor.com/',
    meta: 'Sheringham Shoal',
  },
  'global-development': {
    url: 'localhost:3000',
    meta: 'Equinor',
  },
  'global-test': {
    url: 'https://web-global-test-equinor-web-sites-test.c2.radix.equinor.com',
    meta: 'Equinor',
  },
}

/**
 * @returns {{
 *  id: string
 *  title: string
 *  iso: string
 *  name: string
 *  locale: string
 * }[]}
 */
const filterLanguages = (dataset) =>
  dataset.map((lang) => languages.find((e) => e.id === lang)).filter((e) => e)

const logAndFallback = (dataset) => {
  console.error(
    `Selected dataset (${dataset}) not found! Possibly a typo in the env variable.\nFalling back to first in the list.`,
  )
  return filterLanguages(Object.values(datasets)[0])
}

/**
 * @param {string} dataset
 */
export const getLanguages = (dataset) =>
  Object.keys(datasets).some((name) => name === dataset)
    ? filterLanguages(datasets[dataset])
    : logAndFallback(dataset)

/**
 * @param {string} dataset
 */
export const getDomain = (dataset) =>
  websiteDomains[dataset]?.url || 'Domain not set'

/**
 * @param {string} dataset
 */
export const getMetaTitleSuffix = (dataset) => {
  return websiteDomains[dataset]?.meta || 'Equinor'
}
