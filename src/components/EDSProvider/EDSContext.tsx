import { createContext } from "react";
import { ColorScheme, Density } from "../../styling";
import { MasterToken } from "../../styling/tokens";

export type EDSContextType = {
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

    /**
     * The current themed token for the app. This is automatically inferred from the color scheme and density values.
     */
    token: MasterToken;
};

export const EDSContext = createContext<EDSContextType | null>(null);

EDSContext.displayName = "EDSContext";
