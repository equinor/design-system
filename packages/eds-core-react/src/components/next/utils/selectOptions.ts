/**
 * Returns the display label for an option.
 * Handles both typed options (via getOptionLabel) and raw strings (custom values).
 */
export function resolveOptionLabel<T>(
  option: T | string,
  getOptionLabel?: (option: T) => string,
): string {
  if (typeof option === 'string') return option
  return getOptionLabel ? getOptionLabel(option) : String(option)
}

/**
 * Returns a stable string key for an option, used as React key and for identity checks.
 * Prefers getOptionValue when provided, falls back to the display label.
 */
export function resolveOptionKey<T>(
  option: T,
  getOptionValue?: (option: T) => string,
  getOptionLabel?: (option: T) => string,
): string {
  if (getOptionValue) return getOptionValue(option)
  return resolveOptionLabel(option, getOptionLabel)
}

/**
 * Returns whether an option is disabled.
 */
export function isOptionDisabled<T>(
  option: T,
  optionDisabled?: (option: T) => boolean,
): boolean {
  return optionDisabled?.(option) ?? false
}

/**
 * Default case-insensitive substring filter.
 * Returns true if the option's label contains the input value.
 */
export function defaultOptionsFilter<T>(
  option: T | string,
  inputValue: string,
  getOptionLabel?: (option: T) => string,
): boolean {
  return resolveOptionLabel(option, getOptionLabel)
    .toLowerCase()
    .includes(inputValue.toLowerCase())
}
