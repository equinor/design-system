import React from "react";
import { AccessibilityInfo } from "react-native";
import { fireEvent, render, screen } from "test-utils";
import { TextArea } from "./index";

afterEach(() => {
    jest.clearAllMocks();
});

describe("TextArea", () => {
    it("renders label, indicator, description, and helperMessage", () => {
        render(
            <TextArea
                label="Bio"
                indicator="(Optional)"
                description="Tell us about yourself"
                helperMessage="Max 500 characters"
            />
        );
        expect(screen.getByText("Bio")).toBeTruthy();
        expect(screen.getByText("(Optional)")).toBeTruthy();
        expect(screen.getByText("Tell us about yourself")).toBeTruthy();
        expect(screen.getByText("Max 500 characters")).toBeTruthy();
    });

    it("does not render indicator or description when no label is given", () => {
        render(
            <TextArea indicator="(Optional)" description="Tell us about yourself" />
        );
        expect(screen.queryByText("(Optional)")).toBeFalsy();
        expect(screen.queryByText("Tell us about yourself")).toBeFalsy();
    });

    it("shows the character count with maxLength", () => {
        render(<TextArea showCharacterCount maxLength={10} defaultValue="hi" />);
        expect(screen.getByText("2 / 10")).toBeTruthy();
    });

    it("shows the character count without maxLength", () => {
        render(<TextArea showCharacterCount defaultValue="hi" />);
        expect(screen.getByText("2")).toBeTruthy();
    });

    it("updates the character count as text changes", () => {
        render(<TextArea showCharacterCount maxLength={10} />);
        fireEvent.changeText(screen.getByDisplayValue(""), "hello");
        expect(screen.getByText("5 / 10")).toBeTruthy();
    });

    it("does not show a character count section by default", () => {
        render(<TextArea defaultValue="hi" />);
        expect(screen.queryByText("2")).toBeFalsy();
    });

    it("announces the character count when crossing the 80% threshold", () => {
        render(<TextArea showCharacterCount maxLength={10} />);
        fireEvent.changeText(screen.getByDisplayValue(""), "12345678");
        expect(
            AccessibilityInfo.announceForAccessibility
        ).toHaveBeenCalledWith("8 of 10 characters");
    });

    it("announces the character count when reaching the max", () => {
        render(<TextArea showCharacterCount maxLength={10} />);
        fireEvent.changeText(screen.getByDisplayValue(""), "1234567890");
        expect(
            AccessibilityInfo.announceForAccessibility
        ).toHaveBeenCalledWith("10 of 10 characters");
    });

    it("disables editing and exposes disabled to assistive technology", () => {
        render(<TextArea disabled defaultValue="hi" />);
        const input = screen.getByDisplayValue("hi");
        expect(input).toHaveProp("editable", false);
        expect(input).toHaveProp("accessibilityState", { disabled: true });
    });

    it("forwards readOnly to the underlying input without affecting editable or disabled state", () => {
        // Unlike Input (which folds readOnly into a single editable
        // computation), TextArea passes editable={!disabled} and the native
        // readOnly prop independently — confirm they don't affect each other.
        render(<TextArea readOnly defaultValue="hi" />);
        const input = screen.getByDisplayValue("hi");
        expect(input).toHaveProp("readOnly", true);
        expect(input).toHaveProp("editable", true);
        expect(input).toHaveProp("accessibilityState", { disabled: false });
    });

    it("merges a caller-supplied accessibilityState, with the component's own disabled value winning on conflict", () => {
        render(
            <TextArea
                accessibilityState={{ selected: true, disabled: true }}
                defaultValue="hi"
            />
        );
        expect(screen.getByDisplayValue("hi")).toHaveProp(
            "accessibilityState",
            { selected: true, disabled: false }
        );
    });

    it("defaults accessibilityHint to the joined description and helperMessage", () => {
        render(
            <TextArea
                description="Tell us about yourself"
                helperMessage="Max 500 characters"
            />
        );
        expect(screen.getByDisplayValue("")).toHaveProp(
            "accessibilityHint",
            "Tell us about yourself. Max 500 characters"
        );
    });
});
