# Releasing

## Libraries

### Prepare

This can be done from develop or seperate release branches (before merging to develop)

1. Change the version-number in accordance with the magnitude of change.
   1. If its not a `@latest` release, the type should be "dashed", for example; `0.0.0-beta` or `0.0.0-dev.20210101`
   2. We try to follow [semver](https://semver.org/) but are holding back major v1 until we feel its ready.
2. Update the changelog
3. Add a release in github

### Publish

1. Find the corresponding workflow for your library, usually prepended with "Publish \<LIBRARY NAME\>"
2. "Run workflow" and decide if input values need to be changed
   1. Storybok slot: If present, choose which environment Storybook should be updated.
      1. _Leave this input *empty* for deployment to production_
   2. NPM tag: Choose which tag to apply to the published package
      1. _Choose `latest` for production release_
3. ⚠️ Check "Publish eds-\<LIBRARY NAME\> to npm" step to verify the package was actually published. **_If an existing version exists on npmjs.org, the package will not be published, but this step will still pass._**
