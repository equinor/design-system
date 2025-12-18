import { environmentBanner } from "@/codeSnippets/environment";
import { useCodeSnippet } from "@/hooks/useCodeSnippet";
import {
    EnvironmentBanner,
    EnvironmentProvider,
    Typography,
} from "@equinor/eds-mobile-components";
import { ScrollView, StyleSheet, View } from "react-native";

export default function EnvironmentScreen() {
    const { ViewCode, CodeSnippetDialog } = useCodeSnippet();

    return (
        <ScrollView style={styles.container}>
            <View style={styles.section}>
                <Typography variant="h5">Environment Banners</Typography>
                <Typography variant="p">
                    Environment banners indicate which environment the app is
                    running in. They help prevent accidental changes in
                    production by making the current environment clearly
                    visible.
                </Typography>
            </View>

            <View style={styles.section}>
                <Typography variant="h6">Development Environment</Typography>
                <EnvironmentProvider currentEnvironment="dev">
                    <View style={styles.bannerContainer}>
                        <EnvironmentBanner />
                    </View>
                </EnvironmentProvider>
            </View>

            <View style={styles.section}>
                <Typography variant="h5">Test Environment</Typography>
                <EnvironmentProvider currentEnvironment="test">
                    <View style={styles.bannerContainer}>
                        <EnvironmentBanner />
                    </View>
                </EnvironmentProvider>
            </View>

            <View style={styles.section}>
                <Typography variant="h5">Q&A Environment</Typography>
                <EnvironmentProvider currentEnvironment="qa">
                    <View style={styles.bannerContainer}>
                        <EnvironmentBanner />
                    </View>
                </EnvironmentProvider>
            </View>

            <ViewCode title="Environment Banner" code={environmentBanner} />

            <CodeSnippetDialog />
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    section: {
        padding: 16,
        gap: 12,
    },
    bannerContainer: {
        width: "100%",
    },
});
