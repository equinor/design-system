import { useEffect } from "react";
import { useSharedValue, withTiming, withRepeat } from "react-native-reanimated";
import { useToken } from "../../hooks/useToken";

/**
 * Creates a smooth looping animated value.
 * @returns An animated value between 0 and 1 representing the current loop progress.
 */
export const useNoProgressAnimation = () => {
    const loopValue = useSharedValue<number>(0);
    const token = useToken();

    useEffect(() => {
        const animationConfig = {
            duration: 1500,
        };
        loopValue.value = withRepeat(withTiming(1, animationConfig), -1, false);
    }, [token.timing.animation.normal, loopValue]);

    return loopValue;
};
