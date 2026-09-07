import { IconName } from "../Icon";

export type ProgressStatus = "success" | "error" | "notStarted" | "inProgress";

export type ProgressTaskError = {
    /**
     * A descriptive message detailing the error that occurred. This should provide enough context to understand what went wrong during the task's execution.
     */
    message: string;
    /**
     * An optional error code that can be used to categorize the error or provide specific information for troubleshooting. Error codes can facilitate programmatic responses to different types of errors.
     */
    code?: string;
    /**
     * An optional suggestion for resolving the error. This could include steps for the user to follow in order to retry the task successfully, or advice on how to avoid similar errors in the future.
     */
    suggestion?: string;
};

export type ProgressTask = {
    /**
     * The title of the task. This should be a concise but descriptive string that identifies the task being performed to the user.
     */
    title: string;
    /**
     * This is an optional icon that can be displayed next to the task title on the right side to provide visual context for the task being performed.
     */
    icon?: IconName;
    /**
     * The color of the icon.
     */
    iconColor?: "primary" | "secondary" | "danger";
    /**
     * The current status of the task. This status should reflect where in the execution process the task currently is, such as 'notStarted', 'inProgress', 'success', or 'error'.
     */
    status: ProgressStatus;
    /**
     * Optional details about any error that has occurred during the task's execution. If provided, this should include a message detailing the error, and may also include an error code and suggestions for how to resolve the issue.
     */
    error?: ProgressTaskError;
    /**
     * Callback function that is called when the copy text button is pressed, providing the error details of the failed task.
     * @param message An object containing details of the task error.
     */
    onCopyTextButtonPress?: (message: ProgressTaskError) => void;
    /**
     * Callback function that is invoked when the retry button is pressed, allowing the specific failed task to be retried.
     * @param task The task object that failed and needs to be retried.
     */
    onRetryButtonPress?: (task: ProgressTask) => void;
};
