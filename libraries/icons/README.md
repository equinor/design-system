# @equinor/eds-icons

This package is a collection of the `system icons` from the Equinor Design System as javascript objects.

## Installation

```sh
npm install @equinor/eds-icons 
```
If you use Typescript, make sure you have typescript >= 3.8 as a devDependency:
```sh
npm install typescript --save-dev
```

## Usage

Import svg data:

```javascript
import { save } from "@equinor/eds-icons"
```

### React

We have developed a react component to simplify use of the EDS icons library within react.

```javascript
import { Icon } from '@equinor/eds-core-react'
import { save } from '@equinor/eds-icons'

// Use library approach 
Icon.add({ save }) // (this needs only be done once)
<Icon name="save" />

// OR 

// Use directly via data prop:
<Icon data={save} />

```

### FAQ

* If you are using NodeJS 13+ for module loading, it now has native ES modules support. Add `"type":"module"` to your apps `package.json` to enable this.

* If you get a syntax error trying to import ES module, try importing the CJS module as not all loaders have support for ES modules yet

#### Rendering icons

You can render it using plain [svg](https://developer.mozilla.org/en-US/docs/Web/SVG) or use our provided [React Icon component](#React) in [@equinor/eds-core-react](https://www.npmjs.com/package/@equinor/eds-core-react)

⚠️ Due to how Figma parses and exports svg icons the following attributes must be added to your `<path></path>` element; `fill-rule="evenodd" clip-rule="evenodd"`

Use [EDS Assets in Figma](https://www.figma.com/file/BQjYMxdSdgRkdhKTDDU7L4KU/Assets?node-id=2%3A3)(Equinor Figma account needed🔒) or [storefront](https://eds.equinor.com/assets/system-icons/library/) for icon names. Spaces in icon names are replaced with underscores. 

`star-filled -> star_filled`.

### Example of javascript object data

```javascript
{
  name: 'star_filled',
  prefix: 'eds',
  height: '24',
  width: '24',
  svgPathData: 'M12 16.067l4.947 3.6-1.894-5.814L20 10.334h-6.067l-1.933-6-1.933 6H4l4.947 3.52-1.894 5.814 4.947-3.6z',
}
```

## Credits

The EDS system icons are built on a copy of the [Outlined Material Design](https://material.io/resources/icons/?style=outline) icons provided open-source by Google. The icons have been customised and renamed for Equinor’s use.
