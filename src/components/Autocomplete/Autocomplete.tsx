import React, { useCallback, useMemo, useRef, useState } from "react";
import { LayoutRectangle, TextInput, View } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import { useStyles } from "../../hooks/useStyles";
import { EDSStyleSheet } from "../../styling";
import { IconButton } from "../Button/IconButton";
import { Menu } from "../Menu";
import { TextField, TextFieldProps } from "../TextField";
import { GenericAutocompleteProps } from "./types";

type AutocompleteProps<T> = {
    /**
     * A callback method invoked when the user selects an option from the autocomplete.
     */
    onSelect: (value: T | undefined) => void;
    /**
     * The currently selected option.
     */
    selectedOption: T | undefined;
} & Omit<TextFieldProps, "helperIcon" | "inputIcon"> &
    GenericAutocompleteProps<T>;

export const Autocomplete = <T,>({
    options,
    selectedOption,
    onSelect,
    transformItem,
    ...restProps
}: AutocompleteProps<T>) => {
    const internalTransform = useCallback(
        (item: T | undefined): string => {
            if (!item) return "";
            return transformItem?.(item) ?? (item as string);
        },
        [transformItem],
    );
    const [inputValue, setInputValue] = useState<string>(internalTransform(selectedOption));

    const filteredOptions = useMemo(
        () =>
            options.filter(option => {
                const transformedItem = transformItem ? transformItem(option) : (option as string);
                return transformedItem.toLowerCase().includes(inputValue.toLowerCase());
            }),
        [inputValue, options, transformItem],
    );

    const [isOptionsVisible, setIsOptionsVisible] = useState(false);
    const inputRef = useRef<TextInput>(null);
    const [inputLayout, setInputLayout] = useState<LayoutRectangle | undefined>();
    const styles = useStyles(themedStyles, { inputLayout });

    const handleMenuOpen = () => {
        setIsOptionsVisible(true);
        inputRef.current && inputRef.current.focus();
    };
    const handleMenuClose = () => {
        setIsOptionsVisible(false);
        if (selectedOption) {
            setInputValue(internalTransform(selectedOption));
        } else {
            setInputValue("");
        }
        inputRef.current && inputRef.current.blur();
    };
    const handleClearText = () => {
        handleMenuClose();
        setInputValue("");
        onSelect(undefined);
    };

    const renderItem = (option: T) => {
        const stringifiedOption = internalTransform(option);
        return (
            <Menu.Item
                key={stringifiedOption}
                title={stringifiedOption}
                onPress={() => {
                    setInputValue(stringifiedOption);
                    onSelect(option);
                    setIsOptionsVisible(false);
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
                        onSelect(undefined);
                    }
                }}
                onFocus={handleMenuOpen}
                onBlur={() => {
                    setTimeout(() => {
                        setIsOptionsVisible(false);
                    }, 150);
                }}
                rightAdornments={
                    <View style={styles.adornmentContainer}>
                        {selectedOption && (
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
                        {filteredOptions.map(option => renderItem(option))}
                    </ScrollView>
                </Menu>
            )}
        </View>
    );
};

Autocomplete.displayName = "Autocomplete";
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
