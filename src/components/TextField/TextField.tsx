import { TextInput, View } from "react-native";
import { Input, InputProps } from "../Input";
import React, { forwardRef } from "react";
import { Typography } from "../Typography";
import { EDSStyleSheet } from "../../styling";
import { useStyles } from "../../hooks/useStyles";
import { Label } from "../Label";
import { IconName, Icon } from "../Icon";

export type TextFieldProps = {
    /**
     * A small label text to add to the input field.
     */
    label?: string;

    /**
     * Secondary small label text to add to the input field.
     */
    meta?: string;

    /**
     * A unit describing the input value.
     */
    unit?: string;

    /**
     * A description to add to the input field. Use this when more information around the input field is required.
     */
    helperText?: string;

    /**
     * An icon to add to inside the inputfield on the right side.
     */
    inputIcon?: IconName;

    /**
     * An icon to add to the left of the helper text.
     */
    helperIcon?: IconName;
} & Omit<InputProps, "leftAdornment" | "rightAdornment">;

export const TextField = forwardRef<TextInput, TextFieldProps>(
    ({ unit, helperText, label, meta, helperIcon, inputIcon, ...rest }, ref) => {
        const styles = useStyles(themeStyles, { variant: rest.variant });
        return (
            <View style={{ flexGrow: 1 }}>
                {label && <Label style={styles.label} label={label} meta={meta} />}
                <Input
                    ref={ref}
                    rightAdornments={
                        <View style={styles.adornmentStyle}>
                            {inputIcon && (
                                <Icon name={inputIcon} size={20} style={styles.iconColor} />
                            )}
                            {unit && (
                                <Typography variant="label" color="textTertiary">
                                    {unit}
                                </Typography>
                            )}
                        </View>
                    }
                    {...rest}
                />
                {helperText && (
                    <View
                        style={{ flexDirection: "row", alignItems: "center", paddingHorizontal: 8 }}
                    >
                        {helperIcon && (
                            <Icon name={helperIcon} size={20} style={styles.iconColor} />
                        )}
                        <Label style={styles.label} label={helperText} />
                    </View>
                )}
            </View>
        );
    },
);

TextField.displayName = "TextField";

type TextFieldStyleProps = Pick<TextFieldProps, "variant">;
const themeStyles = EDSStyleSheet.create((theme, props: TextFieldStyleProps) => ({
    adornmentStyle: {
        justifyContent: "center",
        paddingHorizontal: theme.spacing.textField.paddingHorizontal,
        flexDirection: "row",
        gap: theme.spacing.element.paddingHorizontal,
        alignItems: "center",
    },
    label: {
        paddingHorizontal: theme.spacing.textField.paddingHorizontal,
        color: props.variant ? theme.colors.interactive[props.variant] : theme.colors.text.tertiary,
    },
    iconColor: {
        color: props.variant ? theme.colors.interactive[props.variant] : theme.colors.text.primary,
    },
}));
