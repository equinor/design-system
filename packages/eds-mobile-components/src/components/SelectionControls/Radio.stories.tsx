import { View } from "react-native";
import { Radio } from "./Radio";
import { Typography } from "../Typography";

// Example source for the generated docs page (docs/Radio.mdx). These are
// never rendered in a browser. scripts/generate-component-docs.js copies the JSX
// of each export into a code block, so the snippets are type-checked here. The
// `description.story` text becomes the caption above each example. The values
// below stand in for state that a real screen keeps with useState.

const options = ["Apples", "Oranges", "Pears"];
const selected = "Apples" as string;
const setSelected = (option: string) => option;
const preselected = "Standard delivery" as string;
const setPreselected = (option: string) => option;
const isSelected = false;
const setIsSelected = (checked: boolean) => checked;

export const SelectingFromOptions = () => (
    <>
        {options.map((option) => (
            <Radio
                key={option}
                label={option}
                checked={selected === option}
                onPress={() => setSelected(option)}
            />
        ))}
    </>
);

SelectingFromOptions.parameters = {
    docs: {
        description: {
            story: "Radio has no group wrapper, so keep the selected option in the parent screen's state.",
        },
    },
};

export const Preselected = () => (
    <>
        <Radio
            label="Standard delivery"
            checked={preselected === "Standard delivery"}
            onPress={() => setPreselected("Standard delivery")}
        />
        <Radio
            label="Express delivery"
            checked={preselected === "Express delivery"}
            onPress={() => setPreselected("Express delivery")}
        />
    </>
);

Preselected.parameters = {
    docs: {
        description: {
            story: "Set the initial state to the option that should be selected when the screen first appears, rather than leaving the group unselected.",
        },
    },
};

export const ListRow = () => (
    <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
        <Radio
            label="Standard delivery"
            checked={preselected === "Standard delivery"}
            onPress={() => setPreselected("Standard delivery")}
        />
        <Typography>3 to 5 working days</Typography>
    </View>
);

ListRow.parameters = {
    docs: {
        description: {
            story: "Radio has no slot for extra detail, so wrap it in your own row and add a second piece of text next to it.",
        },
    },
};

export const WithoutLabel = () => (
    <Radio
        checked={isSelected}
        onPress={() => setIsSelected(true)}
        accessibilityLabel="Select option A"
    />
);

WithoutLabel.parameters = {
    docs: {
        description: {
            story: "Use this in multi-select lists and bulk selection headers, where the row or the column title already says what is being selected. Give it an `accessibilityLabel`, and it renders as a round touch target.",
        },
    },
};

export const Disabled = () => (
    <>
        <Radio label="Unavailable" checked={false} disabled />
        <Radio label="Locked in" checked={true} disabled />
    </>
);

Disabled.parameters = {
    docs: {
        description: {
            story: "A disabled radio ignores presses and shows less contrast.",
        },
    },
};
