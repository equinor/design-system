import React from "react";
import { Icon } from "../Icon";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { PressableHighlight } from "../PressableHighlight";
import { colors } from "../../styling";
import { StyleSheet } from "react-native";

export type RadioProps = {
    /**
     * Callback method invoked when the user presses the button.
     */
    onPress?: (b: boolean) => void;
    /**
     * Color theme of the button.
     */
    color?: "primary" | "secondary" | "warning" | "danger" | "success";
    /**
     * whether the button is in its disabled state.
     */
    disabled?: boolean;
    /**
     * Whether the button should be in its checked state.
     */
    checked?: boolean;
    /**
     * The size of the icon
     */
    size?: number;
};
export const Radio = ({
    onPress,
    checked = false,
    disabled = false,
    size = 24,
    color = "primary",
}: RadioProps) => {
    return (
        <PressableHighlight
            style={[styles.pressableHighlight, { borderRadius: size }]}
            onPress={() => {
                onPress?.(disabled ? checked : !checked);
            }}
            disabled={!onPress || disabled}
        >
            <Icon
                name={
                    (checked
                        ? "radiobox-marked"
                        : "radiobox-blank") as keyof typeof MaterialCommunityIcons.glyphMap
                }
                size={size}
                color={disabled ? colors.interactive_disabled_light_text : color}
            />
        </PressableHighlight>
    );
};

const styles = StyleSheet.create({
    pressableHighlight: {
        padding: 7,
        alignItems: "center",
        justifyContent: "center",
        overflow: "hidden",
    },
});
