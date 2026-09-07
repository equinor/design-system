import React, { PropsWithChildren, ReactElement } from "react";
import { render, RenderOptions } from "@testing-library/react-native";
import { EDSProvider } from "./src/components/EDSProvider";

const Providers = ({ children }: PropsWithChildren) => (
    <EDSProvider colorScheme="light" density="comfortable">
        {children}
    </EDSProvider>
);

const renderWithProviders = (
    ui: ReactElement,
    options?: RenderOptions
) => render(ui, { wrapper: Providers, ...options });

export * from "@testing-library/react-native";
export { renderWithProviders as render };
