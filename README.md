# Equinor Design System

## Introduction

This repository is organised as a monorepo, with the following structure:

- Apps
  - Figma broker (pulls data from Figma and generates tokens)
  - Storefront (the documentation located at https://eds.equinor.com)
  - Storybook React (development environment for the React components)
- Common
  - Common config
  - Tokens generated by Figma broker
- Libraries
  - Core (the vanilla implementation of the EDS)
  - Core React (the React implementation of the EDS)
  - Icons

## Getting started

### Internal NPM repository

To be able to install packages from the internal NPM repository, there are a few steps you need to take:

1. Make sure you’re a member of the Equinor organization on Github, if you’re not, then apply for Github access in AccessIT.
1. Generate a personal access token on Github with `read:org` privileges
1. Create a local environment variable on your computer with the name `EQUINOR_INTERNAL_NPM_TOKEN` and the access token as the value.

### PNPM

We use pnpm as the package manager, because it’s fast, space efficient, and has some very useful commands when working with a monorepo – so you should start off by installing it globally:

```bash
$ npm i -g pnpm
```

It is possible to change directory into one of the subdirectories and run pnpm commands from there, but if’s usually better to run most commands from the root, and use `--filter` to single out the package you’re working on. So to install all the dependencies in all the packages simultaneosly, run `pnpm m i`, which is the shorthand version of `pnpm multi install`.

If you would like to start the storefront then, you would run `pnpm --filter @equinor/eds-storefront run start`, and if you want to install some devDependency, `pnpm --filter @equinor/eds-storefront i -D <some-module>`.
