import React from "react";
import { fireEvent, render, screen } from "test-utils";
import { Switch } from "./index";

describe("Switch", () => {
    it("renders the label", async () => {
        await render(<Switch label="Airplane mode" />);
        expect(screen.getByText("Airplane mode")).toBeTruthy();
    });

    it("calls onChange with the opposite of active when pressed", async () => {
        const onChangeWhenInactive = jest.fn();
        const { getByRole: getByRoleInactive } = await render(
            <Switch active={false} onChange={onChangeWhenInactive} />
        );
        await fireEvent.press(getByRoleInactive("switch"));
        expect(onChangeWhenInactive).toHaveBeenCalledWith(true);

        const onChangeWhenActive = jest.fn();
        const { getByRole: getByRoleActive } = await render(
            <Switch active onChange={onChangeWhenActive} />
        );
        await fireEvent.press(getByRoleActive("switch"));
        expect(onChangeWhenActive).toHaveBeenCalledWith(false);
    });

    it("reflects a different checked state via accessibilityState for a different active value", async () => {
        const { getByRole: getInactive } = await render(<Switch active={false} />);
        const { getByRole: getActive } = await render(<Switch active />);

        expect(getInactive("switch")).toHaveProp("accessibilityState", {
            checked: false,
            disabled: false,
        });
        expect(getActive("switch")).toHaveProp("accessibilityState", {
            checked: true,
            disabled: false,
        });
    });

    it("does not call onChange when disabled", async () => {
        const onChange = jest.fn();
        await render(<Switch onChange={onChange} disabled />);
        await fireEvent.press(screen.getByRole("switch"));
        expect(onChange).not.toHaveBeenCalled();
    });

    it("exposes disabled state to assistive technology", async () => {
        await render(<Switch disabled />);
        expect(screen.getByRole("switch")).toBeDisabled();
    });
});
