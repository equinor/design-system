import { create } from "zustand";

type AppStoreState = {
    scheme: "light" | "dark" | null;
    setScheme: (scheme: "light" | "dark" | null) => void;
};

export const useAppStore = create<AppStoreState>((set) => ({
    scheme: null as "light" | "dark" | null,
    setScheme: (scheme: "light" | "dark" | null) => set({ scheme }),
}));
