import { withKnobs, text, radios } from '@storybook/addon-knobs'
import { render, html } from 'lit-html'
import { repeat } from 'lit-html/directives/repeat'
import './tabs.style.css'

export default { title: 'Components|Tabs' }

const textGroup = 'Text'
const selectedTabGroup = 'Selected'

const options = {
  'Tab 1': 'tab1',
  'Tab 2': 'tab2',
  'Tab 3': 'tab3',
}

const defaultSelected = options['Tab 1']

const story = (template) => {
  const fragment = document.createDocumentFragment()
  render(template, fragment)
  return fragment
}

const Tab = (index) => html`
  <style>
    .Tabs-item {
      background: orange;
    }
    .Tabs-link {
      background: yellow;
    }
  </style>
  <li class="Tabs-item" role="presentation">
    <a
      class="Tabs-link"
      role="tab"
      aria-selected="${radios(
        'Selected',
        options,
        defaultSelected,
        selectedTabGroup,
      ) === options[`Tab ${index}`]}"
    >
      ${text(`Tab ${index} label`, `Tab ${index}`, textGroup)}
    </a>
  </li>
`

const Panel = (index) => html`
  <div class="Tabs-panel" role="tabpanel">
    ${text(`Panel ${index} text`, `Panel ${index}`, textGroup)}
  </div>
`

export const allTabs = () =>
  story(
    html`
      <div class="Tabs">
        <ul class="Tabs-nav" role="tablist">
          ${[...new Array(3)].map((item, i) => Tab(i + 1))}
        </ul>
        ${[...new Array(3)].map((item, i) => Panel(i + 1))}
      </div>
    `,
  )

allTabs.story = {
  decorators: [withKnobs],
}
