import type { SidebarsConfig } from '@docusaurus/plugin-content-docs'

// This runs in Node.js - Don't use client-side code here (browser APIs, JSX...)
//Create as many sidebars as you want.
const sidebars: SidebarsConfig = {
  // By default, Docusaurus generates a sidebar from the docs folder structure

  //About Section
  aboutSidebar: [
    'about/about_eds',
    {
      type: 'category',
      label: 'Basics',
      link: {
        type: 'doc',
        id: 'about/getting-started/getting_started',
      },
      items: [
        'about/getting-started/getting_started',
        {
          type: 'category',
          label: 'Design',
          link: {
            type: 'doc',
            id: 'about/getting-started/design/getting_started_design',
          },
          items: [
            'about/getting-started/design/getting_started_design',
            'about/getting-started/design/figma',
          ],
        },
        {
          type: 'category',
          label: 'Develop',
          link: {
            type: 'doc',
            id: 'about/getting-started/develop/getting_started_development',
          },
          items: [
            'about/getting-started/develop/getting_started_development',
            'about/getting-started/develop/citizen_developers',
          ],
        },

        'about/getting-started/team_roles',
      ],
    },
    'about/team/team',
  ],
  //Components Section
  componentsSidebar: [
    'components/components',
    {
      type: 'category',
      label: 'Data Display',
      link: {
        type: 'doc',
        id: 'components/data-display/chip',
      },
      items: [
        'components/data-display/chip',
        'components/data-display/divider',
        'components/data-display/list',
        'components/data-display/popover',
        'components/data-display/table_data_grid',
        'components/data-display/table',
        'components/data-display/tooltip',
      ],
    },
    {
      type: 'category',
      label: 'Feedback',
      link: {
        type: 'doc',
        id: 'components/feedback/banner',
      },
      items: [
        'components/feedback/banner',
        'components/feedback/dialog',
        'components/feedback/progress_indicators',
        'components/feedback/scrim',
        'components/feedback/snackbar',
      ],
    },
    {
      type: 'category',
      label: 'Inputs',
      link: {
        type: 'doc',
        id: 'components/inputs/autocomplete',
      },
      items: [
        'components/inputs/autocomplete',
        'components/inputs/button',
        'components/inputs/date_time_picker',
        'components/inputs/search',
        'components/inputs/selection_controls',
        'components/inputs/slider',
        'components/inputs/textfield',
        'components/inputs/toggle_button',
      ],
    },
    {
      type: 'category',
      label: 'Navigation',
      link: {
        type: 'doc',
        id: 'components/navigation/app_launcher',
      },
      items: [
        'components/navigation/app_launcher',
        'components/navigation/breadcrumbs',
        'components/navigation/drawer',
        'components/navigation/link',
        'components/navigation/menu',
        'components/navigation/pagination',
        'components/navigation/sidebar',
        'components/navigation/stepper',
        'components/navigation/table_of_contents',
        'components/navigation/tabs',
        'components/navigation/topbar',
      ],
    },
    {
      type: 'category',
      label: 'Surfaces',
      link: {
        type: 'doc',
        id: 'components/surfaces/accordion',
      },
      items: [
        'components/surfaces/accordion',
        'components/surfaces/card',
        'components/surfaces/side_sheet',
        'components/surfaces/toolbar',
      ],
    },
  ],
  //Foundation Section
  foundationSidebar: [
    'foundation/accessibility',
    {
      type: 'category',
      label: 'Colour',
      link: {
        type: 'doc',
        id: 'foundation/colour/intro',
      },
      items: ['foundation/colour/intro', 'foundation/colour/getting_started'],
    },
    {
      type: 'category',
      label: 'Design Tokens',
      link: {
        type: 'doc',
        id: 'foundation/design-tokens/grid',
      },
      items: [
        'foundation/design-tokens/grid',
        'foundation/design-tokens/elevation',
        'foundation/design-tokens/shape',
        'foundation/design-tokens/spacing',
        'foundation/design-tokens/typography',
      ],
    },
    'foundation/datavisualisation',
    'foundation/patterns',
    {
      type: 'category',
      label: 'Assets',
      link: {
        type: 'doc',
        id: 'foundation/assets/image_placeholder',
      },
      items: [
        'foundation/assets/image_placeholder',
        'foundation/assets/logos',
        'foundation/assets/illustration',
        'foundation/assets/product_icons',
        'foundation/assets/system_icons',
        'foundation/assets/photography',
      ],
    },
  ],
  //Resources Section
  resourcesSidebar: [{ type: 'autogenerated', dirName: 'resources' }],
  //Support Section
  supportSidebar: [{ type: 'autogenerated', dirName: 'support' }],
}

export default sidebars
