import React from "react";
import { StyleProp, StyleSheet, TextStyle } from "react-native";
import type { TestInstance } from "test-renderer";
import { render, screen } from "test-utils";
import { Typography } from "./index";

const flattenStyle = (element: TestInstance) =>
    StyleSheet.flatten(element.props.style as StyleProp<TextStyle>);

describe("Typography", () => {
    it("renders the given text", async () => {
        await render(<Typography>Hello world</Typography>);
        expect(screen.getByText("Hello world")).toBeTruthy();
    });

    it("forwards text props such as numberOfLines", async () => {
        await render(<Typography numberOfLines={2}>Hello world</Typography>);
        expect(screen.getByText("Hello world")).toHaveProp(
            "numberOfLines",
            2
        );
    });

    it("renders without error and applies a different fontWeight for a different weight", async () => {
        await render(<Typography weight="lighter">Hello world</Typography>);
        const lighter = flattenStyle(
            screen.getByText("Hello world")
        )?.fontWeight;

        await render(<Typography weight="bolder">Hello world</Typography>);
        const bolder = flattenStyle(
            screen.getByText("Hello world")
        )?.fontWeight;

        expect(bolder).not.toEqual(lighter);
    });

    it("renders without error and applies a different letterSpacing for a different tracking", async () => {
        await render(<Typography tracking="normal">Hello world</Typography>);
        const normal = flattenStyle(
            screen.getByText("Hello world")
        )?.letterSpacing;

        await render(<Typography tracking="tight">Hello world</Typography>);
        const tight = flattenStyle(
            screen.getByText("Hello world")
        )?.letterSpacing;

        expect(tight).not.toEqual(normal);
    });

    it("renders without error and applies a different lineHeight for a different lineHeight value", async () => {
        await render(<Typography lineHeight="default">Hello world</Typography>);
        const defaultLineHeight = flattenStyle(
            screen.getByText("Hello world")
        )?.lineHeight;

        await render(<Typography lineHeight="squished">Hello world</Typography>);
        const squishedLineHeight = flattenStyle(
            screen.getByText("Hello world")
        )?.lineHeight;

        expect(squishedLineHeight).not.toEqual(defaultLineHeight);
    });
});

describe("Typography.Header", () => {
    it("renders the given text", async () => {
        await render(<Typography.Header>Page title</Typography.Header>);
        expect(screen.getByText("Page title")).toBeTruthy();
    });

    it("forwards text props such as numberOfLines", async () => {
        await render(
            <Typography.Header numberOfLines={1}>
                Page title
            </Typography.Header>
        );
        expect(screen.getByText("Page title")).toHaveProp(
            "numberOfLines",
            1
        );
    });
});
