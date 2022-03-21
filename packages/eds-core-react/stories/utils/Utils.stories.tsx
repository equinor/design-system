import page from './Utils.docs.mdx'
import { Story } from '@storybook/react'
import { HTMLProps } from 'react'

export default {
  title: 'Packages/Utils',
  parameters: {
    docs: {
      page,
    },
  },
}
export const hooks: Story<HTMLProps<HTMLElement>> = () => <div></div>
