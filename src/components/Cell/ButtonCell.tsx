import React, { forwardRef } from "react";
import { View } from "react-native";
import { useStyles } from "../../hooks/useStyles";
import { EDSStyleSheet } from "../../styling";
import { Icon, IconName } from "../Icon";
import { Cell, CellProps } from "./Cell";
import { Typography } from "../Typography";

type ButtonColor = "primary" | "danger" | "warning" | "textDisabled"; // Add more as needed

export type ButtonCellProps = {
    /**
     * Title of the button cell.
     */
    title: string;
    /**
     * The description field of the button cell. This will be shown under the title.
     */
    description?: string;
    /**
     * Callback method invoked when a user presses the cell.
     * Leaving this `undefined` causes the cell to not respond to touch or hover events.
     */
    onPress?: () => void;
    /**
     * A boolean value indicating whether or not the cell should be disabled or not.
     * This value affects the visual appearance of the cell and also makes it not respond to presses.
     */
    disabled?: boolean;
    /**
     * Name of the icon to use as a left adornment.
     */
    iconName?: IconName;
    /**
     * Color for the button. Can be "primary", "danger", "warning", etc.
     */
    color?: ButtonColor;
} & Omit<CellProps, "leftAdornment" | "rightAdornment" | "onPress">;

export const ButtonCell = forwardRef<View, ButtonCellProps>(
    (
        {
            title,
            onPress,
            disabled = false,
            description,
            iconName,
            color = "primary",
            ...cellProps
        },
        ref,
    ) => {
        const styles = useStyles(themeStyles);

        const IconAdornment = () =>
            iconName && (
                <View style={styles.iconContainer}>
                    <Icon name={iconName} color={disabled ? "textDisabled" : color} />
                </View>
            );

        return (
            <Cell
                ref={ref}
                leftAdornment={IconAdornment()}
                onPress={disabled ? undefined : onPress}
                {...cellProps}
            >
                <View style={styles.contentContainer}>
                    <Typography
                        group="cell"
                        variant="title"
                        numberOfLines={1}
                        color={disabled ? "textDisabled" : color}
                    >
                        {title}
                    </Typography>
                    {description && (
                        <Typography
                            group="cell"
                            variant="description"
                            numberOfLines={2}
                            color={disabled ? "textDisabled" : "textTertiary"}
                        >
                            {description}
                        </Typography>
                    )}
                </View>
            </Cell>
        );
    },
);

ButtonCell.displayName = "Cell.Button";

const themeStyles = EDSStyleSheet.create(theme => ({
    contentContainer: {
        justifyContent: "center",
        gap: theme.spacing.cell.content.titleDescriptionGap,
    },
    iconContainer: {
        justifyContent: "center",
    },
}));
