import { basicSearch, cancellableSearch } from "@/codeSnippets/search";
import { useCodeSnippet } from "@/hooks/useCodeSnippet";
import { Search, Spacer, Typography } from "@equinor/eds-mobile-components";
import { useState } from "react";
import { ScrollView, StyleSheet } from "react-native";

export default function SearchScreen() {
    const [searchQuery, setSearchQuery] = useState("");
    const [searchQuery2, setSearchQuery2] = useState("");
    const { ViewCode, CodeSnippetDialog } = useCodeSnippet();

    return (
        <ScrollView style={styles.container}>
            <Typography variant="h5">Search</Typography>
            <Spacer amount="small" />
            <Typography variant="p">
                Search fields help users find content quickly. Add a cancel
                button for easy clearing, or keep it simple for basic use cases.
            </Typography>
            <Spacer amount="large" />

            <Typography variant="h6">Basic Search</Typography>
            <Spacer amount="small" />

            <Search
                value={searchQuery}
                onChange={setSearchQuery}
                placeholder="Search..."
            />

            {searchQuery.length > 0 && (
                <Typography variant="p" style={styles.resultText}>
                    Searching for: {searchQuery}
                </Typography>
            )}

            <ViewCode title="Basic Search" code={basicSearch} />
            <Spacer amount="large" />

            <Typography variant="h6">Cancellable Search</Typography>
            <Spacer amount="small" />

            <Search
                value={searchQuery2}
                onChange={setSearchQuery2}
                placeholder="Search with cancel..."
                cancellable
                onCancelPress={() => setSearchQuery2("")}
            />

            {searchQuery2.length > 0 && (
                <Typography variant="p" style={styles.resultText}>
                    Searching for: {searchQuery2}
                </Typography>
            )}

            <ViewCode title="Cancellable Search" code={cancellableSearch} />
            <Spacer amount="large" />

            <Typography variant="h6">Disabled Search</Typography>

            <Spacer amount="small" />
            <Search
                value=""
                onChange={() => {}}
                placeholder="Disabled search..."
                disabled
            />
            <Spacer amount="large" />

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
