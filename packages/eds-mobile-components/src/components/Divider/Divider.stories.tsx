import { View } from "react-native";
import { Divider } from "./Divider";
import { Typography } from "../Typography";

// Example source for the generated docs page (docs/Divider.mdx). These are
// never rendered in a browser. scripts/generate-component-docs.js copies the JSX
// of each export into a code block, so the snippets are type-checked here. The
// `description.story` text becomes the caption above each example.

export const SettingsList = () => (
    <>
        <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
            <Typography>Language</Typography>
            <Typography>English</Typography>
        </View>
        <Divider style={{ marginVertical: 16 }} />
        <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
            <Typography>Theme</Typography>
            <Typography>System</Typography>
        </View>
    </>
);

SettingsList.parameters = {
    docs: {
        description: {
            story: "A Divider has no margin of its own, so pass `style` to set the space above and below it.",
        },
    },
};

export const BetweenSections = () => (
    <>
        <Typography weight="bolder">Delivery</Typography>
        <Typography>Orders placed before 14:00 ship the same day.</Typography>
        <Divider style={{ marginVertical: 16 }} />
        <Typography weight="bolder">Returns</Typography>
        <Typography>You can return an item within 30 days.</Typography>
    </>
);

BetweenSections.parameters = {
    docs: {
        description: {
            story: "Use a Divider to separate sections of a screen when the headings alone do not make the break clear enough.",
        },
    },
};

export const BeforeTheTotal = () => (
    <>
        <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
            <Typography>Coffee beans</Typography>
            <Typography>120 NOK</Typography>
        </View>
        <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
            <Typography>Filter papers</Typography>
            <Typography>45 NOK</Typography>
        </View>
        <Divider style={{ marginVertical: 16 }} />
        <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
            <Typography weight="bolder">Total</Typography>
            <Typography weight="bolder">165 NOK</Typography>
        </View>
    </>
);

BeforeTheTotal.parameters = {
    docs: {
        description: {
            story: "A Divider before a total shows that the last row sums up the ones above it.",
        },
    },
};
