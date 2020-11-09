// Workaround
// React ignores 'dispathEvent' on input/textarea, see https://github.com/facebook/react/issues/10135
type ReactInternalHack = { _valueTracker?: { setValue: (a: string) => void } }

export const setReactInputValue = (
  input: HTMLInputElement & ReactInternalHack,
  value: string,
): void => {
  const previousValue = input.value

  input.value = value

  const tracker = input._valueTracker

  if (typeof tracker !== 'undefined') {
    tracker.setValue(previousValue)
  }

  //'change' instead of 'input', see https://github.com/facebook/react/issues/11488#issuecomment-381590324
  input.dispatchEvent(new Event('change', { bubbles: true }))
}
