# About

The EDS colour system enables designers to create clear, consistent, and accessible interfaces. Colours are named for their role or purpose in the interface, following a **semantic** naming convention.

This approach helps designers and developers speak the same language. Every colour has a specific role, so you know exactly when to use it. We take an accessibility-first approach by using the APCA contrast algorithm to evaluate all colour combinations. APCA models human visual perception more accurately than traditional methods, helping us ensure that text and interface elements remain readable and accessible in both light and dark colour schemes.

## Colour scheme

The colour system supports both light and dark colour schemes, helping you create clear hierarchy and accessible interfaces in any mode. Instead of a traditional linear scale, each colour step in EDS is chosen for a specific purpose. Transitions between colours are intentional, offering clear separation and strong contrast rather than a smooth gradient. This purposeful approach makes it easier for everyone to design and use interfaces that are clear, usable, and accessible.

| Light                                         | Dark                                        |
| --------------------------------------------- | ------------------------------------------- |
| ![Light theme colour palette](/img/light.png) | ![Dark theme colour palette](/img/dark.png) |

**Note:** We generate all colours using our [colour palette generator](https://color-palette-generator-eds-prod.radix.equinor.com/). This tool ensures consistency and helps maintain accessibility standards.

## Semantic Categories

Each colour belongs to a category that reflects its purpose in the interface.

- **Accent** – brand and highlight colours
- **Neutral** – base and supporting colours
- **Info** – communication and neutral messages
- **Success** – positive or confirming feedback
- **Warning** – cautionary states
- **Danger** – destructive or error states

Each category includes colours for:

- **Background (bg)**
- **Border**
- **Text**

## Background

Background colours create the foundation of your interface. They define layers and ensure text remains readable.

**Roles:**

- **Canvas** – main application background
- **Surface** – placed on canvas to create depth in layouts

### Background Fill

For interactive elements like buttons:

- **Muted** – subtle, less prominent
- **Emphasis** – bold, more prominent

Background fills include default, hover, and active state variants.

## Borders

Borders separate content and add structure. They organise information and guide focus.

**Roles:**

- **Subtle** – light separators and dividers
- **Medium** – standard borders and controls
- **Strong** – emphasis or interactive elements

## Text

Text colours ensure content is readable and create clear hierarchy.

**Roles:**

- **Strong** – primary text in your application
- **Subtle** – secondary text and less important content
- **Strong-on-emphasis** – text on emphasis backgrounds
- **Subtle-on-emphasis** – secondary text on emphasis backgrounds

## Concepts

In addition to the semantic categories, EDS includes a few **design decisions** used across components and patterns.

- **bg-floating** – floating elements like tooltips and menus
- **bg-backdrop** – overlay layer behind modals
- **bg-input** – input fields and forms
- **border-focus** – focus rings for accessibility
- **text-link** – default link colour

## Features

The colour system includes built-in features for accessible, consistent interfaces:

- **Accessible by design** – Uses APCA contrast algorithm to model human vision and ensure reliable readability
- **Light and dark themes** – Switch themes by applying a `data-colour-scheme=["light" | "dark"]` attribute.
- **Purpose-built** – Every colour has a defined role in the interface
- **Reliable contrast** – Text colours always meet contrast targets against matching backgrounds
