import { Density } from "@equinor/eds-mobile-components";
import { create } from "zustand";

type AppStoreState = {
    scheme: "light" | "dark" | null;
    setScheme: (scheme: "light" | "dark" | null) => void;
    density: Density;
    setDensity: (density: Density) => void;
};

export const useAppStore = create<AppStoreState>((set) => ({
    scheme: null as "light" | "dark" | null,
    setScheme: (scheme: "light" | "dark" | null) => set({ scheme }),
    density: "spacious",
    setDensity: (density: Density) => set({ density }),
}));
