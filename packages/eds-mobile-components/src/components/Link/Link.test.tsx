import React from "react";
import { StyleProp, StyleSheet, TextStyle } from "react-native";
import type { TestInstance } from "test-renderer";
import { fireEvent, render, screen } from "test-utils";
import { Link } from "./index";

const flattenStyle = (element: TestInstance) =>
    StyleSheet.flatten(element.props.style as StyleProp<TextStyle>);

describe("Link", () => {
    it("renders the label", async () => {
        await render(<Link>Learn more</Link>);
        expect(screen.getByText("Learn more")).toBeTruthy();
    });

    it("calls onPress when pressed", async () => {
        const onPress = jest.fn();
        await render(<Link onPress={onPress}>Learn more</Link>);
        await fireEvent.press(screen.getByRole("link"));
        expect(onPress).toHaveBeenCalledTimes(1);
    });

    it("exposes a link accessibility role", async () => {
        await render(<Link>Learn more</Link>);
        expect(screen.getByRole("link")).toBeTruthy();
    });

    it("does not render an external icon by default", async () => {
        await render(<Link>Learn more</Link>);
        expect(
            screen.queryByTestId("icon-open-in-new")
        ).toBeFalsy();
    });

    it("renders an external icon when external is true", async () => {
        await render(<Link external>Learn more</Link>);
        expect(
            screen.getByTestId("icon-open-in-new")
        ).toBeTruthy();
    });

    it("renders without error and applies a different fontSize for a different size", async () => {
        await render(<Link size="sm">Learn more</Link>);
        const small = flattenStyle(screen.getByText("Learn more"))?.fontSize;

        await render(<Link size="xl">Learn more</Link>);
        const large = flattenStyle(screen.getByText("Learn more"))?.fontSize;

        expect(large).not.toEqual(small);
    });

    describe("inline variant", () => {
        it("renders the label", async () => {
            await render(<Link variant="inline">Learn more</Link>);
            expect(screen.getByText("Learn more")).toBeTruthy();
        });

        it("calls onPress when pressed", async () => {
            const onPress = jest.fn();
            await render(
                <Link variant="inline" onPress={onPress}>
                    Learn more
                </Link>
            );
            await fireEvent.press(screen.getByRole("link"));
            expect(onPress).toHaveBeenCalledTimes(1);
        });

        it("renders an external icon when external is true", async () => {
            await render(
                <Link variant="inline" external>
                    Learn more
                </Link>
            );
            expect(
                screen.getByTestId("icon-open-in-new")
            ).toBeTruthy();
        });
    });
});
