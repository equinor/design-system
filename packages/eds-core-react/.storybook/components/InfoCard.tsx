import { Card, Typography, Paper, Button } from '../../src'
import { tokens } from '@equinor/eds-tokens'
import styled from 'styled-components'

const {
  colors: {
    infographic: {
      primary__moss_green_100: { rgba: mossgreen100 },
    },
  },
} = tokens

type InfoCardTypes = {
  title?: string
  description?: string
  url?: string
  urlTitle?: string
}

export const InfoCard = ({
  title,
  description,
  url,
  urlTitle,
}: InfoCardTypes) => (
  <Card style={{ flex: '1' }}>
    <Card.Header>
      <Card.HeaderTitle>
        <Typography variant="h5">{title}</Typography>
      </Card.HeaderTitle>
    </Card.Header>
    <Card.Content>
      <Typography variant="body_short">{description}</Typography>
    </Card.Content>
    <Card.Actions>
      <Button href={url} variant="outlined">
        {urlTitle}
      </Button>
    </Card.Actions>
  </Card>
)
