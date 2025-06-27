import React from "react";
import { Typography, TypographyProps } from "../Typography";
import { View } from "react-native";

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
    return (
        <View style={{ flexDirection: "row", justifyContent: "space-between", paddingVertical: 4 }}>
            <Typography variant="label" color="textTertiary" {...other}>
                {label}
            </Typography>
            <Typography variant="label" color="textTertiary" {...other}>
                {meta}
            </Typography>
        </View>
    );
};

Label.displayName = "Label";
