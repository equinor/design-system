import { Section } from "@/components/Section";
import { Surface } from "@/components/Surface";
import {
    EDSStyleSheet,
    Typography,
    type TypographyHeaderProps,
    type TypographyUIProps,
    useStyles,
    useToken,
} from "@equinor/eds-mobile-components";
import React from "react";
import { ScrollView, View } from "react-native";

export default function TypographyScreen() {
    const styles = useStyles(themeStyles);
    const { typography } = useToken();

    const uiSizes = Object.entries(typography.ui.fontFamilySize).map(
        ([size, sizeToken]) => ({
            size: size as NonNullable<TypographyUIProps["size"]>,
            sizeToken,
        })
    );
    const headerSizes = Object.entries(typography.header.fontFamilySize).map(
        ([size, sizeToken]) => ({
            size: size as NonNullable<TypographyHeaderProps["size"]>,
            sizeToken,
        })
    );

    return (
        <ScrollView contentInsetAdjustmentBehavior="automatic">
            <Section>
                <Typography>
                    Typography exposes two font-family variants: UI for body and
                    interface text, and Header for titles and headings. Both
                    variants share the same size, weight, tracking, and
                    lineHeight props.
                </Typography>
            </Section>

            {/* ── Typography UI ──────────────────────────────────────── */}

            <Section style={styles.groupHeader}>
                <Typography.Header size="lg" weight="bolder">Typography UI</Typography.Header>
                <Typography>
                    Uses the {typography.ui.typography.fontFamily} typeface.
                    The default size is lg (
                    {typography.ui.fontFamilySize.lg.fontSize}px). Render via
                    the Typography component directly.
                </Typography>
            </Section>

            <Section title="Sizes" />
            <Surface>
                {uiSizes.map(({ size, sizeToken }, i) => (
                    <React.Fragment key={size}>
                        <View style={styles.row}>
                            <Typography size={size}>Sample Text</Typography>
                            <Typography size="xs">
                                {size} · {sizeToken.fontSize}px ·{" "}
                                {typography.ui.typography.fontFamily}
                            </Typography>
                        </View>
                        {i < uiSizes.length - 1 && (
                            <View style={styles.divider} />
                        )}
                    </React.Fragment>
                ))}
            </Surface>

            <Section title="Weight">
                <Typography>
                    Three weight steps map to font weights{" "}
                    {typography.ui.fontFamilySize.lg.fontWeightLighter},{" "}
                    {typography.ui.fontFamilySize.lg.fontWeightNormal}, and{" "}
                    {typography.ui.fontFamilySize.lg.fontWeightBolder}.
                </Typography>
            </Section>
            <Surface>
                <View style={styles.row}>
                    <Typography size="twoXl" weight="lighter">
                        Lighter
                    </Typography>
                    <Typography size="xs">
                        lighter ·{" "}
                        {typography.ui.fontFamilySize.lg.fontWeightLighter}
                    </Typography>
                </View>
                <View style={styles.divider} />
                <View style={styles.row}>
                    <Typography size="twoXl" weight="normal">
                        Normal
                    </Typography>
                    <Typography size="xs">
                        normal ·{" "}
                        {typography.ui.fontFamilySize.lg.fontWeightNormal}
                    </Typography>
                </View>
                <View style={styles.divider} />
                <View style={styles.row}>
                    <Typography size="twoXl" weight="bolder">
                        Bolder
                    </Typography>
                    <Typography size="xs">
                        bolder ·{" "}
                        {typography.ui.fontFamilySize.lg.fontWeightBolder}
                    </Typography>
                </View>
            </Surface>

            <Section title="Tracking">
                <Typography>
                    Controls letter-spacing. Tight contracts the letters; wide
                    spreads them.
                </Typography>
            </Section>
            <Surface>
                <View style={styles.row}>
                    <Typography size="twoXl" tracking="tight">
                        The quick brown fox
                    </Typography>
                    <Typography size="xs">
                        tight ·{" "}
                        {typography.ui.fontFamilySize.lg.trackingTight}
                    </Typography>
                </View>
                <View style={styles.divider} />
                <View style={styles.row}>
                    <Typography size="twoXl" tracking="normal">
                        The quick brown fox
                    </Typography>
                    <Typography size="xs">
                        normal ·{" "}
                        {typography.ui.fontFamilySize.lg.trackingNormal}
                    </Typography>
                </View>
                <View style={styles.divider} />
                <View style={styles.row}>
                    <Typography size="twoXl" tracking="wide">
                        The quick brown fox
                    </Typography>
                    <Typography size="xs">
                        wide · {typography.ui.fontFamilySize.lg.trackingWide}
                    </Typography>
                </View>
            </Surface>

            <Section title="Line Height">
                <Typography>
                    Squished reduces the line-height for denser layouts.
                </Typography>
            </Section>
            <Surface>
                <View style={styles.row}>
                    <Typography size="lg" lineHeight="default">
                        {"The quick brown fox\njumps over the lazy dog"}
                    </Typography>
                    <Typography size="xs">
                        default ·{" "}
                        {typography.ui.fontFamilySize.lg.lineHeightDefault}
                    </Typography>
                </View>
                <View style={styles.divider} />
                <View style={styles.row}>
                    <Typography size="lg" lineHeight="squished">
                        {"The quick brown fox\njumps over the lazy dog"}
                    </Typography>
                    <Typography size="xs">
                        squished ·{" "}
                        {typography.ui.fontFamilySize.lg.lineHeightSquished}
                    </Typography>
                </View>
            </Surface>

            {/* ── Typography Header ──────────────────────────────────── */}

            <Section style={styles.groupHeader}>
                <Typography.Header size="lg" weight="bolder">Typography Header</Typography.Header>
                <Typography>
                    Uses the {typography.header.typography.fontFamily}{" "}
                    typeface. Access via Typography.Header. The default size is
                    xl ({typography.header.fontFamilySize.xl.fontSize}px).
                </Typography>
            </Section>

            <Section title="Sizes" />
            <Surface>
                {headerSizes.map(({ size, sizeToken }, i) => (
                    <React.Fragment key={size}>
                        <View style={styles.row}>
                            <Typography.Header size={size}>
                                Sample Text
                            </Typography.Header>
                            <Typography size="xs">
                                {size} · {sizeToken.fontSize}px ·{" "}
                                {typography.header.typography.fontFamily}
                            </Typography>
                        </View>
                        {i < headerSizes.length - 1 && (
                            <View style={styles.divider} />
                        )}
                    </React.Fragment>
                ))}
            </Surface>

            <Section title="Weight">
                <Typography>
                    Three weight steps map to font weights{" "}
                    {typography.header.fontFamilySize.lg.fontWeightLighter},{" "}
                    {typography.header.fontFamilySize.lg.fontWeightNormal},
                    and{" "}
                    {typography.header.fontFamilySize.lg.fontWeightBolder}.
                </Typography>
            </Section>
            <Surface>
                <View style={styles.row}>
                    <Typography.Header size="twoXl" weight="lighter">
                        Lighter
                    </Typography.Header>
                    <Typography size="xs">
                        lighter ·{" "}
                        {
                            typography.header.fontFamilySize.lg
                                .fontWeightLighter
                        }
                    </Typography>
                </View>
                <View style={styles.divider} />
                <View style={styles.row}>
                    <Typography.Header size="twoXl" weight="normal">
                        Normal
                    </Typography.Header>
                    <Typography size="xs">
                        normal ·{" "}
                        {
                            typography.header.fontFamilySize.lg
                                .fontWeightNormal
                        }
                    </Typography>
                </View>
                <View style={styles.divider} />
                <View style={styles.row}>
                    <Typography.Header size="twoXl" weight="bolder">
                        Bolder
                    </Typography.Header>
                    <Typography size="xs">
                        bolder ·{" "}
                        {
                            typography.header.fontFamilySize.lg
                                .fontWeightBolder
                        }
                    </Typography>
                </View>
            </Surface>

            <Section title="Tracking">
                <Typography>
                    Controls letter-spacing. Tight contracts the letters; wide
                    spreads them.
                </Typography>
            </Section>
            <Surface>
                <View style={styles.row}>
                    <Typography.Header size="twoXl" tracking="tight">
                        The quick brown fox
                    </Typography.Header>
                    <Typography size="xs">
                        tight ·{" "}
                        {typography.header.fontFamilySize.lg.trackingTight}
                    </Typography>
                </View>
                <View style={styles.divider} />
                <View style={styles.row}>
                    <Typography.Header size="twoXl" tracking="normal">
                        The quick brown fox
                    </Typography.Header>
                    <Typography size="xs">
                        normal ·{" "}
                        {typography.header.fontFamilySize.lg.trackingNormal}
                    </Typography>
                </View>
                <View style={styles.divider} />
                <View style={styles.row}>
                    <Typography.Header size="twoXl" tracking="wide">
                        The quick brown fox
                    </Typography.Header>
                    <Typography size="xs">
                        wide ·{" "}
                        {typography.header.fontFamilySize.lg.trackingWide}
                    </Typography>
                </View>
            </Surface>

            <Section title="Line Height">
                <Typography>
                    Squished reduces the line-height for denser layouts.
                </Typography>
            </Section>
            <Surface>
                <View style={styles.row}>
                    <Typography.Header size="lg" lineHeight="default">
                        {"The quick brown fox\njumps over the lazy dog"}
                    </Typography.Header>
                    <Typography size="xs">
                        default ·{" "}
                        {
                            typography.header.fontFamilySize.lg
                                .lineHeightDefault
                        }
                    </Typography>
                </View>
                <View style={styles.divider} />
                <View style={styles.row}>
                    <Typography.Header size="lg" lineHeight="squished">
                        {"The quick brown fox\njumps over the lazy dog"}
                    </Typography.Header>
                    <Typography size="xs">
                        squished ·{" "}
                        {
                            typography.header.fontFamilySize.lg
                                .lineHeightSquished
                        }
                    </Typography>
                </View>
            </Surface>

        </ScrollView>
    );
}

const themeStyles = EDSStyleSheet.create((token) => ({
    groupHeader: {
        paddingTop: token.spacing.spacing.vertical.threeXl,
    },
    row: {
        gap: token.spacing.spacing.vertical.twoXs,
    },
    divider: {
        height: token.spacing.sizing.stroke.thin,
        backgroundColor: token.colors.border.neutral.subtle,
    },
}));
