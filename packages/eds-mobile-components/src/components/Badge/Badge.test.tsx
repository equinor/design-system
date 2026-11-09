import React from "react";
import { StyleProp, StyleSheet, ViewStyle } from "react-native";
import type { TestInstance } from "test-renderer";
import { render, screen } from "test-utils";
import { Badge } from "./index";

const flattenBackgroundColor = (element: TestInstance) =>
    StyleSheet.flatten(element.props.style as StyleProp<ViewStyle>)
        ?.backgroundColor;

const flattenBorderColor = (element: TestInstance) =>
    StyleSheet.flatten(element.props.style as StyleProp<ViewStyle>)
        ?.borderColor;

const flattenStyle = (element: TestInstance) =>
    StyleSheet.flatten(element.props.style as StyleProp<ViewStyle>);

describe("Badge", () => {
    it("renders string children", async () => {
        await render(<Badge>New</Badge>);
        expect(screen.getByText("New")).toBeTruthy();
    });

    it("renders numeric children", async () => {
        await render(<Badge>{3}</Badge>);
        expect(screen.getByText("3")).toBeTruthy();
    });

    it("truncates to a single line", async () => {
        await render(<Badge>99+</Badge>);
        expect(screen.getByText("99+")).toHaveProp("numberOfLines", 1);
    });

    it("renders without error and applies a different background color for a different tone", async () => {
        await render(<Badge tone="neutral" testID="neutral-badge">Label</Badge>);
        const neutralBackground = flattenBackgroundColor(
            screen.getByTestId("neutral-badge")
        );

        await render(<Badge tone="danger" testID="danger-badge">Label</Badge>);
        const dangerBackground = flattenBackgroundColor(
            screen.getByTestId("danger-badge")
        );

        expect(dangerBackground).not.toEqual(neutralBackground);
    });

    it("renders the outlined variant without error, with a visible border unlike the default solid variant", async () => {
        await render(<Badge testID="solid-badge">Label</Badge>);
        expect(
            flattenBorderColor(screen.getByTestId("solid-badge"))
        ).toBe("transparent");

        await render(<Badge variant="outlined" testID="outlined-badge">Label</Badge>);
        expect(
            flattenBorderColor(screen.getByTestId("outlined-badge"))
        ).not.toBe("transparent");
    });

    it("renders the medium emphasis without error, with a different background color than the default low emphasis", async () => {
        await render(<Badge testID="low-emphasis-badge">Label</Badge>);
        const lowEmphasisBackground = flattenBackgroundColor(
            screen.getByTestId("low-emphasis-badge")
        );

        await render(<Badge emphasis="medium" testID="medium-emphasis-badge">Label</Badge>);
        const mediumEmphasisBackground = flattenBackgroundColor(
            screen.getByTestId("medium-emphasis-badge")
        );

        expect(mediumEmphasisBackground).not.toEqual(lowEmphasisBackground);
    });

    it("merges a caller-supplied style with the container style rather than replacing it", async () => {
        // Compared against a baseline: unfixed, the container style is replaced
        // and borderColor is undefined, which a not.toBe("transparent") check
        // would happily pass.
        await render(
            <Badge variant="outlined" testID="baseline-badge">
                Label
            </Badge>
        );
        const baselineBorderColor = flattenBorderColor(
            screen.getByTestId("baseline-badge")
        );

        await render(
            <Badge
                variant="outlined"
                testID="styled-badge"
                style={{ minWidth: 200 }}
            >
                Label
            </Badge>
        );

        const style = flattenStyle(screen.getByTestId("styled-badge"));
        expect(style?.minWidth).toBe(200);
        expect(style?.borderColor).toBe(baselineBorderColor);
        expect(style?.borderWidth).toBeGreaterThan(0);
    });
});
