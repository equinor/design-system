import { TextField } from "./TextField";

// Example source for the generated docs page (docs/TextField.mdx). These are
// never rendered in a browser. scripts/generate-component-docs.js copies the JSX
// of each export into a code block, so the snippets are type-checked here. The
// `description.story` text becomes the caption above each example.

export const WithDescriptionAndHelper = () => (
    <TextField
        label="Email"
        description="We use it to send your receipt"
        placeholder="name@example.com"
        helperMessage="You can change it later in settings"
    />
);

WithDescriptionAndHelper.parameters = {
    docs: {
        description: {
            story: "The description sits between the label and the input, and the helper message sits below the input.",
        },
    },
};

export const WithIndicator = () => (
    <TextField
        label="Nickname"
        indicator="(Optional)"
        placeholder="Enter a nickname"
    />
);

WithIndicator.parameters = {
    docs: {
        description: {
            story: "Use `indicator` for text such as \"(Required)\" or \"(Optional)\" after the label.",
        },
    },
};

export const Invalid = () => (
    <TextField
        label="Password"
        invalid
        defaultValue="abc"
        helperMessage="Use at least 8 characters"
    />
);

Invalid.parameters = {
    docs: {
        description: {
            story: "Set `invalid` to show the error styling, and say what to fix in `helperMessage`. Screen readers read it as part of the hint.",
        },
    },
};

export const DisabledAndReadOnly = () => (
    <>
        <TextField label="Disabled" disabled defaultValue="Cannot be changed" />
        <TextField label="Read only" readOnly defaultValue="Can be selected" />
    </>
);

DisabledAndReadOnly.parameters = {
    docs: {
        description: {
            story: "A disabled field ignores input and is dimmed. A read only field shows its value without letting the user change it.",
        },
    },
};

export const WithStartText = () => (
    <TextField label="Amount" startText="NOK" placeholder="0.00" />
);

WithStartText.parameters = {
    docs: {
        description: {
            story: "Use `startText` and `endText` for a prefix or suffix, such as a currency or a unit.",
        },
    },
};

export const Multiline = () => <TextField label="Notes" multiline />;

Multiline.parameters = {
    docs: {
        description: {
            story: "Set `multiline` to allow text over several lines. TextArea is the complete field built for longer text.",
        },
    },
};
