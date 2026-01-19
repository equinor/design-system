import {
    multiSelectAutocomplete,
    singleSelectAutocomplete,
} from "@/codeSnippets/autocomplete";
import { useCodeSnippet } from "@/hooks/useCodeSnippet";
import { Autocomplete, Typography } from "@equinor/eds-mobile-components";
import { useState } from "react";
import { ScrollView, StyleSheet, View } from "react-native";

const countries = [
    { label: "Norway", value: "no" },
    { label: "Sweden", value: "se" },
    { label: "Denmark", value: "dk" },
    { label: "Finland", value: "fi" },
    { label: "Iceland", value: "is" },
    { label: "United Kingdom", value: "uk" },
    { label: "Germany", value: "de" },
    { label: "France", value: "fr" },
    { label: "Spain", value: "es" },
    { label: "Italy", value: "it" },
];

type Country = { label: string; value: string };

export default function AutocompleteScreen() {
    const [selectedCountry, setSelectedCountry] = useState<Country | undefined>(
        undefined
    );
    const [selectedCountries, setSelectedCountries] = useState<Country[]>([]);
    const { ViewCode, CodeSnippetDialog } = useCodeSnippet();

    return (
        <ScrollView contentInsetAdjustmentBehavior="automatic">
            <View style={styles.section}>
                <Typography variant="p">
                    Autocomplete helps users find and select from a list of
                    options as they type. Ideal for long lists like countries,
                    tags, or categories.
                </Typography>
            </View>

            <View style={styles.section}>
                <Typography variant="h6">Single Select</Typography>

                <Autocomplete
                    label="Select a country"
                    placeholder="Search countries..."
                    options={countries}
                    selectedOption={selectedCountry}
                    onSelect={setSelectedCountry}
                    transformItem={(item) => item.label}
                />

                {selectedCountry && (
                    <Typography variant="p">
                        Selected: {selectedCountry.label}
                    </Typography>
                )}

                <ViewCode
                    title="Single Select Autocomplete"
                    code={singleSelectAutocomplete}
                />
            </View>

            <View style={styles.section}>
                <Typography variant="h6">Multi-select</Typography>

                <Autocomplete.Multiselect
                    label="Select countries"
                    placeholder="Search countries..."
                    options={countries}
                    selectedOptions={selectedCountries}
                    onSelect={setSelectedCountries}
                    transformItem={(item) => item.label}
                />

                {selectedCountries.length > 0 && (
                    <Typography variant="p">
                        Selected:{" "}
                        {selectedCountries.map((c) => c.label).join(", ")}
                    </Typography>
                )}

                <ViewCode
                    title="Multi-select Autocomplete"
                    code={multiSelectAutocomplete}
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
});
