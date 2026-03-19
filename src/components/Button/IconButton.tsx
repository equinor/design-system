import React, { FC } from "react";
import { Pressable, View } from "react-native";
import { useStyles } from "../../hooks/useStyles";
import { EDSStyleSheet } from "../../styling";
import { IconName } from "../Icon";
import { ButtonBackground } from "./ButtonBackground";
import { ButtonIcon } from "./ButtonIcon";
import {
    BaseButtonProps,
    ButtonSize,
    ButtonTone,
    ButtonVariant,
} from "./types";

export type IconButtonProps = BaseButtonProps & {
    /**
     * Name of the icon.
     */
    name: IconName;
    /**
     * Boolean value indicating whether the button should be fully circular.
     * When false (default), the button is square with rounded corners.
     */
    round?: boolean;
};

export const IconButton: FC<IconButtonProps> = ({
    name,
    tone = "accent",
    size = "default",
    variant = "primary",
    round = false,
    disabled,
    ref,
    ...pressableProps
}) => {
    const styles = useStyles(tokenStyles, { variant, tone, size, round });

    return (
        <Pressable
            ref={ref}
            style={styles.container}
            accessibilityRole={"button"}
            accessibilityState={{ disabled: disabled ?? false, ...pressableProps.accessibilityState }}
            disabled={disabled}
            {...pressableProps}
        >
            {(pressedEvent) => (
                <ButtonBackground
                    isPressed={pressedEvent.pressed}
                    tone={tone}
                    variant={variant}
                    disabled={disabled ?? false}
                >
                    <View style={styles.iconContainer}>
                        <ButtonIcon
                            name={name}
                            tone={tone}
                            variant={variant}
                            size={size}
                            disabled={disabled ?? false}
                        />
                    </View>
                </ButtonBackground>
            )}
        </Pressable>
    );
};

IconButton.displayName = "Button.Icon";

type IconButtonStyleProps = {
    variant: ButtonVariant;
    tone: ButtonTone;
    size: ButtonSize;
    round: boolean;
};

const tokenStyles = EDSStyleSheet.create(
    (token, { variant, tone, size, round }: IconButtonStyleProps) => {
        const inset = {
            small: token.newSpacing.spacing.inset.xs,
            default: token.newSpacing.spacing.inset.sm,
            large: token.newSpacing.spacing.inset.md,
        }[size];

        const borderRadius = round
            ? token.newSpacing.spacing.borderRadius.pill
            : token.newSpacing.spacing.borderRadius.rounded;

        return {
            container: {
                borderRadius,
                overflow: "hidden",
                borderColor: token.newColors.border[tone].strong,
                borderWidth:
                    variant === "secondary"
                        ? token.newSpacing.sizing.stroke.thin
                        : 0,
            },
            iconContainer: {
                paddingVertical: inset.verticalSquared,
                paddingHorizontal: inset.horizontal,
                justifyContent: "center",
                alignItems: "center",
            },
        };
    }
);
