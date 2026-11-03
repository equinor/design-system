"use strict";

// Reanimated 4.7 and react-native-worklets 0.13 each ship a Jest resolver that
// drops the .native file extensions for their own web-compatible modules.
// Their worklets check is `basedir.includes("react-native-worklets")`, and under
// pnpm Reanimated's own directory is named
// `react-native-reanimated@x_react-native-worklets@y_...`, so it matches too.
// Every Reanimated file then loses its .native variant. This resolver does the
// same work with a check on the real package directory, and keeps jest-expo's
// resolver for everything else. Mirrors react-native-reanimated/jest/resolver.js
// and react-native-worklets/jest/resolver.js, so compare them on upgrades.
const jestExpoPreset = require("jest-expo/jest-preset");
const presetResolver = require(jestExpoPreset.resolver);

const WEB_ONLY_IN_JEST = new Set([
    "initializers",
    "mutables",
    "mappers",
    "ConfigHelper",
    "UpdateLayoutAnimations",
    "useAnimatedRef",
    "useAnimatedStyle",
    "WorkletEventHandler",
    "JSPropsUpdater",
    "updateProps",
    "util",
    "css/component/AnimatedComponent",
]);

const withoutNativeExtensions = (options) => ({
    ...options,
    extensions: options.extensions?.filter((ext) => !ext.includes("native")),
});

const inPackage = (basedir, name) =>
    new RegExp(`[\\\\/]node_modules[\\\\/]${name}([\\\\/]|$)`).test(basedir);

module.exports = (request, options) => {
    const resolve = (resolveOptions) =>
        presetResolver(request, {
            ...resolveOptions,
            defaultResolver: options.defaultResolver,
        });

    const basename = request.split("/").pop();
    const isWebOnly = [...WEB_ONLY_IN_JEST].some((entry) =>
        entry.includes("/") ? request.endsWith(entry) : basename === entry
    );
    if (
        request.startsWith(".") &&
        isWebOnly &&
        inPackage(options.basedir, "react-native-reanimated")
    ) {
        return resolve(withoutNativeExtensions(options));
    }

    if (
        inPackage(options.basedir, "react-native-worklets") ||
        request.includes("react-native-worklets")
    ) {
        return resolve(withoutNativeExtensions(options));
    }

    return resolve(options);
};
