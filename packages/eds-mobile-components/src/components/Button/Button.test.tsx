import React from "react";
import { StyleProp, StyleSheet, TextStyle, ViewStyle } from "react-native";
import type { ReactTestInstance } from "react-test-renderer";
import { fireEvent, render, screen } from "test-utils";
import { Button } from "./index";

const flattenStyle = (element: ReactTestInstance) =>
    StyleSheet.flatten(element.props.style as StyleProp<ViewStyle & TextStyle>);

describe("Button", () => {
    it("renders the label", () => {
        render(<Button label="Save" />);
        expect(screen.getByText("Save")).toBeTruthy();
    });

    it("calls onPress when pressed", () => {
        const onPress = jest.fn();
        render(<Button label="Save" onPress={onPress} />);
        fireEvent.press(screen.getByRole("button"));
        expect(onPress).toHaveBeenCalledTimes(1);
    });

    it("does not call onPress when disabled", () => {
        const onPress = jest.fn();
        render(<Button label="Save" onPress={onPress} disabled />);
        fireEvent.press(screen.getByRole("button"));
        expect(onPress).not.toHaveBeenCalled();
    });

    it("exposes disabled state to assistive technology", () => {
        render(<Button label="Save" disabled />);
        expect(screen.getByRole("button")).toBeDisabled();
    });

    it("merges a caller-supplied accessibilityState, with the component's own disabled value winning on conflict", () => {
        render(
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

    it("renders a leading and trailing icon when provided", () => {
        render(
            <Button
                label="Save"
                leadingIcon="content-save"
                trailingIcon="chevron-right"
            />
        );
        expect(
            screen.UNSAFE_getByProps({ name: "content-save" })
        ).toBeTruthy();
        expect(
            screen.UNSAFE_getByProps({ name: "chevron-right" })
        ).toBeTruthy();
    });

    it("renders without error and applies a different border color for a different tone", () => {
        render(<Button label="Save" tone="accent" />);
        const accentBorder = flattenStyle(
            screen.getByRole("button")
        )?.borderColor;

        render(<Button label="Save" tone="danger" />);
        const dangerBorder = flattenStyle(
            screen.getByRole("button")
        )?.borderColor;

        expect(dangerBorder).not.toEqual(accentBorder);
    });

    it("renders without error and applies a different icon size for a different size", () => {
        // UNSAFE_getByProps matches the first node carrying the prop, which
        // is ButtonIcon itself (the wrapper, which also has a `name` prop
        // but no style) — UNSAFE_getAllByProps + the last match gets the
        // actual rendered icon, several layers deeper, that carries fontSize.
        render(
            <Button label="Save" size="small" leadingIcon="content-save" />
        );
        const smallIconMatches = screen.UNSAFE_getAllByProps({
            name: "content-save",
        });
        const smallIconSize = flattenStyle(
            smallIconMatches[smallIconMatches.length - 1]
        )?.fontSize;

        render(
            <Button label="Save" size="default" leadingIcon="content-save" />
        );
        const defaultIconMatches = screen.UNSAFE_getAllByProps({
            name: "content-save",
        });
        const defaultIconSize = flattenStyle(
            defaultIconMatches[defaultIconMatches.length - 1]
        )?.fontSize;

        expect(defaultIconSize).not.toEqual(smallIconSize);
    });

    it("renders without error and gives the secondary variant a visible border, unlike the default primary variant", () => {
        render(<Button label="Save" />);
        expect(flattenStyle(screen.getByRole("button"))?.borderWidth).toBe(0);

        render(<Button label="Save" variant="secondary" />);
        expect(
            flattenStyle(screen.getByRole("button"))?.borderWidth
        ).toBeGreaterThan(0);
    });
});

describe("Button.Icon", () => {
    it("renders the given icon", () => {
        render(<Button.Icon name="close" accessibilityLabel="Close" />);
        expect(screen.UNSAFE_getByProps({ name: "close" })).toBeTruthy();
    });

    it("calls onPress when pressed", () => {
        const onPress = jest.fn();
        render(
            <Button.Icon
                name="close"
                accessibilityLabel="Close"
                onPress={onPress}
            />
        );
        fireEvent.press(screen.getByRole("button"));
        expect(onPress).toHaveBeenCalledTimes(1);
    });

    it("does not call onPress when disabled", () => {
        const onPress = jest.fn();
        render(
            <Button.Icon
                name="close"
                accessibilityLabel="Close"
                onPress={onPress}
                disabled
            />
        );
        fireEvent.press(screen.getByRole("button"));
        expect(onPress).not.toHaveBeenCalled();
    });

    it("merges a caller-supplied accessibilityState, with the component's own disabled value winning on conflict", () => {
        // This is the exact case that caught IconButton's original bug: the
        // explicit accessibilityState prop was placed before {...pressableProps}
        // in JSX, so a caller-supplied accessibilityState (which lands in
        // pressableProps, since it isn't destructured out) silently replaced
        // the whole computed accessibilityState object, disabled key included.
        render(
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
});
