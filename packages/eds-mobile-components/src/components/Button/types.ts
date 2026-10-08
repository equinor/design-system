import { Ref } from "react";
import { PressableProps, View } from "react-native";

/**
 * Size of the button.
 * - `small`: Compact size
 * - `default`: Standard size (default)
 */
export type ButtonSize = "small" | "default";

/**
 * Colour tone of the button.
 * - `accent`: Brand or action colour (default)
 * - `neutral`: Neutral grey tones
 * - `danger`: Destructive or error colour
 */
export type ButtonTone = "accent" | "neutral" | "danger";

/**
 * Visual variant of the button.
 * - `primary`: Filled background (default)
 * - `secondary`: Transparent background with a border
 * - `ghost`: Transparent background with no border
 */
export type ButtonVariant = "primary" | "secondary" | "ghost";

export type BaseButtonProps = {
    /**
     * Colour tone of the button.
     * @default 'accent'
     */
    tone?: ButtonTone;
    /**
     * Size of the button.
     * @default 'default'
     */
    size?: ButtonSize;
    /**
     * Button variant.
     * @default 'primary'
     */
    variant?: ButtonVariant;
    /**
     * Ref to the button component.
     */
    ref?: Ref<View>;
} & PressableProps;
