import React, { forwardRef } from "react";
import { TextInput, View } from "react-native";
import { useStyles } from "../../hooks/useStyles";
import { EDSStyleSheet } from "../../styling";
import { Input, InputProps } from "../Input";
import { Typography } from "../Typography";

export type TextFieldProps = {
    /**
     * The label displayed above the input.
     */
    label?: string;
    /**
     * Indicator text shown inline after the label, e.g. "(Required)" or "(Optional)".
     */
    indicator?: string;
    /**
     * A description shown below the label, above the input. Use for additional context.
     */
    description?: string;
    /**
     * A message shown below the input.
     */
    helperMessage?: string;
} & InputProps;

export const TextField = forwardRef<TextInput, TextFieldProps>(
    (
        {
            label,
            indicator,
            description,
            helperMessage,
            invalid,
            disabled,
            accessibilityLabel,
            accessibilityHint,
            ...rest
        },
        ref
    ) => {
        const styles = useStyles(themeStyles, { disabled });

        return (
            <View style={styles.container}>
                {label && (
                    <View style={styles.labelSection}>
                        <View style={styles.labelRow}>
                            <Typography size="md" style={styles.label}>
                                {label}
                            </Typography>
                            {indicator && (
                                <Typography size="md" style={styles.indicator}>
                                    {indicator}
                                </Typography>
                            )}
                        </View>
                        {description && (
                            <Typography size="sm" style={styles.description}>
                                {description}
                            </Typography>
                        )}
                    </View>
                )}
                <Input
                    ref={ref}
                    invalid={invalid}
                    disabled={disabled}
                    accessibilityLabel={accessibilityLabel ?? label}
                    accessibilityHint={
                        accessibilityHint ??
                        ([description, helperMessage]
                            .filter(Boolean)
                            .join(". ") || undefined)
                    }
                    {...rest}
                />
                {helperMessage && (
                    <Typography size="sm" style={styles.helperMessage}>
                        {helperMessage}
                    </Typography>
                )}
            </View>
        );
    }
);

TextField.displayName = "TextField";

type TextFieldStyleProps = Pick<TextFieldProps, "disabled">;

const themeStyles = EDSStyleSheet.create(
    (token, { disabled }: TextFieldStyleProps) => ({
        container: {
            gap: token.spacing.spacing.vertical.twoXs,
        },
        labelSection: {
            gap: token.spacing.spacing.vertical.xs,
        },
        labelRow: {
            flexDirection: "row",
            gap: token.spacing.spacing.horizontal.xs,
        },
        label: {
            color: token.colors.text.neutral.strong,
        },
        indicator: {
            color: token.colors.text.neutral.subtle,
        },
        description: {
            color: token.colors.text.neutral.subtle,
        },
        helperMessage: {
            color: disabled
                ? token.colors.text.disabled
                : token.colors.text.neutral.subtle,
        },
    })
);
