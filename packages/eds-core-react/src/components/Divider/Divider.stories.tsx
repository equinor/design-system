import styled from 'styled-components'
import { Divider, DividerProps, Card, Typography, Icon } from '../..'
// import { chevron_left, edit_text, more_vertical } from '@equinor/eds-icons'
import { Story, Meta } from '@storybook/react/types-6-0'
import { Stack as SBStack } from './../../../.storybook/components'
import page from './Divider.docs.mdx'

export default {
  title: 'Data Display/Divider',
  component: Divider,
  argTypes: {
    color: { control: 'radio' },
    variant: { control: 'radio' },
  },
  parameters: {
    docs: {
      page,
    },
  },
} as Meta

const Stack = styled(SBStack)`
  /* display: block; */
  padding: 32px;
  /* background-color: #999; */
  background: #ebebeb;
`

export const Introduction: Story<DividerProps> = (args) => (
  <>
    <Divider {...args} />
    <Divider {...args} />
    <Divider {...args} />
  </>
)

export const FullBleed: Story<DividerProps> = () => (
  <Stack>
    <Card style={{ width: '50%' }}>
      <Card.Header style={{ backgroundColor: '#DCDCDC' }}>
        <Card.HeaderTitle>
          <Typography variant="h4">NEWS</Typography>
        </Card.HeaderTitle>
      </Card.Header>
      <Card.Content>
        <Typography variant="caption">Today</Typography>
        <br />
        <Typography variant="overline">
          Leading images are full width.
        </Typography>
        <Typography>
          Use dividers occasionally, to create groupings rather than separate
          individual items. Dividers should be noticeable in a layout, but not
          clashing.
        </Typography>
      </Card.Content>
      <Divider style={{ width: '100%' }} variant="small" />
      <Card.Content>
        <Typography variant="overline">
          Leading images are full width.
        </Typography>
        <Typography>
          Use dividers occasionally, to create groupings rather than separate
          individual items.
        </Typography>
      </Card.Content>
      <Divider style={{ width: '100%' }} variant="small" />
      <Card.Content>
        <Typography variant="overline">
          Leading images are full width.
        </Typography>
        <Typography>
          Use dividers occasionally, to create groupings rather than separate
          individual items. Dividers should only be used if elements can't be
          split using white space.
        </Typography>
      </Card.Content>
    </Card>
  </Stack>
)

/* Is it needed? */
/* export const Color: Story<DividerProps> = () => (
  <Stack>
    <Divider />
    <Divider color="lighter" />
    <Divider color="light" />
  </Stack>
) */

/* export const Small: Story<DividerProps> = () => (
  <Stack>
    <Divider variant="small" />
    <Divider variant="small" />
    <Divider variant="small" />
  </Stack>
) */

/* export const Medium: Story<DividerProps> = () => (
  <Stack>
    <Divider />
    <Divider />
    <Divider />
  </Stack>
) */
