import { useState } from 'react'
import { Pagination, PaginationProps, Button } from '../..'
import { Story, Meta } from '@storybook/react'

export default {
  title: 'Navigation/Pagination',
  component: Pagination,
  parameters: {
    docs: {
      description: {
        component: `Pagination allows long sets of data or content to be
        divided into multiple pages with controls to navigate between these pages.
        `,
      },
    },
  },
  args: {
    totalItems: 40,
  },
  argTypes: {
    totalItems: {
      control: {
        type: 'number',
        min: 10,
        max: 1000,
        step: 1,
      },
    },
  },
} as Meta

export const Default: Story<PaginationProps> = (args) => (
  <Pagination {...args} />
)

export const Truncated: Story<PaginationProps> = () => (
  <Pagination totalItems={8} itemsPerPage={1} />
)

export const WithIndicator: Story<PaginationProps> = () => (
  <Pagination totalItems={140} itemsPerPage={3} withItemIndicator />
)

export const Dynamic: Story<PaginationProps> = () => {
  const [currentPageIndex, setCurrentPageIndex] = useState(6)
  const [itemsPerPage, setItemsPerPage] = useState(10)

  const changePage = (pageIndex) => {
    setCurrentPageIndex(pageIndex)
  }
  const changePageSize = (perPage) => {
    setItemsPerPage(perPage)
  }

  const getVariantForPageSizeButton = (pageSize) => {
    if (pageSize === itemsPerPage) return 'outlined'
    return 'ghost'
  }

  return (
    <>
      <p>
        Current page is: <b>{currentPageIndex}</b>
      </p>
      <div
        style={{
          display: 'flex',
          gap: '8px',
          alignItems: 'center',
          marginBottom: '16px',
        }}
      >
        <p>Items per page:</p>
        <Button
          onClick={() => changePageSize(10)}
          variant={getVariantForPageSizeButton(10)}
        >
          10
        </Button>
        <Button
          onClick={() => changePageSize(20)}
          variant={getVariantForPageSizeButton(20)}
        >
          20
        </Button>
      </div>

      <div>
        <Pagination
          totalItems={100}
          itemsPerPage={itemsPerPage}
          defaultPage={currentPageIndex}
          onChange={(e, p) => changePage(p)}
        />
      </div>
    </>
  )
}
Dynamic.storyName = 'Dynamic itemsPerPage'
Dynamic.parameters = {
  docs: {
    description: {
      story:
        'if `itemsPerPage` changes dynamically, the active page is set to 1',
    },
  },
}
