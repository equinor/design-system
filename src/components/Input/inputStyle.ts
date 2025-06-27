import { ViewStyle } from "react-native";
import { EDSStyleSheet } from "../../styling";
import { InputProps } from "./Input";

type InputStyleProps = Pick<InputProps, "readOnly" | "variant"> & {
    isSelected: boolean;
};

export const inputTokenStyles = EDSStyleSheet.create((token, props: InputStyleProps) => {
    const { isSelected, variant, readOnly } = props;

    const backgroundColor = readOnly ? undefined : token.colors.container.background;

    const variantBorderStyle: ViewStyle = {
        borderWidth: isSelected
            ? token.geometry.border.focusedBorderWidth
            : token.geometry.border.borderWidth,
        borderColor: token.colors.interactive[variant!],
    };

    const normalBorderStyle: ViewStyle = {
        borderColor: isSelected ? token.colors.interactive.primary : "transparent",
        borderBottomWidth: token.geometry.border.focusedBorderWidth,
        borderBottomColor: isSelected
            ? token.colors.interactive.primary
            : token.colors.text.tertiary,
    };

    const readOnlyBorderStyle: ViewStyle = {
        borderColor: "transparent",
    };

    let borderStyle: ViewStyle;
    if (readOnly) {
        borderStyle = readOnlyBorderStyle;
    } else if (variant) {
        borderStyle = variantBorderStyle;
    } else {
        borderStyle = normalBorderStyle;
    }

    return {
        contentContainer: {
            backgroundColor,
            flexDirection: "row",
            margin: variant && !isSelected ? 1 : 0,
            borderWidth: token.geometry.border.focusedBorderWidth,
            ...borderStyle,
        },
        textInput: {
            flex: 1,
            paddingTop: token.spacing.textField.paddingVertical,
            paddingBottom: token.spacing.textField.paddingVertical,
            paddingHorizontal: token.spacing.textField.paddingHorizontal,
            color: token.colors.text.primary,
            ...token.typography.basic.input,
        },
        placeholder: {
            color: token.colors.text.tertiary,
        },
    };
});
