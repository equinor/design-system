// @ts-nocheck
// Workaround
// React ignores 'dispathEvent' on input/textarea, see https://github.com/facebook/react/issues/10135
export const setReactInputValue = (input, value) => {
  const previousValue = input.value

  // eslint-disable-next-line no-param-reassign
  input.value = value

  const tracker = input._valueTracker
  if (tracker) {
    tracker.setValue(previousValue)
  }

  // 'change' instead of 'input', see https://github.com/facebook/react/issues/11488#issuecomment-381590324
  input.dispatchEvent(new Event('change', { bubbles: true }))
}
