/**
 * Finds an available step that is not in the usedSteps array
 * @param usedSteps - Array of step numbers that are already in use
 * @param stepCount - Total number of steps in the scale (steps are 1..stepCount)
 * @param preferredStep - The preferred step to use if available (defaults to the middle step)
 * @returns The first available step number (1..stepCount)
 */
export function findAvailableStep(
  usedSteps: number[],
  stepCount: number,
  preferredStep: number = Math.ceil(stepCount / 2),
): number {
  // Ensure preferredStep is within valid range (1..stepCount)
  const validPreferredStep = Math.max(1, Math.min(stepCount, preferredStep))

  // Convert usedSteps to Set for O(1) lookup performance
  const usedStepsSet = new Set(usedSteps)

  // First, check if the preferred step is available
  if (!usedStepsSet.has(validPreferredStep)) {
    return validPreferredStep
  }

  // If not, search from step 1 to stepCount for the first available step
  for (let i = 1; i <= stepCount; i++) {
    if (!usedStepsSet.has(i)) {
      return i
    }
  }

  // This should never happen if usedSteps.length < stepCount, but return the preferred step as fallback
  return validPreferredStep
}
