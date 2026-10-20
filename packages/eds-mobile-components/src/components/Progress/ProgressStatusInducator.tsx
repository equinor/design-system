import React from "react";
import { View, ViewProps } from "react-native";
import { useToken } from "../../hooks/useToken";
import { Icon } from "../Icon";
import { CircularProgress } from "../ProgressIndicator";
import { statusToColor, statusToIconName } from "./progressUtils";
import { ProgressStatus } from "./types";

export type ProgressStatusIndicatorProps = {
    size: number;
    status: ProgressStatus;
} & ViewProps;

export const ProgressStatusIndicator = ({
    status,
    size,
    ...viewProps
}: ProgressStatusIndicatorProps) => {
    const token = useToken();

    return (
        <View {...viewProps}>
            {status === "inProgress" ? (
                <CircularProgress size={size} />
            ) : (
                <Icon
                    name={statusToIconName(status)}
                    color={statusToColor(status, token)}
                    size={size}
                />
            )}
        </View>
    );
};
