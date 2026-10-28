import { Icon } from "./Icon";

// Example source for the generated docs page (docs/Icon.mdx). These are never
// rendered in a browser. scripts/generate-component-docs.js copies the JSX of
// each export into a code block, so the snippets are type-checked here. The
// `description.story` text becomes the caption above each example.

export const Sizes = () => (
    <>
        <Icon name="home" size={16} />
        <Icon name="home" size={24} />
        <Icon name="home" size={32} />
    </>
);

Sizes.parameters = {
    docs: {
        description: {
            story: "Set `size` in points. Without it, the icon uses the EDS icon size.",
        },
    },
};

export const Colors = () => (
    <>
        <Icon name="check-circle" />
        <Icon name="check-circle" color="seagreen" />
    </>
);

Colors.parameters = {
    docs: {
        description: {
            story: "Without `color`, the icon uses the strong neutral text colour, which follows the colour scheme. Set `color` to use another colour, and check its contrast against the background in both schemes.",
        },
    },
};

export const WithLabel = () => (
    <>
        <Icon name="alert-circle" accessibilityLabel="Warning" />
        <Icon name="alert-circle" accessibilityElementsHidden />
    </>
);

WithLabel.parameters = {
    docs: {
        description: {
            story: "Give an icon that carries meaning on its own an `accessibilityLabel`. Hide a decorative icon, which only repeats the text beside it, with `accessibilityElementsHidden`.",
        },
    },
};
