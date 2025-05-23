import { readJsonFiles as F } from "@equinor/eds-tokens-sync";
import { StyleDictionary as D } from "style-dictionary-utils";
import { createLightDarkTransform as x, _extend as a, includeTokenFilter as t, PX_TRANSFORM_NAME as H, PX_TO_REM_NAME as G, PX_FORMATTED_NAME as y, FONT_QUOTE_NAME as z } from "@equinor/eds-tokens-build";
async function X({
  tokensDir: n,
  colorBuildPath: e,
  coreTokensDirName: r = "9Jody75rpiDhyTgNm3xOHd",
  colorMatrixTokensDirName: f = "l61klzmHcRrHVk7Ag0eLGn",
  prefix: i,
  fileNames: g = {
    colorScheme: {
      dark: "🌗 Color scheme.Dark.json",
      light: "🌗 Color scheme.Light.json"
    },
    appearance: {
      accent: "🎨 Appearance.Accent.json",
      neutral: "🎨 Appearance.Neutral.json",
      danger: "🎨 Appearance.Danger.json",
      success: "🎨 Appearance.Success.json",
      warning: "🎨 Appearance.Warning.json",
      info: "🎨 Appearance.Info.json"
    }
  }
}) {
  const p = `${`${n}/${r}`}/Core.Mode 1.json`, m = `${n}/${f}`, R = `${m}/${g.colorScheme.dark}`, E = F([R]), O = x({
    name: "lightDarkMatrix",
    darkTokensObject: E[g.colorScheme.dark]
  });
  D.registerTransform(O);
  const h = `${m}/${g.colorScheme.light}`, b = `${m}/${g.appearance.accent}`, s = ["name/kebab", "color/css", "lightDarkMatrix"], c = !1, u = [p, h];
  a({
    source: [h],
    filter: (l) => l.name.includes("functional") && !l.name.includes("light") && !l.name.includes("dark"),
    fileName: "matrix-functional",
    prefix: i,
    include: u,
    buildPath: e,
    outputReferences: c,
    transforms: s
  }).buildAllPlatforms(), await a({
    source: [b],
    filter: (l) => t(l, ["Accent"]),
    fileName: "matrix-accent",
    selector: '[data-color-appearance="accent"]',
    prefix: i,
    include: u,
    buildPath: e,
    outputReferences: c,
    transforms: s
  }).buildAllPlatforms(), await a({
    source: [b],
    filter: (l) => t(l, ["Accent"]),
    fileName: "matrix-standalone-accent",
    prefix: "eds-color-accent",
    include: u,
    buildPath: e,
    outputReferences: c,
    transforms: s
  }).buildAllPlatforms();
  const P = `${m}/${g.appearance.neutral}`;
  await a({
    source: [P],
    filter: (l) => t(l, ["Neutral"]),
    fileName: "matrix-neutral",
    selector: ':root, [data-color-appearance="neutral"]',
    prefix: i,
    include: u,
    buildPath: e,
    outputReferences: c,
    transforms: s
  }).buildAllPlatforms(), await a({
    source: [P],
    filter: (l) => t(l, ["Neutral"]),
    fileName: "matrix-standalone-neutral",
    prefix: "eds-color-neutral",
    include: u,
    buildPath: e,
    outputReferences: c,
    transforms: s
  }).buildAllPlatforms();
  const N = `${m}/${g.appearance.danger}`;
  await a({
    source: [N],
    filter: (l) => t(l, ["Danger"]),
    fileName: "matrix-danger",
    selector: '[data-color-appearance="danger"]',
    prefix: i,
    include: u,
    buildPath: e,
    outputReferences: c,
    transforms: s
  }).buildAllPlatforms(), await a({
    source: [N],
    filter: (l) => t(l, ["Danger"]),
    fileName: "matrix-standalone-danger",
    prefix: "eds-color-danger",
    include: u,
    buildPath: e,
    outputReferences: c,
    transforms: s
  }).buildAllPlatforms();
  const U = `${m}/${g.appearance.success}`;
  await a({
    source: [U],
    filter: (l) => t(l, ["Success"]),
    fileName: "matrix-success",
    selector: '[data-color-appearance="success"]',
    prefix: i,
    include: u,
    buildPath: e,
    outputReferences: c,
    transforms: s
  }).buildAllPlatforms(), await a({
    source: [U],
    filter: (l) => t(l, ["Success"]),
    fileName: "matrix-standalone-success",
    prefix: "eds-color-success",
    include: u,
    buildPath: e,
    outputReferences: c,
    transforms: s
  }).buildAllPlatforms();
  const j = `${m}/${g.appearance.warning}`;
  await a({
    source: [j],
    filter: (l) => t(l, ["Warning"]),
    fileName: "matrix-warning",
    selector: '[data-color-appearance="warning"]',
    prefix: i,
    include: u,
    buildPath: e,
    outputReferences: c,
    transforms: s
  }).buildAllPlatforms(), await a({
    source: [j],
    filter: (l) => t(l, ["Warning"]),
    fileName: "matrix-standalone-warning",
    prefix: "eds-color-warning",
    include: u,
    buildPath: e,
    outputReferences: c,
    transforms: s
  }).buildAllPlatforms();
  const M = `${m}/${g.appearance.info}`;
  await a({
    source: [M],
    filter: (l) => t(l, ["Info"]),
    fileName: "matrix-info",
    selector: '[data-color-appearance="info"]',
    prefix: i,
    include: u,
    buildPath: e,
    outputReferences: c,
    transforms: s
  }).buildAllPlatforms(), await a({
    source: [M],
    filter: (l) => t(l, ["Info"]),
    fileName: "matrix-standalone-info",
    prefix: "eds-color-info",
    include: u,
    buildPath: e,
    outputReferences: c,
    transforms: s
  }).buildAllPlatforms();
}
const S = "V3XAAjEw7dl2vQmDvG4RNW";
async function q({
  tokensDir: n,
  cssTransforms: e
}) {
  const r = `${n}/${S}/01 Spacing.Mode 1.json`, f = `${n}/${S}/03 Padding.XS.json`, i = `${n}/${S}/03 Padding.SM.json`, g = `${n}/${S}/03 Padding.MD.json`, A = `${n}/${S}/02 Ratio.Squished.json`, p = `${n}/${S}/02 Ratio.Stretched.json`, m = `${n}/${S}/02 Ratio.Squared.json`, R = "/spacing/", E = a({
    source: [r],
    buildPath: R,
    fileName: "spacing",
    filter: (d) => t(d),
    transforms: [...e, H]
  }), O = a({
    source: [f],
    include: [
      r,
      m,
      A,
      p
    ],
    buildPath: R,
    fileName: "selectable-padding-xs",
    selector: ':root, [data-padding="xs"]',
    filter: (d) => t(d, ["Padding"]),
    transforms: e,
    outputReferences: !0
  }), h = a({
    source: [i],
    include: [
      r,
      m,
      A,
      p
    ],
    buildPath: R,
    fileName: "selectable-padding-sm",
    selector: '[data-padding="sm"]',
    filter: (d) => t(d, ["Padding"]),
    transforms: e,
    outputReferences: !0
  }), b = a({
    source: [g],
    include: [
      r,
      m,
      A,
      p
    ],
    buildPath: R,
    fileName: "selectable-padding-md",
    selector: '[data-padding="md"]',
    filter: (d) => t(d, ["Padding"]),
    transforms: e,
    outputReferences: !0
  }), s = a({
    source: [A],
    include: [r],
    buildPath: R,
    fileName: "selectable-ratio-squished",
    selector: ':root, [data-ratio="squished"]',
    filter: (d) => t(d, ["Squished"]),
    transforms: e,
    outputReferences: !0
  }), c = a({
    source: [p],
    include: [r],
    buildPath: R,
    fileName: "selectable-ratio-stretched",
    selector: '[data-ratio="stretched"]',
    filter: (d) => t(d, ["Stretched"]),
    transforms: e,
    outputReferences: !0
  }), u = a({
    source: [m],
    include: [r],
    buildPath: R,
    fileName: "selectable-ratio-squared",
    selector: '[data-ratio="squared"]',
    filter: (d) => t(d, ["Squared"]),
    transforms: e,
    outputReferences: !0
  });
  await O.buildAllPlatforms(), await b.buildAllPlatforms(), await h.buildAllPlatforms(), await E.buildAllPlatforms(), await s.buildAllPlatforms(), await c.buildAllPlatforms(), await u.buildAllPlatforms();
}
const _ = "FS9KIlmO8N8rv3rAO65UUi";
async function W({
  tokensDir: n,
  cssTransforms: e
}) {
  const r = "/typography/", f = `${n}/${_}/01 Typography.Value.json`, i = `${n}/${_}/02 Font size.XS.json`, g = `${n}/${_}/02 Font size.SM.json`, A = `${n}/${_}/02 Font size.MD.json`, p = `${n}/${_}/02 Font size.LG.json`, m = a({
    source: [f],
    buildPath: r,
    fileName: "typography",
    filter: (o) => t(o),
    transforms: e
  }), R = a({
    source: [i],
    include: [f],
    buildPath: r,
    fileName: "font-size-xs",
    selector: ':root, [data-font-size="xs"]',
    filter: (o) => t(o, ["Font size"]),
    transforms: e,
    outputReferences: !0
  }), E = a({
    source: [g],
    include: [f],
    buildPath: r,
    fileName: "font-size-sm",
    selector: '[data-font-size="sm"]',
    filter: (o) => t(o, ["Font size"]),
    transforms: e,
    outputReferences: !0
  }), O = a({
    source: [A],
    include: [f],
    buildPath: r,
    fileName: "font-size-md",
    selector: '[data-font-size="md"]',
    filter: (o) => t(o, ["Font size"]),
    transforms: e,
    outputReferences: !0
  }), h = a({
    source: [p],
    include: [f],
    buildPath: r,
    fileName: "font-size-lg",
    selector: '[data-font-size="lg"]',
    filter: (o) => t(o, ["Font size"]),
    transforms: e,
    outputReferences: !0
  }), b = `${n}/${_}/03 Font weight.Regular.json`, s = `${n}/${_}/03 Font weight.Bold.json`, c = a({
    source: [b],
    include: [f, i],
    buildPath: r,
    fileName: "font-weight-regular",
    selector: ':root, [data-font-weight="regular"]',
    filter: (o) => t(o, ["Font weight"]),
    transforms: e,
    outputReferences: !0
  }), u = a({
    source: [s],
    include: [f, i],
    buildPath: r,
    fileName: "font-weight-bold",
    selector: '[data-font-weight="bold"]',
    filter: (o) => t(o, ["Font weight"]),
    transforms: e,
    outputReferences: !0
  });
  await c.buildAllPlatforms(), await u.buildAllPlatforms(), await m.buildAllPlatforms(), await R.buildAllPlatforms(), await E.buildAllPlatforms(), await O.buildAllPlatforms(), await h.buildAllPlatforms();
  const d = `${n}/${_}/04 Line height.Normal.json`, $ = `${n}/${_}/04 Line height.Squished.json`, C = a({
    source: [d],
    include: [f, i],
    buildPath: r,
    fileName: "line-height-normal",
    selector: ':root, [data-line-height="normal"]',
    filter: (o) => t(o, ["Line height"]),
    transforms: e,
    outputReferences: !0
  }), P = a({
    source: [$],
    include: [f, i],
    buildPath: r,
    fileName: "line-height-squished",
    selector: '[data-line-height="squished"]',
    filter: (o) => t(o, ["Line height"]),
    transforms: e,
    outputReferences: !0
  });
  await C.buildAllPlatforms(), await P.buildAllPlatforms();
  const w = `${n}/${_}/05 Baseline aligned.True.json`, I = `${n}/${_}/05 Baseline aligned.False.json`, N = a({
    source: [w],
    include: [f, i],
    buildPath: r,
    fileName: "baseline-aligned-true",
    selector: ':root, [data-baseline-aligned="true"]',
    filter: (o) => t(o, ["Baseline aligned"]),
    transforms: e,
    outputReferences: !0
  }), L = a({
    source: [I],
    include: [f, i],
    buildPath: r,
    fileName: "baseline-aligned-false",
    selector: '[data-baseline-aligned="false"]',
    filter: (o) => t(o, ["Baseline aligned"]),
    transforms: e,
    outputReferences: !0
  });
  await N.buildAllPlatforms(), await L.buildAllPlatforms();
}
const T = [
  "name/kebab",
  G,
  y,
  z
], K = async () => {
  const n = "tokens";
  await X({
    tokensDir: n,
    colorBuildPath: "color/",
    colorMatrixTokensDirName: "QRFchmc6GHsKSBEdqdFLMr",
    fileNames: {
      colorScheme: {
        dark: "01 Color scheme.Dark.json",
        light: "01 Color scheme.Light.json"
      },
      appearance: {
        accent: "02 Appearance.Accent.json",
        neutral: "02 Appearance.Neutral.json",
        danger: "02 Appearance.Danger.json",
        success: "02 Appearance.Success.json",
        warning: "02 Appearance.Warning.json",
        info: "02 Appearance.Info.json"
      }
    }
  }), await q({
    tokensDir: n,
    cssTransforms: T
  }), await W({
    tokensDir: n,
    cssTransforms: T
  });
};
K().then(() => {
  console.log("✅ Variables generated successfully");
}).catch((n) => {
  console.error("❌ Error generating matrix color variables:", n);
});
export {
  K as generate
};
