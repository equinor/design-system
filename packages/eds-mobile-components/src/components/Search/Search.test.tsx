import React from "react";
import { fireEvent, render, screen } from "test-utils";
import { Search } from "./index";

describe("Search", () => {
    it("renders label, description, and helperMessage", async () => {
        await render(
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

    it("calls onChange when text changes", async () => {
        const onChange = jest.fn();
        await render(<Search onChange={onChange} placeholder="Search" />);
        await fireEvent.changeText(screen.getByPlaceholderText("Search"), "shoes");
        expect(onChange).toHaveBeenCalledWith("shoes");
    });

    it("syncs the displayed text when the value prop changes (controlled usage)", async () => {
        const { rerender } = await render(
            <Search value="shoes" placeholder="Search" />
        );
        expect(screen.getByPlaceholderText("Search")).toHaveProp(
            "value",
            "shoes"
        );
        await rerender(<Search value="boots" placeholder="Search" />);
        expect(screen.getByPlaceholderText("Search")).toHaveProp(
            "value",
            "boots"
        );
    });

    it("does not show a clear button when there is no text", async () => {
        await render(<Search placeholder="Search" />);
        expect(screen.queryByLabelText("Clear search")).toBeFalsy();
    });

    it("shows a clear button once there is text, and clears it on press", async () => {
        const onChange = jest.fn();
        await render(
            <Search
                defaultValue="shoes"
                onChange={onChange}
                placeholder="Search"
            />
        );
        await fireEvent.press(screen.getByLabelText("Clear search"));
        expect(onChange).toHaveBeenCalledWith("");
        expect(screen.getByPlaceholderText("Search")).toHaveProp(
            "value",
            ""
        );
    });

    it("does not show a clear button when disabled", async () => {
        await render(<Search defaultValue="shoes" disabled placeholder="Search" />);
        expect(screen.queryByLabelText("Clear search")).toBeFalsy();
    });

    it("does not show a clear button when readOnly", async () => {
        await render(<Search defaultValue="shoes" readOnly placeholder="Search" />);
        expect(screen.queryByLabelText("Clear search")).toBeFalsy();
    });

    it("does not render a Cancel button by default", async () => {
        await render(<Search placeholder="Search" />);
        expect(screen.queryByText("Cancel")).toBeFalsy();
    });

    it("renders a Cancel button when cancellable, clearing text and calling onCancelPress", async () => {
        // The Cancel button's wrapper sets pointerEvents to "none" until the
        // input is focused (it's an absolutely-positioned overlay that slides
        // in on focus), so it isn't press-able until the input is focused first.
        const onChange = jest.fn();
        const onCancelPress = jest.fn();
        await render(
            <Search
                cancellable
                defaultValue="shoes"
                onChange={onChange}
                onCancelPress={onCancelPress}
                placeholder="Search"
            />
        );
        await fireEvent(screen.getByPlaceholderText("Search"), "focus");
        await fireEvent.press(screen.getByText("Cancel"));
        expect(onChange).toHaveBeenCalledWith("");
        expect(onCancelPress).toHaveBeenCalledTimes(1);
    });

    it("shows the error icon when invalid", async () => {
        await render(<Search invalid placeholder="Search" />);
        expect(
            screen.getByTestId("icon-alert-circle")
        ).toBeTruthy();
    });

    it("hides the error icon when disabled even if invalid", async () => {
        await render(<Search invalid disabled placeholder="Search" />);
        expect(
            screen.queryByTestId("icon-alert-circle")
        ).toBeFalsy();
    });

    it("always shows the search icon", async () => {
        await render(<Search placeholder="Search" />);
        expect(screen.getByTestId("icon-magnify")).toBeTruthy();
    });
});
