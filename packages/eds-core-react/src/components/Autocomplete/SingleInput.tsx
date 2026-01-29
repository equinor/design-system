import { Input } from '../Input'
import { useAutocompleteContext } from './AutocompleteContext'
import { RightAdornments } from './RightAdornments'

export const SingleInput = () => {
  const {
    consolidatedEvents,
    inputProps,
    variant,
    hideClearButton,
    restHtmlProps,
    placeholder,
    readOnly,
  } = useAutocompleteContext()
  return (
    <Input
      variant={variant}
      placeholder={placeholder}
      readOnly={readOnly}
      rightAdornmentsWidth={hideClearButton ? 24 + 8 : 24 * 2 + 8}
      rightAdornments={<RightAdornments />}
      {...restHtmlProps}
      {...inputProps}
      {...consolidatedEvents}
    ></Input>
  )
}
