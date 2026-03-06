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
      }),
      hasIcon: figma.boolean('Icon'),
      hasActions: figma.boolean('Actions'),
      actionsPlacement: figma.enum('Actions placement', {
        left: 'left',
        bottom: 'bottom',
      }),
    },
    example: ({ tone }) => (
      <Banner tone={tone}>
        <Banner.Message>Banner message</Banner.Message>
      </Banner>
    ),
  },
)
