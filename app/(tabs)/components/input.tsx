import { Section } from "@/components/Section";
import { Surface } from "@/components/Surface";
import { Icon, Input, Typography } from "@equinor/eds-mobile-components";
import { useRef, useState } from "react";
import { Pressable, ScrollView, TextInput } from "react-native";

export default function InputScreen() {
    const [value1, setValue1] = useState("");
    const [clearableValue, setClearableValue] = useState("");
    const [value3, setValue3] = useState("");
    const clearableRef = useRef<TextInput>(null);
    return (
        <ScrollView
            contentInsetAdjustmentBehavior="automatic"
            style={{ flex: 1 }}
        >
            <Section>
                <Typography variant="body.md">
                    Input fields let users enter and edit text — in forms,
                    search bars, or anywhere you need to capture user input.
                </Typography>
            </Section>

            <Section title="Basic Input" />
            <Surface>
                <Input
                    placeholder="Enter text here"
                    value={value1}
                    onChange={setValue1}
                />
            </Surface>

            <Section title="With Adornments">
                <Typography variant="body.md">
                    Use startText and endText for prefix/suffix text.
                    Use startAdornment and endAdornment for elements
                    like icons or buttons.
                </Typography>
            </Section>
            <Surface>
                <Typography>Amount with prefix and suffix text</Typography>
                <Input startText="€" endText="EUR" placeholder="Amount" />

                <Typography>With icon</Typography>
                <Input
                    startAdornment={<Icon name="magnify" size={16} />}
                    endAdornment={<Icon name="download" size={16} />}
                    placeholder="With icon"
                />

                <Typography>Search</Typography>
                <Input
                    ref={clearableRef}
                    value={clearableValue}
                    onChange={setClearableValue}
                    startAdornment={<Icon name="magnify" size={16} />}
                    endAdornment={
                        clearableValue ? (
                            <Pressable
                                onPress={() => {
                                    setClearableValue("");
                                    clearableRef.current?.focus();
                                }}
                            >
                                <Icon name="close" size={16} />
                            </Pressable>
                        ) : undefined
                    }
                    placeholder="Search"
                />

                <Typography>With unit and icon</Typography>
                <Input
                    endText="kg"
                    endAdornment={<Icon name="download" size={16} />}
                    placeholder="100"
                />
            </Surface>

            <Section title="Multiline Input" />
            <Surface>
                <Input
                    placeholder="Enter multiple lines of text"
                    value={value3}
                    onChange={setValue3}
                    multiline
                    numberOfLines={4}
                />
            </Surface>

            <Section title="Invalid State" />
            <Surface>
                <Input placeholder="Placeholder" invalid />
                <Input
                    placeholder="Invalid search"
                    invalid
                    hideErrorIcon
                    startAdornment={<Icon name="magnify" size={16} />}
                    endAdornment={<Icon name="close" size={16} />}
                />
            </Surface>

            <Section title="Read-Only Input" />
            <Surface>
                <Input
                    readOnly
                    multiline
                    value={
                        "This content is readonly and multiline so that you can select text from it!"
                    }
                />
            </Surface>

            <Section title="Disabled Input" />
            <Surface>
                <Input
                    placeholder="This input is disabled"
                    value="Cannot edit this"
                    disabled
                />
            </Surface>
        </ScrollView>
    );
}
