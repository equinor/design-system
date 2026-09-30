import React from "react";
import { render, screen } from "test-utils";
import { TextField } from "./index";

describe("TextField", () => {
    it("renders label, indicator, description, and helperMessage", () => {
        render(
            <TextField
                label="Email"
                indicator="(Required)"
                description="We'll never share it"
                helperMessage="Must be a valid email"
            />
        );
        expect(screen.getByText("Email")).toBeTruthy();
        expect(screen.getByText("(Required)")).toBeTruthy();
        expect(screen.getByText("We'll never share it")).toBeTruthy();
        expect(screen.getByText("Must be a valid email")).toBeTruthy();
    });

    it("does not render indicator or description when no label is given", () => {
        render(
            <TextField
                indicator="(Required)"
                description="We'll never share it"
                placeholder="Type here"
            />
        );
        expect(screen.queryByText("(Required)")).toBeFalsy();
        expect(screen.queryByText("We'll never share it")).toBeFalsy();
    });

    it("defaults accessibilityLabel to the label", () => {
        render(<TextField label="Email" placeholder="Type here" />);
        expect(screen.getByPlaceholderText("Type here")).toHaveProp(
            "accessibilityLabel",
            "Email"
        );
    });

    it("lets an explicit accessibilityLabel override the label", () => {
        render(
            <TextField
                label="Email"
                accessibilityLabel="Custom label"
                placeholder="Type here"
            />
        );
        expect(screen.getByPlaceholderText("Type here")).toHaveProp(
            "accessibilityLabel",
            "Custom label"
        );
    });

    it("defaults accessibilityHint to the joined description and helperMessage", () => {
        render(
            <TextField
                description="We'll never share it"
                helperMessage="Must be a valid email"
                placeholder="Type here"
            />
        );
        expect(screen.getByPlaceholderText("Type here")).toHaveProp(
            "accessibilityHint",
            "We'll never share it. Must be a valid email"
        );
    });

    it("lets an explicit accessibilityHint override the default", () => {
        render(
            <TextField
                description="We'll never share it"
                accessibilityHint="Custom hint"
                placeholder="Type here"
            />
        );
        expect(screen.getByPlaceholderText("Type here")).toHaveProp(
            "accessibilityHint",
            "Custom hint"
        );
    });

    it("forwards disabled to the underlying input", () => {
        render(<TextField disabled placeholder="Type here" />);
        const input = screen.getByPlaceholderText("Type here");
        expect(input).toHaveProp("editable", false);
        expect(input).toHaveProp("accessibilityState", { disabled: true });
    });

    it("forwards invalid to the underlying input", () => {
        render(<TextField invalid placeholder="Type here" />);
        expect(
            screen.UNSAFE_getByProps({ name: "alert-circle" })
        ).toBeTruthy();
    });
});
