import { settings } from '@equinor/eds-icons'
import { EdsIcon } from '../../../../icons'
import { Flags } from '../../datasetHelpers'
import { CountryTags } from './CountryTags'
import { EventTags } from './EventTags'
import { LocalNewsTags } from './LocalNewsTags'
import { MagazineTags } from './MagazineTags'
import { ExternalRedirects, Redirects } from './Redirects'
import { Tags } from './Tags'
import { TextSnippet } from './TextSnippet'

const settingsItems = (S) =>
  [
    Flags.HAS_NEWS && Tags(S),
    Flags.HAS_NEWS && CountryTags(S),
    Flags.HAS_MAGAZINE && MagazineTags(S),
    Flags.HAS_EVENT && EventTags(S),
    TextSnippet(S),
    Redirects(S),
    ExternalRedirects(S),
    Flags.HAS_LOCAL_NEWS && LocalNewsTags(S),
  ].filter((e) => e)

export const Settings = (S) =>
  S.listItem()
    .title('Settings')
    .icon(() => EdsIcon(settings))
    .child(S.list().id('settings').title('Settings').items(settingsItems(S)))
