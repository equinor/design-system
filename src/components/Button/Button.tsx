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
     * @deprecated use `trailingIcon` and/or `leadingIcon` instead.
     *
     * Name of the icon to use with the title.
     */
    iconName?: IconName;
    /**
     * @deprecated use `trailingIcon` and/or `leadingIcon` instead.
     *
     * Options for positioning the icon either to the left or to the right of the label text.
     */
    iconPosition?: "leading" | "trailing";
    /**
     * Name of the leading icon to display alongside the button title.
     */
    leadingIcon?: IconName;
    /**
     * Name of the trailing icon to display alongside the button title.
     */
    trailingIcon?: IconName;
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
            leadingIcon,
            trailingIcon,
            onPress = () => null,
            onPressIn = () => null,
            onPressOut = () => null,
            ...rest
        },
        ref
    ) => {
        const toggleData = useContext(ToggleButtonContext);
        const isToggleButton = !!toggleData;
        const groupData = useContext(ButtonGroupContext);

        const styles = useStyles(tokenStyles, {
            color,
            variant,
            isToggleButton,
            toggleStatus: isToggleButton ? toggleData.isSelected : false,
            groupData,
            disabled,
            fullWidth,
        });

        const leadingIconName =
            leadingIcon ?? (iconPosition === "leading" ? iconName : undefined);
        const trailingIconName =
            trailingIcon ?? (iconPosition === "trailing" ? iconName : undefined);
        const ButtonContent = () => (
            <View style={styles.labelContainer}>
                {leadingIconName && (
                    <View style={styles.leadingIcon}>
                        <Icon
                            name={leadingIconName}
                            color={styles.textStyle.color}
                        />
                    </View>
                )}
                <Typography
                    group="interactive"
                    variant="button"
                    style={styles.textStyle}
                >
                    {title}
                </Typography>
                {trailingIconName && (
                    <View style={styles.trailingIcon}>
                        <Icon
                            name={trailingIconName}
                            color={styles.textStyle.color}
                        />
                    </View>
                )}
            </View>
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
                    {loading ? (
                        <DotProgress
                            color={
                                disabled || variant !== "contained"
                                    ? "primary"
                                    : "neutral"
                            }
                            size={12}
                        />
                    ) : (
                        ButtonContent()
                    )}
                </PressableHighlight>
            </View>
        );
    }
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

const tokenStyles = EDSStyleSheet.create(
    (token, props: ButtonStyleSheetProps) => {
        const {
            color,
            isToggleButton,
            toggleStatus,
            groupData,
            disabled,
            fullWidth,
        } = props;
        let { variant } = props;

        variant = isToggleButton
            ? toggleStatus
                ? "contained"
                : "outlined"
            : variant;

        const backgroundColor = getBackgroundColorForButton(
            token,
            variant,
            color,
            disabled
        );
        let textColor =
            variant === "contained"
                ? token.colors.text.primaryInverted
                : token.colors.interactive[color];
        textColor = disabled ? token.colors.text.disabled : textColor;

        const leftRadius = !groupData.isFirstItem
            ? 0
            : token.geometry.border.elementBorderRadius;
        const rightRadius = !groupData.isLastItem
            ? 0
            : token.geometry.border.elementBorderRadius;
        const outlinedPaddingReduction =
            variant === "outlined" ? token.geometry.border.borderWidth : 0;

        return {
            colorContainer: {
                backgroundColor,
                borderTopLeftRadius: leftRadius,
                borderBottomLeftRadius: leftRadius,
                borderTopRightRadius: rightRadius,
                borderBottomRightRadius: rightRadius,
                borderColor: disabled
                    ? token.colors.text.disabled
                    : token.colors.interactive[color],
                borderWidth:
                    variant === "outlined"
                        ? token.geometry.border.borderWidth
                        : undefined,
                overflow: "hidden",
            },
            pressableContainer: {
                paddingHorizontal:
                    token.newSpacing.spacing.inset.lg.horizontal -
                    outlinedPaddingReduction,
                paddingVertical:
                    token.newSpacing.spacing.inset.lg.verticalSquished -
                    outlinedPaddingReduction,
                justifyContent: "center",
            },
            labelContainer: {
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "center",
                gap: token.newSpacing.spacing.icon.sm.gapHorizontal,
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
    }
);
