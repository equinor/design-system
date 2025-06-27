import React from "react";
import { View, ViewProps } from "react-native";
import Animated, { interpolate, useAnimatedProps, useAnimatedStyle } from "react-native-reanimated";
import { Circle, Svg } from "react-native-svg";
import { useStyles } from "../../hooks/useStyles";
import { EDSStyleSheet } from "../../styling";
import { ProgressIndicatorProps } from "./types";
import { useAnimatedProgress } from "./useAnimatedProgress";
import { useNoProgressAnimation } from "./useNoProgressAnimation";

export type CircularProgressProps = {
    /**
     * Diameter of the circle.
     */
    size?: number;
    /**
     * Color theme of the indicator.
     */
    color?: "neutral" | "primary";
} & ProgressIndicatorProps &
    ViewProps;

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

const RELATIVE_SIZE_VALUE = 12;
const STROKE_WIDTH = 1.0;
const RADIUS = (RELATIVE_SIZE_VALUE - STROKE_WIDTH) / 2;
const CIRCUMFERENCE = Math.PI * 2 * RADIUS;

export const CircularProgress = ({ color, value, size = 48, ...rest }: CircularProgressProps) => {
    const styles = useStyles(themeStyles, { color });
    const progressValue = useAnimatedProgress(value);
    const rotationValue = useNoProgressAnimation();

    const strokeDashoffset = useAnimatedProps(() => {
        const dashOffset = interpolate(progressValue.value, [0, 1], [2 * Math.PI * RADIUS, 0]);
        return {
            strokeDashoffset: dashOffset,
        };
    }, [progressValue]);

    const animatedStyle = useAnimatedStyle(() => {
        if (value !== undefined) {
            return { transform: [{ rotate: `-90deg` }] };
        }
        const phi = interpolate(rotationValue.value, [0, 1], [-90, 270]);
        return {
            transform: [{ rotate: `${phi}deg` }],
        };
    }, [rotationValue, value]);

    return (
        <View {...rest} style={[{ width: size, height: size }, rest.style]}>
            <Animated.View style={animatedStyle}>
                <Svg
                    width={size}
                    height={size}
                    role="progressbar"
                    viewBox={`0 0 ${RELATIVE_SIZE_VALUE} ${RELATIVE_SIZE_VALUE}`}
                >
                    <Circle
                        opacity={styles.circle.opacity}
                        stroke={styles.circle.color}
                        strokeWidth={STROKE_WIDTH}
                        fill="none"
                        cx={RELATIVE_SIZE_VALUE / 2}
                        cy={RELATIVE_SIZE_VALUE / 2}
                        r={RADIUS}
                    />
                    <AnimatedCircle
                        fill="none"
                        cx={RELATIVE_SIZE_VALUE / 2}
                        cy={RELATIVE_SIZE_VALUE / 2}
                        r={RADIUS}
                        stroke={styles.circle.color}
                        strokeWidth={STROKE_WIDTH}
                        strokeDasharray={`${CIRCUMFERENCE} ${CIRCUMFERENCE}`}
                        animatedProps={strokeDashoffset}
                        strokeLinecap="round"
                    />
                </Svg>
            </Animated.View>
        </View>
    );
};

CircularProgress.displayName = "CircularProgress";

type CircularProgressStyleProps = Pick<CircularProgressProps, "color">;
const themeStyles = EDSStyleSheet.create((theme, props: CircularProgressStyleProps) => {
    const color =
        props.color === "neutral"
            ? theme.colors.container.default
            : theme.colors.interactive.primary;
    return {
        circle: {
            color,
            opacity: props.color === "neutral" ? 0.0 : 0.16,
        },
    };
});
