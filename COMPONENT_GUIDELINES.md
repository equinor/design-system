# General guidelines for React components

- Test your component in the latest version of evergreen browsers
- Use CSS grids for layout where appropriate
- Write tests in Jest
- Take time to learn from other design systems
  - [Material UI](https://material-ui.com/) (EDS is heavily inspired by Material Design)
  - [Sprout Social](https://sproutsocial.com/seeds/components/) (A lot of similarities with EDS)
  - [Reach UI](https://reacttraining.com/reach-ui/) (Excellent on a11y)
- Keep the component as simple as possible
- Always get in touch with one of the lead developers before you start work on a component
- Components issues labelled ["storefront"](//github.com/equinor/design-system/issues?q=milestone%3A%22EDS+Core+React%22+label%3Astorefront) have the highest priority
- Remember to add code for `:focus-visible`. This is an [upcoming feature](https://css-tricks.com/almanac/selectors/f/focus-visible/) to CSS and is currently globally polyfilled for in eds-core-react.

  - The main goal is to distinguish between pointer events and keyboard navigation
  - To use in your component, add

  ```css
  &:focus {
    outline: none;
  }

  &[data-focus-visible-added]:focus {
    outline: ${outline}; /** 1px dashed rgba(0, 112, 121, 1) */
    outline-offset: ${outlineOffset}; /** 2px */
  }
  ```
