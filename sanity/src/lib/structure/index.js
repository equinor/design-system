import { Flags } from '../datasetHelpers'
import { getCurrentUserRoles } from '../userRoles'
import { AssetLibrary } from './items/AssetLibrary'
import { Event as EventStructure } from './items/Event'
import { Footer } from './items/Footer'
import { Homepage } from './items/Homepage'
import { LandingPage as LandingPageStructure } from './items/LandingPage'
import { LocalNews as LocalNewsStructure } from './items/LocalNews'
import { Magazine as MagazineStructure } from './items/Magazine'
import { Menu } from './items/Menu'
import { Misc } from './items/Misc'
import { News as NewsStructure } from './items/News'
import { Routes } from './items/Routes'
import { Settings } from './items/Settings'
import { TopicContent } from './items/TopicContent'

const News = (S) => Flags.HAS_NEWS && NewsStructure(S)
const Magazine = (S) => Flags.HAS_MAGAZINE && MagazineStructure(S)
const LocalNews = (S, context) => Flags.HAS_LOCAL_NEWS && LocalNewsStructure(S, context)
const LandingPage = (S) => Flags.HAS_LANDING_PAGE && LandingPageStructure(S)
const Event = (S) => Flags.HAS_EVENT && EventStructure(S)

const ADMIN_ITEMS = (S, context) =>
  [
    News(S),
    LocalNews(S, context),
    TopicContent(S),
    LandingPage(S),
    Event(S),
    Magazine(S),
    Misc(S),
    S.divider(),
    Homepage(S),
    Routes(S, context),
    S.divider(),
    Menu(S),
    Footer(S),
    S.divider(),
    AssetLibrary(S, context),
    S.divider(),
    Settings(S),
  ].filter((e) => e)

const SUB_EDITOR_ITEMS = (S, context) =>
  [
    News(S),
    LocalNews(S, context),
    TopicContent(S),
    LandingPage(S),
    Magazine(S),
    Event(S),
    S.divider(),
    AssetLibrary(S, context),
  ].filter((e) => e)

const LOCAL_NEWS_EDITOR_ITEMS = (S, context) => [LocalNews(S, context)].filter((e) => e)

/**
 * Datasets are not taken into consideration in order to simplify logic.
 * This is used only to hide/show items in the UI.
 *
 * Drawback scenario:
 *  An user with "Editor" access to the "brazil" dataset, and "Sub Editor" to the "argentina" dataset
 *  will get ADMIN_ITEMS menu structure for both studios. This is acceptable because it is just
 *  the UI menu items, the content is properly hidden and handled at sanity.io -> Access tab.
 */

const getItems = (S, context) => {
  const userRoles = getCurrentUserRoles(context)
  const isAdmin = userRoles.some(
    (role) => role.startsWith('editor') || role === 'administrator' || role === 'developer',
  )
  const isSubEditor = userRoles.some((role) => role.startsWith('sub-editor'))
  const isLocalNewsEditor = userRoles.some((role) => role.startsWith('local-news-editor'))

  if (isAdmin) {
    return ADMIN_ITEMS(S, context)
  } else if (isSubEditor) {
    return SUB_EDITOR_ITEMS(S, context)
  } else if (isLocalNewsEditor) {
    return LOCAL_NEWS_EDITOR_ITEMS(S, context)
  } else {
    return []
  }
}

export default (S, context) => getItems(S, context)
