
# Icon

React component for rendering SVG icons. The component is just an empty render compoent intended to use provided icons libraries.

## Usage

The Icon component is intended to be used with the `@equinor/eds-icons` package, but can also render any other svg data if provided through the `data` prop.

Example of ways to use the `Icon` component.

```jsx
import { Icon } from '@equinor/eds-core-react'
import { save } from '@equinor/eds-icons'

// Way 1
// Add to library (this needs only be done once)
Icon.add({ save })
// Renders "save" icon only
<Icon name="save" />

// Way 2
// EDS icon
<Icon data={save} />

// Way 3
// Custom icon
<Icon data={{
  prefix: 'custom',
  height: '24',
  width: '24',
  svgPathData: 'M12 16.067l4.947 3.6-1.894-5.814L20 10.334h-6.067l-1.933-6-1.933 6H4l4.947 3.52-1.894 5.814 4.947-3.6z',
}}>
``` 

### Accessibilty

Using the icons semantically, for example using "save" or "print" icon as an action we have tried to make it as simple as we can.

If your icon has semantic meaning, all you have to do is throw on `title="meaning"` property.


#### References
[Font Awesome, Semantic Svg](https://fontawesome.com/how-to-use/on-the-web/other-topics/accessibility#svg-semantic)