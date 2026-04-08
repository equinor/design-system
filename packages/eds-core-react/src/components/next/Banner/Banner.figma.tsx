import figma from '@figma/code-connect'
import { Banner } from '.'

figma.connect(
  Banner,
  'https://www.figma.com/design/0bGXR2sCwMVSDNyyzu5BXrO5/EDS-Core-Components?node-id=3368:9717',
  {
    props: {
      tone: figma.enum('Color appearance', {
        info: 'info',
        warning: 'warning',
        danger: 'danger',
        success: 'success',
      }),
      hasIcon: figma.boolean('Icon'),
      hasActions: figma.boolean('Actions'),
      actionsPlacement: figma.enum('Actions placement', {
        left: 'left',
        bottom: 'bottom',
      }),
      hasDismiss: figma.boolean('Dismiss'),
    },
    example: ({ tone, hasIcon, hasActions, actionsPlacement, hasDismiss }) => (
      <Banner tone={tone} onDismiss={hasDismiss ? () => {} : undefined}>
        {hasIcon && (
          <Banner.Icon>
            <svg />
          </Banner.Icon>
        )}
        <Banner.Message>Banner message</Banner.Message>
        {hasActions && (
          <Banner.Actions placement={actionsPlacement}>
            <button>Action</button>
          </Banner.Actions>
        )}
      </Banner>
    ),
  },
)
