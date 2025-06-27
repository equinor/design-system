import React, { useMemo, useRef, useState } from "react";
import { LayoutRectangle, TextInput, View, Platform } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import { useStyles } from "../../hooks/useStyles";
import { EDSStyleSheet } from "../../styling";
import { IconButton } from "../Button/IconButton";
import { Menu } from "../Menu";
import { TextField, TextFieldProps } from "../TextField";
import { GenericAutocompleteProps } from "./types";
import { Autocomplete } from "./Autocomplete";

type MultiselectAutocompleteProps<T> = {
    /**
     * A callback method invoked when the user selects an option from the autocomplete.
     */
    onSelect: (value: T[]) => void;
    selectedOptions: T[];
} & Omit<TextFieldProps, "helperIcon" | "inputIcon"> &
    GenericAutocompleteProps<T>;

export const MultiselectAutocomplete = <T,>({
    options,
    selectedOptions,
    onSelect,
    transformItem,
    ...restProps
}: MultiselectAutocompleteProps<T>) => {
    const [inputValue, setInputValue] = useState<string>("");

    const filteredOptions = useMemo(
        () =>
            options.filter(option => {
                const transformedItem = transformItem ? transformItem(option) : (option as string);
                return transformedItem.toLowerCase().includes(inputValue.toLowerCase());
            }),
        [inputValue, options, transformItem],
    );

    const [isOptionsVisible, setIsOptionsVisible] = useState<boolean>(false);
    const inputRef = useRef<TextInput>(null);
    const [inputLayout, setInputLayout] = useState<LayoutRectangle | undefined>();
    const styles = useStyles(themedStyles, { inputLayout });

    const handleMenuOpen = () => {
        setIsOptionsVisible(true);
        inputRef.current && inputRef.current.focus();
    };
    const handleMenuClose = () => {
        setIsOptionsVisible(false);
        if (selectedOptions) {
            setInputValue("");
        }
        inputRef.current && inputRef.current.blur();
    };
    const handleClearText = () => {
        handleMenuClose();
        setInputValue("");
        onSelect([]);
    };

    const renderMultiselectItem = (option: T, active: boolean | undefined) => {
        const stringifiedOption = transformItem?.(option) ?? (option as string);
        return (
            <Menu.Item
                key={stringifiedOption}
                title={stringifiedOption}
                active={active}
                closeMenuOnClick={false}
                iconName={active ? "checkbox-marked" : "checkbox-blank-outline"}
                onPress={() => {
                    setInputValue("");
                    if (active) {
                        return onSelect(selectedOptions.filter(o => o !== option));
                    }
                    onSelect([...selectedOptions, option]);
                }}
            />
        );
    };

    return (
        <View
            onLayout={event => {
                const layout = event.nativeEvent.layout;
                setInputLayout(layout);
            }}
            style={{ flexGrow: 1 }}
        >
            <TextField
                ref={inputRef}
                {...restProps}
                value={inputValue}
                onChange={text => {
                    setInputValue(text);
                    setIsOptionsVisible(true);
                    if (text === "") {
                        onSelect([]);
                    }
                }}
                onFocus={handleMenuOpen}
                onBlur={() => {
                    setIsOptionsVisible(Platform.OS === "web");
                    setInputValue("");
                }}
                rightAdornments={
                    <View style={styles.adornmentContainer}>
                        {!!selectedOptions.length && (
                            <IconButton
                                name="close"
                                variant="ghost"
                                iconSize={18}
                                onPress={handleClearText}
                                style={styles.closeIcon}
                            />
                        )}
                        <IconButton
                            name={isOptionsVisible ? "menu-up" : "menu-down"}
                            variant="ghost"
                            iconSize={18}
                            onPress={handleMenuOpen}
                            style={styles.menuIcon}
                        />
                    </View>
                }
                placeholder={
                    selectedOptions.length
                        ? selectedOptions.map(o => transformItem?.(o) ?? o).join(", ")
                        : "Choose an option"
                }
            />
            {isOptionsVisible && (
                <Menu
                    placement="bottom-start"
                    anchorEl={inputRef}
                    open={isOptionsVisible}
                    onClose={handleMenuClose}
                    style={styles.menuContainer}
                >
                    <ScrollView keyboardShouldPersistTaps="always">
                        {filteredOptions.map(option =>
                            renderMultiselectItem(option, selectedOptions?.includes(option)),
                        )}
                    </ScrollView>
                </Menu>
            )}
        </View>
    );
};

Autocomplete.displayName = "Autocomplete.Multiselect";
const themedStyles = EDSStyleSheet.create(
    (theme, { inputLayout }: { inputLayout?: LayoutRectangle }) => ({
        menuContainer: {
            maxHeight: 300,
            width: inputLayout?.width ?? "100%",
        },
        adornmentContainer: {
            flexDirection: "row",
            alignItems: "center",
        },
        closeIcon: {
            marginLeft: 8,
        },
        menuIcon: {
            marginRight: 3,
        },
    }),
);
