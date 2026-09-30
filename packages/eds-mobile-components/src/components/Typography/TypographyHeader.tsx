import React from "react";
import { Text } from "react-native";
import { useStyles } from "../../hooks/useStyles";
import { TypographyToken } from "../../styling/tokens";
import { createTypographyStyles } from "./styles";
import { TypographyBaseProps } from "./types";

export type TypographyHeaderProps = TypographyBaseProps & {
    /**
     * Header font size variant.
     */
    size?: keyof TypographyToken["header"]["fontFamilySize"];
};

const typographyStyles = createTypographyStyles("header");

export const TypographyHeader: React.FC<TypographyHeaderProps> = ({
    size = "xl",
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
