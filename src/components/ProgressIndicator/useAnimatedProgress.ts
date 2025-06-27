import { useEffect } from "react";
import { useSharedValue, withTiming, Easing } from "react-native-reanimated";
import { useToken } from "../../hooks/useToken";

const DEFAULT_PROGRESS = 0.618033; // Golden angle / ratio, if anyone is interested...

/**
 * Animates a value from its previous state to the next. If no value is provided, the returning animated value is defaulted.
 * @param value Value to animate to.
 * @param invertedDefaltProgress A boolean value indicating whether or not to invert the default progress value when no value is provided.
 * @returns An animated value that is animated towards the provided `value` argument.
 */
export const useAnimatedProgress = (value?: number, invertedDefaltProgress = false) => {
    const defaultProgress = invertedDefaltProgress ? 1 - DEFAULT_PROGRESS : DEFAULT_PROGRESS;
    const token = useToken();
    const progressValue = useSharedValue<number>(value ?? defaultProgress);

    useEffect(() => {
        if (value !== undefined) {
            progressValue.value = withTiming(value, {
                duration: token.timing.animation.normal,
                easing: Easing.inOut(Easing.ease),
            });
        } else {
            progressValue.value = withTiming(defaultProgress, {
                duration: token.timing.animation.normal,
                easing: Easing.inOut(Easing.ease),
            });
        }
    }, [value, defaultProgress, token.timing.animation.normal, progressValue]);

    return progressValue;
};
