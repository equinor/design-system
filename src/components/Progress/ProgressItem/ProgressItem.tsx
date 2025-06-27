import React from "react";
import { View, ViewProps } from "react-native";
import { Breakpoint, useBreakpoint } from "../../../hooks/useBreakpoint";
import { useStyles } from "../../../hooks/useStyles";
import { EDSStyleSheet } from "../../../styling";
import { ProgressItemTask } from "../ProgressItemTask/ProgressItemTask";
import { ProgressStatusIndicator } from "../ProgressStatusInducator";
import { ProgressStatus, ProgressTask } from "../types";
import { ActionButtonsRow } from "../ActionButtonsRow";
import { ExpandableSection } from "./ExpandableSection";
import { ExpandButton } from "./ExpandButton";
import { ProgressItemProvider, useProgressItemContext } from "./ProgressItemContext";
import { ProgressLine } from "./ProgressLine";
import { Description } from "./Description";
import { Title } from "./Title";
import { Spacer } from "../../Spacer";

type ProgressItemPropsOptions =
    | {
          /**
           * An array of tasks to be tracked by the progress item. Each task represents a unit of work whose progress or status can be monitored.
           * Specifying `tasks` will automatically determine the overall status of the progress item based on the individual statuses of these tasks.
           */
          tasks: ProgressTask[];
          /**
           * The `status` prop should not be used when `tasks` is provided. The overall status is computed based on the progress of the individual tasks.
           */
          status?: never;
          /**
           * Optional description to show under the progress task title. Can either be a string or a function that receives the number of completed tasks and the total number of tasks and returns a string.
           */
          description?: string | ((completedTasks: number, totalTasks: number) => string);
      }
    | {
          /**
           * When `tasks` is not provided, the `status` prop can be used to manually set the overall status of the progress item.
           * This is useful for simpler use cases where there is a single task or the progress does not need to be broken down into individual tasks.
           */
          tasks?: never;
          /**
           * Manually set the overall status of the progress item. Valid statuses; 'notStarted', 'inProgress', 'success', 'removed' or 'error'.
           */
          status: ProgressStatus;
          /**
           * Optional description to show under the progress task title.
           */
          description?: string;
      };

export type ProgressItemProps = {
    /**
     * Optional title for the progress item
     */
    title: string;
    /**
     * Callback function that is invoked when the retry button is pressed, allowing the specific failed task to be retried.
     * The placement of this button is below the progress item as a whole. If you want this to instead only show for the failing task,
     * you can use the `onRetryButtonPress` callback on the individual task object instead.
     * @param task The task object that failed and needs to be retried.
     */
    onRetryButtonPress?: (task: ProgressTask) => void;
    /**
     * Callback function that is invoked when the copy button is pressed, allowing the error message to be copied to the clipboard.
     * The placement of this button is below the progress item as a whole. If you want this to instead only show for the failing task,
     * you can use the `onCopyButtonPress` callback on the individual task object instead.
     * @param task The task object that contains the error message to be copied.
     */
    onCopyTextButtonPress?: (task: ProgressTask) => void;
} & ProgressItemPropsOptions &
    ViewProps;

const ICON_SIZE = 42;

export const ProgressItem = (props: ProgressItemProps) => {
    return (
        <ProgressItemProvider status={props.status} tasks={props.tasks}>
            <WrappedProgressItem {...props} />
        </ProgressItemProvider>
    );
};

const WrappedProgressItem = ({
    title,
    description,
    tasks = [],
    onRetryButtonPress,
    onCopyTextButtonPress,
    status: _,
    ...viewProps
}: ProgressItemProps) => {
    const breakpoint = useBreakpoint();
    const styles = useStyles(themeStyles, { breakpoint });
    const { failedTask, isExpanded, status } = useProgressItemContext();

    const handleRetryButtonPress = () => {
        if (failedTask) {
            onRetryButtonPress && onRetryButtonPress(failedTask);
        }
    };

    const shouldPadBottomRow =
        (breakpoint === "xs" && !isExpanded && tasks.length) ||
        (status === "error" && (!!onRetryButtonPress || !!onCopyTextButtonPress));

    return (
        <View {...viewProps} style={[styles.container, viewProps.style]}>
            <View style={styles.row}>
                <ProgressStatusIndicator
                    size={ICON_SIZE}
                    status={status}
                    style={[styles.leftCol, styles.centered]}
                />
                <View style={styles.titleAndDescription}>
                    <View style={styles.titleRow}>
                        <Title title={title} />
                        {breakpoint !== "xs" && <ExpandButton variant="ghost" />}
                    </View>
                    {description && <Description description={description} />}
                </View>
            </View>

            <View style={styles.row}>
                <ProgressLine style={styles.leftCol} />
                {tasks.length ? (
                    <ExpandableSection isExpanded={isExpanded}>
                        <View style={styles.progressTaskItemContainer}>
                            {tasks.map((task, index) => (
                                <ProgressItemTask key={index} task={task} />
                            ))}
                        </View>
                    </ExpandableSection>
                ) : null}
            </View>

            {shouldPadBottomRow && <Spacer amount="small" />}

            <View style={styles.row}>
                <View style={styles.leftCol} />
                <View style={styles.buttonRow}>
                    {breakpoint === "xs" && <ExpandButton variant="outlined" />}
                    <ActionButtonsRow
                        shouldShowRetryButton={onRetryButtonPress !== undefined}
                        shouldShowCopyTextButton={onCopyTextButtonPress !== undefined}
                        handleRetryButtonPress={handleRetryButtonPress}
                        handleCopyTextButtonPress={handleRetryButtonPress}
                    />
                </View>
            </View>
        </View>
    );
};

ProgressItem.displayName = "Progress.Item";

type ProgressItemStyleProps = {
    breakpoint: Breakpoint;
};

const themeStyles = EDSStyleSheet.create((token, props: ProgressItemStyleProps) => ({
    container: {
        paddingHorizontal: token.spacing.container.paddingHorizontal,
        paddingVertical: token.spacing.spacer.small,
        flexDirection: "column",
    },
    progressTaskItemContainer: {
        paddingVertical: token.spacing.element.paddingVertical,
        gap: token.spacing.cell.gapHorizontal,
    },
    row: {
        flexDirection: "row",
    },
    leftCol: {
        width: ICON_SIZE,
        marginRight: token.spacing.element.paddingHorizontal,
    },
    centered: {
        alignItems: "center",
        justifyContent: "center",
    },
    buttonRow: {
        flexDirection: "row",
        gap: token.spacing.spacer.medium,
    },
    titleRow: {
        height: props.breakpoint !== "xs" ? token.geometry.dimension.button.minHeight : undefined,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
    },
    titleAndDescription: {
        flex: 1,
        justifyContent: "center",
        gap: props.breakpoint === "xs" ? token.spacing.element.paddingVertical : undefined,
    },
}));
