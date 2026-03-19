import { CodeDialog } from "@/components/CodeDialog";
import { Button } from "@equinor/eds-mobile-components";
import { useState } from "react";
import { View } from "react-native";

export function useCodeSnippet() {
    const [activeCode, setActiveCode] = useState<{
        title: string;
        code: string;
    } | null>(null);

    const showCode = (title: string, code: string) =>
        setActiveCode({ title, code });

    const ViewCode = ({ title, code }: { title: string; code: string }) => (
        <View style={{ alignItems: "flex-end" }}>
            <Button
                label="View Code"
                variant="ghost"
                leadingIcon="code-braces"
                onPress={() => showCode(title, code)}
            />
        </View>
    );

    const CodeSnippetDialog = () => (
        <CodeDialog
            isOpen={activeCode !== null}
            onClose={() => setActiveCode(null)}
            title={activeCode?.title ?? ""}
            code={activeCode?.code ?? ""}
        />
    );

    return { ViewCode, CodeSnippetDialog };
}
