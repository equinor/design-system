function readPackage(pkg, context) {
  const additionalDependencies = {}

  if (pkg.name === 'eslint') {
    additionalDependencies['eslint-import-resolver-node'] = '0.3.2'
    context.log('Added missing dependencies for eslint-plugin-import')
  }

  return {
    ...pkg,
    dependencies: {
      ...pkg.dependencies,
      ...additionalDependencies,
    },
  }
}

module.exports = {
  hooks: {
    readPackage,
  },
}
