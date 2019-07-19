---
title: Equinor CDN
layout: default
---

# Equinor brand assets

> TL;DR Hosting brand assets such as the fonts and the logo in a CDN would improve download speed for the end user, give COMM greater control over which versions of the assets are in use in production, and simplify usage of brand assets for developers.

The purpose of a CDN (Content Delivery Network) is to serve static files such as graphic elements, fonts, videos etc. for use in web applications and websites. The files are usually globally distributed – meaning that there is a network of servers which hold copies of the files – and serve the ones that are closest to the end user. This improves page load for the end user, and also takes the load of the servers that host the web application itself.

Add text about:
- Security
- Caching
- Version control

> Note: Viewing the source-code will show that we use a temporary url for the CDN – but it will be https://eds-static.equinor.com once everything is in place.

## Usage

### The Equinor font

When it comes to the font, we have included only two of the formats currently provided in the font package – woff and woff2 – because these cover all modern browsers (see [caniuse.com](https://caniuse.com/#search=woff) for browser support). These formats are essensially compressed Open Type fonts, meaning that special characters such as tabular numbers for tables etc. can be activated using CSS. Because it’s important to keep file sizes as low as possible on the web we have provided both the option to import all the eight font-files, and the option to only import one or more fonts– as demonstrated in the following example:


<div style="font-family: Equinor; font-size: 1.125em">
  <p>The quick brown fox <strong>jumps</strong> over the <em>lazy</em> dog<br />
  Høvdingens kjære squaw får litt pizza i Mexico by</p>
</div>

#### HTML

```html
<!-- All the fonts -->
<link
  rel="stylesheet"
  href="https://eds-static.equinor.com/font/equinor-font.css"
/>

<!-- Only regular… -->
<link
  rel="stylesheet"
  href="https://eds-static.equinor.com/font/equinor-regular.css"
/>

<!-- …or italic -->
<link
  rel="stylesheet"
  href="https://eds-static.equinor.com/font/equinor-italic.css"
/>
```

#### CSS

```css
body {
  font-family: Equinor;
}
```

---

### The Equinor logo

When it comes to the logo we have made some changes to the original format. Instead of having one file for each colour, we have written css in the svg-file itself that enables us to switch between the colours by appended the colour name to the end of the file name. The advantage of this approach is that we only need two files for the logo, one for primary and one for horizontal, instead of six files. Also to keep the file size down and make it easier to align the logo to other elements, excess margins have been removed from the svg-files and added with css instead. Here are examples of using both variations of the logo in all three colours:


#### Primary

<img src="https://edsstoragedev.blob.core.windows.net/eds-blob-cdn/logo/equinor-logo-primary.svg#red" style="width: 200px; margin: 38px; margin-left: 0;" />

<div style="background-color: #ff1243; display: inline-block">
  <img src="https://edsstoragedev.blob.core.windows.net/eds-blob-cdn/logo/equinor-logo-primary.svg#white" style="width: 200px; margin: 38px; background-color: transparent" />
</div>

<img src="https://edsstoragedev.blob.core.windows.net/eds-blob-cdn/logo/equinor-logo-primary.svg" style="width: 200px; margin: 38px;" />

```html
<!-- The primary logo in red -->
<img
  src="https://eds-static.equinor.com/logo/equinor-logo-primary.svg#red"
  style="width: 200px; margin: 38px;"
/>

<!-- The primary logo in white -->
<img
  src="https://eds-static.equinor.com/logo/equinor-logo-primary.svg#white"
  style="width: 200px; margin: 38px;"
/>

<!-- The primary logo in black (default) -->
<img
  src="https://eds-static.equinor.com/logo/equinor-logo-primary.svg"
  style="width: 200px; margin: 38px"
/>
```

#### Horizontal

<img src="https://edsstoragedev.blob.core.windows.net/eds-blob-cdn/logo/equinor-logo-horizontal.svg#red" style="width: 256px; margin: 33px; margin-left: 0;" />

<div style="background-color: #ff1243; display: inline-block">
  <img src="https://edsstoragedev.blob.core.windows.net/eds-blob-cdn/logo/equinor-logo-horizontal.svg#white" style="width: 256px; margin: 33px; background-color: transparent" />
</div>

<img src="https://edsstoragedev.blob.core.windows.net/eds-blob-cdn/logo/equinor-logo-horizontal.svg" style="width: 256px; margin: 33px;" />

```html
<!-- The horizontal logo in red -->
<img
  src="https://eds-static.equinor.com/logo/equinor-logo-horizontal.svg#red"
  style="width: 256px; margin: 33px;"
/>

<!-- The horizontal logo in white -->
<img
  src="https://eds-static.equinor.com/logo/equinor-logo-horizontal.svg#white"
  style="width: 256px; margin: 33px;"
/>

<!-- The horizontal logo in black (default) -->
<img
  src="https://eds-static.equinor.com/logo/equinor-logo-horizontal.svg"
  style="width: 256px; margin: 33px"
/>
```

---

We hope you approve of our suggestion to provide these assets from a CDN, and that you can help us promote the CDN and the internal NPM in the Communication Toolbox.

Best regards,  
[Victor Nystad](mailto:vnys@equinor.com),  
The EDS Core Team

---

## Resources:

- <https://towardsdatascience.com/cnd-content-delivery-networks-b4e6998216cc>
