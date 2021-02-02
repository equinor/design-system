import React, { useState } from 'react'
import { action } from '@storybook/addon-actions'
import styled from 'styled-components'
import { Search, Typography, Button, SearchProps } from '@components'
import { Story, Meta } from '@storybook/react'

const Columns = styled.div`
  display: grid;
  width: 100%;
  grid-gap: 16px;
  grid-auto-flow: column;
  grid-auto-columns: max-content;
`

const Wrapper = styled.div`
  background: lightblue;
  padding: 8px;
  width: 50%;
  height: 100px;
  display: flex;
  align-items: center;
  justify-content: center;
`

const StyledSearch = styled(Search)`
  width: 50%;
  margin-left: 32px;
`

export default {
  title: 'Components/Search',
  component: Search,
  parameters: {
    docs: {
      description: {
        component: `Search allows users to locate or refine content based on simple 
        words or phrases.
        `,
      },
    },
  },
} as Meta

const handleOnChange = action('onChange')
const handleOnBlur = action('onBlur')
const handleOnFocus = action('onFocus')

export const Default: Story<SearchProps> = () => {
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

export const WithOnFocusAndBlur: Story<SearchProps> = () => {
  const [isFocused, setIsFocused] = useState(false)

  const handleFocus = () => {
    setIsFocused(true)
    handleOnFocus()
  }

  const handleBlur = () => {
    setIsFocused(false)
    handleOnBlur()
  }

  return (
    <div
      style={{
        background: isFocused ? 'cyan' : 'transparent',
      }}
    >
      <Typography variant="h4" as="h2">
        I am connected to the search input
      </Typography>
      <Search
        aria-label="Focused and not focused"
        id="search-focusedAndNot"
        placeholder="Search"
        onChange={handleOnChange}
        onFocus={handleFocus}
        onBlur={handleBlur}
      />
    </div>
  )
}
WithOnFocusAndBlur.storyName = 'With on focus and blur'

export const WithPredefinedValue: Story<SearchProps> = () => (
  <Search
    aria-label="predefined"
    id="search-predefined"
    placeholder="Search"
    onChange={handleOnChange}
    defaultValue="Predefined value"
  />
)
WithPredefinedValue.storyName = 'With predefined value'

export const CenteredAndStyled: Story<SearchProps> = () => (
  <Wrapper>
    50% width
    <StyledSearch
      aria-label="contained"
      id="search-contained"
      placeholder="Search"
      onChange={handleOnChange}
    />
  </Wrapper>
)

CenteredAndStyled.storyName = 'Centered and styled'

export const InsideAForm: Story<SearchProps> = () => (
  <form action="/">
    <Search placeholder="Search" onChange={handleOnChange} />
  </form>
)

export const Disabled: Story<SearchProps> = () => (
  <Search
    aria-label="disabled"
    id="search-disabled"
    placeholder="Search"
    onChange={handleOnChange}
    onFocus={handleOnFocus}
    onBlur={handleOnBlur}
    disabled
  />
)
InsideAForm.storyName = 'Inside a form element'

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
      <Typography variant="body_short">Value: {searchValue}</Typography>
      <Columns>
        <Search
          aria-label="external set value"
          id="search-external"
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
      </Columns>
    </>
  )
}
