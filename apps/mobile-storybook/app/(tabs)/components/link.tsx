import { Section } from "@/components/Section";
import { Surface } from "@/components/Surface";
import { Link, Typography } from "@equinor/eds-mobile-components";
import { Linking, ScrollView } from "react-native";
import { useState } from "react";

const GITHUB_URL = "https://github.com/equinor/design-system-mobile";
const DOCS_URL = "https://eds.equinor.com/docs/Next/components/navigation/link";

export default function LinkScreen() {
    const [visited, setVisited] = useState({
        default: false,
        external: false,
        xs: false, sm: false, md: false, lg: false, xl: false,
        inline: false,
    });
    const markVisited = (key: keyof typeof visited) =>
        setVisited(prev => ({ ...prev, [key]: true }));

    return (
        <ScrollView contentInsetAdjustmentBehavior="automatic">
            <Section>
                <Typography>
                    Link is a pressable text element for navigation and
                    external URLs. Use it standalone as a CTA or inline
                    within a sentence. It supports a visited state that
                    the consumer tracks — press any example below to see it.
                </Typography>
            </Section>

            <Section title="Default" />
            <Surface>
                <Link onPress={() => markVisited("default")} visited={visited.default}>
                    Open documentation
                </Link>
            </Surface>

            <Section title="External Link">
                <Typography>
                    Use the external prop to indicate the link opens outside
                    the app.
                </Typography>
            </Section>
            <Surface>
                <Link
                    onPress={() => {
                        markVisited("external");
                        Linking.openURL(GITHUB_URL).catch((e) => console.warn("Failed to open URL", e));
                    }}
                    external
                    visited={visited.external}
                >
                    View on GitHub
                </Link>
            </Surface>

            <Section title="Sizes">
                <Typography>
                    Size matches the Typography UI scale. Use this to align a
                    link with surrounding text.
                </Typography>
            </Section>
            <Surface>
                <Link onPress={() => markVisited("xs")} size="xs" visited={visited.xs}>Extra small</Link>
                <Link onPress={() => markVisited("sm")} size="sm" visited={visited.sm}>Small</Link>
                <Link onPress={() => markVisited("md")} size="md" visited={visited.md}>Medium (default)</Link>
                <Link onPress={() => markVisited("lg")} size="lg" visited={visited.lg}>Large</Link>
                <Link onPress={() => markVisited("xl")} size="xl" visited={visited.xl}>Extra large</Link>
            </Surface>

            <Section title="Inline usage">
                <Typography>
                    Use variant=&quot;inline&quot; to embed a link inside a sentence.
                    It renders as a Text element so it sits naturally alongside
                    other text.
                </Typography>
            </Section>
            <Surface>
                <Typography>
                    Read the{" "}
                    <Link
                        variant="inline"
                        size="lg"
                        onPress={() => {
                            markVisited("inline");
                            Linking.openURL(DOCS_URL).catch((e) => console.warn("Failed to open URL", e));
                        }}
                        visited={visited.inline}
                    >
                        full documentation
                    </Link>
                    {" "}for more details.
                </Typography>
            </Surface>
        </ScrollView>
    );
}
