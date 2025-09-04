module.exports = {
  extends: ['plugin:@docusaurus/recommended'],
  rules: {
    'import/no-unresolved': [
      2,
      { ignore: ['^@theme', '^@docusaurus', '^@site'] },
    ],
  },
}
