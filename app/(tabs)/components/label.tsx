import { basicLabel, labelWithMeta } from "@/codeSnippets/label";
import { useCodeSnippet } from "@/hooks/useCodeSnippet";
import { Label, Typography } from "@equinor/eds-mobile-components";
import { ScrollView, StyleSheet, View } from "react-native";

export default function LabelScreen() {
    const { ViewCode, CodeSnippetDialog } = useCodeSnippet();

    return (
        <ScrollView contentInsetAdjustmentBehavior="automatic">
            <View style={styles.section}>
                <Typography>
                    Labels identify form fields and other inputs. They can
                    include optional meta text to indicate whether a field is
                    required or optional.
                </Typography>
            </View>

            <View style={styles.section}>
                <Typography.Header size="lg">Basic Labels</Typography.Header>

                <View style={styles.labelContainer}>
                    <Label label="Default Label" />
                    <Label label="Another Label" />
                    <Label label="Third Label" />
                </View>

                <ViewCode title="Basic Label" code={basicLabel} />
            </View>

            <View style={styles.section}>
                <Typography.Header size="lg">Labels with Meta Text</Typography.Header>

                <View style={styles.labelContainer}>
                    <Label label="Email Address" meta="Required" />
                    <Label label="Phone Number" meta="Optional" />
                    <Label label="Company Name" />
                </View>

                <ViewCode title="Label with Meta" code={labelWithMeta} />
            </View>

            <View style={styles.section}>
                <Typography.Header size="lg">Labels with Form Fields</Typography.Header>

                <View style={styles.labelContainer}>
                    <View>
                        <Label label="First Name" meta="Required" />
                        <Typography>John</Typography>
                    </View>
                    <View>
                        <Label label="Last Name" meta="Required" />
                        <Typography>Doe</Typography>
                    </View>
                    <View>
                        <Label label="Email" meta="Optional" />
                        <Typography>
                            john.doe@example.com
                        </Typography>
                    </View>
                </View>
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
    labelContainer: {
        gap: 12,
    },
});
