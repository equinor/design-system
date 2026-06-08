import { Section } from "@/components/Section";
import { Surface } from "@/components/Surface";
import { Icon, TextField, Typography } from "@equinor/eds-mobile-components";
import { useState } from "react";
import { ScrollView } from "react-native";

export default function TextFieldScreen() {
    const [value, setValue] = useState("");
    const [errorValue, setErrorValue] = useState("");

    return (
        <ScrollView contentInsetAdjustmentBehavior="automatic" keyboardShouldPersistTaps="handled">
            <Section>
                <Typography>
                    TextField combines a label, an input, and a helper message
                    into a single form field. Use it wherever you need a
                    labelled text input.
                </Typography>
            </Section>

            <Section title="Basic" />
            <Surface>
                <TextField
                    label="Title"
                    placeholder="Placeholder"
                    value={value}
                    onChange={setValue}
                />
            </Surface>

            <Section title="With description" />
            <Surface>
                <TextField
                    label="Title"
                    description="Help with more details"
                    placeholder="Placeholder"
                />
            </Surface>

            <Section title="With helper message" />
            <Surface>
                <TextField
                    label="Title"
                    placeholder="Placeholder"
                    helperMessage="Helper message"
                />
            </Surface>

            <Section title="With adornments">
                <Typography>
                    Pass startText, endText, startAdornment, or endAdornment
                    directly — the same props as Input.
                </Typography>
            </Section>
            <Surface>
                <TextField
                    label="Amount"
                    startText="NOK"
                    endAdornment={<Icon name="information" size={16} />}
                    placeholder="0.00"
                    keyboardType="numeric"
                />
            </Surface>

            <Section title="Invalid" />
            <Surface>
                <TextField
                    label="Title"
                    description="Help with more details"
                    placeholder="Placeholder"
                    helperMessage="This field is required"
                    value={errorValue}
                    onChange={setErrorValue}
                    invalid
                />
            </Surface>

            <Section title="Indicator">
                <Typography>
                    Use the indicator prop to show "(Required)" or "(Optional)"
                    inline after the label.
                </Typography>
            </Section>
            <Surface>
                <TextField
                    label="First name"
                    indicator="(Required)"
                    placeholder="Placeholder"
                />
                <TextField
                    label="Middle name"
                    indicator="(Optional)"
                    placeholder="Placeholder"
                />
            </Surface>

            <Section title="Read-only" />
            <Surface>
                <TextField
                    label="Title"
                    description="Help with more details"
                    value="This is a read-only value. Long-press to select and copy this text."
                    readOnly
                    multiline
                />
            </Surface>

            <Section title="Disabled" />
            <Surface>
                <TextField
                    label="Title"
                    description="Help with more details"
                    placeholder="Placeholder"
                    helperMessage="Helper message"
                    disabled
                />
            </Surface>
        </ScrollView>
    );
}
