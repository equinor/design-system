module.exports = {
  hooks: {
    readPackage
  }
}

function readPackage(pkg, context) {
  if (pkg.name === '@storybook/react') {
    pkg.dependencies = {
      ...pkg.dependencies,
      "@emotion/core": "^10.0.10",
      "@emotion/styled": "^10.0.11",
      "@storybook/channels": "^5.0.11",
      "emotion-theming": "^10.0.10",
      "babel-plugin-add-react-displayname": "^0.0.5",
    }
    context.log('Added missing dependencies for @storybook/react')
  }

  return pkg
}
