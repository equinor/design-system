# @equinor/eds-lab-react

This package host incubator components that are not ready to be moved to the core.

The main difference between the lab and core is how components are versioned and general component structure. Having a lab package allows us to test new components in isolation, experiment with new features or test technical improvements without breaking changes in core.
[Storybook](https://s478stedsstorybooklabs.z16.web.core.windows.net/) for lab-react
## Installation

```sh
npm install @equinor/eds-lab-react styled-components
```
If you use Typescript, make sure you have typescript >= 3.8 as a devDependency:
```sh
npm install typescript --save-dev
```

## Known issues and workarounds

### Datepicker

Under some circumstances `<Datepicker />` is missing it’s styles. A temporary workaround is to import the css explicitly as reported in issue [#2081](https://github.com/equinor/design-system/issues/2081).

```css
import 'react-datepicker/dist/react-datepicker.css';
```
