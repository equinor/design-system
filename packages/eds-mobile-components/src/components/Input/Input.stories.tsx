import { useState } from "react";
import { Input } from "./Input";
import { Icon } from "../Icon";

// Example source for the generated docs page (docs/Input.mdx). These are
// never rendered in a browser. scripts/generate-component-docs.js copies the JSX
// of each export into a code block, so the snippets are type-checked here. The
// `description.story` text becomes the caption above each example. The values
// below stand in for state that a real screen keeps with useState.

export const States = () => {
    const [value, setValue] = useState("Default value");

    return (
        <>
            <Input
                accessibilityLabel="Default"
                value={value}
                onChange={setValue}
            />
            <Input
                accessibilityLabel="Disabled"
                value="Disabled value"
                disabled
            />
            <Input
                accessibilityLabel="Read only"
                value="Read only value"
                readOnly
            />
        </>
    );
};

States.parameters = {
    docs: {
        description: {
            story: "An input is either at its default, disabled, or read only. Both disabled and read only stop editing, but only disabled dims the input and marks it disabled for screen readers. On iOS, selecting text in a read only input needs `multiline`, since single-line fields are not selectable there. `value` and `setValue` are a `useState` pair kept in the parent screen.",
        },
    },
};

export const ValidationStates = () => (
    <>
        <Input accessibilityLabel="Default" placeholder="Default" />
        <Input accessibilityLabel="Invalid" placeholder="Invalid" invalid />
    </>
);

ValidationStates.parameters = {
    docs: {
        description: {
            story: "Set `invalid` to show error styling and an error icon. Pair it with an accessible description of what needs fixing.",
        },
    },
};

export const WithAdornments = () => (
    <>
        <Input
            accessibilityLabel="With text prefix and suffix"
            placeholder="Amount"
            startText="€"
            endText="EUR"
        />
        <Input
            accessibilityLabel="With icon"
            placeholder="Website"
            endAdornment={<Icon name="link-variant" size={16} />}
        />
        <Input
            accessibilityLabel="Search"
            placeholder="Search"
            startAdornment={<Icon name="magnify" size={16} />}
        />
    </>
);

WithAdornments.parameters = {
    docs: {
        description: {
            story: "Use `startText` and `endText` for prefix or suffix text, such as a currency symbol or unit. Use `startAdornment` and `endAdornment` for elements such as icons.",
        },
    },
};

export const Multiline = () => (
    <Input
        accessibilityLabel="Message"
        placeholder="Write a message"
        multiline
    />
);

Multiline.parameters = {
    docs: {
        description: {
            story: "Set `multiline` to let the input grow to fit several lines of text, such as a comment or a note.",
        },
    },
};
