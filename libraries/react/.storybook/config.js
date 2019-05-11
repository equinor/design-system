import { configure } from '@storybook/react';

function loadStories() {
  const req = require.context('../packages', true, /\.stories\.jsx$/);
  req.keys().forEach(filename => req(filename));
}

configure(loadStories, module);
