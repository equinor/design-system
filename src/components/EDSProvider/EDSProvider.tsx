import React, { PropsWithChildren, useMemo } from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { createTokenProxy } from "../../styling/createTokenProxy";
import {
    MasterToken,
    ProxyableMasterToken,
    SpacingToken,
    WithoutThemeOptionValues,
    comfortableSpacingToken,
    spaciousSpacingToken,
} from "../../styling/tokens";
import {
    ColorToken,
    darkColorToken,
    lightColorToken,
} from "../../styling/tokens/colorToken";
import { ColorScheme, Density } from "../../styling/types";
import { ScrimProvider } from "../_internal/ScrimProvider";
import { DialogServiceProvider } from "../Dialog/service/DialogServiceProvider";
import { Portal, PortalProvider } from "../Portal";
import { EDSContext } from "./EDSContext";

export type EDSProviderProps = {
    /**
     * The color scheme to use for the components. You can fetch the system scheme using the
     * `useColorScheme` hook provided by react native.
     * @see https://reactnative.dev/docs/usecolorscheme
     */
    colorScheme: ColorScheme;
    /**
     * The density value to use for the components. You can configure the conditional for these yourself,
     * but an advised approach is to treat all screen widths below 576 as `comfortable`.
     */
    density: Density;
};

export const EDSProvider = (props: PropsWithChildren<EDSProviderProps>) => {
    const spacingToken: SpacingToken = useMemo(() => {
        if (props.density === "comfortable") {
            return comfortableSpacingToken;
        }
        return spaciousSpacingToken;
    }, [props.density]);

    const colorToken: ColorToken = useMemo(() => {
        if (props.colorScheme === "light") {
            return lightColorToken;
        }
        return darkColorToken;
    }, [props.colorScheme]);

    const masterToken = useMemo(() => {
        const proxy = createTokenProxy(props.colorScheme, props.density);
        const cleanProxyable = JSON.parse(
            JSON.stringify(proxy)
        ) as WithoutThemeOptionValues<ProxyableMasterToken>;
        return {
            ...cleanProxyable,
            newSpacing: spacingToken,
            newColors: colorToken,
        } satisfies MasterToken;
    }, [props.colorScheme, props.density, spacingToken, colorToken]);

    return (
        <EDSContext.Provider
            value={{
                colorScheme: props.colorScheme,
                density: props.density,
                token: masterToken,
            }}
        >
            <GestureHandlerRootView style={{ flex: 1 }}>
                <PortalProvider>
                    <ScrimProvider>
                        <Portal.Host style={{ flex: 1 }} name="root">
                            {props.children}
                            <DialogServiceProvider />
                        </Portal.Host>
                    </ScrimProvider>
                </PortalProvider>
            </GestureHandlerRootView>
        </EDSContext.Provider>
    );
};

EDSProvider.displayName = "EDSProvider";
