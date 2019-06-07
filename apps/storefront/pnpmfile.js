module.exports = {
  hooks: {
    readPackage,
  },
}

function readPackage(pkg, context) {
  if (pkg.name === 'enzyme-adapter-react-16') {
    pkg.dependencies = {
      ...pkg.dependencies,
      has: '^1.0.3',
    }
    context.log('Added missing dependencies for enzyme-adapter-react-16')
  }
  if (pkg.name === 'eslint') {
    pkg.dependencies = {
      ...pkg.dependencies,
      'eslint-import-resolver-node': '0.3.2',
    }
    context.log('Added missing dependencies for eslint-plugin-import')
  }

  return pkg
}
