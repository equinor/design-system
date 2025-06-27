import React, { Children, createContext } from "react";
import { StyleSheet, View, ViewProps } from "react-native";
import { useValidChildrenIndexes } from "../../hooks/useValidChildren";

export type ButtonGroupProps = {
    /**
     * Boolean value indicating whether or not the button group should align vertically or not.
     */
    vertical?: boolean;
};

export type ButtonGroupContextType = {
    /**
     * Indicates that the item in the context is the first item in the button group.
     */
    isFirstItem: boolean;
    /**
     * Indicates that the item in the context is the last item in the button group.
     */
    isLastItem: boolean;
};

export const ButtonGroupContext = createContext({
    isFirstItem: true,
    isLastItem: true,
} as ButtonGroupContextType);

export const ButtonGroup = ({ vertical, children }: ButtonGroupProps & ViewProps) => {
    const validChildrenIndexes = useValidChildrenIndexes(children);

    return (
        <View style={vertical ? styles.vertical : styles.horizontal}>
            {Children.map(children, (child, index) => {
                return (
                    <ButtonGroupContext.Provider
                        value={{
                            isFirstItem: index === validChildrenIndexes.at(0),
                            isLastItem: index === validChildrenIndexes.at(-1),
                        }}
                    >
                        {child}
                    </ButtonGroupContext.Provider>
                );
            })}
        </View>
    );
};

ButtonGroup.displayName = "Button.Group";

const styles = StyleSheet.create({
    horizontal: {
        flexDirection: "row",
        alignItems: "center",
    },
    vertical: {
        flexDirection: "column",
        alignItems: "center",
    },
});
