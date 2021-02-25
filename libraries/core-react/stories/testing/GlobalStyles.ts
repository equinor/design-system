// Testing global variables when migrating

import { createGlobalStyle } from 'styled-components'

export const GlobalStyleDark = createGlobalStyle`
:root {
  --eds_text_static_icons__default: rgba(255,255,255, 1);
  --eds_text_static_icons__secondary: rgba(222,229,231, 1);
  --eds_text_static_icons__tertiary: rgba(156,166,172, 1);
  --eds_text_static_icons__primary_white: rgba(0,0,0, 1);

  /** Her er light/dark-navnene helt ulike, så jeg skjønner ikke helt hva som er tanken her */
  --eds_ui_background__default: rgba(19,38,52, 1);
  --eds_ui_background__semitransparent: rgba(255, 255, 255, 0.2);

  --eds_ui_background__light: rgba(247, 247, 247, 1);
  --eds_ui_background__raised: rgba(36,55,70,1);

  --eds_ui_background__lighten: rgba(255,255,255,0.16);

  --eds_ui_background__scrim: rgba(0, 0, 0, 0.4);
  --eds_ui_background__overlay: rgba(0, 0, 0, 0.8);
  --eds_ui_background__medium: rgba(220, 220, 220, 1);
  --eds_ui_background__info: rgba(213, 234, 244, 1);
  --eds_ui_background__warning: rgba(255, 231, 214, 1);
  --eds_ui_background__danger: rgba(255, 193, 193, 1);


  --eds_logo_fill_positive: rgba(235, 0, 55, 1);
  --eds_logo_fill_negative: rgba(255, 255, 255, 1);

  /** Mangler i darkmode */
  --eds_interactive_primary__selected_highlight: rgba(230, 250, 236, 1);
  --eds_interactive_primary__selected_hover: rgba(195, 243, 210, 1);

  --eds_interactive_primary__resting: rgba(151,202,206, 1);
  --eds_interactive_primary__hover: rgba(173,226,230, 1);
    /** Skjønner ikke helt figma her */
  --eds_interactive_primary__hover_alt: rgba(173,226,230,0.1);
  --eds_interactive_secondary__highlight: rgba(255,255,255, 0.1);
  --eds_interactive_secondary__resting: rgba(222,229,231, 1);
  /** Interactive secondary hover mangler */

  --eds_interactive_secondary__link_hover: rgba(23, 36, 47, 1);

  --eds_interactive_danger__highlight: rgba(255,102,112, 0.1);
  --eds_interactive_danger__resting: rgba(235,0,0, 1);
  --eds_interactive_danger__hover: rgba(255,148,155, 1);
  --eds_interactive_danger__text: rgba(255,102,112, 1);

  --eds_interactive_warning__highlight: rgba(255,198,122, 0.1);
  --eds_interactive_warning__resting: rgba(255,146,0, 1);
  --eds_interactive_warning__hover: rgba(255,218,168, 1);
  --eds_interactive_warning__text: rgba(255,198,122,1);

  --eds_interactive_success__highlight: rgba(161,218,160, 0.1);
  --eds_interactive_success__resting: rgba(75, 183, 72, 1);
  --eds_interactive_success__hover: rgba(193,231,193, 1);
  --eds_interactive_success__text: rgba(161,218,160, 1);

  --eds_interactive_table__cell__fill_resting: rgba(255, 255, 255, 1);
  --eds_interactive_table__cell__fill_hover: rgba(234, 234, 234, 1);
  --eds_interactive_table__cell__fill_activated: rgba(230, 250, 236, 1);
  --eds_interactive_table__header__fill_activated: rgba(234, 234, 234, 1);
  --eds_interactive_table__header__fill_hover: rgba(220, 220, 220, 1);
  --eds_interactive_table__header__fill_resting: rgba(247, 247, 247, 1);

  --eds_infographic_primary__moss_green_100: rgba(0, 112, 121, 1);
  --eds_infographic_primary__moss_green_13: rgba(222, 237, 238, 1);
  --eds_infographic_primary__energy_red_100: rgba(235, 0, 55, 1);
  --eds_infographic_primary__energy_red_13: rgba(255, 224, 231, 1);
  
 /** Har ingen verdi i darkmode */
  --eds_interactive_text_highlight: rgba(18,18,18, 1);
  --eds_interactive_focus: rgba(151,202,206, 1);
  --eds_interactive_disabled__border: rgba(64,84,98, 1);
  --eds_interactive_disabled__fill: rgba(52,68,80, 1);
  --eds_interactive_disabled__text: rgba(99,117,131, 1);
  /** Har ingen verdi i darkmode */
  --eds_interactive_link_on_interactive_colors: rgba(255, 255, 255, 1);
  --eds_interactive_icon_on_interactive_colors: rgba(0,0,0, 1);
  --eds_interactive_link_in_snackbars: rgba(0,112,121, 1);
  /** Slått sammen til en */
  --eds_interactive_pressed_overlay_dark: rgba(0, 0, 0, 0.2);
  --eds_interactive_pressed_overlay_light: rgba(255, 255, 255, 0.2);
 .mickey {
   background-color: var(--eds_interactive_danger__highlight);
 }
}
  `
