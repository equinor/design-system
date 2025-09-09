import type { StoryObj, Meta } from '@storybook/react-vite'
import styled from 'styled-components'
import { TimePicker, TimePickerProps } from './TimePicker'

const meta: Meta<typeof TimePicker> = {
  title: 'Components/TimePicker',
  component: TimePicker,
}

export default meta

const Container = styled.div`
  height: 360px;
  width: 100%;
  box-sizing: border-box;
`

export const Default: StoryObj<TimePickerProps> = {
  render: (args) => (
    <Container>
      <TimePicker {...args} />
    </Container>
  ),

  args: {
    label: 'Test Time',
    className: 'storyTimePicker',
  },
}
