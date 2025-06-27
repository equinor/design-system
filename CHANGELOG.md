# @equinor/mad-components

## 0.20.0

### Minor Changes

- 0a1a770: Added an offline banner feature.

### Patch Changes

- 63ade9e: Make dialog responsive to all text sizes

    - Make dialog title responsive
    - Make dialog custom content scrollable
    - Make action buttons wrap when necessary
    - Avoid clipping of button content in dialog action buttons

## 0.19.2

### Patch Changes

- 54bbc87: Add disabled prop to x button in search bar

## 0.19.1

### Patch Changes

- b78671d: Changed peer dependencies requirement range to now allow patch changes.

## 0.19.0

### Minor Changes

- e643db4: `CellSwipeItem` is no longer exported from the library

## 0.18.0

### Minor Changes

- 2a645ec: - **BREAKING CHANGE**: Removed the `title` prop on the Progress component. Use the
  `Label` component to achieve similar functionality in the future
    - **BREAKING CHANGE**: Removed the counters shown in the description of `Progress.Item` when it
      is populated with tasks. See further down for how to add this back if needed
    - Modernized the `Progress` and `Progress.Item` component look
    - Moved the 'show more' button to underneath the `Progress.Item` component on smaller devices
    - Added option for passing a method into the description prop of `Progress.Item` with tasks. The
      method should return a string and takes in the number of completed tasks and the number of
      total tasks as arguments

## 0.17.0

### Minor Changes

- 49c59fd: Added `fullWidth` prop to the `Button` component

## 0.16.0

### Minor Changes

- 75df020: - **BREAKING CHANGE**: Changed name of `Theme` typing to `Token`
    - `useToken` no longer calculates the correctly themed token on every mount. This should come
      with some nice performance increases
- 75df020: Changed dependencies to require Expo 52 compatable versions

### Patch Changes