export const GlobalStyleDefault = createGlobalStyle`
:root {
  --eds_text_static_icons__default: rgba(61, 61, 61, 1);
  --eds_text_static_icons__secondary: rgba(86, 86, 86, 1);
  --eds_text_static_icons__tertiary: rgba(111, 111, 111, 1);
  --eds_text_static_icons__primary_white: rgba(255, 255, 255, 1);
  --eds_ui_background__default: rgba(255, 255, 255, 1);
  --eds_ui_background__semitransparent: rgba(255, 255, 255, 0.2);
  --eds_ui_background__light: rgba(247, 247, 247, 1);
  --eds_ui_background__scrim: rgba(0, 0, 0, 0.4);
  --eds_ui_background__overlay: rgba(0, 0, 0, 0.8);
  --eds_ui_background__medium: rgba(220, 220, 220, 1);
  --eds_ui_background__info: rgba(213, 234, 244, 1);
  --eds_ui_background__warning: rgba(255, 231, 214, 1);
  --eds_ui_background__danger: rgba(255, 193, 193, 1);
  --eds_infographic_substitute__purple_berry: rgba(140, 17, 89, 1);
  --eds_infographic_substitute__pink_rose: rgba(226, 73, 115, 1);
  --eds_infographic_substitute__pink_salmon: rgba(255, 146, 168, 1);
  --eds_infographic_substitute__green_cucumber: rgba(0, 95, 87, 1);
  --eds_infographic_substitute__green_succulent: rgba(0, 151, 123, 1);
  --eds_infographic_substitute__green_mint: rgba(64, 211, 143, 1);
  --eds_infographic_substitute__blue_ocean: rgba(0, 64, 136, 1);
  --eds_infographic_substitute__blue_overcast: rgba(0, 132, 196, 1);
  --eds_infographic_substitute__blue_sky: rgba(82, 192, 255, 1);
  --eds_infographic_primary__moss_green_100: rgba(0, 112, 121, 1);
  --eds_infographic_primary__moss_green_55: rgba(115, 177, 181, 1);
  --eds_infographic_primary__moss_green_34: rgba(168, 206, 209, 1);
  --eds_infographic_primary__moss_green_21: rgba(201, 224, 226, 1);
  --eds_infographic_primary__moss_green_13: rgba(222, 237, 238, 1);
  --eds_infographic_primary__energy_red_100: rgba(235, 0, 55, 1);
  --eds_infographic_primary__energy_red_55: rgba(255, 125, 152, 1);
  --eds_infographic_primary__energy_red_34: rgba(255, 174, 191, 1);
  --eds_infographic_primary__energy_red_21: rgba(255, 205, 215, 1);
  --eds_infographic_primary__energy_red_13: rgba(255, 224, 231, 1);
  --eds_infographic_primary__weathered_red: rgba(125, 0, 35, 1);
  --eds_infographic_primary__slate_blue: rgba(36, 55, 70, 1);
  --eds_infographic_primary__spruce_wood: rgba(255, 231, 214, 1);
  --eds_infographic_primary__mist_blue: rgba(213, 234, 244, 1);
  --eds_infographic_primary__lichen_green: rgba(230, 250, 236, 1);
  --eds_logo_fill_positive: rgba(235, 0, 55, 1);
  --eds_logo_fill_negative: rgba(255, 255, 255, 1);
  --eds_interactive_primary__selected_highlight: rgba(230, 250, 236, 1);
  --eds_interactive_primary__selected_hover: rgba(195, 243, 210, 1);
  --eds_interactive_primary__resting: rgba(0, 112, 121, 1);
  --eds_interactive_primary__hover: rgba(0, 79, 85, 1);
  --eds_interactive_primary__hover_alt: rgba(222, 237, 238, 1);
  --eds_interactive_secondary__highlight: rgba(213, 234, 244, 1);
  --eds_interactive_secondary__resting: rgba(36, 55, 70, 1);
  --eds_interactive_secondary__link_hover: rgba(23, 36, 47, 1);
  --eds_interactive_danger__highlight: rgba(255, 193, 193, 1);
  --eds_interactive_danger__resting: rgba(235, 0, 0, 1);
  --eds_interactive_danger__hover: rgba(179, 13, 47, 1);
  --eds_interactive_danger__text: rgba(179, 13, 47, 1);
  --eds_interactive_warning__highlight: rgba(255, 231, 214, 1);
  --eds_interactive_warning__resting: rgba(255, 146, 0, 1);
  --eds_interactive_warning__hover: rgba(173, 98, 0, 1);
  --eds_interactive_warning__text: rgba(173, 98, 0, 1);
  --eds_interactive_success__highlight: rgba(230, 250, 236, 1);
  --eds_interactive_success__resting: rgba(75, 183, 72, 1);
  --eds_interactive_success__hover: rgba(53, 129, 50, 1);
  --eds_interactive_success__text: rgba(53, 129, 50, 1);
  --eds_interactive_table__cell__fill_resting: rgba(255, 255, 255, 1);
  --eds_interactive_table__cell__fill_hover: rgba(234, 234, 234, 1);
  --eds_interactive_table__cell__fill_activated: rgba(230, 250, 236, 1);
  --eds_interactive_table__header__fill_activated: rgba(234, 234, 234, 1);
  --eds_interactive_table__header__fill_hover: rgba(220, 220, 220, 1);
  --eds_interactive_table__header__fill_resting: rgba(247, 247, 247, 1);
  --eds_interactive_disabled__text: rgba(190, 190, 190, 1);
  --eds_interactive_text_highlight: rgba(213, 234, 244, 1);
  --eds_interactive_focus: rgba(0, 112, 121, 1);
  --eds_interactive_disabled__border: rgba(220, 220, 220, 1);
  --eds_interactive_disabled__fill: rgba(234, 234, 234, 1);
  --eds_interactive_link_on_interactive_colors: rgba(255, 255, 255, 1);
  --eds_interactive_icon_on_interactive_colors: rgba(255, 255, 255, 1);
  --eds_interactive_link_in_snackbars: rgba(151, 202, 206, 1);
  --eds_interactive_pressed_overlay_dark: rgba(0, 0, 0, 0.2);
  --eds_interactive_pressed_overlay_light: rgba(255, 255, 255, 0.2);

  --eds_elevation_raised: 0 1px 5px rgba(0, 0, 0, 0.2),0 3px 4px rgba(0, 0, 0, 0.12),0 2px 4px rgba(0, 0, 0, 0.14);
  --eds_elevation_none: 0 0 1px rgba(0, 0, 0, 0.14);
  --eds_elevation_overlay: 0 1px 10px rgba(0, 0, 0, 0.2),0 4px 5px rgba(0, 0, 0, 0.12),0 2px 4px rgba(0, 0, 0, 0.14);
  --eds_elevation_sticky: 0 4px 5px rgba(0, 0, 0, 0.2),0 3px 14px rgba(0, 0, 0, 0.12),0 8px 10px rgba(0, 0, 0, 0.14);
  --eds_elevation_temporary_nav: 0 7px 8px rgba(0, 0, 0, 0.2),0 5px 22px rgba(0, 0, 0, 0.12),0 12px 17px rgba(0, 0, 0, 0.14);
  --eds_elevation_above_scrim: 0 11px 15px rgba(0, 0, 0, 0.2),0 9px 46px rgba(0, 0, 0, 0.12),0 24px 38px rgba(0, 0, 0, 0.14);



}
  


`
