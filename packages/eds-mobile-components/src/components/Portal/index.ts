import { Portal as _Portal, PortalProps } from "./Portal";
import { PortalProvider } from "./PortalContext";
import { PortalHost, PortalHostProps } from "./PortalHost";

type PortalFamily = typeof _Portal & {
    Host: typeof PortalHost;
};

const Portal = _Portal as PortalFamily;
Portal.Host = PortalHost;

export { Portal, PortalProvider };
export type { PortalProps, PortalHostProps };
