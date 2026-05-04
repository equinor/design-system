import { offlineBanner } from "@/codeSnippets/offlinebanner";
import { useCodeSnippet } from "@/hooks/useCodeSnippet";
import {
    OfflineBanner,
    Spacer,
    Typography,
} from "@equinor/eds-mobile-components";
import { ScrollView, View } from "react-native";

export default function OfflineBannerScreen() {
    const { ViewCode, CodeSnippetDialog } = useCodeSnippet();

    return (
        <ScrollView contentInsetAdjustmentBehavior="automatic">
            <View style={{ padding: 16 }}>
                <Typography>
                    The offline banner appears when the device loses
                    connectivity. It lets users know their changes might not
                    sync until they&apos;re back online. By default, it assumes
                    the device is offline.
                </Typography>
                <Spacer amount="large" />

                <Typography.Header size="lg">Offline State</Typography.Header>
                <Spacer amount="small" />
                <OfflineBanner isConnected={false} />
                <Spacer amount="large" />

                <Typography.Header size="lg">Online State (Hidden)</Typography.Header>
                <Spacer amount="small" />
                <OfflineBanner isConnected={true} />
                <Typography style={{ fontStyle: "italic" }}>
                    Banner is hidden when connected
                </Typography>

                <Spacer amount="small" />
                <ViewCode title="Offline Banner" code={offlineBanner} />
            </View>

            <CodeSnippetDialog />
        </ScrollView>
    );
}
