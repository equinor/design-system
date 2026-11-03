import { Search } from "./Search";

// Example source for the generated docs page (docs/Search.mdx). These are
// never rendered in a browser. scripts/generate-component-docs.js copies the JSX
// of each export into a code block, so the snippets are type-checked here. The
// `description.story` text becomes the caption above each example. The values
// below stand in for handlers that a real screen defines.

const handleCancel = () => null;

export const WithClearButton = () => (
    <Search label="Search" placeholder="Search" defaultValue="Equinor" />
);

WithClearButton.parameters = {
    docs: {
        description: {
            story: "A clear button appears inside the field while it has text. Pressing it empties the field, so the user can type a new query.",
        },
    },
};

export const WithCancelButton = () => (
    <Search
        label="Search"
        defaultValue="Equinor"
        cancellable
        onCancelPress={handleCancel}
    />
);

WithCancelButton.parameters = {
    docs: {
        description: {
            story: "Set `cancellable` to show a Cancel button beside the field while it is focused. The clear button stays inside the field, so both work together: clear only empties the field, while Cancel also closes the keyboard and calls `onCancelPress`, so the screen can leave the search.",
        },
    },
};

export const WithDescriptionAndHelper = () => (
    <Search
        label="Search"
        description="Search across all resources"
        helperMessage="Enter at least 3 characters"
    />
);

WithDescriptionAndHelper.parameters = {
    docs: {
        description: {
            story: "The description sits between the label and the field, and the helper message sits below it.",
        },
    },
};

export const Invalid = () => (
    <Search
        label="Search"
        invalid
        defaultValue="xyz"
        helperMessage="No results found"
    />
);

Invalid.parameters = {
    docs: {
        description: {
            story: "Set `invalid` to show an error icon next to the search icon, and say what is wrong in `helperMessage`. Screen readers read it as part of the hint.",
        },
    },
};

export const DisabledAndReadOnly = () => (
    <>
        <Search label="Disabled" disabled defaultValue="Cannot be changed" />
        <Search label="Read only" readOnly defaultValue="Previous search" />
    </>
);

DisabledAndReadOnly.parameters = {
    docs: {
        description: {
            story: "A disabled field ignores input and is dimmed. A read only field shows its value without letting the user change it, and neither shows a clear button.",
        },
    },
};
