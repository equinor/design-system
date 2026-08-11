import React from "react";
import { View } from "react-native";
import { useStyles } from "../../hooks/useStyles";
import { useToken } from "../../hooks/useToken";
import { EDSStyleSheet } from "../../styling";
import { Icon, IconName } from "../Icon";
import { Typography } from "../Typography";
import { Cell, CellProps } from "./Cell";

type NavigationCellOptions =
    | {
          /**
           * Additional titles to be shown next to the title section in the cell.
           */
          additionalTitlesRight?: string[];
          /**
           * Additional titles to be shown under the description section in the cell.
           */
          additionalTitlesUnder?: never;
      }
    | {
          additionalTitlesRight?: never;

          additionalTitlesUnder?: string[];
      };

export type NavigationCellProps = {
    /**
     * Title of the navigation cell.
     */
    title: string;
    /**
     * The description field of the navigation cell. This will be shown under the title.
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
} & NavigationCellOptions &
    Omit<CellProps, "leftAdornment" | "rightAdornment" | "onPress">;

export const NavigationCell = ({
    title,
    onPress,
    disabled = false,
    description,
    iconName,
    additionalTitlesRight,
    additionalTitlesUnder,
    ...cellProps
}: NavigationCellProps) => {
    const styles = useStyles(themeStyles);
    const token = useToken();

    const renderAdornmentIcon = (iconName: IconName) => (
        <View style={styles.adornmentContainer}>
            <Icon
                name={iconName}
                color={disabled ? "textDisabled" : undefined}
            />
        </View>
    );

    const renderAdditionalTitlesRight = () =>
        additionalTitlesRight?.map((text, index) => (
            <Typography
                key={index}
                numberOfLines={1}
                style={{ flex: 1, color: token.colors.text.tertiary }}
            >
                {text}
            </Typography>
        ));

    const renderAdditionalTitlesUnder = () =>
        additionalTitlesUnder?.map((text, index) => (
            <Typography
                key={index}
                numberOfLines={1}
                style={{ color: token.colors.text.tertiary }}
            >
                {text}
            </Typography>
        ));

    return (
        <Cell
            leftAdornment={
                iconName
                    ? renderAdornmentIcon(iconName ?? "dots-square")
                    : undefined
            }
            rightAdornment={renderAdornmentIcon("chevron-right")}
            onPress={disabled ? undefined : onPress}
            {...cellProps}
        >
            <View style={styles.contentContainer}>
                <View
                    style={[
                        styles.titleDescriptionContainer,
                        additionalTitlesRight ? { flex: 0.6 } : { flex: 1 },
                    ]}
                >
                    <Typography
                        numberOfLines={1}
                        style={[
                            additionalTitlesRight ? styles.title : undefined,
                            disabled
                                ? { color: token.colors.text.disabled }
                                : undefined,
                        ]}
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
                    {title && additionalTitlesUnder && (
                        <View style={styles.additionalTitlesUnderContainer}>
                            {renderAdditionalTitlesUnder()}
                        </View>
                    )}
                </View>
                {title && additionalTitlesRight && (
                    <View style={styles.additionalTitlesRightContainer}>
                        {renderAdditionalTitlesRight()}
                    </View>
                )}
            </View>
        </Cell>
    );
};

NavigationCell.displayName = "Cell.Navigation";

const themeStyles = EDSStyleSheet.create((theme) => ({
    contentContainer: {
        flexDirection: "row",
    },
    titleDescriptionContainer: {
        gap: theme.spacing.cell.content.titleDescriptionGap,
    },
    additionalTitlesRightContainer: {
        flex: 0.4,
        flexDirection: "row",
        gap: theme.spacing.spacer.large,
    },
    additionalTitlesUnderContainer: {
        flexDirection: "row",
        columnGap: theme.spacing.spacer.large,
        flexWrap: "wrap",
        rowGap: theme.spacing.cell.content.titleDescriptionGap,
    },
    adornmentContainer: {
        justifyContent: "center",
    },
    title: {
        paddingRight: theme.spacing.element.paddingHorizontal,
    },
}));
