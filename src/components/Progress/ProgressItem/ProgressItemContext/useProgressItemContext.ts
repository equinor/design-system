import { useContext } from "react";
import { ProgressItemContext } from "./ProgressItemProvider";

export const useProgressItemContext = () => {
    const context = useContext(ProgressItemContext);
    if (!context) {
        throw new Error("useProgressItemContext must be used within a ProgressItemProvider");
    }
    return context;
};
