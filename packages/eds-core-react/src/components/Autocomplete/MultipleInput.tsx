import { useRef } from 'react'
import styled from 'styled-components'
import { Chip } from '../Chip'
import { Input } from '../Input'
import { useAutocompleteContext } from './AutocompleteContext'
import { RightAdornments } from './RightAdornments'

const UnstyledInput = styled.input`
  flex: 1;
  min-width: 6rem;
  font-size: 1rem;
  border: none;
  padding: 0;
  background: inherit;
  &:focus-visible {
    outline: none;
  }
`

const ChipContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  height: 100%;
`

export const MultipleInput = () => {
  const {
    selectedItems,
    selectionDisplay,
    getLabel,
    removeSelectedItem,
    readOnly,
    inputProps,
    placeholderText,
    variant,
    hideClearButton,
    restHtmlProps,
    consolidatedEvents,
    inputRef,
  } = useAutocompleteContext()

  const chipRefs = useRef<Map<string, HTMLDivElement>>(new Map())

  const handleChipRemove = (
    item: unknown,
    index: number,
    isKeyboardEvent: boolean,
  ) => {
    if (isKeyboardEvent && selectedItems.length > 1) {
      const isLastChip = index === selectedItems.length - 1
      const nextItem = selectedItems[isLastChip ? index - 1 : index + 1]
      chipRefs.current.get(getLabel(nextItem))?.focus()
    } else if (!isKeyboardEvent) {
      inputRef.current?.focus()
    }
    removeSelectedItem(item)
  }

  const handleChipDelete =
    (item: unknown, index: number) =>
    (e: React.KeyboardEvent | React.MouseEvent) => {
      const isKeyboard = 'key' in e && e.key === 'Enter'
      handleChipRemove(item, index, isKeyboard)
    }

  const handleChipClick =
    (item: unknown, index: number) => (e: React.MouseEvent) => {
      e.preventDefault()
      e.stopPropagation()
      handleChipRemove(item, index, false)
    }

  return (
    <Input
      as={'div'}
      variant={variant}
      rightAdornmentsWidth={hideClearButton ? 24 + 8 : 24 * 2 + 8}
      rightAdornments={<RightAdornments />}
      readOnly={readOnly}
      style={{
        height: 'auto',
        minHeight: '36px',
      }}
    >
      <ChipContainer>
        {selectionDisplay === 'chips' &&
          selectedItems.map((item, index) => (
            <Chip
              key={getLabel(item)}
              ref={(el) => {
                if (el) chipRefs.current.set(getLabel(item), el)
                else chipRefs.current.delete(getLabel(item))
              }}
              style={{
                outline: '1px solid var(--eds-color-accent-12)',
              }}
              onDelete={handleChipDelete(item, index)}
              onClick={handleChipClick(item, index)}
              disabled={readOnly}
            >
              {getLabel(item)}
            </Chip>
          ))}
        <UnstyledInput
          {...restHtmlProps}
          {...inputProps}
          {...consolidatedEvents}
          placeholder={placeholderText}
          readOnly={readOnly}
        />
      </ChipContainer>
    </Input>
  )
}
