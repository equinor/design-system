import { composeStories } from '@storybook/react'

import * as AccordionStories from '@eds-core-react-src/components/next/Accordion/Accordion.stories'
import * as AutocompleteStories from '@eds-core-react-src/components/next/Autocomplete/Autocomplete.stories'
import * as BannerStories from '@eds-core-react-src/components/next/Banner/Banner.stories'
import * as ButtonStories from '@eds-core-react-src/components/next/Button/Button.stories'
import * as CheckboxStories from '@eds-core-react-src/components/next/Checkbox/Checkbox.stories'
import * as ChipStories from '@eds-core-react-src/components/next/Chip/Chip.stories'
import * as DividerStories from '@eds-core-react-src/components/next/Divider/Divider.stories'
import * as FieldStories from '@eds-core-react-src/components/next/Field/Field.stories'
import * as IconStories from '@eds-core-react-src/components/next/Icon/Icon.stories'
import * as InputStories from '@eds-core-react-src/components/next/Input/Input.stories'
import * as LinkStories from '@eds-core-react-src/components/next/Link/Link.stories'
import * as RadioStories from '@eds-core-react-src/components/next/Radio/Radio.stories'
import * as SearchStories from '@eds-core-react-src/components/next/Search/Search.stories'
import * as SwitchStories from '@eds-core-react-src/components/next/Switch/Switch.stories'
import * as TextAreaStories from '@eds-core-react-src/components/next/TextArea/TextArea.stories'
import * as TextFieldStories from '@eds-core-react-src/components/next/TextField/TextField.stories'
import * as TooltipStories from '@eds-core-react-src/components/next/Tooltip/Tooltip.stories'

/**
 * Portable-stories registry. Each entry composes a component's actual CSF
 * story file from eds-core-react source into render-ready React components —
 * the same stories Storybook shows, with args and decorators applied.
 * Renaming or removing a story becomes a docs build error instead of a
 * silently broken iframe.
 */
export const storyRegistry = {
  Accordion: composeStories(AccordionStories),
  Autocomplete: composeStories(AutocompleteStories),
  Banner: composeStories(BannerStories),
  Button: composeStories(ButtonStories),
  Checkbox: composeStories(CheckboxStories),
  Chip: composeStories(ChipStories),
  Divider: composeStories(DividerStories),
  Field: composeStories(FieldStories),
  Icon: composeStories(IconStories),
  Input: composeStories(InputStories),
  Link: composeStories(LinkStories),
  Radio: composeStories(RadioStories),
  Search: composeStories(SearchStories),
  Switch: composeStories(SwitchStories),
  TextArea: composeStories(TextAreaStories),
  TextField: composeStories(TextFieldStories),
  Tooltip: composeStories(TooltipStories),
} as const

export type StoryRegistry = typeof storyRegistry
