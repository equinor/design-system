import { StoryFn, Meta } from '@storybook/react'
import { Stack } from '../../../.storybook/components/'
import { Banner, Icon, Button, BannerProps, Typography } from '../..'
import { save, thumbs_up, thumbs_down, mood_sad } from '@equinor/eds-icons'
import page from './Banner.docs.mdx'

const icons = {
  save,
  thumbs_up,
  thumbs_down,
  mood_sad,
}

Icon.add(icons)

const meta: Meta<typeof Banner> = {
  title: 'Feedback/Banner',
  component: Banner,
  subcomponents: {
    Message: Banner.Message,
    Icon: Banner.Icon,
    Actions: Banner.Actions,
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
        <Stack
          direction="column"
          align="stretch"
          style={{ background: '#ebebeb', padding: '32px' }}
        >
          <Story />
        </Stack>
      )
    },
  ],
}
export default meta

export const Introduction: StoryFn<BannerProps> = (args) => {
  //  Note: This example is not interactive, as Storybook
  // doesn't yet support to manipulate subcomponents via Storybook Args
  return (
    <Banner {...args}>
      <Banner.Message>
        This tag is not being preserved yet. Click start preservation to enable
        writing preservation records.
      </Banner.Message>
    </Banner>
  )
}

export const TextAndIcon: StoryFn<BannerProps> = () => (
  <>
    <Banner>
      <Banner.Icon>
        <Icon name="thumbs_up" />
      </Banner.Icon>
      <Banner.Message>
        We are in the making of a new design for this page.
      </Banner.Message>
    </Banner>
    <Banner>
      <Banner.Icon variant="warning">
        <Icon name="thumbs_down" />
      </Banner.Icon>
      <Banner.Message>Some warning information.</Banner.Message>
    </Banner>
  </>
)
TextAndIcon.storyName = 'Text and icon'

export const TextAndAction: StoryFn<BannerProps> = () => (
  <>
    <Banner>
      <Banner.Message>
        Please confirm that you want do this action.
      </Banner.Message>
      <Banner.Actions>
        <Button>OK</Button>
        <Button variant="outlined">Cancel</Button>
      </Banner.Actions>
    </Banner>
    <Banner>
      <Banner.Message>
        Please confirm that you want do this other action.
      </Banner.Message>
      <Banner.Actions placement="bottom">
        <Button>OK</Button>
        <Button variant="outlined">Sign out</Button>
      </Banner.Actions>
    </Banner>
  </>
)
TextAndAction.storyName = 'Text and action'

export const TextAndIconAndAction: StoryFn<BannerProps> = () => (
  <>
    <Banner>
      <Banner.Icon variant="warning">
        <Icon name="mood_sad" />
      </Banner.Icon>
      <Banner.Message>
        This tag is not being preserved yet. Click start preservation to enable
        writing preservation records.
      </Banner.Message>
      <Banner.Actions>
        <Button>Action</Button>
      </Banner.Actions>
    </Banner>
    <Banner>
      <Banner.Icon>
        <Icon name="save" />
      </Banner.Icon>
      <Banner.Message>
        I&apos;m such a really really long message about some sad saving news
        that there is not enough space for the actions on my left. That&apos;s
        why the actions have been located at the bottom using the placement prop
        instead.
      </Banner.Message>
      <Banner.Actions placement="bottom">
        <Button>First action</Button>
        <Button variant="outlined">Second action</Button>
      </Banner.Actions>
    </Banner>
  </>
)
TextAndIconAndAction.storyName = 'Text and icon and actions'
export const ComplexBannerContent: StoryFn<BannerProps> = () => (
  <>
    <Banner>
      <Banner.Icon variant="warning">
        <Icon name="thumbs_down" />
      </Banner.Icon>
      <div>
        <Typography variant="body_short" style={{ fontWeight: 'bold' }}>
          Important update required
        </Typography>
        <Typography variant="body_long" style={{ margin: '4px 0' }}>
          Your project contains{' '}
          <a href="#deprecated">3 deprecated components</a> that need to be
          updated before June 2025.
        </Typography>
        <Typography
          variant="caption"
          style={{
            background: '#f5f5f5',
            padding: '2px 4px',
            borderRadius: '2px',
            display: 'inline-block',
            fontFamily: 'monospace',
          }}
        >
          ComponentA, ComponentB, ComponentC
        </Typography>
      </div>
      <Banner.Actions>
        <Button>View details</Button>
      </Banner.Actions>
    </Banner>

    <Banner>
      <Banner.Icon>
        <Icon name="thumbs_up" />
      </Banner.Icon>
      <div>
        <Typography variant="body_long">
          Project status:{' '}
          <Typography
            variant="body_long"
            as="span"
            style={{ color: 'green', fontWeight: 'bold' }}
          >
            Active
          </Typography>
        </Typography>
        <Typography
          variant="body_long"
          as="ul"
          style={{ margin: '4px 0', paddingLeft: '20px' }}
        >
          <Typography variant="body_long" as="li">
            Last updated: May 15, 2025
          </Typography>
          <Typography variant="body_long" as="li">
            Contributors: 8
          </Typography>
          <Typography variant="body_long" as="li">
            Health check:{' '}
            <Typography
              variant="body_long"
              as="span"
              style={{ color: 'green' }}
            >
              Passing
            </Typography>
          </Typography>
        </Typography>
      </div>
      <Banner.Actions>
        <Button>View dashboard</Button>
        <Button variant="outlined">Export report</Button>
      </Banner.Actions>
    </Banner>
  </>
)
ComplexBannerContent.storyName = 'Complex Banner Content'
