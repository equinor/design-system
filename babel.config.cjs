/*
 * Yes, this file is needed for jest to be able to run on react native stuff, because
 * node_modules/@react-native/js-pollyfills/error-guard.js needs to be transpiled (it has Flow typings inside of it)
 *
 * Fuck Javascript, Fuck Jest, Fuck Flow
 */
/* eslint-disable no-undef -- configuration files need cjs format */
module.exports = function (api) {
    api.cache(true);
    return {
        presets: ["babel-preset-expo"],
        plugins: [
            // Reanimated has to be listed last!
            "react-native-reanimated/plugin",
        ],
    };
};
