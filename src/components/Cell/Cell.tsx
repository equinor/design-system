import React, { ReactNode, forwardRef, useContext, useMemo, useRef } from "react";
import { View, ViewProps } from "react-native";
import { Swipeable, TouchableWithoutFeedback } from "react-native-gesture-handler";
import Animated from "react-native-reanimated";
import { useStyles } from "../../hooks/useStyles";
import { EDSStyleSheet } from "../../styling";
import { useFadeAnimation } from "../../styling/animations";
import { PressableHighlight } from "../PressableHighlight";
import { CellGroupContext, CellGroupContextType } from "./CellGroup";
import { CellSwipeItem } from "./CellSwipeItem";
import { CellSwipeItemProps, SwipeableMethods } from "./types";

export type AdditionalSurfaceProps = {
    /**
     * The content of the additional surface.
     */
    component: ReactNode;
    /**
     * Callback method invoked when a user presses the additional surface.
     * Leaving this `undefined` causes the additional surface to not respond to touch or hover events.
     */
    onPress?: () => void;
};

type SwipeGroup = CellSwipeItemProps[];

export type CellProps = {
    /**
     * A component that uses the left-remaining space after the child content of the cell has been adjusted for.
     */
    leftAdornment?: ReactNode;
    /**
     * A component that uses the right-remaining space after the child content of the cell has been adjusted for.
     */
    rightAdornment?: ReactNode;
    /**
     * A list of items configuring the components that appear on the right side when a user swipes the cell.
     * Setting this prop makes the cell swipable to the left.
     */
    rightSwipeGroup?: SwipeGroup;
    /**
     * A list of items configuring the components that appear on the left side when a user swipes the cell.
     * Setting this prop makes the cell swipable to the right.
     */
    leftSwipeGroup?: SwipeGroup;
    /**
     * Callback method invoked when a user presses the cell.
     * Leaving this `undefined` causes the cell to not respond to touch or hover events.
     */
    onPress?: () => void;
    /**
     * Additional touchable surface to be rendered to the left of the cell
     */
    additionalSurface?: AdditionalSurfaceProps;
} & ViewProps;

export const Cell = forwardRef<View, React.PropsWithChildren<CellProps>>(
    (
        {
            leftAdornment,
            rightAdornment,
            leftSwipeGroup,
            rightSwipeGroup,
            additionalSurface,
            onPress,
            children,
            ...rest
        },
        ref,
    ) => {
        const { isFirstCell, isLastCell } = useContext(CellGroupContext);
        const { handlePressIn, handlePressOut, animatedStyle } = useFadeAnimation();
        const styles = useStyles(themeStyle, { isFirstCell, isLastCell });
        const swipeableRef = useRef<Swipeable>(null);
        const swipeable = !!leftSwipeGroup || !!rightSwipeGroup;

        const swipeableMethods: SwipeableMethods = useMemo(
            () => ({
                close: () => swipeableRef.current?.close(),
                openLeft: () => swipeableRef.current?.openLeft(),
                openRight: () => swipeableRef.current?.openRight(),
                reset: () => swipeableRef.current?.reset(),
            }),
            [swipeableRef],
        );

        const cellContent = () => (
            <>
                <View style={styles.contentContainer}>
                    {leftAdornment && <View style={styles.adornment}>{leftAdornment}</View>}

                    <View style={styles.children}>
                        <View style={{ flex: 1, justifyContent: "center" }}>{children}</View>
                    </View>
                    {rightAdornment && <View style={styles.adornment}>{rightAdornment}</View>}
                </View>
                {!isLastCell && (
                    <View style={styles.dividerOuter}>
                        <View style={styles.dividerInner} />
                    </View>
                )}
            </>
        );

        const renderCell = () => (
            <View {...rest} style={[styles.container, rest.style]} ref={ref}>
                <View style={{ flexDirection: "row" }}>
                    {additionalSurface && (
                        <>
                            <PressableHighlight
                                onPress={additionalSurface.onPress}
                                style={styles.additionalSurface}
                            >
                                {additionalSurface.component}
                            </PressableHighlight>
                            <View style={styles.verticalLine} />

                            {!isLastCell && (
                                <View style={styles.dividerOuter}>
                                    <View style={styles.dividerInner} />
                                </View>
                            )}
                        </>
                    )}

                    <Animated.View style={[animatedStyle, { flex: 1 }]}>
                        {swipeable ? (
                            <TouchableWithoutFeedback
                                disabled={!onPress}
                                onPressIn={handlePressIn}
                                onPressOut={handlePressOut}
                                onPress={onPress}
                            >
                                {cellContent()}
                            </TouchableWithoutFeedback>
                        ) : (
                            <PressableHighlight disabled={!onPress} onPress={onPress}>
                                {cellContent()}
                            </PressableHighlight>
                        )}
                    </Animated.View>
                </View>
            </View>
        );

        return swipeable ? (
            <Swipeable
                ref={swipeableRef}
                key={`${leftSwipeGroup?.length}-${rightSwipeGroup?.length}`}
                overshootFriction={8}
                containerStyle={{
                    backgroundColor: styles.container.backgroundColor,
                }}
                renderLeftActions={() =>
                    leftSwipeGroup?.map((swipeItem, index) => (
                        <CellSwipeItem
                            key={`leftSwipeItem_${index}`}
                            swipeableMethods={swipeableMethods}
                            {...swipeItem}
                        />
                    ))
                }
                renderRightActions={() =>
                    rightSwipeGroup?.map((swipeItem, index) => (
                        <CellSwipeItem
                            key={`rightSwipeItem_${index}`}
                            swipeableMethods={swipeableMethods}
                            {...swipeItem}
                        />
                    ))
                }
            >
                {renderCell()}
            </Swipeable>
        ) : (
            renderCell()
        );
    },
);

Cell.displayName = "Cell";

const themeStyle = EDSStyleSheet.create((theme, props: CellGroupContextType) => ({
    container: {
        borderColor: theme.colors.border.medium,
        borderBottomWidth: props.isLastCell ? theme.geometry.border.borderWidth : undefined,
        borderTopWidth: props.isFirstCell ? theme.geometry.border.borderWidth : undefined,
        backgroundColor: theme.colors.container.default,
        minHeight: theme.geometry.dimension.cell.minHeight,
        justifyContent: "center",
    },
    contentContainer: {
        flexDirection: "row",
        alignItems: "center",
        gap: theme.spacing.cell.gapHorizontal,
        paddingHorizontal: theme.spacing.container.paddingHorizontal,
        paddingVertical: theme.spacing.cell.paddingVertical,
    },
    adornment: {
        flexDirection: "row",
    },
    dividerOuter: {
        position: "absolute",
        left: 0,
        bottom: 0,
        width: "100%",
        paddingHorizontal: theme.spacing.container.paddingHorizontal,
    },
    dividerInner: {
        height: theme.geometry.border.borderWidth,
        backgroundColor: theme.colors.border.medium,
    },
    additionalSurface: {
        justifyContent: "center",
        alignItems: "center",
    },
    verticalLine: {
        borderRightWidth: theme.geometry.border.borderWidth,
        borderColor: theme.colors.border.medium,
        marginVertical: theme.spacing.menu.item.paddingVertical,
    },
    children: {
        flex: 1,
        flexDirection: "row",
    },
}));