- 7ff2d25: Prevent Cell errors by replacing `SwipeableWithContext` with `Swipeable.
- 75df020: Reworked the animations for the DotProgress component. Should be much smoother now
- 2ce9392: Prevent the `Search` component to appear active on web when it is disabled.

## 0.15.2

### Patch Changes

- c0aea8c: New `busy` prop in the `Button.Icon` component that shows a loading indicator.

## 0.15.1

### Patch Changes

- 1224665: Adjusted the `Cell` component. Instead of using `PressableHighlight`, it now uses a
  different press component from `react-native-gesture-handler` when the cell is `swipeable`.
- 1224665: Fix issue in the `Cell` component where cells with `additionalSurface` were incorrectly
  displayed in `Cell.Groups`. The divider was not fully streched out.

## 0.15.0

### Minor Changes

- 2a428d6: **Breaking change**: removed the `removed` status of the `Progress` components and its
  decendants. Use `success` instead.

## 0.14.13

### Patch Changes

- fc6505c: Add Replace step for all "workspace:\*" dependencies

## 0.14.12

### Patch Changes

- dab732c: Prevent `CircularProgress` from rotating/animate in determinate mode.
- dab732c: Prevent `CircularProgress` from freezing on web after one rotation.
- 00e6e0a: Prevent the clear text button from overlapping with the cancel button in the `Search`
  component while typing
- dab732c: Updated linear and circular progress indicators. They now use animations from
  `react-native-reanimated`
- 00e6e0a: Fix unwanted flicker effect in `Progress` component during status updates

## 0.14.11

### Patch Changes

- c81ddfe: Resolved an issue with the `Cell` component on web where it failed to re-render after
  interaction with the swipeable content
- c81ddfe: Resolved an issue with the `Cell` component where swiping triggered the `onPress` event
  and left the Cell color highlighted
- c81ddfe: Updated animation for the `PressableHighlight` component. It now uses
  react-native-reanimated.

## 0.14.10

### Patch Changes

- 8046826: Add `forwardRef` support to `Cell.Button`

## 0.14.9

### Patch Changes

- 4ba6843: Fixed issue where tasks with removed status was not included in the task counter in the
  `Progress` component
- 4ba6843: Added new `icon` and `iconColor` props, allowing users to display an icon on the right
  side of the progress task title in the `Progress` component.

## 0.14.8

### Patch Changes

- 8c8e10c: Adjusted the position of the `copy` and `return` button in the `Progress` component. They
  are now next to the task item. Retry button can also be shown at the bottom of the `Progress.Item`
- 8c8e10c: Added `removed` status to the `Progress` component.
- 8c8e10c: Added animations to the progress line in the `Progress` component.

## 0.14.7

### Patch Changes

- 2012158: `Progress.Item` tasks are now allowed to use more screen estate
- 2012158: "Copy to clipboard" button for task errors now render under the respective error
- 2012158: `Progress.Item` task lines now visually indicate the current progress better

## 0.14.6

### Patch Changes

- 7ce28df: Add colors for toast

## 0.14.5

### Patch Changes

- 38bcfa3: Fix `Search` and make it correctly update its internal state (`text`) whenever the
  `value` prop changes.

## 0.14.4

### Patch Changes

- 19ecc0a: Added text color in the `Input` component in order to prevent dark text color in dark
  mode

## 0.14.3

### Patch Changes

- a8cc142: Added flex to the `Select` and `Select.Multi` components

## 0.14.2

### Patch Changes

- 13fbceb: `Cell`: swipe buttons have access to swipe methods through the first argument of onPress

## 0.14.1

### Patch Changes

- f963bf2: `Typography`: forward ref to inner text element

## 0.14.0

### Minor Changes

- 7c4eee0: **BREAKING CHANGE:** Renamed `SelectMenu` and `SelectMenu.Multiselect` components to
  `Select` and `Select.Multi`

### Patch Changes

- 7c4eee0: Exported `SelectItem` type
- 7c4eee0: Added `readOnly` and `variant` prop support for `Select` component family
- 7c4eee0: Reworked styling on `Select` component to align with `Input` component styling

## 0.13.2

### Patch Changes

- e103486: Exported props for `SelectMenu` and `SelectMenu.Multiselect`

## 0.13.1

### Patch Changes

- 51fa537: The navigation cell now supports the inclusion of additional title sections
- 5c38f1b: Create Progress screen and new components, Progress and Progress.Item
- 8253d7a: Added new color variable and adjusted the selectedHighlight and menu active color for
  dark mode in order to prevent that text and background had the same color.

## 0.13.0

### Minor Changes

- 49e643c: Disable cell onpress when swiping

## 0.12.10

### Patch Changes

- b5badbd: Streched out the pressable surface in additional surface in `Cell`

## 0.12.9

### Patch Changes

- ba1d39f: Adjusted styling in `Cell`. Added margin to the additional surface line and centered the
  right adornment with the cell content.

## 0.12.8

### Patch Changes

- 8a09b94: Created a new component `SelectMenu` and fixed a bug in dark theme where the text color
  on selected items was hard to see

## 0.12.7

### Patch Changes

- cd8350f: Remove useEffect from `Menu` so that it no longer calls for update when the components
  inside update.

## 0.12.6

### Patch Changes

- 964af01: Fix `Autocomplete` to call for `internalTransform` before setting option to string. Fix
  `MultiSelect` to handle `onBlur` differently on web so that menu persists when choosing an option.

## 0.12.5

### Patch Changes

- 121bbec: Adjusted styling on Search to prevent that it collapses in some cases

## 0.12.4

### Patch Changes

- 8657a23: Adjusted styling on `Search` to prevent that it collapses in some cases

## 0.12.3

### Patch Changes

- 45f2215: Fix flex issues on `Search` by changing flexGrow to flex

## 0.12.2

### Patch Changes

- 558ca83: Adjusted the animation on `Search` so that it looks correctly when the cancel button is
  appearing and disappearing

## 0.12.1

### Patch Changes

- 8baaf7b: Fixed flex issue on `Search` that made it hard to have other elements next to it.
  Prevented that you can interact with cancelbutton when it's not showing.

## 0.12.0

### Minor Changes

- 79fb731: Changed name on the textValue prop in `Search`. New name is now value

### Patch Changes

- e43285f: Add update function to menu so that it re-renders when children change
- 37025ac: Fixed focus realted bug on the search component that affected the behaviour for the
  cancel and clear text buttons. Search now works fine for both web and device

## 0.11.3

### Patch Changes

- 8adb0dc: Updated Cell.Group and removed unwanted bottom padding when the title prop is not in use
- 496cd9a: Change `AutoComplete` and `MultiselectAutoComplete` onblur behaviour on web to keep menu
  open until an option has been selected so that menu doesnt blur before a selection.

## 0.11.2

### Patch Changes

- 7eae144: Added useBreakpoint hook to use for apps and components that have specific requirements
  or styles based on device size

## 0.11.1

### Patch Changes

- d986ab2: Add `additionalSurface` prop to `Cell`component that makes it possible for cell to have
  two unique `onPress` events.

## 0.11.0

### Minor Changes

- 8441874: **Breaking change:** Package no longer exports EDSContext

### Patch Changes

- 3681d0b: Rollback changes made in render function in tabs component to how it was in 0.9.0 due to
  an issue with the new implementation.

## 0.10.0

### Minor Changes

- f02e61c: **Breaking change:** Removed `disabled` prop on `Input`. Replaced by `readOnly`

### Patch Changes

- f02e61c: Fixed `Input` component cyclic reference warnings

## 0.9.0

### Minor Changes

- 1fe9f1b: Fix togglebutton to have external state and remove unnecessary props. Remove multiple and
  onChange props from ToggleButtonProps in ToggleButton. Remove props Toggle, valid and isSelected
  from ToggleButtonContextContents in ToggleButton. Add activeIndex prop to ToggleButtonProps.

## 0.8.6

### Patch Changes

- a5607df: Created `Tabs` component!
- 0d6c310: update color scheme for feedback and added deprecation

## 0.8.5

### Patch Changes

- b025c9b: Implemented Create Incident Screen

## 0.8.4

### Patch Changes

- 97dca15: Added container `warning` color, and text `feedbackWarning` color to masterToken
- 97dca15: Now exports `CellSwipeItem`

## 0.8.3

### Patch Changes

- 59860d3: Create `Chip` component!
- 6f62312: adjusted animation for the circular progess

## 0.8.2

### Patch Changes

- 38e818d: Added support for ignoring outside presses on the `Popover` component
- cf131da: Implemented Radio component. Added showcase to Chronicles
- e941e2e: `PressableHighlight`: Allows for press event propagation if disabled `Radio`: Allows for
  press event propagation if `onPress` prop is not defined `Cell`: cell children now in center
  (fixes issue with text not being centered when there is only one line of text)

## 0.8.1

### Patch Changes

- c8d9131: Fixed flexing issue in `LinearProgress`
- a22023e: export SwitchColor type
- a57a362: `useEDS`: Added `MaterialCommunityIcons` to the list of loaded fonts since our icons use
  it. This means that you no longer need to specifically load `MaterialCommunityIcons` in your
  project, often found in `useCachedResources`.
- a22023e: Export buttoncellprops and switchcellprops
- a0999d4: Added Typography link variant to interactive group
- bda6748: `Button`: The `style` prop is now passed to the outermost component to make it behave as
  expected. We now export `ButtonSpecificProps` which was previously named `ButtonProps`.
  `ButtonProps` is still exported and consists of the types `ButtonSpecificProps` and `ViewProps`.
- 08eeb85: Changed type of Typography child props to include JSX elements

## 0.8.0

### Minor Changes

- fb69a74: Fixed flex issues on search

## 0.7.0

### Minor Changes

- b8b7a72: changed autocomplete to have sub component `multiselect`. Removed `Multiselect` prop in
  `autocomplete` component. Use `autocomplete.multiselect` instead.

### Patch Changes

- c2f7949: fix typescript errors
- c2f7949: fix label and iconColor errors in TextField component

## 0.6.9

### Patch Changes

- a29275a: Change Autocomplete to use TextField instead of Input
- 26fbbbe: added variant prop for validation handling in input component

## 0.6.8

### Patch Changes

- e8d96f6: Added styling fixes for Autocomplete component

## 0.6.7

### Patch Changes

- b5d2d61: Adjusted the pressable container around the icon button to its original size
- 8da4b13: Added autocomplete component. Gives suggestions based on input. Options can be
  toggleable.

## 0.6.6

### Patch Changes

- bd5ded0: Make search get its text value from other sources

## 0.6.5

### Patch Changes

- adaa7bb: fixed clear text button onchange issues on search

## 0.6.4

### Patch Changes

- 85b85ea: fixed flex layout

## 0.6.3

### Patch Changes

- aba4173: fixed onchange and onblur issue

## 0.6.2

### Patch Changes

- 1499432: fixed input onchange issue

## 0.6.1

### Patch Changes

- 89e4a73: fixed Input container styling issue

## 0.6.0

### Minor Changes

- 2e8e6c7: Added an error boundary component
- 2e8e6c7: add paragraph/body_long and paragraph/body_short as variants to typography

### Patch Changes

- 622bf95: Updated search. Search bar can now clear text. Added optional cancel button. Fixed
  flicker bug on search when focused
- 2e8e6c7: add danger color to the master token

## 0.5.4

### Patch Changes

- a057c98: Fixed an issue where accordion item chevron did not display properly

## 0.5.3

### Patch Changes

- 2e03adc: Fixed Cell styling issue in non-ScrollView containers... again

## 0.5.2

### Patch Changes

- d277791: Fixed a styling issue in `Cell` component that caused the cell to collapse in non scroll
  views

## 0.5.1

### Patch Changes

- d7e40cd: Added `Cell.Switch`component

## 0.5.0

### Minor Changes

- 7d96952: BREAKING: 'Environment' component renamed to 'EnvironmentBanner', and no longer accepts
  props. Use EnvironmentProvider to provide the environment

### Patch Changes

- c98abdf: fixed the circularprogress component so that it is spinning in place when set to
  undefined
- c7816aa: Added `Switch` and `Switch.Small` components

## 0.4.2

### Patch Changes

- edac0f1: Added Cell.Button component
- e9d978d: Set the Dialog container color to be dynamic.
- e507ef4: Increased `Cell` vertical padding

## 0.4.1

### Patch Changes

- 283729c: Added docstrings to all types and methods exposed by the library!
- ed5b46f: Added `Environment` component

## 0.4.0

### Minor Changes

- ddaf58c: Added `Dialog` components and `alert` function for easy usability to trigger dialog
- ddaf58c: Added `Scrim` component

### Patch Changes

- cd3b2eb: outlined buttons should now have the same height/width as other buttons
- afbaece: add GestureHandlerRootView to EDSProvider for Expo SDK 49 support

## 0.3.2

### Patch Changes

- 05f7145: Added Portal and Portal.Host components
- 5bbce84: Added `defaultOpen` prop to `Accordion.Item` component
- 05f7145: Add animations to Popover and Menu components!
- 6a82f85: Added swipe items to cells!
- 05f7145: Fixed error in build causing large package size

## 0.3.1

### Patch Changes

- eb3d0d1: Added `adornment` prop to `Cell.Group` component
- 764c47a: Added `disabled` prop to `Cell.Navigation` component

## 0.3.0

### Minor Changes

- dfcd044: Added peer requirement to `react-native-svg`

### Patch Changes

- 5e212e6: Added `forwardRef` to Cell component
- dfcd044: Added `loading` prop to Button component
- dfcd044: Added `DotProgress` component
- 08a351c: Added `meta` prop to Input and TextField components
- dfcd044: Added `LinearProgress` component
- dfcd044: Added `CircularProgress` component

## 0.2.5

### Patch Changes

- afe14c9: Reworked Cell styling
- 89f2e91: Added icon support for text buttons
- 89f2e91: Added disabled state to button
- 675f9d2: Made input field visually indicate its focus state
- afe14c9: Fixed Input component label padding
- 6c837a1: Added support for icon and adornment layout to Accordion.Item component
- 675f9d2: Added unit prop to TextField component
- 89f2e91: Added Button.Icon component
- 89f2e91: Added ghost button variation

## 0.2.4

### Patch Changes

- 8379013: Restructure text inputs
- 3acea10: Animate PressableHighlight component on release

## 0.2.3

### Patch Changes

- 6c65ad1: Add Cell, Cell Group and Navigation Cell components!
- 3a31f24: Added Menu component
- 6c65ad1: Streamlined colors used in the component library
- 6c65ad1: Added Accordion component!

## 0.2.2

### Patch Changes

- a1e9110: Removed MadLegacyButton
- a1e9110: Added support for more color options in the Typography component
- 5bc0eb2: Added TextField and Input components
- 5bc0eb2: Added a search component

## 0.2.1

### Patch Changes

- a242b74: Toggle buttons behave better on smaller screens, styles are now specific to tablets and
  phones

## 0.2.0

### Minor Changes

- 6112b37: Introduce theming engine. All components should now dynamically respond to the set theme
  and density!

### Patch Changes

- 6112b37: Extended the Button to support Button.Group and Button.Toggle

## 0.1.1

### Patch Changes

- 928f526: Configured eslint
- 2ff3459: Added proper build system
- 064958f: Added arrows to popovers.

## 0.1.0

### Minor Changes

- 6a5d12f: Created Digital Field worker Image Markup Canvas

## 0.0.2

### Patch Changes

- add minHeight to madLegacyButton

## 0.0.1

### Patch Changes

- 1a1a27c: Initial release!
