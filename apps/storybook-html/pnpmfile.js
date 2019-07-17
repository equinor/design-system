function readPackage(pkg, context) {
  if (pkg.name === '@storybook/html') {
    pkg.dependencies = {
      ...pkg.dependencies,
      'babel-runtime': 'latest',
      'core-js': '2',
    }
  }

  return pkg
}

module.exports = {
  hooks: {
    readPackage,
  },
}
