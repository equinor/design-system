# Equinor Design System

The EDS is the official design system of Equinor and is to be used when designing, prototyping and developing internal digital interfaces. The EDS provides structure, guidance and tools that enable designers and developers to efficiently build consistent, inclusive and flexible solutions.

While the design system itself lives in [Figma][], this repository contains implementations of the EDS in code.

## Quick links

- [Storybook (prod)](https://storybook.eds.equinor.com/)
- [Storybook (dev)](https://s478stedsstorybookdev.z16.web.core.windows.net/) – latest from `main`
- [Figma](https://www.figma.com/files/682286909510540417/team/590517879490131675/EDS---Equinor-Design-System?fuid=677437722215124736)
- [Storefront](https://eds.equinor.com)
- [Slack](https://equinor.slack.com/archives/CJT20H1B9)
- [Architecture Decision Records](./docs/adr/) – documented architecture decisions

## Repository structure

This is a monorepo containing both published packages and applications:

```
apps/                    # Applications (not published to npm)
  design-system-docs/    # Documentation website (Docusaurus)
  eds-demo/              # Component demo application (Next.js)
  eds-color-palette-generator/  # Color palette generation tool
packages/                # Published npm packages
  eds-core-react/        # React component library
  eds-tokens/            # Design tokens
  eds-icons/             # Icon library
  eds-lab-react/         # Experimental components
  eds-data-grid-react/   # Data grid component
  eds-utils/             # Utility functions
  eds-tailwind/          # Tailwind CSS plugin
```
  
## Table of contents

- [Equinor Design System](#equinor-design-system)
  - [Quick links](#quick-links)
  - [Table of contents](#table-of-contents)
  - [Repository structure](#repository-structure)
  - [Status](#status)
  - [Applications](#applications)
  - [Prerequisites](#prerequisites)
  - [How to run](#how-to-run)
    - [Use Gitpod and develop in the browser](#use-gitpod-and-develop-in-the-browser)
    - [Clone and develop locally](#clone-and-develop-locally)
    - [Common development commands](#common-development-commands)
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
  - [Lab React](#lab-react)
    - [Installation](#installation-3)
    - [Usage](#usage-3)
  - [Data Grid](#data-grid)
    - [Installation](#installation-4)
    - [Usage](#usage-4)
  - [Fonts](#fonts)
    - [Usage](#usage-5)
    - [All the fonts](#all-the-fonts)
    - [Individual fonts](#individual-fonts)
  - [Logo](#logo)
    - [Usage](#usage-6)
  - [Browser support](#browser-support)
  - [Troubleshooting](#troubleshooting)
    - [Port already in use](#port-already-in-use)
    - [Build failures](#build-failures)
    - [Module not found errors](#module-not-found-errors)
  - [License](#license)
  - [Contributions](#contributions)
  - [Get in touch](#get-in-touch)

## Status



| Package | Status | Version |
|--|--|--|
| [Core React](https://github.com/equinor/design-system/tree/main/packages/eds-core-react) | [![Checks](https://github.com/equinor/design-system/actions/workflows/checks.yaml/badge.svg)](https://github.com/equinor/design-system/actions/workflows/checks.yaml) | [![Version](https://img.shields.io/npm/v/@equinor/eds-core-react)](https://www.npmjs.com/package/@equinor/eds-core-react) |
| [Tokens](https://github.com/equinor/design-system/tree/main/packages/eds-tokens) | [![Checks](https://github.com/equinor/design-system/actions/workflows/checks.yaml/badge.svg)](https://github.com/equinor/design-system/actions/workflows/checks.yaml)| [![Version](https://img.shields.io/npm/v/@equinor/eds-tokens)](https://www.npmjs.com/package/@equinor/eds-tokens)|
| [Icons](https://github.com/equinor/design-system/tree/main/packages/eds-icons) | [![Checks](https://github.com/equinor/design-system/actions/workflows/checks.yaml/badge.svg)](https://github.com/equinor/design-system/actions/workflows/checks.yaml)| [![Version](https://img.shields.io/npm/v/@equinor/eds-icons)](https://www.npmjs.com/package/@equinor/eds-icons)|
| [Lab React](https://github.com/equinor/design-system/tree/main/packages/eds-lab-react) | [![Checks](https://github.com/equinor/design-system/actions/workflows/checks.yaml/badge.svg)](https://github.com/equinor/design-system/actions/workflows/checks.yaml) | [![Version](https://img.shields.io/npm/v/@equinor/eds-lab-react)](https://www.npmjs.com/package/@equinor/eds-lab-react) |
| [Data Grid React](https://github.com/equinor/design-system/tree/main/packages/eds-data-grid-react) | [![Checks](https://github.com/equinor/design-system/actions/workflows/checks.yaml/badge.svg)](https://github.com/equinor/design-system/actions/workflows/checks.yaml) | [![Version](https://img.shields.io/npm/v/@equinor/eds-data-grid-react)](https://www.npmjs.com/package/@equinor/eds-data-grid-react) |
| [Utils](https://github.com/equinor/design-system/tree/main/packages/eds-utils) | [![Checks](https://github.com/equinor/design-system/actions/workflows/checks.yaml/badge.svg)](https://github.com/equinor/design-system/actions/workflows/checks.yaml) | [![Version](https://img.shields.io/npm/v/@equinor/eds-utils)](https://www.npmjs.com/package/@equinor/eds-utils) |

## Applications

These applications are part of the monorepo but are not published to npm.

| Application | Purpose | Start Command |
|-------------|---------|---------------|
| [Documentation](./apps/design-system-docs) | EDS documentation website built with Docusaurus | `pnpm docu:start` |
| [Demo](./apps/eds-demo) | Component showcase and examples using Next.js | `pnpm demo:dev` |
| [Color Palette Generator](./apps/eds-color-palette-generator) | Tool for generating accessible color palettes | `pnpm palette:dev` |

## Prerequisites

Before you begin, ensure you have the following installed:

<!-- 
  Version numbers below are automatically extracted by scripts/extract-prerequisites.js
  To update: run `pnpm run build` or `node scripts/extract-prerequisites.js`
  Source: prerequisites.json (generated from .nvmrc and package.json)
-->

* **Node.js** — Version 22.12.0 or compatible
* **pnpm** — Version 10.15.0 or higher (install globally with `npm install -g pnpm@10.15.0`)
* **Git** — For version control



## How to run

Would you like to contribute? Awesome! 👏

We use a fork and pull-request workflow, so start with forking the repository on Github, then either open it in Gitpod or clone your fork locally.  
Check out Github docs on [how to work with forks](https://docs.github.com/en/github/collaborating-with-pull-requests/working-with-forks)

### Use [Gitpod](https://www.gitpod.io/) and develop in the browser

Just prepend the url to your fork with https://gitpod.io/#, so for example https://gitpod.io/#https://github.com/yourusername/design-system. Dependencies will be installed automatically, then tests and linting will run, and finally the storybook will open in it’s own preview window ready to start coding.

### Clone and develop locally

```bash
git clone git@github.com:your-github-username/design-system
```

We use [pnpm][] as the package manager, because it's fast, space efficient, and has some very useful commands when working with a monorepo.

```bash
npm install -g pnpm@10.15.0
```

Install dependencies and build all packages using our `init` script:

```bash
cd design-system
pnpm run init
```

[pnpm]: https://pnpm.js.org

### Common development commands

```bash
# Build all packages
pnpm build

# Run all tests
pnpm test

# Lint entire codebase
pnpm lint:all

# Start Storybook for component development
pnpm storybook

# Start documentation site
pnpm docu:start

# Start demo application
pnpm demo:dev

# Start color palette generator
pnpm palette:dev
```

### Work with the React components

We use [Storybook](https://storybook.js.org/) as a development environment.

Start Storybook on localhost:9000 by running the following command from root:

```bash
pnpm run storybook
```

Run tests once or by watching:

```bash
pnpm run test:core-react 
pnpm run test:watch:core-react 
``` 

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

### Beta Components (EDS 2.0 / Next)

We're developing the next generation of EDS components under the `/next` entry point. These components are available as **beta releases** for early testing and feedback.

#### Installation

```sh
# Install the beta version
npm install @equinor/eds-core-react@beta
```

#### Usage

```jsx
// Import from the /next entry point
import { ComponentName } from '@equinor/eds-core-react/next'

// Import CSS separately (required for SSR compatibility)
import '@equinor/eds-core-react/next/index.css'
```

#### Important Notes

- **Beta components are under active development** and may have breaking changes
- **Not production-ready** until they graduate to the stable package
- **Visible in Storybook** - browse components at [storybook.eds.equinor.com](https://storybook.eds.equinor.com/) under "EDS 2.0"
- **Requires beta installation** - viewing in Storybook doesn't enable usage, you must install `@beta`
- **Separate changelog** - see `src/components/next/CHANGELOG.md` for beta changes
- **Feedback welcome** - help us improve before stable release!

See the [Beta Release Guide](./documentation/how-to/BETA_RELEASE_GUIDE.md) for detailed information on the beta release workflow.

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

## Lab React

Experimental React components that are still in development. These components may undergo breaking changes and are not recommended for production use until they are moved to the Core React library.

### Installation

```sh
npm install @equinor/eds-lab-react styled-components
```

If you use TypeScript, make sure you have typescript >= 3.8 as a devDependency:
```sh
npm install typescript --save-dev
```

### Usage

```jsx
import { Stepper } from '@equinor/eds-lab-react'

<Stepper activeStepIndex={0}>
  <Stepper.Step>Step 1</Stepper.Step>
  <Stepper.Step>Step 2</Stepper.Step>
</Stepper>
```

See our [Storybook](https://storybook.eds.equinor.com/) for more examples and available components.

## Data Grid

A powerful data grid component built with AG Grid, providing sorting, filtering, and other advanced table features.

### Installation

```sh
npm install @equinor/eds-data-grid-react ag-grid-react
```

If you use TypeScript, make sure you have typescript >= 3.8 as a devDependency:
```sh
npm install typescript --save-dev
```

### Usage

```jsx
import { EdsProvider, DataGrid } from '@equinor/eds-data-grid-react'

const columnDefs = [
  { field: 'name' },
  { field: 'age' },
]

const rowData = [
  { name: 'Alice', age: 30 },
  { name: 'Bob', age: 25 },
]

<EdsProvider>
  <DataGrid columnDefs={columnDefs} rowData={rowData} />
</EdsProvider>
```

See the [package documentation](https://github.com/equinor/design-system/tree/main/packages/eds-data-grid-react) for more details.


## Fonts

EDS uses two font families: **Equinor** for headings and **Inter** for UI/body text. Both are available from the EDS CDN as variable fonts:

### Recommended (includes both Equinor and Inter)

```html
<link rel="stylesheet" href="https://cdn.eds.equinor.com/font/eds-uprights-vf.css" />
```

> **Note:** If you use EDS 2.0 (`next`) components, this stylesheet is required. The older `equinor-font.css` only includes Equinor, so UI components will fall back to a generic sans-serif.

### Individual fonts

```html
<link rel="stylesheet" href="https://cdn.eds.equinor.com/font/equinor-regular.css" />
```


## Logo

When it comes to the Equinor logo, we have two versions – primary and horizontal – and you pick the color with a fragment identifier in the url. The following example uses the primary logo in red, other color options are white and black – with black being the default if you omit the fragment identifier.

### Usage

```html
<img src="https://cdn.eds.equinor.com/logo/equinor-logo-primary.svg#red" alt="Equinor" />
```


## Browser support

We support the most up to date version of evergreen browsers (browsers that auto-update), which means Chrome, Safari, Firefox and (Chromium) Edge.

## Troubleshooting

### Port already in use

If you get an error that port 9000 (Storybook), 3000 (demo/docs), or other ports are already in use, you can either:
- Stop the process using that port
- Change the port in the respective configuration file

### Build failures

If you encounter build failures:
1. Ensure all dependencies are up to date: `pnpm install`
2. Clean and rebuild: `pnpm clean && pnpm build`
3. Make sure you're using the correct Node.js version (22.12.0)

### Module not found errors

If you see "Module not found" errors:
- Run `pnpm run init` to install all dependencies and build packages
- Ensure workspace dependencies are built before consuming packages

## License

The Equinor Design System is licensed under the [MIT License](./LICENSE).

## Contributions

Contributions are welcome and encouraged! Here's how to contribute:

1. **Report issues** — File bug reports and feature requests in [GitHub issues](https://github.com/equinor/design-system/issues)
2. **Fork and develop** — Follow the [fork and pull-request workflow](#how-to-run) outlined above
3. **Submit a pull request** — All changes must be reviewed and approved by the EDS team before merging
4. **Follow conventions** — Use [conventional commits](./documentation/how-to/CONVENTIONAL_COMMITS.md) for your commit messages

If you want to help implement components or have ideas for what we should include in the EDS, please get in touch with the team.

## Get in touch

We use [#eds-design-system][slack] on Slack as our main communication channel – but we have an [internal team][teams] on Teams as well that you can join if you want to get in touch with us. If you’re outside Equinor and want to get in touch with the team, then please create an issue.

[teams]: https://teams.microsoft.com/l/team/19%3a08081ac3d7134608b312d8480aa87efc%40thread.tacv2/conversations?groupId=204b36ea-ba52-4cee-aeac-895f675e91b0&tenantId=3aa4a235-b6e2-48d5-9195-7fcf05b459b0
[slack]: https://equinor.slack.com/archives/CJT20H1B9
