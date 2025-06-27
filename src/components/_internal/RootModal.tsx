import React, { PropsWithChildren } from "react";
import { Portal } from "../Portal";
import { Pressable, StyleSheet, View } from "react-native";

type RootModalProps = {
    /**
     * Callback method invoked when the user presses outside the child content.
     */
    onBackdropPress?: () => void;
};

export const RootModal = ({ onBackdropPress, children }: PropsWithChildren<RootModalProps>) => (
    <Portal name="root">
        {onBackdropPress ? (
            <Pressable
                onPress={onBackdropPress}
                style={{ ...StyleSheet.absoluteFillObject, zIndex: 1 }}
            >
                {children}
            </Pressable>
        ) : (
            <View pointerEvents="box-none" style={{ ...StyleSheet.absoluteFillObject, zIndex: 1 }}>
                {children}
            </View>
        )}
    </Portal>
);
