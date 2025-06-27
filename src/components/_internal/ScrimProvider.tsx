import React, { PropsWithChildren } from "react";
import { Portal } from "../Portal";

export const ScrimProvider = ({ children }: PropsWithChildren) => {
    return (
        <Portal.Host style={{ flex: 1 }} renderPortalsFirst={false} name="scrim">
            {children}
        </Portal.Host>
    );
};
