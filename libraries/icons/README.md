# @equinor/eds-icons

*Still in development so breaking changes may occur*

This package is just a collection of the `system icons` as svg files. How you use them is up to your choice of technology and frameworks.

## Installation

```sh
npm install @equinor/eds-icons
```

## Usage

Import using one of the following options to get the svg file:

```jsx 
import icons from '@equinor/icons' 
// or 
import { save } from '@equinor/icons'
// or 
import save from '@equinor/eds-icons/system-icons/ui-action/save.svg'

```
Use [EDS Aseets in Figma](https://www.figma.com/file/BQjYMxdSdgRkdhKTDDU7L4KU/Assets?node-id=2%3A3)(Equinor Figma account needed🔒) for icon names. Spaces in icon names are replaced with underscores. 

For example: `google-translate -> google_translate`.
### React

If you are using React you can, for example use [SVGR](https://www.smooth-code.com/open-source/svgr/docs/) to convert it to a React component for you.


## Credits

The EDS system icons are built on a copy of the [Outlined Material Design](https://material.io/resources/icons/?style=outline) icons provided open-source by Google. The icons have been customised and renamed for Equinor’s use.
