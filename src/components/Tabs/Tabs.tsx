import React, { useState } from "react";
import { useValidChildren } from "../../hooks/useValidChildren";
import { View } from "react-native";
import { TabsChildrenType } from "./types";
import { EDSStyleSheet } from "../../styling";
import { useStyles } from "../../hooks/useStyles";
import { TabsRow } from "./TabsRow";

export type TabsProps = {
    /**
     * Whether or not the tabs should be scrollable.
     * When this value is false, tabs are flexed to fit the screen.
     * When this value is true, tabs only take up as much space as they need.
     */
    scrollable?: boolean;
    /**
     * Index of initial tab to render.
     */
    initialActiveIndex?: number;
    /**
     * Tabs children. Use <Tabs.Tab> as children only.
     */
    children?: TabsChildrenType[] | TabsChildrenType;
};

export const Tabs = ({ scrollable = false, initialActiveIndex = 0, children }: TabsProps) => {
    const styles = useStyles(themeStyles);

    const [activeTabIndex, setActiveTabIndex] = useState<number>(initialActiveIndex);
    const validChildren = useValidChildren(children) as TabsChildrenType[];

    const renderCurrentTabChild = () => {
        const currentChildren = validChildren.at(activeTabIndex);
        if (typeof currentChildren === "object") {
            return currentChildren?.props.children;
        }
        return null;
    };

    return (
        <>
            <View style={styles.tabRowBackdrop}>
                <TabsRow
                    scrollable={scrollable}
                    activeTabIndex={activeTabIndex}
                    onPressTab={setActiveTabIndex}
                    tabs={validChildren}
                />
            </View>
            {renderCurrentTabChild()}
        </>
    );
};

const themeStyles = EDSStyleSheet.create(theme => ({
    tabRowBackdrop: {
        backgroundColor: theme.colors.container.default,
    },
}));
