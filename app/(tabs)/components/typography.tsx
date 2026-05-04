import { Section } from "@/components/Section";
import { Surface } from "@/components/Surface";
import {
    EDSStyleSheet,
    Spacer,
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
    const { newTypography } = useToken();

    const uiSizes = Object.entries(newTypography.ui.fontFamilySize).map(
        ([size, sizeToken]) => ({
            size: size as NonNullable<TypographyUIProps["size"]>,
            sizeToken,
        })
    );
    const headerSizes = Object.entries(newTypography.header.fontFamilySize).map(
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

            <Section title="Typography UI">
                <Typography>
                    Uses the {newTypography.ui.typography.fontFamily} typeface.
                    The default size is lg (
                    {newTypography.ui.fontFamilySize.lg.fontSize}px). Render via
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
                                {newTypography.ui.typography.fontFamily}
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
                    {newTypography.ui.fontFamilySize.lg.fontWeightLighter},{" "}
                    {newTypography.ui.fontFamilySize.lg.fontWeightNormal}, and{" "}
                    {newTypography.ui.fontFamilySize.lg.fontWeightBolder}.
                </Typography>
            </Section>
            <Surface>
                <View style={styles.row}>
                    <Typography size="twoXl" weight="lighter">
                        Lighter
                    </Typography>
                    <Typography size="xs">
                        lighter ·{" "}
                        {newTypography.ui.fontFamilySize.lg.fontWeightLighter}
                    </Typography>
                </View>
                <View style={styles.divider} />
                <View style={styles.row}>
                    <Typography size="twoXl" weight="normal">
                        Normal
                    </Typography>
                    <Typography size="xs">
                        normal ·{" "}
                        {newTypography.ui.fontFamilySize.lg.fontWeightNormal}
                    </Typography>
                </View>
                <View style={styles.divider} />
                <View style={styles.row}>
                    <Typography size="twoXl" weight="bolder">
                        Bolder
                    </Typography>
                    <Typography size="xs">
                        bolder ·{" "}
                        {newTypography.ui.fontFamilySize.lg.fontWeightBolder}
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
                        {newTypography.ui.fontFamilySize.lg.trackingTight}
                    </Typography>
                </View>
                <View style={styles.divider} />
                <View style={styles.row}>
                    <Typography size="twoXl" tracking="normal">
                        The quick brown fox
                    </Typography>
                    <Typography size="xs">
                        normal ·{" "}
                        {newTypography.ui.fontFamilySize.lg.trackingNormal}
                    </Typography>
                </View>
                <View style={styles.divider} />
                <View style={styles.row}>
                    <Typography size="twoXl" tracking="wide">
                        The quick brown fox
                    </Typography>
                    <Typography size="xs">
                        wide · {newTypography.ui.fontFamilySize.lg.trackingWide}
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
                        {newTypography.ui.fontFamilySize.lg.lineHeightDefault}
                    </Typography>
                </View>
                <View style={styles.divider} />
                <View style={styles.row}>
                    <Typography size="lg" lineHeight="squished">
                        {"The quick brown fox\njumps over the lazy dog"}
                    </Typography>
                    <Typography size="xs">
                        squished ·{" "}
                        {newTypography.ui.fontFamilySize.lg.lineHeightSquished}
                    </Typography>
                </View>
            </Surface>

            {/* ── Typography Header ──────────────────────────────────── */}

            <Section title="Typography Header">
                <Typography>
                    Uses the {newTypography.header.typography.fontFamily}{" "}
                    typeface. Access via Typography.Header. The default size is
                    xl ({newTypography.header.fontFamilySize.xl.fontSize}px).
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
                                {newTypography.header.typography.fontFamily}
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
                    {newTypography.header.fontFamilySize.lg.fontWeightLighter},{" "}
                    {newTypography.header.fontFamilySize.lg.fontWeightNormal},
                    and{" "}
                    {newTypography.header.fontFamilySize.lg.fontWeightBolder}.
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
                            newTypography.header.fontFamilySize.lg
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
                            newTypography.header.fontFamilySize.lg
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
                            newTypography.header.fontFamilySize.lg
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
                        {newTypography.header.fontFamilySize.lg.trackingTight}
                    </Typography>
                </View>
                <View style={styles.divider} />
                <View style={styles.row}>
                    <Typography.Header size="twoXl" tracking="normal">
                        The quick brown fox
                    </Typography.Header>
                    <Typography size="xs">
                        normal ·{" "}
                        {newTypography.header.fontFamilySize.lg.trackingNormal}
                    </Typography>
                </View>
                <View style={styles.divider} />
                <View style={styles.row}>
                    <Typography.Header size="twoXl" tracking="wide">
                        The quick brown fox
                    </Typography.Header>
                    <Typography size="xs">
                        wide ·{" "}
                        {newTypography.header.fontFamilySize.lg.trackingWide}
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
                            newTypography.header.fontFamilySize.lg
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
                            newTypography.header.fontFamilySize.lg
                                .lineHeightSquished
                        }
                    </Typography>
                </View>
            </Surface>

            <Spacer />
        </ScrollView>
    );
}

const themeStyles = EDSStyleSheet.create((token) => ({
    row: {
        gap: token.newSpacing.spacing.vertical.twoXs,
    },
    divider: {
        height: token.newSpacing.sizing.stroke.thin,
        backgroundColor: token.newColors.border.neutral.subtle,
    },
}));
