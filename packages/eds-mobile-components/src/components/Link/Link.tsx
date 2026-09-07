import React, { useState } from "react";
import { Pressable, Text, View } from "react-native";
import { useStyles } from "../../hooks/useStyles";
import { useToken } from "../../hooks/useToken";
import { EDSStyleSheet } from "../../styling";
import { Icon } from "../Icon";
import { Typography } from "../Typography";
import { LinkProps, LinkSize } from "./Link.types";

export const Link = ({
    children,
    onPress,
    variant = "standalone",
    size = "md",
    external = false,
    visited = false,
}: LinkProps) => {
    const [pressed, setPressed] = useState(false);
    const standaloneStyles = useStyles(standaloneThemeStyles, { size });
    const inlineStyles = useStyles(inlineThemeStyles, { size });
    const token = useToken();
    const sizeToken = token.typography.ui.fontFamilySize[size];

    const color = pressed
        ? token.colors.text.neutral.strong
        : visited
        ? token.colors.text.info.subtle
        : token.colors.text.link;

    if (variant === "inline") {
        return (
            <Typography
                size={size}
                onPress={onPress}
                onPressIn={() => setPressed(true)}
                onPressOut={() => setPressed(false)}
                accessibilityRole="link"
                style={[inlineStyles.link, { color, textDecorationColor: color }]}
            >
                {children}
                {external && (
                    <Text style={inlineStyles.iconWrapper}>
                        <Icon
                            name="open-in-new"
                            size={sizeToken.iconSize}
                            color={color}
                        />
                    </Text>
                )}
            </Typography>
        );
    }

    return (
        <Pressable
            onPress={onPress}
            onPressIn={() => setPressed(true)}
            onPressOut={() => setPressed(false)}
            accessibilityRole="link"
            style={standaloneStyles.pressable}
        >
            <View style={[standaloneStyles.row, { borderBottomColor: color }]}>
                <Typography size={size} style={{ color, lineHeight: sizeToken.lineHeight.squished }}>
                    {children}
                </Typography>
                {external && (
                    <Icon
                        name="open-in-new"
                        size={sizeToken.iconSize}
                        color={color}
                    />
                )}
            </View>
        </Pressable>
    );
};

Link.displayName = "Link";

const standaloneThemeStyles = EDSStyleSheet.create(
    (token, { size }: { size: LinkSize }) => {
        const sizeToken = token.typography.ui.fontFamilySize[size];

        return {
            pressable: {
                alignSelf: "flex-start",
            },
            row: {
                flexDirection: "row",
                alignItems: "center",
                borderBottomWidth: token.spacing.sizing.stroke.thin,
                gap: sizeToken.gapHorizontal,
            },
        };
    }
);

const inlineThemeStyles = EDSStyleSheet.create(
    (token, { size }: { size: LinkSize }) => ({
        link: {
            textDecorationLine: "underline",
        },
        iconWrapper: {
            marginLeft: token.typography.ui.fontFamilySize[size].gapHorizontal,
        },
    })
);
