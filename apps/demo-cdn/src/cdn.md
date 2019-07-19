---
title: Equinor CDN
layout: default
---

# Equinor brand assets

In order to make websites and applications in Equinor that follow the brand guidelines, we need to be able to use brand assets such as the font, the logo and the colour palette – and preferable in a way that makes it easy to update these assets if needed and have that update ripple through all the places they are used.

In frontend development there are two main ways of sharing such assets: Through NPM (Node package manager) and a CDN (Content delivery network). When it comes to NPM, we can publish packages either publically – which is then available to everyone who knows how to use NPM – and privately in a way that requires some sort of authentication. In Equinor we now have an internal NPM repository, where only developers in Equinor have access and can install the Equinor typeface and the logos in their applications as NPM modules.

But in addition to NPM, we believe we could benefit from making these assets available through a CDN as well. A CDN (Content Delivery Network) is a …

We usually prefer to publish public packages if we can, because the authentiation prosedure can be a bit cumbersome – but in some cases we have to keep packages within the company walls because of legal issues – for example if the package in question contains business secrets or something else that the company does not want to share with the world. The Equinor font, for example, could be published privately and require developers to authenticate to be able to use it in their applications and websites – but the nature of the web is open – so once the application or website is deployed publically, a user can still read the source-code and download the fonts manually. So it can also be published publically, but with a license that prevents somebody legally from using it. That would not prevent somebody from using it, just like we can’t prevent someone from downloading the font from https://equinor.com in their browser – but it would make it easier for our developers to use the font.

However, because we know that you’re hesitant to permit publishing these assets to the public NPM, we’ve created an internal NPM repository in the mean time.

We have published such modules for the font and the logo in a private internal NPM, but not all applications are using NPM – and so we would like to also provide these assets for Power BI applications, Axure (prototyping tool) etc. – and for that we need a CDN.

The way Scania does this for example, is to have one css-file which enables the use of the font, and another one for the logo. The one with the logo contains the following disclaimer:
«The Scania symbol and wordmark should be used in accordance to the guidelines specified in the Brand Manual. We do not want our logotype to be downloaded to local servers as updates to the logotype is made to these
centraly stored versions.»

So the advantages of a CDN is that the resources are stored centrally, meaning that if we have to make an adjustment to the fonts, the logo, or one of the colours in the colour palette – we would do that once, and it would be updated in all the systems that

See https://scania.github.io/corporate-ui-docs/styleguide/logotypes/ and https://scania.github.io/corporate-ui-docs/styleguide/typography/ for more information about this.

So by giving developers access to the brand assets through the CDN, it is possible to create sites and applications that use these without authentication – just like it’s possible to read the source code on our company website and download our brand assets manually from there.

> Note: Viewing the source-code will show that we use a temporary url for the CDN – but it will be https://eds-static.equinor.com once everything is in place.

## Usage

### The Equinor font

When it comes to the font, we have included only two of the formats – woff and woff2 – because these cover all modern browsers (see [caniuse.com](https://caniuse.com/#search=woff) for browser support). These formats are essensially compressed Open Type fonts, meaning that special characters such as tabular numbers for tables etc. can be activated using CSS. Because it’s important to keep file sizes as low as possible on the web we have provided both the option to import all the eight font-files, and the option to only import one or more fonts– as demonstrated in the following example:


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

When it comes to the logo we have made some changes to the original format. Instead of having one file for each colour, we have used an svg-feature called fragment-identifier which enables us to switch between predetermined colours by appending #the-color to the end of the url (see examples). Also to keep the file size down and make it easier to work with, excess margins removed are removed from the svg-files and added with css instead. Here are examples of using both variations of the logo in all three colours:


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
