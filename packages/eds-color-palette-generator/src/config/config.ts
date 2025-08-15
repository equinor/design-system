// Configuration for color palette generator
// Converted from JSON to TS to allow comments and prettier-ignore directives.
export const config = {
  // prettier-ignore
  lightModeValues: [
    1.0,   // Background [default, subtle] - step 1
    0.96,  // Background [default, subtle] - step 2
    0.88,  // Background [medium] - step 3
    0.84,  // Background [medium] - step 4
    0.8,   // Background [medium] - step 5
    0.82,   // Border - step 6
    0.7,   // Border - step 7
    0.66,  // Border - step 8
    0.6,   // Background [strong] - step 9 
    0.58,  // Background [strong] - step 10
    0.53,  // Background [strong] - step 11
    0.5,   // Text default [subtle, strong] - step 12
    0.35,  // Text default [subtle, strong] - step 13
    0.97,  // Text inverse [subtle, strong] - step 14
    0.99,  // Text inverse [subtle, strong] - step 15
  ],
  // prettier-ignore
  darkModeValues: [
    0.15,  // Background [default, subtle] - step 1
    0.25,  // Background [default, subtle] - step 2
    0.45,  // Background [medium] - step 3
    0.48,  // Background [medium] - step 4
    0.5,   // Background [medium] - step 5
    0.63,  // Border - step 6 
    0.66,  // Border - step 7 
    0.68,  // Border - step 8
    0.78,  // Background [strong] - step 9
    0.85,  // Background [strong] - step 10
    0.92,  // Background [strong] - step 11
    0.91,  // Text default [subtle, strong] - step 12
    0.99,  // Text default [subtle, strong] - step 13
    0.18,  // Text inverse [subtle, strong] - step 14
    0.1,   // Text inverse [subtle, strong] - step 15
  ],
  mean: 0.7,
  stdDev: 2,
  colors: [
    { name: 'Moss Green', hex: '#007079' },
    { name: 'Gray', hex: '#4A4A4A' },
    { name: 'Green', hex: '#3FA13D' },
    { name: 'Blue', hex: '#0084C4' },
    { name: 'Orange', hex: '#E57E00' },
    { name: 'Red', hex: '#E20337' },
  ],
}

export default config
