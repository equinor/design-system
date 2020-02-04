
# Icon

React component for rendering SVG icons. The component is just an empty render compoent intended to use provided icons libraries.

## Usage

The Icon component is intended to be used with the `@equinor/eds-icons` package.

```javascript
import { Icon } from '@equinor/eds-core-react'
import { save } from '@equinor/eds-icons'

// Add to library (this needs only be done once)
Icon.add({ save })

// Renders "save" icon
<Icon name="save" />

``` 

### Accessibilty

Using the icons semantically, for example using "save" or "print" icon as an action we have tried to make it as simple as we can.

If your icon has semantic meaning, all you have to do is throw on `title="meaning"` property.


#### References
[Font Awesome, Semantic Svg](https://fontawesome.com/how-to-use/on-the-web/other-topics/accessibility#svg-semantic)