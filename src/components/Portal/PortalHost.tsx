import React, { PropsWithChildren, memo, useContext, useEffect, useMemo } from "react";
import { PortalContext } from "./PortalContext";
import { View, ViewProps } from "react-native";

export type PortalHostProps = {
    /**
     * Identifier for portals to push content to.
     */
    name: "root" | Omit<string, "root">;
    /**
     * Determines whether or not the portal content is rendered before or after the children of the portal host
     */
    renderPortalsFirst?: boolean;
};

const PortalHostComponent = ({
    name,
    children,
    renderPortalsFirst = true,
    ...rest
}: PropsWithChildren<PortalHostProps & ViewProps>) => {
    const { registerHost, unregisterHost, hosts } = useContext(PortalContext);

    useEffect(() => {
        registerHost(name as string);
        return () => unregisterHost(name as string);
        // eslint-disable-next-line react-hooks/exhaustive-deps -- adding methods to deps cause max recursion error
    }, [name]);

    const host = useMemo(() => hosts.find(host => host.name === name), [hosts, name]);
    return (
        <View {...rest}>
            {renderPortalsFirst && host?.node}
            {children}
            {!renderPortalsFirst && host?.node}
        </View>
    );
};
export const PortalHost = memo(PortalHostComponent);
PortalHost.displayName = "Portal.Host";
