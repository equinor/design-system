# Equinor Design System

<div style="font-size: 1.3rem">
The EDS is the official design system of Equinor and is to be used when designing, prototyping and developing internal digital interfaces. The EDS provides structure, guidance and tools that enable designers and developers to efficiently build consistent, inclusive and flexible solutions.
</div>

While the design system itself lives in [Figma][], this repository contains implementations of the EDS in code – with EDS Core React being the main focus.

## Table of contents

- [Figma](#figma)
- [Storefront](#storefront)
- [Storybook](#storybook)
- [NPM](#npm)
- [CDN](#cdn)
- [Contribute](#contribute)
- [Getting started](#getting-started)
- [Get in touch](#get-in-touch)

## Figma

The EDS in Figma is the single source of truth. You can apply for access to Figma in [AccessIT]. See the [changelog][figma-changelog] for updates. The EDS Core team has workshops and demos on using Figma from time to time, these are announced in Slack and Teams (see [«Get in touch»](#get-in-touch))

[accessit]: https://accessit.equinor.com/Search/Search?term=figma
[figma-changelog]: https://eds.equinor.com/updates/release-information/changelog/



## Storefront

The [storefront][] is the official documentation for the EDS. As we’re getting [close to finishing][status] the EDS Core React library, we’ve started work on implementing the EDS in the storefront as well to replace the bare bones design it currently has. 

[status]: https://eds.equinor.com/components/component-status
[storefront]: https://eds.equinor.com
[Figma]: https://www.figma.com/

## Storybook

We use [the storybook](https://eds-storybook-react.azurewebsites.net) for developing components in isolation, and also as developer documentation until further notice. 

## NPM

We currently provide the following npm modules: 

- [EDS Core React][core-react]
  - The main implementation of the EDS. 
- [Icon library][icons]
  - Built on a copy of the Outlined Material Design icons, the icons have been customised and renamed for Equinor’s use.
- [Tokens][]
  - Design tokens extracted from Figma using the Figma Broker, the tokens can be used if you want to make your own EDS implementation in your framework of choice

  The source for these modules can be found under [`/libraries`](https://github.com/equinor/design-system/tree/develop/libraries)

[tokens]: https://www.npmjs.com/package/@equinor/eds-tokens
[icons]: https://www.npmjs.com/package/@equinor/eds-icons
[core-react]: https://www.npmjs.com/package/@equinor/eds-core-react


## CDN

The Equinor logo and typeface is available from the EDS CDN. 

### All the fonts

```html
<link rel="stylesheet" href="https://eds-static.equinor.com/font/equinor-font.css" />
```

### Individual fonts

```html
<link rel="stylesheet" href="https://eds-static.equinor.com/font/equinor-regular.css" />
```

We currently don’t support the font-display property, so if that’s something you need then please let us know.

### The logo

When it comes to the logo, we have two versions – primary and horizontal – and you pick the colour with a fragment identifier in the url. The following example uses the primary logo in red, other colour options are white and black – with black being the default if you omit the fragment identifier.

```html
<img src="https://eds-static.equinor.com/logo/equinor-logo-primary.svg#red" alt="Equinor" />
```

## Useful links

- Component status page in the storefront
- EDS Core React storybook
- 


Check out the component status page to see what we’re working on right now :eyes:
Check out the storybook for usage examples :orange_book:
Create Github issues for feature requests or bug reports :beetle:
Be sure to checkout the Figma changelog for design changes :lipstick:


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

We use [#eds-design-system][slack] on Slack as our main communication channel – but we have a [public team][teams] on Teams as well that you can join if you want to get in touch with us.

[teams]: https://teams.microsoft.com/l/team/19%3a08081ac3d7134608b312d8480aa87efc%40thread.tacv2/conversations?groupId=204b36ea-ba52-4cee-aeac-895f675e91b0&tenantId=3aa4a235-b6e2-48d5-9195-7fcf05b459b0
[slack]: https://equinor.slack.com/archives/CJT20H1B9
