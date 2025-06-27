import React, { forwardRef, useContext } from "react";
import { GestureResponderEvent, View, ViewProps } from "react-native";
import { useStyles } from "../../hooks/useStyles";
import { EDSStyleSheet } from "../../styling";
import { getBackgroundColorForButton } from "../../utils/getBackgroundColorForButton";
import { Icon, IconName } from "../Icon";
import { PressableHighlight } from "../PressableHighlight";
import { DotProgress } from "../ProgressIndicator";
import { Typography } from "../Typography";
import { ButtonGroupContext } from "./ButtonGroup";
import { ToggleButtonContext } from "./ToggleButton";

export type ButtonSpecificProps = {
    /**
     * Label text of the button.
     */
    title: string;
    /**
     * Color theme of the button.
     */
    color?: "primary" | "secondary" | "danger";
    /**
     * Button variant. This value works with the `color` prop to set the theming of the button.
     */
    variant?: "contained" | "outlined" | "ghost";
    /**
     * Boolean value indicating whether or not the button is in its disabled state.
     */
    disabled?: boolean;
    /**
     * Boolean value indicating whether or not the button should be in its loading state.
     */
    loading?: boolean;
    /**
     * Boolean value that floats icon to the edges of the button while the text stay centered.
     */
    fullWidth?: boolean;
    /**
     * Name of the icon to use with the title.
     */
    iconName?: IconName;
    /**
     * Options for positioning the icon either to the left or to the right of the label text.
     */
    iconPosition?: "leading" | "trailing";
    /**
     * Callback method invoked when the user presses the button.
     */
    onPress?: () => void;
    /**
     * Callback method invoked when the user presses in the button.
     */
    onPressIn?: (event: GestureResponderEvent) => void;
    /**
     * Callback method invoked when the user presses out the button.
     */
    onPressOut?: (event: GestureResponderEvent) => void;
};

export type ButtonProps = ButtonSpecificProps & ViewProps;

export const Button = forwardRef<View, ButtonProps>(
    (
        {
            title,
            color = "primary",
            variant = "contained",
            disabled = false,
            loading = false,
            fullWidth = false,
            iconName,
            iconPosition = "leading",
            onPress = () => null,
            onPressIn = () => null,
            onPressOut = () => null,
            ...rest
        },
        ref,
    ) => {
        const toggleData = useContext(ToggleButtonContext);
        const isToggleButton = !!toggleData;
        const groupData = useContext(ButtonGroupContext);

        const styles = useStyles(themeStyles, {
            color,
            variant,
            isToggleButton,
            toggleStatus: isToggleButton ? toggleData.isSelected : false,
            groupData,
            disabled,
            fullWidth,
        });

        const ButtonContent = () => (
            <>
                {iconName && iconPosition === "leading" && (
                    <View style={styles.leadingIcon}>
                        <Icon name={iconName} color={styles.textStyle.color} />
                    </View>
                )}
                <Typography group="interactive" variant="button" style={styles.textStyle}>
                    {title}
                </Typography>
                {iconName && iconPosition === "trailing" && (
                    <View style={styles.trailingIcon}>
                        <Icon name={iconName} color={styles.textStyle.color} />
                    </View>
                )}
            </>
        );

        return (
            <View ref={ref} style={[styles.colorContainer, rest.style]}>
                <PressableHighlight
                    disabled={disabled}
                    onPress={onPress}
                    onPressIn={onPressIn}
                    onPressOut={onPressOut}
                    style={styles.pressableContainer}
                >
                    <View style={styles.labelContainer}>
                        {loading ? (
                            <DotProgress
                                color={disabled || variant !== "contained" ? "primary" : "neutral"}
                                size={12}
                            />
                        ) : (
                            ButtonContent()
                        )}
                    </View>
                </PressableHighlight>
            </View>
        );
    },
);

Button.displayName = "Button";

type ButtonStyleSheetProps = {
    groupData: { isFirstItem: boolean; isLastItem: boolean };
    isToggleButton: boolean;
    toggleStatus: boolean;
    color: "primary" | "secondary" | "danger";
    variant: "contained" | "outlined" | "ghost";
    disabled: boolean;
    fullWidth: boolean;
};

const themeStyles = EDSStyleSheet.create((theme, props: ButtonStyleSheetProps) => {
    const { color, isToggleButton, toggleStatus, groupData, disabled, fullWidth } = props;
    let { variant } = props;

    variant = isToggleButton ? (toggleStatus ? "contained" : "outlined") : variant;

    const backgroundColor = getBackgroundColorForButton(theme, variant, color, disabled);
    let textColor =
        variant === "contained"
            ? theme.colors.text.primaryInverted
            : theme.colors.interactive[color];
    textColor = disabled ? theme.colors.text.disabled : textColor;

    const leftRadius = !groupData.isFirstItem ? 0 : theme.geometry.border.elementBorderRadius;
    const rightRadius = !groupData.isLastItem ? 0 : theme.geometry.border.elementBorderRadius;
    const outlinedPaddingReduction = variant === "outlined" ? theme.geometry.border.borderWidth : 0;
    const outlinedHeightReduction = outlinedPaddingReduction * 2;
    return {
        colorContainer: {
            backgroundColor,
            borderTopLeftRadius: leftRadius,
            borderBottomLeftRadius: leftRadius,
            borderTopRightRadius: rightRadius,
            borderBottomRightRadius: rightRadius,
            borderColor: disabled ? theme.colors.text.disabled : theme.colors.interactive[color],
            borderWidth: variant === "outlined" ? theme.geometry.border.borderWidth : undefined,
            overflow: "hidden",
        },
        pressableContainer: {
            minHeight: theme.geometry.dimension.button.minHeight - outlinedHeightReduction,
            paddingHorizontal: theme.spacing.button.paddingHorizontal - outlinedPaddingReduction,
            paddingVertical: theme.spacing.button.paddingVertical - outlinedPaddingReduction,
            justifyContent: "center"
        },
        labelContainer: {
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "center",
            gap: theme.spacing.button.iconGap,
        },
        trailingIcon: {
            flex: fullWidth ? 1 : undefined,
            alignItems: fullWidth ? "flex-end" : undefined,
        },
        leadingIcon: {
            flex: fullWidth ? 1 : undefined,
            alignItems: fullWidth ? "flex-start" : undefined,
        },
        textStyle: {
            color: textColor,
            position: fullWidth ? "absolute" : undefined,
        },
    };
});
