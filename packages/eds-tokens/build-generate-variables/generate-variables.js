import { StyleDictionary as c } from "style-dictionary-utils";
import { createDensitySpaceToggleTransform as co, includeTokenFilter as S, pxFormatted as lo, pxTransform as po, pxToRem as fo, fontQuote as jo, PX_TO_REM_NAME as uo, PX_FORMATTED_NAME as So, FONT_QUOTE_NAME as mo } from "@equinor/eds-tokens-build";
import o from "path";
import { readJsonFiles as Eo } from "@equinor/eds-tokens-sync";
const g = "cpNchKjiIM19dPqTxE0fqg", r = "FQQqyumcpPQoiFRCjdS9GM";
async function bo({
  tokensDir: e,
  cssBuildPath: l,
  cssTransforms: p
}) {
  const f = "spacing/", j = o.join(
    e,
    g,
    "👾 Primitives.Value.json"
  ), T = o.join(
    e,
    g,
    "⛔️ Figma.Value.json"
  ), m = o.join(
    e,
    r,
    "💎 Density.Spacious.json"
  ), A = o.join(
    e,
    r,
    "💎 Density.Comfortable.json"
  ), O = Eo([
    o.join(
      e,
      r,
      "💎 Density.Comfortable.json"
    )
  ]), N = co({
    name: "densitySpaceToggle",
    tokens: O["💎 Density.Comfortable.json"]
  });
  c.registerTransform(N);
  const h = o.resolve(process.cwd(), "build"), C = o.join(h, "js"), F = o.join(h, "json"), E = (s) => S(s, ["Density", "Spacious"]), b = (s) => S(s, ["Density", "Comfortable"]), y = new c({
    include: [j, T],
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
  }), U = new c({
    include: [j, T],
    source: [A],
    platforms: {
      ts: {
        transforms: ["name/constant"],
        buildPath: C,
        files: [
          {
            filter: b,
            destination: "spacing/comfortable.js",
            format: "javascript/es6"
          },
          {
            filter: b,
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
            filter: b,
            destination: "spacing/flat/comfortable.json",
            format: "json/flat"
          },
          {
            filter: b,
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
  await y.buildAllPlatforms(), await U.buildAllPlatforms();
  const _ = o.join(
    e,
    g,
    "⛔️ Figma.Value.json"
  ), $ = o.join(
    e,
    r,
    "🪐 Space proportions.Squared.json"
  ), v = o.join(
    e,
    r,
    "🗣️ Semantic.Mode 1.json"
  ), w = o.join(
    e,
    r,
    "🪐 Container space.Default.json"
  ), X = o.join(
    e,
    r,
    "🪐 Page space.Default.json"
  ), t = o.join(e, r);
  o.join(t, "📦 Box.Container.json"), o.join(t, "📦 Box.Generic.json"), o.join(t, "📦 Box.Page.json"), o.join(t, "📦 Box.Selectable.json");
  const M = [
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
  ], x = o.join(t, "🅰️ Font size.XS.json"), z = [
    o.join(t, "🅰️ Font family.Header.json"),
    o.join(t, "🅰️ Font family.UI and Body.json"),
    o.join(t, "🅰️ Font family.UI Body.json")
  ], B = o.join(t, "🅰️ Font weight.Normal.json"), H = o.join(
    t,
    "🅰️ Font baseline.Centred.json"
  ), V = o.join(
    t,
    "🅰️ Letter spacing.Normal.json"
  ), q = o.join(t, "🅰️ Lineheight.Default.json"), Y = o.join(t, "〰️ Stroke.Thin.json"), K = o.join(
    t,
    "⭕️ Border radius.Rounded.json"
  ), Q = o.join(t, "🖼️ Icon size.XS.json"), Z = o.join(t, "📐 Size.XS.json"), I = o.join(
    t,
    "🪐 Horizontal gap.XS.json"
  ), L = o.join(t, "🪐 Vertical gap.XS.json"), J = o.join(
    t,
    "🪐 Horizontal space.XS.json"
  ), W = o.join(
    t,
    "🪐 Vertical space.XS.json"
  ), k = ["Squished", "Squared", "Stretched"], oo = (s) => {
    const n = s.toLowerCase(), a = o.join(
      e,
      r,
      `🪐 Space proportions.${s}.json`
    ), u = s === "Squared" ? ':root, [data-space-proportions="squared"]' : `[data-space-proportions="${n}"]`;
    return new c({
      include: [
        j,
        _,
        m,
        I,
        L
      ],
      source: [a, w, X],
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
  }, so = k.map(
    (s) => oo(s)
  );
  await Promise.all(
    so.map((s) => s.buildAllPlatforms())
  );
  const to = ["XS", "SM", "MD", "LG", "XL"], eo = (s) => {
    const n = s.toLowerCase(), a = o.join(
      e,
      r,
      `🪐 Selectable space.${s}.json`
    ), u = s === "XS" ? ':root, [data-selectable-space="xs"]' : `[data-selectable-space="${n}"]`;
    return new c({
      include: [
        j,
        _,
        m,
        $
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
  }, no = to.map(
    (s) => eo(s)
  );
  await Promise.all(
    no.map((s) => s.buildAllPlatforms())
  );
  const D = [
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
  ], G = (s, n) => {
    const a = n.toLowerCase();
    s.charAt(0).toUpperCase() + s.slice(1);
    const u = o.join(
      e,
      r,
      `🪐 Horizontal ${s}.${n}.json`
    ), i = o.join(
      e,
      r,
      `🪐 Vertical ${s}.${n}.json`
    ), R = n === "XS" ? `:root, [data-horizontal-${s}="xs"]` : `[data-horizontal-${s}="${a}"]`, ro = n === "XS" ? `:root, [data-vertical-${s}="xs"]` : `[data-vertical-${s}="${a}"]`;
    return new c({
      include: [
        j,
        _,
        m
      ],
      source: [u, i],
      platforms: {
        css: {
          transformGroup: "css",
          prefix: "eds",
          buildPath: o.join(l, f),
          transforms: p,
          files: [
            {
              filter: (d) => d.path && d.path[0] === `generic-${s}-horizontal`,
              destination: `generic-${s}-horizontal-${a}.css`,
              format: "css/variables",
              options: {
                selector: R,
                outputReferences: !0
              }
            },
            {
              filter: (d) => d.path && d.path[0] === `generic-${s}-vertical`,
              destination: `generic-${s}-vertical-${a}.css`,
              format: "css/variables",
              options: {
                selector: ro,
                outputReferences: !0
              }
            }
          ]
        }
      }
    });
  }, ao = D.map(
    (s) => G("gap", s)
  ), io = D.map(
    (s) => G("space", s)
  );
  await Promise.all([
    ...ao.map((s) => s.buildAllPlatforms()),
    ...io.map((s) => s.buildAllPlatforms())
  ]), await new c({
    include: [
      j,
      // type-scale.inter/equinor primitives
      _,
      // figma.type-scale values
      m,
      // typography.ui-body/header values and sizing.stroke (needed for Font family and Stroke references)
      A,
      // Additional density mode
      // Visual tokens - must come before other tokens that reference them
      Y,
      // Defines {Stroke.thickness} - References {sizing.stroke.thin} from DENSITY files
      K,
      Q,
      Z,
      // Space tokens
      ...M,
      // Typography tokens
      ...z,
      // Include all Font family files for reference resolution
      x,
      B,
      H,
      V,
      q,
      // Gap and space tokens
      I,
      L,
      J,
      W
    ],
    log: {
      verbosity: "verbose"
    },
    source: [v],
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
const P = `${process.cwd()}/build`, _o = `${P}/css`, Io = `${P}/js`, Lo = `${P}/json`;
c.registerTransform(lo);
c.registerTransform(po);
c.registerTransform(fo);
c.registerTransform(jo);
async function go() {
  const e = `${process.cwd()}/tokens`;
  console.info("Running Style Dictionary build script"), console.info("Tokens directory:", e), await bo({
    tokensDir: e,
    cssBuildPath: _o,
    cssTransforms: [
      "name/kebab",
      uo,
      So,
      mo
    ]
  });
}
go().then(() => {
  console.log("✅ Variables generated successfully");
}).catch((e) => {
  console.error("❌ Error generating color variables:", e);
});
export {
  _o as cssBuildPath,
  go as generate,
  Io as jsBuildPath,
  Lo as jsonBuildPath
};
