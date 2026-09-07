import React, { Ref, useEffect, useRef, useState } from "react";
import { AccessibilityInfo, TextInput, TextInputProps, View } from "react-native";
import { useStyles } from "../../hooks/useStyles";
import { EDSStyleSheet } from "../../styling";
import { Icon } from "../Icon";
import { Typography } from "../Typography";

// Aligns the error icon with the visual text cap height.
// Compensates for the ascender space above the cap line in the line height box.
const ICON_BASELINE_OFFSET = 3;

export type TextAreaProps = {
    label?: string;
    indicator?: string;
    description?: string;
    helperMessage?: string;
    invalid?: boolean;
    disabled?: boolean;
    readOnly?: boolean;
    /**
     * Shows a character count below the TextArea.
     * Displays "n / maxLength" when maxLength is set, otherwise just "n".
     */
    showCharacterCount?: boolean;
    ref?: Ref<TextInput>;
} & Omit<TextInputProps, "multiline" | "editable" | "readOnly" | "scrollEnabled">;

export const TextArea = ({
    label,
    indicator,
    description,
    helperMessage,
    invalid = false,
    disabled = false,
    readOnly = false,
    showCharacterCount = false,
    maxLength,
    value,
    defaultValue,
    onChangeText,
    onFocus,
    onBlur,
    style: userStyle,
    accessibilityState: userAccessibilityState,
    accessibilityLabel,
    accessibilityHint,
    ref,
    ...rest
}: TextAreaProps) => {
    const [isFocused, setIsFocused] = useState(false);
    const [charCount, setCharCount] = useState(
        () => String(value ?? defaultValue ?? "").length
    );

    useEffect(() => {
        if (value !== undefined) setCharCount(String(value).length);
    }, [value]);

    const announcedThresholdRef = useRef<number | null>(null);

    useEffect(() => {
        if (!showCharacterCount || maxLength === undefined) return;

        const threshold =
            charCount >= maxLength
                ? maxLength
                : charCount >= maxLength * 0.8
                ? maxLength * 0.8
                : null;

        if (threshold !== null && threshold !== announcedThresholdRef.current) {
            announcedThresholdRef.current = threshold;
            AccessibilityInfo.announceForAccessibility(
                `${charCount} of ${maxLength} characters`
            );
        }
    }, [charCount, maxLength, showCharacterCount]);

    const styles = useStyles(themeStyles, { isFocused, invalid, disabled, readOnly });

    const showHelperRow = !!helperMessage || showCharacterCount;
    const showErrorIcon = invalid && !disabled;

    const charCountLabel =
        maxLength !== undefined ? `${charCount} / ${maxLength}` : `${charCount}`;

    return (
        <View style={styles.container}>
            {label && (
                <View style={styles.labelSection}>
                    <View style={styles.labelRow}>
                        <Typography size="md" style={styles.label}>
                            {label}
                        </Typography>
                        {indicator && (
                            <Typography size="md" style={styles.subtleText}>
                                {indicator}
                            </Typography>
                        )}
                    </View>
                    {description && (
                        <Typography size="sm" style={styles.subtleText}>
                            {description}
                        </Typography>
                    )}
                </View>
            )}
            <View style={styles.inputContainer}>
                <View
                    style={styles.resizeHandle}
                    accessible={false}
                    importantForAccessibility="no-hide-descendants"
                >
                    <Icon name="resize-bottom-right" size={14} color={styles.resizeHandle.color} />
                </View>
                {showErrorIcon && (
                    <View
                        style={styles.errorIconContainer}
                        accessible={false}
                        importantForAccessibility="no-hide-descendants"
                    >
                        <Icon
                            name="alert-circle"
                            size={16}
                            color={styles.errorIcon.color}
                        />
                    </View>
                )}
                <View style={styles.inputWrapper}>
                    <TextInput
                        ref={ref}
                        multiline
                        scrollEnabled={false}
                        editable={!disabled}
                        readOnly={readOnly}
                        maxLength={maxLength}
                        value={value}
                        defaultValue={defaultValue}
                        onChangeText={(text) => {
                            setCharCount(text.length);
                            onChangeText?.(text);
                        }}
                        onFocus={(e) => {
                            setIsFocused(true);
                            onFocus?.(e);
                        }}
                        onBlur={(e) => {
                            setIsFocused(false);
                            onBlur?.(e);
                        }}
                        textAlignVertical="top"
                        placeholderTextColor={styles.placeholder.color}
                        accessibilityLabel={accessibilityLabel ?? label}
                        accessibilityHint={
                            accessibilityHint ??
                            ([description, helperMessage]
                                .filter(Boolean)
                                .join(". ") || undefined)
                        }
                        accessibilityState={{ ...userAccessibilityState, disabled }}
                        style={[styles.textInput, userStyle]}
                        {...rest}
                    />
                </View>
            </View>
            {showHelperRow && (
                <View style={styles.helperRow}>
                    {helperMessage && (
                        <Typography size="sm" style={styles.helperMessage}>
                            {helperMessage}
                        </Typography>
                    )}
                    {showCharacterCount && (
                        <Typography
                            size="sm"
                            style={styles.charCount}
                            accessibilityLiveRegion={
                                maxLength !== undefined &&
                                charCount >= maxLength * 0.8
                                    ? "polite"
                                    : "none"
                            }
                        >
                            {charCountLabel}
                        </Typography>
                    )}
                </View>
            )}
        </View>
    );
};

