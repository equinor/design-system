import { scrollableAndDisabledTabs, tabsWithIcons } from "@/codeSnippets/tabs";
import { useCodeSnippet } from "@/hooks/useCodeSnippet";
import { Spacer, Tabs, Typography } from "@equinor/eds-mobile-components";
import { ScrollView, View } from "react-native";

export default function TabsScreen() {
    const { ViewCode, CodeSnippetDialog } = useCodeSnippet();

    return (
        <ScrollView style={{ flex: 1 }}>
            <View style={{ padding: 16 }}>
                <Typography.Header size="xl">Tabs</Typography.Header>
                <Spacer amount="small" />

                <Typography>
                    Tabs organise content into separate views where only one is
                    visible at a time. They&apos;re ideal for switching between
                    related sections without leaving the screen.
                </Typography>
                <Spacer amount="large" />

                <Typography.Header size="lg">Basic Tabs</Typography.Header>
                <Spacer amount="small" />
                <Tabs initialActiveIndex={0}>
                    <Tabs.Tab title="First Tab">
                        <View style={{ padding: 16 }}>
                            <Typography>
                                Content for the first tab
                            </Typography>
                        </View>
                    </Tabs.Tab>
                    <Tabs.Tab title="Second Tab">
                        <View style={{ padding: 16 }}>
                            <Typography>
                                Content for the second tab
                            </Typography>
                        </View>
                    </Tabs.Tab>
                    <Tabs.Tab title="Third Tab">
                        <View style={{ padding: 16 }}>
                            <Typography>
                                Content for the third tab
                            </Typography>
                        </View>
                    </Tabs.Tab>
                </Tabs>
                <Spacer amount="large" />

                <Typography.Header size="xl">Tabs with Icons</Typography.Header>
                <Spacer amount="small" />
                <Tabs initialActiveIndex={1}>
                    <Tabs.Tab title="Home" iconName="home">
                        <View style={{ padding: 16 }}>
                            <Typography>Home content</Typography>
                        </View>
                    </Tabs.Tab>
                    <Tabs.Tab title="Search" iconName="magnify">
                        <View style={{ padding: 16 }}>
                            <Typography>Search content</Typography>
                        </View>
                    </Tabs.Tab>
                    <Tabs.Tab title="Settings" iconName="cog">
                        <View style={{ padding: 16 }}>
                            <Typography>
                                Settings content
                            </Typography>
                        </View>
                    </Tabs.Tab>
                </Tabs>

                <ViewCode title="Tabs with Icons" code={tabsWithIcons} />
                <Spacer amount="large" />

                <Typography.Header size="xl">Scrollable Tabs</Typography.Header>
                <Spacer amount="small" />
                <Tabs scrollable initialActiveIndex={0}>
                    <Tabs.Tab title="Tab One">
                        <View style={{ padding: 16 }}>
                            <Typography>
                                Content for tab one
                            </Typography>
                        </View>
                    </Tabs.Tab>
                    <Tabs.Tab title="Tab Two">
                        <View style={{ padding: 16 }}>
                            <Typography>
                                Content for tab two
                            </Typography>
                        </View>
                    </Tabs.Tab>
                    <Tabs.Tab title="Tab Three">
                        <View style={{ padding: 16 }}>
                            <Typography>
                                Content for tab three
                            </Typography>
                        </View>
                    </Tabs.Tab>
                    <Tabs.Tab title="Tab Four">
                        <View style={{ padding: 16 }}>
                            <Typography>
                                Content for tab four
                            </Typography>
                        </View>
                    </Tabs.Tab>
                    <Tabs.Tab title="Tab Five">
                        <View style={{ padding: 16 }}>
                            <Typography>
                                Content for tab five
                            </Typography>
                        </View>
                    </Tabs.Tab>
                </Tabs>
                <Spacer amount="large" />

                <Typography.Header size="xl">Disabled Tab</Typography.Header>
                <Spacer amount="small" />
                <Tabs initialActiveIndex={0}>
                    <Tabs.Tab title="Active">
                        <View style={{ padding: 16 }}>
                            <Typography>
                                Active tab content
                            </Typography>
                        </View>
                    </Tabs.Tab>
                    <Tabs.Tab title="Disabled" disabled>
                        <View style={{ padding: 16 }}>
                            <Typography>
                                This content will not be accessible
                            </Typography>
                        </View>
                    </Tabs.Tab>
                    <Tabs.Tab title="Another">
                        <View style={{ padding: 16 }}>
                            <Typography>
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
