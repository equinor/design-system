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
            : readOnly
            ? token.colors.border.neutral.strong
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
            textInput: {
                flex: 1,
                color: textColor,
                fontFamily: token.typography.ui.typography.fontFamily,
                fontSize: token.typography.ui.fontFamilySize.md.fontSize,
                fontWeight: token.typography.ui.fontFamilySize.md.fontWeight.normal,
                // lineHeight intentionally omitted — explicit lineHeight on RN TextInput causes cursor offset issues
                padding: 0,
            },
            placeholder: {
                color: placeholderColor,
            },
            adornmentText: {
                color: adornmentTextColor,
                fontFamily: token.typography.ui.typography.fontFamily,
                fontSize: token.typography.ui.fontFamilySize.xs.fontSize,
                fontWeight: token.typography.ui.fontFamilySize.xs.fontWeight.normal,
                lineHeight: token.typography.ui.fontFamilySize.xs.lineHeight.default,
                textTransform: "uppercase",
            },
            errorIcon: {
                color: token.colors.text.danger.subtle,
            },
            textInputWrapper: {
                flex: 1,
                pointerEvents: disabled ? "none" : "auto",
            },
        };
    }
);
