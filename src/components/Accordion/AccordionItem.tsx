import React, { ReactNode, useContext, useEffect, useRef, useState } from "react";
import { Cell } from "../Cell";
import { Animated, View, ViewProps } from "react-native";
import { Icon, IconName } from "../Icon";
import { EDSStyleSheet } from "../../styling";
import { useStyles } from "../../hooks/useStyles";
import { Typography } from "../Typography";
import { AccordionContext, AccordionContextType } from "./Accordion";
import { useToken } from "../../hooks/useToken";

export type AccordionItemProps = {
    /**
     * Title of the accordion item.
     */
    title: string;
    /**
     * Positions the chevron in the item either to the left or to the right.
     */
    chevronPosition?: "right" | "left";
    /**
     * Additional space for adding custom components to the item.
     */
    adornment?: ReactNode;
    /**
     * Icon to use with the title.
     */
    iconName?: IconName;
    /**
     * Boolean value indicating whether or not the item should respond to touch.
     */
    disabled?: boolean;
    /**
     * Boolean value indicating whether or not the item should be opened by default.
     */
    defaultOpen?: boolean;
};

export const AccordionItem = ({
    title,
    chevronPosition = "left",
    disabled = false,
    adornment,
    iconName,
    children,
    defaultOpen = false,
    ...rest
}: AccordionItemProps & ViewProps) => {
    const context = useContext(AccordionContext);
    const [expanded, setExpanded] = useState<boolean>(defaultOpen);

    const styles = useStyles(themeStyles, context);
    const token = useToken();

    const [contentHeight, setContentHeight] = useState<number>();
    const animatedController = useRef(new Animated.Value(0)).current;

    const _expandAnimation = Animated.timing(animatedController, {
        toValue: 1,
        duration: token.timing.animation.normal,
        useNativeDriver: false,
    });

    const _retractAnimation = Animated.timing(animatedController, {
        toValue: 0,
        duration: token.timing.animation.normal,
        useNativeDriver: false,
    });

    const bodyHeight = animatedController.interpolate({
        inputRange: [0, 1],
        outputRange: [0, contentHeight ?? 0],
    });

    useEffect(() => {
        expanded ? _expandAnimation.start() : _retractAnimation.start();
        // eslint-disable-next-line react-hooks/exhaustive-deps -- adding animations to deps cause infinite loop glitch
    }, [expanded]);

    const toggleItem = () => {
        setExpanded(state => !state);
    };

    const ChevronView = () => (
        <View style={styles.iconContainer}>
            <Icon
                name={expanded ? "chevron-up" : "chevron-down"}
                color={disabled ? "textTertiary" : "primary"}
            />
        </View>
    );

    const IconView = () =>
        iconName && (
            <View style={styles.iconContainer}>
                <Icon name={iconName} color={disabled ? "textTertiary" : "textPrimary"} />
            </View>
        );

    return (
        <>
            <View>
                <Cell
                    rightAdornment={chevronPosition === "right" ? ChevronView() : IconView()}
                    leftAdornment={chevronPosition === "left" ? ChevronView() : IconView()}
                    onPress={disabled ? undefined : toggleItem}
                    style={styles.cellContainer}
                >
                    <View style={styles.headerContainer}>
                        <Typography
                            variant="h6"
                            color={disabled ? "textTertiary" : expanded ? "primary" : "textPrimary"}
                            numberOfLines={1}
                        >
                            {title}
                        </Typography>
                        {adornment}
                    </View>
                </Cell>
                {expanded && (
                    <View style={styles.dividerOuter}>
                        <View style={styles.dividerInner} />
                    </View>
                )}
            </View>
            {children && (
                <Animated.View
                    style={{
                        height: bodyHeight,
                        overflow: "hidden",
                    }}
                >
                    <View
                        style={{
                            position: "absolute",
                            bottom: 0,
                            width: "100%",
                        }}
                        onLayout={event => setContentHeight(event.nativeEvent.layout.height)}
                    >
                        <View {...rest} style={[styles.contentContainer, rest.style]}>
                            {children}
                        </View>
                    </View>
                </Animated.View>
            )}
        </>
    );
};

const themeStyles = EDSStyleSheet.create((theme, props: AccordionContextType) => {
    const { isLastItem } = props;
    return {
        cellContainer: {
            borderTopWidth: theme.geometry.border.borderWidth,
            borderBottomWidth: isLastItem ? theme.geometry.border.borderWidth : undefined,
        },
        headerContainer: {
            flexDirection: "row",
            alignItems: "center",
            gap: theme.spacing.cell.gapHorizontal,
            height: theme.geometry.dimension.cell.accordion.height,
        },
        contentContainer: {
            backgroundColor: theme.colors.container.default,
            paddingHorizontal: theme.spacing.container.paddingHorizontal,
            paddingVertical: theme.spacing.container.paddingVertical,
        },
        iconContainer: {
            justifyContent: "center",
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
    };
});