type TextAreaStyleProps = Pick<
    TextAreaProps,
    "invalid" | "disabled" | "readOnly"
> & { isFocused: boolean };

const themeStyles = EDSStyleSheet.create(
    (token, { isFocused, invalid, disabled, readOnly }: TextAreaStyleProps) => {
        const backgroundColor = invalid
            ? token.colors.bg.danger.canvas
            : token.colors.bg.input;

        const borderWidth = disabled ? 0 : 1;
        const borderColor = (() => {
            if (disabled) return "transparent";
            if (readOnly) return token.colors.bg.disabled;
            if (invalid) {
                return isFocused
                    ? token.colors.border.danger.strong
                    : token.colors.border.danger.subtle;
            }
            return isFocused
                ? token.colors.border.neutral.strong
                : token.colors.border.neutral.subtle;
        })();

        const textColor = disabled
            ? token.colors.text.disabled
            : readOnly
            ? token.colors.border.neutral.strong
            : token.colors.text.neutral.strong;

        return {
            container: {
                // Figma specifies vertical.sm (8px) but React Native lacks text-box-trim,
                // so Typography carries extra ascender/descender space. threeXs (2px)
                // compensates and produces the correct visual gap.
                gap: token.spacing.spacing.vertical.threeXs,
            },
            labelSection: {
                gap: token.spacing.spacing.vertical.threeXs,
            },
            labelRow: {
                flexDirection: "row",
                gap: token.spacing.spacing.horizontal.xs,
            },
            label: {
                color: token.colors.text.neutral.strong,
            },
            subtleText: {
                color: token.colors.text.neutral.subtle,
            },
            inputContainer: {
                backgroundColor,
                borderWidth,
                borderColor,
                borderRadius: token.spacing.spacing.borderRadius.rounded,
                minHeight: token.spacing.sizing.selectable.twoXl,
                paddingHorizontal: token.spacing.spacing.inset.sm.horizontal,
                paddingVertical: token.spacing.spacing.inset.lg.verticalSquished,
                flexDirection: "row",
                alignItems: "flex-start",
                gap: token.spacing.spacing.icon.sm.gapHorizontal,
            },
            errorIconContainer: {
                height: token.typography.ui.fontFamilySize.md.lineHeight.default,
                justifyContent: "center",
                paddingTop: ICON_BASELINE_OFFSET,
            },
            errorIcon: {
                color: token.colors.text.danger.subtle,
            },
            resizeHandle: {
                position: "absolute",
                bottom: 2,
                right: 2,
                color: token.colors.border.neutral.subtle,
            },
            inputWrapper: {
                flex: 1,
                pointerEvents: disabled ? "none" : "auto",
            },
            textInput: {
                flex: 1,
                color: textColor,
                fontFamily: token.typography.ui.typography.fontFamily,
                fontSize: token.typography.ui.fontFamilySize.md.fontSize,
                fontWeight: token.typography.ui.fontFamilySize.md.fontWeight.normal,
                lineHeight: token.typography.ui.fontFamilySize.md.lineHeight.default,
                padding: 0,
            },
            placeholder: {
                color: disabled
                    ? token.colors.text.disabled
                    : token.colors.text.neutral.subtle,
            },
            helperRow: {
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "baseline",
                gap: token.spacing.spacing.horizontal.xs,
            },
            helperMessage: {
                flex: 1,
                color: disabled
                    ? token.colors.text.disabled
                    : token.colors.text.neutral.subtle,
            },
            charCount: {
                color: token.colors.text.neutral.subtle,
                flexShrink: 0,
                marginLeft: "auto",
            },
        };
    }
);
