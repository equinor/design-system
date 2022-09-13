import { useState, useEffect } from 'react'
import { action } from '@storybook/addon-actions'
import { Search, Button, SearchProps, EdsProvider, Density } from '../..'
import { Story, ComponentMeta } from '@storybook/react'
import page from './Search.docs.mdx'

export default {
  title: 'Inputs/Search',
  component: Search,
  parameters: {
    docs: {
      page,
    },
  },
} as ComponentMeta<typeof Search>

const handleOnChange = action('onChange')

export const Introduction: Story<SearchProps> = () => {
  // This story is not interactive, because Search has no props beyond the default HTML ones.
  return (
    <Search
      aria-label="sitewide"
      id="search-normal"
      placeholder="Search"
      onChange={handleOnChange}
    />
  )
}

export const accessibility: Story<SearchProps> = () => (
  <form action="/">
    <Search
      placeholder="Search"
      aria-label="Search for example items"
      onChange={handleOnChange}
    />
  </form>
)

export const Disabled: Story<SearchProps> = () => (
  <Search
    aria-label="disabled"
    id="search-disabled"
    placeholder="Search"
    disabled
  />
)

export const Controlled: Story<SearchProps> = () => {
  const [searchValue, setSearchValue] = useState('Initial value')

  const handleOnSearchValueChange = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const value = event.target.value
    handleOnChange()
    setSearchValue(value)
  }

  return (
    <>
      <Search
        id="search-external"
        aria-label="Search for Hello!"
        placeholder="Say hello! 🙋"
        onChange={handleOnSearchValueChange}
        value={searchValue}
      />
      <Button
        onClick={() => {
          setSearchValue('Hello search! 👋')
          action('Set search value')()
        }}
      >
        Say hello to search!
      </Button>
    </>
  )
}

export const Compact: Story<SearchProps> = () => {
  const [density, setDensity] = useState<Density>('comfortable')

  useEffect(() => {
    // Simulate user change
    setDensity('compact')
  }, [density])

  return (
    <EdsProvider density={density}>
      <Search
        aria-label="compact search example"
        id="search-compact"
        placeholder="Search"
        onChange={handleOnChange}
      />
    </EdsProvider>
  )
}
