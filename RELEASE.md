# Releasing

1. Log into npm in your terminal
1. Build the package you want to publish. For example, to build the tokens package, run `pnpm --filter ./libraries/tokens run build`
1. Update the changelog
1. Bump the version-number. For example, to bump the version from 0.0.1-alpha.1 to 0.0.1-alpha.2, you run `pnpm --filter ./libraries/tokens recursive exec -- pnpm version prerelease`
1. Push your changes to git, using fish in the following example: `git add .` then `git commit -m "update version"` and then `git push`
1. Publish the package to npm by running `pnpm --filter ./libraries/tokens recursive exec -- pnpm publish --tag alpha --access public`
1. If you want to also tag the published package with **latest**, then you have to run the following command (make sure you use the version-number you just published to npm): `npm dist-tag add @equinor/eds-tokens@0.0.1-alpha.1 latest`
1. Then run `git tag eds-tokens@0.0.1-alpha.1` and `git push --tags origin develop`
1. Head over to the [repository in Github](https://github.com/equinor/design-system) and draft a new release from the [new tag](https://github.com/equinor/equinor-brand-assets/tags)(ellipsis-menu on the right-hand side) and include the changes from the changelog in the description
