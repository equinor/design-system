import { Section } from "@/components/Section";
import {
    Radio,
    Spacer,
    Switch,
    Typography,
    useToken,
} from "@equinor/eds-mobile-components";
import { useState } from "react";
import { ScrollView, View } from "react-native";

export default function SelectionControlsScreen() {
    const token = useToken();
    const [selectedRadio, setSelectedRadio] = useState<number>(0);
    const [selectedRadioNoLabel, setSelectedRadioNoLabel] = useState<number>(0);
    const [switchActive, setSwitchActive] = useState(false);
    const [switchWithLabel, setSwitchWithLabel] = useState(true);

    return (
        <ScrollView contentInsetAdjustmentBehavior="automatic">
            <Section>
                <Typography>
                    Radio buttons and switches let users make choices — pick one
                    option from a group, or toggle a setting on and off.
                </Typography>
            </Section>

            <Spacer amount="medium" />
            <Section>
                <Typography variant="h4">Radio Buttons</Typography>
            </Section>
            <Section title="With labels">
                <Typography variant="p">
                    Radio buttons with a visible label next to the control
                </Typography>
                <View>
                    <Radio
                        checked={selectedRadio === 0}
                        onPress={() => setSelectedRadio(0)}
                        label="Option A"
                    />
                    <Radio
                        checked={selectedRadio === 1}
                        onPress={() => setSelectedRadio(1)}
                        label="Option B"
                    />
                    <Radio
                        checked={selectedRadio === 2}
                        onPress={() => setSelectedRadio(2)}
                        label="Option C"
                    />
                </View>
            </Section>
            <Section title="Without visible label">
                <Typography variant="p">
                    Radio buttons without a label, using accessibilityLabel for
                    screen readers
                </Typography>
                <View
                    style={{
                        flexDirection: "row",
                        gap: token.newSpacing.spacing.horizontal.md,
                    }}
                >
                    <Radio
                        checked={selectedRadioNoLabel === 0}
                        onPress={() => setSelectedRadioNoLabel(0)}
                        accessibilityLabel="Option D"
                    />
                    <Radio
                        checked={selectedRadioNoLabel === 1}
                        onPress={() => setSelectedRadioNoLabel(1)}
                        accessibilityLabel="Option E"
                    />
                </View>
            </Section>
            <Section title="Disabled">
                <Typography variant="p">
                    Radio buttons in their disabled state, both checked and
                    unchecked
                </Typography>
                <View>
                    <Radio
                        checked={false}
                        disabled
                        label="Disabled unchecked"
                    />
                    <Radio checked={true} disabled label="Disabled checked" />
                </View>
            </Section>

            <Section>
                <Typography variant="h4">Switch</Typography>
            </Section>

            <Section title="Switch with Label">
                <Typography variant="p">
                    Switch with an inline label for toggling settings on and
                    off
                </Typography>
                <View>
                    <Switch
                        active={switchWithLabel}
                        onChange={setSwitchWithLabel}
                        label="Enable notifications"
                    />
                    <Switch active={true} disabled label="Disabled option" />
                </View>
            </Section>

            <Section title="Switch without Labels">
                <Typography variant="p">
                    Switch without a label, useful when the context is provided
                    by surrounding UI
                </Typography>
                <View
                    style={{
                        flexDirection: "row",
                        gap: token.newSpacing.spacing.horizontal.xl,
                        alignItems: "center",
                    }}
                >
                    <Switch active={switchActive} onChange={setSwitchActive} />
                    <Switch active={false} disabled />
                </View>
            </Section>
        </ScrollView>
    );
}
