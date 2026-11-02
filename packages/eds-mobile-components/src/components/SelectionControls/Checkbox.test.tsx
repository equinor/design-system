import React from "react";
import { fireEvent, render, screen } from "test-utils";
import { Checkbox } from "./index";

describe("Checkbox", () => {
    it("renders the label", async () => {
        await render(<Checkbox onPress={jest.fn()} label="Accept terms" />);
        expect(screen.getByText("Accept terms")).toBeTruthy();
    });

    it("calls onPress with the opposite of checked when pressed", async () => {
        const onPressWhenUnchecked = jest.fn();
        const { getByRole: getByRoleUnchecked } = await render(
            <Checkbox checked={false} onPress={onPressWhenUnchecked} />
        );
        await fireEvent.press(getByRoleUnchecked("checkbox"));
        expect(onPressWhenUnchecked).toHaveBeenCalledWith(true);

        const onPressWhenChecked = jest.fn();
        const { getByRole: getByRoleChecked } = await render(
            <Checkbox checked onPress={onPressWhenChecked} />
        );
        await fireEvent.press(getByRoleChecked("checkbox"));
        expect(onPressWhenChecked).toHaveBeenCalledWith(false);
    });

    it("reflects a different checked state via accessibilityState and icon for a different checked value", async () => {
        const {
            getByRole: getUnchecked,
            getByTestId: getIconUnchecked,
        } = await render(<Checkbox checked={false} onPress={jest.fn()} />);
        const { getByRole: getChecked, getByTestId: getIconChecked } =
            await render(<Checkbox checked onPress={jest.fn()} />);

        expect(getUnchecked("checkbox")).toHaveProp("accessibilityState", {
            checked: false,
            disabled: false,
        });
        expect(getChecked("checkbox")).toHaveProp("accessibilityState", {
            checked: true,
            disabled: false,
        });

        expect(
            getIconUnchecked("icon-checkbox-blank-outline")
        ).toBeTruthy();
        expect(getIconChecked("icon-checkbox-marked")).toBeTruthy();
    });

    it("shows an indeterminate state that takes precedence over checked", async () => {
        const { getByRole, getByTestId } = await render(
            <Checkbox checked indeterminate onPress={jest.fn()} />
        );
        expect(getByRole("checkbox")).toHaveProp("accessibilityState", {
            checked: "mixed",
            disabled: false,
        });
        expect(getByTestId("icon-minus-box")).toBeTruthy();
    });

    it("does not call onPress when disabled", async () => {
        const onPress = jest.fn();
        await render(<Checkbox onPress={onPress} disabled />);
        await fireEvent.press(screen.getByRole("checkbox"));
        expect(onPress).not.toHaveBeenCalled();
    });

    it("exposes disabled state to assistive technology", async () => {
        await render(<Checkbox onPress={jest.fn()} disabled />);
        expect(screen.getByRole("checkbox")).toBeDisabled();
    });

    it("is non-interactive and reports disabled to assistive technology when onPress is not provided", async () => {
        await render(<Checkbox label="Accept terms" />);
        const checkbox = screen.getByRole("checkbox");
        await expect(fireEvent.press(checkbox)).resolves.toBeUndefined();
        expect(checkbox).toBeDisabled();
    });

    it("defaults accessibilityLabel to the label", async () => {
        await render(<Checkbox onPress={jest.fn()} label="Accept terms" />);
        expect(screen.getByRole("checkbox")).toHaveProp(
            "accessibilityLabel",
            "Accept terms"
        );
    });

    it("lets an explicit accessibilityLabel override the label", async () => {
        await render(
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
