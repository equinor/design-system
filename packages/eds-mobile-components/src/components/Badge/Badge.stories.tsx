import { Badge } from "./Badge";

// Example source for the generated docs page (docs/Badge.mdx). These are never
// rendered in a browser. scripts/generate-component-docs.js copies the JSX of
// each export into a code block, so the snippets are type-checked here. The
// `description.story` text becomes the caption above each example.

export const Tones = () => (
    <>
        <Badge tone="neutral">Neutral</Badge>
        <Badge tone="accent">Accent</Badge>
        <Badge tone="success">Success</Badge>
        <Badge tone="info">Info</Badge>
        <Badge tone="warning">Warning</Badge>
        <Badge tone="danger">Danger</Badge>
    </>
);

Tones.parameters = {
    docs: {
        description: {
            story: "Pick the tone by meaning, not by colour: `success`, `warning` and `danger` for status, `info` for notes, `accent` for categories and `neutral` when the badge carries no status.",
        },
    },
};

export const Emphasis = () => (
    <>
        <Badge tone="accent" emphasis="low">Low</Badge>
        <Badge tone="accent" emphasis="medium">Medium</Badge>
    </>
);

Emphasis.parameters = {
    docs: {
        description: {
            story: "Use `low` in table cells and list rows. Switch to `medium` when the badge has to stand out, for example in a card header.",
        },
    },
};

export const Outlined = () => (
    <>
        <Badge tone="accent" variant="outlined" emphasis="low">Low</Badge>
        <Badge tone="accent" variant="outlined" emphasis="medium">Medium</Badge>
    </>
);

Outlined.parameters = {
    docs: {
        description: {
            story: "Outlined swaps the fill for a border, which keeps a badge light on rows that already have a coloured background.",
        },
    },
};

export const Numbers = () => (
    <>
        <Badge tone="danger">{3}</Badge>
        <Badge tone="neutral" emphasis="medium">{42}</Badge>
    </>
);

Numbers.parameters = {
    docs: {
        description: {
            story: "Badge accepts a number as children, which suits counts.",
        },
    },
};
