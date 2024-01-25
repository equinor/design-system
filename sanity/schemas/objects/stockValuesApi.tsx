import { dollar } from '@equinor/eds-icons'
import { Box, Heading, Text } from '@sanity/ui'
import styled from 'styled-components'
import { EdsIcon } from '../../icons'
import type { ColorSelectorValue } from '../components/ColorSelector'

const StyledText = styled(Text)`
  margin: 1em 0;
`

// eslint-disable-next-line react/display-name
const ApiDescription = () => {
  return (
    <Box>
      <Heading size={2}>How to use</Heading>
      <StyledText>
        This component will automatically display up to date Equinor stock values from the OSE and NYSE. No
        configuration is required.
      </StyledText>
    </Box>
  )
}

export type StockValues = {
  _type: 'stockValuesApi'
  description: string
  background?: ColorSelectorValue
}

export default {
  title: 'Stock values',
  description: 'This component will automatically display up to date Equinor stock values from the OSE and NYSE.',
  name: 'stockValuesApi',
  type: 'object',
  fieldsets: [
    {
      title: 'Design options',
      name: 'design',
    },
  ],
  fields: [
    {
      name: 'description',
      type: 'string',
      components: {
        input: ApiDescription,
      },
    },
    {
      title: 'Background',
      description: 'Pick a colour for the background. Default is white.',
      name: 'background',
      type: 'colorlist',
      fieldset: 'design',
    },
  ],
  preview: {
    prepare() {
      return {
        title: 'Stock values component',
        subtitle: 'Automatic Equinor stock values from the OSE and NYSE',
        media: EdsIcon(dollar),
      }
    },
  },
}
