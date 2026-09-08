import React from "react";
import { fireEvent, render, screen } from "test-utils";
import { Radio } from "./index";

describe("Radio", () => {
    it("renders the label", () => {
        render(<Radio onPress={jest.fn()} label="Option A" />);
        expect(screen.getByText("Option A")).toBeTruthy();
    });

    it("calls onPress with the opposite of checked when pressed", () => {
        const onPressWhenUnchecked = jest.fn();
        const { getByRole: getByRoleUnchecked } = render(
            <Radio checked={false} onPress={onPressWhenUnchecked} />
        );
        fireEvent.press(getByRoleUnchecked("radio"));
        expect(onPressWhenUnchecked).toHaveBeenCalledWith(true);

        const onPressWhenChecked = jest.fn();
        const { getByRole: getByRoleChecked } = render(
            <Radio checked onPress={onPressWhenChecked} />
        );
        fireEvent.press(getByRoleChecked("radio"));
        expect(onPressWhenChecked).toHaveBeenCalledWith(false);
    });

    it("reflects a different checked state via accessibilityState and icon for a different checked value", () => {
        const { getByRole: getUnchecked, UNSAFE_getByProps: getPropsUnchecked } =
            render(<Radio checked={false} onPress={jest.fn()} />);
        const { getByRole: getChecked, UNSAFE_getByProps: getPropsChecked } =
            render(<Radio checked onPress={jest.fn()} />);

        expect(getUnchecked("radio")).toHaveProp("accessibilityState", {
            checked: false,
            disabled: false,
        });
        expect(getChecked("radio")).toHaveProp("accessibilityState", {
            checked: true,
            disabled: false,
        });

        expect(getPropsUnchecked({ name: "radiobox-blank" })).toBeTruthy();
        expect(getPropsChecked({ name: "radiobox-marked" })).toBeTruthy();
    });

    it("does not call onPress when disabled", () => {
        const onPress = jest.fn();
        render(<Radio onPress={onPress} disabled />);
        fireEvent.press(screen.getByRole("radio"));
        expect(onPress).not.toHaveBeenCalled();
    });

    it("exposes disabled state to assistive technology", () => {
        render(<Radio onPress={jest.fn()} disabled />);
        expect(screen.getByRole("radio")).toBeDisabled();
    });

    it("is non-interactive and reports disabled to assistive technology when onPress is not provided", () => {
        render(<Radio label="Option A" />);
        const radio = screen.getByRole("radio");
        expect(() => fireEvent.press(radio)).not.toThrow();
        expect(radio).toBeDisabled();
    });

    it("defaults accessibilityLabel to the label", () => {
        render(<Radio onPress={jest.fn()} label="Option A" />);
        expect(screen.getByRole("radio")).toHaveProp(
            "accessibilityLabel",
            "Option A"
        );
    });

    it("lets an explicit accessibilityLabel override the label", () => {
        render(
            <Radio
                onPress={jest.fn()}
                label="Option A"
                accessibilityLabel="Custom label"
            />
        );
        expect(screen.getByRole("radio")).toHaveProp(
            "accessibilityLabel",
            "Custom label"
        );
    });
});
