import React, { PropsWithChildren } from "react";
import { LayoutChangeEvent, View, ViewProps } from "react-native";
import Animated, {
    useAnimatedStyle,
    useDerivedValue,
    useSharedValue,
    withTiming,
} from "react-native-reanimated";
import { useStyles } from "../../../hooks/useStyles";
import { useToken } from "../../../hooks/useToken";
import { EDSStyleSheet } from "../../../styling";

type ExpandableSectionProps = {
    isExpanded: boolean;
} & ViewProps;

export const ExpandableSection = ({
    isExpanded,
    children,
}: PropsWithChildren<ExpandableSectionProps>) => {
    const styles = useStyles(themeStyles);
    const token = useToken();

    const height = useSharedValue(0);

    const derivedHeight = useDerivedValue(() =>
        withTiming(height.value * Number(isExpanded), {
            duration: token.timing.animation.slow,
        }),
    );

    const bodyStyle = useAnimatedStyle(() => ({
        height: derivedHeight.value,
        opacity: withTiming(isExpanded ? 1 : 0, {
            duration: token.timing.animation.slow,
        }),
    }));
    return (
        <View style={{ flex: 1 }}>
            <Animated.View style={[styles.animatedView, bodyStyle]}>
                <View
                    style={styles.wrapper}
                    onLayout={(event: LayoutChangeEvent) => {
                        height.value = event.nativeEvent.layout.height;
                    }}
                >
                    {children}
                </View>
            </Animated.View>
        </View>
    );
};

const themeStyles = EDSStyleSheet.create(() => ({
    animatedView: {
        width: "100%",
        overflow: "hidden",
    },
    wrapper: {
        width: "100%",
        position: "absolute",
    },
}));
