/**
 * SPIKE, DO NOT MERGE. Text trim investigation, findings are in the internal discussion.
 *
 * Mirrors documentation/spikes/text-trim/web.html. Values are the live Tokens Studio density
 * sets (read 2026-10-05), resolved to px. Font ratios were parsed from the OTF tables.
 */
import { Section } from "@/components/Section";
import { Surface } from "@/components/Surface";
import { useAppStore } from "@/lib/store";
import { Button, Typography } from "@equinor/eds-mobile-components";
import { useCallback, useState } from "react";
import {
    LayoutChangeEvent,
    NativeSyntheticEvent,
    ScrollView,
    Text,
    TextLayoutEventData,
    View,
} from "react-native";

type DensityKey = "comfortable" | "compact" | "relaxed";
type SizeKey = "default" | "small";
type Method = "A" | "C";

const TOKENS: Record<
    DensityKey,
    {
        uiSm: [number, number];
        uiMd: [number, number];
        s3xs: number;
        xs: number;
        sm: number;
        radius: number;
    }
> = {
    comfortable: { uiSm: [12, 16], uiMd: [14, 20], s3xs: 4, xs: 8, sm: 12, radius: 4 },
    compact: { uiSm: [10, 12], uiMd: [12, 16], s3xs: 2, xs: 6, sm: 10, radius: 2 },
    relaxed: { uiSm: [14, 20], uiMd: [16, 24], s3xs: 6, xs: 10, sm: 16, radius: 6 },
};

// Inter Medium, parsed from the font file: share of the font size.
const INTER = { cap: 0.728, asc: 0.969, desc: 0.241 };
// Equinor Bold, parsed from the font file: share of the font size.
const EQUINOR = { cap: 0.7, asc: 0.788, desc: 0.212 };

type HeaderSize = "xs" | "sm" | "md";
// Header typography tokens (Equinor), font size / line height in px, from the live density sets.
const HEADER: Record<DensityKey, Record<HeaderSize, [number, number]>> = {
    comfortable: { xs: [12, 16], sm: [14, 16], md: [16, 20] },
    compact: { xs: [10, 12], sm: [12, 16], md: [14, 16] },
    relaxed: { xs: [14, 16], sm: [16, 20], md: [18, 24] },
};

function equinorNumbers(density: DensityKey, size: HeaderSize) {
    const t = TOKENS[density];
    const [fs, lh] = HEADER[density][size];
    const halfLeading = (lh - (EQUINOR.asc + EQUINOR.desc) * fs) / 2;
    return {
        fs,
        lh,
        padV: t.xs,
        padH: t.sm,
        radius: t.radius,
        above: halfLeading + (EQUINOR.asc - EQUINOR.cap) * fs,
        below: halfLeading + EQUINOR.desc * fs,
    };
}

const METHOD_NAME: Record<Method, string> = {
    A: "A. Untrimmed (Figma)",
    C: "C. Trimmed to cap height (stored font metrics)",
};

type Line = { y: number; height: number; ascender: number; capHeight: number };
type Measure = { height?: number; labelY?: number; line?: Line };

function geometry(density: DensityKey, size: SizeKey) {
    const t = TOKENS[density];
    return size === "default"
        ? { fs: t.uiMd[0], lh: t.uiMd[1], padV: t.xs, padH: t.sm, radius: t.radius }
        : { fs: t.uiSm[0], lh: t.uiSm[1], padV: t.s3xs, padH: t.xs, radius: t.radius };
}

const f = (n: number) => n.toFixed(2);

function describe(m: Measure | undefined, expected?: number, expectedLabel = "Figma") {
    if (!m || m.height === undefined) return "measuring...";
    let text = `height ${f(m.height)}`;
    if (expected !== undefined) {
        text += ` | ${expectedLabel} ${f(expected)} | diff ${f(m.height - expected)}`;
    }
    if (m.labelY !== undefined && m.line) {
        const baseline = m.labelY + m.line.y + m.line.ascender;
        const capTop = baseline - m.line.capHeight;
        text += ` | gap above capitals ${f(capTop)} | gap below baseline ${f(m.height - baseline)}`;
    }
    return text;
}

