import { Paper, PaperProps } from '../..'
import { Story, ComponentMeta } from '@storybook/react'
import { Stack } from './../../../.storybook/components'
import page from './Paper.docs.mdx'

export default {
  title: 'Surfaces/Paper',
  component: Paper,
  parameters: {
    docs: {
      page,
    },
  },
} as ComponentMeta<typeof Paper>
