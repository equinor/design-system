import { MasterToken } from "../../styling/tokens";
import { IconName } from "../Icon";
import { ProgressStatus } from "./types";

export const statusToIconName = (status: ProgressStatus): IconName => {
    switch (status) {
        case "success":
            return "check-circle-outline";
        case "error":
            return "alert-circle-outline";
        case "notStarted":
            return "clock-time-five-outline";
        default:
            return "blank";
    }
};

export const statusToColor = (status: ProgressStatus, token: MasterToken) => {
    switch (status) {
        case "inProgress":
            return token.colors.interactive.primary;
        case "success":
            return token.colors.feedback.success;
        case "error":
            return token.colors.feedback.danger;
        case "notStarted":
        default:
            return token.colors.text.primary;
    }
};

export const summarizeStatuses = (
    statuses: ProgressStatus[]
): ProgressStatus => {
    const statusPrecedence: ProgressStatus[] = [
        "error",
        "inProgress",
        "success",
        "notStarted",
    ];
    const precedenceReduced = statusPrecedence.find((status) =>
        statuses.includes(status)
    );
    if (!precedenceReduced) return "notStarted";
    if (
        precedenceReduced === "success" &&
        statuses.some((status) => status !== "success")
    )
        return "inProgress";
    return precedenceReduced;
};
