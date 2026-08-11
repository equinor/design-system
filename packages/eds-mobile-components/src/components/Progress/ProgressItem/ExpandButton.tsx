import React from "react";
import { Button } from "../../Button";
import { useProgressItemContext } from "./ProgressItemContext";

type ExpandButtonProps = {
    variant: "secondary" | "ghost";
};

export const ExpandButton = ({ variant }: ExpandButtonProps) => {
    const { status, numTotalTasks, isExpanded, setIsExpanded } =
        useProgressItemContext();
    return (
        status !== "notStarted" &&
        numTotalTasks > 0 && (
            <Button
                trailingIcon={isExpanded ? "chevron-up" : "chevron-down"}
                label={isExpanded ? "Show less" : "Show more"}
                size="default"
                onPress={() => setIsExpanded(!isExpanded)}
                variant={variant}
            />
        )
    );
};
