import React from 'react'
import styled from 'styled-components'
import { Meta, Story } from '@storybook/react'
import { Banner, Icon, Button, BannerProps } from '@equinor/eds-core-react'
import { save, thumbs_up, thumbs_down, mood_sad } from '@equinor/eds-icons'
//import docs from './Banner.docs.mdx'
import { withDesign } from 'storybook-addon-designs'

const icons = {
  save,
  thumbs_up,
  thumbs_down,
  mood_sad,
}

const { BannerIcon, BannerMessage, BannerActions } = Banner
Icon.add(icons)

const InlineBannerActions = styled(BannerActions)`
  display: flex;
`

export default {
  title: 'Experiments/Figma/Banner',
  component: Banner,
  subcomponents: { BannerMessage, BannerIcon, BannerActions },
  decorators: [withDesign],
  /*  parameters: {
    docs: { page: docs },
  }, */
} as Meta

export const Basic: Story<BannerProps> = (args) => (
  <Banner {...args}>
    <BannerMessage>
      This tag is not being preserved yet. Click start preservation to enable
      writing preservation records.
    </BannerMessage>
  </Banner>
)

export const IconAndText: Story<BannerProps> = () => (
  <>
    <Banner>
      <BannerIcon>
        <Icon name="thumbs_up" />
      </BannerIcon>
      <BannerMessage>
        We are in the making of a new design for this page.
      </BannerMessage>
    </Banner>
    <Banner>
      <BannerIcon variant="warning">
        <Icon name="thumbs_down" />
      </BannerIcon>
      <BannerMessage>Some warning information.</BannerMessage>
    </Banner>
  </>
)

IconAndText.parameters = {
  design: {
    type: 'figma',
    url:
      'https://www.figma.com/file/0bGXR2sCwMVSDNyyzu5BXrO5/UI%E2%80%94User-Interface?node-id=17611%3A0',
  },
}

export const TextAndAction: Story<BannerProps> = () => (
  <>
    <Banner>
      <BannerMessage>
        You are signed on with another account than Equinor account:
        name.lastname@mail.com.
      </BannerMessage>
      <InlineBannerActions>
        <Button variant="ghost" style={{ marginRight: '1rem' }}>
          Sign out
        </Button>
        <Button variant="ghost">OK</Button>
      </InlineBannerActions>
    </Banner>
    <Banner>
      <BannerMessage>
        You are signed on with another account than Equinor account:
        name.lastname@mail.com. This means you have to do something to be able
        to use this service.
      </BannerMessage>
      <InlineBannerActions placement="bottom">
        <Button variant="ghost" style={{ marginRight: '1rem' }}>
          Sign out
        </Button>
        <Button variant="ghost">OK</Button>
      </InlineBannerActions>
    </Banner>
  </>
)

export const IconAndTextAndActions: Story<BannerProps> = () => (
  <>
    <Banner>
      <BannerIcon variant="warning">
        <Icon name="mood_sad" />
      </BannerIcon>
      <BannerMessage>
        This tag is not being preserved yet. Click start preservation to enable
        writing preservation records.
      </BannerMessage>
      <BannerActions>
        <Button>Action</Button>
      </BannerActions>
    </Banner>
    <Banner>
      <BannerIcon>
        <Icon name="save" />
      </BannerIcon>
      <BannerMessage>
        I&apos;m such a really really long message about some sad saving news
        that there is not enough space for the actions on my left. That&apos;s
        why the actions have been located at the bottom using the placement prop
        instead.
      </BannerMessage>
      <InlineBannerActions placement="bottom">
        <Button style={{ marginRight: '1rem' }}>First action</Button>
        <Button color="secondary">Second action</Button>
      </InlineBannerActions>
    </Banner>
  </>
)