export default function TextTrimSpikeScreen() {
    const appDensity = useAppStore((s) => s.density);
    const [measures, setMeasures] = useState<Record<string, Measure>>({});
    const update = useCallback((id: string, patch: Measure) => {
        setMeasures((prev) => ({ ...prev, [id]: { ...prev[id], ...patch } }));
    }, []);

    return (
        <ScrollView contentInsetAdjustmentBehavior="automatic">
            <Section title="Text trim spike (mobile)">
                <Typography size="sm">
                    Heights are measured on this device. Gaps are from the button edge to the top
                    of a capital letter and to the baseline, from React Native's own text layout.
                    Figma expected = 2 x vertical padding + line height.
                </Typography>
            </Section>

            {(Object.keys(TOKENS) as DensityKey[]).map((density) => (
                <View key={density}>
                    <Section title={`Density: ${density}`} />
                    <Surface>
                        {(["default", "small"] as SizeKey[]).map((size) =>
                            (["A", "C"] as Method[]).map((method) => {
                                const id = `${density}-${size}-${method}`;
                                const g = geometry(density, size);
                                return (
                                    <View key={id} style={{ gap: 4 }}>
                                        <Typography size="sm">
                                            {`${size} (${g.fs}/${g.lh}, pad ${g.padV}/${g.padH}) ${METHOD_NAME[method]}`}
                                        </Typography>
                                        <SpikeButton
                                            id={id}
                                            density={density}
                                            size={size}
                                            method={method}
                                            update={update}
                                        />
                                        <Typography size="sm">
                                            {describe(measures[id], 2 * g.padV + g.lh)}
                                        </Typography>
                                    </View>
                                );
                            })
                        )}
                    </Surface>
                </View>
            ))}

            <Section title={`Current Button (legacy tokens, app density: ${appDensity})`} />
            <Surface>
                {(["default", "small"] as SizeKey[]).map((size) => {
                    const id = `current-${size}`;
                    return (
                        <View key={id} style={{ gap: 4 }}>
                            <View
                                style={{ alignSelf: "flex-start" }}
                                onLayout={(e: LayoutChangeEvent) =>
                                    update(id, { height: e.nativeEvent.layout.height })
                                }
                            >
                                <Button label="Label" size={size} />
                            </View>
                            <Typography size="sm">{`${size}: ${describe(measures[id])}`}</Typography>
                        </View>
                    );
                })}
            </Surface>

            <Section title="Equinor Bold, uppercase (overline-style label)">
                <Typography size="sm">
                    Sizes are the header xs, sm and md tokens. Padding is the same as the default
                    Button. Predicted and intended gaps come from the font file tables.
                </Typography>
            </Section>
            {(Object.keys(TOKENS) as DensityKey[]).map((density) => (
                <Surface key={`eq-${density}`}>
                    <Typography size="sm">{`Density: ${density}`}</Typography>
                    {(["xs", "sm", "md"] as HeaderSize[]).map((size) =>
                        (["A", "C"] as Method[]).map((method) => {
                            const id = `eq-${density}-${size}-${method}`;
                            const n = equinorNumbers(density, size);
                            const trim = method === "C";
                            const target = trim
                                ? 2 * n.padV + EQUINOR.cap * n.fs
                                : 2 * n.padV + n.lh;
                            const predicted = trim
                                ? `intended gaps ${f(n.padV)} / ${f(n.padV)}`
                                : `predicted gaps ${f(n.padV + n.above)} / ${f(n.padV + n.below)}`;
                            return (
                                <View key={id} style={{ gap: 4 }}>
                                    <Typography size="sm">
                                        {`header ${size} (${n.fs}/${n.lh}, pad ${n.padV}/${n.padH}) ${METHOD_NAME[method]}`}
                                    </Typography>
                                    <OverlineButton
                                        id={id}
                                        density={density}
                                        size={size}
                                        method={method}
                                        update={update}
                                    />
                                    <Typography size="sm">
                                        {`${describe(
                                            measures[id],
                                            target,
                                            trim ? "trim target" : "expected"
                                        )} | ${predicted}`}
                                    </Typography>
                                </View>
                            );
                        })
                    )}
                </Surface>
            ))}

            <Section title="Instrument check" />
            <Surface>
                <Typography size="sm">
                    Red lines are measured by React Native. Blue lines are the prediction from the
                    font tables. Both should sit on the bottom of the letters and the top of the
                    capitals.
                </Typography>
                <InstrumentCheck family="Inter" weight="bolder" metrics={INTER} />
                <InstrumentCheck family="Equinor-Bold" metrics={EQUINOR} />
            </Surface>
        </ScrollView>
    );
}

