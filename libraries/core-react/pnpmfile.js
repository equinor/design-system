function readPackage(pkg, context) {
  const additionalDependencies = {}

  if (pkg.name === 'enzyme-adapter-react-16') {
    additionalDependencies.has = '^1.0.3'
    context.log('Added missing dependencies for enzyme-adapter-react-16')
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
