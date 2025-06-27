import React from "react";
import { Typography } from "../../Typography";
import { useProgressItemContext } from "./ProgressItemContext";

type TitleProps = {
    title: string;
};
export const Title = ({ title }: TitleProps) => {
    const { status } = useProgressItemContext();
    return (
        <Typography
            numberOfLines={1}
            bold={status !== "success"}
            color={status === "notStarted" ? "textDisabled" : "textPrimary"}
            variant="h5"
        >
            {title}
        </Typography>
    );
};
