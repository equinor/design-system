import styled from 'styled-components'
import { Divider, Paper, PaperProps, Typography } from '../..'
import { Story, ComponentMeta } from '@storybook/react'
import { Stack as SBStack } from './../../../.storybook/components'
import page from './Paper.docs.mdx'

export default {
  title: 'Surfaces/Paper',
  component: Paper,
  parameters: {
    docs: {
      page,
    },
  },
} as ComponentMeta<typeof Paper>

const Stack = styled(SBStack)`
  padding: 32px;
  background: #ebebeb;
`

const Wrapper = styled(Paper)`
  height: 150px;
  width: 150px;
`
const WrapperOverview = styled(Paper)`
  height: 150px;
  width: 50px;
  padding: 10px;
`

export const Introduction: Story<PaperProps> = (args) => (
  <Stack>
    <Wrapper {...args}>
      <Paper {...args} />
    </Wrapper>
  </Stack>
)

export const ElevationOverview: Story<PaperProps> = () => (
  <Stack>
    <WrapperOverview elevation="none">
      <Typography variant="overline">none</Typography>
      <Divider />
      <Typography variant="caption">0.0px 0.0px 1.0px 0px</Typography>
      <Paper elevation="none" />
    </WrapperOverview>
    <WrapperOverview elevation="raised">
      <Typography variant="overline">raised</Typography>
      <Divider />
      <Typography variant="caption">0.0px 1.0px 5.0px 0px</Typography>
      <Typography variant="caption" style={{ opacity: '0.8' }}>
        0.0px 3.0px 4.0px 0px
      </Typography>
      <Typography variant="caption">0.0px 2.0px 4.0px 0px</Typography>
      <Paper elevation="raised" />
    </WrapperOverview>
    <WrapperOverview elevation="overlay">
      <Typography variant="overline">overlay</Typography>
      <Divider />
      <Typography variant="caption">0.0px 1.0px 10.0px 0px</Typography>
      <Typography variant="caption" style={{ opacity: '0.8' }}>
        0.0px 4.0px 5.0px 0px
      </Typography>
      <Typography variant="caption">0.0px 2.0px 4.0px 0px</Typography>
      <Paper elevation="overlay" />
    </WrapperOverview>
    <WrapperOverview elevation="sticky">
      <Typography variant="overline">sticky</Typography>
      <Divider />
      <Typography variant="caption">0.0px 4.0px 5.0px 0px</Typography>
      <Typography variant="caption" style={{ opacity: '0.8' }}>
        0.0px 3.0px 14.0px 0px
      </Typography>
      <Typography variant="caption">0.0px 8.0px 10.0px 0px</Typography>
      <Paper elevation="sticky" />
    </WrapperOverview>
    <WrapperOverview elevation="temporary_nav">
      <Typography variant="overline">temporary_nav</Typography>
      <Divider />
      <Typography variant="caption">0.0px 7.0px 8.0px 0px</Typography>
      <Typography variant="caption" style={{ opacity: '0.8' }}>
        0.0px 5.0px 22.0px 0px
      </Typography>
      <Typography variant="caption">0.0px 12.0px 17.0px 0px</Typography>
      <Paper elevation="temporary_nav" />
    </WrapperOverview>
    <WrapperOverview elevation="above_scrim">
      <Typography variant="overline">above_scrim</Typography>
      <Divider />
      <Typography variant="caption">0.0px 11.0px 15.0px 0px</Typography>
      <Typography variant="caption" style={{ opacity: '0.8' }}>
        0.0px 9.0px 46.0px 0px
      </Typography>
      <Typography variant="caption">0.0px 24.0px 38.0px 0px</Typography>
      <Paper elevation="above_scrim" />
    </WrapperOverview>
  </Stack>
)
ElevationOverview.storyName = 'Elevation overview'
