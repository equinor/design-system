import { basicSelect, multiSelect } from "@/codeSnippets/select";
import { useCodeSnippet } from "@/hooks/useCodeSnippet";
import { Select, Spacer, Typography } from "@equinor/eds-mobile-components";
import { useState } from "react";
import { LogBox, ScrollView, StyleSheet, View } from "react-native";

// Suppress Reanimated warning
LogBox.ignoreLogs([
    "Reading from `value` during component render",
    "Reanimated 2",
]);

type Fruit = {
    id: string;
    name: string;
};

type Country = {
    code: string;
    name: string;
};

const fruits = [
    { title: "Apple", value: { id: "1", name: "Apple" } },
    { title: "Banana", value: { id: "2", name: "Banana" } },
    { title: "Orange", value: { id: "3", name: "Orange" } },
    { title: "Mango", value: { id: "4", name: "Mango" } },
    { title: "Strawberry", value: { id: "5", name: "Strawberry" } },
];

const countries = [
    { title: "Norway", value: { code: "no", name: "Norway" } },
    { title: "United States", value: { code: "us", name: "United States" } },
    { title: "United Kingdom", value: { code: "uk", name: "United Kingdom" } },
    { title: "Germany", value: { code: "de", name: "Germany" } },
    { title: "France", value: { code: "fr", name: "France" } },
];

const countryNames = [
    { title: "Norway", value: "Norway" },
    { title: "United States", value: "United States" },
    { title: "United Kingdom", value: "United Kingdom" },
    { title: "Germany", value: "Germany" },
    { title: "France", value: "France" },
];

export default function SelectScreen() {
    const [selectedFruit, setSelectedFruit] = useState<Fruit | undefined>();
    const [selectMultipleItems, setSelectMultipleItems] = useState<string[]>(
        []
    );

    const [selectedCountry, setSelectedCountry] = useState<
        Country | undefined
    >();
    const { ViewCode, CodeSnippetDialog } = useCodeSnippet();

    return (
        <ScrollView style={styles.container}>
            <View style={styles.section}>
                <Typography variant="h5">Select</Typography>
                <Spacer amount="small" />
                <Typography variant="p">
                    Select lets users pick from a predefined list of options.
                    It&apos;s ideal when the choices are fixed and don&apos;t
                    need filtering.
                </Typography>
            </View>

            <View style={styles.section}>
                <Typography variant="h6">Basic Select</Typography>
                <Spacer amount="small" />
                <Select
                    items={fruits}
                    selectedItem={selectedFruit}
                    onSelect={setSelectedFruit}
                    placeholder="Select a fruit"
                />

                {selectedFruit && (
                    <Typography style={styles.resultText}>
                        Selected: {selectedFruit.name}
                    </Typography>
                )}

                <ViewCode title="Basic Select" code={basicSelect} />
            </View>

            <View style={styles.section}>
                <Typography variant="h6">
                    Select with Custom Placeholder
                </Typography>
                <Spacer amount="small" />

                <Select
                    items={countries}
                    selectedItem={selectedCountry}
                    onSelect={setSelectedCountry}
                    placeholder="Choose your country"
                />

                {selectedCountry && (
                    <Typography style={styles.resultText}>
                        Selected: {selectedCountry.name}
                    </Typography>
                )}
            </View>
            <View style={styles.section}>
                <Typography variant="h6">Multi Select</Typography>
                <Spacer amount="small" />
                <Select.Multi
                    placeholder="Select here..."
                    items={countryNames}
                    selectedItems={selectMultipleItems}
                    onSelect={setSelectMultipleItems}
                />

                <ViewCode title="Multi Select" code={multiSelect} />
            </View>

            <View style={styles.section}>
                <Typography variant="h6">Disabled Select</Typography>
                <Spacer amount="small" />

                <Select
                    items={fruits}
                    selectedItem={undefined}
                    onSelect={() => {}}
                    placeholder="Disabled select"
                    disabled
                />
            </View>

            <View style={styles.section}>
                <Typography variant="h6">Read-only Select</Typography>

                <Select
                    items={fruits}
                    selectedItem={fruits[0].value}
                    onSelect={() => {}}
                    placeholder="Read-only select"
                    readOnly
                />
            </View>

            <CodeSnippetDialog />
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
    },
    section: {
        marginBottom: 32,
    },
    description: {
        opacity: 0.7,
    },
    resultText: {
        marginTop: 12,
        fontStyle: "italic",
        opacity: 0.8,
    },
});
