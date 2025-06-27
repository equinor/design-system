import React from "react";
import { View, ViewProps } from "react-native";
import Animated, {
    useAnimatedProps,
    interpolate,
    useDerivedValue,
    Extrapolation,
} from "react-native-reanimated";
import { Rect, Svg } from "react-native-svg";
import { useToken } from "../../hooks/useToken";
import { ProgressIndicatorProps } from "./types";
import { useAnimatedProgress } from "./useAnimatedProgress";
import { useNoProgressAnimation } from "./useNoProgressAnimation";

export type LinearProgressProps = ProgressIndicatorProps & ViewProps;

const AnimatedRect = Animated.createAnimatedComponent(Rect);

const STROKE_WIDTH = 6;

export const LinearProgress = ({ value, ...rest }: LinearProgressProps) => {
    const token = useToken();
    const progressValue = useAnimatedProgress(value, true);
    const slideValue = useNoProgressAnimation();

    const progress = useDerivedValue(() => {
        return interpolate(progressValue.value, [0, 1], [0, 1], Extrapolation.CLAMP);
    });

    const slideX = useDerivedValue(() => {
        return interpolate(slideValue.value, [0, 1], [-0.5, 1]);
    });

    const animatedProps = useAnimatedProps(() => ({
        width: `${progress.value * 100}%`,
        x: value === undefined ? `${slideX.value * 100}%` : "0",
    }));

    return (
        <View style={[{ borderRadius: STROKE_WIDTH / 2, overflow: "hidden" }, rest.style]}>
            <Svg height={STROKE_WIDTH} width="100%">
                <Rect
                    x="0"
                    y="0"
                    width="100%"
                    height={STROKE_WIDTH}
                    fill={token.colors.interactive.primary}
                    opacity={0.16}
                    rx={STROKE_WIDTH / 2}
                    ry={STROKE_WIDTH / 2}
                />
                <AnimatedRect
                    y="0"
                    height={STROKE_WIDTH}
                    fill={token.colors.interactive.primary}
                    rx={STROKE_WIDTH / 2}
                    ry={STROKE_WIDTH / 2}
                    animatedProps={animatedProps}
                />
            </Svg>
        </View>
    );
};

LinearProgress.displayName = "LinearProgress";
