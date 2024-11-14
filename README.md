# Equinor Design System!

The EDS is the official design system of Equinor and is to be used when designing, prototyping and developing internal digital interfaces. The EDS provides structure, guidance and tools that enable designers and developers to efficiently build consistent, inclusive and flexible solutions.

While the design system itself lives in [Figma][], this repository contains implementations of the EDS in code.

## Quick links

- [Storybook](https://storybook.eds.equinor.com/)
- [Figma](https://www.figma.com/files/682286909510540417/team/590517879490131675/EDS---Equinor-Design-System?fuid=677437722215124736)
- [Storefront](https://eds.equinor.com)
- [Slack](https://equinor.slack.com/archives/CJT20H1B9)
  
## Table of contents

- [Equinor Design System](#equinor-design-system)
  - [Quick links](#quick-links)
  - [Table of contents](#table-of-contents)
  - [Status](#status)
  - [How to run](#how-to-run)
    - [Use Gitpod and develop in the browser](#use-gitpod-and-develop-in-the-browser)
    - [Clone and develop locally](#clone-and-develop-locally)
    - [Work with the React components](#work-with-the-react-components)
  - [Figma](#figma)
  - [Storefront](#storefront)
  - [React](#react)
    - [Installation](#installation)
    - [Usage](#usage)
  - [Icons](#icons)
    - [Installation](#installation-1)
    - [Usage](#usage-1)
  - [Tokens](#tokens)
    - [Installation](#installation-2)
    - [Usage](#usage-2)
  - [Fonts](#fonts)
    - [Usage](#usage-3)
    - [All the fonts](#all-the-fonts)
    - [Individual fonts](#individual-fonts)
  - [Logo](#logo)
    - [Usage](#usage-4)
  - [Browser support](#browser-support)
  - [Contributions](#contributions)
  - [Get in touch](#get-in-touch)

## Status



| Package | Status | Version |
|--|--|--|
| [Core React](https://github.com/equinor/design-system/tree/develop/packages/eds-core-react) | [![Checks](https://github.com/equinor/design-system/actions/workflows/checks.yaml/badge.svg)](https://github.com/equinor/design-system/actions/workflows/checks.yaml) | [![Version](https://img.shields.io/npm/v/@equinor/eds-core-react)](https://www.npmjs.com/package/@equinor/eds-core-react) |
| [Tokens](https://github.com/equinor/design-system/tree/develop/packages/eds-tokens) | [![Checks](https://github.com/equinor/design-system/actions/workflows/checks.yaml/badge.svg)](https://github.com/equinor/design-system/actions/workflows/checks.yaml)| [![Version](https://img.shields.io/npm/v/@equinor/eds-tokens)](https://www.npmjs.com/package/@equinor/eds-tokens)|
| [Icons](https://github.com/equinor/design-system/tree/develop/packages/eds-icons) | [![Checks](https://github.com/equinor/design-system/actions/workflows/checks.yaml/badge.svg)](https://github.com/equinor/design-system/actions/workflows/checks.yaml)| [![Version](https://img.shields.io/npm/v/@equinor/eds-icons)](https://www.npmjs.com/package/@equinor/eds-icons)|



## How to run

Would you like to contribute? Awesome! 👏

We use a fork and pull-request workflow, so start with forking the repository on Github, then either open it in Gitpod or clone your fork locally.  
Checkout Github docs on [how to work with forks](https://docs.github.com/en/github/collaborating-with-pull-requests/working-with-forks)

### Use [Gitpod](https://www.gitpod.io/) and develop in the browser

Just prepend the url to your fork with https://gitpod.io/#, so for example https://gitpod.io/#https://github.com/yourusername/design-system. Dependencies will be installed automatically, then tests and linting will run, and finally the storybook will open in it’s own preview window ready to start coding.

### Clone and develop locally

    $ git clone git@github.com:your-github-username/design-system

We use [pnpm][] as the package manager, because it’s fast, space efficient, and has some very useful commands when working with a monorepo – so you should start off by installing it globally.

    $ npm install -g pnpm

Currently the project only runs on up to Node.js `v16.15`  

Install dependencies & build using our `init` script:

    $ cd design-system
    $ pnpm run init

[pnpm]: https://pnpm.js.org

### Work with the React components
We use [storybook](https://storybook.js.org/) as a development environment.

Start storybook on localhost:9000 by running the following command from root:

    $ pnpm run storybook


Run tests once or by watching

    $ pnpm run test:core-react 
    $ pnpm run test:watch:core-react 

## Figma

The EDS in Figma is the single source of truth. You can apply for access to Figma in [AccessIT]. The EDS Core team has workshops and demos on using Figma from time to time, these are announced in Slack and Teams (see [«Get in touch»](#get-in-touch))

[accessit]: https://accessit.equinor.com/Search/Search?term=figma

## Storefront

The [storefront][] is the official documentation for the EDS.

[storefront]: https://eds.equinor.com
[Figma]: https://www.figma.com/

## React

This is the main implementation of the EDS, and will eventually contain accessible React components of each and every EDS component in Figma.

### Installation

```sh
npm install @equinor/eds-core-react styled-components
```
If you use Typescript, make sure you have typescript >= 3.8 as a devDependency:
```sh
npm install typescript --save-dev
```

### Usage

```jsx
import { Button } from '@equinor/eds-core-react'

<Button variant="outlined" color="secondary">
  Click me!
</Button>
```

See our [storybook](https://storybook.eds.equinor.com/) for more examples.

## Icons

Built on a copy of the Outlined Material Design icons, the icons have been customised and renamed for Equinor’s use and supplemented with our own icons for Equinor specific domains.

All the icons are available in our [Storybook](https://storybook.eds.equinor.com/?path=/docs/icons-preview--docs), and can also be installed from NPM.

The following example uses the `<Icon>` component from `@equinor/eds-core-react` – but the icons package can also be used without React.

### Installation

```sh
npm install @equinor/eds-icons @equinor/eds-core-react
```
If you use Typescript, make sure you have typescript >= 3.8 as a devDependency:
```sh
npm install typescript --save-dev
```

### Usage

```jsx
import { Icon } from '@equinor/eds-core-react'
import { info_circle } from '@equinor/eds-icons'

<Icon data={info_circle} size={24} />
```

## Tokens

Design tokens are design decisions from Figma extracted into code, and form the basis for the [EDS Core React library](#react). For projects that don’t use React, the tokens are available as an independent NPM package that can be used to build your own implementation of the EDS in your technology of choice. The following example uses vanilla javascript.

### Installation

```sh
npm install @equinor/eds-tokens
```
If you use Typescript, make sure you have typescript >= 3.8 as a devDependency:
```sh
npm install typescript --save-dev
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
<link rel="stylesheet" href="https://cdn.eds.equinor.com/font/equinor-font.css" />
```

### Individual fonts

```html
<link rel="stylesheet" href="https://cdn.eds.equinor.com/font/equinor-regular.css" />
```

We currently don’t support the font-display property, so if that’s something you need then please let us know.


## Logo

When it comes to the Equinor logo, we have two versions – primary and horizontal – and you pick the colour with a fragment identifier in the url. The following example uses the primary logo in red, other colour options are white and black – with black being the default if you omit the fragment identifier.

### Usage

```html
<img src="https://cdn.eds.equinor.com/logo/equinor-logo-primary.svg#red" alt="Equinor" />
```


## Browser support

We support the most up to date version of evergreen browsers (browsers that auto-update), which means Chrome, Safari, Firefox and (Chromium) Edge.


## Contributions

Contributions are welcome and encouraged! File bug reports and feature requests in Github issues, and [get in touch](#get-in-touch) with us if you want to help us out with implementing the components or have ideas for components we should include in the EDS.

## Get in touch

We use [#eds-design-system][slack] on Slack as our main communication channel – but we have an [internal team][teams] on Teams as well that you can join if you want to get in touch with us. If you’re outside Equinor and want to get in touch with the team, then please create an issue.

[teams]: https://teams.microsoft.com/l/team/19%3a08081ac3d7134608b312d8480aa87efc%40thread.tacv2/conversations?groupId=204b36ea-ba52-4cee-aeac-895f675e91b0&tenantId=3aa4a235-b6e2-48d5-9195-7fcf05b459b0
[slack]: https://equinor.slack.com/archives/CJT20H1B9
