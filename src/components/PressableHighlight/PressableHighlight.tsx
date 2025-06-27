import React, { forwardRef } from "react";
import { Pressable, PressableProps, StyleProp, StyleSheet, View, ViewStyle } from "react-native";
import Animated from "react-native-reanimated";
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

export const PressableHighlight = forwardRef<
    View,
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
        ref,
    ) => {
        const { handlePressIn, handlePressOut, animatedStyle } = useFadeAnimation();

        const PressableComponent = disabled ? DisabledPressable : Pressable;

        return (
            <PressableComponent
                {...rest}
                ref={ref}
                style={style}
                onPressIn={event => !disabled && (handlePressIn(), rest.onPressIn?.(event))}
                onPressOut={event => !disabled && (handlePressOut(), rest.onPressOut?.(event))}
                onPress={event => !disabled && !!onPress && onPress(event)}
                disabled={disabled}
            >
                <Animated.View style={[animatedStyle, styles.overlay]} />
                {children}
            </PressableComponent>
        );
    },
);

const styles = StyleSheet.create({
    overlay: {
        ...StyleSheet.absoluteFillObject,
    },
});

PressableHighlight.displayName = "PressableHighlight";
