import React from "react";
import { Text } from "react-native";
import { useStyles } from "../../hooks/useStyles";
import { TypographyToken } from "../../styling/tokens";
import { createTypographyStyles } from "./styles";
import { TypographyBaseProps } from "./types";

export type TypographyUIProps = TypographyBaseProps & {
    /**
     * UI font size variant.
     */
    size?: keyof TypographyToken["ui"]["fontFamilySize"];
};

const typographyStyles = createTypographyStyles("ui");

export const TypographyUI: React.FC<TypographyUIProps> = ({
    size = "lg",
    weight = "normal",
    tracking = "normal",
    lineHeight = "default",
    ...rest
}) => {
    const styles = useStyles(typographyStyles, {
        size,
        weight,
        tracking,
        lineHeight,
    });
    return <Text {...rest} style={[styles.text, rest.style]} />;
};
