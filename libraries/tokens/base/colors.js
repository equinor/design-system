/**
 * @typedef ColorData
 * @property {string} hex
 * @property {string} hsla
 * @property {string} rgba
 */

export const colors = {
  text: {
    /**
     * @type {ColorData}
     */
    static_icons__default: {
      hex: '#3d3d3d',
      hsla: 'hsla(0, 0%, 23.9%, 1)',
      rgba: 'rgba(61, 61, 61, 1)',
    },

    /**
     * @type {ColorData}
     */
    static_icons__secondary: {
      hex: '#565656',
      hsla: 'hsla(0, 0%, 33.7%, 1)',
      rgba: 'rgba(86, 86, 86, 1)',
    },

    /**
     * @type {ColorData}
     */
    static_icons__tertiary: {
      hex: '#6f6f6f',
      hsla: 'hsla(0, 0%, 43.5%, 1)',
      rgba: 'rgba(111, 111, 111, 1)',
    },

    /**
     * @type {ColorData}
     */
    static_icons__primary_white: {
      hex: '#ffffff',
      hsla: 'hsla(0, 0%, 100%, 1)',
      rgba: 'rgba(255, 255, 255, 1)',
    },
  },
  ui: {
    /**
     * @type {ColorData}
     */
    background__default: {
      hex: '#ffffff',
      hsla: 'hsla(0, 0%, 100%, 1)',
      rgba: 'rgba(255, 255, 255, 1)',
    },

    /**
     * @type {ColorData}
     */
    background__light: {
      hex: '#f7f7f7',
      hsla: 'hsla(0, 0%, 96.9%, 1)',
      rgba: 'rgba(247, 247, 247, 1)',
    },

    /**
     * @type {ColorData}
     */
    background__scrim: {
      hex: '#000000',
      hsla: 'hsla(0, 0%, 0%, 0.4)',
      rgba: 'rgba(0, 0, 0, 0.4)',
    },

    /**
     * @type {ColorData}
     */
    background__overlay: {
      hex: '#000000',
      hsla: 'hsla(0, 0%, 0%, 0.8)',
      rgba: 'rgba(0, 0, 0, 0.8)',
    },

    /**
     * @type {ColorData}
     */
    background__medium: {
      hex: '#dcdcdc',
      hsla: 'hsla(0, 0%, 86.3%, 1)',
      rgba: 'rgba(220, 220, 220, 1)',
    },

    /**
     * @type {ColorData}
     */
    background__info: {
      hex: '#d5eaf4',
      hsla: 'hsla(199, 58.5%, 89.6%, 1)',
      rgba: 'rgba(213, 234, 244, 1)',
    },

    /**
     * @type {ColorData}
     */
    background__warning: {
      hex: '#ffe7d6',
      hsla: 'hsla(25, 100%, 92%, 1)',
      rgba: 'rgba(255, 231, 214, 1)',
    },

    /**
     * @type {ColorData}
     */
    background__danger: {
      hex: '#ffc1c1',
      hsla: 'hsla(0, 100%, 87.8%, 1)',
      rgba: 'rgba(255, 193, 193, 1)',
    },
  },
  infographic: {
    /**
     * @type {ColorData}
     */
    substitute__purple_berry: {
      hex: '#8c1159',
      hsla: 'hsla(325, 78.3%, 30.8%, 1)',
      rgba: 'rgba(140, 17, 89, 1)',
    },

    /**
     * @type {ColorData}
     */
    substitute__pink_rose: {
      hex: '#e24973',
      hsla: 'hsla(344, 72.5%, 58.6%, 1)',
      rgba: 'rgba(226, 73, 115, 1)',
    },

    /**
     * @type {ColorData}
     */
    substitute__pink_salmon: {
      hex: '#ff92a8',
      hsla: 'hsla(348, 100%, 78.6%, 1)',
      rgba: 'rgba(255, 146, 168, 1)',
    },

    /**
     * @type {ColorData}
     */
    substitute__green_cucumber: {
      hex: '#005f57',
      hsla: 'hsla(175, 100%, 18.6%, 1)',
      rgba: 'rgba(0, 95, 87, 1)',
    },

    /**
     * @type {ColorData}
     */
    substitute__green_succulent: {
      hex: '#00977b',
      hsla: 'hsla(169, 100%, 29.6%, 1)',
      rgba: 'rgba(0, 151, 123, 1)',
    },

    /**
     * @type {ColorData}
     */
    substitute__green_mint: {
      hex: '#40d38f',
      hsla: 'hsla(152, 62.6%, 53.9%, 1)',
      rgba: 'rgba(64, 211, 143, 1)',
    },

    /**
     * @type {ColorData}
     */
    substitute__blue_ocean: {
      hex: '#004088',
      hsla: 'hsla(212, 100%, 26.7%, 1)',
      rgba: 'rgba(0, 64, 136, 1)',
    },

    /**
     * @type {ColorData}
     */
    substitute__blue_overcast: {
      hex: '#0084c4',
      hsla: 'hsla(200, 100%, 38.4%, 1)',
      rgba: 'rgba(0, 132, 196, 1)',
    },

    /**
     * @type {ColorData}
     */
    substitute__blue_sky: {
      hex: '#52c0ff',
      hsla: 'hsla(202, 100%, 66.1%, 1)',
      rgba: 'rgba(82, 192, 255, 1)',
    },

    /**
     * @type {ColorData}
     */
    primary__moss_green_100: {
      hex: '#007079',
      hsla: 'hsla(184, 100%, 23.7%, 1)',
      rgba: 'rgba(0, 112, 121, 1)',
    },

    /**
     * @type {ColorData}
     */
    primary__moss_green_55: {
      hex: '#73b1b5',
      hsla: 'hsla(184, 30.8%, 58%, 1)',
      rgba: 'rgba(115, 177, 181, 1)',
    },

    /**
     * @type {ColorData}
     */
    primary__moss_green_34: {
      hex: '#a8ced1',
      hsla: 'hsla(184, 30.8%, 73.9%, 1)',
      rgba: 'rgba(168, 206, 209, 1)',
    },

    /**
     * @type {ColorData}
     */
    primary__moss_green_21: {
      hex: '#c9e0e2',
      hsla: 'hsla(185, 30.1%, 83.7%, 1)',
      rgba: 'rgba(201, 224, 226, 1)',
    },

    /**
     * @type {ColorData}
     */
    primary__moss_green_13: {
      hex: '#deedee',
      hsla: 'hsla(184, 32%, 90.2%, 1)',
      rgba: 'rgba(222, 237, 238, 1)',
    },

    /**
     * @type {ColorData}
     */
    primary__energy_red_100: {
      hex: '#eb0037',
      hsla: 'hsla(346, 100%, 46.1%, 1)',
      rgba: 'rgba(235, 0, 55, 1)',
    },

    /**
     * @type {ColorData}
     */
    primary__energy_red_55: {
      hex: '#ff7d98',
      hsla: 'hsla(348, 100%, 74.5%, 1)',
      rgba: 'rgba(255, 125, 152, 1)',
    },

    /**
     * @type {ColorData}
     */
    primary__energy_red_34: {
      hex: '#ffaebf',
      hsla: 'hsla(347, 100%, 84.1%, 1)',
      rgba: 'rgba(255, 174, 191, 1)',
    },

    /**
     * @type {ColorData}
     */
    primary__energy_red_21: {
      hex: '#ffcdd7',
      hsla: 'hsla(348, 100%, 90.2%, 1)',
      rgba: 'rgba(255, 205, 215, 1)',
    },

    /**
     * @type {ColorData}
     */
    primary__energy_red_13: {
      hex: '#ffe0e7',
      hsla: 'hsla(346, 100%, 93.9%, 1)',
      rgba: 'rgba(255, 224, 231, 1)',
    },

    /**
     * @type {ColorData}
     */
    primary__weathered_red: {
      hex: '#7d0023',
      hsla: 'hsla(343, 100%, 24.5%, 1)',
      rgba: 'rgba(125, 0, 35, 1)',
    },

    /**
     * @type {ColorData}
     */
    primary__slate_blue: {
      hex: '#243746',
      hsla: 'hsla(206, 32.1%, 20.8%, 1)',
      rgba: 'rgba(36, 55, 70, 1)',
    },

    /**
     * @type {ColorData}
     */
    primary__spruce_wood: {
      hex: '#ffe7d6',
      hsla: 'hsla(25, 100%, 92%, 1)',
      rgba: 'rgba(255, 231, 214, 1)',
    },

    /**
     * @type {ColorData}
     */
    primary__mist_blue: {
      hex: '#d5eaf4',
      hsla: 'hsla(199, 58.5%, 89.6%, 1)',
      rgba: 'rgba(213, 234, 244, 1)',
    },

    /**
     * @type {ColorData}
     */
    primary__lichen_green: {
      hex: '#e6faec',
      hsla: 'hsla(138, 66.7%, 94.1%, 1)',
      rgba: 'rgba(230, 250, 236, 1)',
    },
  },
  logo: {
    /**
     * @type {ColorData}
     */
    fill_positive: {
      hex: '#eb0037',
      hsla: 'hsla(346, 100%, 46.1%, 1)',
      rgba: 'rgba(235, 0, 55, 1)',
    },

    /**
     * @type {ColorData}
     */
    fill_negative: {
      hex: '#ffffff',
      hsla: 'hsla(0, 0%, 100%, 1)',
      rgba: 'rgba(255, 255, 255, 1)',
    },
  },
  interactive: {
    /**
     * @type {ColorData}
     */
    primary__selected_highlight: {
      hex: '#e6faec',
      hsla: 'hsla(138, 66.7%, 94.1%, 1)',
      rgba: 'rgba(230, 250, 236, 1)',
    },

    /**
     * @type {ColorData}
     */
    primary__selected_hover: {
      hex: '#c3f3d2',
      hsla: 'hsla(139, 66.7%, 85.9%, 1)',
      rgba: 'rgba(195, 243, 210, 1)',
    },

    /**
     * @type {ColorData}
     */
    primary__resting: {
      hex: '#007079',
      hsla: 'hsla(184, 100%, 23.7%, 1)',
      rgba: 'rgba(0, 112, 121, 1)',
    },

    /**
     * @type {ColorData}
     */
    primary__hover: {
      hex: '#004f55',
      hsla: 'hsla(184, 100%, 16.7%, 1)',
      rgba: 'rgba(0, 79, 85, 1)',
    },

    /**
     * @type {ColorData}
     */
    primary__hover_alt: {
      hex: '#deedee',
      hsla: 'hsla(184, 32%, 90.2%, 1)',
      rgba: 'rgba(222, 237, 238, 1)',
    },

    /**
     * @type {ColorData}
     */
    secondary__highlight: {
      hex: '#d5eaf4',
      hsla: 'hsla(199, 58.5%, 89.6%, 1)',
      rgba: 'rgba(213, 234, 244, 1)',
    },

    /**
     * @type {ColorData}
     */
    secondary__resting: {
      hex: '#243746',
      hsla: 'hsla(206, 32.1%, 20.8%, 1)',
      rgba: 'rgba(36, 55, 70, 1)',
    },

    /**
     * @type {ColorData}
     */
    secondary__link_hover: {
      hex: '#17242f',
      hsla: 'hsla(208, 34.3%, 13.7%, 1)',
      rgba: 'rgba(23, 36, 47, 1)',
    },

    /**
     * @type {ColorData}
     */
    danger__highlight: {
      hex: '#ffc1c1',
      hsla: 'hsla(0, 100%, 87.8%, 1)',
      rgba: 'rgba(255, 193, 193, 1)',
    },

    /**
     * @type {ColorData}
     */
    danger__resting: {
      hex: '#eb0000',
      hsla: 'hsla(0, 100%, 46.1%, 1)',
      rgba: 'rgba(235, 0, 0, 1)',
    },

    /**
     * @type {ColorData}
     */
    danger__hover: {
      hex: '#b30d2f',
      hsla: 'hsla(348, 86.5%, 37.6%, 1)',
      rgba: 'rgba(179, 13, 47, 1)',
    },

    /**
     * @type {ColorData}
     */
    danger__text: {
      hex: '#b30d2f',
      hsla: 'hsla(348, 86.5%, 37.6%, 1)',
      rgba: 'rgba(179, 13, 47, 1)',
    },

    /**
     * @type {ColorData}
     */
    warning__highlight: {
      hex: '#ffe7d6',
      hsla: 'hsla(25, 100%, 92%, 1)',
      rgba: 'rgba(255, 231, 214, 1)',
    },

    /**
     * @type {ColorData}
     */
    warning__resting: {
      hex: '#ff9200',
      hsla: 'hsla(34, 100%, 50%, 1)',
      rgba: 'rgba(255, 146, 0, 1)',
    },

    /**
     * @type {ColorData}
     */
    warning__hover: {
      hex: '#ad6200',
      hsla: 'hsla(34, 100%, 33.9%, 1)',
      rgba: 'rgba(173, 98, 0, 1)',
    },

    /**
     * @type {ColorData}
     */
    warning__text: {
      hex: '#ad6200',
      hsla: 'hsla(34, 100%, 33.9%, 1)',
      rgba: 'rgba(173, 98, 0, 1)',
    },

    /**
     * @type {ColorData}
     */
    success__highlight: {
      hex: '#e6faec',
      hsla: 'hsla(138, 66.7%, 94.1%, 1)',
      rgba: 'rgba(230, 250, 236, 1)',
    },

    /**
     * @type {ColorData}
     */
    success__resting: {
      hex: '#4bb748',
      hsla: 'hsla(118, 43.5%, 50%, 1)',
      rgba: 'rgba(75, 183, 72, 1)',
    },

    /**
     * @type {ColorData}
     */
    success__hover: {
      hex: '#358132',
      hsla: 'hsla(118, 44.1%, 35.1%, 1)',
      rgba: 'rgba(53, 129, 50, 1)',
    },

    /**
     * @type {ColorData}
     */
    success__text: {
      hex: '#358132',
      hsla: 'hsla(118, 44.1%, 35.1%, 1)',
      rgba: 'rgba(53, 129, 50, 1)',
    },

    /**
     * @type {ColorData}
     */
    table__cell__fill_resting: {
      hex: '#ffffff',
      hsla: 'hsla(0, 0%, 100%, 1)',
      rgba: 'rgba(255, 255, 255, 1)',
    },

    /**
     * @type {ColorData}
     */
    table__cell__fill_hover: {
      hex: '#eaeaea',
      hsla: 'hsla(0, 0%, 91.8%, 1)',
      rgba: 'rgba(234, 234, 234, 1)',
    },

    /**
     * @type {ColorData}
     */
    table__cell__fill_activated: {
      hex: '#e6faec',
      hsla: 'hsla(138, 66.7%, 94.1%, 1)',
      rgba: 'rgba(230, 250, 236, 1)',
    },

    /**
     * @type {ColorData}
     */
    table__header__fill_activated: {
      hex: '#eaeaea',
      hsla: 'hsla(0, 0%, 91.8%, 1)',
      rgba: 'rgba(234, 234, 234, 1)',
    },

    /**
     * @type {ColorData}
     */
    table__header__fill_hover: {
      hex: '#dcdcdc',
      hsla: 'hsla(0, 0%, 86.3%, 1)',
      rgba: 'rgba(220, 220, 220, 1)',
    },

    /**
     * @type {ColorData}
     */
    table__header__fill_resting: {
      hex: '#f7f7f7',
      hsla: 'hsla(0, 0%, 96.9%, 1)',
      rgba: 'rgba(247, 247, 247, 1)',
    },

    /**
     * @type {ColorData}
     */
    disabled__text: {
      hex: '#bebebe',
      hsla: 'hsla(0, 0%, 74.5%, 1)',
      rgba: 'rgba(190, 190, 190, 1)',
    },

    /**
     * @type {ColorData}
     */
    text_highlight: {
      hex: '#d5eaf4',
      hsla: 'hsla(199, 58.5%, 89.6%, 1)',
      rgba: 'rgba(213, 234, 244, 1)',
    },

    /**
     * @type {ColorData}
     */
    focus: {
      hex: '#007079',
      hsla: 'hsla(184, 100%, 23.7%, 1)',
      rgba: 'rgba(0, 112, 121, 1)',
    },

    /**
     * @type {ColorData}
     */
    disabled__border: {
      hex: '#dcdcdc',
      hsla: 'hsla(0, 0%, 86.3%, 1)',
      rgba: 'rgba(220, 220, 220, 1)',
    },

    /**
     * @type {ColorData}
     */
    disabled__fill: {
      hex: '#eaeaea',
      hsla: 'hsla(0, 0%, 91.8%, 1)',
      rgba: 'rgba(234, 234, 234, 1)',
    },

    /**
     * @type {ColorData}
     */
    link_on_interactive_colors: {
      hex: '#ffffff',
      hsla: 'hsla(0, 0%, 100%, 1)',
      rgba: 'rgba(255, 255, 255, 1)',
    },

    /**
     * @type {ColorData}
     */
    icon_on_interactive_colors: {
      hex: '#ffffff',
      hsla: 'hsla(0, 0%, 100%, 1)',
      rgba: 'rgba(255, 255, 255, 1)',
    },

    /**
     * @type {ColorData}
     */
    link_in_snackbars: {
      hex: '#a8ced1',
      hsla: 'hsla(184, 30.8%, 73.9%, 1)',
      rgba: 'rgba(168, 206, 209, 1)',
    },

    /**
     * @type {ColorData}
     */
    pressed_overlay_dark: {
      hex: '#000000',
      hsla: 'hsla(0, 0%, 0%, 0.2)',
      rgba: 'rgba(0, 0, 0, 0.2)',
    },

    /**
     * @type {ColorData}
     */
    field__fill_resting: {
      hex: '#f7f7f7',
      hsla: 'hsla(0, 0%, 96.9%, 1)',
      rgba: 'rgba(247, 247, 247, 1)',
    },

    /**
     * @type {ColorData}
     */
    field__fill_hover: {
      hex: '#f3f3f3',
      hsla: 'hsla(0, 0%, 95.3%, 1)',
      rgba: 'rgba(243, 243, 243, 1)',
    },

    /**
     * @type {ColorData}
     */
    field__fill_activated: {
      hex: '#dcdcdc',
      hsla: 'hsla(0, 0%, 86.3%, 1)',
      rgba: 'rgba(220, 220, 220, 1)',
    },
  },
  tabs: {
    /**
     * @type {ColorData}
     */
    inactive_text: {
      hex: '#565656',
      hsla: 'hsla(0, 0%, 33.7%, 1)',
      rgba: 'rgba(86, 86, 86, 1)',
    },
  },
}
