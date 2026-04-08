import { EDSStyleSheet } from "../../styling";
import { InputProps } from "./Input";

type InputStyleProps = Pick<InputProps, "readOnly" | "invalid" | "disabled"> & {
    isSelected: boolean;
};

export const inputTokenStyles = EDSStyleSheet.create(
    (token, props: InputStyleProps) => {
        const { isSelected, invalid, readOnly, disabled } = props;
        const isInactive = readOnly === true || disabled === true;

        // Background color
        const backgroundColor = invalid
            ? token.newColors.bg.danger.canvas
            : token.newColors.bg.input;

        // Border
        const borderWidth = disabled ? 0 : 1;
        const borderColor = (() => {
            if (disabled) return "transparent";
            if (readOnly) return token.newColors.bg.disabled;
            if (invalid) {
                return isSelected
                    ? token.newColors.border.danger.strong
                    : token.newColors.border.danger.subtle;
            }
            return isSelected
                ? token.newColors.border.neutral.strong
                : token.newColors.border.neutral.subtle;
        })();

        // Text colors
        const textColor = disabled
            ? token.newColors.text.disabled
            : token.newColors.text.neutral.strong;

        const placeholderColor = disabled
            ? token.newColors.text.disabled
            : token.newColors.text.neutral.subtle;

        const adornmentTextColor = disabled
            ? token.newColors.text.disabled
            : token.newColors.text.neutral.subtle;

        return {
            contentContainer: {
                backgroundColor,
                flexDirection: "row",
                alignItems: "center",
                borderWidth,
                borderColor,
                paddingHorizontal:
                    token.newSpacing.spacing.inset.sm.horizontal,
                paddingVertical:
                    token.newSpacing.spacing.inset.lg.verticalSquished,
                gap: token.newSpacing.spacing.icon.sm.gapHorizontal,
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
                color: token.newColors.text.danger.subtle,
            },
        };
    }
);
