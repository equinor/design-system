import React, { ReactNode, forwardRef, useState } from "react";
import {
    Platform,
    Text,
    TextInput,
    TextInputProps,
    View,
} from "react-native";
import { useStyles } from "../../hooks/useStyles";
import { Icon } from "../Icon";
import { inputTokenStyles } from "./inputStyle";

export type InputProps = {
    /**
     * A callback method invoked when the input component registers a change of text content.
     * @param contents A string representing the new text in the input field.
     */
    onChange?: (contents: string) => void;
    /**
     * A boolean value indicating whether or not the input component should span across multiple lines of text or wrapped to one line.
     */
    multiline?: boolean;
    /**
     * The text to display when the input component is empty.
     */
    placeholder?: string;
    /**
     * Prefix text displayed at the start of the input (e.g., "https://", "NOK", "€").
     */
    startText?: string;
    /**
     * Suffix text displayed at the end of the input (e.g., "EUR", "kg", ".com").
     */
    endText?: string;
    /**
     * An element displayed at the start of the input (e.g., an icon or button).
     */
    startAdornment?: ReactNode;
    /**
     * An element displayed at the end of the input (e.g., an icon or button).
     */
    endAdornment?: ReactNode;
    /**
     * Whether the input is in an invalid/error state.
     */
    invalid?: boolean;
    /**
     * Whether to hide the built-in error icon shown when invalid is true.
     */
    hideErrorIcon?: boolean;
    /**
     * When true, the value cannot be edited but can be selected and copied.
     * Unlike disabled, the field remains interactive and is not visually dimmed.
     * Note: on iOS, text selection requires multiline mode — single-line read-only
     * inputs are not selectable due to a platform constraint.
     */
    readOnly?: boolean;
    /**
     * When true, the input is fully non-interactive — no editing, selection, or focus.
     */
    disabled?: boolean;
} & Omit<TextInputProps, "onChange" | "onChangeText" | "readOnly">;

export const Input = forwardRef<TextInput, InputProps>(
    (
        {
            startText,
            endText,
            startAdornment,
            endAdornment,
            placeholder,
            onChange,
            multiline = false,
            invalid = false,
            hideErrorIcon = false,
            readOnly = false,
            disabled = false,
            ...rest
        },
        ref
    ) => {
        const [isSelected, setIsSelected] = useState<boolean>(false);
        const styles = useStyles(inputTokenStyles, {
            isSelected,
            invalid,
            readOnly,
            disabled,
        });
        const showErrorIcon = invalid && !hideErrorIcon && !disabled;

        const onFocus: TextInputProps["onFocus"] = (e) => {
            setIsSelected(true);
            rest.onFocus?.(e);
        };

        const onBlur: TextInputProps["onBlur"] = (e) => {
            setIsSelected(false);
            rest.onBlur?.(e);
        };

        return (
            <View style={styles.contentContainer}>
                {showErrorIcon && (
                    <Icon
                        name="alert-circle"
                        size={16}
                        color={styles.errorIcon.color}
                    />
                )}
                {startText != null && (
                    <Text style={styles.adornmentText}>{startText}</Text>
                )}
                {startAdornment}
                <View style={styles.textInputWrapper}>
                    <TextInput
                        {...rest}
                        ref={ref}
                        multiline={multiline}
                        editable={!disabled && !readOnly}
                        placeholder={placeholder}
                        onChangeText={onChange}
                        textAlignVertical="top"
                        placeholderTextColor={styles.placeholder.color}
                        onFocus={onFocus}
                        onBlur={onBlur}
                        accessibilityState={{
                            ...rest.accessibilityState,
                            disabled,
                        }}
                        style={[
                            styles.textInput,
                            Platform.OS === "web"
                                ? ({ outline: "none" } as Record<string, string>)
                                : {},
                            rest.style,
                        ]}
                    />
                </View>
                {endText != null && (
                    <Text style={styles.adornmentText}>{endText}</Text>
                )}
                {endAdornment}
            </View>
        );
    }
);

Input.displayName = "Input";
