import React from "react";
import { StyleProp, StyleSheet, TextStyle, ViewStyle } from "react-native";
import type { TestInstance } from "test-renderer";
import { fireEvent, render, screen } from "test-utils";
import { Button } from "./index";

const flattenStyle = (element: TestInstance) =>
    StyleSheet.flatten(element.props.style as StyleProp<ViewStyle & TextStyle>);

describe("Button", () => {
    it("renders the label", async () => {
        await render(<Button label="Save" />);
        expect(screen.getByText("Save")).toBeTruthy();
    });

    it("calls onPress when pressed", async () => {
        const onPress = jest.fn();
        await render(<Button label="Save" onPress={onPress} />);
        await fireEvent.press(screen.getByRole("button"));
        expect(onPress).toHaveBeenCalledTimes(1);
    });

    it("does not call onPress when disabled", async () => {
        const onPress = jest.fn();
        await render(<Button label="Save" onPress={onPress} disabled />);
        await fireEvent.press(screen.getByRole("button"));
        expect(onPress).not.toHaveBeenCalled();
    });

    it("exposes disabled state to assistive technology", async () => {
        await render(<Button label="Save" disabled />);
        expect(screen.getByRole("button")).toBeDisabled();
    });

    it("merges a caller-supplied accessibilityState, with the component's own disabled value winning on conflict", async () => {
        await render(
            <Button
                label="Save"
                accessibilityState={{ selected: true, disabled: true }}
            />
        );
        expect(screen.getByRole("button")).toHaveProp("accessibilityState", {
            selected: true,
            disabled: false,
        });
    });

    it("renders a leading and trailing icon when provided", async () => {
        await render(
            <Button
                label="Save"
                leadingIcon="content-save"
                trailingIcon="chevron-right"
            />
        );
        expect(
            screen.getByTestId("icon-content-save")
        ).toBeTruthy();
        expect(
            screen.getByTestId("icon-chevron-right")
        ).toBeTruthy();
    });

    it("renders without error and applies a different border color for a different tone", async () => {
        await render(<Button label="Save" tone="accent" />);
        const accentBorder = flattenStyle(
            screen.getByRole("button")
        )?.borderColor;

        await render(<Button label="Save" tone="danger" />);
        const dangerBorder = flattenStyle(
            screen.getByRole("button")
        )?.borderColor;

        expect(dangerBorder).not.toEqual(accentBorder);
    });

    it("renders without error and applies a different icon size for a different size", async () => {
        await render(
            <Button label="Save" size="small" leadingIcon="content-save" />
        );
        const smallIconSize = flattenStyle(
            screen.getByTestId("icon-content-save")
        )?.fontSize;

        await render(
            <Button label="Save" size="default" leadingIcon="content-save" />
        );
        const defaultIconSize = flattenStyle(
            screen.getByTestId("icon-content-save")
        )?.fontSize;

        expect(defaultIconSize).not.toEqual(smallIconSize);
    });

    it("renders without error and gives the secondary variant a visible border, unlike the default primary variant", async () => {
        await render(<Button label="Save" />);
        expect(flattenStyle(screen.getByRole("button"))?.borderWidth).toBe(0);

        await render(<Button label="Save" variant="secondary" />);
        expect(
            flattenStyle(screen.getByRole("button"))?.borderWidth
        ).toBeGreaterThan(0);
    });

    it("merges a caller-supplied style with the container style rather than replacing it", async () => {
        // The reported repro: a style prop landed in pressableProps and was
        // spread over the explicit style={styles.container}, so the secondary
        // variant's border disappeared the moment any style was passed.
        await render(
            <Button label="Save" variant="secondary" style={{ minWidth: 200 }} />
        );

        const style = flattenStyle(screen.getByRole("button"));
        expect(style?.minWidth).toBe(200);
        expect(style?.borderWidth).toBeGreaterThan(0);
        expect(style?.borderColor).toBeTruthy();
        expect(style?.overflow).toBe("hidden");
    });

    it("lets a caller-supplied style win on a property the container also sets", async () => {
        await render(<Button label="Save" style={{ borderRadius: 3 }} />);
        expect(flattenStyle(screen.getByRole("button"))?.borderRadius).toBe(3);
    });

    it("supports the function form of style, which receives press state", async () => {
        await render(
            <Button
                label="Save"
                variant="secondary"
                style={({ pressed }) => ({ opacity: pressed ? 0.5 : 1 })}
            />
        );

        const style = flattenStyle(screen.getByRole("button"));
        expect(style?.opacity).toBe(1);
        expect(style?.borderWidth).toBeGreaterThan(0);
    });
});

describe("Button.Icon", () => {
    it("renders the given icon", async () => {
        await render(<Button.Icon name="close" accessibilityLabel="Close" />);
        expect(screen.getByTestId("icon-close")).toBeTruthy();
    });

    it("calls onPress when pressed", async () => {
        const onPress = jest.fn();
        await render(
            <Button.Icon
                name="close"
                accessibilityLabel="Close"
                onPress={onPress}
            />
        );
        await fireEvent.press(screen.getByRole("button"));
        expect(onPress).toHaveBeenCalledTimes(1);
    });

    it("does not call onPress when disabled", async () => {
        const onPress = jest.fn();
        await render(
            <Button.Icon
                name="close"
                accessibilityLabel="Close"
                onPress={onPress}
                disabled
            />
        );
        await fireEvent.press(screen.getByRole("button"));
        expect(onPress).not.toHaveBeenCalled();
    });

    it("merges a caller-supplied accessibilityState, with the component's own disabled value winning on conflict", async () => {
        // This is the exact case that caught IconButton's original bug: the
        // explicit accessibilityState prop was placed before {...pressableProps}
        // in JSX, so a caller-supplied accessibilityState (which lands in
        // pressableProps, since it isn't destructured out) silently replaced
        // the whole computed accessibilityState object, disabled key included.
        await render(
            <Button.Icon
                name="close"
                accessibilityLabel="Close"
                accessibilityState={{ selected: true, disabled: true }}
            />
        );
        expect(screen.getByRole("button")).toHaveProp("accessibilityState", {
            selected: true,
            disabled: false,
        });
    });

    it("merges a caller-supplied style with the container style rather than replacing it", async () => {
        await render(
            <Button.Icon
                name="close"
                accessibilityLabel="Close"
                variant="secondary"
                style={{ minWidth: 200 }}
            />
        );

        const style = flattenStyle(screen.getByRole("button"));
        expect(style?.minWidth).toBe(200);
        expect(style?.borderWidth).toBeGreaterThan(0);
        expect(style?.overflow).toBe("hidden");
    });

    it("supports the function form of style, which receives press state", async () => {
        await render(
            <Button.Icon
                name="close"
                accessibilityLabel="Close"
                variant="secondary"
                style={({ pressed }) => ({ opacity: pressed ? 0.5 : 1 })}
            />
        );

        const style = flattenStyle(screen.getByRole("button"));
        expect(style?.opacity).toBe(1);
        expect(style?.borderWidth).toBeGreaterThan(0);
    });
});
