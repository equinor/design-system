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
            disabled={disabled}
            {...pressableProps}
            accessibilityState={{
                ...pressableProps.accessibilityState,
                disabled: disabled ?? false,
            }}
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
        const inset = (
            {
                small: token.spacing.spacing.inset.xs,
                default: token.spacing.spacing.inset.sm,
            } satisfies Record<ButtonSize, unknown>
        )[size];

        const borderRadius = round
            ? token.spacing.spacing.borderRadius.pill
            : token.spacing.spacing.borderRadius.rounded;

        return {
            container: {
                borderRadius,
                overflow: "hidden",
                borderColor: token.colors.border[tone].strong,
                borderWidth:
                    variant === "secondary"
                        ? token.spacing.sizing.stroke.thin
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
