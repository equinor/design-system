import { StoryFn, Meta } from '@storybook/react-vite'
import * as icons from '@equinor/eds-icons'
import type { IconData } from '@equinor/eds-icons'
import { Stack } from './../../../.storybook/components'
import { Icon, IconProps, TypographyNext } from '../..'
import page from './Icon.docs.mdx'

Icon.add(icons)

const meta: Meta<typeof Icon> = {
  title: 'Icons/Icon',
  component: Icon,
  argTypes: {
    name: {
      options: Object.keys(icons),
      control: {
        type: 'select',
      },
    },
    color: {
      control: 'color',
    },
  },
  parameters: {
    docs: {
      page,
      source: {
        excludeDecorators: true,
      },
    },
  },
  decorators: [
    (Story) => {
      return (
        <Stack>
          <Story />
        </Stack>
      )
    },
  ],
}

export default meta

export const Introduction: StoryFn<IconProps> = (args) => {
  return <Icon {...args} />
}
Introduction.args = {
  name: 'save',
  size: 24,
  title: 'save',
}

export const Accessibility: StoryFn<IconProps> = () => (
  <Icon name="save" title="Save me!" />
)

export const IconContainer: StoryFn<IconProps> = () => (
  <>
    <div
      data-icon-size="xl"
      style={{
        width: 'var(--eds-icon-container-size)',
        height: 'var(--eds-icon-container-size)',
        position: 'relative',
      }}
    >
      <Icon
        name="pizza"
        style={{
          width: 'var(--eds-icon-size)',
          height: 'var(--eds-icon-size)',
          position: 'absolute',
          top: 'calc(50% - var(--eds-icon-size) / 2)',
          left: 'calc(50% - var(--eds-icon-size) / 2)',
        }}
      />
    </div>
    <div
      data-icon-size="xl"
      style={{
        width: 'var(--eds-icon-container-size)',
        height: 'var(--eds-icon-container-size)',
        display: 'flex',
      }}
    >
      <Icon
        name="pizza"
        style={{
          width: 'var(--eds-icon-size)',
          height: 'var(--eds-icon-size)',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      />
    </div>
  </>
)

export const Color: StoryFn<IconProps> = () => (
  <>
    <Icon name="save" color={'red'} />
    <Icon name="save" color={'green'} />
    <Icon name="save" color={'blue'} />
  </>
)

export const Rotations: StoryFn<IconProps> = () => (
  <>
    <Icon name="pregnant_woman" rotation={90} />
    <Icon name="pregnant_woman" rotation={180} />
    <Icon name="pregnant_woman" rotation={270} />
  </>
)

export const Sizes: StoryFn<IconProps> = () => (
  <>
    <Icon name="fullscreen" size={16} />
    <Icon name="fullscreen" size={18} />
    <Icon name="fullscreen" size={24} />
    <Icon name="fullscreen" size={32} />
    <Icon name="fullscreen" size={40} />
    <Icon name="fullscreen" size={48} />
  </>
)

export const Custom: StoryFn<IconProps> = () => {
  const customIcon: IconData = {
    svgPathData: [
      'M47.5252 166C46.8252 166 46.2752 165.8 45.8752 165.4C45.4752 165 45.2752 164.45 45.2752 163.75V73.9H18.5752C17.8752 73.9 17.3252 73.7 16.9252 73.3C16.5252 72.9 16.3252 72.35 16.3252 71.65V63.25C16.3252 62.55 16.5252 62 16.9252 61.6C17.3252 61.2 17.8752 61 18.5752 61H85.4752C86.1752 61 86.7252 61.2 87.1252 61.6C87.5252 62 87.7252 62.55 87.7252 63.25V71.65C87.7252 72.35 87.5252 72.9 87.1252 73.3C86.7252 73.7 86.1752 73.9 85.4752 73.9H58.7752V163.75C58.7752 164.45 58.5752 165 58.1752 165.4C57.7752 165.8 57.2252 166 56.5252 166H47.5252Z',
      'M167.525 166C166.825 166 166.275 165.8 165.875 165.4C165.475 165 165.275 164.45 165.275 163.75V73.9H138.575C137.875 73.9 137.325 73.7 136.925 73.3C136.525 72.9 136.325 72.35 136.325 71.65V63.25C136.325 62.55 136.525 62 136.925 61.6C137.325 61.2 137.875 61 138.575 61H205.475C206.175 61 206.725 61.2 207.125 61.6C207.525 62 207.725 62.55 207.725 63.25V71.65C207.725 72.35 207.525 72.9 207.125 73.3C206.725 73.7 206.175 73.9 205.475 73.9H178.775V163.75C178.775 164.45 178.575 165 178.175 165.4C177.775 165.8 177.225 166 176.525 166H167.525Z',
      'M84.6973 166C84.0439 166 83.5306 165.813 83.1573 165.44C82.7839 165.067 82.5973 164.553 82.5973 163.9V103.56C82.5973 102.347 83.1573 101.553 84.2773 101.18L92.2573 98.24C92.4439 98.1467 92.7239 98.1 93.0973 98.1C94.1239 98.1 94.6373 98.7067 94.6373 99.92V107.06C97.0639 103.513 100.051 100.993 103.597 99.5C107.237 97.9133 111.064 97.12 115.077 97.12C120.211 97.12 124.831 98.2867 128.937 100.62C133.044 102.86 136.264 106.267 138.597 110.84C141.024 115.32 142.237 120.78 142.237 127.22V163.9C142.237 164.553 142.051 165.067 141.677 165.44C141.304 165.813 140.791 166 140.137 166H132.297C131.644 166 131.131 165.813 130.757 165.44C130.384 165.067 130.197 164.553 130.197 163.9V127.64C130.197 121.76 128.611 117.187 125.437 113.92C122.357 110.653 118.157 109.02 112.837 109.02C107.424 109.02 103.037 110.7 99.6773 114.06C96.3173 117.327 94.6373 121.853 94.6373 127.64V163.9C94.6373 164.553 94.4506 165.067 94.0773 165.44C93.7039 165.813 93.1906 166 92.5373 166H84.6973Z',
    ],
    name: 'tnt',
    prefix: 'tnt',
    height: '240px',
    width: '240px',
  }
  return (
    <>
      <Icon data={customIcon} size={24} />
      <Icon data={customIcon} size={48} />
    </>
  )
}
