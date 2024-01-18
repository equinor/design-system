import { TopicDocuments } from '../../../../icons'
import flags from '../../../../icons/countries'
import { languages } from '../../../../languages'

const homepages = (S) =>
  languages.map((lang) =>
    S.listItem({
      title: `${lang.title} Homepage`,
      id: `homepage-${lang.id}`,
      icon: flags[lang.id],
      child: S.documentWithInitialValueTemplate(`route_${lang.name}_homepage`)
        .id(`${lang.id}-homepage`)
        .title(`Homepage route - ${lang.title}`),
    }),
  )

export const Homepage = (S) =>
  S.listItem()
    .title('Home Page')
    .icon(TopicDocuments)
    .child(() => S.list('homepage').id('homepage').title('Homepages').items(homepages(S)))
