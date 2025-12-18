import {
    interpolateColor,
    useAnimatedStyle,
    useSharedValue,
    withTiming,
} from "react-native-reanimated";
import { useToken } from "../hooks/useToken";

type DurationKey = "none" | "fast" | "normal" | "slow";

type FadeAnimationOptions = {
    fadeInDuration?: DurationKey;
    fadeOutDuration?: DurationKey;
};

export const useFadeAnimation = ({
    fadeInDuration = "none",
    fadeOutDuration = "normal",
}: FadeAnimationOptions = {}) => {
    const token = useToken();
    const fadeAnimation = useSharedValue(0);

    const durationMapping: Record<DurationKey, number> = {
        none: 0,
        fast: token.timing.animation.fast,
        normal: token.timing.animation.normal,
        slow: token.timing.animation.slow,
    };

    // Extract token values before using in worklet
    const pressedOverlay = token.colors.interactive.pressedOverlay;

    const handlePressIn = () => {
        fadeAnimation.value = withTiming(1, {
            duration: durationMapping[fadeInDuration],
        });
    };

    const handlePressOut = () => {
        fadeAnimation.value = withTiming(0, {
            duration: durationMapping[fadeOutDuration],
        });
    };

    const animatedStyle = useAnimatedStyle(() => {
        return {
            backgroundColor: interpolateColor(
                fadeAnimation.value,
                [0, 1],
                ["transparent", pressedOverlay]
            ),
        };
    });

    return {
        handlePressIn,
        handlePressOut,
        animatedStyle,
    };
};
