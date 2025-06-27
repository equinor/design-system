import React, { useContext } from "react";
import { View } from "react-native";
import { useStyles } from "../../hooks/useStyles";
import { EDSStyleSheet } from "../../styling";
import { PressableHighlight } from "../PressableHighlight";
import { Typography } from "../Typography";
import { Icon, IconName } from "../Icon";
import { MenuContext } from "./Menu";

export type MenuItemProps = {
    /**
     * The title of the menu item.
     */
    title: string;
    /**
     * A boolean value indicating whether or not the item should be selected as active.
     * An active item has a different visual appearance than a non-active item.
     */
    active?: boolean;
    /**
     * A boolean value indicating whether or not the item should be disabled.
     * A disabled item has a different visual appearance than a non-disabled item.
     */
    disabled?: boolean;
    /**
     * A callback method invoked when the item is pressed.
     */
    onPress?: () => void;
    /**
     * A boolean value indicating whether or not the parent menu should be dismissed when a user presses this item.
     */
    closeMenuOnClick?: boolean;
    /**
     * The name of the icon to show alongside the text of this item.
     */
    iconName?: IconName;
};

export const MenuItem = ({
    title,
    active = false,
    disabled = false,
    onPress = () => null,
    closeMenuOnClick = true,
    iconName,
}: MenuItemProps) => {
    const menuContext = useContext(MenuContext);
    const styles = useStyles(themeStyles, { active, disabled });

    const onPressItem = () => {
        closeMenuOnClick && !disabled && menuContext.close();
        onPress();
    };

    return (
        <View style={styles.itemContainer}>
            <PressableHighlight
                style={styles.pressableContainer}
                onPress={onPressItem}
                disabled={disabled}
            >
                <View style={styles.contentContainer}>
                    {iconName && <Icon name={iconName} style={styles.textStyle} />}
                    <Typography style={styles.textStyle}>{title}</Typography>
                </View>
            </PressableHighlight>
        </View>
    );
};

const themeStyles = EDSStyleSheet.create((theme, props: { active: boolean; disabled: boolean }) => {
    const activeColor = props.active && theme.colors.text.menu.active;
    const disabledColor = props.disabled && theme.colors.text.disabled;
    return {
        itemContainer: {
            backgroundColor: props.active
                ? theme.colors.interactive.selectedHighlight
                : theme.colors.container.elevation.temporaryNav,
        },
        pressableContainer: {
            paddingHorizontal: theme.spacing.menu.item.paddingHorizontal,
            paddingVertical: theme.spacing.menu.item.paddingVertical,
        },
        textStyle: {
            color: disabledColor || activeColor || theme.colors.text.menu.resting,
        },
        contentContainer: {
            flexDirection: "row",
            justifyContent: "flex-start",
            alignContent: "center",
            gap: theme.spacing.menu.item.iconGap,
        },
    };
});
