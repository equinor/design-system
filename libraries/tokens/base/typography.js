/**
 * @typedef {Partial<Pick<import('csstype').Properties<number | string>
 * , 'color'
 * | 'fontFamily'
 * | 'fontSize'
 * | 'fontWeight'
 * | 'fontStyle'
 * | 'fontFeatureSettings'
 * | 'lineHeight'
 * | 'letterSpacing'
 * | 'textDecoration'
 * | 'textTransform'>>} TypographyData
 */

export const typography = {
  heading: {
    /** @type {TypographyData} */
    h1_bold: {
      color: 'rgba(61, 61, 61, 1)',
      fontFamily: 'Equinor',
      fontSize: '2.000rem',
      fontWeight: 700,
      lineHeight: '1.500em',
    },

    /** @type {TypographyData} */
    h1: {
      color: 'rgba(61, 61, 61, 1)',
      fontFamily: 'Equinor',
      fontSize: '2.000rem',
      fontWeight: 400,
      lineHeight: '1.500em',
    },

    /** @type {TypographyData} */
    h2: {
      color: 'rgba(61, 61, 61, 1)',
      fontFamily: 'Equinor',
      fontSize: '1.750rem',
      fontWeight: 400,
      lineHeight: '1.429em',
    },

    /** @type {TypographyData} */
    h3: {
      color: 'rgba(61, 61, 61, 1)',
      fontFamily: 'Equinor',
      fontSize: '1.500rem',
      fontWeight: 400,
      lineHeight: '1.667em',
    },

    /** @type {TypographyData} */
    h4: {
      color: 'rgba(61, 61, 61, 1)',
      fontFamily: 'Equinor',
      fontSize: '1.250rem',
      fontWeight: 400,
      lineHeight: '1.600em',
    },

    /** @type {TypographyData} */
    h5: {
      color: 'rgba(61, 61, 61, 1)',
      fontFamily: 'Equinor',
      fontSize: '1.125rem',
      fontWeight: 500,
      letterSpacing: '0.013em',
      lineHeight: '1.333em',
    },

    /** @type {TypographyData} */
    h6: {
      color: 'rgba(61, 61, 61, 1)',
      fontFamily: 'Equinor',
      fontSize: '1.000rem',
      fontWeight: 500,
      letterSpacing: '0.013em',
      lineHeight: '1.500em',
    },
  },
  navigation: {
    /** @type {TypographyData} */
    menu_title: {
      color: 'rgba(61, 61, 61, 1)',
      fontFamily: 'Equinor',
      fontSize: '1.000rem',
      fontWeight: 400,
      letterSpacing: '0.013em',
      lineHeight: '1.000em',
    },

    /** @type {TypographyData} */
    menu_tabs: {
      color: 'rgba(61, 61, 61, 1)',
      fontFamily: 'Equinor',
      fontSize: '1.000rem',
      fontWeight: 500,
      letterSpacing: '0.013em',
      lineHeight: '1.000em',
    },

    /** @type {TypographyData} */
    label: {
      color: 'rgba(0, 0, 0, 1)',
      fontFamily: 'Equinor',
      fontSize: '0.688rem',
      fontWeight: 400,
      lineHeight: '1.455em',
    },

    /** @type {TypographyData} */
    drawer_active: {
      color: 'rgba(0, 0, 0, 1)',
      fontFamily: 'Equinor',
      fontSize: '0.750rem',
      fontWeight: 700,
      letterSpacing: '0.006em',
      lineHeight: '1.333em',
    },

    /** @type {TypographyData} */
    drawer_inactive: {
      color: 'rgba(0, 0, 0, 1)',
      fontFamily: 'Equinor',
      fontSize: '0.750rem',
      fontWeight: 500,
      letterSpacing: '0.013em',
      lineHeight: '1.333em',
    },

    /** @type {TypographyData} */
    button: {
      color: 'rgba(0, 0, 0, 1)',
      fontFamily: 'Equinor',
      fontSize: '0.875rem',
      fontWeight: 500,
      lineHeight: '1.143em',
    },

    /** @type {TypographyData} */
    breadcrumb: {
      color: 'rgba(0, 0, 0, 1)',
      fontFamily: 'Equinor',
      fontSize: '0.875rem',
      fontWeight: 500,
      lineHeight: '1.143em',
    },

    /** @type {TypographyData} */
    breadcrumb_hover: {
      color: 'rgba(0, 0, 0, 1)',
      fontFamily: 'Equinor',
      fontSize: '0.875rem',
      fontWeight: 500,
      lineHeight: '1.143em',
      textDecoration: 'UNDERLINE',
    },
  },
  input: {
    /** @type {TypographyData} */
    label: {
      color: 'rgba(0, 0, 0, 1)',
      fontFamily: 'Equinor',
      fontSize: '0.750rem',
      fontWeight: 400,
      lineHeight: '1.333em',
    },

    /** @type {TypographyData} */
    text: {
      color: 'rgba(0, 0, 0, 1)',
      fontFamily: 'Equinor',
      fontSize: '1.000rem',
      fontWeight: 400,
      letterSpacing: '0.025em',
      lineHeight: '1.500em',
    },

    /** @type {TypographyData} */
    text_monospaced: {
      fontFeatureSettings: "'tnum' on, 'lnum' on",
      color: 'rgba(0, 0, 0, 1)',
      fontFamily: 'Equinor',
      fontSize: '1.000rem',
      fontWeight: 400,
      letterSpacing: '0.063em',
      lineHeight: '1.500em',
    },

    /** @type {TypographyData} */
    helper: {
      color: 'rgba(0, 0, 0, 1)',
      fontFamily: 'Equinor',
      fontSize: '0.688rem',
      fontWeight: 400,
      letterSpacing: '0.013em',
      lineHeight: '1.455em',
    },
  },
  paragraph: {
    /** @type {TypographyData} */
    body_short_italic: {
      color: 'rgba(61, 61, 61, 1)',
      fontFamily: 'Equinor',
      fontSize: '1.000rem',
      fontWeight: 400,
      lineHeight: '1.250em',
      fontStyle: 'italic',
    },

    /** @type {TypographyData} */
    caption: {
      color: 'rgba(61, 61, 61, 1)',
      fontFamily: 'Equinor',
      fontSize: '0.875rem',
      fontWeight: 400,
      lineHeight: '1.143em',
    },

    /** @type {TypographyData} */
    meta: {
      color: 'rgba(61, 61, 61, 1)',
      fontFamily: 'Equinor',
      fontSize: '0.625rem',
      fontWeight: 400,
      lineHeight: '1.600em',
    },

    /** @type {TypographyData} */
    body_short: {
      color: 'rgba(61, 61, 61, 1)',
      fontFamily: 'Equinor',
      fontSize: '1.000rem',
      fontWeight: 400,
      lineHeight: '1.250em',
    },

    /** @type {TypographyData} */
    body_short_bold_italic: {
      color: 'rgba(61, 61, 61, 1)',
      fontFamily: 'Equinor',
      fontSize: '1.000rem',
      fontWeight: 700,
      lineHeight: '1.250em',
      fontStyle: 'italic',
    },

    /** @type {TypographyData} */
    body_short_bold: {
      color: 'rgba(61, 61, 61, 1)',
      fontFamily: 'Equinor',
      fontSize: '1.000rem',
      fontWeight: 700,
      lineHeight: '1.250em',
    },

    /** @type {TypographyData} */
    body_short_link: {
      color: 'rgba(0, 112, 121, 1)',
      fontFamily: 'Equinor',
      fontSize: '1.000rem',
      fontWeight: 400,
      lineHeight: '1.250em',
      textDecoration: 'UNDERLINE',
    },

    /** @type {TypographyData} */
    overline: {
      color: 'rgba(61, 61, 61, 1)',
      fontFamily: 'Equinor',
      fontSize: '0.625rem',
      fontWeight: 500,
      letterSpacing: '0.069em',
      lineHeight: '1.600em',
      textTransform:
        /** @type {import('csstype').TextTransformProperty} */ ('uppercase'),
    },

    /** @type {TypographyData} */
    ingress: {
      color: 'rgba(61, 61, 61, 1)',
      fontFamily: 'Equinor',
      fontSize: '1.125rem',
      fontWeight: 400,
      lineHeight: '1.333em',
    },

    /** @type {TypographyData} */
    body_long: {
      color: 'rgba(61, 61, 61, 1)',
      fontFamily: 'Equinor',
      fontSize: '1.000rem',
      fontWeight: 400,
      lineHeight: '1.500em',
    },

    /** @type {TypographyData} */
    body_long_link: {
      color: 'rgba(0, 112, 121, 1)',
      fontFamily: 'Equinor',
      fontSize: '1.000rem',
      fontWeight: 400,
      lineHeight: '1.500em',
      textDecoration: 'UNDERLINE',
    },

    /** @type {TypographyData} */
    body_long_italic: {
      color: 'rgba(61, 61, 61, 1)',
      fontFamily: 'Equinor',
      fontSize: '1.000rem',
      fontWeight: 400,
      lineHeight: '1.500em',
      fontStyle: 'italic',
    },

    /** @type {TypographyData} */
    body_long_bold: {
      color: 'rgba(61, 61, 61, 1)',
      fontFamily: 'Equinor',
      fontSize: '1.000rem',
      fontWeight: 700,
      lineHeight: '1.500em',
    },

    /** @type {TypographyData} */
    body_long_bold_italic: {
      color: 'rgba(61, 61, 61, 1)',
      fontFamily: 'Equinor',
      fontSize: '1.000rem',
      fontWeight: 700,
      lineHeight: '1.500em',
      fontStyle: 'italic',
    },
  },
  table: {
    /** @type {TypographyData} */
    cell_header: {
      color: 'rgba(0, 0, 0, 1)',
      fontFamily: 'Equinor',
      fontSize: '0.875rem',
      fontWeight: 500,
      lineHeight: '1.714em',
    },

    /** @type {TypographyData} */
    cell_text: {
      color: 'rgba(0, 0, 0, 1)',
      fontFamily: 'Equinor',
      fontSize: '0.875rem',
      fontWeight: 400,
      lineHeight: '1.714em',
    },

    /** @type {TypographyData} */
    cell_text_bold: {
      color: 'rgba(0, 0, 0, 1)',
      fontFamily: 'Equinor',
      fontSize: '0.875rem',
      fontWeight: 700,
      lineHeight: '1.714em',
    },

    /** @type {TypographyData} */
    cell_text_link: {
      color: 'rgba(0, 0, 0, 1)',
      fontFamily: 'Equinor',
      fontSize: '0.875rem',
      fontWeight: 400,
      lineHeight: '1.714em',
      textDecoration: 'UNDERLINE',
    },

    /** @type {TypographyData} */
    cell_numeric_monospaced: {
      fontFeatureSettings: "'tnum' on, 'lnum' on",
      color: 'rgba(0, 0, 0, 1)',
      fontFamily: 'Equinor',
      fontSize: '0.875rem',
      fontWeight: 400,
      lineHeight: '1.429em',
    },
  },
  ui: {
    /** @type {TypographyData} */
    tooltip: {
      color: 'rgba(61, 61, 61, 1)',
      fontFamily: 'Equinor',
      fontSize: '0.750rem',
      fontWeight: 500,
      lineHeight: '1.333em',
    },

    /** @type {TypographyData} */
    snackbar: {
      color: 'rgba(61, 61, 61, 1)',
      fontFamily: 'Equinor',
      fontSize: '0.750rem',
      fontWeight: 400,
      lineHeight: '1.333em',
    },

    /** @type {TypographyData} */
    accordion_header: {
      color: 'rgba(61, 61, 61, 1)',
      fontFamily: 'Equinor',
      fontSize: '1.000rem',
      fontWeight: 500,
      lineHeight: '1.500em',
    },

    /** @type {TypographyData} */
    chip__badge: {
      color: 'rgba(61, 61, 61, 1)',
      fontFamily: 'Equinor',
      fontSize: '0.750rem',
      fontWeight: 400,
      lineHeight: '1.333em',
    },

    /** @type {TypographyData} */
    chart: {
      color: 'rgba(61, 61, 61, 1)',
      fontFamily: 'Equinor',
      fontSize: '0.750rem',
      fontWeight: 400,
      lineHeight: '1.333em',
    },
  },
}
