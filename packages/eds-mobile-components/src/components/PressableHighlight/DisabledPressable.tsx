import React from "react";
import { PressableProps, View, ViewProps } from "react-native";

/**
 * Pressable still captures events if it is disabled. This is a simple helper component that acts as a better disabled pressable,
 * if you want press events to fall through.
 */
export const DisabledPressable = (props: PressableProps) => {
    return <View {...(props as ViewProps)} />;
};
