# Changelog

## [0.3.1](https://github.com/equinor/design-system-mobile/compare/eds-mobile-components-v0.3.0...eds-mobile-components-v0.3.1) (2026-07-09)


### Bug Fixes

* **components:** Divider accessibility defaults can't be overridden ([#224](https://github.com/equinor/design-system-mobile/issues/224)) ([9873283](https://github.com/equinor/design-system-mobile/commit/9873283f82659baa10b20690bbfa4707b135d320))
* **components:** make component's own disabled state win accessibilityState merges ([#221](https://github.com/equinor/design-system-mobile/issues/221)) ([ed5d78d](https://github.com/equinor/design-system-mobile/commit/ed5d78de4807f17101235eae870ea830de8ca801))

## [0.3.0](https://github.com/equinor/design-system-mobile/compare/eds-mobile-components-v0.2.0...eds-mobile-components-v0.3.0) (2026-06-30)


### ⚠ BREAKING CHANGES

* **deps:** upgrade Expo SDK 53 → 55 ([#202](https://github.com/equinor/design-system-mobile/issues/202))

### Features

* **components:** add Badge component ([#190](https://github.com/equinor/design-system-mobile/issues/190)) ([6c18b76](https://github.com/equinor/design-system-mobile/commit/6c18b76f45d6b4c60e3f6f542900ecbb092fd4df))
* **components:** implement Divider component ([#207](https://github.com/equinor/design-system-mobile/issues/207)) ([069e07d](https://github.com/equinor/design-system-mobile/commit/069e07d4080644cae25e5b20672e1985a4e96c35))
* **components:** implement Link component ([#188](https://github.com/equinor/design-system-mobile/issues/188)) ([b0b3a6d](https://github.com/equinor/design-system-mobile/commit/b0b3a6df520fc91c491b48a87bc9387ecc1e5208))
* **components:** implement TextArea component ([#204](https://github.com/equinor/design-system-mobile/issues/204)) ([4fe04dc](https://github.com/equinor/design-system-mobile/commit/4fe04dc59d4d13c64e9a074def49989bc8f838a1)), closes [#131](https://github.com/equinor/design-system-mobile/issues/131)
* **components:** implement TextField component ([#195](https://github.com/equinor/design-system-mobile/issues/195)) ([2701d5b](https://github.com/equinor/design-system-mobile/commit/2701d5be4013a23917cb3e975adf192de35bea0e))
* **components:** migrate Search component ([#206](https://github.com/equinor/design-system-mobile/issues/206)) ([606dedb](https://github.com/equinor/design-system-mobile/commit/606dedb7319a50439216bf72ed3bc94eb89115a9))


### Bug Fixes

* **components:** adopt nested typography token shape from @equinor/eds-tokens@2.3.0-beta.3 ([#180](https://github.com/equinor/design-system-mobile/issues/180)) ([02e82bd](https://github.com/equinor/design-system-mobile/commit/02e82bd1ef8f20ae24807b0e0306f1af867d61d4))
* **components:** read-only Input allows copy; disabled blocks all interaction ([#200](https://github.com/equinor/design-system-mobile/issues/200)) ([cec811f](https://github.com/equinor/design-system-mobile/commit/cec811f96be8ae30a518ad1cf4a1bcbd3ee578c3))


### Miscellaneous Chores

* **deps:** upgrade Expo SDK 53 → 55 ([#202](https://github.com/equinor/design-system-mobile/issues/202)) ([7eaef66](https://github.com/equinor/design-system-mobile/commit/7eaef66f61aceb179add912800bf745f68e19fe9)), closes [#196](https://github.com/equinor/design-system-mobile/issues/196)

## [0.2.0](https://github.com/equinor/design-system-mobile/compare/eds-mobile-components-v0.1.0...eds-mobile-components-v0.2.0) (2026-05-11)


### ⚠ BREAKING CHANGES

* **typography:** migrate Typography to new token system ([#146](https://github.com/equinor/design-system-mobile/issues/146))
* **input:** redesign Input to match Figma design ([#111](https://github.com/equinor/design-system-mobile/issues/111))
* **radio:** redesign Radio to match Figma design ([#108](https://github.com/equinor/design-system-mobile/issues/108))
* **switch:** redesign Switch to match Figma design ([#103](https://github.com/equinor/design-system-mobile/issues/103))
* **button:** redesign Button to match Figma design ([#109](https://github.com/equinor/design-system-mobile/issues/109))

### Features

* **button:** redesign Button to match Figma design ([#109](https://github.com/equinor/design-system-mobile/issues/109)) ([02a2523](https://github.com/equinor/design-system-mobile/commit/02a2523a1f60a24a2b853a634eb440fd64bcd62c)), closes [#42](https://github.com/equinor/design-system-mobile/issues/42)
* **checkbox:** add Checkbox component matching Figma design ([#110](https://github.com/equinor/design-system-mobile/issues/110)) ([1fadbea](https://github.com/equinor/design-system-mobile/commit/1fadbea5d8e785ca1b463006e8434bf1abc6d9a1)), closes [#98](https://github.com/equinor/design-system-mobile/issues/98)
* implement color token system across components ([#76](https://github.com/equinor/design-system-mobile/issues/76)) ([12e645c](https://github.com/equinor/design-system-mobile/commit/12e645c964141045ad73b1ee541d78457deff2f1)), closes [#72](https://github.com/equinor/design-system-mobile/issues/72)
* **input:** redesign Input to match Figma design ([#111](https://github.com/equinor/design-system-mobile/issues/111)) ([2f31784](https://github.com/equinor/design-system-mobile/commit/2f317840be6dace5722c2b439b183f56b0fae79b)), closes [#95](https://github.com/equinor/design-system-mobile/issues/95)
* integrate EDS semantic color tokens ([#74](https://github.com/equinor/design-system-mobile/issues/74)) ([6ce1322](https://github.com/equinor/design-system-mobile/commit/6ce132259b3ce4c3a1abb5397d5479ffbf91b3a2))
* **radio:** redesign Radio to match Figma design ([#108](https://github.com/equinor/design-system-mobile/issues/108)) ([996ca99](https://github.com/equinor/design-system-mobile/commit/996ca99f542cd02400478c7c3732b3d063eae209))
* **storybook:** app cleanup and release prep ([#162](https://github.com/equinor/design-system-mobile/issues/162)) ([e7fae72](https://github.com/equinor/design-system-mobile/commit/e7fae72dd87f96795255fb5561879406f2e75c84))
* **switch:** redesign Switch to match Figma design ([#103](https://github.com/equinor/design-system-mobile/issues/103)) ([1a6a5e1](https://github.com/equinor/design-system-mobile/commit/1a6a5e16d24cd8d275645b6fcbb20d94c214d205)), closes [#96](https://github.com/equinor/design-system-mobile/issues/96)
* **typography:** migrate Typography to new token system ([#146](https://github.com/equinor/design-system-mobile/issues/146)) ([9e6fefd](https://github.com/equinor/design-system-mobile/commit/9e6fefd38e876def16337ffeda3a4b680f9a9df0)), closes [#99](https://github.com/equinor/design-system-mobile/issues/99)


### Bug Fixes

* **input:** add border radius and minimum height ([#147](https://github.com/equinor/design-system-mobile/issues/147)) ([#148](https://github.com/equinor/design-system-mobile/issues/148)) ([9b70be7](https://github.com/equinor/design-system-mobile/commit/9b70be7f84b55fe420539991dcd2bf51036e2666))
* **lint:** add tsconfig.eslint.json to fix ESLint project service errors ([#173](https://github.com/equinor/design-system-mobile/issues/173)) ([c4758cc](https://github.com/equinor/design-system-mobile/commit/c4758cc536fc12eef21a96b19c53e4b802f04ce4))

## [0.1.0](https://github.com/equinor/design-system-mobile/compare/eds-mobile-components-v0.0.1...eds-mobile-components-v0.1.0) (2025-12-18)


### Features

* **build:** Create expo app to test components ([6198075](https://github.com/equinor/design-system-mobile/commit/6198075fb411ea5ae839a81646bf5c1bbc8510bd))
* Implement release-please and package name change([#63](https://github.com/equinor/design-system-mobile/issues/63)) ([e717f26](https://github.com/equinor/design-system-mobile/commit/e717f26b1f0916e5093f5a84d899d80fb8e4ee45))
* Replace Equinor-Regular with Inter font ([#62](https://github.com/equinor/design-system-mobile/issues/62)) ([0e5747f](https://github.com/equinor/design-system-mobile/commit/0e5747fc211c3012c31ae834e65c53c983a03f51))
* **storybook:** remove template code  from app and implement drawer … ([#50](https://github.com/equinor/design-system-mobile/issues/50)) ([97f3140](https://github.com/equinor/design-system-mobile/commit/97f3140d9ac8b27deb42e33c29a6263b0646788e))


### Performance Improvements

* **build:** optimize bundle size by using single entry point ([7fe2f1f](https://github.com/equinor/design-system-mobile/commit/7fe2f1f9e43df477fa1ad5cd2a44a3d2dc73648d))
* **build:** optimize bundle size by using single entry point ([3b80ec1](https://github.com/equinor/design-system-mobile/commit/3b80ec1737fe65b0a99412abad1fac86c21d0a3b))
