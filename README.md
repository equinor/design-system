# Equinor Design System

The EDS is the official design system of Equinor and is to be used when designing, prototyping and developing internal digital interfaces. The EDS provides structure, guidance and tools that enable designers and developers to efficiently build consistent, inclusive and flexible solutions.

While the design system itself lives in [Figma][], this repository contains implementations of the EDS in code.

## Table of contents

- [Status](#status)
- [Figma](#figma)
- [Storefront](#storefront)
- [React](#react)
- [Icons](#icons)
- [Tokens](#tokens)
- [Fonts](#fonts)
- [Logo](#logo)
- [Browser support](#browser-support)
- [Contribute](#contribute)
- [Getting started](#getting-started)
- [Get in touch](#get-in-touch)

## Status

| Package | Status | Version |
|--|--|--|
| [Core React](https://github.com/equinor/design-system/tree/develop/libraries/core-react) | [![Build Status](https://dev.azure.com/equinor-design-system/Equinor%20Design%20System/_apis/build/status/react-tests?branchName=develop)](https://dev.azure.com/equinor-design-system/Equinor%20Design%20System/_build/latest?definitionId=15&branchName=develop) | [![Version](https://img.shields.io/npm/v/@equinor/eds-core-react)](https://www.npmjs.com/package/@equinor/eds-core-react) |
| [Tokens](https://github.com/equinor/design-system/tree/develop/libraries/tokens) | [![Build Status](https://dev.azure.com/equinor-design-system/Equinor%20Design%20System/_apis/build/status/tokens?branchName=develop)](https://dev.azure.com/equinor-design-system/Equinor%20Design%20System/_build/latest?definitionId=17&branchName=develop) | [![Version](https://img.shields.io/npm/v/@equinor/eds-tokens)](https://www.npmjs.com/package/@equinor/eds-tokens)|
| [Icons](https://github.com/equinor/design-system/tree/develop/libraries/icons) | [![Build Status](https://dev.azure.com/equinor-design-system/Equinor%20Design%20System/_apis/build/status/icons?branchName=develop)](https://dev.azure.com/equinor-design-system/Equinor%20Design%20System/_build/latest?definitionId=16&branchName=develop) | [![Version](https://img.shields.io/npm/v/@equinor/eds-icons)](https://www.npmjs.com/package/@equinor/eds-icons)|
| [Figma broker](https://github.com/equinor/design-system/tree/develop/apps/figma-broker) | [![Build Status](https://dev.azure.com/equinor-design-system/Equinor%20Design%20System/_apis/build/status/figma-broker?branchName=develop)](https://dev.azure.com/equinor-design-system/Equinor%20Design%20System/_build/latest?definitionId=18&branchName=develop) | [![Version](https://img.shields.io/badge/dynamic/json?url=https://raw.githubusercontent.com/equinor/design-system/develop/apps/figma-broker/package.json&label=version&query=version&color=orange&prefix=v)](https://github.com/equinor/design-system/apps/figma-broker) |
| [Storybook React](https://github.com/equinor/design-system/tree/develop/apps/storybook-react) | [![Build Status](https://dev.azure.com/equinor-design-system/Equinor%20Design%20System/_apis/build/status/storybook-react?branchName=develop)](https://dev.azure.com/equinor-design-system/Equinor%20Design%20System/_build/latest?definitionId=12&branchName=develop) | [![Version](https://img.shields.io/badge/dynamic/json?url=https://raw.githubusercontent.com/equinor/design-system/develop/apps/storybook-react/package.json&label=version&query=version&color=orange&prefix=v)](https://github.com/equinor/design-system/apps/storybook-react) |
| [Storefront](https://github.com/equinor/design-system/tree/develop/apps/storefront) (dev) | [![Build Status](https://dev.azure.com/equinor-design-system/Equinor%20Design%20System/_apis/build/status/storefront-dev?branchName=develop)](https://dev.azure.com/equinor-design-system/Equinor%20Design%20System/_build/latest?definitionId=9&branchName=develop) | [![Version](https://img.shields.io/badge/dynamic/json?url=https://raw.githubusercontent.com/equinor/design-system/develop/apps/storefront/package.json&label=version&query=version&color=orange&prefix=v)](https://github.com/equinor/design-system/apps/storefront) |
| [Storefront](https://github.com/equinor/design-system/tree/develop/apps/storefront) (prod) | [![Build Status](https://dev.azure.com/equinor-design-system/Equinor%20Design%20System/_apis/build/status/storefront-production?branchName=develop)](https://dev.azure.com/equinor-design-system/Equinor%20Design%20System/_build/latest?definitionId=8&branchName=develop) | [![Version](https://img.shields.io/badge/dynamic/json?url=https://raw.githubusercontent.com/equinor/design-system/develop/apps/storefront/package.json&label=version&query=version&color=orange&prefix=v)](https://github.com/equinor/design-system/apps/storefront) |



## Figma

The EDS in Figma is the single source of truth. You can apply for access to Figma in [AccessIT]. See the [changelog][figma-changelog] for updates. The EDS Core team has workshops and demos on using Figma from time to time, these are announced in Slack and Teams (see [«Get in touch»](#get-in-touch))

[accessit]: https://accessit.equinor.com/Search/Search?term=figma
[figma-changelog]: https://eds.equinor.com/updates/release-information/changelog/



## Storefront

The [storefront][] is the official documentation for the EDS. As we’re getting [close to finishing][status] the EDS Core React library, we’ve started work on implementing the EDS in the storefront as well to replace the bare bones design it currently has. 

[status]: https://eds.equinor.com/components/component-status
[storefront]: https://eds.equinor.com
[Figma]: https://www.figma.com/

## React

This is the main implementation of the EDS, and will eventually contain accessible React components of each and every EDS component in Figma.

### Installation

```sh
npm install @equinor/eds-core-react styled-components
```

### Usage

```jsx
const { Button } = '@equinor/eds-core-react'

<Button variant="outlined" color="secondary">
  Click me!
</Button>
```

See our [storybook](https://eds-storybook-react.azurewebsites.net) for more examples.

## Icons

Built on a copy of the Outlined Material Design icons, the icons have been customised and renamed for Equinor’s use and supplemented with our own icons for Equinor specific domains.

All the icons are available in the [storefront](https://eds.equinor.com/assets/system-icons/library/), and can also be installed from NPM.

The following example uses the `<Icon>` component from `@equinor/eds-core-react` – but the icons package can also be used without React.

### Installation

```sh
npm install @equinor/eds-icons @equinor/eds-core-react
```

### Usage

```jsx
import { Icon } from '@equinor/eds-core-react'
import { info_circle } from '@equinor/eds-icons'

Icon.add({ info_circle })

<Icon name="info_circle" size={24} />
```

## Tokens

Design tokens are design decisions from Figma extracted into code, and form the basis for the [EDS Core React library](#react). For projects that don’t use React, the tokens are available as an independent NPM package that can be used to build your own implementation of the EDS in your technology of choice. The following example uses vanilla javascript.

### Installation

```sh
npm install @equinor/eds-tokens
```

### Usage 

```js
import { tokens } from '@equinor/eds-tokens'

const {
  typography: {
    heading: { h1 },
  },
} = tokens

const header = document.createElement('h1')

Object.keys(h1).forEach((token) => {
  header.style[token] = h1[token]
})

header.textContent = 'Some header'

document.body.appendChild(header)
```


## Fonts

The Equinor typeface is available from the EDS CDN. 

### Usage

### All the fonts

```html
<link rel="stylesheet" href="https://eds-static.equinor.com/font/equinor-font.css" />
```

### Individual fonts

```html
<link rel="stylesheet" href="https://eds-static.equinor.com/font/equinor-regular.css" />
```

We currently don’t support the font-display property, so if that’s something you need then please let us know.


## Logo

When it comes to the Equinor logo, we have two versions – primary and horizontal – and you pick the colour with a fragment identifier in the url. The following example uses the primary logo in red, other colour options are white and black – with black being the default if you omit the fragment identifier.

### Usage

```html
<img src="https://eds-static.equinor.com/logo/equinor-logo-primary.svg#red" alt="Equinor" />
```


## Browser support

We support the most up to date version of evergreen browsers (browsers that auto-update), which means Chrome, Safari, Firefox and (Chromium) Edge.


## Contributions

Contributions are welcome and encouraged! File bug reports and feature requests in Github issues, and [get in touch](#get-in-touch) with us if you want to help us out with implementing the components or have ideas for components we should include in the EDS.

## Getting started

We use [pnpm][] as the package manager, because it’s fast, space efficient, and has some very useful commands when working with a monorepo – so you should start off by installing it globally:

```bash
$ npm i -g pnpm
```

It is possible to change directory into one of the subdirectories and run pnpm commands from there, but if’s usually better to run most commands from the root, and use `--filter` to single out the package you’re working on. So to install all the dependencies in all the packages simultaneosly, run `pnpm m i`, which is the shorthand version of `pnpm multi install`.

If you would like to start the storefront then, you would run `pnpm --filter @equinor/eds-storefront run start`, and if you want to install some devDependency, `pnpm --filter @equinor/eds-storefront i -D <some-module>`.

There are some useful scripts in the root package.yaml for common tasks.

[pnpm]: https://pnpm.js.org

## Get in touch

We use [#eds-design-system][slack] on Slack as our main communication channel – but we have an [internal team][teams] on Teams as well that you can join if you want to get in touch with us. If you’re outside Equinor and want to get in touch with the team, then please create an issue.

[teams]: https://teams.microsoft.com/l/team/19%3a08081ac3d7134608b312d8480aa87efc%40thread.tacv2/conversations?groupId=204b36ea-ba52-4cee-aeac-895f675e91b0&tenantId=3aa4a235-b6e2-48d5-9195-7fcf05b459b0
[slack]: https://equinor.slack.com/archives/CJT20H1B9
