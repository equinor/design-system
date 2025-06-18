const TOTAL_VISIBLE_YEARS = 36
const RANGE_OFFSET = 30 / 2

export const getPageYears = (selectedYear: number, yearPickerPage = 0) => {
  const page = yearPickerPage * TOTAL_VISIBLE_YEARS

  return Array.from(
    { length: TOTAL_VISIBLE_YEARS },
    (_, i) => i + (selectedYear + page - RANGE_OFFSET),
  )
}
