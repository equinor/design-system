import React from 'react'
import styled from 'styled-components'
import { Meta, Story } from '@storybook/react'
import { Banner, Icon, Button, BannerProps } from '@components'
import { save, thumbs_up, thumbs_down, mood_sad } from '@equinor/eds-icons'

const icons = {
  save,
  thumbs_up,
  thumbs_down,
  mood_sad,
}

Icon.add(icons)

const Wrapper = styled(Banner.Actions)`
  display: flex;
`

export default {
  title: 'Components/Banner',
  component: Banner,
  subcomponents: {
    Message: Banner.Message,
    Icon: Banner.Icon,
    Actions: Banner.Actions,
  },
  parameters: {
    docs: {
      description: {
        component: `Banners display important notifications and related optional actions.
        `,
      },
    },
  },
} as Meta

export const Default: Story<BannerProps> = () => {
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

export const IconAndText: Story<BannerProps> = () => (
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

export const TextAndAction: Story<BannerProps> = () => (
  <>
    <Banner>
      <Banner.Message>
        You are signed on with another account than Equinor account:
        name.lastname@mail.com.
      </Banner.Message>
      <Wrapper>
        <Button variant="ghost" style={{ marginRight: '1rem' }}>
          Sign out
        </Button>
        <Button variant="ghost">OK</Button>
      </Wrapper>
    </Banner>
    <Banner>
      <Banner.Message>
        You are signed on with another account than Equinor account:
        name.lastname@mail.com. This means you have to do something to be able
        to use this service.
      </Banner.Message>
      <Wrapper placement="bottom">
        <Button variant="ghost" style={{ marginRight: '1rem' }}>
          Sign out
        </Button>
        <Button variant="ghost">OK</Button>
      </Wrapper>
    </Banner>
  </>
)

export const IconAndTextAndActions: Story<BannerProps> = () => (
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
      <Wrapper placement="bottom">
        <Button style={{ marginRight: '1rem' }}>First action</Button>
        <Button color="secondary">Second action</Button>
      </Wrapper>
    </Banner>
  </>
)
