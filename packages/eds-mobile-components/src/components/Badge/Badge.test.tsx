import React from "react";
import { StyleProp, StyleSheet, ViewStyle } from "react-native";
import type { ReactTestInstance } from "react-test-renderer";
import { render, screen } from "test-utils";
import { Badge } from "./index";

const flattenBackgroundColor = (element: ReactTestInstance) =>
    StyleSheet.flatten(element.props.style as StyleProp<ViewStyle>)
        ?.backgroundColor;

const flattenBorderColor = (element: ReactTestInstance) =>
    StyleSheet.flatten(element.props.style as StyleProp<ViewStyle>)
        ?.borderColor;

describe("Badge", () => {
    it("renders string children", () => {
        render(<Badge>New</Badge>);
        expect(screen.getByText("New")).toBeTruthy();
    });

    it("renders numeric children", () => {
        render(<Badge>{3}</Badge>);
        expect(screen.getByText("3")).toBeTruthy();
    });

    it("truncates to a single line", () => {
        render(<Badge>99+</Badge>);
        expect(screen.getByText("99+")).toHaveProp("numberOfLines", 1);
    });

    it("renders without error and applies a different background color for a different tone", () => {
        render(<Badge tone="neutral" testID="neutral-badge">Label</Badge>);
        const neutralBackground = flattenBackgroundColor(
            screen.getByTestId("neutral-badge")
        );

        render(<Badge tone="danger" testID="danger-badge">Label</Badge>);
        const dangerBackground = flattenBackgroundColor(
            screen.getByTestId("danger-badge")
        );

        expect(dangerBackground).not.toEqual(neutralBackground);
    });

    it("renders the outlined variant without error, with a visible border unlike the default solid variant", () => {
        render(<Badge testID="solid-badge">Label</Badge>);
        expect(
            flattenBorderColor(screen.getByTestId("solid-badge"))
        ).toBe("transparent");

        render(<Badge variant="outlined" testID="outlined-badge">Label</Badge>);
        expect(
            flattenBorderColor(screen.getByTestId("outlined-badge"))
        ).not.toBe("transparent");
    });

    it("renders the medium emphasis without error, with a different background color than the default low emphasis", () => {
        render(<Badge testID="low-emphasis-badge">Label</Badge>);
        const lowEmphasisBackground = flattenBackgroundColor(
            screen.getByTestId("low-emphasis-badge")
        );

        render(<Badge emphasis="medium" testID="medium-emphasis-badge">Label</Badge>);
        const mediumEmphasisBackground = flattenBackgroundColor(
            screen.getByTestId("medium-emphasis-badge")
        );

        expect(mediumEmphasisBackground).not.toEqual(lowEmphasisBackground);
    });
});
