import { useState, useEffect } from 'react'
import { ComponentMeta, Story } from '@storybook/react'
import { Banner, Icon, Button, BannerProps, EdsProvider, Density } from '../..'
import { save, thumbs_up, thumbs_down, mood_sad } from '@equinor/eds-icons'
import page from './Banner.docs.mdx'

const icons = {
  save,
  thumbs_up,
  thumbs_down,
  mood_sad,
}

Icon.add(icons)

export default {
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
    },
  },
} as ComponentMeta<typeof Banner>

export const Introduction: Story<BannerProps> = () => {
  //  Note: This example is not interactive, as Storybook
  // doesn't yet support to manipulate subcomponents via Storybook Args
  return (
    <Banner>
      <Banner.Message>
        This tag is not being preserved yet. Click start preservation to enable
        writing preservation records.
      </Banner.Message>
    </Banner>
  )
}

export const TextAndIcon: Story<BannerProps> = () => (
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

export const TextAndAction: Story<BannerProps> = () => (
  <>
    <Banner>
      <Banner.Message>
        You are signed on with another account than Equinor account:
        name.lastname@mail.com.
      </Banner.Message>
      <Banner.Actions>
        <Button variant="ghost">Sign out</Button>
        <Button variant="ghost">OK</Button>
      </Banner.Actions>
    </Banner>
    <Banner>
      <Banner.Message>
        You are signed on with another account than Equinor account:
        name.lastname@mail.com. This means you have to do something to be able
        to use this service.
      </Banner.Message>
      <Banner.Actions placement="bottom">
        <Button variant="ghost">Sign out</Button>
        <Button variant="ghost">OK</Button>
      </Banner.Actions>
    </Banner>
  </>
)
TextAndAction.storyName = 'Text and action'

export const TextAndIconAndAction: Story<BannerProps> = () => (
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
        <Button color="secondary">Second action</Button>
      </Banner.Actions>
    </Banner>
  </>
)
TextAndIconAndAction.storyName = 'Text and icon and actions'

export const Compact: Story<BannerProps> = () => {
  const [density, setDensity] = useState<Density>('comfortable')

  useEffect(() => {
    // Simulate user change
    setDensity('compact')
  }, [density])

  return (
    <EdsProvider density={density}>
      <Banner>
        <Banner.Icon variant="warning">
          <Icon name="mood_sad" />
        </Banner.Icon>
        <Banner.Message>
          This tag is not being preserved yet. Click start preservation to
          enable writing preservation records.
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
          why the actions have been located at the bottom using the placement
          prop instead.
        </Banner.Message>
        <Banner.Actions placement="bottom">
          <Button>First action</Button>
          <Button color="secondary">Second action</Button>
        </Banner.Actions>
      </Banner>
    </EdsProvider>
  )
}
