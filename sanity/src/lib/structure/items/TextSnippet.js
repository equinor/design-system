import { folder, text_field } from '@equinor/eds-icons'
import { EdsIcon } from '../../../../icons'
import textSnippets, { groups } from '../../../../schemas/textSnippets'

const textSnippetGroups = (S) =>
  Object.keys(groups)
    .filter((it) => !groups[it].hidden)
    .sort((a, b) => groups[a].title.localeCompare(groups[b].title))
    .map((it) => S.listItem(createTextSnippetGroupItem(S, groups[it])))

const textSnippetItems = (S) => [...textSnippetGroups(S)]

function createTextSnippetGroupItem(S, group) {
  return {
    title: group.title,
    icon: () => EdsIcon(folder),
    id: `snippet-group-${group.title.split(' ').join('-')}`,
    child: S.list()
      .id('textSnippet')
      .title(group.title)
      .items(
        Object.keys(textSnippets)
          .filter((it) => textSnippets[it].group === group && !textSnippets[it].hidden)
          .sort((a, b) => textSnippets[a].title.localeCompare(textSnippets[b].title))
          .map((it) => S.listItem(createTextSnippetItem(S, it))),
      ),
  }
}

function createTextSnippetItem(S, key) {
  return {
    title: textSnippets[key].title,
    displayOptions: {
      showIcon: false,
    },
    id: `snippet-${key}`,
    child: S.documentWithInitialValueTemplate(`text-snippet-${key}`, {
      defaultValue: textSnippets[key].defaultValue,
    })
      .documentId(`text_snippet_${key}`)
      .title(`Text Snippet: ${key} `)
      .schemaType('textSnippet'),
  }
}

export const TextSnippet = (S) =>
  S.listItem()
    .icon(() => EdsIcon(text_field))
    .title('Text Snippets')
    .child(S.list().id('textSnippet').title('Text Snippets').items(textSnippetItems(S)))
