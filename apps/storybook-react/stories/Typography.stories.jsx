import React from 'react'
import { storiesOf } from '@storybook/react'
import { Typography } from '@equinor/eds-core-react'
import './../style.css'

storiesOf('General', module).add('Typography', () => (
  <div class="container">
    <Typography variant="h1" bold>
      Headings
    </Typography>
    <div className="flex-rows">
      <div className="group">
        <Typography variant="h1" bold>
          Heading 1 bold
        </Typography>
        <Typography variant="h1">Heading 1</Typography>
        <Typography variant="h2">Heading 2</Typography>
        <Typography variant="h3">Heading 3</Typography>
        <Typography variant="h4">Heading 4</Typography>
        <Typography variant="h5">Heading 5</Typography>
        <Typography variant="h6">Heading 6</Typography>
      </div>
    </div>
    <Typography variant="h1" bold>
      Paragraphs
    </Typography>
    <div className="flex-rows">
      <div className="group">
        <Typography variant="body_short" link>
          Body short link
        </Typography>
        <Typography variant="body_short">Body short</Typography>
        <Typography variant="body_short" italic>
          Body short italic
        </Typography>
        <Typography variant="body_short" bold>
          Body short bold
        </Typography>
        <Typography variant="body_short" bold italic>
          Body short bold italic
        </Typography>
      </div>
      <div className="group">
        <Typography variant="body_long" link>
          Body long link
        </Typography>
        <Typography variant="body_long">Body long</Typography>
        <Typography variant="body_long" italic>
          Body long italic
        </Typography>
        <Typography variant="body_long" bold>
          Body long bold
        </Typography>

        <Typography variant="body_long" bold italic>
          Body long bold italic
        </Typography>
      </div>

      <div className="group">
        <Typography variant="overline">Overline</Typography>
        <Typography variant="ingress">Ingress</Typography>
        <Typography variant="caption">Caption</Typography>
        <Typography variant="meta">Meta</Typography>
      </div>
    </div>
  </div>
))
