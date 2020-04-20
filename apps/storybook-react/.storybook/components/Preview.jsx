import React from 'react'
import PropTypes from 'prop-types'
import { Preview as StorybookPreview } from '@storybook/addon-docs/blocks'

const Preview = ({ children, ...props }) => (
  <StorybookPreview {...props}>{children}</StorybookPreview>
)
