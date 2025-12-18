import { radioButtons, switchControl } from "@/codeSnippets/selectioncontrols";
import { useCodeSnippet } from "@/hooks/useCodeSnippet";
import {
    Popover,
    Radio,
    Spacer,
    Switch,
    Typography,
} from "@equinor/eds-mobile-components";
import { useRef, useState } from "react";
import { ScrollView, View } from "react-native";

export default function SelectionControlsScreen() {
    const [selectedRadio, setSelectedRadio] = useState<number>(0);
    const [switchActive, setSwitchActive] = useState(false);
    const [switchSecondaryActive, setSwitchSecondaryActive] = useState(true);
    const [switchDangerActive, setSwitchDangerActive] = useState(true);
    const [smallSwitchActive, setSmallSwitchActive] = useState(true);
    const [secondSmallSwitchActive, setSecondSmallSwitchActive] =
        useState(true);
    const [popoverOpen, setPopoverOpen] = useState(false);
    const switchRef = useRef<View>(null);
    const { ViewCode, CodeSnippetDialog } = useCodeSnippet();

    return (
        <ScrollView style={{ flex: 1 }}>
            <View style={{ padding: 16 }}>
                <Typography variant="h5">Selection Controls</Typography>
                <Spacer amount="small" />

                <Typography variant="p">
                    Radio buttons and switches let users make choices — pick one
                    option from a group, or toggle a setting on and off.
                </Typography>
                <Spacer amount="large" />

                <Typography variant="h5">Radio Buttons</Typography>
                <Spacer amount="small" />
                <View
                    style={{
                        flexDirection: "row",
                        gap: 16,
                        alignItems: "center",
                    }}
                >
                    <Radio
                        checked={selectedRadio === 0}
                        onPress={() => setSelectedRadio(0)}
                        color="primary"
                    />
                    <Radio
                        checked={selectedRadio === 1}
                        onPress={() => setSelectedRadio(1)}
                        color="secondary"
                    />
                    <Radio
                        checked={selectedRadio === 2}
                        onPress={() => setSelectedRadio(2)}
                        color="success"
                    />
                    <Radio
                        checked={selectedRadio === 3}
                        onPress={() => setSelectedRadio(3)}
                        color="warning"
                    />
                    <Radio
                        checked={selectedRadio === 4}
                        onPress={() => setSelectedRadio(4)}
                        color="danger"
                    />
                    <Radio checked={true} disabled color="primary" />
                </View>

                <ViewCode title="Radio Buttons" code={radioButtons} />
                <Spacer amount="large" />

                <Typography variant="h5">Switch</Typography>
                <Spacer amount="small" />
                <Typography variant="p">
                    Primary and Secondary colors
                </Typography>
                <Spacer amount="small" />
                <View
                    style={{
                        flexDirection: "row",
                        gap: 48,
                        alignItems: "center",
                    }}
                >
                    <View>
                        <Switch
                            active={switchActive}
                            onChange={setSwitchActive}
                            color="primary"
                        />
                    </View>
                    <View>
                        <Switch
                            active={switchSecondaryActive}
                            onChange={setSwitchSecondaryActive}
                            color="secondary"
                        />
                    </View>
                </View>
                <Spacer amount="large" />

                <Typography variant="p">Danger and Disabled</Typography>
                <Spacer amount="small" />
                <View
                    style={{
                        flexDirection: "row",
                        gap: 48,
                        alignItems: "center",
                    }}
                >
                    <View>
                        <Switch
                            active={switchDangerActive}
                            onChange={setSwitchDangerActive}
                            color="danger"
                        />
                    </View>
                    <View>
                        <Switch active={true} disabled color="primary" />
                    </View>
                </View>
                <Spacer amount="large" />
                <Typography variant="h5">Small Switch</Typography>
                <Spacer amount="small" />
                <Typography variant="p">
                    Primary and Secondary colors
                </Typography>

                <Spacer amount="medium" />
                <View
                    style={{
                        flexDirection: "row",
                        gap: 16,
                        alignItems: "center",
                    }}
                >
                    <Switch.Small
                        active={smallSwitchActive}
                        onChange={setSmallSwitchActive}
                    />

                    <Switch.Small active={true} disabled />
                </View>
                <Spacer amount="large" />
                <Typography variant="p">Small Switch with Popover</Typography>
                <Spacer amount="medium" />
                <View
                    style={{
                        flexDirection: "row",
                        gap: 16,
                        alignItems: "center",
                    }}
                >
                    <View ref={switchRef}>
                        <Switch.Small
                            active={secondSmallSwitchActive}
                            onChange={(active) => {
                                setSecondSmallSwitchActive(active);
                                setPopoverOpen(true);
                            }}
                        />
                    </View>
                </View>

                <ViewCode title="Switch Control" code={switchControl} />

                <Popover
                    anchorEl={switchRef as React.RefObject<View>}
                    open={popoverOpen}
                    onClose={() => setPopoverOpen(false)}
                    placement="top"
                >
                    <View>
                        <Typography variant="p">
                            Switch is now{" "}
                            {secondSmallSwitchActive ? "ON" : "OFF"}
                        </Typography>
                    </View>
                </Popover>
            </View>

            <CodeSnippetDialog />
        </ScrollView>
    );
}
