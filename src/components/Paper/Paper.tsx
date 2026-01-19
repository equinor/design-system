import React, { forwardRef } from "react";
import { View, ViewProps } from "react-native";
import { useStyles } from "../../hooks/useStyles";
import { EDSStyleSheet, Elevation } from "../../styling";

export type PaperProps = {
    /**
     * The elevation of the paper component.
     * Each elevation comes with its own visual appearance.
     */
    elevation: Elevation;
};

export const Paper = forwardRef<
    View,
    React.PropsWithChildren<PaperProps & ViewProps>
>(({ elevation = "none", children, ...rest }, ref) => {
    const style = useStyles(tokenStyles, elevation);

    return (
        <View ref={ref} {...rest} style={[style.container, rest.style]}>
            {children}
        </View>
    );
});

Paper.displayName = "Paper";

const tokenStyles = EDSStyleSheet.create((token, elevation: Elevation) => ({
    container: {
        backgroundColor: token.colors.container.elevation[elevation],
        ...token.geometry.shadow[elevation],
    },
}));
