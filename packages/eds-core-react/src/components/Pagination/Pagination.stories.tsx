import { useState } from 'react'
import { Pagination, PaginationProps, Button } from '../..'
import { StoryFn, Meta } from '@storybook/react-vite'
import page from './Pagination.docs.mdx'

const meta: Meta<typeof Pagination> = {
  title: 'Navigation/Pagination',
  component: Pagination,
  parameters: {
    docs: {
      page,
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
}

export default meta

export const Introduction: StoryFn<PaginationProps> = (args) => (
  <Pagination {...args} />
)

export const Truncated: StoryFn<PaginationProps> = () => (
  <Pagination totalItems={8} itemsPerPage={1} />
)

export const WithIndicator: StoryFn<PaginationProps> = () => (
  <Pagination totalItems={140} itemsPerPage={3} withItemIndicator />
)
WithIndicator.storyName = 'With indicator'

export const Dynamic: StoryFn<PaginationProps> = () => {
  const [currentPageIndex, setCurrentPageIndex] = useState(6)
  const [itemsPerPage, setItemsPerPage] = useState(10)

  const changePage = (pageIndex: number) => {
    setCurrentPageIndex(pageIndex)
  }
  const changePageSize = (perPage: number) => {
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
