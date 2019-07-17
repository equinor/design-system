---
title: Equinor CDN
layout: default
---

# Equinor CDN

This is some text about the Equinor CDN

> Note: Viewing the source-code will show that we use a temporary url for the CDN – but it will be https://eds-static.equinor.com once everything is in place.

## The Equinor font

<div style="font-family: Equinor; font-size: 1.125em">
  <p>The quick brown fox <strong>jumps</strong> over the <em>lazy</em> dog<br />
  Høvdingens kjære squaw får litt pizza i Mexico by</p>
</div>

### HTML

```html
<!-- All the fonts -->
<link rel="stylesheet" href="https://eds-static.equinor.com/font/equinor-font.css" />

<!-- Only the regular font -->
<link rel="stylesheet" href="https://eds-static.equinor.com/font/equinor-regular.css" />
```

### CSS

```css
body {
  font-family: Equinor;
}
```

## The Equinor logo

### Primary horisontal

<img src="https://eds-static.equinor.com/logo/equinor-logo-primary.svg#red" style="width: 200px; margin: 38px; margin-left: 0;" />

<div style="background-color: #ff1243; display: inline-block">
  <img src="https://eds-static.equinor.com/logo/equinor-logo-primary.svg#white" style="width: 200px; margin: 38px; background-color: transparent" />
</div>

<img src="https://eds-static.equinor.com/logo/equinor-logo-primary.svg" style="width: 200px; margin: 38px;" />

```html
<!-- The primary logo in red -->
<img src="https://eds-static.equinor.com/logo/equinor-logo-primary.svg#red" style="width: 200px; margin: 38px;" />

<!-- The primary logo in white -->
<img src="https://eds-static.equinor.com/logo/equinor-logo-primary.svg#white" style="width: 200px; margin: 38px;" />

<!-- The primary logo in black (default) -->
<img src="https://eds-static.equinor.com/logo/equinor-logo-primary.svg" style="width: 200px; margin: 38px" />
```

### Primary vertical

<img src="https://eds-static.equinor.com/logo/equinor-logo-horizontal.svg#red" style="width: 256px; margin: 33px; margin-left: 0;" />

<div style="background-color: #ff1243; display: inline-block">
  <img src="https://eds-static.equinor.com/logo/equinor-logo-horizontal.svg#white" style="width: 256px; margin: 33px; background-color: transparent" />
</div>

<img src="https://eds-static.equinor.com/logo/equinor-logo-horizontal.svg" style="width: 256px; margin: 33px;" />


```html
<!-- The horizontal logo in red -->
<img src="https://eds-static.equinor.com/logo/equinor-logo-horizontal.svg#red" style="width: 256px; margin: 33px;" />

<!-- The horizontal logo in white -->
<img src="https://eds-static.equinor.com/logo/equinor-logo-horizontal.svg#white" style="width: 256px; margin: 33px;" />

<!-- The horizontal logo in black (default) -->
<img src="https://eds-static.equinor.com/logo/equinor-logo-horizontal.svg" style="width: 256px; margin: 33px" />
```
