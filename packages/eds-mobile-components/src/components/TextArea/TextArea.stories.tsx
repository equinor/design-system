import { TextArea } from "./TextArea";

// Example source for the generated docs page (docs/TextArea.mdx). These are
// never rendered in a browser. scripts/generate-component-docs.js copies the JSX
// of each export into a code block, so the snippets are type-checked here. The
// `description.story` text becomes the caption above each example.

export const WithDescriptionAndHelper = () => (
    <TextArea
        label="Feedback"
        description="Tell us what we can improve"
        placeholder="Write your feedback"
        helperMessage="Do not include personal details"
    />
);

WithDescriptionAndHelper.parameters = {
    docs: {
        description: {
            story: "The description sits between the label and the text area, and the helper message sits below it.",
        },
    },
};

export const WithIndicator = () => (
    <TextArea
        label="Comments"
        indicator="(Optional)"
        placeholder="Add a comment"
    />
);

WithIndicator.parameters = {
    docs: {
        description: {
            story: "Use `indicator` for text such as \"(Required)\" or \"(Optional)\" after the label.",
        },
    },
};

export const WithCharacterCount = () => (
    <TextArea label="Notes" maxLength={200} showCharacterCount />
);

WithCharacterCount.parameters = {
    docs: {
        description: {
            story: "Set `showCharacterCount` to show the count below the field. With `maxLength` it reads \"n / max\", and a screen reader announces it when it reaches 80% and 100% of the limit.",
        },
    },
};

export const Invalid = () => (
    <TextArea
        label="Message"
        invalid
        defaultValue="Hi"
        helperMessage="Write at least 20 characters"
    />
);

Invalid.parameters = {
    docs: {
        description: {
            story: "Set `invalid` to show the error styling and icon, and say what to fix in `helperMessage`. Screen readers read it as part of the hint.",
        },
    },
};

export const DisabledAndReadOnly = () => (
    <>
        <TextArea label="Disabled" disabled defaultValue="Cannot be changed" />
        <TextArea label="Read only" readOnly defaultValue="Can be selected" />
    </>
);

DisabledAndReadOnly.parameters = {
    docs: {
        description: {
            story: "A disabled field ignores input and is dimmed. A read only field shows its value without letting the user change it.",
        },
    },
};
