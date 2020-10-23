import React from 'react'
import styled from 'styled-components'
import { Meta } from '@storybook/react'
import { Banner, Icon, Typography, Button } from '@equinor/eds-core-react'
import { save, thumbs_up, thumbs_down, mood_sad } from '@equinor/eds-icons'

const icons = {
  save,
  thumbs_up,
  thumbs_down,
  mood_sad,
}

const { BannerIcon, BannerMessage, BannerActions } = Banner
Icon.add(icons)

const Wrapper = styled.div`
  display: grid;
  grid-template-rows: min-width;
  padding: 32px 0;
  padding-bottom: 8rem;
  grid-gap: 2rem;
`

const InlineBannerActions = styled(BannerActions)`
  display: flex;
`
const PaddedTypography = styled(Typography)`
  margin: 0 16px;
`

export default {
  title: 'Components/Banner',
  component: Banner,
} as Meta

export const Examples = () => {
  return (
    <Wrapper>
      <div>
        <PaddedTypography variant="h2">Text</PaddedTypography>
        <Banner>
          <BannerMessage>
            This tag is not being preserved yet. Click start preservation to
            enable writing preservation records.
          </BannerMessage>
        </Banner>
      </div>
      <div>
        <PaddedTypography variant="h2">Icon + Text</PaddedTypography>
        <Banner>
          <BannerIcon>
            <Icon name="thumbs_up" />
          </BannerIcon>
          <BannerMessage>
            We are in the making of a new design for this page.
          </BannerMessage>
        </Banner>
      </div>
      <Banner>
        <BannerIcon variant="warning">
          <Icon name="thumbs_down" />
        </BannerIcon>
        <BannerMessage>Some warning information.</BannerMessage>
      </Banner>
      <div>
        <PaddedTypography variant="h2">Text + Action</PaddedTypography>
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
      </div>
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

      <div>
        <PaddedTypography variant="h2">Icon + Text + Actions</PaddedTypography>
        <Banner>
          <BannerIcon variant="warning">
            <Icon name="mood_sad" />
          </BannerIcon>
          <BannerMessage>
            This tag is not being preserved yet. Click start preservation to
            enable writing preservation records.
          </BannerMessage>
          <BannerActions>
            <Button>Action</Button>
          </BannerActions>
        </Banner>
      </div>
      <Banner>
        <BannerIcon>
          <Icon name="save" />
        </BannerIcon>
        <BannerMessage>
          I&apos;m such a really really long message about some sad saving news
          that there is not enough space for the actions on my left. That&apos;s
          why the actions have been located at the bottom using the placement
          prop instead.
        </BannerMessage>
        <InlineBannerActions placement="bottom">
          <Button style={{ marginRight: '1rem' }}>First action</Button>
          <Button color="secondary">Second action</Button>
        </InlineBannerActions>
      </Banner>
    </Wrapper>
  )
}
