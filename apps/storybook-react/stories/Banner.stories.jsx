import React, { Fragment, useState } from 'react'
import styled from 'styled-components'
import { Banner, Icon, Typography, Button } from '@equinor/eds-core-react'
import { save, thumbs_up, mood_sad } from '@equinor/eds-icons'
const icons = {
  save,
  thumbs_up,
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
  title: 'Components|Banner',
  component: Banner,
}

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
          <BannerIcon color="#DEEDEE">
            <Icon name="thumbs_up" color="#007079  " />
          </BannerIcon>
          <BannerMessage>
            We are in the making of a new design for this page.
          </BannerMessage>
        </Banner>
      </div>
      <div>
        <PaddedTypography variant="h2">Text + Action</PaddedTypography>
        <Banner>
          <BannerMessage>
            You are signed on with another account than Equinor account:
            name.lastname@mail.com
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
          <BannerIcon color="#FFE0E7">
            <Icon name="mood_sad" color="#EB0037" />
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
        <BannerIcon color="#FFE0E7">
          <Icon name="save" color="#EB0037" />
        </BannerIcon>
        <BannerMessage>
          I'm such a really really long message about some sad saving news that
          there is not enough space for the actions on my left. That's why the
          actions have been located at the bottom using the placement prop
          instead
        </BannerMessage>
        <InlineBannerActions placement="bottom">
          <Button style={{ marginRight: '1rem' }}>First action</Button>
          <Button color="secondary">Second action</Button>
        </InlineBannerActions>
      </Banner>
    </Wrapper>
  )
}
