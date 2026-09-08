import React from "react";
import { fireEvent, render, screen } from "test-utils";
import { Switch } from "./index";

describe("Switch", () => {
    it("renders the label", () => {
        render(<Switch label="Airplane mode" />);
        expect(screen.getByText("Airplane mode")).toBeTruthy();
    });

    it("calls onChange with the opposite of active when pressed", () => {
        const onChangeWhenInactive = jest.fn();
        const { getByRole: getByRoleInactive } = render(
            <Switch active={false} onChange={onChangeWhenInactive} />
        );
        fireEvent.press(getByRoleInactive("switch"));
        expect(onChangeWhenInactive).toHaveBeenCalledWith(true);

        const onChangeWhenActive = jest.fn();
        const { getByRole: getByRoleActive } = render(
            <Switch active onChange={onChangeWhenActive} />
        );
        fireEvent.press(getByRoleActive("switch"));
        expect(onChangeWhenActive).toHaveBeenCalledWith(false);
    });

    it("reflects a different checked state via accessibilityState for a different active value", () => {
        const { getByRole: getInactive } = render(<Switch active={false} />);
        const { getByRole: getActive } = render(<Switch active />);

        expect(getInactive("switch")).toHaveProp("accessibilityState", {
            checked: false,
            disabled: false,
        });
        expect(getActive("switch")).toHaveProp("accessibilityState", {
            checked: true,
            disabled: false,
        });
    });

    it("does not call onChange when disabled", () => {
        const onChange = jest.fn();
        render(<Switch onChange={onChange} disabled />);
        fireEvent.press(screen.getByRole("switch"));
        expect(onChange).not.toHaveBeenCalled();
    });

    it("exposes disabled state to assistive technology", () => {
        render(<Switch disabled />);
        expect(screen.getByRole("switch")).toBeDisabled();
    });
});
