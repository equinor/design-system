import React from "react";
import { Text } from "react-native";
import { fireEvent, render, screen } from "test-utils";
import { Input } from "./index";

describe("Input", () => {
    it("calls onChange with the new text", () => {
        const onChange = jest.fn();
        render(<Input onChange={onChange} placeholder="Type here" />);
        fireEvent.changeText(screen.getByPlaceholderText("Type here"), "hi");
        expect(onChange).toHaveBeenCalledWith("hi");
    });

    it("renders start and end text", () => {
        render(<Input startText="https://" endText=".com" />);
        expect(screen.getByText("https://")).toBeTruthy();
        expect(screen.getByText(".com")).toBeTruthy();
    });

    it("renders start and end adornments", () => {
        render(
            <Input
                startAdornment={<Text>start-adornment</Text>}
                endAdornment={<Text>end-adornment</Text>}
            />
        );
        expect(screen.getByText("start-adornment")).toBeTruthy();
        expect(screen.getByText("end-adornment")).toBeTruthy();
    });

    it("shows an error icon when invalid", () => {
        render(<Input invalid placeholder="Type here" />);
        expect(
            screen.UNSAFE_getByProps({ name: "alert-circle" })
        ).toBeTruthy();
    });

    it("hides the error icon when hideErrorIcon is true", () => {
        render(<Input invalid hideErrorIcon placeholder="Type here" />);
        expect(
            screen.UNSAFE_queryByProps({ name: "alert-circle" })
        ).toBeFalsy();
    });

    it("hides the error icon when disabled", () => {
        render(<Input invalid disabled placeholder="Type here" />);
        expect(
            screen.UNSAFE_queryByProps({ name: "alert-circle" })
        ).toBeFalsy();
    });

    it("disables editing and exposes disabled to assistive technology", () => {
        render(<Input disabled placeholder="Type here" />);
        const input = screen.getByPlaceholderText("Type here");
        expect(input).toHaveProp("editable", false);
        expect(input).toHaveProp("accessibilityState", { disabled: true });
    });

    it("disables editing but does not expose disabled when readOnly", () => {
        // RNTL's toBeDisabled() treats any non-editable TextInput as disabled
        // regardless of accessibilityState, so it can't be used to assert this
        // distinction — check the actual prop the component controls instead.
        render(<Input readOnly placeholder="Type here" />);
        const input = screen.getByPlaceholderText("Type here");
        expect(input).toHaveProp("editable", false);
        expect(input).toHaveProp("accessibilityState", { disabled: false });
    });

    it("merges a caller-supplied accessibilityState, with the component's own disabled value winning on conflict", () => {
        render(
            <Input
                accessibilityState={{ selected: true, disabled: true }}
                placeholder="Type here"
            />
        );
        expect(screen.getByPlaceholderText("Type here")).toHaveProp(
            "accessibilityState",
            { selected: true, disabled: false }
        );
    });

    it("calls the user-provided onFocus and onBlur handlers", () => {
        const onFocus = jest.fn();
        const onBlur = jest.fn();
        render(
            <Input
                onFocus={onFocus}
                onBlur={onBlur}
                placeholder="Type here"
            />
        );
        const input = screen.getByPlaceholderText("Type here");
        fireEvent(input, "focus");
        expect(onFocus).toHaveBeenCalledTimes(1);
        fireEvent(input, "blur");
        expect(onBlur).toHaveBeenCalledTimes(1);
    });
});
