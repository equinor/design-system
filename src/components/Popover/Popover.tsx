import { arrow, flip, offset, shift, useFloating } from "@floating-ui/react-native";
import type { Placement } from "@floating-ui/react-native";
import React, { useRef } from "react";
import { View, ViewProps } from "react-native";
import { Paper } from "../Paper";
import { EDSStyleSheet } from "../../styling";
import { useStyles } from "../../hooks/useStyles";
import { PopInContainer } from "../_internal/PopInContainer";
import { RootModal } from "../_internal/RootModal";

export type PopoverProps = {
    /**
     * A reference to the element that the popover should appear around.
     */
    anchorEl: React.RefObject<View>;
    /**
     * A boolean value indicating whether or not the popover should be open.
     */
    open: boolean;
    /**
     * A callback method invoked when a user closes the popover.
     * If not provided, the popover will respond to outside presses.
     */
    onClose?: () => void;
    /**
     * The positioning of the popover around the anchor element.
     */
    placement?: Placement;
};

type PopoverDimensions = {
    width?: number;
    height?: number;
};

const ARROW_CONTAINER_SIZE = 12;

export const Popover = ({
    open,
    onClose,
    anchorEl,
    placement = "top",
    children,
    ...rest
}: PopoverProps & ViewProps) => {
    const styles = useStyles(themeStyles);

    const arrowRef = useRef(null);
    const popoverDimensions = useRef({
        width: 0,
        height: 0,
    } as PopoverDimensions);
    const {
        refs,
        floatingStyles,
        middlewareData: { arrow: { x: arrowX, y: arrowY } = {} },
    } = useFloating({
        sameScrollView: false,
        elements: {
            reference: anchorEl.current,
        },
        middleware: [offset(12), flip(), shift({ padding: 8 }), arrow({ element: arrowRef })],
        placement: placement,
    });

    let calculatedArrowX = arrowX ?? 0;
    let calculatedArrowY = arrowY ?? 0;
    if (placement.startsWith("left")) {
        calculatedArrowX += popoverDimensions.current.width ?? 0;
    }
    if (placement.startsWith("top")) {
        calculatedArrowY += popoverDimensions.current.height ?? 0;
    }
    if (placement.startsWith("top") || placement.startsWith("bottom")) {
        calculatedArrowY -= ARROW_CONTAINER_SIZE / 2;
    }
    if (placement.startsWith("left") || placement.startsWith("right")) {
        calculatedArrowX -= ARROW_CONTAINER_SIZE / 2;
    }

    return (
        open && (
            <RootModal onBackdropPress={onClose}>
                <View ref={refs.setFloating} style={floatingStyles}>
                    <PopInContainer>
                        <Paper
                            style={{
                                borderRadius: 12,
                            }}
                            elevation="overlay"
                            onLayout={e => {
                                popoverDimensions.current.width = e.nativeEvent.layout.width;
                                popoverDimensions.current.height = e.nativeEvent.layout.height;
                            }}
                        >
                            <View {...rest} style={[styles.innerContainer, rest.style]}>
                                {children}
                            </View>
                        </Paper>
                        <View
                            ref={arrowRef}
                            style={[
                                styles.arrow,
                                { left: calculatedArrowX, top: calculatedArrowY },
                            ]}
                        />
                    </PopInContainer>
                </View>
            </RootModal>
        )
    );
};

const themeStyles = EDSStyleSheet.create(theme => ({
    arrow: {
        position: "absolute",
        width: ARROW_CONTAINER_SIZE,
        height: ARROW_CONTAINER_SIZE,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: theme.colors.container.elevation.overlay,
        transform: [{ rotate: "45deg" }],
    },
    innerContainer: {
        overflow: "hidden",
        minHeight: theme.geometry.dimension.button.minHeight,
        paddingHorizontal: theme.spacing.container.paddingHorizontal,
        paddingVertical: theme.spacing.container.paddingVertical,
    },
}));
