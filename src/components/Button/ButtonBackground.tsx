import React, { FC, PropsWithChildren, useEffect, useMemo } from "react";
import Animated, {
    cancelAnimation,
    interpolateColor,
    useAnimatedStyle,
    useSharedValue,
    withTiming,
} from "react-native-reanimated";
import { useToken } from "../../hooks/useToken";
import { ButtonVariant } from "./types";
import { VARIANT_MAP } from "./utils";

type ButtonBackgroundProps = {
    isPressed: boolean;
    tone: "accent" | "neutral" | "danger";
    variant: ButtonVariant;
    disabled: boolean;
};

export const ButtonBackground: FC<PropsWithChildren<ButtonBackgroundProps>> = ({
    isPressed,
    tone,
    variant,
    disabled,
    children,
}) => {
    const animationValue = useSharedValue(0);
    useEffect(() => {
        cancelAnimation(animationValue);
        if (isPressed) {
            animationValue.value = 1;
            return;
        }
        animationValue.value = withTiming(0, { duration: 150 });
    }, [isPressed, animationValue]);

    const token = useToken();

    const backgroundColors = useMemo(() => {
        const mappedVariant = VARIANT_MAP[variant];
        let defaultColor = token.newColors.bg[tone][mappedVariant]
            .default as string;
        const pressedColor = token.newColors.bg[tone][mappedVariant].active;
        if (disabled) {
            defaultColor = token.newColors.bg.disabled;
        }

        if (__DEV__ && (variant === "ghost" || variant === "secondary")) {
            console.assert(
                /^#[0-9a-fA-F]{6}$/.test(defaultColor),
                `ButtonBackground: expected a 6-digit hex color for ghost/secondary transparent animation, got "${defaultColor}". The "00" alpha suffix trick will produce an invalid color.`
            );
        }

        return {
            // Append "00" alpha to create a transparent version of the pressed color.
            // This allows interpolateColor to animate in LAB space without hue shift on press.
            // NOTE: Only works when the token returns a 6-digit hex string (e.g. #rrggbb).
            default: `${defaultColor}${variant === "ghost" || variant === "secondary" ? "00" : ""}`,
            pressed: pressedColor,
        };
    }, [token, disabled, tone, variant]);

    const animatedStyle = useAnimatedStyle(() => ({
        backgroundColor: interpolateColor(
            animationValue.value,
            [0, 1],
            [backgroundColors.default, backgroundColors.pressed],
            "LAB"
        ),
    }));

    return <Animated.View style={animatedStyle}>{children}</Animated.View>;
};
