import React, { PropsWithChildren, ReactNode, createContext, useCallback, useState } from "react";

export type PortalContextType = {
    /**
     * Register a new host in the context.
     * @param name The name of the portal to register.
     */
    registerHost: (name: string) => void;
    /**
     * Deletes the portal from the registry.
     * @param name The name of the portal to delete.
     */
    unregisterHost: (name: string) => void;
    /**
     * Relates a react component to the portal with the provided name.
     * @param name Name of the portal to relate the react component to.
     * @param node The react component.
     */
    bindNode: (name: string, node: ReactNode) => void;
    /**
     * A list containing the portal hosts.
     */
    hosts: PortalHostType[];
};

export type PortalHostType = {
    /**
     * Name of the portal.
     */
    name: string;
    /**
     * Component attached to the portal.
     */
    node?: ReactNode;
};

export const PortalContext = createContext<PortalContextType>({
    registerHost: () => null,
    unregisterHost: () => null,
    bindNode: () => null,
    hosts: [],
});

export const PortalProvider = ({ children }: PropsWithChildren) => {
    const [hosts, setHosts] = useState<PortalHostType[]>([]);

    const registerHost = useCallback(
        (name: string) => {
            if (hosts.find(host => host.name === name)) return;
            setHosts(state => [...state, { name: name }]);
        },
        [hosts],
    );

    const unregisterHost = useCallback((name: string) => {
        setHosts(state => state.filter(host => host.name !== name));
    }, []);

    const bindNode = useCallback((name: string, node: ReactNode) => {
        setHosts(state =>
            state.map(host => {
                if (host.name === name) {
                    return {
                        ...host,
                        node: node,
                    };
                } else {
                    return host;
                }
            }),
        );
    }, []);

    const contextOptions = {
        registerHost,
        unregisterHost,
        bindNode,
        hosts,
    };

    return <PortalContext.Provider value={contextOptions}>{children}</PortalContext.Provider>;
};
