import React, { forwardRef } from "react";
import {
    GestureResponderEvent,
    Pressable,
    PressableProps,
    StyleProp,
    StyleSheet,
    ViewStyle,
} from "react-native";
import Animated from "react-native-reanimated";
import type { ViewRef } from "../../utils/nativeRefs";
import { useFadeAnimation } from "../../styling/animations";
import { DisabledPressable } from "./DisabledPressable";

export type PressableHightlightProps = {
    /**
     * Whether or not the pressable surface should be disabled or not.
     */
    disabled?: boolean;
    /**
     * The style to apply to this component.
     * Any stylings based on the state of the press is applied on top of this.
     */
    style?: StyleProp<ViewStyle>;
} & Omit<PressableProps, "children">;

export const PressableHighlight: React.ForwardRefExoticComponent<
    React.PropsWithoutRef<React.PropsWithChildren<PressableHightlightProps>> & React.RefAttributes<ViewRef>
> = forwardRef<
    ViewRef,
    React.PropsWithChildren<PressableHightlightProps>
>(
    (
        {
            style,
            children,
            disabled,
            onPress,

            ...rest
        }: React.PropsWithChildren<PressableHightlightProps>,
        ref
    ) => {
        const { handlePressIn, handlePressOut, animatedStyle } =
            useFadeAnimation();

        const PressableComponent = disabled ? DisabledPressable : Pressable;

        const handlePressInEvent = (event: GestureResponderEvent) => {
            if (!disabled) {
                handlePressIn();
                rest.onPressIn?.(event);
            }
        };

        const handlePressOutEvent = (event: GestureResponderEvent) => {
            if (!disabled) {
                handlePressOut();
                rest.onPressOut?.(event);
            }
        };

        const handlePressEvent = (event: GestureResponderEvent) => {
            if (!disabled && onPress) {
                onPress(event);
            }
        };

        return (
            <PressableComponent
                {...rest}
                ref={ref}
                style={style}
                onPressIn={handlePressInEvent}
                onPressOut={handlePressOutEvent}
                onPress={handlePressEvent}
                disabled={disabled}
            >
                <Animated.View style={[animatedStyle, styles.overlay]} />
                {children}
            </PressableComponent>
        );
    }
);

const styles = StyleSheet.create({
    overlay: {
        ...StyleSheet.absoluteFill,
    },
});

PressableHighlight.displayName = "PressableHighlight";
