import React from "react";
import { useStyles } from "../../hooks/useStyles";
import { Color, EDSStyleSheet } from "../../styling";
import { View } from "react-native";
import { Typography } from "../Typography";
import { PressableHighlight } from "../PressableHighlight";
import { Icon, IconName } from "../Icon";
import { Button } from "../Button";

export type ChipProps = {
    /**
     * Text to render in the chip.
     */
    title: string;
    /**
     * The chip variant. Determines the visual expression of the chip.
     */
    variant?: "default" | "error" | "active";
    /**
     * Whether or not the chip should respond to touch events and render its disabled state.
     */
    disabled?: boolean;
    /**
     * Callback method invoked when the user presses the chip. If not defined, the chip is not pressable.
     */
    onPress?: () => void;
    /**
     * Callback method invoked when the user presses the delete button on the right side of the chip. If not defined, the chip does not render the delete button.
     */
    onDelete?: () => void;
    /**
     * Optional icon to render on the left side of the chip.
     */
    iconName?: IconName;
};

const ICON_SIZE = 16;

export const Chip = ({
    title,
    variant = "default",
    disabled = false,
    onPress,
    onDelete,
    iconName,
}: ChipProps) => {
    const styles = useStyles(themeStyles, { variant, disabled });

    const iconColor = variant === "error" ? "danger" : "primary";
    return (
        <View style={styles.chipContainer}>
            <PressableHighlight
                style={styles.pressableContainer}
                onPress={onPress}
                disabled={disabled || !onPress}
            >
                <View style={styles.chipContent}>
                    {iconName && <Icon name={iconName} size={ICON_SIZE} style={styles.text} />}
                    <Typography style={styles.text} group="ui" variant="chipAndBadge">
                        {title}
                    </Typography>
                    {onDelete && (
                        <View>
                            <View style={styles.dummyElement} />
                            <View style={styles.floatingCloseButton}>
                                <Button.Icon
                                    name="close"
                                    iconSize={ICON_SIZE}
                                    variant="ghost"
                                    color={iconColor}
                                    disabled={disabled}
                                    onPress={onDelete}
                                />
                            </View>
                        </View>
                    )}
                </View>
            </PressableHighlight>
        </View>
    );
};

Chip.displayName = "Chip";

type ChipTokenProps = Required<Pick<ChipProps, "variant" | "disabled">>;

const themeStyles = EDSStyleSheet.create((theme, props: ChipTokenProps) => {
    const { variant, disabled } = props;

    const variantToBackgroundColor: Record<typeof variant, Color> = {
        default: theme.colors.container.background,
        active: theme.colors.interactive.selectedHighlight,
        error: "rgba(0,0,0,0)",
    };

    const variantToTextColor: Record<typeof variant, Color> = {
        default: theme.colors.interactive.primary,
        active: theme.colors.interactive.primary,
        error: theme.colors.feedback.danger,
    };
    const basePaddingVertical = theme.spacing.chip.paddingVertical;
    const paddingVertical =
        variant === "error"
            ? basePaddingVertical - theme.geometry.border.borderWidth
            : basePaddingVertical;

    return {
        chipContainer: {
            alignSelf: "flex-start",
            justifyContent: "center",
            backgroundColor: disabled
                ? theme.colors.interactive.disabled
                : variantToBackgroundColor[variant],
            borderRadius: 9999,
            borderColor: theme.colors.feedback.danger,
            borderWidth: variant === "error" ? theme.geometry.border.borderWidth : undefined,
            overflow: "hidden",
        },
        pressableContainer: {
            paddingVertical,
            paddingHorizontal: theme.spacing.chip.paddingHorizontal,
        },
        chipContent: {
            alignItems: "center",
            flexDirection: "row",
            gap: theme.spacing.button.iconGap,
        },
        text: {
            color: disabled ? theme.colors.text.disabled : variantToTextColor[variant],
        },
        dummyElement: {
            width: ICON_SIZE,
            height: ICON_SIZE,
        },
        floatingCloseButton: {
            position: "absolute",
            width: "100%",
            height: "100%",
            justifyContent: "center",
            alignItems: "center",
        },
    };
});
