import React, { forwardRef, useEffect, useRef } from "react";
import { View, ViewProps, Animated, Easing } from "react-native";
import { useStyles } from "../../hooks/useStyles";
import { EDSStyleSheet } from "../../styling";
import { PressableHighlight } from "../PressableHighlight";
import { useToken } from "../../hooks/useToken";

export type SmallSwitchProps = {
    onChange?: (isActive: boolean) => void;
    active?: boolean;
    disabled?: boolean;
};

const KNOB_SIZE = 7;
const WIDTH = 23;
const HEIGHT = 23;

export const SmallSwitch = forwardRef<View, SmallSwitchProps & ViewProps>(
    ({ onChange = () => null, active = false, disabled = false, ...rest }, ref) => {
        const styles = useStyles(themeStyles, {
            disabled,
            isActive: active,
        });

        const token = useToken();

        const knobProgressValue = useRef(new Animated.Value(active ? 1 : 0)).current;

        const activeKnobAnimation = Animated.timing(knobProgressValue, {
            toValue: 1,
            duration: token.timing.animation.slow,
            useNativeDriver: true,
            easing: Easing.inOut(Easing.ease),
        });

        const inactiveKnobAnimation = Animated.timing(knobProgressValue, {
            toValue: 0,
            duration: token.timing.animation.slow,
            useNativeDriver: true,
            easing: Easing.inOut(Easing.ease),
        });

        const displacement = knobProgressValue.interpolate({
            inputRange: [0, 1],
            outputRange: [0, WIDTH - KNOB_SIZE - 4],
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
                        style={{ position: "absolute", transform: [{ translateX: displacement }] }}
                    >
                        <View style={styles.knob} />
                    </Animated.View>
                </View>
            </PressableHighlight>
        );
    },
);

SmallSwitch.displayName = "Switch.Small";

type SmallSwitchStyleSheetProps = {
    isActive: boolean;
    disabled: boolean;
};

const themeStyles = EDSStyleSheet.create((theme, props: SmallSwitchStyleSheetProps) => {
    const { disabled, isActive } = props;

    const disabledKnobColor = theme.colors.text.disabled;

    const backgroundHeight = KNOB_SIZE * 1.78;

    return {
        toggleContainer: {
            flexDirection: "row",
            alignItems: "center",
        },
        pressableContainer: {
            height: HEIGHT,
            width: WIDTH,
            padding: 20,
            borderRadius: 100,
            alignItems: "center",
            justifyContent: "center",
            overflow: "hidden",
        },
        statusBackground: {
            width: WIDTH,
            height: backgroundHeight,
            borderRadius: HEIGHT / 2,
            backgroundColor: disabled
                ? theme.colors.interactive.disabled
                : isActive
                ? theme.colors.interactive.primary
                : theme.colors.text.tertiary,
        },
        knob: {
            width: KNOB_SIZE,
            margin: 2,
            height: KNOB_SIZE,
            borderRadius: KNOB_SIZE / 2,
            backgroundColor: disabled
                ? disabledKnobColor
                : isActive
                ? theme.colors.border.light
                : theme.colors.border.light,
        },
    };
});
