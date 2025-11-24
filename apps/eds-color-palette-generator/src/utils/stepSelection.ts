/**
 * Finds an available step that is not in the usedSteps array
 * @param usedSteps - Array of step numbers that are already in use
 * @param preferredStep - The preferred step to use if available (defaults to 8, the middle step)
 * @returns The first available step number (1-15)
 */
export function findAvailableStep(
  usedSteps: number[],
  preferredStep: number = 8,
): number {
  // Ensure preferredStep is within valid range (1-15)
  const validPreferredStep = Math.max(1, Math.min(15, preferredStep))

  // First, check if the preferred step is available
  if (!usedSteps.includes(validPreferredStep)) {
    return validPreferredStep
  }

  // If not, search from step 1 to 15 for the first available step
  // Convert usedSteps to Set for O(1) lookup performance
  const usedStepsSet = new Set(usedSteps)
  for (let i = 1; i <= 15; i++) {
    if (!usedStepsSet.has(i)) {
      return i
    }
  }

  // This should never happen if usedSteps.length < 15, but return the preferred step as fallback
  return validPreferredStep
}
