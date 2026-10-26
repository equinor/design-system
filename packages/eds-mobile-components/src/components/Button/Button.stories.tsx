import { Button } from "./index";

// Example source for the generated docs page (docs/Button.mdx). These are
// never rendered in a browser. scripts/generate-component-docs.js copies the JSX
// of each export into a code block, so the snippets are type-checked here. The
// `description.story` text becomes the caption above each example. The values
// below stand in for handlers that a real screen defines.

const handlePress = () => null;

export const Variants = () => (
    <>
        <Button label="Primary" variant="primary" onPress={handlePress} />
        <Button label="Secondary" variant="secondary" onPress={handlePress} />
        <Button label="Ghost" variant="ghost" onPress={handlePress} />
    </>
);

Variants.parameters = {
    docs: {
        description: {
            story: "Use the variant to show which action matters most. Primary is the default.",
        },
    },
};

export const Tones = () => (
    <>
        <Button label="Save" tone="accent" onPress={handlePress} />
        <Button
            label="Cancel"
            tone="neutral"
            variant="secondary"
            onPress={handlePress}
        />
        <Button label="Delete" tone="danger" onPress={handlePress} />
    </>
);

Tones.parameters = {
    docs: {
        description: {
            story: "Use `tone` to signal the intent of an action. Every tone works with every variant.",
        },
    },
};

export const WithIcons = () => (
    <>
        <Button label="Download" leadingIcon="download" onPress={handlePress} />
        <Button label="Next" trailingIcon="arrow-right" onPress={handlePress} />
    </>
);

WithIcons.parameters = {
    docs: {
        description: {
            story: "Use `leadingIcon` to show an icon before the label and `trailingIcon` to show one after it.",
        },
    },
};

export const IconOnly = () => (
    <>
        <Button.Icon
            name="close"
            accessibilityLabel="Dismiss"
            onPress={handlePress}
        />
        <Button.Icon
            name="heart"
            round
            accessibilityLabel="Favourite"
            onPress={handlePress}
        />
    </>
);

IconOnly.parameters = {
    docs: {
        description: {
            story: "Use `Button.Icon` when a visible label would be redundant. `round` makes it a circle. It has no text, so always give it an `accessibilityLabel`.",
        },
    },
};

export const Disabled = () => <Button label="Unavailable" disabled />;

Disabled.parameters = {
    docs: {
        description: {
            story: "A disabled button ignores presses and shows less contrast.",
        },
    },
};
