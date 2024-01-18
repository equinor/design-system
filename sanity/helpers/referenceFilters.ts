import { SanityDocument } from 'sanity'
import { defaultLanguage } from '../languages'

export const langOrDefault = (lang: string | unknown) => lang || defaultLanguage.name

export const filterByLang = ({ document }: { document: SanityDocument }) => ({
  filter: `_lang == $lang`,
  params: { lang: langOrDefault(document._lang) },
})

export const filterByRoute = ({ document }: { document: SanityDocument }) => ({
  filter: `_type match $routeLang`,
  params: { routeLang: `route_${langOrDefault(document._lang)}*` },
})

export const filterByPages = ({ document }: { document: SanityDocument }) => {
  const lang = langOrDefault(document._lang)

  return {
    filter: /* groq */ `_type match $routeLang || _type in ['news', 'localNews', 'magazine'] && _lang == $lang`,
    params: {
      routeLang: `route_${lang}*`,
      lang: lang,
    },
  }
}

export const filterByPagesInOtherLanguages = ({ document }: { document: SanityDocument }) => {
  const lang = langOrDefault(document._lang)

  return {
    filter: /* groq */ `(_type match 'route_*' && !(_type match $routeLang)) || _type in ['news', 'localNews', 'magazine'] && _lang != $lang`,
    params: {
      routeLang: `route_${lang}*`,
      lang: lang,
    },
  }
}

export const filterByRouteNewsMagazineAndTitle = ({ document }: { document: SanityDocument }) => {
  const lang = langOrDefault(document._lang)
  const title = document.title || ''
  return {
    filter: `title != $title && (_type match $routeLang || (_type in ['news', 'magazine'] && _lang == $lang ))`,
    params: {
      title: title,
      routeLang: `route_${lang}*`,
      lang: lang,
    },
  }
}

export const filterByRouteEvents = ({ document }: { document: SanityDocument }) => {
  return {
    filter: `_type match $routeLang && content->_type == "event"`,
    params: { routeLang: `route_${langOrDefault(document._lang)}*` },
  }
}

export const filterMagazineByLang = ({ document }: { document: SanityDocument }) => {
  return {
    filter: `_lang == $lang`,
    params: { lang: langOrDefault(document._lang) },
  }
}

export const topicPromotionFilter = ({ document }: { document: SanityDocument }) => {
  const lang = langOrDefault(document._lang)

  return {
    filter: `(_type match $routeLang && content->_type == "page") || (_type == 'magazine' && _lang == $lang)`,
    params: {
      routeLang: `route_${lang}*`,
      lang: lang,
    },
  }
}
