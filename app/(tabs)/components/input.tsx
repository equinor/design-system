import { basicInput, inputWithAdornments } from "@/codeSnippets/input";
import { useCodeSnippet } from "@/hooks/useCodeSnippet";
import {
    Icon,
    Input,
    Spacer,
    Typography,
} from "@equinor/eds-mobile-components";
import { useState } from "react";
import { ScrollView, StyleSheet, View } from "react-native";

export default function InputScreen() {
    const [value1, setValue1] = useState("");
    const [value3, setValue3] = useState("");
    const { ViewCode, CodeSnippetDialog } = useCodeSnippet();

    return (
        <ScrollView contentInsetAdjustmentBehavior="automatic">
            <View style={styles.section}>
                <Typography variant="p">
                    Input fields let users enter and edit text — in forms,
                    search bars, or anywhere you need to capture user input.
                </Typography>
            </View>

            <View style={styles.section}>
                <Typography variant="h6">Basic Input</Typography>

                <View style={styles.inputContainer}>
                    <Input
                        placeholder="Enter text here"
                        value={value1}
                        onChange={setValue1}
                    />
                </View>

                <ViewCode title="Basic Input" code={basicInput} />
            </View>

            <View style={styles.section}>
                <Spacer amount="small" />
                <Typography>
                    You can add left adornments to the input field
                </Typography>
                <Input
                    leftAdornments={
                        <View
                            style={{
                                justifyContent: "center",
                                alignItems: "center",
                            }}
                        >
                            <Icon name="face-agent" />
                        </View>
                    }
                    placeholder="Anything goes here"
                />

                <Spacer amount="small" />
                <Typography>Right adornments</Typography>
                <Input
                    rightAdornments={
                        <View
                            style={{
                                justifyContent: "center",
                                alignItems: "center",
                                flexDirection: "row",
                                width: 100,
                                backgroundColor: "gray",
                                gap: 8,
                            }}
                        >
                            <Icon name="face-man" color="#FFFFFF" />
                            <Icon name="face-woman" color="#FFFFFF" />
                            <Icon name="face-mask" color="#FFFFFF" />
                        </View>
                    }
                    placeholder="Anything goes here"
                ></Input>
                <Spacer amount="small" />

                <ViewCode
                    title="Input with Adornments"
                    code={inputWithAdornments}
                />
            </View>

            <View style={styles.section}>
                <Typography variant="h6">Multiline Input</Typography>

                <View style={styles.inputContainer}>
                    <Input
                        placeholder="Enter multiple lines of text"
                        value={value3}
                        onChange={setValue3}
                        multiline
                        numberOfLines={4}
                    />
                </View>
            </View>

            <View style={styles.section}>
                <Typography variant="h6">Input with Variants</Typography>
                <View style={styles.inputContainer}>
                    <Input placeholder="Placeholder danger" variant="danger" />
                    <Spacer />
                    <Input
                        placeholder="Placeholder warning"
                        variant="warning"
                    />
                    <Spacer />
                    <Input
                        placeholder="Placeholder success"
                        variant="success"
                    />
                </View>
            </View>

            <View style={styles.section}>
                <Typography variant="h6">Read-Only Input</Typography>
                <View style={styles.inputContainer}>
                    <Input
                        readOnly
                        multiline
                        value={
                            "This content is readonly and multiline so that you can select text from it!"
                        }
                    />
                </View>
            </View>
            <View style={styles.section}>
                <Typography variant="h6">Disabled Input</Typography>
                <Input
                    placeholder="This input is disabled"
                    value="Cannot edit this"
                    readOnly={true}
                />
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
    inputContainer: {
        gap: 8,
    },
});
