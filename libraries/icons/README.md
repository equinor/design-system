# @equinor/eds-icons

*Still in development so breaking changes may occur*

This package is just a collection of the svg icons. How you use them is up to your choice of technology and frameworks.

## Installation

```sh
npm install @equinor/eds-icons
```

## Usage

Import using one of the following options:
* SVG string
```jsx 
import icons from '@equinor/icons' 
// or 
import { save } from '@equinor/icons'
```

* React

Use this with [SVGR + Webpack](https://www.smooth-code.com/open-source/svgr/docs/webpack/) and it will convert it to a React component for you. 
```jsx
import Save from '@equinor/eds-icons/system-icons/ui-action/save.svg'
```


## Credits

The EDS system icons are built on a copy of the [Outlined Material Design](https://material.io/resources/icons/?style=outline) icons provided open-source by Google. The icons have been customised and renamed for Equinor’s use.
