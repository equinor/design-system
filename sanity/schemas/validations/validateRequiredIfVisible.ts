export const validateRequiredIfVisible = (dependency: boolean, value: string, message: string) => {
  // It's not visible
  if (!dependency) return true

  if (!value) {
    return message
  }

  return true
}
