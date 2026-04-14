import React from "react";
import { Typography, TypographyProps } from "../Typography";
import { View } from "react-native";
import { EDSStyleSheet } from "../../styling";
import { useStyles } from "../../hooks/useStyles";

export type LabelProps = {
    /**
     * The primary text to display in the label.
     */
    label?: string;
    /**
     * The secondary text to display in the label.
     */
    meta?: string;
};

export const Label = (props: LabelProps & TypographyProps) => {
    const { label, meta, ...other } = props;
    const styles = useStyles(themeStyles);
    return (
        <View style={styles.container}>
            <Typography variant="label.md" style={styles.text} {...other}>
                {label}
            </Typography>
            <Typography variant="label.md" style={styles.text} {...other}>
                {meta}
            </Typography>
        </View>
    );
};

Label.displayName = "Label";

const themeStyles = EDSStyleSheet.create((token) => ({
    container: {
        flexDirection: "row",
        justifyContent: "space-between",
        paddingVertical: 4,
    },
    text: {
        color: token.newColors.text.neutral.subtle,
    },
}));
