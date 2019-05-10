import { configure } from '@storybook/react';

function loadStories() {
  const req = require.context('../packages/node_modules', true, /\.stories\.jsx$/);
  req.keys().forEach(filename => req(filename));
}

configure(loadStories, module);
