import styled from 'styled-components'
import { Text, Card, Heading, Box } from '@sanity/ui'

const StyledSpan = styled.span`
  display: inline-block;
  padding-right: 5px;

  &:after {
    content: '>';
    padding-left: 5px;
  }

  &:last-child {
    &:after {
      content: '';
    }
  }
`

export const BreadcrumbsPreview = ({ breadcrumbs }: { breadcrumbs: string[] }) => (
  <Box marginTop={2} marginBottom={2}>
    <Heading as="h3" size={0}>
      Preview
    </Heading>
    <Card padding={[3, 3, 4]} radius={2} shadow={1} marginTop={3}>
      <Text size={1}>
        {breadcrumbs.map((item) => (
          <StyledSpan key={item}>{item}</StyledSpan>
        ))}
      </Text>
    </Card>
  </Box>
)
