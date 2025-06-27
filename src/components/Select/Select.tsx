import React, { useCallback, useRef, useState } from "react";
import { LayoutRectangle, Pressable, View } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import { useStyles } from "../../hooks/useStyles";
import { Icon } from "../Icon";
import { inputTokenStyles } from "../Input/inputStyle";
import { Menu } from "../Menu";
import { Typography } from "../Typography";
import { SelectBaseProps } from "./types";

export type SelectProps<T> = SelectBaseProps<T> & {
    /**
     * The currently selected item, or undefined if nothing is selected.
     */
    selectedItem: T | undefined;

    /**
     * Callback function called when an item is selected or deselected.
     */
    onSelect: (value: T | undefined) => void;
};

export const Select = <T,>({
    items,
    selectedItem,
    placeholder = "Select an option",
    disabled = false,
    onSelect,
    readOnly = false,
    variant,
}: SelectProps<T>) => {
    const [menuOpen, setMenuOpen] = useState(false);
    const [menuLayout, setMenuLayout] = useState<LayoutRectangle | undefined>();

    const triggerRef = useRef<View | null>(null);
    const inputStyles = useStyles(inputTokenStyles, {
        readOnly,
        variant,
        isSelected: menuOpen,
    });

    const textColor = selectedItem ? "textPrimary" : "textTertiary";
    const selectedItemTitle = selectedItem
        ? items.find(item => item.value === selectedItem)?.title ?? placeholder
        : placeholder;

    const handleSelect = useCallback(
        (value: T) => {
            const newValue = selectedItem === value ? undefined : value;
            onSelect(newValue);
        },
        [onSelect, selectedItem],
    );

    const toggleMenuOpen = () => {
        setMenuOpen(!menuOpen);
    };

    return (
        <View style={{ flexGrow: 1 }}>
            <Pressable
                style={inputStyles.contentContainer}
                ref={triggerRef}
                disabled={disabled || readOnly}
                onPress={toggleMenuOpen}
                onLayout={event => {
                    const layout = event.nativeEvent.layout;
                    setMenuLayout(layout);
                }}
            >
                <Typography
                    style={inputStyles.textInput}
                    numberOfLines={1}
                    color={disabled ? "textDisabled" : textColor}
                >
                    {selectedItemTitle}
                </Typography>
                {!readOnly && (
                    <Icon
                        style={{ alignSelf: "center" }}
                        color={disabled ? "textDisabled" : "textPrimary"}
                        name={menuOpen ? "menu-up" : "menu-down"}
                    />
                )}
            </Pressable>
            <Menu
                key={`menu-${menuLayout?.height}`}
                anchorEl={triggerRef}
                open={menuOpen}
                onClose={() => setMenuOpen(false)}
                placement="bottom-start"
                style={{
                    width: menuLayout?.width,
                    marginTop: -8,
                    marginBottom: -8,
                    maxHeight: 300,
                }}
            >
                <ScrollView>
                    {items.map(item => {
                        return (
                            <Menu.Item
                                key={item.value as string}
                                onPress={() => handleSelect(item.value)}
                                title={item.title}
                                iconName={item.icon}
                                active={selectedItem === item.value}
                            />
                        );
                    })}
                </ScrollView>
            </Menu>
        </View>
    );
};

Select.displayName = "Select";
