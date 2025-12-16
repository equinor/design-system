import { arrow_drop_up, arrow_drop_down, close } from '@equinor/eds-icons'
import { Icon } from '../Icon'
import { Progress } from '../Progress'
import { useAutocompleteContext } from './AutocompleteContext'
import { StyledButton } from './Autocomplete'

export const RightAdornments = () => {
  const {
    readOnly,
    selectedItems,
    inputValue,
    loading,
    disabled,
    getToggleButtonProps,
    hideClearButton,
    isOpen,
    clear,
  } = useAutocompleteContext()

  const showClearButton =
    (selectedItems.length > 0 || inputValue) && !readOnly && !hideClearButton
  return (
    <>
      {loading && <Progress.Circular size={16} />}
      {showClearButton && (
        <StyledButton
          variant="ghost_icon"
          disabled={disabled || readOnly}
          aria-label={'clear options'}
          title="clear"
          onClick={clear}
        >
          <Icon data={close} size={16} />
        </StyledButton>
      )}
      {!readOnly && (
        <StyledButton
          variant="ghost_icon"
          {...getToggleButtonProps({
            disabled: disabled || readOnly,
          })}
          aria-label={'toggle options'}
          title="open"
        >
          <Icon data={isOpen ? arrow_drop_up : arrow_drop_down}></Icon>
        </StyledButton>
      )}
    </>
  )
}
