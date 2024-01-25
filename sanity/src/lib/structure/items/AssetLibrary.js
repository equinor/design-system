import { play_circle_outlined } from '@equinor/eds-icons'

import { EdsIcon, FileIcon, LibraryIcon, TagMoreIcon } from '../../../../icons'
import { Flags } from '../../datasetHelpers'
import { AssetExtensionFilters } from './AssetExtensionFilters'
import { AssetTagFilters } from './AssetTagFilters'
import { UnusedAssetFilters } from './UnusedAssetFilters'

const assetLibraryItems = (S, context) =>
  [
    S.listItem()
      .title('Show all asset files')
      .icon(FileIcon)
      .child(S.documentTypeList('assetFile').id('allFiles').title('All files')),
    S.divider(),
    AssetExtensionFilters(S),
    AssetTagFilters(S, context),
    S.divider(),
    S.listItem()
      .title('Manage file tags')
      .icon(TagMoreIcon)
      .child(S.documentTypeList('assetTag').id('manageAssetTags').title('Manage asset tags')),
    S.divider(),
    S.listItem()
      .title('Video Assets')
      .icon(() => EdsIcon(play_circle_outlined))
      .child(S.documentTypeList('videoFile').id('videoFiles').title('Video Files')),
    S.divider(),
    UnusedAssetFilters(S),
  ].filter((e) => e)

export const AssetLibrary = (S, context) =>
  S.listItem()
    .title('Asset library')
    .icon(LibraryIcon)
    .child(S.list('assets').id('assets').title('Asset library').items(assetLibraryItems(S, context)))
