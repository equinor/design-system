import React, { Fragment } from "react";
import { View } from "react-native";
import { useStyles } from "../../hooks/useStyles";
import { useValidChildren } from "../../hooks/useValidChildren";
import { EDSStyleSheet } from "../../styling";
import { StrictChildrenReactNode } from "../../utils/types";
import { ProgressItemProps } from "./ProgressItem/ProgressItem";

export type ProgressProps = {
    /**
     * Children elements of the Progress component, which should be one or more `ProgressItem` components. The `Progress` component acts as a container that groups these items together.
     * This allows for structured display of multiple progress-tracking elements, each representing a distinct task or process.
     */
    children?:
        | StrictChildrenReactNode<ProgressItemProps>
        | StrictChildrenReactNode<ProgressItemProps>[];
};

export const Progress = ({ children }: ProgressProps) => {
    const styles = useStyles(tokenStyles);
    const validChildren = useValidChildren(children);
    return validChildren.map((child, index) => (
        <Fragment key={`progress-item-${index}`}>
            {child}
            {index < validChildren.length - 1 && <View style={styles.divider} />}
        </Fragment>
    ));
};

const tokenStyles = EDSStyleSheet.create(token => ({
    divider: {
        marginHorizontal: token.spacing.container.paddingHorizontal,
        height: token.geometry.border.borderWidth,
        backgroundColor: token.colors.border.medium,
    },
}));
