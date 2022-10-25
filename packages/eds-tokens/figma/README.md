Design tokens
=============

The design tokens in this folder are exported from the [Figma Tokens][ft] plugin in Figma. Edit the files in JSON or in the Figma Plugin, but don’t edit the files in the readonly folder, they’re generated with javascript.

The tokens will eventually be made available on CDN and NPM, but for now they’re intended for the EDS Core Team in the work with EDS 2.0.

To use the plugin:

1. Open the plugin in Figma, and choose Github for `token storage`.
1. Add new credentials
1. Generate a personal access token on Github with the `repo` scope for the `access token` field
1. Add `equinor/design-system` as repository
1. Add `packages/eds-tokens/figma` as `file path`

For questions or comments use [#eds-design-system][slack] on Slack or <abbr title="Direct message">DM</abbr> @vnys

[slack]: https://equinor.slack.com/archives/CJT20H1B9
[ft]: https://www.figmatokens.com/
