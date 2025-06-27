import React, { useEffect } from "react";
import { View, ViewProps } from "react-native";
import Animated, {
    Easing,
    Extrapolation,
    interpolate,
    SharedValue,
    useAnimatedProps,
    useSharedValue,
    withRepeat,
    withTiming,
} from "react-native-reanimated";
import { Circle, CircleProps, Svg } from "react-native-svg";
import { useStyles } from "../../hooks/useStyles";
import { useToken } from "../../hooks/useToken";
import { EDSStyleSheet } from "../../styling";

type DotProps = {
    radius: number;
    count: number;
    index: number;
    progress: SharedValue<number>;
} & CircleProps;

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

const Dot = ({ radius: originalRadius, count, index, progress, ...circleProps }: DotProps) => {
    const animatedProps = useAnimatedProps<CircleProps>(() => {
        const parts = 2;
        const wholeCount = count - 1 + 2 * parts;
        const inputs = [
            index / wholeCount,
            (index + parts) / wholeCount,
            (index + 2 * parts) / wholeCount,
        ];
        const radiusScale = interpolate(progress.value, inputs, [0.7, 1, 0.7], Extrapolation.CLAMP);
        const opacityScale = interpolate(
            progress.value,
            inputs,
            [0.3, 1, 0.3],
            Extrapolation.CLAMP,
        );
        return {
            r: originalRadius * radiusScale,
            opacity: opacityScale,
        };
    });

    return <AnimatedCircle animatedProps={animatedProps} fill="black" {...circleProps} />;
};

export type DotProgressProps = {
    /**
     * Height of the indicator. The width is calculated automatically based on this value.
     */
    size?: number;
    /**
     * Color theme of the indicator.
     */
    color?: "neutral" | "primary";
} & ViewProps;

export const DotProgress = ({ color, size: optionalSize, ...rest }: DotProgressProps) => {
    const styles = useStyles(themeStyles, { color });
    const token = useToken();

    const progress = useSharedValue(0);
    useEffect(() => {
        progress.value = withRepeat(
            withTiming(1, {
                duration: 1500,
                easing: Easing.inOut(Easing.sin),
            }),
            0,
        );
    }, [progress]);

    const height = optionalSize ?? token.geometry.dimension.icon.size;
    const width = height * 4;
    const radius = height / 2;

    return (
        <View {...rest} style={[{ width, height }, rest.style]}>
            <Svg height={height} width={width}>
                <Dot
                    progress={progress}
                    radius={radius}
                    index={0}
                    count={3}
                    cx={radius}
                    cy="50%"
                    fill={styles.circle.color}
                />
                <Dot
                    progress={progress}
                    radius={radius}
                    index={1}
                    count={3}
                    cx="50%"
                    cy="50%"
                    fill={styles.circle.color}
                />
                <Dot
                    progress={progress}
                    radius={radius}
                    index={2}
                    count={3}
                    cx={width - radius}
                    cy="50%"
                    fill={styles.circle.color}
                />
            </Svg>
        </View>
    );
};

DotProgress.displayName = "DotProgress";

type CircularProgressStyleProps = Pick<DotProgressProps, "color">;

const themeStyles = EDSStyleSheet.create((theme, props: CircularProgressStyleProps) => {
    const color =
        props.color === "neutral"
            ? theme.colors.container.default
            : theme.colors.interactive.primary;
    return {
        circle: {
            color,
        },
    };
});
