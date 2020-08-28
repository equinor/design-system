import React from 'react'
import PropTypes from 'prop-types'
import { Canvas as StorybookPreview } from '@storybook/addon-docs/blocks'

const Preview = ({ children, ...props }) => (
  <StorybookPreview {...props}>{children}</StorybookPreview>
)
