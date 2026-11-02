import React from "react";
import { fireEvent, render, screen } from "test-utils";
import { Radio } from "./index";

describe("Radio", () => {
    it("renders the label", async () => {
        await render(<Radio onPress={jest.fn()} label="Option A" />);
        expect(screen.getByText("Option A")).toBeTruthy();
    });

    it("calls onPress with the opposite of checked when pressed", async () => {
        const onPressWhenUnchecked = jest.fn();
        const { getByRole: getByRoleUnchecked } = await render(
            <Radio checked={false} onPress={onPressWhenUnchecked} />
        );
        await fireEvent.press(getByRoleUnchecked("radio"));
        expect(onPressWhenUnchecked).toHaveBeenCalledWith(true);

        const onPressWhenChecked = jest.fn();
        const { getByRole: getByRoleChecked } = await render(
            <Radio checked onPress={onPressWhenChecked} />
        );
        await fireEvent.press(getByRoleChecked("radio"));
        expect(onPressWhenChecked).toHaveBeenCalledWith(false);
    });

    it("reflects a different checked state via accessibilityState and icon for a different checked value", async () => {
        const { getByRole: getUnchecked, getByTestId: getIconUnchecked } =
            await render(<Radio checked={false} onPress={jest.fn()} />);
        const { getByRole: getChecked, getByTestId: getIconChecked } =
            await render(<Radio checked onPress={jest.fn()} />);

        expect(getUnchecked("radio")).toHaveProp("accessibilityState", {
            checked: false,
            disabled: false,
        });
        expect(getChecked("radio")).toHaveProp("accessibilityState", {
            checked: true,
            disabled: false,
        });

        expect(getIconUnchecked("icon-radiobox-blank")).toBeTruthy();
        expect(getIconChecked("icon-radiobox-marked")).toBeTruthy();
    });

    it("does not call onPress when disabled", async () => {
        const onPress = jest.fn();
        await render(<Radio onPress={onPress} disabled />);
        await fireEvent.press(screen.getByRole("radio"));
        expect(onPress).not.toHaveBeenCalled();
    });

    it("exposes disabled state to assistive technology", async () => {
        await render(<Radio onPress={jest.fn()} disabled />);
        expect(screen.getByRole("radio")).toBeDisabled();
    });

    it("is non-interactive and reports disabled to assistive technology when onPress is not provided", async () => {
        await render(<Radio label="Option A" />);
        const radio = screen.getByRole("radio");
        await fireEvent.press(radio);
        expect(radio).toBeDisabled();
    });

    it("defaults accessibilityLabel to the label", async () => {
        await render(<Radio onPress={jest.fn()} label="Option A" />);
        expect(screen.getByRole("radio")).toHaveProp(
            "accessibilityLabel",
            "Option A"
        );
    });

    it("lets an explicit accessibilityLabel override the label", async () => {
        await render(
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
