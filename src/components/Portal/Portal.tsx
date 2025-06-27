import { PropsWithChildren, useContext, useEffect } from "react";
import { PortalContext } from "./PortalContext";

export type PortalProps = {
    /**
     * The name of the portal. The name will be registered and available for all components to route to.
     */
    name: "root" | Omit<string, "root">;
};

export const Portal = ({ name, children }: PropsWithChildren<PortalProps>) => {
    const { registerHost, bindNode } = useContext(PortalContext);
    const nameAsString = name as string;
    useEffect(() => {
        registerHost(nameAsString);
        bindNode(nameAsString, children);
        // eslint-disable-next-line react-hooks/exhaustive-deps -- adding methods to deps cause max recursion depth error
    }, [children, name]);

    useEffect(() => {
        return () => {
            bindNode(nameAsString, null);
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps -- adding methods to deps cause max recursion depth error
    }, [name]);

    return null;
};
