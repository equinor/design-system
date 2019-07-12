# Releasing

```sh
pnpm run build
pnpm run bump
git add package.json
git commit -m "bump version"
pnpm run publish
git tag eds-core-react@0.0.1-alpha.1
git push --tags origin prerelease
```
