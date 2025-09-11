# About

The EDS colour system is designed to make interfaces clear, consistent, and accessible for everyone. The system is built on **semantic colours** – names that describe their intended usage.  This way, designers and developers share the same language and can work smoothly together.
Each colour has a role, from text and borders to backgrounds and interactive states, so you don't have to guess which one to use. Behind the scenes, every pairing is tested with the APCA contrast algorithm to make sure readability and accessibility are built in — across both light and dark themes.
In short: a colour system that’s thought through, tested, and ready to support your work.

## Semantic Categories

Each colour belongs to a **semantic category** that reflects its purpose — whether it’s highlighting information, giving feedback, or building the base layers of an interface.

**Colours are grouped into the following categories:**

- **Accent** – brand and highlight colours
- **Neutral** – base and supporting colours
- **Info** – for communication and neutral messages
- **Success** – positive or confirming feedback
- **Warning** – cautionary states
- **Danger** – destructive or error states

Within each category, we have colours for:

- **Background (bg)**
- **Border**
- **Text**

## Backgrounds

Backgrounds form the foundation of an interface. They define layers, create depth, and ensure that text and components remain easy to read.

**Available background roles:**

- **Canvas**: the application background.
- **Surface**: placed on top of canvas to create **hierarchical depth** in layouts.

### Background Fill

For **interactive elements** (e.g. buttons):

- **Muted** – toned down, less prominent
- **Emphasis** – stronger, more prominent

Background fill provide a **default, hover, and active** state variant.

## Borders

Borders help separate content and add structure. They help organise content and guide focus without overwhelming the design.

**Available border roles:**

- **Subtle** – separators, dividers, light structure
- **Medium** – general borders and controls
- **Strong** – emphasis or interactive elements

## Text

Text colours ensure content is always readable and clear, no matter the background. They also create hierarchy, helping users distinguish what’s most important.

**Available text roles:**

- **Strong** – default text colour in the application
- **Subtle** – secondary text, hints, or less important content
- **Strong-on-emphasis** – for text placed on **emphasis backgrounds**
- **Subtle-on-emphasis** – for secondary text on **emphasis backgrounds**

## Concepts

In addition to categories like backgrounds, borders, and text, EDS includes a few **global tokens** used across many components and patterns.

**Some tokens are globally used across the system:**

- **bg-floating** – elements floating above surfaces (tooltips, menus)
- **bg-backdrop** – dimming layer behind modals or overlays
- **bg-input** – input fields and form backgrounds
- **border-focus** – focus ring for accessibility
- **text-link** – default link colour

## Features

The EDS colour system includes built-in features that make it easy to design and build accessible, consistent interfaces.
- **Accessible by design** – Contrast targets are based on the APCA algorithm, which models how human vision perceives text on different backgrounds. This ensures readability you can trust.
- **Light and dark themes** - Switching theme is as simple as applying a class to a container. Colours adapt automatically to keep contrast and clarity.
- **Purpose-built** - Every colour has a defined role in the interface, from surfaces and borders to states and overlays.
- **Reliable text contrast** – Text colours always meet their intended contrast target against the matching background.
