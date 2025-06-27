import React, { PropsWithChildren, useEffect, useRef, forwardRef } from "react";
import { Animated, View, ViewProps } from "react-native";
import { useToken } from "../../hooks/useToken";

export const PopInContainer = forwardRef<View, PropsWithChildren & ViewProps>(
    ({ children, ...rest }, ref) => {
        const token = useToken();
        const scale = useRef<Animated.Value>(new Animated.Value(0)).current;

        const popInAnimation = Animated.timing(scale, {
            toValue: 1,
            useNativeDriver: true,
            duration: token.timing.animation.normal,
        });

        useEffect(() => {
            popInAnimation.start();
            return () => popInAnimation.reset();
        }, []);

        return (
            <Animated.View
                ref={ref}
                {...rest}
                style={[
                    {
                        transform: [{ scale }],
                        maxHeight: "100%",
                        maxWidth: "100%"
                    },
                    rest.style,
                ]}
                >
                {children}
            </Animated.View>
        );
    },
);
PopInContainer.displayName = "PopInContainer";
