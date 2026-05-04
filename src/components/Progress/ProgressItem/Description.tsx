import React from "react";
import { useToken } from "../../../hooks/useToken";
import { Typography } from "../../Typography";
import { useProgressItemContext } from "./ProgressItemContext";

type DescriptionProps = {
    description:
        | string
        | ((completeTasks: number, totalTasks: number) => string);
};

export const Description = ({ description }: DescriptionProps) => {
    const { numCompletedTasks, numTotalTasks, status } =
        useProgressItemContext();
    const token = useToken();
    return (
        <Typography
            size="md"
            style={{
                color:
                    status === "notStarted"
                        ? token.colors.text.disabled
                        : token.colors.text.primary,
            }}
        >
            {typeof description === "function"
                ? description(numCompletedTasks, numTotalTasks)
                : description}
        </Typography>
    );
};
