import { Progress as _Progress, ProgressProps } from "./Progress";
import { ProgressTask, ProgressStatus, ProgressTaskError } from "./types";
import { ProgressItem, ProgressItemProps } from "./ProgressItem";

type ProgressFamily = typeof _Progress & {
    Item: typeof ProgressItem;
};

const Progress = _Progress as ProgressFamily;
Progress.Item = ProgressItem;

export { Progress };
export type {
    ProgressProps,
    ProgressItemProps as ProgressItem,
    ProgressTask,
    ProgressStatus,
    ProgressTaskError,
};
