import React, { forwardRef } from "react";
import { View } from "react-native";
import { useStyles } from "../../hooks/useStyles";
import { EDSStyleSheet } from "../../styling";
import { Icon, IconName } from "../Icon";
import { Cell, CellProps } from "./Cell";
import { Typography } from "../Typography";
import { Switch } from "../SelectionControls";

export type SwitchColor = "textPrimary" | "danger" | "warning" | "textDisabled"; // Add more as needed

export type SwitchCellProps = {
    isActive: boolean;
    onChange: (isActive: boolean) => void;
    switchSize?: "small" | "normal";
    disabled?: boolean;
    title: string;
    description?: string;
    iconName?: IconName;
    color?: SwitchColor;
} & Omit<CellProps, "leftAdornment" | "rightAdornment">;

export const SwitchCell = forwardRef<View, SwitchCellProps>(
    (
        {
            isActive,
            onChange,
            switchSize = "small",
            disabled = false,
            title,
            description,
            iconName,
            color,
            ...rest
        },
        ref,
    ) => {
        const styles = useStyles(themeStyles);

        const IconAdornment = () =>
            iconName && (
                <View style={styles.iconContainer}>
                    <Icon name={iconName} color={color} />
                </View>
            );

        const SwitchAdornment =
            switchSize === "small" ? (
                <Switch.Small active={isActive} onChange={onChange} disabled={disabled} />
            ) : (
                <Switch active={isActive} onChange={onChange} disabled={disabled} />
            );

        return (
            <Cell
                {...rest}
                leftAdornment={IconAdornment()}
                rightAdornment={SwitchAdornment}
                ref={ref}
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

SwitchCell.displayName = "Cell.Switch";

const themeStyles = EDSStyleSheet.create(theme => ({
    contentContainer: {
        flex: 1,
        justifyContent: "center",
        gap: theme.spacing.cell.content.titleDescriptionGap,
    },
    iconContainer: {
        justifyContent: "center",
    },
}));
