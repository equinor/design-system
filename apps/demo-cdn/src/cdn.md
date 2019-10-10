---
title: Equinor CDN
layout: default
---

<header>
<img src="https://edsstoragedev.blob.core.windows.net/eds-blob-cdn/logo/equinor-logo-horizontal.svg#red" />
<h1>Equinor brand assets from a <abbr title="content delivery network">CDN</abbr></h1>
</header>

> TL;DR Hosting brand assets such as the fonts and the logo in a CDN would give COMM greater control over which versions of the assets are in use in production, improve download speed for the end user, and simplify usage of brand assets for developers.

The purpose of a CDN (Content Delivery Network) is to serve static files such as graphic elements, fonts, videos etc. for use in web applications and websites from a globally distributed network of servers. The users are then served copies of the files from the server closest to where they are in the world, which significantly improves page loads, and also takes the load of the servers that run the web application itself.

The resources we would like to provide from a CDN is:

- Colours
- Fonts
- Icons
- Logo

These resources could then be imported into [Codepen](https://codepen.io) if a developer wants to quickly create an html prototype using the Equinor logo and fonts, or in [Axure](https://www.axure.com) if a UX designer wants to sketch something out with the correct colour palette – and in any other web page or web application that need to use brand assets.

## Usage

We have provided some examples of how fonts and logos would be used from a CDN. For the sake of demonstration these files are served from a CDN in Azure with a temporary url but we have used the url <https://eds-static.equinor.com> in the example texts since that’s what we would like the official CDN url to be.

### The Equinor font

When it comes to the font, we have included only two of the formats currently provided in the font package – woff and woff2 – because these cover all modern browsers (see [caniuse.com](https://caniuse.com/#search=woff) for browser support). These formats are essensially compressed Open Type fonts, meaning that special characters such as tabular numbers for tables etc. can be activated using CSS. Because it’s important to keep file sizes as low as possible on the web we have provided both the option to import all the eight font-files, and the option to only import one or more fonts– as demonstrated in the following example:


<div style="font-family: Equinor; margin-top: 3rem; margin-bottom: 3rem;">
  <p style="font-size: 1.5em">The quick brown fox <strong>jumps</strong> over the <em>lazy</em> dog<br />
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

When it comes to the logo we have made some changes to the original format. Instead of having one file for each colour, we have written css in the svg-file itself that enables us to switch between the colours by appended the colour name to the end of the file name. The advantage of this approach is that we only need two files for the logo, one for primary and one for horizontal, instead of six files. Also to keep the file size down and make it easier to align the logo to other elements, excess margins have been removed from the svg-files and added with css instead. Note that the colour keyword in the url corresponds to the exact colour as specified in the internal css inside the svg. Here are examples of using both variations of the logo in all three available colours:


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

We hope you by this see the benefits of having an Equinor CDN, and that we have your approval to move forward with providing a CDN for brand assets as part of the Equinor Design System.

Best regards,  
[Victor Nystad](mailto:vnys@equinor.com),  
On behalf of the EDS core team

<!--

## Resources:

- <https://towardsdatascience.com/cnd-content-delivery-networks-b4e6998216cc> -->
