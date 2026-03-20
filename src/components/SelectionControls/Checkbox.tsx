import React, { useMemo } from "react";
import { Pressable, Text } from "react-native";
import Animated, {
    cancelAnimation,
    interpolateColor,
    useSharedValue,
    useAnimatedStyle,
    withTiming,
} from "react-native-reanimated";
import { useStyles } from "../../hooks/useStyles";
import { useToken } from "../../hooks/useToken";
import { EDSStyleSheet } from "../../styling";
import { Icon } from "../Icon/Icon";

export type CheckboxProps = {
    /**
     * Callback method invoked when the user presses the checkbox.
     */
    onPress?: (checked: boolean) => void;
    /**
     * Whether the checkbox is in its disabled state.
     */
    disabled?: boolean;
    /**
     * Whether the checkbox should be in its checked state.
     */
    checked?: boolean;
    /**
     * Whether the checkbox should be in its indeterminate state.
     * Takes precedence over `checked`.
     */
    indeterminate?: boolean;
    /**
     * Label displayed next to the checkbox. When omitted, an
     * `accessibilityLabel` must be provided for screen readers.
     */
    label?: string;
    /**
     * Accessible name for screen readers. Required when `label` is not provided.
     */
    accessibilityLabel?: string;
};

export const Checkbox = ({
    onPress,
    checked = false,
    disabled = false,
    indeterminate = false,
    label,
    accessibilityLabel,
}: CheckboxProps) => {
    const hasLabel = label != null;
    const styles = useStyles(themeStyles, { disabled, indeterminate, hasLabel });

    const token = useToken();
    const pressedColor = token.newColors.bg.accent.fillMuted.default;
    const backgroundColors = useMemo(
        () => ({ default: `${pressedColor}00`, pressed: pressedColor }),
        [pressedColor],
    );

    const animationValue = useSharedValue(0);

    const animatedContainerStyle = useAnimatedStyle(() => ({
        backgroundColor: interpolateColor(
            animationValue.value,
            [0, 1],
            [backgroundColors.default, backgroundColors.pressed],
            "LAB",
        ),
    }));

    const handlePressIn = () => {
        if (!disabled) {
            cancelAnimation(animationValue);
            animationValue.value = 1;
        }
    };

    const handlePressOut = () => {
        cancelAnimation(animationValue);
        animationValue.value = withTiming(0, { duration: 150 });
    };

    const handlePress = () => {
        if (!disabled) {
            onPress?.(!checked);
        }
    };

    const iconName = indeterminate
        ? "minus-box"
        : checked
          ? "checkbox-marked"
          : "checkbox-blank-outline";

    return (
        <Pressable
            onPress={handlePress}
            onPressIn={handlePressIn}
            onPressOut={handlePressOut}
            disabled={!onPress || disabled}
            accessibilityRole="checkbox"
            accessibilityState={{
                checked: indeterminate ? "mixed" : checked,
                disabled,
            }}
            accessibilityLabel={accessibilityLabel ?? label}
        >
            <Animated.View style={[styles.container, animatedContainerStyle]}>
                <Icon
                    name={iconName}
                    size={styles.icon.size}
                    color={styles.icon.color}
                />
                {label != null && <Text style={styles.label}>{label}</Text>}
            </Animated.View>
        </Pressable>
    );
};

type CheckboxStyleProps = {
    disabled: boolean;
    indeterminate: boolean;
    hasLabel: boolean;
};

const themeStyles = EDSStyleSheet.create(
    (theme, props: CheckboxStyleProps) => {
        const checkboxSize = theme.newSpacing.sizing.icon.lg;
        const touchTargetSize = theme.newSpacing.sizing.selectable.lg;

        return {
            container: {
                flexDirection: "row",
                alignItems: "center",
                gap: theme.newSpacing.spacing.icon.lg.gapHorizontal,
                ...(props.hasLabel
                    ? {
                          paddingHorizontal:
                              theme.newSpacing.spacingProportions.squished.lg
                                  .horizontal,
                          paddingVertical:
                              theme.newSpacing.spacingProportions.squished.lg
                                  .vertical,
                          borderRadius:
                              theme.newSpacing.spacing.borderRadius.rounded,
                      }
                    : {
                          width: touchTargetSize,
                          height: touchTargetSize,
                          justifyContent: "center",
                          borderRadius: touchTargetSize / 2,
                      }),
            },
            icon: {
                size: checkboxSize,
                color: props.disabled
                    ? theme.newColors.text.disabled
                    : theme.newColors.bg.accent.fillEmphasis.default,
            },
            label: {
                fontSize: 14,
                fontWeight: "500",
                lineHeight: 20,
                letterSpacing: 0,
                color: props.disabled
                    ? theme.newColors.text.disabled
                    : theme.newColors.text.neutral.strong,
            },
        };
    }
);
