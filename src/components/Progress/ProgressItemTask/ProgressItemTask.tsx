import React from "react";
import { View } from "react-native";
import { useStyles } from "../../../hooks/useStyles";
import { EDSStyleSheet } from "../../../styling";
import { Icon } from "../../Icon";
import { Typography } from "../../Typography";
import { ProgressStatusIndicator } from "../ProgressStatusInducator";
import { ProgressTask } from "../types";
import { ActionButtonsRow } from "../ActionButtonsRow";
import { Error } from "./Error";

type ProgressItemTaskProps = {
    task: ProgressTask;
};

export const ProgressItemTask = ({ task }: ProgressItemTaskProps) => {
    const styles = useStyles(themeStyles);

    const taskHasError = task.status === "error";

    const handleRetryButtonPress = () => {
        if (taskHasError) {
            task.onRetryButtonPress && task.onRetryButtonPress(task);
        }
    };

    const handleCopyTextButtonPress = () => {
        if (task?.error) {
            task.onCopyTextButtonPress && task.onCopyTextButtonPress(task?.error);
        }
    };

    return (
        <View style={styles.container}>
            <View style={styles.topRow}>
                <View style={styles.taskStatusAndTitle}>
                    <ProgressStatusIndicator size={24} status={task.status} />
                    <Typography
                        group="paragraph"
                        variant="body_short"
                        bold={task.status === "error" || task.status === "inProgress"}
                        color={task.status === "notStarted" ? "textTertiary" : "textPrimary"}
                    >
                        {task.title}
                    </Typography>
                </View>
                {task.icon && <Icon color={task.iconColor ?? "secondary"} name={task.icon} />}
            </View>
            {taskHasError && task.error && <Error error={task.error} />}
            <ActionButtonsRow
                shouldShowCopyTextButton={task.onCopyTextButtonPress !== undefined && taskHasError}
                shouldShowRetryButton={task.onRetryButtonPress !== undefined && taskHasError}
                handleCopyTextButtonPress={handleCopyTextButtonPress}
                handleRetryButtonPress={handleRetryButtonPress}
            />
        </View>
    );
};

const themeStyles = EDSStyleSheet.create(theme => ({
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
