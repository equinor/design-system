import React, { ReactNode, forwardRef, useState } from "react";
import {
    NativeSyntheticEvent,
    Platform,
    TextInput,
    TextInputFocusEventData,
    TextInputProps,
    View,
} from "react-native";
import { useStyles } from "../../hooks/useStyles";
import { inputTokenStyles } from "./inputStyle";

export type InputProps = {
    /**
     * A callback method invoked when the input component registeres a change of text content.
     * @param contents A string representing the new text in the input field.
     */
    onChange?: (contents: string) => void;
    /**
     * A boolean value indicating whether or not the input component should span across multiple lines of text or wrapped to one line.
     */
    multiline?: boolean;
    /**
     * The text to display when the input component is empty.
     */
    placeholder?: string;
    /**
     * A component that will be added to the left of the input field.
     */
    leftAdornments?: ReactNode;
    /**
     * A component that will be added to the right of the input field.
     */
    rightAdornments?: ReactNode;
    /**
     * A variant to use for the validation of the input field.
     */
    variant?: "danger" | "warning" | "success";
    /**
     * Whether or not the text should be editable.
     */
    readOnly?: boolean;
} & Omit<TextInputProps, "onChange" | "onChangeText" | "readOnly">;

export const Input = forwardRef<TextInput, InputProps>(
    (
        {
            leftAdornments,
            rightAdornments,
            placeholder,
            onChange,
            multiline = false,
            variant,
            readOnly = false,
            ...rest
        },
        ref,
    ) => {
        const [isSelected, setIsSelected] = useState<boolean>(false);
        const styles = useStyles(inputTokenStyles, { isSelected, variant, readOnly });

        const onFocus = (e: NativeSyntheticEvent<TextInputFocusEventData>) => {
            setIsSelected(true);
            rest.onFocus && rest.onFocus(e);
        };

        const onBlur = (e: NativeSyntheticEvent<TextInputFocusEventData>) => {
            setIsSelected(false);
            rest.onBlur && rest.onBlur(e);
        };

        return (
            <View style={styles.contentContainer}>
                {leftAdornments}
                <TextInput
                    {...rest}
                    ref={ref}
                    multiline={multiline}
                    editable={!readOnly}
                    placeholder={placeholder}
                    onChangeText={onChange}
                    textAlignVertical="top"
                    placeholderTextColor={styles.placeholder.color}
                    onFocus={onFocus}
                    onBlur={onBlur}
                    style={[
                        styles.textInput,
                        // eslint-disable-next-line @typescript-eslint/no-explicit-any -- this is appearanly available for web, but react native does not seem to recognize it
                        Platform.OS === "web" ? ({ outline: "none" } as any) : {},
                        rest.style,
                    ]}
                />
                {rightAdornments}
            </View>
        );
    },
);

Input.displayName = "Input";
