import React from "react";
import {
    StyleProp,
    StyleSheet,
    ViewProps,
    ViewStyle,
} from "react-native";
import { EDSStyleSheet } from "../../styling";
import { useStyles } from "../../hooks/useStyles";
import { Paper } from "../Paper";
import { Scrim, ScrimProps } from "../Scrim";
import { PopInContainer } from "../_internal/PopInContainer";

type DialogProps = Omit<ScrimProps, "onPress"> & { onScrimPress?: ScrimProps["onPress"] };

export const Dialog = ({ isOpen, onScrimPress, children, ...rest }: DialogProps & ViewProps) => {
    const styles = useStyles(themeStyles, { style: rest.style });
    return (
        <Scrim isOpen={isOpen} onPress={onScrimPress}>
            <PopInContainer>
                <Paper elevation="aboveScrim" {...rest} style={styles.dialog}>
                    {children}
                </Paper>
            </PopInContainer>
        </Scrim>
    );
};

const themeStyles = EDSStyleSheet.create(
    (theme, props: { style: StyleProp<ViewStyle> }) => ({
        dialog: StyleSheet.flatten([{
            backgroundColor: theme.colors.container.elevation.aboveScrim,
            maxHeight: "100%",
            borderRadius: theme.geometry.border.elementBorderRadius,
            minHeight: theme.geometry.dimension.dialog.minHeight,
            width: theme.geometry.dimension.dialog.defaultWidth,
            maxWidth: "100%",
        }, props.style]),
    }),
);
