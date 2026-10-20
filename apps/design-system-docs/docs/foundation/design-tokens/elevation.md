---
title: Elevation
hide_title: true
description: 'Elevation is a visual effect using shadows to make an element appear to float above the surface. It is reserved for UI that floats: elements that appear temporarily above the main content.'
---

## Levels

There are two elevation levels:

| Level    | Token                  | Use case                                                 |
| -------- | ---------------------- | -------------------------------------------------------- |
| **Low**  | `--eds-elevation-low`  | Tooltips, menus, popovers, autocomplete lists, snackbars |
| **High** | `--eds-elevation-high` | Dialogs, modals, drawers                                 |

Each level combines two shadow layers: a **key shadow**, which is directional and sharper, and an **ambient shadow**, which is diffuse and softer. Together they give a natural, grounded appearance.

<div style={{display: 'flex', gap: '2rem', padding: '2rem 0'}}>
  <div style={{flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem'}}>
    <div style={{width: '100%', maxWidth: 280, height: 120, borderRadius: 'var(--eds-corner-radius-rounded)', background: 'var(--eds-background-surface)', boxShadow: 'var(--eds-elevation-low)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 'var(--eds-typography-ui-md-font-size)', color: 'var(--eds-text-secondary)'}}>
      Low elevation
    </div>
    <code>--eds-elevation-low</code>
  </div>
  <div style={{flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem'}}>
    <div style={{width: '100%', maxWidth: 280, height: 120, borderRadius: 'var(--eds-corner-radius-rounded)', background: 'var(--eds-background-surface)', boxShadow: 'var(--eds-elevation-high)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 'var(--eds-typography-ui-md-font-size)', color: 'var(--eds-text-secondary)'}}>
      High elevation
    </div>
    <code>--eds-elevation-high</code>
  </div>
</div>

### Low elevation

```css
box-shadow: var(--eds-elevation-low);
/* 0px 1px 8px 0px rgba(0,0,0,0.2), 0px 4px 8px 3px rgba(0,0,0,0.12) */
```

### High elevation

```css
box-shadow: var(--eds-elevation-high);
/* 0px 4px 12px 0px rgba(0,0,0,0.2), 0px 12px 16px 6px rgba(0,0,0,0.12) */
```

## Implementation in Figma

Elevation effect styles are in the **EDS Foundation** library, together with the other EDS foundations.

### How to add

1. Locate the _layer_ in the **Layers Panel** that needs elevation applied.
2. Locate the **Design** tab in the **Inspector Panel**.
3. Under the **Effects** section, open the **Style library** menu to view the elevation styles.
4. Choose **Shadow/Low** or **Shadow/High** depending on the use case.

## Do's and Don'ts

:::info **Do**

- Use elevation for UI that floats above the page (tooltips, menus, popovers, dialogs)
- Use `--eds-elevation-low` for small overlays near their trigger (menus, tooltips, snackbars)
- Use `--eds-elevation-high` for large overlays that take focus (dialogs, modals, drawers)
- Use borders to differentiate surfaces sitting on the canvas (cards, banners, nav bars)
  :::

:::danger **Don't**

- Add shadows to cards, banners, or navigation bars. Use borders instead
- Use elevation on elements that are part of the normal document flow
- Mix elevation levels within the same layer of UI
- Use custom shadow values. Always use the elevation tokens
  :::
