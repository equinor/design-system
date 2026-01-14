import { bordersTemplate, useIsomorphicLayoutEffect } from '@equinor/eds-utils'
import {
  autoUpdate,
  UseFloatingReturn,
  useInteractions,
} from '@floating-ui/react'
import { useEffect } from 'react'
import styled, { css } from 'styled-components'
import { List } from '../List'
import { AddNewOption } from './AddNewOption'
import { AddSymbol, AllSymbol } from './Autocomplete'
import { useAutocompleteContext } from './AutocompleteContext'
import { Option } from './Option'
import { SelectAllOption } from './SelectAllOption'
import { handleListFocus } from './utils'
import { EmptyOption } from './EmptyOption'

export const OptionList = ({
  refs,
  strategy,
  x,
  y,
  update,
}: UseFloatingReturn) => {
  const { getFloatingProps } = useInteractions([])
  const {
    isOpen,
    getMenuProps,
    multiple,
    scrollContainer,
    dropdownHeight,
    availableItems,
    noOptionsText,
    rowVirtualizer,
    onAddNewOption,
  } = useAutocompleteContext()

  useEffect(() => {
    if (refs.reference.current && refs.floating.current && isOpen) {
      return autoUpdate(refs.reference.current, refs.floating.current, update)
    }
  }, [refs.reference, refs.floating, update, isOpen])

  // MARK: popover toggle
  useIsomorphicLayoutEffect(() => {
    if (isOpen) {
      refs.floating.current?.showPopover()
    } else {
      refs.floating.current?.hidePopover()
    }
  }, [isOpen, refs.floating])

  const showNoOptions =
    isOpen && !availableItems.length && noOptionsText.length > 0

  const floatingProps = getFloatingProps({
    ref: refs.setFloating,
    onFocus: handleListFocus,
    style: {
      position: strategy,
      top: y || 0,
      left: x || 0,
    },
  })

  const menuProps = getMenuProps(
    {
      'aria-multiselectable': multiple ? 'true' : null,
      ref: scrollContainer,
      style: {
        maxHeight: `${dropdownHeight}px`,
      },
    },
    { suppressRefError: true },
  )

  return (
    <StyledPopover popover="manual" {...floatingProps}>
      <StyledList {...menuProps}>
        {showNoOptions && <AutocompleteNoOptions />}
        {isOpen && (
          <li
            key="total-size"
            role="presentation"
            style={{
              height: `${rowVirtualizer.getTotalSize()}px`,
              margin: '0',
              gridArea: '1 / -1',
            }}
          />
        )}
        {!isOpen
          ? null
          : rowVirtualizer.getVirtualItems().map((virtualItem) => {
              const index = virtualItem.index
              const item = availableItems[index]
              if (item === AllSymbol) {
                return (
                  <SelectAllOption key="select-all" item={item} index={index} />
                )
              }
              if (item === AddSymbol && onAddNewOption) {
                return <AddNewOption key="add-item" item={item} index={index} />
              }
              return (
                <Option
                  key={virtualItem.key}
                  item={item}
                  virtualItem={virtualItem}
                  index={index}
                />
              )
            })}
      </StyledList>
    </StyledPopover>
  )
}

const StyledPopover = styled('div').withConfig({
  shouldForwardProp: () => true, //workaround to avoid warning until popover gets added to react types
})<{ popover: string }>`
  inset: unset;
  border: 0;
  padding: 0;
  margin: 0;
  overflow: visible;
  &::backdrop {
    background-color: transparent;
  }
`

const StyledList = styled(List)(
  ({ theme }) => css`
    background-color: ${theme.background};
    box-shadow: ${theme.boxShadow};
    ${bordersTemplate(theme.border)}
    overflow-y: auto;
    overflow-x: hidden;
    padding: 0;
    display: grid;
    /* hack to fix clipping issue in firefox (#3170) */
    @supports (-moz-appearance: none) {
      scrollbar-width: thin;
    }
  `,
)

const AutocompleteNoOptions = styled(EmptyOption)(
  ({ theme }) => css`
    color: ${theme.entities.noOptions.typography.color};
  `,
)
