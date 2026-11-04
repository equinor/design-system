import React from "react";
import { StyleProp, StyleSheet, TextStyle } from "react-native";
import type { TestInstance } from "test-renderer";
import { render, screen } from "test-utils";
import { Label } from "./index";

const flattenStyle = (element: TestInstance) =>
    StyleSheet.flatten(element.props.style as StyleProp<TextStyle>);

describe("Label", () => {
    it("renders the label and meta text", async () => {
        await render(<Label label="Comment" meta="Optional" />);
        expect(screen.getByText("Comment")).toBeTruthy();
        expect(screen.getByText("Optional")).toBeTruthy();
    });

    it("merges a caller-supplied style with the text style rather than replacing it", async () => {
        // Asserting against a baseline render rather than just a truthy colour:
        // Typography supplies a default colour of its own, so the loss of
        // Label's subtle colour is only visible as a change from this baseline.
        await render(<Label label="Comment" meta="Optional" />);
        const baselineColor = flattenStyle(screen.getByText("Comment"))?.color;

        await render(
            <Label label="Comment" meta="Optional" style={{ letterSpacing: 2 }} />
        );

        const style = flattenStyle(screen.getByText("Comment"));
        expect(style?.letterSpacing).toBe(2);
        expect(style?.color).toBe(baselineColor);
    });
});
