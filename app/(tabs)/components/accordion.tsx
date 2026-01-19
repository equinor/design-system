import {
    accordionDefaultOpen,
    basicAccordion,
    chevronAndDisabled,
} from "@/codeSnippets/accordion";
import { Section } from "@/components/Section";
import { useCodeSnippet } from "@/hooks/useCodeSnippet";
import { Accordion, Radio, Typography } from "@equinor/eds-mobile-components";
import { useState } from "react";
import { ScrollView, StyleSheet, View } from "react-native";

export default function AccordionScreen() {
    const [selectedOption, setSelectedOption] = useState<number>(0);
    const { ViewCode, CodeSnippetDialog } = useCodeSnippet();

    return (
        <ScrollView contentInsetAdjustmentBehavior="automatic">
            <Section>
                <Typography>
                    Accordions tuck content away until it&apos;s needed —
                    perfect for keeping screens tidy while still giving users
                    access to all the details.
                </Typography>
            </Section>

            <Section title="Basic Accordion">
                <Typography>
                    Tap to expand, tap again to collapse. Simple! Works well for
                    FAQs, settings, or any content you want to group together.
                </Typography>
            </Section>

            <Accordion>
                <Accordion.Item title="First Item">
                    <Typography>
                        This is the content of the first accordion item. You can
                        put any content here.
                    </Typography>
                </Accordion.Item>

                <Accordion.Item title="Second Item">
                    <Typography>
                        This accordion demonstrates a list of items:
                    </Typography>
                    <View style={styles.list}>
                        <Typography>• First list item</Typography>
                        <Typography>• Second list item</Typography>
                        <Typography>• Third list item</Typography>
                        <Typography>• Fourth list item</Typography>
                    </View>
                </Accordion.Item>

                <Accordion.Item title="Third Item">
                    <Typography>
                        You can also have a group of radio buttons within the
                        accordion
                    </Typography>
                    <View style={styles.radioGroup}>
                        <View style={styles.radioOption}>
                            <Radio
                                checked={selectedOption === 0}
                                onPress={() => setSelectedOption(0)}
                                color="primary"
                            />
                            <Typography>Option 1</Typography>
                        </View>
                        <View style={styles.radioOption}>
                            <Radio
                                checked={selectedOption === 1}
                                onPress={() => setSelectedOption(1)}
                                color="primary"
                            />
                            <Typography>Option 2</Typography>
                        </View>
                        <View style={styles.radioOption}>
                            <Radio
                                checked={selectedOption === 2}
                                onPress={() => setSelectedOption(2)}
                                color="primary"
                            />
                            <Typography>Option 3</Typography>
                        </View>
                    </View>
                </Accordion.Item>
            </Accordion>
            <ViewCode title="Basic Accordion" code={basicAccordion} />

            <Section title="Default open">
                <Typography>
                    Sometimes you want content visible right away — just set it
                    to open by default and users see it straight off.
                </Typography>
            </Section>

            <Accordion>
                <Accordion.Item title="Expanded by Default" defaultOpen>
                    <Typography>
                        This item is expanded by default using the defaultOpen
                        prop.
                    </Typography>
                </Accordion.Item>
            </Accordion>
            <ViewCode
                title="Accordion with Default Open"
                code={accordionDefaultOpen}
            />

            <Section title="Other options">
                <Typography variant="p">
                    You can move the chevron to the right for a different
                    layout. If some content isn&apos;t ready yet, disable the
                    item to let users know.
                </Typography>
            </Section>
            <Accordion>
                <Accordion.Item title="Item A" chevronPosition="right">
                    <Typography variant="p">Content for Item A</Typography>
                </Accordion.Item>
            </Accordion>

            <Accordion>
                <Accordion.Item
                    title="This accordion is disabled"
                    chevronPosition="right"
                    disabled
                />
            </Accordion>
            <ViewCode
                title="Chevron Position & Disabled"
                code={chevronAndDisabled}
            />

            <CodeSnippetDialog />
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    section: {
        padding: 16,
        gap: 16,
    },
    list: {
        marginTop: 8,
        gap: 4,
    },
    radioGroup: {
        marginTop: 12,
        gap: 12,
    },
    radioOption: {
        flexDirection: "row",
        alignItems: "center",
        gap: 8,
    },
});
