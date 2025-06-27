import React, { createContext, PropsWithChildren, useEffect, useMemo, useState } from "react";
import { ProgressStatus, ProgressTask } from "../../types";
import { summarizeStatuses } from "../../progressUtils";

type ProgressItemContextValues = {
    status: ProgressStatus;
    tasks: ProgressTask[];
    failedTask?: ProgressTask;
    numCompletedTasks: number;
    numTotalTasks: number;
    isExpanded: boolean;
    setIsExpanded: (isExpanded: boolean) => void;
};

export const ProgressItemContext = createContext<ProgressItemContextValues | null>(null);

type ProgressItemProviderProps = {
    status?: ProgressStatus;
    tasks?: ProgressTask[];
};

export const ProgressItemProvider = ({
    tasks = [],
    status: inputStatus,
    children,
}: PropsWithChildren<ProgressItemProviderProps>) => {
    const [isExpanded, setIsExpanded] = useState(false);

    const numTotalTasks = tasks.length;

    const numCompletedTasks = useMemo(
        () => tasks.filter(task => task.status === "success").length,
        [tasks],
    );

    const status = useMemo(() => {
        const allStatuses = tasks.map(task => task.status);
        return inputStatus ?? summarizeStatuses(allStatuses);
    }, [inputStatus, tasks]);

    const failedTask = useMemo(() => tasks.find(task => task.status === "error"), [tasks]);

    useEffect(() => {
        if (status === "error" && tasks.length) {
            setIsExpanded(true);
        }
    }, [status, tasks.length]);

    return (
        <ProgressItemContext.Provider
            value={{
                tasks,
                status,
                isExpanded,
                setIsExpanded,
                numCompletedTasks,
                numTotalTasks,
                failedTask,
            }}
        >
            {children}
        </ProgressItemContext.Provider>
    );
};
