import { Switch } from "./Switch";

// Example source for the generated docs page (docs/Switch.mdx). These are
// never rendered in a browser. scripts/generate-component-docs.js copies the JSX
// of each export into a code block, so the snippets are type-checked here. The
// `description.story` text becomes the caption above each example. The values
// below stand in for state that a real screen keeps with useState.

const isEnabled = false;
const setIsEnabled = (active: boolean) => active;

export const Default = () => <Switch label="Enable notifications" />;

Default.parameters = {
    docs: {
        description: {
            story: "Without `active`, Switch starts off.",
        },
    },
};

export const WithoutLabel = () => (
    <Switch
        active={isEnabled}
        onChange={setIsEnabled}
        accessibilityLabel="Enable feature"
    />
);

WithoutLabel.parameters = {
    docs: {
        description: {
            story: "Use this when the row content already says what the switch controls, so it can sit directly next to other controls with no extra wrapping. Give it an `accessibilityLabel`, and it renders as a round touch target.",
        },
    },
};

export const Disabled = () => (
    <>
        <Switch label="Locked setting" active={true} disabled />
        <Switch label="Unavailable" active={false} disabled />
    </>
);

Disabled.parameters = {
    docs: {
        description: {
            story: "A disabled switch ignores presses and shows less opacity.",
        },
    },
};
