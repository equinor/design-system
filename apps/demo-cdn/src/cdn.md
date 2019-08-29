---
title: Equinor CDN
layout: default
---

# Equinor brand assets from a <abbr title="content delivery network">CDN</abbr>

> TL;DR Hosting brand assets such as the fonts and the logo in a CDN would give COMM greater control over which versions of the assets are in use in production, improve download speed for the end user, and simplify usage of brand assets for developers.

The purpose of a CDN (Content Delivery Network) is to serve static files such as graphic elements, fonts, videos etc. for use in web applications and websites from a globally distributed network of servers. The users are then served copies of the files from the server closest to where they are in the world, which significantly improves page loads, and also takes the load of the servers that run the web application itself.

Looking at other design systems, Scania for example provides both fonts and logos from a CDN. On one hand that does mean that anyone can use the Scania font on their web page if they wanted to by including the link to the css-file in the header in the html-document as documented in [their styleguide](https://scania.github.io/corporate-ui-docs/styleguide/typography/). But on the other hand, when it’s on the web anyone with sufficient level of skills can view the source of the CSS-file and manage to download the assets – that goes for equinor.com as well.

<div style="font-family: 'Scania Sans'; font-weight: bold">
  <p>«This is Scania Sans»</p>
</div>

To comply with WCAG guidelines, the digital version of the Energy Red brand colour had to be updated. This is a good example of where a CDN would have helped us make sure that change rippled through every application and website in Equinor that used that colour because we would have one single source of truth. The same goes for the logo, using Scania as an example again they provide a css-file one can include in the html-document with the logo in different formats. This file also contains the following comment, aimed at developers, which explains the rationale behind using a css-file for the logos (emphasis mine):
> «The Scania symbol and wordmark should be used in accordance to the guidelines specified in the Brand Manual. <strong>We do not want our logotype to be downloaded to local servers as updates to the logotype is made to these centraly stored versions</strong>.»

<div class="scania logotype-vertical-lockup"></div>

As you can see from this example Scanias CDN is open for everyone. We must add that it _is_ possible to restrict usage to certain URL through a method called CORS – so that for example only applications that are from whitelisted domains such as equinor.com are allowed to use them if that is a requirement from COMM.

We know that equinor.com is currently using Amazon Cloudfront, one of many CDN providers. In EDS however, since we already use Microsoft Azure in our infrastructure, using Azure CDN would be a better option. The url for the CDN would then be https://eds-static.equinor.com if this is something we want to go forward with.

Developers always find a way to make life easier for them, and we’ve seen more than one example of projects in the company that upload the Equinor fonts to Github because that’s convinient. We _do_ have an internal <abbr title="Node Package Manager">NPM</abbr> repository where the fonts and logos can be installed for authorized developers but the processs is very cumbersome and not in widespread use. And sometimes installed NPM modules is not an option if the usage is web based tools that are hosted by third parties. Perhaps a developer want to sketch something out in Codepen for example, and need to see how something looks with the correct font.

## Usage

We have provided some examples of how fonts and logos would be used from a CDN. For the sake of demonstration these files are served from a CDN in Azure with a temporary url but we have used eds-static in the example texts for clarity.

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

We hope you by this see the benefits of having an Equinor CDN, and that we have your approval to move forward with cost analysis and risk assessment.

Best regards,  
[Victor Nystad](mailto:vnys@equinor.com),  
On behalf of the EDS core team

<!--

## Resources:

- <https://towardsdatascience.com/cnd-content-delivery-networks-b4e6998216cc> -->
