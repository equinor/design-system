import { scrollableAndDisabledTabs, tabsWithIcons } from "@/codeSnippets/tabs";
import { useCodeSnippet } from "@/hooks/useCodeSnippet";
import { Spacer, Tabs, Typography } from "@equinor/eds-mobile-components";
import { ScrollView, View } from "react-native";

export default function TabsScreen() {
    const { ViewCode, CodeSnippetDialog } = useCodeSnippet();

    return (
        <ScrollView style={{ flex: 1 }}>
            <View style={{ padding: 16 }}>
                <Typography variant="h5">Tabs</Typography>
                <Spacer amount="small" />

                <Typography variant="p">
                    Tabs organise content into separate views where only one is
                    visible at a time. They&apos;re ideal for switching between
                    related sections without leaving the screen.
                </Typography>
                <Spacer amount="large" />

                <Typography variant="h6">Basic Tabs</Typography>
                <Spacer amount="small" />
                <Tabs initialActiveIndex={0}>
                    <Tabs.Tab title="First Tab">
                        <View style={{ padding: 16 }}>
                            <Typography variant="p">
                                Content for the first tab
                            </Typography>
                        </View>
                    </Tabs.Tab>
                    <Tabs.Tab title="Second Tab">
                        <View style={{ padding: 16 }}>
                            <Typography variant="p">
                                Content for the second tab
                            </Typography>
                        </View>
                    </Tabs.Tab>
                    <Tabs.Tab title="Third Tab">
                        <View style={{ padding: 16 }}>
                            <Typography variant="p">
                                Content for the third tab
                            </Typography>
                        </View>
                    </Tabs.Tab>
                </Tabs>
                <Spacer amount="large" />

                <Typography variant="h5">Tabs with Icons</Typography>
                <Spacer amount="small" />
                <Tabs initialActiveIndex={1}>
                    <Tabs.Tab title="Home" iconName="home">
                        <View style={{ padding: 16 }}>
                            <Typography variant="p">Home content</Typography>
                        </View>
                    </Tabs.Tab>
                    <Tabs.Tab title="Search" iconName="magnify">
                        <View style={{ padding: 16 }}>
                            <Typography variant="p">Search content</Typography>
                        </View>
                    </Tabs.Tab>
                    <Tabs.Tab title="Settings" iconName="cog">
                        <View style={{ padding: 16 }}>
                            <Typography variant="p">
                                Settings content
                            </Typography>
                        </View>
                    </Tabs.Tab>
                </Tabs>

                <ViewCode title="Tabs with Icons" code={tabsWithIcons} />
                <Spacer amount="large" />

                <Typography variant="h5">Scrollable Tabs</Typography>
                <Spacer amount="small" />
                <Tabs scrollable initialActiveIndex={0}>
                    <Tabs.Tab title="Tab One">
                        <View style={{ padding: 16 }}>
                            <Typography variant="p">
                                Content for tab one
                            </Typography>
                        </View>
                    </Tabs.Tab>
                    <Tabs.Tab title="Tab Two">
                        <View style={{ padding: 16 }}>
                            <Typography variant="p">
                                Content for tab two
                            </Typography>
                        </View>
                    </Tabs.Tab>
                    <Tabs.Tab title="Tab Three">
                        <View style={{ padding: 16 }}>
                            <Typography variant="p">
                                Content for tab three
                            </Typography>
                        </View>
                    </Tabs.Tab>
                    <Tabs.Tab title="Tab Four">
                        <View style={{ padding: 16 }}>
                            <Typography variant="p">
                                Content for tab four
                            </Typography>
                        </View>
                    </Tabs.Tab>
                    <Tabs.Tab title="Tab Five">
                        <View style={{ padding: 16 }}>
                            <Typography variant="p">
                                Content for tab five
                            </Typography>
                        </View>
                    </Tabs.Tab>
                </Tabs>
                <Spacer amount="large" />

                <Typography variant="h5">Disabled Tab</Typography>
                <Spacer amount="small" />
                <Tabs initialActiveIndex={0}>
                    <Tabs.Tab title="Active">
                        <View style={{ padding: 16 }}>
                            <Typography variant="p">
                                Active tab content
                            </Typography>
                        </View>
                    </Tabs.Tab>
                    <Tabs.Tab title="Disabled" disabled>
                        <View style={{ padding: 16 }}>
                            <Typography variant="p">
                                This content will not be accessible
                            </Typography>
                        </View>
                    </Tabs.Tab>
                    <Tabs.Tab title="Another">
                        <View style={{ padding: 16 }}>
                            <Typography variant="p">
                                Another tab content
                            </Typography>
                        </View>
                    </Tabs.Tab>
                </Tabs>

                <ViewCode
                    title="Scrollable & Disabled Tabs"
                    code={scrollableAndDisabledTabs}
                />
            </View>

            <CodeSnippetDialog />
        </ScrollView>
    );
}
