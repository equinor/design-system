import { MaterialCommunityIcons } from "@expo/vector-icons";
import React, { ComponentProps } from "react";
import { TextProps } from "react-native";
import { useToken } from "../../hooks/useToken";
import { Color, resolveColor } from "../../styling";

export type IconName = keyof typeof MaterialCommunityIcons.glyphMap;

type MaterialCommunityIconProps = ComponentProps<typeof MaterialCommunityIcons>;

export type IconProps = MaterialCommunityIconProps & {
    /**
     * The name of the icon.
     */
    name: IconName;
    /**
     * The size of the icon.
     */
    size?: number;
    /**
     * The color of the icon.
     */
    color?: Color;
} & TextProps;

export const Icon = ({ name, size, color, ...rest }: IconProps) => {
    const token = useToken();
    return (
        <MaterialCommunityIcons
            {...rest}
            name={name}
            size={size ?? token.geometry.dimension.icon.size}
            color={resolveColor(color ?? "textPrimary", token)}
        />
    );
};

Icon.displayName = "Icon";
