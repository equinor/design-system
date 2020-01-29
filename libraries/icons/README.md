# @equinor/eds-icons

*Still in development so breaking changes may occur*

This package is just a collection of the `system icons` as svg files. How you use them is up to your choice of technology and frameworks.

## Installation

```sh
npm install @equinor/eds-icons
```

## Usage

Import using one of the following options to get the svg data:

### Usage

#### Use as ESM Module
Add `"type":"module" ` to your apps `package.json` 
```javascript
import { star_filled } from "@equinor/eds-icons"
```

#### Use as CommonJS Module
CommonJS will have a separate package path 
```javascript
const icons = require("@equinor/eds-icons/commonjs")
```

#### SVG data

⚠️ Due to how Figma parses and exports svg icons the following attributes must be added to your path element for now:  `fill-rule="evenodd" clip-rule="evenodd"`

```javascript
{
  name: 'star_filled',
  prefix: 'eds',
  height: '24',
  width: '24',
  svgPathData: 'M12 16.067l4.947 3.6-1.894-5.814L20 10.334h-6.067l-1.933-6-1.933 6H4l4.947 3.52-1.894 5.814 4.947-3.6z',
}
```


Use [EDS Aseets in Figma](https://www.figma.com/file/BQjYMxdSdgRkdhKTDDU7L4KU/Assets?node-id=2%3A3)(Equinor Figma account needed🔒) for icon names. Spaces in icon names are replaced with underscores. 

For example: `star-filled -> star_filled`.

### React

We suggest using the [svg](https://developer.mozilla.org/en-US/docs/Web/SVG) element with the svg data provided


## Credits

The EDS system icons are built on a copy of the [Outlined Material Design](https://material.io/resources/icons/?style=outline) icons provided open-source by Google. The icons have been customised and renamed for Equinor’s use.
