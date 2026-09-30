import React from "react";
import { fireEvent, render, screen } from "test-utils";
import { Search } from "./index";

describe("Search", () => {
    it("renders label, description, and helperMessage", () => {
        render(
            <Search
                label="Search products"
                description="Search by name or SKU"
                helperMessage="Press enter to search"
            />
        );
        expect(screen.getByText("Search products")).toBeTruthy();
        expect(screen.getByText("Search by name or SKU")).toBeTruthy();
        expect(screen.getByText("Press enter to search")).toBeTruthy();
    });

    it("calls onChange when text changes", () => {
        const onChange = jest.fn();
        render(<Search onChange={onChange} placeholder="Search" />);
        fireEvent.changeText(screen.getByPlaceholderText("Search"), "shoes");
        expect(onChange).toHaveBeenCalledWith("shoes");
    });

    it("syncs the displayed text when the value prop changes (controlled usage)", () => {
        const { rerender } = render(
            <Search value="shoes" placeholder="Search" />
        );
        expect(screen.getByPlaceholderText("Search")).toHaveProp(
            "value",
            "shoes"
        );
        rerender(<Search value="boots" placeholder="Search" />);
        expect(screen.getByPlaceholderText("Search")).toHaveProp(
            "value",
            "boots"
        );
    });

    it("does not show a clear button when there is no text", () => {
        render(<Search placeholder="Search" />);
        expect(screen.queryByLabelText("Clear search")).toBeFalsy();
    });

    it("shows a clear button once there is text, and clears it on press", () => {
        const onChange = jest.fn();
        render(
            <Search
                defaultValue="shoes"
                onChange={onChange}
                placeholder="Search"
            />
        );
        fireEvent.press(screen.getByLabelText("Clear search"));
        expect(onChange).toHaveBeenCalledWith("");
        expect(screen.getByPlaceholderText("Search")).toHaveProp(
            "value",
            ""
        );
    });

    it("does not show a clear button when disabled", () => {
        render(<Search defaultValue="shoes" disabled placeholder="Search" />);
        expect(screen.queryByLabelText("Clear search")).toBeFalsy();
    });

    it("does not show a clear button when readOnly", () => {
        render(<Search defaultValue="shoes" readOnly placeholder="Search" />);
        expect(screen.queryByLabelText("Clear search")).toBeFalsy();
    });

    it("does not render a Cancel button by default", () => {
        render(<Search placeholder="Search" />);
        expect(screen.queryByText("Cancel")).toBeFalsy();
    });

    it("renders a Cancel button when cancellable, clearing text and calling onCancelPress", () => {
        // The Cancel button's wrapper sets pointerEvents to "none" until the
        // input is focused (it's an absolutely-positioned overlay that slides
        // in on focus), so it isn't press-able until the input is focused first.
        const onChange = jest.fn();
        const onCancelPress = jest.fn();
        render(
            <Search
                cancellable
                defaultValue="shoes"
                onChange={onChange}
                onCancelPress={onCancelPress}
                placeholder="Search"
            />
        );
        fireEvent(screen.getByPlaceholderText("Search"), "focus");
        fireEvent.press(screen.getByText("Cancel"));
        expect(onChange).toHaveBeenCalledWith("");
        expect(onCancelPress).toHaveBeenCalledTimes(1);
    });

    it("shows the error icon when invalid", () => {
        render(<Search invalid placeholder="Search" />);
        expect(
            screen.UNSAFE_getByProps({ name: "alert-circle" })
        ).toBeTruthy();
    });

    it("hides the error icon when disabled even if invalid", () => {
        render(<Search invalid disabled placeholder="Search" />);
        expect(
            screen.UNSAFE_queryByProps({ name: "alert-circle" })
        ).toBeFalsy();
    });

    it("always shows the search icon", () => {
        render(<Search placeholder="Search" />);
        expect(screen.UNSAFE_getByProps({ name: "magnify" })).toBeTruthy();
    });
});
