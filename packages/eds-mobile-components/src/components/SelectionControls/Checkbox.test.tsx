import React from "react";
import { fireEvent, render, screen } from "test-utils";
import { Checkbox } from "./index";

describe("Checkbox", () => {
    it("renders the label", () => {
        render(<Checkbox onPress={jest.fn()} label="Accept terms" />);
        expect(screen.getByText("Accept terms")).toBeTruthy();
    });

    it("calls onPress with the opposite of checked when pressed", () => {
        const onPressWhenUnchecked = jest.fn();
        const { getByRole: getByRoleUnchecked } = render(
            <Checkbox checked={false} onPress={onPressWhenUnchecked} />
        );
        fireEvent.press(getByRoleUnchecked("checkbox"));
        expect(onPressWhenUnchecked).toHaveBeenCalledWith(true);

        const onPressWhenChecked = jest.fn();
        const { getByRole: getByRoleChecked } = render(
            <Checkbox checked onPress={onPressWhenChecked} />
        );
        fireEvent.press(getByRoleChecked("checkbox"));
        expect(onPressWhenChecked).toHaveBeenCalledWith(false);
    });

    it("reflects a different checked state via accessibilityState and icon for a different checked value", () => {
        const {
            getByRole: getUnchecked,
            UNSAFE_getByProps: getPropsUnchecked,
        } = render(<Checkbox checked={false} onPress={jest.fn()} />);
        const { getByRole: getChecked, UNSAFE_getByProps: getPropsChecked } =
            render(<Checkbox checked onPress={jest.fn()} />);

        expect(getUnchecked("checkbox")).toHaveProp("accessibilityState", {
            checked: false,
            disabled: false,
        });
        expect(getChecked("checkbox")).toHaveProp("accessibilityState", {
            checked: true,
            disabled: false,
        });

        expect(
            getPropsUnchecked({ name: "checkbox-blank-outline" })
        ).toBeTruthy();
        expect(getPropsChecked({ name: "checkbox-marked" })).toBeTruthy();
    });

    it("shows an indeterminate state that takes precedence over checked", () => {
        const { getByRole, UNSAFE_getByProps } = render(
            <Checkbox checked indeterminate onPress={jest.fn()} />
        );
        expect(getByRole("checkbox")).toHaveProp("accessibilityState", {
            checked: "mixed",
            disabled: false,
        });
        expect(UNSAFE_getByProps({ name: "minus-box" })).toBeTruthy();
    });

    it("does not call onPress when disabled", () => {
        const onPress = jest.fn();
        render(<Checkbox onPress={onPress} disabled />);
        fireEvent.press(screen.getByRole("checkbox"));
        expect(onPress).not.toHaveBeenCalled();
    });

    it("exposes disabled state to assistive technology", () => {
        render(<Checkbox onPress={jest.fn()} disabled />);
        expect(screen.getByRole("checkbox")).toBeDisabled();
    });

    it("is non-interactive and reports disabled to assistive technology when onPress is not provided", () => {
        render(<Checkbox label="Accept terms" />);
        const checkbox = screen.getByRole("checkbox");
        expect(() => fireEvent.press(checkbox)).not.toThrow();
        expect(checkbox).toBeDisabled();
    });

    it("defaults accessibilityLabel to the label", () => {
        render(<Checkbox onPress={jest.fn()} label="Accept terms" />);
        expect(screen.getByRole("checkbox")).toHaveProp(
            "accessibilityLabel",
            "Accept terms"
        );
    });

    it("lets an explicit accessibilityLabel override the label", () => {
        render(
            <Checkbox
                onPress={jest.fn()}
                label="Accept terms"
                accessibilityLabel="Custom label"
            />
        );
        expect(screen.getByRole("checkbox")).toHaveProp(
            "accessibilityLabel",
            "Custom label"
        );
    });
});
