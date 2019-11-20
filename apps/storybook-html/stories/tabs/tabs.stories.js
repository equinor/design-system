import { withKnobs, text, radios } from '@storybook/addon-knobs'
import './tabs.style.css'

export default { title: 'Components|Tabs' };

const textGroup = 'Text'
const selectedTabGroup = 'Selected'

const options = {
  'Tab 1': 'tab1',
  'Tab 2': 'tab2',
  'Tab 3': 'tab3'
}

const defaultSelected = options['Tab 1']

export const allTabs = () =>
`<div class="Tabs">
  <ul class="Tabs-nav" role="tablist">
    <li class="Tabs-item" role="presentation">
      <a class="Tabs-link" role="tab" aria-selected="${radios('Selected', options, defaultSelected, selectedTabGroup) === options['Tab 1']}">
        ${text('Tab 1 label', 'Tab 1', textGroup)}
      </a>
    </li>
    <li class="Tabs-item" role="presentation">
      <a class="Tabs-link" role="tab" aria-selected="${radios('Selected', options, defaultSelected, selectedTabGroup) === options['Tab 2']}">${text('Tab 2 label', 'Tab 2', textGroup)}</a>
    </li>
    <li class="Tabs-item" role="presentation">
      <a class="Tabs-link" role="tab" aria-selected="${radios('Selected', options, defaultSelected, selectedTabGroup) === options['Tab 3']}">${text('Tab 3 label', 'Tab 3', textGroup)}</a>
    </li>
  </ul>
  <div class="Tabs-panel" role="tabpanel">${text('Panel 1 text', 'Panel 1', textGroup)}</div>
  <div class="Tabs-panel" role="tabpanel">${text('Panel 2 text', 'Panel 2', textGroup)}</div>
  <div class="Tabs-panel" role="tabpanel">${text('Panel 3 text', 'Panel 3', textGroup)}</div>
</div>`

allTabs.story = {
  decorators: [withKnobs]
}

