import { Breadcrumbs, BreadcrumbsProps, Checkbox, Icon } from '../..'
import { chevron_right } from '@equinor/eds-icons'
import { useState, ChangeEvent } from 'react'
import { action } from 'storybook/actions'
import { StoryFn, Meta } from '@storybook/react-vite'
import { Stack } from './../../../.storybook/components'
import page from './Breadcrumbs.docs.mdx'
import styled from 'styled-components'

const meta: Meta<typeof Breadcrumbs> = {
  title: 'Navigation/Breadcrumbs',
  component: Breadcrumbs,
  subcomponents: {
    Breadcrumb: Breadcrumbs.Breadcrumb,
  },
  parameters: {
    docs: {
      page,
      source: {
        excludeDecorators: true,
        type: 'code',
      },
    },
  },
  decorators: [
    (Story) => (
      <Stack>
        <Story />
      </Stack>
    ),
  ],
}

export default meta

const handleClick = (
  e: React.MouseEvent<HTMLElement> | React.KeyboardEvent<HTMLElement>,
) => {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
  action('handleClick')((e.target as HTMLElement).textContent)
  e.preventDefault()
}
const Resizable = styled.div`
  resize: horizontal;
  overflow: hidden;
  border: 1px solid black;
  padding: 16px;
  width: 360px;
`

export const Introduction: StoryFn<BreadcrumbsProps> = (args) => {
  return (
    <Breadcrumbs {...args}>
      <Breadcrumbs.Breadcrumb href="#" onClick={handleClick}>
        Label One
      </Breadcrumbs.Breadcrumb>
      <Breadcrumbs.Breadcrumb href="#" onClick={handleClick}>
        Label Two
      </Breadcrumbs.Breadcrumb>
      <Breadcrumbs.Breadcrumb href="#" onClick={handleClick}>
        Label Three
      </Breadcrumbs.Breadcrumb>
      <Breadcrumbs.Breadcrumb href="#" onClick={handleClick}>
        Label Four
      </Breadcrumbs.Breadcrumb>
      <Breadcrumbs.Breadcrumb href="#" onClick={handleClick}>
        Label Five
      </Breadcrumbs.Breadcrumb>
    </Breadcrumbs>
  )
}

export const Normal: StoryFn<BreadcrumbsProps> = () => (
  <Breadcrumbs>
    <Breadcrumbs.Breadcrumb href="#" onClick={handleClick}>
      Store
    </Breadcrumbs.Breadcrumb>
    <Breadcrumbs.Breadcrumb href="#" onClick={handleClick}>
      Fruits
    </Breadcrumbs.Breadcrumb>
    <Breadcrumbs.Breadcrumb href="#" onClick={handleClick} aria-current="page">
      Apple
    </Breadcrumbs.Breadcrumb>
  </Breadcrumbs>
)

export const Collapsed: StoryFn<BreadcrumbsProps> = () => (
  <Breadcrumbs collapse>
    <Breadcrumbs.Breadcrumb href="#" onClick={handleClick}>
      Store
    </Breadcrumbs.Breadcrumb>
    <Breadcrumbs.Breadcrumb href="#" onClick={handleClick}>
      Fruits
    </Breadcrumbs.Breadcrumb>
    <Breadcrumbs.Breadcrumb href="#" onClick={handleClick}>
      Apple
    </Breadcrumbs.Breadcrumb>
    <Breadcrumbs.Breadcrumb href="#" onClick={handleClick} aria-current="page">
      Apple Juice
    </Breadcrumbs.Breadcrumb>
  </Breadcrumbs>
)

export const TruncatedLabels: StoryFn<BreadcrumbsProps> = () => (
  <Breadcrumbs>
    <Breadcrumbs.Breadcrumb href="#" maxWidth={30} onClick={handleClick}>
      Store
    </Breadcrumbs.Breadcrumb>
    <Breadcrumbs.Breadcrumb href="#" maxWidth={30} onClick={handleClick}>
      Fruits
    </Breadcrumbs.Breadcrumb>
    <Breadcrumbs.Breadcrumb
      maxWidth={30}
      href="#"
      onClick={handleClick}
      aria-current="page"
    >
      Apple
    </Breadcrumbs.Breadcrumb>
  </Breadcrumbs>
)
TruncatedLabels.storyName = 'Truncated labels'

export const Wrapped: StoryFn<BreadcrumbsProps> = () => {
  const [wrap, setWrap] = useState(true)
  return (
    <div
      style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}
    >
      <Checkbox
        label="Wrap"
        onChange={(e: ChangeEvent<HTMLInputElement>) => {
          setWrap(e.target.checked)
        }}
        checked={wrap}
      />
      <Resizable>
        <Breadcrumbs wrap={wrap}>
          <Breadcrumbs.Breadcrumb forceTooltip href="#" onClick={handleClick}>
            Label One
          </Breadcrumbs.Breadcrumb>
          <Breadcrumbs.Breadcrumb forceTooltip href="#" onClick={handleClick}>
            Label Two
          </Breadcrumbs.Breadcrumb>
          <Breadcrumbs.Breadcrumb forceTooltip href="#" onClick={handleClick}>
            A really rally long label
          </Breadcrumbs.Breadcrumb>
          <Breadcrumbs.Breadcrumb forceTooltip href="#" onClick={handleClick}>
            Label Four
          </Breadcrumbs.Breadcrumb>
          <Breadcrumbs.Breadcrumb forceTooltip href="#" onClick={handleClick}>
            Label Five
          </Breadcrumbs.Breadcrumb>
        </Breadcrumbs>
      </Resizable>
    </div>
  )
}

export const CustomSeperator: StoryFn<BreadcrumbsProps> = () => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      <Breadcrumbs separator={<Icon data={chevron_right}></Icon>}>
        <Breadcrumbs.Breadcrumb href="#" onClick={handleClick}>
          Label One
        </Breadcrumbs.Breadcrumb>
        <Breadcrumbs.Breadcrumb href="#" onClick={handleClick}>
          Label Two
        </Breadcrumbs.Breadcrumb>
        <Breadcrumbs.Breadcrumb href="#" onClick={handleClick}>
          A really rally long label
        </Breadcrumbs.Breadcrumb>
        <Breadcrumbs.Breadcrumb href="#" onClick={handleClick}>
          Label Four
        </Breadcrumbs.Breadcrumb>
        <Breadcrumbs.Breadcrumb href="#" onClick={handleClick}>
          Label Five
        </Breadcrumbs.Breadcrumb>
      </Breadcrumbs>
      <Breadcrumbs separator="\">
        <Breadcrumbs.Breadcrumb href="#" onClick={handleClick}>
          Label One
        </Breadcrumbs.Breadcrumb>
        <Breadcrumbs.Breadcrumb href="#" onClick={handleClick}>
          Label Two
        </Breadcrumbs.Breadcrumb>
        <Breadcrumbs.Breadcrumb href="#" onClick={handleClick}>
          A really rally long label
        </Breadcrumbs.Breadcrumb>
        <Breadcrumbs.Breadcrumb href="#" onClick={handleClick}>
          Label Four
        </Breadcrumbs.Breadcrumb>
        <Breadcrumbs.Breadcrumb href="#" onClick={handleClick}>
          Label Five
        </Breadcrumbs.Breadcrumb>
      </Breadcrumbs>
    </div>
  )
}
