import { Section } from "@/components/Section";
import { Surface } from "@/components/Surface";
import {
    EDSStyleSheet,
    Search,
    Typography,
    useStyles,
} from "@equinor/eds-mobile-components";
import { useState } from "react";
import { ScrollView } from "react-native";

export default function SearchScreen() {
    const [value, setValue] = useState("");
    const [cancellableValue, setCancellableValue] = useState("");
    const styles = useStyles(themeStyles);

    return (
        <ScrollView
            contentInsetAdjustmentBehavior="automatic"
            keyboardShouldPersistTaps="handled"
        >
            <Section>
                <Typography>
                    Search lets users filter or find content. It includes a
                    label, a magnify icon, an inline clear button, and an
                    optional animated Cancel button.
                </Typography>
            </Section>

            <Section title="Basic" />
            <Surface>
                <Search
                    label="Title"
                    placeholder="Placeholder"
                    value={value}
                    onChange={setValue}
                />
            </Surface>

            <Section title="With description" />
            <Surface>
                <Search
                    label="Projects"
                    description="Filter by project name or tag."
                    placeholder="Placeholder"
                />
            </Surface>

            <Section title="With helper message" />
            <Surface>
                <Search
                    label="Title"
                    helperMessage="Helper message"
                    placeholder="Placeholder"
                />
            </Surface>

            <Section title="With indicator">
                <Typography>
                    Use the indicator prop to show &quot;(Required)&quot; or
                    &quot;(Optional)&quot; inline after the label.
                </Typography>
            </Section>
            <Surface>
                <Search
                    label="Title"
                    indicator="(Optional)"
                    placeholder="Placeholder"
                />
            </Surface>

            <Section title="With Cancel button">
                <Typography>
                    When cancellable is true, a Cancel button slides in when
                    the input is focused. Pressing it clears the text and
                    dismisses the keyboard automatically.
                </Typography>
            </Section>
            <Surface>
                <Search
                    label="Title"
                    placeholder="Placeholder"
                    value={cancellableValue}
                    onChange={setCancellableValue}
                    cancellable
                />
            </Surface>

            <Section title="Invalid" />
            <Surface>
                <Search
                    label="Title"
                    helperMessage="No results found."
                    placeholder="Placeholder"
                    invalid
                />
            </Surface>

            <Section title="Read-only">
                <Typography>
                    The value is visible and can be selected and copied, but
                    cannot be edited. Long-press to select text.
                </Typography>
                <Typography size="sm" style={styles.note}>
                    Note: on iOS, read-only mode switches to a multiline text
                    view internally to enable text selection. Long values will
                    wrap rather than truncate. This is an iOS platform
                    constraint.
                </Typography>
            </Section>
            <Surface>
                <Search
                    label="Title"
                    value="This is a read-only value."
                    readOnly
                />
            </Surface>

            <Section title="Disabled" />
            <Surface>
                <Search label="Title" placeholder="Placeholder" disabled />
            </Surface>
        </ScrollView>
    );
}

const themeStyles = EDSStyleSheet.create((token) => ({
    note: {
        color: token.colors.text.neutral.subtle,
    },
}));
