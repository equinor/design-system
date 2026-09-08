import React, { useRef } from "react";
import { ScrollView, View } from "react-native";
import { useStyles } from "../../hooks/useStyles";
import { EDSStyleSheet } from "../../styling";
import { TabsContext } from "./TabsContext";
import { TabsChildrenType } from "./types";

type TabsRowProps = {
    activeTabIndex: number;
    scrollable?: boolean;
    onPressTab: (index: number) => void;
    tabs: TabsChildrenType[];
};

export const TabsRow = ({
    activeTabIndex,
    scrollable,
    onPressTab,
    tabs,
}: TabsRowProps) => {
    const styles = useStyles(themeStyles);

    const tabPositions = useRef<Record<number, number | undefined>>({}).current;
    const scrollViewRef = useRef<ScrollView>(null);

    const _onPressTab = (index: number) => {
        const tabX = tabPositions[index];
        if (typeof tabX === "number") {
            scrollViewRef.current?.scrollTo({ x: tabX });
        }
        return onPressTab(index);
    };

    const renderTabChildren = () =>
        tabs.map((child, index) => (
            <View
                style={{ flex: 1 }}
                key={index}
                onLayout={(event) => {
                    const { x } = event.nativeEvent.layout;
                    tabPositions[index] = x;
                }}
            >
                <TabsContext.Provider
                    value={{
                        onPressTab: () => _onPressTab(index),
                        isSelected: activeTabIndex === index,
                    }}
                >
                    {child}
                </TabsContext.Provider>
            </View>
        ));

    if (scrollable) {
        return (
            <ScrollView
                ref={scrollViewRef}
                scrollsToTop={false}
                horizontal={true}
                showsHorizontalScrollIndicator={false}
            >
                {renderTabChildren()}
            </ScrollView>
        );
    }
    return <View style={styles.nonScrollContainer}>{renderTabChildren()}</View>;
};

const themeStyles = EDSStyleSheet.create(() => ({
    nonScrollContainer: {
        flexDirection: "row",
    },
}));
