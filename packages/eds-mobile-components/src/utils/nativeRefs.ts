import type { ComponentRef } from "react";
import type { TextInput, View } from "react-native";

/**
 * Ref types for React Native's `View` and `TextInput`. Since React Native 0.88
 * they are function components, so `View` and `TextInput` no longer work as
 * ref instance types.
 */
export type ViewRef = ComponentRef<typeof View>;
export type TextInputRef = ComponentRef<typeof TextInput>;
