import { StyleDictionary as c } from "style-dictionary-utils";
import { createDensitySpaceToggleTransform as so, includeTokenFilter as p, pxFormatted as eo, pxTransform as to, pxToRem as no, fontQuote as ao, PX_TO_REM_NAME as io, PX_FORMATTED_NAME as ro, FONT_QUOTE_NAME as co } from "@equinor/eds-tokens-build";
import o from "path";
import { readJsonFiles as lo } from "@equinor/eds-tokens-sync";
const b = "cpNchKjiIM19dPqTxE0fqg", r = "FQQqyumcpPQoiFRCjdS9GM";
async function po({
  tokensDir: t,
  cssBuildPath: l,
  cssTransforms: f
}) {
  const j = "spacing/", u = o.join(
    t,
    b,
    "👾 Primitives.Value.json"
  ), P = o.join(
    t,
    b,
    "⛔️ Figma.Value.json"
  ), S = o.join(
    t,
    r,
    "💎 Density.Spacious.json"
  ), A = o.join(
    t,
    r,
    "💎 Density.Comfortable.json"
  ), D = lo([
    o.join(
      t,
      r,
      "💎 Density.Comfortable.json"
    )
  ]), h = so({
    name: "densitySpaceToggle",
    tokens: D["💎 Density.Comfortable.json"]
  });
  c.registerTransform(h);
  const g = o.resolve(process.cwd(), "build"), C = o.join(g, "js"), F = o.join(g, "json"), m = (e) => p(e, ["Density", "Spacious"]), d = (e) => p(e, ["Density", "Comfortable"]), y = new c({
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
            filter: (e) => p(e, ["Density", "Spacious"]),
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
  }), R = new c({
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
            filter: (e) => p(e, ["Density", "Comfortable"]),
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
  await y.buildAllPlatforms(), await R.buildAllPlatforms();
  const _ = o.join(
    t,
    b,
    "⛔️ Figma.Value.json"
  ), L = o.join(
    t,
    r,
    "🪐 Space proportions.Squared.json"
  ), O = o.join(
    t,
    r,
    "🗣️ Semantic.Mode 1.json"
  ), N = o.join(
    t,
    r,
    "🪐 Container space.Default.json"
  ), U = o.join(
    t,
    r,
    "🪐 Page space.Default.json"
  ), s = o.join(t, r);
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
  ], w = o.join(s, "🅰️ Font size.XS.json"), v = [
    o.join(s, "🅰️ Font family.Header.json"),
    o.join(s, "🅰️ Font family.UI and Body.json"),
    o.join(s, "🅰️ Font family.UI Body.json")
  ], x = o.join(s, "🅰️ Font weight.Normal.json"), X = o.join(
    s,
    "🅰️ Font baseline.Centred.json"
  ), B = o.join(
    s,
    "🅰️ Letter spacing.Normal.json"
  ), $ = o.join(s, "🅰️ Lineheight.Default.json"), q = o.join(s, "〰️ Stroke.Thin.json"), H = o.join(
    s,
    "⭕️ Border radius.Rounded.json"
  ), V = o.join(s, "🖼️ Icon size.XS.json"), z = o.join(s, "📐 Size.XS.json"), I = o.join(
    s,
    "🪐 Horizontal gap.XS.json"
  ), G = o.join(s, "🪐 Vertical gap.XS.json"), Y = o.join(
    s,
    "🪐 Horizontal space.XS.json"
  ), K = o.join(
    s,
    "🪐 Vertical space.XS.json"
  ), Q = ["Squished", "Squared", "Stretched"], Z = (e) => {
    const a = e.toLowerCase(), n = o.join(
      t,
      r,
      `🪐 Space proportions.${e}.json`
    ), E = e === "Squared" ? ':root, [data-space-proportions="squared"]' : `[data-space-proportions="${a}"]`;
    return new c({
      include: [
        u,
        _,
        S,
        I,
        G
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
              filter: (i) => !!(p(i, [e]) || i.path && i.path[0] === "Container" && i.path[1] === "Spacing" || i.path && i.path[0] === "Page" && i.path[1] === "Spacing"),
              destination: `space-proportions-${a}.css`,
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
    (e) => Z(e)
  );
  await Promise.all(
    J.map((e) => e.buildAllPlatforms())
  );
  const W = ["XS", "SM", "MD", "LG", "XL"], k = (e) => {
    const a = e.toLowerCase(), n = o.join(
      t,
      r,
      `🪐 Selectable space.${e}.json`
    ), E = e === "XS" ? ':root, [data-selectable-space="xs"]' : `[data-selectable-space="${a}"]`;
    return new c({
      include: [
        u,
        _,
        S,
        L
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
              filter: (i) => p(i, [e]),
              destination: `selectable-space-${a}.css`,
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
    (e) => k(e)
  );
  await Promise.all(
    oo.map((e) => e.buildAllPlatforms())
  ), await new c({
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
      z,
      // Space tokens
      ...M,
      // Typography tokens
      ...v,
      // Include all Font family files for reference resolution
      w,
      x,
      X,
      B,
      $,
      // Gap and space tokens
      I,
      G,
      Y,
      K
    ],
    log: {
      verbosity: "verbose"
    },
    source: [O],
    platforms: {
      css: {
        transformGroup: "css",
        prefix: "eds",
        buildPath: o.join(l, j),
        transforms: f,
        files: [
          {
            filter: (e) => {
              if (!e.path) return !1;
              const a = e.path[0], n = e.path[1];
              return a === "Selectable" && (n === "Gap horizontal" || n === "Gap vertical") || a === "Container" && (n === "Gap horizontal" || n === "Gap vertical") || a === "Page" && (n === "Gap horizontal" || n === "Gap vertical") || a === "Generic" && (n === "Gap horizontal" || n === "Gap vertical");
            },
            destination: "semantic-spacing-gaps.css",
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
const T = `${process.cwd()}/build`, fo = `${T}/css`, Ao = `${T}/js`, go = `${T}/json`;
c.registerTransform(eo);
c.registerTransform(to);
c.registerTransform(no);
c.registerTransform(ao);
async function jo() {
  const t = `${process.cwd()}/tokens`;
  console.info("Running Style Dictionary build script"), console.info("Tokens directory:", t), await po({
    tokensDir: t,
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
}).catch((t) => {
  console.error("❌ Error generating color variables:", t);
});
export {
  fo as cssBuildPath,
  jo as generate,
  Ao as jsBuildPath,
  go as jsonBuildPath
};
