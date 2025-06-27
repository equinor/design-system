import React, { FocusEvent, useEffect, useRef, useState } from "react";
import {
    LayoutChangeEvent,
    NativeSyntheticEvent,
    Platform,
    TextInput,
    TextInputFocusEventData,
    View,
} from "react-native";
import Animated, {
    interpolate,
    useAnimatedStyle,
    useSharedValue,
    withTiming,
} from "react-native-reanimated";

import { Button } from "../../components/Button";
import { useStyles } from "../../hooks/useStyles";
import { useToken } from "../../hooks/useToken";
import { EDSStyleSheet } from "../../styling/EDSStyleSheet";
import { Icon } from "../Icon";
import { Input, InputProps } from "../Input";

export type SearchProps = Omit<InputProps, "multiline"> & {
    cancellable?: boolean;
    disabled?: boolean;
    onCancelPress?: () => void;
};

export const Search = ({
    cancellable,
    value,
    disabled,
    onCancelPress,
    onChange,
    ...restProps
}: SearchProps) => {
    const [text, setText] = useState(value ?? "");
    const [isInputFocused, setIsInputFocused] = useState(false);

    const styles = useStyles(themedStyles, { isInputFocused });
    const token = useToken();

    const inputRef = useRef<TextInput>(null);
    const animationValue = useSharedValue(0);
    const cancelButtonWidth = useSharedValue(0);

    const cancelButtonStyle = useAnimatedStyle(() => {
        const opacity = interpolate(animationValue.value, [0, 1], [0, 1]);
        const translateX = interpolate(animationValue.value, [0, 1], [cancelButtonWidth.value, 0]);

        return {
            opacity: opacity,
            transform: [{ translateX: translateX }],
        };
    });

    const inputStyle = useAnimatedStyle(() => {
        return {
            marginRight: interpolate(
                animationValue.value,
                [0, 1],
                [0, cancelButtonWidth.value + token.spacing.element.paddingHorizontal],
            ),
        };
    });

    useEffect(() => {
        if (!cancellable) return;
        animationValue.value = withTiming(isInputFocused ? 1 : 0, {
            duration: token.timing.animation.slow,
        });
    }, [isInputFocused, text, cancellable, animationValue, token.timing.animation.slow]);

    useEffect(() => {
        if (value) {
            setText(value);
        }
    }, [value]);

    const handleCancelPressOut = () => {
        handleCancel();
    };

    const handleCancel = () => {
        setText("");
        onCancelPress?.();
        inputRef.current?.blur();
    };

    const handleClearText = () => {
        setText("");
        onChange?.("");
        inputRef.current?.focus();
    };

    const onChangeText = (text: string) => {
        setText(text);
        onChange?.(text);
    };

    const handleOnBlurWeb = (e: FocusEvent<HTMLInputElement>) => {
        if (e.relatedTarget && e.relatedTarget.id === "search-clear-text-button") {
            e.target.focus();
            setIsInputFocused(true);
        } else {
            setIsInputFocused(false);
        }
    };

    const handleOnBlurNative = (e: NativeSyntheticEvent<TextInputFocusEventData>) => {
        setIsInputFocused(false);
        restProps.onBlur?.(e);
    };

    return (
        <View style={styles.container}>
            <Animated.View style={inputStyle}>
                <Input
                    {...restProps}
                    readOnly={disabled}
                    ref={inputRef}
                    value={text}
                    style={[restProps.style, disabled && { pointerEvents: "none" }]}
                    onChange={onChangeText}
                    onFocus={e => {
                        if (!disabled) {
                            setIsInputFocused(true);
                            restProps.onFocus?.(e);
                        }
                    }}
                    onBlur={e => {
                        if (Platform.OS === "web") {
                            handleOnBlurWeb(e as unknown as FocusEvent<HTMLInputElement>);
                        } else {
                            handleOnBlurNative(e);
                        }
                    }}
                    leftAdornments={
                        <View style={styles.magnifyIconContainer}>
                            <Icon
                                name="magnify"
                                color={isInputFocused ? "textPrimary" : "textTertiary"}
                            />
                        </View>
                    }
                    rightAdornments={
                        text && !disabled ? (
                            <View style={styles.adornmentIconContainer}>
                                <Button.Icon
                                    id="search-clear-text-button"
                                    name="close"
                                    color="primary"
                                    variant="ghost"
                                    onPress={handleClearText}
                                />
                            </View>
                        ) : null
                    }
                />
            </Animated.View>
            {cancellable && (
                <Animated.View
                    style={[cancelButtonStyle, styles.buttonWrapper]}
                    onLayout={(event: LayoutChangeEvent) => {
                        cancelButtonWidth.value = event.nativeEvent.layout.width;
                    }}
                >
                    <Button
                        variant="ghost"
                        title="Cancel"
                        onPress={Platform.OS !== "web" ? handleCancel : undefined}
                        onPressOut={Platform.OS === "web" ? handleCancelPressOut : undefined}
                    />
                </Animated.View>
            )}
        </View>
    );
};

const themedStyles = EDSStyleSheet.create((theme, props: { isInputFocused: boolean }) => {
    return {
        container: {
            flexGrow: 1,
        },
        adornmentIconContainer: {
            position: "absolute",
            top: 0,
            right: 0,
            paddingHorizontal: 4,
        },
        magnifyIconContainer: {
            justifyContent: "center",
            alignItems: "center",
            paddingLeft: 16,
            paddingRight: 4,
            paddingVertical: theme.spacing.element.paddingVertical,
        },
        buttonWrapper: {
            right: 0,
            position: "absolute",
            pointerEvents: props.isInputFocused ? "auto" : "none",
        },
    };
});
