import React from "react";
import { StyleProp, StyleSheet, TextStyle } from "react-native";
import type { ReactTestInstance } from "react-test-renderer";
import { fireEvent, render, screen } from "test-utils";
import { Link } from "./index";

const flattenStyle = (element: ReactTestInstance) =>
    StyleSheet.flatten(element.props.style as StyleProp<TextStyle>);

describe("Link", () => {
    it("renders the label", () => {
        render(<Link>Learn more</Link>);
        expect(screen.getByText("Learn more")).toBeTruthy();
    });

    it("calls onPress when pressed", () => {
        const onPress = jest.fn();
        render(<Link onPress={onPress}>Learn more</Link>);
        fireEvent.press(screen.getByRole("link"));
        expect(onPress).toHaveBeenCalledTimes(1);
    });

    it("exposes a link accessibility role", () => {
        render(<Link>Learn more</Link>);
        expect(screen.getByRole("link")).toBeTruthy();
    });

    it("does not render an external icon by default", () => {
        render(<Link>Learn more</Link>);
        expect(
            screen.UNSAFE_queryByProps({ name: "open-in-new" })
        ).toBeFalsy();
    });

    it("renders an external icon when external is true", () => {
        render(<Link external>Learn more</Link>);
        expect(
            screen.UNSAFE_getByProps({ name: "open-in-new" })
        ).toBeTruthy();
    });

    it("renders without error and applies a different fontSize for a different size", () => {
        render(<Link size="sm">Learn more</Link>);
        const small = flattenStyle(screen.getByText("Learn more"))?.fontSize;

        render(<Link size="xl">Learn more</Link>);
        const large = flattenStyle(screen.getByText("Learn more"))?.fontSize;

        expect(large).not.toEqual(small);
    });

    describe("inline variant", () => {
        it("renders the label", () => {
            render(<Link variant="inline">Learn more</Link>);
            expect(screen.getByText("Learn more")).toBeTruthy();
        });

        it("calls onPress when pressed", () => {
            const onPress = jest.fn();
            render(
                <Link variant="inline" onPress={onPress}>
                    Learn more
                </Link>
            );
            fireEvent.press(screen.getByRole("link"));
            expect(onPress).toHaveBeenCalledTimes(1);
        });

        it("renders an external icon when external is true", () => {
            render(
                <Link variant="inline" external>
                    Learn more
                </Link>
            );
            expect(
                screen.UNSAFE_getByProps({ name: "open-in-new" })
            ).toBeTruthy();
        });
    });
});
