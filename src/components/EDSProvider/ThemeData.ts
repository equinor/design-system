export enum Theme {
    Light,
    Dark,
}

export const ThemeData = {
    [Theme.Light]: {
        colors: {
            ui: {
                background: {
                    default: "white",
                },
            },
            text: {
                primary: "#3D3D3D",
            },
        },
    },
    [Theme.Dark]: {
        colors: {
            ui: {
                background: {
                    default: "#132634",
                },
            },
            text: {
                primary: "white",
            },
        },
    },
};
