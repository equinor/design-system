import { StyleDictionary as r } from "style-dictionary-utils";
import { createDensitySpaceToggleTransform as so, includeTokenFilter as p, pxFormatted as to, pxTransform as eo, pxToRem as no, fontQuote as ao, PX_TO_REM_NAME as io, PX_FORMATTED_NAME as ro, FONT_QUOTE_NAME as co } from "@equinor/eds-tokens-build";
import o from "path";
import { readJsonFiles as lo } from "@equinor/eds-tokens-sync";
const b = "cpNchKjiIM19dPqTxE0fqg", i = "FQQqyumcpPQoiFRCjdS9GM";
async function po({
  tokensDir: e,
  cssBuildPath: l,
  cssTransforms: f
}) {
  const j = "spacing/", u = o.join(
    e,
    b,
    "👾 Primitives.Value.json"
  ), P = o.join(
    e,
    b,
    "⛔️ Figma.Value.json"
  ), S = o.join(
    e,
    i,
    "💎 Density.Spacious.json"
  ), A = o.join(
    e,
    i,
    "💎 Density.Comfortable.json"
  ), y = lo([
    o.join(
      e,
      i,
      "💎 Density.Comfortable.json"
    )
  ]), h = so({
    name: "densitySpaceToggle",
    tokens: y["💎 Density.Comfortable.json"]
  });
  r.registerTransform(h);
  const g = o.resolve(process.cwd(), "build"), C = o.join(g, "js"), F = o.join(g, "json"), m = (t) => p(t, ["Density", "Spacious"]), d = (t) => p(t, ["Density", "Comfortable"]), R = new r({
    include: [u, P],
    source: [S],
    platforms: {
      ts: {
        transforms: ["name/constant"],
        buildPath: C,
        files: [
          {
            filter: m,
            destination: "spacing/spacious.js",
            format: "javascript/es6"
          },
          {
            filter: m,
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
            filter: m,
            destination: "spacing/flat/spacious.json",
            format: "json/flat"
          },
          {
            filter: m,
            destination: "spacing/nested/spacious.json",
            format: "json/nested"
          }
        ]
      },
      css: {
        transformGroup: "css",
        prefix: "eds",
        buildPath: o.join(l, j),
        transforms: f,
        files: [
          {
            filter: (t) => p(t, ["Density", "Spacious"]),
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
  }), L = new r({
    include: [u, P],
    source: [A],
    platforms: {
      ts: {
        transforms: ["name/constant"],
        buildPath: C,
        files: [
          {
            filter: d,
            destination: "spacing/comfortable.js",
            format: "javascript/es6"
          },
          {
            filter: d,
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
            filter: d,
            destination: "spacing/flat/comfortable.json",
            format: "json/flat"
          },
          {
            filter: d,
            destination: "spacing/nested/comfortable.json",
            format: "json/nested"
          }
        ]
      },
      css: {
        transformGroup: "css",
        prefix: "eds",
        buildPath: o.join(l, j),
        transforms: f,
        files: [
          {
            filter: (t) => p(t, ["Density", "Comfortable"]),
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
  await R.buildAllPlatforms(), await L.buildAllPlatforms();
  const _ = o.join(
    e,
    b,
    "⛔️ Figma.Value.json"
  ), O = o.join(
    e,
    i,
    "🪐 Space proportions.Squared.json"
  ), G = o.join(
    e,
    i,
    "🗣️ Semantic.Mode 1.json"
  ), N = o.join(
    e,
    i,
    "🪐 Container space.Default.json"
  ), U = o.join(
    e,
    i,
    "🪐 Page space.Default.json"
  ), s = o.join(e, i);
  o.join(s, "📦 Box.Container.json"), o.join(s, "📦 Box.Generic.json"), o.join(s, "📦 Box.Page.json"), o.join(s, "📦 Box.Selectable.json");
  const M = [
    o.join(s, "🪐 Container space.Default.json"),
    o.join(s, "🪐 Page space.Default.json"),
    o.join(s, "🪐 Selectable space.XS.json"),
    o.join(s, "🪐 Selectable space.SM.json"),
    o.join(s, "🪐 Selectable space.MD.json"),
    o.join(s, "🪐 Selectable space.LG.json"),
    o.join(s, "🪐 Selectable space.XL.json"),
    o.join(s, "🪐 Space proportions.Squared.json"),
    o.join(s, "🪐 Space proportions.Squished.json"),
    o.join(s, "🪐 Space proportions.Stretched.json")
  ], w = o.join(s, "🅰️ Font size.XS.json"), x = [
    o.join(s, "🅰️ Font family.Header.json"),
    o.join(s, "🅰️ Font family.UI and Body.json"),
    o.join(s, "🅰️ Font family.UI Body.json")
  ], v = o.join(s, "🅰️ Font weight.Normal.json"), X = o.join(
    s,
    "🅰️ Font baseline.Centred.json"
  ), B = o.join(
    s,
    "🅰️ Letter spacing.Normal.json"
  ), $ = o.join(s, "🅰️ Lineheight.Default.json"), q = o.join(s, "〰️ Stroke.Thin.json"), H = o.join(
    s,
    "⭕️ Border radius.Rounded.json"
  ), V = o.join(s, "🖼️ Icon size.XS.json"), Y = o.join(s, "📐 Size.XS.json"), I = o.join(
    s,
    "🪐 Horizontal gap.XS.json"
  ), D = o.join(s, "🪐 Vertical gap.XS.json"), z = o.join(
    s,
    "🪐 Horizontal space.XS.json"
  ), K = o.join(
    s,
    "🪐 Vertical space.XS.json"
  ), Q = ["Squished", "Squared", "Stretched"], Z = (t) => {
    const c = t.toLowerCase(), n = o.join(
      e,
      i,
      `🪐 Space proportions.${t}.json`
    ), E = t === "Squared" ? ':root, [data-space-proportions="squared"]' : `[data-space-proportions="${c}"]`;
    return new r({
      include: [
        u,
        _,
        S,
        I,
        D
      ],
      source: [n, N, U],
      platforms: {
        css: {
          transformGroup: "css",
          prefix: "eds",
          buildPath: o.join(l, j),
          transforms: f,
          files: [
            {
              filter: (a) => !!(p(a, [t]) || a.path && a.path[0] === "Container" && a.path[1] === "Spacing" || a.path && a.path[0] === "Page" && a.path[1] === "Spacing"),
              destination: `space-proportions-${c}.css`,
              format: "css/variables",
              options: {
                selector: E,
                outputReferences: !0
              }
            }
          ]
        }
      }
    });
  }, J = Q.map(
    (t) => Z(t)
  );
  await Promise.all(
    J.map((t) => t.buildAllPlatforms())
  );
  const W = ["XS", "SM", "MD", "LG", "XL"], k = (t) => {
    const c = t.toLowerCase(), n = o.join(
      e,
      i,
      `🪐 Selectable space.${t}.json`
    ), E = t === "XS" ? ':root, [data-selectable-space="xs"]' : `[data-selectable-space="${c}"]`;
    return new r({
      include: [
        u,
        _,
        S,
        O
      ],
      source: [n],
      platforms: {
        css: {
          transformGroup: "css",
          prefix: "eds",
          buildPath: o.join(l, j),
          transforms: f,
          files: [
            {
              filter: (a) => p(a, [t]),
              destination: `selectable-space-${c}.css`,
              format: "css/variables",
              options: {
                selector: E,
                outputReferences: !0
              }
            }
          ]
        }
      }
    });
  }, oo = W.map(
    (t) => k(t)
  );
  await Promise.all(
    oo.map((t) => t.buildAllPlatforms())
  ), await new r({
    include: [
      u,
      // type-scale.inter/equinor primitives
      _,
      // figma.type-scale values
      S,
      // typography.ui-body/header values and sizing.stroke (needed for Font family and Stroke references)
      A,
      // Additional density mode
      // Visual tokens - must come before other tokens that reference them
      q,
      // Defines {Stroke.thickness} - References {sizing.stroke.thin} from DENSITY files
      H,
      V,
      Y,
      // Space tokens
      ...M,
      // Typography tokens
      ...x,
      // Include all Font family files for reference resolution
      w,
      v,
      X,
      B,
      $,
      // Gap and space tokens
      I,
      D,
      z,
      K
    ],
    log: {
      verbosity: "verbose"
    },
    source: [G],
    platforms: {
      css: {
        transformGroup: "css",
        prefix: "eds",
        buildPath: o.join(l, j),
        transforms: f,
        files: [
          {
            filter: (t) => {
              if (!t.path) return !1;
              const c = t.path[0], n = t.path[1];
              return c === "Selectable" && (n === "Gap horizontal" || n === "Gap vertical") || c === "Container" && (n === "Gap horizontal" || n === "Gap vertical") || c === "Page" && (n === "Gap horizontal" || n === "Gap vertical");
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
const T = `${process.cwd()}/build`, fo = `${T}/css`, Po = `${T}/js`, Ao = `${T}/json`;
r.registerTransform(to);
r.registerTransform(eo);
r.registerTransform(no);
r.registerTransform(ao);
async function jo() {
  const e = `${process.cwd()}/tokens`;
  console.info("Running Style Dictionary build script"), console.info("Tokens directory:", e), await po({
    tokensDir: e,
    cssBuildPath: fo,
    cssTransforms: [
      "name/kebab",
      io,
      ro,
      co
    ]
  });
}
jo().then(() => {
  console.log("✅ Variables generated successfully");
}).catch((e) => {
  console.error("❌ Error generating color variables:", e);
});
export {
  fo as cssBuildPath,
  jo as generate,
  Po as jsBuildPath,
  Ao as jsonBuildPath
};
