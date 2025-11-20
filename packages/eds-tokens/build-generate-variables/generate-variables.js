import { StyleDictionary as c } from "style-dictionary-utils";
import { createDensitySpaceToggleTransform as io, includeTokenFilter as S, pxFormatted as ro, pxTransform as co, pxToRem as lo, fontQuote as po, PX_TO_REM_NAME as fo, PX_FORMATTED_NAME as jo, FONT_QUOTE_NAME as uo } from "@equinor/eds-tokens-build";
import o from "path";
import { readJsonFiles as So } from "@equinor/eds-tokens-sync";
const _ = "cpNchKjiIM19dPqTxE0fqg", r = "FQQqyumcpPQoiFRCjdS9GM";
async function mo({
  tokensDir: e,
  cssBuildPath: l,
  cssTransforms: p
}) {
  const f = "spacing/", j = o.join(
    e,
    _,
    "👾 Primitives.Value.json"
  ), P = o.join(
    e,
    _,
    "⛔️ Figma.Value.json"
  ), m = o.join(
    e,
    r,
    "💎 Density.Spacious.json"
  ), A = o.join(
    e,
    r,
    "💎 Density.Comfortable.json"
  ), D = So([
    o.join(
      e,
      r,
      "💎 Density.Comfortable.json"
    )
  ]), y = io({
    name: "densitySpaceToggle",
    tokens: D["💎 Density.Comfortable.json"]
  });
  c.registerTransform(y);
  const h = o.resolve(process.cwd(), "build"), C = o.join(h, "js"), F = o.join(h, "json"), E = (s) => S(s, ["Density", "Spacious"]), g = (s) => S(s, ["Density", "Comfortable"]), R = new c({
    include: [j, P],
    source: [m],
    platforms: {
      ts: {
        transforms: ["name/constant"],
        buildPath: C,
        files: [
          {
            filter: E,
            destination: "spacing/spacious.js",
            format: "javascript/es6"
          },
          {
            filter: E,
            format: "typescript/es6-declarations",
            destination: "spacing/spacious.d.ts"
          }
        ]
      },
      json: {
        buildPath: F,
        transforms: ["name/kebab"],
        files: [
          {
            filter: E,
            destination: "spacing/flat/spacious.json",
            format: "json/flat"
          },
          {
            filter: E,
            destination: "spacing/nested/spacious.json",
            format: "json/nested"
          }
        ]
      },
      css: {
        transformGroup: "css",
        prefix: "eds",
        buildPath: o.join(l, f),
        transforms: p,
        files: [
          {
            filter: (s) => S(s, ["Density", "Spacious"]),
            destination: "spacious.css",
            format: "css/variables",
            options: {
              selector: ':root, [data-density="spacious"]',
              outputReferences: !1
            }
          }
        ]
      }
    }
  }), O = new c({
    include: [j, P],
    source: [A],
    platforms: {
      ts: {
        transforms: ["name/constant"],
        buildPath: C,
        files: [
          {
            filter: g,
            destination: "spacing/comfortable.js",
            format: "javascript/es6"
          },
          {
            filter: g,
            format: "typescript/es6-declarations",
            destination: "spacing/comfortable.d.ts"
          }
        ]
      },
      json: {
        buildPath: F,
        transforms: ["name/kebab"],
        files: [
          {
            filter: g,
            destination: "spacing/flat/comfortable.json",
            format: "json/flat"
          },
          {
            filter: g,
            destination: "spacing/nested/comfortable.json",
            format: "json/nested"
          }
        ]
      },
      css: {
        transformGroup: "css",
        prefix: "eds",
        buildPath: o.join(l, f),
        transforms: p,
        files: [
          {
            filter: (s) => S(s, ["Density", "Comfortable"]),
            destination: "comfortable.css",
            format: "css/variables",
            options: {
              selector: '[data-density="comfortable"]',
              outputReferences: !1
            }
          }
        ]
      }
    }
  });
  await R.buildAllPlatforms(), await O.buildAllPlatforms();
  const b = o.join(
    e,
    _,
    "⛔️ Figma.Value.json"
  ), N = o.join(
    e,
    r,
    "🪐 Space proportions.Squared.json"
  ), U = o.join(
    e,
    r,
    "🗣️ Semantic.Mode 1.json"
  ), v = o.join(
    e,
    r,
    "🪐 Container space.Default.json"
  ), w = o.join(
    e,
    r,
    "🪐 Page space.Default.json"
  ), t = o.join(e, r);
  o.join(t, "📦 Box.Container.json"), o.join(t, "📦 Box.Generic.json"), o.join(t, "📦 Box.Page.json"), o.join(t, "📦 Box.Selectable.json");
  const X = [
    o.join(t, "🪐 Container space.Default.json"),
    o.join(t, "🪐 Page space.Default.json"),
    o.join(t, "🪐 Selectable space.XS.json"),
    o.join(t, "🪐 Selectable space.SM.json"),
    o.join(t, "🪐 Selectable space.MD.json"),
    o.join(t, "🪐 Selectable space.LG.json"),
    o.join(t, "🪐 Selectable space.XL.json"),
    o.join(t, "🪐 Space proportions.Squared.json"),
    o.join(t, "🪐 Space proportions.Squished.json"),
    o.join(t, "🪐 Space proportions.Stretched.json")
  ], M = o.join(t, "🅰️ Font size.XS.json"), x = [
    o.join(t, "🅰️ Font family.Header.json"),
    o.join(t, "🅰️ Font family.UI and Body.json"),
    o.join(t, "🅰️ Font family.UI Body.json")
  ], $ = o.join(t, "🅰️ Font weight.Normal.json"), z = o.join(
    t,
    "🅰️ Font baseline.Centred.json"
  ), B = o.join(
    t,
    "🅰️ Letter spacing.Normal.json"
  ), H = o.join(t, "🅰️ Lineheight.Default.json"), V = o.join(t, "〰️ Stroke.Thin.json"), q = o.join(
    t,
    "⭕️ Border radius.Rounded.json"
  ), Y = o.join(t, "🖼️ Icon size.XS.json"), K = o.join(t, "📐 Size.XS.json"), I = o.join(
    t,
    "🪐 Horizontal gap.XS.json"
  ), G = o.join(t, "🪐 Vertical gap.XS.json"), Q = o.join(
    t,
    "🪐 Horizontal space.XS.json"
  ), Z = o.join(
    t,
    "🪐 Vertical space.XS.json"
  ), J = ["Squished", "Squared", "Stretched"], W = (s) => {
    const n = s.toLowerCase(), a = o.join(
      e,
      r,
      `🪐 Space proportions.${s}.json`
    ), u = s === "Squared" ? ':root, [data-space-proportions="squared"]' : `[data-space-proportions="${n}"]`;
    return new c({
      include: [
        j,
        b,
        m,
        I,
        G
      ],
      source: [a, v, w],
      platforms: {
        css: {
          transformGroup: "css",
          prefix: "eds",
          buildPath: o.join(l, f),
          transforms: p,
          files: [
            {
              filter: (i) => !!(S(i, [s]) || i.path && i.path[0] === "Container" && i.path[1] === "Spacing" || i.path && i.path[0] === "Page" && i.path[1] === "Spacing"),
              destination: `space-proportions-${n}.css`,
              format: "css/variables",
              options: {
                selector: u,
                outputReferences: !0
              }
            }
          ]
        }
      }
    });
  }, k = J.map(
    (s) => W(s)
  );
  await Promise.all(
    k.map((s) => s.buildAllPlatforms())
  );
  const oo = ["XS", "SM", "MD", "LG", "XL"], so = (s) => {
    const n = s.toLowerCase(), a = o.join(
      e,
      r,
      `🪐 Selectable space.${s}.json`
    ), u = s === "XS" ? ':root, [data-selectable-space="xs"]' : `[data-selectable-space="${n}"]`;
    return new c({
      include: [
        j,
        b,
        m,
        N
      ],
      source: [a],
      platforms: {
        css: {
          transformGroup: "css",
          prefix: "eds",
          buildPath: o.join(l, f),
          transforms: p,
          files: [
            {
              filter: (i) => S(i, [s]),
              destination: `selectable-space-${n}.css`,
              format: "css/variables",
              options: {
                selector: u,
                outputReferences: !0
              }
            }
          ]
        }
      }
    });
  }, to = oo.map(
    (s) => so(s)
  );
  await Promise.all(
    to.map((s) => s.buildAllPlatforms())
  );
  const eo = [
    "None",
    "4XS",
    "3XS",
    "2XS",
    "XS",
    "SM",
    "MD",
    "LG",
    "XL",
    "2XL",
    "3XL"
  ], no = (s) => {
    const n = s.toLowerCase(), a = o.join(
      e,
      r,
      `🪐 Horizontal gap.${s}.json`
    ), u = o.join(
      e,
      r,
      `🪐 Vertical gap.${s}.json`
    ), i = s === "XS" ? ':root, [data-horizontal-gap="xs"]' : `[data-horizontal-gap="${n}"]`, L = s === "XS" ? ':root, [data-vertical-gap="xs"]' : `[data-vertical-gap="${n}"]`;
    return new c({
      include: [
        j,
        b,
        m
      ],
      source: [a, u],
      platforms: {
        css: {
          transformGroup: "css",
          prefix: "eds",
          buildPath: o.join(l, f),
          transforms: p,
          files: [
            {
              filter: (d) => d.path && d.path[0] === "generic-gap-horizontal",
              destination: `generic-gap-horizontal-${n}.css`,
              format: "css/variables",
              options: {
                selector: i,
                outputReferences: !0
              }
            },
            {
              filter: (d) => d.path && d.path[0] === "generic-gap-vertical",
              destination: `generic-gap-vertical-${n}.css`,
              format: "css/variables",
              options: {
                selector: L,
                outputReferences: !0
              }
            }
          ]
        }
      }
    });
  }, ao = eo.map(
    (s) => no(s)
  );
  await Promise.all(
    ao.map((s) => s.buildAllPlatforms())
  ), await new c({
    include: [
      j,
      // type-scale.inter/equinor primitives
      b,
      // figma.type-scale values
      m,
      // typography.ui-body/header values and sizing.stroke (needed for Font family and Stroke references)
      A,
      // Additional density mode
      // Visual tokens - must come before other tokens that reference them
      V,
      // Defines {Stroke.thickness} - References {sizing.stroke.thin} from DENSITY files
      q,
      Y,
      K,
      // Space tokens
      ...X,
      // Typography tokens
      ...x,
      // Include all Font family files for reference resolution
      M,
      $,
      z,
      B,
      H,
      // Gap and space tokens
      I,
      G,
      Q,
      Z
    ],
    log: {
      verbosity: "verbose"
    },
    source: [U],
    platforms: {
      css: {
        transformGroup: "css",
        prefix: "eds",
        buildPath: o.join(l, f),
        transforms: p,
        files: [
          {
            filter: (s) => {
              if (!s.path) return !1;
              const n = s.path[0], a = s.path[1];
              return n === "Selectable" && (a === "Gap horizontal" || a === "Gap vertical") || n === "Container" && (a === "Gap horizontal" || a === "Gap vertical") || n === "Page" && (a === "Gap horizontal" || a === "Gap vertical");
            },
            destination: "semantic-spacing-gap.css",
            format: "css/variables",
            options: {
              selector: ":root",
              outputReferences: !0
            }
          }
        ]
      }
    }
  }).buildAllPlatforms();
}
const T = `${process.cwd()}/build`, Eo = `${T}/css`, Co = `${T}/js`, Fo = `${T}/json`;
c.registerTransform(ro);
c.registerTransform(co);
c.registerTransform(lo);
c.registerTransform(po);
async function go() {
  const e = `${process.cwd()}/tokens`;
  console.info("Running Style Dictionary build script"), console.info("Tokens directory:", e), await mo({
    tokensDir: e,
    cssBuildPath: Eo,
    cssTransforms: [
      "name/kebab",
      fo,
      jo,
      uo
    ]
  });
}
go().then(() => {
  console.log("✅ Variables generated successfully");
}).catch((e) => {
  console.error("❌ Error generating color variables:", e);
});
export {
  Eo as cssBuildPath,
  go as generate,
  Co as jsBuildPath,
  Fo as jsonBuildPath
};
