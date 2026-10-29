---
title: Components status
sidebar_label: Components status
sidebar_position: 2
hide_title: true
description: 'The maturity of each component across Latest and the Beta.'
---

{/* TODO: make this table automatic in future */}

How mature each component is, in **Latest** (`@equinor/eds-core-react` 2.x) and
in the **Beta** (the 3.0.0 beta under `@equinor/eds-core-react/next`). A
component often has a status in both at once: stable to use today in Latest,
while its redesigned version is still being built for the Beta. Each status
links to its Storybook page where one exists.

The table lists the components in the redesigned kit, so some stable Latest
components outside that kit, such as Datepicker, Table, Pagination, Slider and
TopBar, do not appear yet. Component names follow the EDS Core Components Figma
file rather than the package exports.

This table is maintained by hand from that Figma file while the automated status
pipeline is being set up.

- <StatusChip status="planned" /> on the roadmap, not started
- <StatusChip status="in-progress" /> being designed or built
- <StatusChip status="beta" /> shipped in the Beta, safe to adopt, API may still change before 3.0.0
- <StatusChip status="stable" /> shipped in Latest, API frozen
- <StatusChip status="deprecated" /> scheduled for removal

| Component    | Latest (2.x)                                                                                                             | Beta (3.0.0)                                                                                               | Documentation                                         |
| ------------ | ------------------------------------------------------------------------------------------------------------------------ | ---------------------------------------------------------------------------------------------------------- | ----------------------------------------------------- |
| Accordion    | [<StatusChip status="stable" />](https://storybook.eds.equinor.com/?path=/docs/surfaces-accordion--docs)                 | <StatusChip status="in-progress" />                                                                        | [Docs](../../components/surfaces/accordion.md)        |
| Autocomplete | [<StatusChip status="stable" />](https://storybook.eds.equinor.com/?path=/docs/inputs-autocomplete--docs)                | <StatusChip status="in-progress" />                                                                        | [Docs](../../components/inputs/autocomplete.md)       |
| Avatar       | [<StatusChip status="stable" />](https://storybook.eds.equinor.com/?path=/docs/data-display-avatar--docs)                | <StatusChip status="in-progress" />                                                                        |                                                       |
| Badge        | None                                                                                                                     | <StatusChip status="in-progress" />                                                                        |                                                       |
| Banner       | [<StatusChip status="stable" />](https://storybook.eds.equinor.com/?path=/docs/feedback-banner--docs)                    | <StatusChip status="in-progress" />                                                                        | [Docs](../../components/feedback/banner.md)           |
| Breadcrumb   | [<StatusChip status="stable" />](https://storybook.eds.equinor.com/?path=/docs/navigation-breadcrumbs--docs)             | <StatusChip status="planned" />                                                                            |                                                       |
| Button       | [<StatusChip status="stable" />](https://storybook.eds.equinor.com/?path=/docs/inputs-button-button--docs)               | [<StatusChip status="beta" />](https://storybook.eds.equinor.com/?path=/docs/beta-inputs-button--docs)     | [Docs](../../components/inputs/button.md)             |
| Cards        | [<StatusChip status="stable" />](https://storybook.eds.equinor.com/?path=/docs/surfaces-card--docs)                      | <StatusChip status="planned" />                                                                            |                                                       |
| Checkbox     | [<StatusChip status="stable" />](https://storybook.eds.equinor.com/?path=/docs/inputs-selection-controls-checkbox--docs) | <StatusChip status="in-progress" />                                                                        | [Docs](../../components/inputs/selection_controls.md) |
| Chip         | [<StatusChip status="stable" />](https://storybook.eds.equinor.com/?path=/docs/data-display-chips--docs)                 | [<StatusChip status="beta" />](https://storybook.eds.equinor.com/?path=/docs/beta-data-display-chip--docs) | [Docs](../../components/data-display/chip.md)         |
| ComboBox     | None                                                                                                                     | None                                                                                                       |                                                       |
| Dialog       | [<StatusChip status="stable" />](https://storybook.eds.equinor.com/?path=/docs/feedback-dialog--docs)                    | <StatusChip status="in-progress" />                                                                        |                                                       |
| Divider      | [<StatusChip status="stable" />](https://storybook.eds.equinor.com/?path=/docs/data-display-divider--docs)               | <StatusChip status="in-progress" />                                                                        | [Docs](../../components/surfaces/divider.md)          |
| Field        | None                                                                                                                     | <StatusChip status="in-progress" />                                                                        | [Docs](../../components/inputs/field.md)              |
| Icon         | [<StatusChip status="stable" />](https://storybook.eds.equinor.com/?path=/docs/icons-icon--docs)                         | [<StatusChip status="beta" />](https://storybook.eds.equinor.com/?path=/docs/beta-icon--docs)              | [Docs](../../components/data-display/icon.md)         |
| Input        | [<StatusChip status="stable" />](https://storybook.eds.equinor.com/?path=/docs/inputs-input--docs)                       | <StatusChip status="in-progress" />                                                                        | [Docs](../../components/inputs/input.md)              |
| Link         | None                                                                                                                     | <StatusChip status="in-progress" />                                                                        | [Docs](../../components/navigation/link.md)           |
| Menu         | [<StatusChip status="stable" />](https://storybook.eds.equinor.com/?path=/docs/navigation-menu--docs)                    | <StatusChip status="in-progress" />                                                                        |                                                       |
| Radio button | [<StatusChip status="stable" />](https://storybook.eds.equinor.com/?path=/docs/inputs-selection-controls-radio--docs)    | <StatusChip status="in-progress" />                                                                        | [Docs](../../components/inputs/selection_controls.md) |
| Search       | [<StatusChip status="stable" />](https://storybook.eds.equinor.com/?path=/docs/inputs-search--docs)                      | <StatusChip status="in-progress" />                                                                        | [Docs](../../components/inputs/search.md)             |
| Select       | <StatusChip status="stable" />                                                                                           | <StatusChip status="in-progress" />                                                                        |                                                       |
| Snackbar     | [<StatusChip status="stable" />](https://storybook.eds.equinor.com/?path=/docs/feedback-snackbar--docs)                  | <StatusChip status="planned" />                                                                            |                                                       |
| Switch       | [<StatusChip status="stable" />](https://storybook.eds.equinor.com/?path=/docs/inputs-selection-controls-switch--docs)   | <StatusChip status="in-progress" />                                                                        | [Docs](../../components/inputs/selection_controls.md) |
| Tab          | [<StatusChip status="stable" />](https://storybook.eds.equinor.com/?path=/docs/navigation-tabs--docs)                    | <StatusChip status="planned" />                                                                            |                                                       |
| Text Area    | [<StatusChip status="stable" />](https://storybook.eds.equinor.com/?path=/docs/inputs-textarea--docs)                    | <StatusChip status="in-progress" />                                                                        | [Docs](../../components/inputs/textarea.md)           |
| Text Field   | [<StatusChip status="stable" />](https://storybook.eds.equinor.com/?path=/docs/inputs-textfield--docs)                   | <StatusChip status="in-progress" />                                                                        | [Docs](../../components/inputs/textfield.md)          |
| Tooltip      | [<StatusChip status="stable" />](https://storybook.eds.equinor.com/?path=/docs/data-display-tooltip--docs)               | <StatusChip status="in-progress" />                                                                        | [Docs](../../components/data-display/tooltip.md)      |
