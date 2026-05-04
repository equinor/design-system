import React from "react";
import { View } from "react-native";
import { useStyles } from "../../../hooks/useStyles";
import { useToken } from "../../../hooks/useToken";
import { EDSStyleSheet } from "../../../styling";
import { Icon } from "../../Icon";
import { Typography } from "../../Typography";
import { ActionButtonsRow } from "../ActionButtonsRow";
import { ProgressStatusIndicator } from "../ProgressStatusInducator";
import { ProgressTask } from "../types";
import { Error } from "./Error";

type ProgressItemTaskProps = {
    task: ProgressTask;
};

export const ProgressItemTask = ({ task }: ProgressItemTaskProps) => {
    const styles = useStyles(themeStyles);
    const token = useToken();

    const taskHasError = task.status === "error";

    const handleRetryButtonPress = () => {
        if (taskHasError) {
            task.onRetryButtonPress?.(task);
        }
    };

    const handleCopyTextButtonPress = () => {
        if (task?.error) {
            task.onCopyTextButtonPress?.(task.error);
        }
    };

    return (
        <View style={styles.container}>
            <View style={styles.topRow}>
                <View style={styles.taskStatusAndTitle}>
                    <ProgressStatusIndicator size={24} status={task.status} />
                    <Typography
                        size="xl"
                        weight={
                            task.status === "error" ||
                            task.status === "inProgress"
                                ? "bolder"
                                : "normal"
                        }
                        style={{
                            color:
                                task.status === "notStarted"
                                    ? token.colors.text.tertiary
                                    : token.colors.text.primary,
                        }}
                    >
                        {task.title}
                    </Typography>
                </View>
                {task.icon && (
                    <Icon
                        color={task.iconColor ?? "secondary"}
                        name={task.icon}
                    />
                )}
            </View>
            {taskHasError && task.error && <Error error={task.error} />}
            <ActionButtonsRow
                shouldShowCopyTextButton={
                    task.onCopyTextButtonPress !== undefined && taskHasError
                }
                shouldShowRetryButton={
                    task.onRetryButtonPress !== undefined && taskHasError
                }
                handleCopyTextButtonPress={handleCopyTextButtonPress}
                handleRetryButtonPress={handleRetryButtonPress}
            />
        </View>
    );
};

const themeStyles = EDSStyleSheet.create((theme) => ({
    container: {
        gap: theme.spacing.element.paddingVertical,
    },
    topRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    },
    taskStatusAndTitle: {
        flexDirection: "row",
        alignItems: "center",
        gap: theme.spacing.button.iconGap,
    },
}));
