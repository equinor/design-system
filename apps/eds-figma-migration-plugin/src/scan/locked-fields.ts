/**
 * Fields a plugin cannot bind a variable to on a layer inside an instance; it
 * can only unbind them. In a module of its own so the scanner's reader can
 * use it without the rules, which keeps the fixture script
 * (vite.fixture.config.ts) within the code limit of the Figma MCP server.
 */
export const INSTANCE_LOCKED_FIELDS = new Set([
  'width',
  'height',
  'minWidth',
  'maxWidth',
  'minHeight',
  'maxHeight',
])
