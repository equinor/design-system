# About

The EDS colour system creates clear, consistent, and accessible interfaces. It uses **semantic colours** — names that describe what each colour does rather than how it looks.

This approach helps designers and developers speak the same language. Every colour has a specific role, so you know exactly when to use it. We test all colour combinations with the APCA contrast algorithm to ensure they're readable and accessible in light and dark colour scheme.

## Colour scheme

The colour system supports light and dark colour scheme, ensuring consistent visual hierarchy and accessibility across all interface modes.

| Light                                         | Dark                                        |
| --------------------------------------------- | ------------------------------------------- |
| ![Light theme colour palette](/img/light.png) | ![Dark theme colour palette](/img/dark.png) |

**Note:** We generate all colours using our [colour palette generator](https://color-palette-generator-eds-prod.radix.equinor.com/). This tool ensures consistency across the design system and helps maintain our accessibility standards.

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

- **Canvas** – the main application background
- **Surface** – placed on canvas to create depth in layouts

### Background Fill

For interactive elements like buttons:

- **Muted** – subtle, less prominent
- **Emphasis** – bold, more prominent

Background fills include default, hover, and active state variants.

## Borders

Borders separate content and add structure. They organise information and guide focus without overwhelming the design.

**Roles:**

- **Subtle** – light separators and dividers
- **Medium** – standard borders and controls
- **Strong** – emphasis or interactive elements

## Text

Text colours ensure content is readable and creates clear hierarchy.

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