function SpikeButton({
    id,
    density,
    size,
    method,
    update,
}: {
    id: string;
    density: DensityKey;
    size: SizeKey;
    method: Method;
    update: (id: string, patch: Measure) => void;
}) {
    const g = geometry(density, size);
    // Space inside the line box above the capitals and below the baseline, from font metrics.
    const halfLeading = (g.lh - (INTER.asc + INTER.desc) * g.fs) / 2;
    const above = halfLeading + (INTER.asc - INTER.cap) * g.fs;
    const below = halfLeading + INTER.desc * g.fs;
    const trim = method === "C";

    return (
        <View
            onLayout={(e: LayoutChangeEvent) =>
                update(id, { height: e.nativeEvent.layout.height })
            }
            style={{
                alignSelf: "flex-start",
                backgroundColor: "#21767e",
                borderRadius: g.radius,
                paddingVertical: g.padV,
                paddingHorizontal: g.padH,
            }}
        >
            <Typography
                weight="bolder"
                onLayout={(e: LayoutChangeEvent) =>
                    update(id, { labelY: e.nativeEvent.layout.y })
                }
                onTextLayout={(e: NativeSyntheticEvent<TextLayoutEventData>) =>
                    update(id, { line: e.nativeEvent.lines[0] })
                }
                style={{
                    color: "#ffffff",
                    fontSize: g.fs,
                    lineHeight: g.lh,
                    marginTop: trim ? -above : 0,
                    marginBottom: trim ? -below : 0,
                }}
            >
                Label
            </Typography>
        </View>
    );
}

function OverlineButton({
    id,
    density,
    size,
    method,
    update,
}: {
    id: string;
    density: DensityKey;
    size: HeaderSize;
    method: Method;
    update: (id: string, patch: Measure) => void;
}) {
    const n = equinorNumbers(density, size);
    const trim = method === "C";

    return (
        <View
            onLayout={(e: LayoutChangeEvent) =>
                update(id, { height: e.nativeEvent.layout.height })
            }
            style={{
                alignSelf: "flex-start",
                backgroundColor: "#21767e",
                borderRadius: n.radius,
                paddingVertical: n.padV,
                paddingHorizontal: n.padH,
            }}
        >
            <Text
                onLayout={(e: LayoutChangeEvent) =>
                    update(id, { labelY: e.nativeEvent.layout.y })
                }
                onTextLayout={(e: NativeSyntheticEvent<TextLayoutEventData>) =>
                    update(id, { line: e.nativeEvent.lines[0] })
                }
                style={{
                    color: "#ffffff",
                    fontFamily: "Equinor-Bold",
                    fontSize: n.fs,
                    lineHeight: n.lh,
                    marginTop: trim ? -n.above : 0,
                    marginBottom: trim ? -n.below : 0,
                }}
            >
                OVERLINE
            </Text>
        </View>
    );
}

function InstrumentCheck({
    family,
    weight,
    metrics,
}: {
    family: string;
    weight?: "bolder";
    metrics: { cap: number; asc: number; desc: number };
}) {
    const [line, setLine] = useState<Line | undefined>();
    const fs = 56;
    const lh = 80;
    const halfLeading = (lh - (metrics.asc + metrics.desc) * fs) / 2;
    const predBaseline = halfLeading + metrics.asc * fs;
    const predCapTop = predBaseline - metrics.cap * fs;
    const measuredBaseline = line ? line.y + line.ascender : undefined;
    const measuredCapTop =
        line && measuredBaseline !== undefined ? measuredBaseline - line.capHeight : undefined;

    const hairline = (top: number, color: string, key: string) => (
        <View
            key={key}
            pointerEvents="none"
            style={{
                position: "absolute",
                left: -10,
                right: -10,
                top,
                height: 1,
                backgroundColor: color,
            }}
        />
    );

    return (
        <View style={{ gap: 4 }}>
            <View style={{ alignSelf: "flex-start", backgroundColor: "#fff3c4" }}>
                {weight ? (
                    <Typography
                        weight={weight}
                        onTextLayout={(e: NativeSyntheticEvent<TextLayoutEventData>) =>
                            setLine(e.nativeEvent.lines[0])
                        }
                        style={{ fontSize: fs, lineHeight: lh }}
                    >
                        HEH
                    </Typography>
                ) : (
                    <Text
                        onTextLayout={(e: NativeSyntheticEvent<TextLayoutEventData>) =>
                            setLine(e.nativeEvent.lines[0])
                        }
                        style={{ fontFamily: family, fontSize: fs, lineHeight: lh, color: "#1a1a1a" }}
                    >
                        HEH
                    </Text>
                )}
                {measuredBaseline !== undefined && measuredCapTop !== undefined
                    ? [
                          hairline(measuredBaseline, "red", "mb"),
                          hairline(measuredCapTop, "red", "mc"),
                      ]
                    : null}
                {hairline(predBaseline, "blue", "pb")}
                {hairline(predCapTop, "blue", "pc")}
            </View>
            <Typography size="sm">
                {line
                    ? `${family}: measured baseline ${f(line.y + line.ascender)}, cap top ${f(
                          line.y + line.ascender - line.capHeight
                      )}; predicted baseline ${f(predBaseline)}, cap top ${f(predCapTop)}`
                    : "measuring..."}
            </Typography>
        </View>
    );
}
