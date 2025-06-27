import React, { PropsWithChildren, useContext } from "react";
import { View } from "react-native";
import { EDSStyleSheet } from "../../styling";
import { useStyles } from "../../hooks/useStyles";
import { Typography } from "../Typography";
import { PressableHighlight } from "../PressableHighlight";
import { TabsContext } from "./TabsContext";
import { Icon, IconName } from "../Icon";

export type TabProps = PropsWithChildren & {
    /**
     * Title of the tab.
     */
    title: string;
    /**
     * Optional icon name. If provided, the tab title will have an icon rendered on its left side.
     */
    iconName?: IconName;
    /**
     * Whether or not the tab should be disabled. This ignores touch and renders the tab in a disabled state.
     */
    disabled?: boolean;
};

export const Tab = ({ title, disabled = false, iconName }: TabProps) => {
    const { onPressTab, isSelected } = useContext(TabsContext);
    const styles = useStyles(themeStyles, { isSelected, disabled });

    return (
        <PressableHighlight onPress={onPressTab} disabled={disabled}>
            <View style={styles.container}>
                <View style={styles.labelRow}>
                    {iconName && <Icon name={iconName} style={styles.text} />}
                    <Typography
                        numberOfLines={1}
                        style={styles.text}
                        group="navigation"
                        variant="menuTab"
                    >
                        {title}
                    </Typography>
                </View>
            </View>
        </PressableHighlight>
    );
};

type TabItemStyleProps = {
    disabled: boolean;
    isSelected: boolean;
};

const themeStyles = EDSStyleSheet.create((theme, props: TabItemStyleProps) => {
    const { isSelected, disabled } = props;

    const verticalPadding = theme.spacing.tabs.paddingVerical;
    const paddingTop = verticalPadding;
    const paddingBottom = verticalPadding - theme.geometry.border.tabsBorderWidth;

    const disabledTextColor = disabled ? theme.colors.text.disabled : undefined;
    const disabledBorderColor = disabled ? theme.colors.border.light : undefined;
    const borderColor = isSelected ? theme.colors.interactive.primary : theme.colors.border.medium;

    return {
        container: {
            paddingTop,
            paddingBottom,
            minWidth: theme.geometry.dimension.tabs.minWidth,
            paddingHorizontal: theme.spacing.tabs.paddingHorizontal,
            borderBottomWidth: theme.geometry.border.tabsBorderWidth,
            borderBottomColor: disabledBorderColor ?? borderColor,
        },
        labelRow: {
            flexDirection: "row",
            justifyContent: "center",
            alignItems: "center",
            gap: theme.spacing.button.iconGap,
            height: theme.geometry.dimension.icon.size,
        },
        text: {
            color:
                disabledTextColor ??
                (isSelected ? theme.colors.interactive.primary : theme.colors.text.primary),
        },
    };
});
