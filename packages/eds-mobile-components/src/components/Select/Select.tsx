import React, { useCallback, useRef, useState } from "react";
import { LayoutRectangle, Pressable, ScrollView, View } from "react-native";
import { useStyles } from "../../hooks/useStyles";
import { useToken } from "../../hooks/useToken";
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
    invalid,
}: SelectProps<T>) => {
    const [menuOpen, setMenuOpen] = useState(false);
    const [menuLayout, setMenuLayout] = useState<LayoutRectangle | undefined>();

    const triggerRef = useRef<View | null>(null);
    const inputStyles = useStyles(inputTokenStyles, {
        readOnly,
        invalid,
        isSelected: menuOpen,
    });

    const token = useToken();
    const textColor = selectedItem
        ? token.colors.text.primary
        : token.colors.text.tertiary;
    const selectedItemTitle = selectedItem
        ? (items.find((item) => item.value === selectedItem)?.title ??
          placeholder)
        : placeholder;

    const handleSelect = useCallback(
        (value: T) => {
            const newValue = selectedItem === value ? undefined : value;
            onSelect(newValue);
        },
        [onSelect, selectedItem]
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
                onLayout={(event) => {
                    const layout = event.nativeEvent.layout;
                    setMenuLayout(layout);
                }}
            >
                <Typography
                    style={[
                        inputStyles.textInput,
                        {
                            color: disabled
                                ? token.colors.text.disabled
                                : textColor,
                        },
                    ]}
                    numberOfLines={1}
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
                    {items.map((item) => {
                        return (
                            <Menu.Item
                                key={
                                    typeof item.value === "object"
                                        ? JSON.stringify(item.value)
                                        : String(item.value)
                                }
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
