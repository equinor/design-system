import React, { forwardRef } from "react";
import { View } from "react-native";
import { useStyles } from "../../hooks/useStyles";
import { useToken } from "../../hooks/useToken";
import { EDSStyleSheet } from "../../styling";
import { Icon, IconName } from "../Icon";
import { Cell, CellProps } from "./Cell";
import { Typography } from "../Typography";
import { Switch } from "../SelectionControls";

export type SwitchColor = "textPrimary" | "danger" | "warning" | "textDisabled"; // Add more as needed

export type SwitchCellProps = {
    isActive: boolean;
    onChange: (isActive: boolean) => void;
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
            disabled = false,
            title,
            description,
            iconName,
            color,
            ...rest
        },
        ref
    ) => {
        const styles = useStyles(themeStyles);
        const token = useToken();

        const resolveTitleColor = (): string => {
            if (disabled) return token.colors.text.disabled;
            switch (color) {
                case "danger": return token.colors.feedback.danger;
                case "warning": return token.colors.feedback.warning;
                case "textDisabled": return token.colors.text.disabled;
                default: return token.colors.text.primary;
            }
        };

        const IconAdornment = () =>
            iconName && (
                <View style={styles.iconContainer}>
                    <Icon name={iconName} color={color} />
                </View>
            );

        const SwitchAdornment = (
            <Switch
                active={isActive}
                onChange={onChange}
                disabled={disabled}
            />
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
                        numberOfLines={1}
                        style={{ color: resolveTitleColor() }}
                    >
                        {title}
                    </Typography>
                    {description && (
                        <Typography
                            size="md"
                            numberOfLines={2}
                            style={{
                                color: disabled
                                    ? token.colors.text.disabled
                                    : token.colors.text.tertiary,
                            }}
                        >
                            {description}
                        </Typography>
                    )}
                </View>
            </Cell>
        );
    }
);

SwitchCell.displayName = "Cell.Switch";

const themeStyles = EDSStyleSheet.create((theme) => ({
    contentContainer: {
        flex: 1,
        justifyContent: "center",
        gap: theme.newSpacing.spacing.vertical.sm,
    },
    iconContainer: {
        justifyContent: "center",
    },
}));
