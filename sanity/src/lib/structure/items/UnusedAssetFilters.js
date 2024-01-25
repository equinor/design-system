import { play_circle_outlined } from '@equinor/eds-icons'
import { EdsIcon, FileIcon } from '../../../../icons'
import { apiVersion } from '../../../../sanity.client'

export const UnusedAssetFilters = (S) =>
  S.listItem()
    .title('Unused files')
    .icon()
    .child(S.list('unusedAssets').title('Unused Files').items(unusedTypesListItems(S)))
    .id('unusedFiles')

const getUnusedPublishedAssets = (S, docType) =>
  S.documentTypeList(docType)
    .apiVersion(apiVersion)
    .filter(
      /* groq */ ` _type in [$docType] && (
        (!(_id in path("drafts.**"))&& count(*[references(^._id)]) == 0)
        )`,
    )
    .params({ docType })
    .id(`unusedPublishedAssets-${docType}`)

const getUnpublishedDraftAssets = (S, docType) =>
  S.documentTypeList(docType)
    .apiVersion(apiVersion)
    .filter(
      /* groq */ ` _type in [$docType] && (
        (_id in path("drafts.**") && count(*[^._id == "drafts." + _id]) == 0)
        )`,
    )
    .params({ docType })
    .id(`unpublishedDrafts-${docType}`)

const unusedTypesListItems = (S) => [
  S.listItem().icon(FileIcon).child(getUnpublishedDraftAssets(S, 'assetFile')).id('draftAssets').title('Draft Assets'),
  S.listItem()
    .icon(FileIcon)
    .child(getUnusedPublishedAssets(S, 'assetFile'))
    .id('publishedAssets')
    .title('Published Assets'),
  S.divider(),
  S.listItem()
    .icon(() => EdsIcon(play_circle_outlined))
    .child(getUnpublishedDraftAssets(S, 'videoFile'))
    .id('draftVideos')
    .title('Draft Videos'),
  S.listItem()
    .icon(() => EdsIcon(play_circle_outlined))
    .child(getUnusedPublishedAssets(S, 'videoFile'))
    .id('publishedVideos')
    .title('Published Videos'),
]
