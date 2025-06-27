import React, { Children, ReactNode, createContext } from "react";
import { Typography } from "../Typography";
import { EDSStyleSheet } from "../../styling";
import { useStyles } from "../../hooks/useStyles";
import { useValidChildrenIndexes } from "../../hooks/useValidChildren";
import { View } from "react-native";

export type CellGroupStyleProps = {
    hasTitle: boolean;
};

export type CellGroupContextType = {
    /**
     * A boolean value indicating whether or not the contexed cell is first in the group or not.
     */
    isFirstCell: boolean;
    /**
     * A boolean value indicating whether or not the contexed cell is last in the group or not.
     */
    isLastCell: boolean;
};
export const CellGroupContext = createContext<CellGroupContextType>({
    isFirstCell: true,
    isLastCell: true,
});

export type CellGroupProps = {
    /**
     * The title of the cell group.
     */
    title?: string;
    /**
     * Extra component given the remaining space after the title size has been calculated.
     */
    adornment?: ReactNode;
};

export const CellGroup = ({
    title,
    adornment,
    children,
}: React.PropsWithChildren<CellGroupProps>) => {
    const styleProps: CellGroupStyleProps = { hasTitle: !!title };
    const styles = useStyles(themeStyles, styleProps);
    const validChildrenIndexes = useValidChildrenIndexes(children);
    return (
        <>
            <View style={styles.titleContainer}>
                {title && (
                    <Typography group="cell" variant="groupTitle" color="textTertiary">
                        {title}
                    </Typography>
                )}
                <View style={{ flex: 1 }}>{adornment}</View>
            </View>
            {Children.map(children, (child, index) => (
                <CellGroupContext.Provider
                    value={{
                        isFirstCell: index === validChildrenIndexes.at(0),
                        isLastCell: index === validChildrenIndexes.at(-1),
                    }}
                >
                    {child}
                </CellGroupContext.Provider>
            ))}
        </>
    );
};

const themeStyles = EDSStyleSheet.create((theme, props: CellGroupStyleProps) => ({
    titleContainer: {
        paddingHorizontal: theme.spacing.container.paddingHorizontal,
        paddingBottom: props.hasTitle ? theme.spacing.cell.group.titleBottomPadding : undefined,
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "flex-end",
    },
}));
