import { Checkbox } from "./Checkbox";

// Example source for the generated docs page (docs/Checkbox.mdx). These are
// never rendered in a browser. scripts/generate-component-docs.js copies the JSX
// of each export into a code block, so the snippets are type-checked here. The
// `description.story` text becomes the caption above each example. The values
// below stand in for state that a real screen keeps with useState.

const options = ["Email", "SMS", "Push"];
const selected: string[] = [];
const toggle = (option: string) => selected.includes(option);
const setSelected = (values: string[]) => values.length;
const setChecked = (checked: boolean) => checked;
const allChecked = false;
const someChecked = true;

export const States = () => (
    <>
        <Checkbox label="Unchecked" checked={false} onPress={setChecked} />
        <Checkbox label="Checked" checked={true} onPress={setChecked} />
        <Checkbox label="Indeterminate" indeterminate onPress={setChecked} />
    </>
);

States.parameters = {
    docs: {
        description: {
            story: "A checkbox is checked, unchecked or indeterminate. Indeterminate takes precedence over `checked`.",
        },
    },
};

export const SelectingMultipleOptions = () => (
    <>
        {options.map((option) => (
            <Checkbox
                key={option}
                label={option}
                checked={selected.includes(option)}
                onPress={() => toggle(option)}
            />
        ))}
    </>
);

SelectingMultipleOptions.parameters = {
    docs: {
        description: {
            story: "Checkbox has no group wrapper, so keep the selected options in the parent screen's state.",
        },
    },
};

export const IndeterminateParent = () => (
    <Checkbox
        label="All notifications"
        checked={allChecked}
        indeterminate={someChecked}
        onPress={() => setSelected(allChecked ? [] : options)}
    />
);

IndeterminateParent.parameters = {
    docs: {
        description: {
            story: "Use `indeterminate` on a parent checkbox when only some of its children are selected. Screen readers hear it as mixed.",
        },
    },
};

export const WithoutLabel = () => (
    <Checkbox
        checked={true}
        onPress={setChecked}
        accessibilityLabel="Select row"
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
        <Checkbox label="Unavailable" checked={false} disabled />
        <Checkbox label="Locked in" checked={true} disabled />
    </>
);

Disabled.parameters = {
    docs: {
        description: {
            story: "A disabled checkbox ignores presses and shows less contrast.",
        },
    },
};
