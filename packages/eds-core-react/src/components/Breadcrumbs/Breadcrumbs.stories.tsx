import styled from 'styled-components'
import { Breadcrumbs, BreadcrumbsProps } from '../..'
import { action } from '@storybook/addon-actions'
import { ComponentMeta, Story } from '@storybook/react'
import { Stack as SBStack } from './../../../.storybook/components'
import page from './Breadcrumbs.docs.mdx'

const Stack = styled(SBStack)`
  margin: 42px;
`

export default {
  title: 'Navigation/Breadcrumbs',
  component: Breadcrumbs,
  subcomponents: {
    Breadcrumb: Breadcrumbs.Breadcrumb,
  },
  parameters: {
    docs: {
      page,
    },
  },
} as ComponentMeta<typeof Breadcrumbs>

const handleClick = (
  e: React.MouseEvent<HTMLElement> | React.KeyboardEvent<HTMLElement>,
) => {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
  action('handleClick')((e.target as HTMLElement).textContent)
  e.preventDefault()
}

export const Introduction: Story<BreadcrumbsProps> = (args) => {
  return (
    <Stack>
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
    </Stack>
  )
}

export const Normal: Story<BreadcrumbsProps> = () => (
  <Stack>
    <Breadcrumbs>
      <Breadcrumbs.Breadcrumb href="#" onClick={handleClick}>
        Store
      </Breadcrumbs.Breadcrumb>
      <Breadcrumbs.Breadcrumb href="#" onClick={handleClick}>
        Fruits
      </Breadcrumbs.Breadcrumb>
      <Breadcrumbs.Breadcrumb
        href="#"
        onClick={handleClick}
        aria-current="page"
      >
        Apple
      </Breadcrumbs.Breadcrumb>
    </Breadcrumbs>
  </Stack>
)

export const Collapsed: Story<BreadcrumbsProps> = () => (
  <Stack>
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
      <Breadcrumbs.Breadcrumb
        href="#"
        onClick={handleClick}
        aria-current="page"
      >
        Apple Juice
      </Breadcrumbs.Breadcrumb>
    </Breadcrumbs>
  </Stack>
)

export const TruncatedLabels: Story<BreadcrumbsProps> = () => (
  <Stack>
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
  </Stack>
)
TruncatedLabels.storyName = 'Truncated labels'

export const Wrapped: Story<BreadcrumbsProps> = () => (
  <Stack style={{ width: 300 }}>
    <Breadcrumbs>
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
  </Stack>
)
