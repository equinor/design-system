import { Section } from "@/components/Section";
import { Surface } from "@/components/Surface";
import { TextArea, Typography } from "@equinor/eds-mobile-components";
import { useState } from "react";
import { ScrollView } from "react-native";

export default function TextAreaScreen() {
    const [value, setValue] = useState("");
    const [charCountValue, setCharCountValue] = useState("");

    return (
        <ScrollView contentInsetAdjustmentBehavior="automatic" keyboardShouldPersistTaps="handled">
            <Section>
                <Typography>
                    TextArea is a multi-line text input. It grows automatically
                    as the user types.
                </Typography>
            </Section>

            <Section title="Basic" />
            <Surface>
                <TextArea
                    label="Title"
                    placeholder="Placeholder"
                    value={value}
                    onChangeText={setValue}
                />
            </Surface>

            <Section title="With description" />
            <Surface>
                <TextArea
                    label="Title"
                    description="Help with more details"
                    placeholder="Placeholder"
                />
            </Surface>

            <Section title="With helper message" />
            <Surface>
                <TextArea
                    label="Title"
                    placeholder="Placeholder"
                    helperMessage="Helper message"
                />
            </Surface>

            <Section title="Character count" />
            <Surface>
                <TextArea
                    label="Title"
                    placeholder="Placeholder"
                    showCharacterCount
                    maxLength={200}
                    value={charCountValue}
                    onChangeText={setCharCountValue}
                />
            </Surface>

            <Section title="Indicator" />
            <Surface>
                <TextArea
                    label="Comments"
                    indicator="(Optional)"
                    placeholder="Placeholder"
                />
            </Surface>

            <Section title="Invalid" />
            <Surface>
                <TextArea
                    label="Title"
                    description="Help with more details"
                    placeholder="Placeholder"
                    helperMessage="This field is required"
                    invalid
                />
            </Surface>

            <Section title="Read-only" />
            <Surface>
                <TextArea
                    label="Title"
                    value="This is a read-only value. Long-press to select and copy this text."
                    readOnly
                />
            </Surface>

            <Section title="Disabled" />
            <Surface>
                <TextArea
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
