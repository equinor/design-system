import figma from '@figma/code-connect'
import { Banner } from '.'
import { Button } from '../Button'
import { Icon } from '../Icon'

figma.connect(
  Banner,
  'https://www.figma.com/design/0bGXR2sCwMVSDNyyzu5BXrO5/EDS-Core-Components?node-id=3368:9717',
  {
    props: {
      tone: figma.enum('Color appearance', {
        info: 'info',
        warning: 'warning',
        danger: 'danger',
      }),
      hasIcon: figma.boolean('Icon'),
      hasActions: figma.boolean('Actions'),
      actionsPlacement: figma.enum('Actions placement', {
        left: 'left',
        bottom: 'bottom',
      }),
    },
    example: ({ tone, hasIcon, hasActions, actionsPlacement }) => (
      <Banner tone={tone}>
        {hasIcon && (
          <Banner.Icon>
            <Icon />
          </Banner.Icon>
        )}
        <Banner.Message>Banner message</Banner.Message>
        {hasActions && (
          <Banner.Actions placement={actionsPlacement}>
            <Button>Action</Button>
          </Banner.Actions>
        )}
      </Banner>
    ),
  },
)
