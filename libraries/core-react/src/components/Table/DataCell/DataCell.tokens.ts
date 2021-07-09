import { tokens } from '@equinor/eds-tokens'
import type { ComponentToken } from '@equinor/eds-tokens'

const {
  typography: {
    table: {
      cell_text: cellTypography,
      cell_numeric_monospaced: cellNumericTypography,
    },
  },
  colors: {
    text: {
      static_icons__default: { rgba: typographyColor },
    },
    ui: {
      background__medium: { rgba: borderColor },
    },
    interactive: {
      table__cell__fill_resting: { rgba: backgroundColor },
      table__cell__fill_hover: { rgba: hoverBackgroundColor },
      table__cell__fill_activated: { rgba: activeBackgroundColor },
      danger__highlight: { rgba: errorColor },
      primary__resting: { rgba: primaryRestingColor },
      disabled__text: { rgba: disabledTextColor },
      disabled__border: { rgba: disabledBorderColor },
      focus: { rgba: focusColor },
    },
  },
  spacings: {
    comfortable: { medium },
  },
} = tokens

type Validation = {
  error: Partial<ComponentToken>
}

type Variants = {
  numeric: Partial<ComponentToken>
}

export type TableCellToken = ComponentToken & {
  validation: Validation
  variants: Variants
}

const tableCell: ComponentToken = {
  height: '48px',
  background: backgroundColor,
  border: {
    type: 'bordergroup',
    bottom: {
      color: borderColor,
      width: '1px',
      style: 'solid',
    },
  },
  spacings: {
    top: '0',
    bottom: '0',
    left: medium,
    right: medium,
  },
  typography: {
    ...cellTypography,
    color: typographyColor,
  },
  states: {
    active: {
      background: activeBackgroundColor,
      typography: {
        ...cellTypography,
        color: primaryRestingColor,
      },
      border: {
        bottom: {
          color: primaryRestingColor,
        },
      },
    },
    disabled: {
      typography: {
        ...cellTypography,
        color: disabledTextColor,
      },
      border: {
        type: 'bordergroup',
        bottom: {
          color: disabledBorderColor,
        },
      },
    },
    focus: {
      outline: {
        type: 'outline',
        color: focusColor,
        width: '1px',
        style: 'dashed',
      },
    },
    hover: {
      background: hoverBackgroundColor,
    },
  },
  modes: {
    compact: {
      height: '32px',
      typography: {
        lineHeight: '1rem',
      },
    },
  },
}

const validation: Validation = {
  error: {
    background: errorColor,
  },
}

const variants: Variants = {
  numeric: {
    typography: { ...cellNumericTypography, color: typographyColor },
  },
}

export const token: TableCellToken = {
  ...tableCell,
  validation,
  variants,
}
