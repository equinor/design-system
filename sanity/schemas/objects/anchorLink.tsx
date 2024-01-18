/* eslint-disable @typescript-eslint/ban-ts-comment */
import { anchor } from '@equinor/eds-icons'
import { Rule } from 'sanity'
import { validateComponentAnchor } from '../validations/validateAnchorReference'
import { EdsIcon } from '../../icons'
import { Heading, Text, Box } from '@sanity/ui'
import styled from 'styled-components'

export type AnchorLink = {
  _type: 'anchorLink'
}

const StyledText = styled(Text)`
  margin: 1em 0;
`

const Description = () => {
  return (
    <Box>
      <Heading size={2}>How to use</Heading>
      <StyledText>
        Add this component before the component for which you want to have an anchor reference. The anchor reference
        will be ignored when there is no component following it.
      </StyledText>
    </Box>
  )
}

export default {
  title: 'Anchor Link',
  name: 'anchorLink',
  type: 'object',

  fields: [
    {
      name: 'description',
      type: 'string',
      components: {
        input: Description,
      },
    },
    {
      name: 'anchorReference',
      type: 'anchorReferenceField',
      title: 'Anchor reference',
      validation: (Rule: Rule) =>
        // @ts-ignore
        Rule.custom((value: string, context: any) => validateComponentAnchor(value, context)),
    },
  ],
  preview: {
    select: {
      anchorReference: 'anchorReference',
    },
    prepare({ anchorReference }: { anchorReference: string }) {
      return {
        title: anchorReference,
        subtitle: `Anchor Link component`,
        media: EdsIcon(anchor),
      }
    },
  },
}
