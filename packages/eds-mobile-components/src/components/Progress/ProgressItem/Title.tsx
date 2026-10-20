import React from "react";
import { useToken } from "../../../hooks/useToken";
import { Typography } from "../../Typography";
import { useProgressItemContext } from "./ProgressItemContext";

type TitleProps = {
    title: string;
};
export const Title = ({ title }: TitleProps) => {
    const { status } = useProgressItemContext();
    const token = useToken();
    return (
        <Typography.Header
            size="xl"
            numberOfLines={1}
            weight={status !== "success" ? "bolder" : "normal"}
            style={{
                color:
                    status === "notStarted"
                        ? token.colors.text.disabled
                        : token.colors.text.primary,
            }}
        >
            {title}
        </Typography.Header>
    );
};
