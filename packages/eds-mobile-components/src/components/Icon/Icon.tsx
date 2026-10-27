import { MaterialCommunityIcons } from "@expo/vector-icons";
import React, { ComponentProps } from "react";
import { TextProps } from "react-native";
import { useToken } from "../../hooks/useToken";

export type IconName = keyof typeof MaterialCommunityIcons.glyphMap;

type MaterialCommunityIconProps = ComponentProps<typeof MaterialCommunityIcons>;

export type IconProps = MaterialCommunityIconProps & {
    /**
     * The name of the icon, from the Material Community Icons set.
     */
    name: IconName;
    /**
     * The size of the icon, in points. Defaults to the EDS icon size.
     */
    size?: number;
    /**
     * The colour of the icon. Defaults to the strong neutral text colour.
     */
    color?: string;
} & TextProps;

export const Icon = ({ name, size, color, ...rest }: IconProps) => {
    const token = useToken();
    return (
        <MaterialCommunityIcons
            name={name}
            size={size ?? token.geometry.dimension.icon.size}
            {...rest}
            color={color ?? token.colors.text.neutral.strong}
        />
    );
};

Icon.displayName = "Icon";
