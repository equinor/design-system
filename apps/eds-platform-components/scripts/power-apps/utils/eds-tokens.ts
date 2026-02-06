/**
 * EDS Token Mapping for Power Apps
 * Maps Equinor Design System tokens to Power Apps RGBA color format
 */

export type EDSColor = {
  hex: string
  rgba: string
  powerFx: string
}

/**
 * Converts hex color to Power Apps RGBA format
 */
export const hexToRGBA = (hex: string, alpha: number = 1): string => {
  const hexValue = hex.replace('#', '')
  const r = parseInt(hexValue.substring(0, 2), 16)
  const g = parseInt(hexValue.substring(2, 4), 16)
  const b = parseInt(hexValue.substring(4, 6), 16)
  return `RGBA(${r}, ${g}, ${b}, ${alpha})`
}

/**
 * EDS Color Tokens
 * Based on @equinor/eds-tokens
 */
export const EDSColors = {
  // Primary colors
  primary: {
    resting: {
      hex: '#007079',
      rgba: 'RGBA(0, 112, 121, 1)',
      powerFx: 'RGBA(0, 112, 121, 1)',
    },
    hover: {
      hex: '#004F55',
      rgba: 'RGBA(0, 79, 85, 1)',
      powerFx: 'RGBA(0, 79, 85, 1)',
    },
    disabled: {
      hex: '#DCDCDC',
      rgba: 'RGBA(220, 220, 220, 1)',
      powerFx: 'RGBA(220, 220, 220, 1)',
    },
  },
  // Secondary colors
  secondary: {
    resting: {
      hex: '#243746',
      rgba: 'RGBA(36, 55, 70, 1)',
      powerFx: 'RGBA(36, 55, 70, 1)',
    },
    hover: {
      hex: '#1A2A37',
      rgba: 'RGBA(26, 42, 55, 1)',
      powerFx: 'RGBA(26, 42, 55, 1)',
    },
  },
  // Danger colors
  danger: {
    resting: {
      hex: '#EB0037',
      rgba: 'RGBA(235, 0, 55, 1)',
      powerFx: 'RGBA(235, 0, 55, 1)',
    },
    hover: {
      hex: '#B30027',
      rgba: 'RGBA(179, 0, 39, 1)',
      powerFx: 'RGBA(179, 0, 39, 1)',
    },
  },
  // Text colors
  text: {
    primary: {
      hex: '#3D3D3D',
      rgba: 'RGBA(61, 61, 61, 1)',
      powerFx: 'RGBA(61, 61, 61, 1)',
    },
    secondary: {
      hex: '#6F6F6F',
      rgba: 'RGBA(111, 111, 111, 1)',
      powerFx: 'RGBA(111, 111, 111, 1)',
    },
    disabled: {
      hex: '#BEBEBE',
      rgba: 'RGBA(190, 190, 190, 1)',
      powerFx: 'RGBA(190, 190, 190, 1)',
    },
    staticIconsDefault: {
      hex: '#FFFFFF',
      rgba: 'RGBA(255, 255, 255, 1)',
      powerFx: 'RGBA(255, 255, 255, 1)',
    },
  },
  // Background colors
  background: {
    default: {
      hex: '#FFFFFF',
      rgba: 'RGBA(255, 255, 255, 1)',
      powerFx: 'RGBA(255, 255, 255, 1)',
    },
    light: {
      hex: '#F7F7F7',
      rgba: 'RGBA(247, 247, 247, 1)',
      powerFx: 'RGBA(247, 247, 247, 1)',
    },
  },
  // Border colors
  border: {
    light: {
      hex: '#DCDCDC',
      rgba: 'RGBA(220, 220, 220, 1)',
      powerFx: 'RGBA(220, 220, 220, 1)',
    },
    medium: {
      hex: '#DCDCDC',
      rgba: 'RGBA(220, 220, 220, 1)',
      powerFx: 'RGBA(220, 220, 220, 1)',
    },
    strong: {
      hex: '#6F6F6F',
      rgba: 'RGBA(111, 111, 111, 1)',
      powerFx: 'RGBA(111, 111, 111, 1)',
    },
  },
}

/**
 * EDS Typography Tokens
 */
export const EDSTypography = {
  button: {
    fontSize: 16,
    fontWeight: 500,
    fontFamily: 'Equinor',
    lineHeight: 1.5,
  },
  label: {
    fontSize: 12,
    fontWeight: 500,
    fontFamily: 'Equinor',
    lineHeight: 1.33,
  },
}

/**
 * EDS Spacing Tokens (in pixels)
 */
export const EDSSpacing = {
  xs: 4,
  small: 8,
  medium: 16,
  large: 24,
  xl: 32,
  xxl: 40,
}

/**
 * EDS Shape Tokens
 */
export const EDSShape = {
  borderRadius: {
    small: 4,
    medium: 8,
    circle: 9999,
  },
}

/**
 * EDS Elevation/Shadow (approximated for Power Apps)
 */
export const EDSElevation = {
  raised: {
    // Shadow approximation - Power Apps doesn't have full shadow support
    // This is a visual guidance value
    description: 'Subtle elevation effect',
  },
  overlay: {
    description: 'Elevated overlay effect',
  },
}
