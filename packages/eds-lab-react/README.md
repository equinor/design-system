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


### DatePicker

You will need to require the CSS file from the `react-datepicker` package (or provide your own). The example below shows how to include the CSS from this package if your build system supports requiring CSS files.

```css
import 'react-datepicker/dist/react-datepicker.css';
```