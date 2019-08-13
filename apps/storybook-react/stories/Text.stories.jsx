import React from 'react'
import { storiesOf } from '@storybook/react'
import { Text } from '@equinor/eds-core-react'
import './text.css'

storiesOf('Components', module).add('Typography', () => (
  <div>
    <div className="group">
      <Text variant="h1" bold>
        Heading 1 bold
      </Text>
      <Text variant="h1">Heading 1</Text>
      <Text variant="h2">Heading 2</Text>
      <Text variant="h3">Heading 3</Text>
      <Text variant="h4">Heading 4</Text>
      <Text variant="h5">Heading 5</Text>
      <Text variant="h6">Heading 6</Text>
    </div>

    <div className="group">
      <Text variant="body_short" link>
        Body short link
      </Text>
      <Text variant="body_short">Body short</Text>
      <Text variant="body_short" italic>
        Body short italic
      </Text>
      <Text variant="body_short" bold>
        Body short bold
      </Text>
      <Text variant="body_short" bold italic>
        Body short bold italic
      </Text>
    </div>
    <div className="group">
      <Text variant="body_long" link>
        Body long link
      </Text>
      <Text variant="body_long">Body long</Text>
      <Text variant="body_long" italic>
        Body long italic
      </Text>
      <Text variant="body_long" bold>
        Body long bold
      </Text>

      <Text variant="body_long" bold italic>
        Body long bold italic
      </Text>
    </div>
    <div className="group">
      <Text variant="overline">Overline</Text>
      <Text variant="ingress">Ingress</Text>
      <Text variant="caption">Caption</Text>
      <Text variant="meta">Meta</Text>
    </div>
  </div>
))
