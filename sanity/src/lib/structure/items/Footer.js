import { view_stream } from '@equinor/eds-icons'
import { EdsIcon } from '../../../../icons'
import flags from '../../../../icons/countries'
import { languages } from '../../../../languages'

const footers = (S) =>
  languages.map((lang) =>
    S.listItem({
      title: `${lang.title} footer`,
      id: `footer-${lang.id}`,
      icon: flags[lang.id],
      child: S.documentWithInitialValueTemplate('footer-with-locale', { isoCode: `${lang.name}` })
        .id(`${lang.id}-footer`)
        .title(`${lang.title} footer`)
        .views([S.view.form()]),
    }),
  )

export const Footer = (S) =>
  S.listItem()
    .title('Footer')
    .icon(() => EdsIcon(view_stream))
    .child(S.list('footer').id('footer').title('Footers').items(footers(S)))
