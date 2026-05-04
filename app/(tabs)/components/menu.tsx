import { basicMenu, menuWithIcons } from "@/codeSnippets/menu";
import { useCodeSnippet } from "@/hooks/useCodeSnippet";
import { Button, Menu, Typography } from "@equinor/eds-mobile-components";
import { useRef, useState } from "react";
import { ScrollView, StyleSheet, View } from "react-native";

export default function MenuScreen() {
    const [menuOpen1, setMenuOpen1] = useState(false);
    const [menuOpen2, setMenuOpen2] = useState(false);
    const [selectedToggleButton, setSelectedToggleButton] =
        useState<boolean>(false);
    const [secondMenuOpen, setSecondMenuOpen] = useState<boolean>(false);

    const secondButtonRef = useRef<View>(null);
    const anchorRef1 = useRef<View>(null);
    const anchorRef2 = useRef<View>(null);
    const { ViewCode, CodeSnippetDialog } = useCodeSnippet();

    return (
        <ScrollView contentInsetAdjustmentBehavior="automatic">
            <View style={styles.section}>
                <Typography>
                    Menus display a list of choices on a temporary surface —
                    handy for actions that don&apos;t need to be visible all the
                    time.
                </Typography>
            </View>

            <View style={styles.section}>
                <Typography.Header size="lg">Basic Menu</Typography.Header>

                <View ref={anchorRef1}>
                    <Button
                        label="Open Menu"
                        onPress={() => setMenuOpen1(true)}
                    />
                </View>

                <Menu
                    anchorEl={anchorRef1}
                    open={menuOpen1}
                    onClose={() => setMenuOpen1(false)}
                >
                    <Menu.Item
                        onPress={() => setMenuOpen1(false)}
                        title="Option 1"
                    />
                    <Menu.Item
                        onPress={() => setMenuOpen1(false)}
                        title="Option 2"
                    />
                    <Menu.Item
                        onPress={() => setMenuOpen1(false)}
                        title="Option 3"
                    />
                </Menu>

                <ViewCode title="Basic Menu" code={basicMenu} />
            </View>

            <View style={styles.section}>
                <Typography.Header size="lg">Menu with Icons</Typography.Header>

                <View ref={anchorRef2}>
                    <Button
                        label="Open Menu with Icons"
                        onPress={() => setMenuOpen2(true)}
                    />
                </View>

                <Menu
                    anchorEl={anchorRef2}
                    open={menuOpen2}
                    onClose={() => setMenuOpen2(false)}
                >
                    <Menu.Item
                        onPress={() => setMenuOpen2(false)}
                        title="We can add icons"
                        iconName="face-man"
                    />
                    <Menu.Item
                        onPress={() => setMenuOpen2(false)}
                        title="Delete"
                        iconName="delete"
                    />
                    <Menu.Item
                        onPress={() => setMenuOpen2(false)}
                        title="Share"
                        iconName="share"
                    />
                </Menu>

                <ViewCode title="Menu with Icons" code={menuWithIcons} />
            </View>

            <View style={styles.section}>
                <Typography.Header size="lg">Other Menus</Typography.Header>
                <View ref={secondButtonRef}>
                    <Button
                        label="Other Menu Options"
                        onPress={() => setSecondMenuOpen(true)}
                    />
                </View>

                <Menu
                    anchorEl={secondButtonRef}
                    open={secondMenuOpen}
                    onClose={() => setSecondMenuOpen(false)}
                >
                    <Menu.Item title="This is a disabled item" disabled />
                    <Menu.Item title="Active item" active />
                    <Menu.Item
                        title={
                            selectedToggleButton
                                ? "We can have radio buttons"
                                : "Inside of the menu"
                        }
                        active={selectedToggleButton}
                        closeMenuOnClick={false}
                        iconName={
                            selectedToggleButton
                                ? "radiobox-marked"
                                : "radiobox-blank"
                        }
                        onPress={() =>
                            setSelectedToggleButton((state) => !state)
                        }
                    />
                </Menu>
            </View>

            <CodeSnippetDialog />
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    section: {
        padding: 16,
        gap: 16,
    },
});
