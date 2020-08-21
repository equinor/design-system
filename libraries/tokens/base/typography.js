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
      textAlign: 'left',
    },

    /** @type {TypographyData} */
    h1: {
      color: 'rgba(61, 61, 61, 1)',
      fontFamily: 'Equinor',
      fontSize: '2.000rem',
      fontWeight: 400,
      lineHeight: '1.500em',
      textAlign: 'left',
    },

    /** @type {TypographyData} */
    h2: {
      color: 'rgba(61, 61, 61, 1)',
      fontFamily: 'Equinor',
      fontSize: '1.750rem',
      fontWeight: 400,
      lineHeight: '1.429em',
      textAlign: 'left',
    },

    /** @type {TypographyData} */
    h3: {
      color: 'rgba(61, 61, 61, 1)',
      fontFamily: 'Equinor',
      fontSize: '1.500rem',
      fontWeight: 400,
      lineHeight: '1.667em',
      textAlign: 'left',
    },

    /** @type {TypographyData} */
    h4: {
      color: 'rgba(61, 61, 61, 1)',
      fontFamily: 'Equinor',
      fontSize: '1.250rem',
      fontWeight: 400,
      lineHeight: '1.600em',
      textAlign: 'left',
    },

    /** @type {TypographyData} */
    h5: {
      color: 'rgba(61, 61, 61, 1)',
      fontFamily: 'Equinor',
      fontSize: '1.125rem',
      fontWeight: 500,
      letterSpacing: '0.013em',
      lineHeight: '1.333em',
      textAlign: 'left',
    },

    /** @type {TypographyData} */
    h6: {
      color: 'rgba(61, 61, 61, 1)',
      fontFamily: 'Equinor',
      fontSize: '1.000rem',
      fontWeight: 500,
      letterSpacing: '0.013em',
      lineHeight: '1.500em',
      textAlign: 'left',
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
      textAlign: 'left',
    },

    /** @type {TypographyData} */
    menu_tabs: {
      color: 'rgba(61, 61, 61, 1)',
      fontFamily: 'Equinor',
      fontSize: '1.000rem',
      fontWeight: 500,
      letterSpacing: '0.013em',
      lineHeight: '1.000em',
      textAlign: 'left',
    },

    /** @type {TypographyData} */
    label: {
      color: 'rgba(0, 0, 0, 1)',
      fontFamily: 'Equinor',
      fontSize: '0.750rem',
      fontWeight: 500,
      lineHeight: '1.333em',
      textAlign: 'left',
    },

    /** @type {TypographyData} */
    drawer_active: {
      color: 'rgba(0, 0, 0, 1)',
      fontFamily: 'Equinor',
      fontSize: '1.000rem',
      fontWeight: 700,
      letterSpacing: '0.006em',
      lineHeight: '1.000em',
      textAlign: 'left',
    },

    /** @type {TypographyData} */
    drawer_inactive: {
      color: 'rgba(0, 0, 0, 1)',
      fontFamily: 'Equinor',
      fontSize: '1.000rem',
      fontWeight: 500,
      letterSpacing: '0.013em',
      lineHeight: '1.000em',
      textAlign: 'left',
    },

    /** @type {TypographyData} */
    button: {
      color: 'rgba(0, 0, 0, 1)',
      fontFamily: 'Equinor',
      fontSize: '0.875rem',
      fontWeight: 500,
      lineHeight: '1.143em',
      textAlign: 'left',
    },

    /** @type {TypographyData} */
    breadcrumb: {
      color: 'rgba(0, 0, 0, 1)',
      fontFamily: 'Equinor',
      fontSize: '0.875rem',
      fontWeight: 500,
      lineHeight: '1.143em',
      textAlign: 'left',
    },

    /** @type {TypographyData} */
    breadcrumb_hover: {
      color: 'rgba(0, 0, 0, 1)',
      fontFamily: 'Equinor',
      fontSize: '0.875rem',
      fontWeight: 500,
      lineHeight: '1.143em',
      textDecoration: 'underline',
      textAlign: 'left',
    },
  },
  input: {
    /** @type {TypographyData} */
    label: {
      color: 'rgba(0, 0, 0, 1)',
      fontFamily: 'Equinor',
      fontSize: '0.750rem',
      fontWeight: 500,
      lineHeight: '1.333em',
      textAlign: 'left',
    },

    /** @type {TypographyData} */
    text: {
      color: 'rgba(0, 0, 0, 1)',
      fontFamily: 'Equinor',
      fontSize: '1.000rem',
      fontWeight: 400,
      letterSpacing: '0.025em',
      lineHeight: '1.500em',
      textAlign: 'left',
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
      textAlign: 'left',
    },

    /** @type {TypographyData} */
    helper: {
      color: 'rgba(0, 0, 0, 1)',
      fontFamily: 'Equinor',
      fontSize: '0.750rem',
      fontWeight: 500,
      letterSpacing: '0.013em',
      lineHeight: '1.333em',
      textAlign: 'left',
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
      textAlign: 'left',
    },

    /** @type {TypographyData} */
    caption: {
      color: 'rgba(61, 61, 61, 1)',
      fontFamily: 'Equinor',
      fontSize: '0.875rem',
      fontWeight: 500,
      lineHeight: '1.143em',
      textAlign: 'left',
    },

    /** @type {TypographyData} */
    meta: {
      color: 'rgba(61, 61, 61, 1)',
      fontFamily: 'Equinor',
      fontSize: '0.625rem',
      fontWeight: 500,
      lineHeight: '1.600em',
      textAlign: 'left',
    },

    /** @type {TypographyData} */
    body_short: {
      color: 'rgba(61, 61, 61, 1)',
      fontFamily: 'Equinor',
      fontSize: '1.000rem',
      fontWeight: 400,
      lineHeight: '1.250em',
      textAlign: 'left',
    },

    /** @type {TypographyData} */
    body_short_bold_italic: {
      color: 'rgba(61, 61, 61, 1)',
      fontFamily: 'Equinor',
      fontSize: '1.000rem',
      fontWeight: 700,
      lineHeight: '1.250em',
      fontStyle: 'italic',
      textAlign: 'left',
    },

    /** @type {TypographyData} */
    body_short_bold: {
      color: 'rgba(61, 61, 61, 1)',
      fontFamily: 'Equinor',
      fontSize: '1.000rem',
      fontWeight: 700,
      lineHeight: '1.250em',
      textAlign: 'left',
    },

    /** @type {TypographyData} */
    body_short_link: {
      color: 'rgba(0, 112, 121, 1)',
      fontFamily: 'Equinor',
      fontSize: '1.000rem',
      fontWeight: 400,
      lineHeight: '1.250em',
      textDecoration: 'underline',
      textAlign: 'left',
    },

    /** @type {TypographyData} */
    overline: {
      color: 'rgba(61, 61, 61, 1)',
      fontFamily: 'Equinor',
      fontSize: '0.625rem',
      fontWeight: 500,
      letterSpacing: '0.069em',
      lineHeight: '1.600em',
      textTransform: /** @type {import('csstype').TextTransformProperty} */ ('uppercase'),
      textAlign: 'left',
    },

    /** @type {TypographyData} */
    ingress: {
      color: 'rgba(61, 61, 61, 1)',
      fontFamily: 'Equinor',
      fontSize: '1.125rem',
      fontWeight: 400,
      lineHeight: '1.333em',
      textAlign: 'left',
    },

    /** @type {TypographyData} */
    body_long: {
      color: 'rgba(61, 61, 61, 1)',
      fontFamily: 'Equinor',
      fontSize: '1.000rem',
      fontWeight: 400,
      lineHeight: '1.500em',
      textAlign: 'left',
    },

    /** @type {TypographyData} */
    body_long_link: {
      color: 'rgba(0, 112, 121, 1)',
      fontFamily: 'Equinor',
      fontSize: '1.000rem',
      fontWeight: 400,
      lineHeight: '1.500em',
      textDecoration: 'underline',
      textAlign: 'left',
    },

    /** @type {TypographyData} */
    body_long_italic: {
      color: 'rgba(61, 61, 61, 1)',
      fontFamily: 'Equinor',
      fontSize: '1.000rem',
      fontWeight: 400,
      lineHeight: '1.500em',
      fontStyle: 'italic',
      textAlign: 'left',
    },

    /** @type {TypographyData} */
    body_long_bold: {
      color: 'rgba(61, 61, 61, 1)',
      fontFamily: 'Equinor',
      fontSize: '1.000rem',
      fontWeight: 700,
      lineHeight: '1.500em',
      textAlign: 'left',
    },

    /** @type {TypographyData} */
    body_long_bold_italic: {
      color: 'rgba(61, 61, 61, 1)',
      fontFamily: 'Equinor',
      fontSize: '1.000rem',
      fontWeight: 700,
      lineHeight: '1.500em',
      fontStyle: 'italic',
      textAlign: 'left',
    },
  },
  table: {
    /** @type {TypographyData} */
    cell_header: {
      color: 'rgba(0, 0, 0, 1)',
      fontFamily: 'Equinor',
      fontSize: '0.875rem',
      fontWeight: 700,
      lineHeight: '1.714em',
      textAlign: 'left',
    },

    /** @type {TypographyData} */
    cell_text: {
      color: 'rgba(0, 0, 0, 1)',
      fontFamily: 'Equinor',
      fontSize: '0.875rem',
      fontWeight: 500,
      lineHeight: '1.714em',
      textAlign: 'left',
    },

    /** @type {TypographyData} */
    cell_text_bold: {
      color: 'rgba(0, 0, 0, 1)',
      fontFamily: 'Equinor',
      fontSize: '0.875rem',
      fontWeight: 700,
      lineHeight: '1.714em',
      textAlign: 'left',
    },

    /** @type {TypographyData} */
    cell_text_link: {
      color: 'rgba(0, 0, 0, 1)',
      fontFamily: 'Equinor',
      fontSize: '0.875rem',
      fontWeight: 500,
      lineHeight: '1.714em',
      textDecoration: 'underline',
      textAlign: 'left',
    },

    /** @type {TypographyData} */
    cell_numeric_monospaced: {
      fontFeatureSettings: "'tnum' on, 'lnum' on",
      color: 'rgba(0, 0, 0, 1)',
      fontFamily: 'Equinor',
      fontSize: '0.875rem',
      fontWeight: 500,
      lineHeight: '1.429em',
      textAlign: 'left',
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
      textAlign: 'left',
    },

    /** @type {TypographyData} */
    snackbar: {
      color: 'rgba(61, 61, 61, 1)',
      fontFamily: 'Equinor',
      fontSize: '0.750rem',
      fontWeight: 500,
      lineHeight: '1.333em',
      textAlign: 'left',
    },

    /** @type {TypographyData} */
    accordion_header: {
      color: 'rgba(61, 61, 61, 1)',
      fontFamily: 'Equinor',
      fontSize: '1.000rem',
      fontWeight: 500,
      lineHeight: '1.500em',
      textAlign: 'left',
    },

    /** @type {TypographyData} */
    chip__badge: {
      color: 'rgba(61, 61, 61, 1)',
      fontFamily: 'Equinor',
      fontSize: '0.750rem',
      fontWeight: 500,
      lineHeight: '1.333em',
      textAlign: 'left',
    },

    /** @type {TypographyData} */
    chart: {
      color: 'rgba(61, 61, 61, 1)',
      fontFamily: 'Equinor',
      fontSize: '0.750rem',
      fontWeight: 500,
      lineHeight: '1.333em',
      textAlign: 'left',
    },
  },
}
