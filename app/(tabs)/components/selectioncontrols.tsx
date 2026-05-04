import { Section } from "@/components/Section";
import { Surface } from "@/components/Surface";
import {
    Checkbox,
    Radio,
    Switch,
    Typography,
    useToken,
} from "@equinor/eds-mobile-components";
import { useState } from "react";
import { ScrollView, View } from "react-native";

export default function SelectionControlsScreen() {
    const token = useToken();
    const [checkA, setCheckA] = useState(true);
    const [checkB, setCheckB] = useState(false);
    const [checkC, setCheckC] = useState(false);
    const [checkNoLabelA, setCheckNoLabelA] = useState(true);
    const [checkNoLabelB, setCheckNoLabelB] = useState(false);
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

            <Section>
                <Typography.Header size="xl">Radio Buttons</Typography.Header>
            </Section>

            <Section title="With labels">
                <Typography>
                    Radio buttons with a visible label next to the control
                </Typography>
            </Section>
            <Surface>
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
            </Surface>

            <Section title="Without visible label">
                <Typography>
                    Radio buttons without a label, using accessibilityLabel for
                    screen readers
                </Typography>
            </Section>
            <Surface>
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
            </Surface>

            <Section title="Disabled">
                <Typography>
                    Radio buttons in their disabled state, both checked and
                    unchecked
                </Typography>
            </Section>
            <Surface>
                <Radio
                    checked={false}
                    disabled
                    label="Disabled unchecked"
                />
                <Radio checked={true} disabled label="Disabled checked" />
            </Surface>

            <Section>
                <Typography.Header size="xl">Switch</Typography.Header>
            </Section>

            <Section title="Switch with Label">
                <Typography>
                    Switch with an inline label for toggling settings on and
                    off
                </Typography>
            </Section>
            <Surface>
                <Switch
                    active={switchWithLabel}
                    onChange={setSwitchWithLabel}
                    label="Enable notifications"
                />
                <Switch active={true} disabled label="Disabled option" />
            </Surface>

            <Section title="Switch without Labels">
                <Typography>
                    Switch without a label, useful when the context is provided
                    by surrounding UI
                </Typography>
            </Section>
            <Surface>
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
            </Surface>

            <Section>
                <Typography.Header size="xl">Checkboxes</Typography.Header>
            </Section>

            <Section title="With labels" />
            <Surface>
                <View accessibilityLabel="Select options">
                    <Checkbox
                        checked={checkA}
                        onPress={setCheckA}
                        label="Checked"
                    />
                    <Checkbox
                        checked={checkB}
                        onPress={setCheckB}
                        label="Unchecked"
                    />
                    <Checkbox
                        checked={checkC}
                        onPress={setCheckC}
                        indeterminate
                        label="Indeterminate"
                    />
                </View>
            </Surface>

            <Section title="Without visible label" />
            <Surface>
                <View
                    accessibilityLabel="Select options"
                    style={{
                        flexDirection: "row",
                        gap: token.newSpacing.spacing.horizontal.md,
                    }}
                >
                    <Checkbox
                        checked={checkNoLabelA}
                        onPress={setCheckNoLabelA}
                        accessibilityLabel="Option A"
                    />
                    <Checkbox
                        checked={checkNoLabelB}
                        onPress={setCheckNoLabelB}
                        accessibilityLabel="Option B"
                    />
                </View>
            </Surface>

            <Section title="Disabled" />
            <Surface>
                <View accessibilityLabel="Disabled options">
                    <Checkbox
                        checked={false}
                        disabled
                        label="Disabled unchecked"
                    />
                    <Checkbox
                        checked={true}
                        disabled
                        label="Disabled checked"
                    />
                    <Checkbox
                        indeterminate
                        disabled
                        label="Disabled indeterminate"
                    />
                </View>
            </Surface>
        </ScrollView>
    );
}
