import { horizontalSpacer, verticalSpacer } from "@/codeSnippets/spacer";
import { useCodeSnippet } from "@/hooks/useCodeSnippet";
import { Paper, Spacer, Typography } from "@equinor/eds-mobile-components";
import { ScrollView, View } from "react-native";

export default function SpacerScreen() {
    const { ViewCode, CodeSnippetDialog } = useCodeSnippet();

    return (
        <ScrollView style={{ flex: 1 }}>
            <View style={{ padding: 16 }}>
                <Typography variant="h5">Spacer</Typography>
                <Spacer amount="small" />
                <Typography variant="p">
                    Spacers add consistent vertical or horizontal spacing
                    between elements — a handy alternative to manual margins
                    that keeps layouts predictable.
                </Typography>
                <View style={{ height: 24 }} />

                <Typography variant="h6">Vertical Spacing</Typography>
                <View style={{ height: 16 }} />

                <Paper elevation="raised">
                    <View style={{ padding: 16 }}>
                        <Typography variant="p">
                            Small spacer below (8px)
                        </Typography>
                        <View style={{ height: 8 }} />
                        <View style={{ height: 2, backgroundColor: "#ccc" }} />
                    </View>
                </Paper>

                <View style={{ height: 16 }} />

                <Paper elevation="raised">
                    <View style={{ padding: 16 }}>
                        <Typography variant="p">
                            Medium spacer below (16px)
                        </Typography>
                        <View style={{ height: 16 }} />
                        <View style={{ height: 2, backgroundColor: "#ccc" }} />
                    </View>
                </Paper>

                <View style={{ height: 16 }} />

                <Paper elevation="raised">
                    <View style={{ padding: 16 }}>
                        <Typography variant="p">
                            Large spacer below (24px)
                        </Typography>
                        <View style={{ height: 24 }} />
                        <View style={{ height: 2, backgroundColor: "#ccc" }} />
                    </View>
                </Paper>

                <ViewCode title="Vertical Spacer" code={verticalSpacer} />
                <View style={{ height: 24 }} />

                <Typography variant="h5">Horizontal Spacing</Typography>
                <View style={{ height: 16 }} />

                <Paper elevation="raised">
                    <View
                        style={{
                            padding: 16,
                            flexDirection: "row",
                            alignItems: "center",
                        }}
                    >
                        <Typography variant="p">8px</Typography>
                        <View style={{ width: 8 }} />
                        <View
                            style={{
                                width: 2,
                                height: 20,
                                backgroundColor: "#ccc",
                            }}
                        />
                        <View style={{ width: 16 }} />
                        <Typography variant="p">16px</Typography>
                        <View style={{ width: 24 }} />
                        <View
                            style={{
                                width: 2,
                                height: 20,
                                backgroundColor: "#ccc",
                            }}
                        />
                        <View style={{ width: 24 }} />
                        <Typography variant="p">24px</Typography>
                    </View>
                </Paper>

                <ViewCode title="Horizontal Spacer" code={horizontalSpacer} />
                <View style={{ height: 24 }} />

                <Typography variant="h5">Spacing Amounts</Typography>
                <View style={{ height: 16 }} />
                <Typography variant="p">
                    • Small: 8px{" \n"}• Medium: 16px (default){" \n"}• Large:
                    24px
                </Typography>

                <CodeSnippetDialog />
            </View>
        </ScrollView>
    );
}
