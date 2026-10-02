export type TimingToken = {
    animation: {
        slow: number;
        normal: number;
        fast: number;
    };
};

// TODO: replace with @equinor/eds-tokens animation/timing tokens once available.
export const timingToken: TimingToken = {
    animation: {
        slow: 250,
        normal: 100,
        fast: 50,
    },
};
