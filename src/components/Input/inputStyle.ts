import { EDSStyleSheet } from "../../styling";
import { InputProps } from "./Input";

type InputStyleProps = Pick<InputProps, "readOnly" | "invalid" | "disabled"> & {
    isSelected: boolean;
};

export const inputTokenStyles = EDSStyleSheet.create(
    (token, props: InputStyleProps) => {
        const { isSelected, invalid, readOnly, disabled } = props;

        // Background color
        const backgroundColor = invalid
            ? token.colors.bg.danger.canvas
            : token.colors.bg.input;

        // Border
        const borderWidth = disabled ? 0 : 1;
        const borderColor = (() => {
            if (disabled) return "transparent";
            if (readOnly) return token.colors.bg.disabled;
            if (invalid) {
                return isSelected
                    ? token.colors.border.danger.strong
                    : token.colors.border.danger.subtle;
            }
            return isSelected
                ? token.colors.border.neutral.strong
                : token.colors.border.neutral.subtle;
        })();

        // Text colors
        const textColor = disabled
            ? token.colors.text.disabled
            : token.colors.text.neutral.strong;

        const placeholderColor = disabled
            ? token.colors.text.disabled
            : token.colors.text.neutral.subtle;

        const adornmentTextColor = disabled
            ? token.colors.text.disabled
            : token.colors.text.neutral.subtle;

        return {
            contentContainer: {
                backgroundColor,
                flexDirection: "row",
                alignItems: "center",
                borderWidth,
                borderColor,
                borderRadius: token.spacing.spacing.borderRadius.rounded,
                minHeight: token.spacing.sizing.selectable.lg,
                paddingHorizontal: token.spacing.spacing.inset.sm.horizontal,
                paddingVertical:
                    token.spacing.spacing.inset.lg.verticalSquished,
                gap: token.spacing.spacing.icon.sm.gapHorizontal,
            },
            // Typography tokens will replace hardcoded values
            textInput: {
                flex: 1,
                color: textColor,
                fontSize: 14,
                fontWeight: "400",
                padding: 0,
            },
            placeholder: {
                color: placeholderColor,
            },
            adornmentText: {
                color: adornmentTextColor,
                fontSize: 10.5,
                fontWeight: "400",
                lineHeight: 16,
                textTransform: "uppercase",
            },
            errorIcon: {
                color: token.colors.text.danger.subtle,
            },
        };
    }
);
