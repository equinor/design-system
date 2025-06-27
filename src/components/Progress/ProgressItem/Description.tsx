import React from "react";
import { Typography } from "../../Typography";
import { useProgressItemContext } from "./ProgressItemContext";

type DescriptionProps = {
    description: string | ((completeTasks: number, totalTasks: number) => string);
};

export const Description = ({ description }: DescriptionProps) => {
    const { numCompletedTasks, numTotalTasks, status } = useProgressItemContext();
    return (
        <Typography
            color={status === "notStarted" ? "textDisabled" : "textPrimary"}
            variant="description"
            group="cell"
        >
            {typeof description === "function"
                ? description(numCompletedTasks, numTotalTasks)
                : description}
        </Typography>
    );
};
