import { setUpTests } from "react-native-reanimated";

setUpTests();

// @expo/vector-icons' icon sets resolve their font-loaded state asynchronously,
// which triggers a setState after render() has already resolved, outside of
// act(). Mock each icon set's component to a plain Text host node so icons
// render synchronously. Static properties (e.g. `.font`, used by useEDS.ts's
// `...MaterialCommunityIcons.font` spread) are copied over from the real
// module rather than dropped, so code relying on them still works under test.
jest.mock("@expo/vector-icons", () => {
    // Referencing top-level imports from inside a jest.mock() factory throws
    // ("out-of-scope variable"), since the factory must be self-contained —
    // hence the inline requires here instead of module-level imports.
    /* eslint-disable @typescript-eslint/no-require-imports */
    const React = require("react") as typeof import("react");
    const { Text } = require("react-native") as typeof import("react-native");
    const actual: Record<string, unknown> =
        jest.requireActual("@expo/vector-icons");
    /* eslint-enable @typescript-eslint/no-require-imports */

    const mocked: Record<string, unknown> = {};
    for (const [key, value] of Object.entries(actual)) {
        mocked[key] =
            typeof value === "function"
                ? Object.assign(
                      (props: Record<string, unknown>) =>
                          React.createElement(Text, props),
                      value
                  )
                : value;
    }
    return mocked;
});
