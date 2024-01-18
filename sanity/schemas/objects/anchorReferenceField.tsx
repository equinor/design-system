/* eslint-disable @typescript-eslint/ban-ts-comment */
import { validateAnchorReference } from '../validations/validateAnchorReference'
import styled from 'styled-components'
import { Rule } from 'sanity'

const StyledSpan = styled.span`
  display: block;
  margin-top: 0.3em;
`

export const AnchorComponentDescription = () => (
  <>
    <StyledSpan>Add an optional anchor reference that can be used to link directly to this component.</StyledSpan>
    <StyledSpan>
      Allowed characters are: letters, numbers, hyphens, and underscores. The # symbol is not needed.
    </StyledSpan>
  </>
)
export const AnchorLinkDescription = () => (
  <>
    <StyledSpan>Optional: add the anchor reference of the component/section you want to link directly to.</StyledSpan>
    <StyledSpan>Results cannot be guaranteed for external URLs.</StyledSpan>
  </>
)

export default {
  name: 'anchorReferenceField',
  title: 'Anchor reference',
  type: 'string',
  description: AnchorComponentDescription(),
  // @ts-ignore - possible error in sanity with CustomValidatorResult
  validation: (Rule: Rule) => Rule.custom((value: string) => validateAnchorReference(value)),
}
