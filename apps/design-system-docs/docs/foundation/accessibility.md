---
title: Accessibility
hide_title: true
description: 'All digital interfaces should be inclusive and accessible for everyone, regardless of impairments or abilities. Improving accessibility is not only the responsible thing to do, it also enhances the usability for all users. Please use this section as a guide to help ensure your experiences meet or exceed the standards for accessibility.'
---

The UI components for all Equinor's internal digital interfaces are built to meet the [WCAG 2.1][WCAG] and [Uutilsynet](https://www.uutilsynet.no/) AA level requirements. The components are accessible on their own, but how you lay them out, combine them and write their content decides whether the finished interface is. This page covers what to keep in mind when you do that.

## What is accessibility?

Accessibility ensures that users of different abilities can understand, navigate, interact with and contribute to the digital interface in a meaningful way. This means:

- Keyboard interaction alternatives for all mouse-based actions are provided
- All button and input fields are properly identified
- Images, SVGs and videos have text-based alternatives
- All components are built to convey their identity, operation model and state to assistive technologies

## What are different abilities

There are many different types of abilities that need consideration:

- Age
- Blindness
- Low vision
- Colour-blindness
- Hearing disabilities
- Physical disabilities
- Cognitive disabilities
- Situational disabilities (such as a broken arm)

There are also different types of situations that need consideration:

- Physical location
- Limited screen size
- Lighting issues

## Guidelines

### Target size

Small or tightly packed targets are easy to miss, especially on a touch screen. WCAG 2.1 has no target size requirement at level AA, but WCAG 2.2 adds one, [2.5.8 Target Size (Minimum)](https://www.w3.org/WAI/WCAG22/Understanding/target-size-minimum.html): a target should be at least 24 by 24 CSS pixels, or have enough space around it that a 24px circle centred on it does not overlap another target. For touch, aim for 44 by 44, which is the WCAG AAA level (2.5.5).

EDS controls are smaller at Compact density than at Comfortable or Relaxed, so check target sizes at the density you ship. Relaxed density is intended for touch and mobile, where targets need to be larger.

### Consistent headings

Strive to make your menus and hierarchies consistent. Use H1, H2, H3, etc., in the correct order. This helps all users navigate and browse the page efficiently.

### Form validating inline

When validation fails, say what went wrong in the field's helper message, next to the field itself. Keep the message short and to the point, and tell the user how to fix the problem.

### Text and its meaning

Remember that text can be both visible and invisible `alt text`. Make sure all text is meaningful in its context.

### Calls to action

Provide descriptive labels. Action verbs work well.

:::tip Here is an example
Acceptable: **See all platforms** _Indicates what will happen_  
Not acceptable: **All platforms** _Does not indicate what will happen_
:::

If a button's text says "See all platforms", make sure you send the user to a page with all platforms. Be consistent with how you use verbs and which terms you use.

### Images

Important information should not be in or over images. Make sure to always caption your image.

### Colour

Use the EDS colour tokens. Their contrast is measured with APCA, with targets of Lc 90 for body text and Lc 60 for interactive elements against `background.surface`. A token name alone does not guarantee contrast: on any other fill, check the foreground and background you use, in both colour schemes and every state. [Contrast](./colour/intro.mdx#contrast) explains the method and the targets.

Many users have trouble distinguishing colours from each other, so make sure colour is not the only way you convey certain information. For example, danger should not be indicated by red colour alone.

#### Exceptions

If you need additional colours for domain-specific requirements, test them for contrast the same way. Charts and graphs have their own [data visualisation palettes](./colour/palette.mdx#data-visualisation). Those are tuned for telling series apart, not for text contrast, so do not use them for text or for the only cue that carries meaning.

### Navigation order

Place components on the page in order of importance. The order in which the element receives focus should be logical and predictable. Try to keep navigation to a minimum of steps and make all steps clear.

Try navigating your own solution by only using a keyboard. Can you navigate? Can you perform all the important tasks? Can you tell where the keyboard focus is? Do your items follow the order you think? Generally, focus travels up to down, left to right. Test it out by using your `tab` key.

### Validating your work

The EDS is only a foundation for accessible design and development. The components handle their own semantics, keyboard support and states. The layout, the content, the focus order across components and any colours outside the tokens are the responsibility of the team building the interface, designers and developers alike.

Please familiarise yourself with the guidelines from [WCAG 2.1][WCAG] and [Uutilsynet](https://www.uutilsynet.no/) to verify your interfaces meet the AA level requirements.

#### Tools and resources

Here are some resources to help validate your work:

<IconCardGrid columns={3}>

<IconCard
to="https://webaim.org/"
title="WebAIM"
description="Web accessibility evaluation tools and resources"
badge={{ label: 'External' }}
icon={<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M19 19H5V5h7V3H5c-1.11 0-2 .9-2 2v14c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2v-7h-2v7zM14 3v2h3.59l-9.83 9.83 1.41 1.41L19 6.41V10h2V3h-7z" /></svg>}
/>

<IconCard
to="https://apcacontrast.com/"
title="APCA Contrast Calculator"
description="Check the Lc contrast of a text and background pair"
badge={{ label: 'External' }}
icon={<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M19 19H5V5h7V3H5c-1.11 0-2 .9-2 2v14c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2v-7h-2v7zM14 3v2h3.59l-9.83 9.83 1.41 1.41L19 6.41V10h2V3h-7z" /></svg>}
/>

<IconCard
to="https://a11yproject.com/"
title="The A11Y Project"
description="Community-driven accessibility knowledge base"
badge={{ label: 'External' }}
icon={<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M19 19H5V5h7V3H5c-1.11 0-2 .9-2 2v14c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2v-7h-2v7zM14 3v2h3.59l-9.83 9.83 1.41 1.41L19 6.41V10h2V3h-7z" /></svg>}
/>

</IconCardGrid>

[WCAG]: https://www.w3.org/TR/WCAG21/ 'WCAG 2.1'
