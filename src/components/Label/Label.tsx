import React from "react";
import { View } from "react-native";
import { useStyles } from "../../hooks/useStyles";
import { EDSStyleSheet } from "../../styling";
import { Typography, TypographyUIProps } from "../Typography";

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

export const Label = (props: LabelProps & TypographyUIProps) => {
    const { label, meta, ...other } = props;
    const styles = useStyles(themeStyles);
    return (
        <View style={styles.container}>
            <Typography style={styles.text} {...other}>
                {label}
            </Typography>
            <Typography style={styles.text} {...other}>
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
