import React from "react";
import { Button } from "../../Button";
import { useProgressItemContext } from "./ProgressItemContext";

type ExpandButtonProps = {
    variant: "outlined" | "ghost";
};

export const ExpandButton = ({ variant }: ExpandButtonProps) => {
    const { status, numTotalTasks, isExpanded, setIsExpanded } = useProgressItemContext();
    return (
        status !== "notStarted" &&
        numTotalTasks > 0 && (
            <Button
                iconName={isExpanded ? "chevron-up" : "chevron-down"}
                title={isExpanded ? "Show less" : "Show more"}
                iconPosition="trailing"
                onPress={() => setIsExpanded(!isExpanded)}
                variant={variant}
            />
        )
    );
};
