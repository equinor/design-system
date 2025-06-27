import React, { forwardRef, useEffect, useRef } from "react";
import { Animated, Easing, View, ViewProps } from "react-native";
import { useStyles } from "../../hooks/useStyles";
import { useToken } from "../../hooks/useToken";
import { EDSStyleSheet } from "../../styling";
import { Paper } from "../Paper";
import { PressableHighlight } from "../PressableHighlight";
export type SwitchProps = {
    onChange?: (isActive: boolean) => void;
    color?: "primary" | "secondary" | "danger";
    active?: boolean;
    disabled?: boolean;
};

const KNOB_SIZE = 20;
const WIDTH = 60;
const HEIGHT = 60;

export const Switch = forwardRef<View, SwitchProps & ViewProps>(
    (
        { color = "primary", onChange = () => null, active = false, disabled = false, ...rest },
        ref,
    ) => {
        const styles = useStyles(themeStyles, {
            color,
            disabled,
            isActive: active,
        });

        const token = useToken();

        const progressValue = useRef(new Animated.Value(active ? 1 : 0)).current;

        const activeKnobAnimation = Animated.timing(progressValue, {
            toValue: 1,
            duration: token.timing.animation.slow,
            useNativeDriver: true,
            easing: Easing.inOut(Easing.ease),
        });

        const inactiveKnobAnimation = Animated.timing(progressValue, {
            toValue: 0,
            duration: token.timing.animation.slow,
            useNativeDriver: true,
            easing: Easing.inOut(Easing.ease),
        });

        const displacement = progressValue.interpolate({
            inputRange: [0, 1],
            outputRange: [0, WIDTH - KNOB_SIZE * 1.7],
            extrapolate: "clamp",
        });

        const backgroundScale = progressValue.interpolate({
            inputRange: [0, 1],
            outputRange: [0, 1],
            extrapolate: "clamp",
        });

        const backgroundDisplacement = progressValue.interpolate({
            inputRange: [0, 1],
            outputRange: [-(WIDTH - KNOB_SIZE) / 2, 0],
            extrapolate: "clamp",
        });

        useEffect(() => {
            if (active) {
                activeKnobAnimation.start();
            } else {
                inactiveKnobAnimation.start();
            }
        }, [active]);

        const handlePress = () => {
            const newState = !active;
            onChange(newState);
        };

        return (
            <PressableHighlight
                disabled={disabled}
                onPress={handlePress}
                style={styles.pressableContainer}
            >
                <View ref={ref} style={[styles.toggleContainer, rest.style]}>
                    <View style={styles.statusBackground}></View>

                    <Animated.View
                        style={[
                            styles.animatedBackground,
                            {
                                transform: [
                                    {
                                        translateX: backgroundDisplacement,
                                    },
                                    { scaleX: backgroundScale },
                                ],
                            },
                        ]}
                    ></Animated.View>

                    <Animated.View
                        style={{ position: "absolute", transform: [{ translateX: displacement }] }}
                    >
                        <Paper elevation="raised" style={styles.knob} />
                    </Animated.View>
                </View>
            </PressableHighlight>
        );
    },
);

Switch.displayName = "Switch";

type ToggleStyleSheetProps = {
    isActive: boolean;
    color: "primary" | "secondary" | "danger";
    disabled: boolean;
};

const themeStyles = EDSStyleSheet.create((theme, props: ToggleStyleSheetProps) => {
    const { color, disabled, isActive } = props;

    const activeBackgroundColor = theme.colors.interactive[color];
    const inactiveBackgroundColor = theme.colors.interactive.disabled;

    const knobColor = theme.colors.text.tertiary;
    const disabledKnobColor = theme.colors.text.disabled;
    const backgroundHeight = KNOB_SIZE * 0.5;

    let backgroundColor = isActive ? activeBackgroundColor : inactiveBackgroundColor;
    backgroundColor = disabled ? theme.colors.interactive.disabled : backgroundColor;

    return {
        toggleContainer: {
            flexDirection: "row",
            alignItems: "center",
        },
        pressableContainer: {
            height: HEIGHT,
            width: WIDTH,
            padding: 7,
            borderRadius: WIDTH / 2,
            alignItems: "center",
            justifyContent: "center",
            overflow: "hidden",
        },
        statusBackground: {
            flex: 1,
            height: backgroundHeight,
            borderRadius: KNOB_SIZE,
            backgroundColor: theme.colors.interactive.pressedOverlay,
        },
        knob: {
            width: KNOB_SIZE,
            height: KNOB_SIZE,
            borderRadius: KNOB_SIZE / 2,
            backgroundColor: disabled
                ? disabledKnobColor
                : isActive
                ? activeBackgroundColor
                : knobColor,
        },
        animatedBackground: {
            position: "absolute",
            height: backgroundHeight,
            borderRadius: KNOB_SIZE,
            backgroundColor:
                disabled || !isActive
                    ? theme.colors.interactive.pressedOverlay
                    : theme.colors.interactive.selectedHighlight,

            width: WIDTH - KNOB_SIZE,
        },
    };
});
