import { useContext } from "react";
import { EDSContext } from "../components/EDSProvider/EDSContext";

/**
 * Resolves the current values from the master token directly.
 * Use this only when you specifically need values from the token directly in your component.
 * For styling, use `useStyles` with `EDSStyleSheet.create` instead.
 * @returns A resolved instance of the master token that adheres to the current app theme.
 */
export function useToken() {
    const context = useContext(EDSContext);
    if (!context) {
        throw new Error(
            "useToken must be called within a EDSProvider. Did you forget to wrap your application in it?",
        );
    }
    return context.token;
}
