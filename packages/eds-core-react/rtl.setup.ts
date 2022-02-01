/* eslint-disable import/no-extraneous-dependencies */
import '@testing-library/jest-dom/extend-expect'
import { toHaveNoViolations } from 'jest-axe'

expect.extend(toHaveNoViolations)
