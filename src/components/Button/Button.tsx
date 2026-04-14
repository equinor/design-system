import React, { FC } from "react";
import { Pressable, View } from "react-native";
import { useStyles } from "../../hooks/useStyles";
import { EDSStyleSheet } from "../../styling";
import { IconName } from "../Icon";
import { Typography } from "../Typography";
import { ButtonBackground } from "./ButtonBackground";
import { ButtonIcon } from "./ButtonIcon";
import {
    BaseButtonProps,
    ButtonSize,
    ButtonTone,
    ButtonVariant,
} from "./types";
import { SIZE_MAP, TEXT_VARIANT_MAP } from "./utils";

export type ButtonProps = BaseButtonProps & {
    /**
     * Label text of the button.
     */
    label: string;
    /**
     * Name of the leading icon to display alongside the button label.
     */
    leadingIcon?: IconName;
    /**
     * Name of the trailing icon to display alongside the button label.
     */
    trailingIcon?: IconName;
};

export const Button: FC<ButtonProps> = ({
    label,
    tone = "accent",
    size = "default",
    variant = "primary",
    leadingIcon,
    trailingIcon,
    ref,
    disabled = false,
    ...pressableProps
}) => {
    const styles = useStyles(tokenStyles, {
        variant,
        tone,
        size,
        disabled: disabled ?? false,
    });

    return (
        <Pressable
            ref={ref}
            style={styles.container}
            accessibilityRole={"button"}
            disabled={disabled}
            {...pressableProps}
            accessibilityState={{
                disabled: disabled ?? false,
                ...pressableProps.accessibilityState,
            }}
        >
            {(pressedEvent) => (
                <ButtonBackground
                    isPressed={pressedEvent.pressed}
                    tone={tone}
                    variant={variant}
                    disabled={disabled ?? false}
                >
                    <View style={styles.squareButtonContainer}>
                        {leadingIcon && (
                            <ButtonIcon
                                name={leadingIcon}
                                tone={tone}
                                variant={variant}
                                size={size}
                                disabled={disabled ?? false}
                            />
                        )}
                        <Typography
                            variant="button"
                            style={styles.text}
                        >
                            {label}
                        </Typography>
                        {trailingIcon && (
                            <ButtonIcon
                                name={trailingIcon}
                                tone={tone}
                                variant={variant}
                                size={size}
                                disabled={disabled ?? false}
                            />
                        )}
                    </View>
                </ButtonBackground>
            )}
        </Pressable>
    );
};

type ButtonStylesProps = {
    tone: ButtonTone;
    variant: ButtonVariant;
    size: ButtonSize;
    disabled: boolean;
};

const tokenStyles = EDSStyleSheet.create(
    (token, { variant, tone, size, disabled }: ButtonStylesProps) => {
        const borderColor = token.newColors.border[tone].strong;
        const sizeKey = SIZE_MAP[size];

        const textColor = disabled
            ? token.newColors.text.disabled
            : token.newColors.text[tone][TEXT_VARIANT_MAP[variant]];

        return {
            container: {
                borderRadius: token.newSpacing.spacing.borderRadius.rounded,
                overflow: "hidden",
                borderColor,
                borderWidth:
                    variant === "secondary"
                        ? token.newSpacing.sizing.stroke.thin
                        : 0,
            },
            squareButtonContainer: {
                borderRadius: token.newSpacing.spacing.borderRadius.rounded,
                paddingVertical:
                    token.newSpacing.spacing.inset[sizeKey].verticalSquished,
                paddingHorizontal:
                    token.newSpacing.spacing.inset[sizeKey].horizontal,
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "center",
                gap: token.newSpacing.spacing.icon[sizeKey].gapHorizontal,
            },
            text: {
                color: textColor,
            },
        };
    }
);
