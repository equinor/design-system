import { Link } from "./Link";
import { Typography } from "../Typography";

// Example source for the generated docs page (docs/Link.mdx). These are
// never rendered in a browser. scripts/generate-component-docs.js copies the JSX
// of each export into a code block, so the snippets are type-checked here. The
// `description.story` text becomes the caption above each example. The values
// below stand in for state that a real screen keeps with useState.

const handlePress = () => null;
const visited = false;
const markVisited = () => null;

export const Standalone = () => (
    <Link onPress={handlePress}>Open documentation</Link>
);

Standalone.parameters = {
    docs: {
        description: {
            story: "A standalone link sits on its own, with its own underline. It is the default.",
        },
    },
};

export const Inline = () => (
    <Typography>
        Read the{" "}
        <Link variant="inline" onPress={handlePress}>
            full documentation
        </Link>{" "}
        for more details.
    </Typography>
);

Inline.parameters = {
    docs: {
        description: {
            story: "Use `variant=\"inline\"` to place a link inside a sentence. It renders as text, so it sits alongside the words around it.",
        },
    },
};

export const Sizes = () => (
    <>
        <Link size="sm" onPress={handlePress}>
            Small
        </Link>
        <Link size="md" onPress={handlePress}>
            Medium
        </Link>
        <Link size="lg" onPress={handlePress}>
            Large
        </Link>
    </>
);

Sizes.parameters = {
    docs: {
        description: {
            story: "The size follows the Typography UI scale. Use it to match a link to the text it sits next to.",
        },
    },
};

export const External = () => (
    <Link external onPress={handlePress}>
        View on GitHub
    </Link>
);

External.parameters = {
    docs: {
        description: {
            story: "Set `external` to show an icon that tells the user the link opens outside the app.",
        },
    },
};

export const Visited = () => (
    <Link visited={visited} onPress={markVisited}>
        Open documentation
    </Link>
);

Visited.parameters = {
    docs: {
        description: {
            story: "Link does not remember being pressed. Keep that in your own state, as a real screen does with `useState`, and pass it as `visited`.",
        },
    },
};
