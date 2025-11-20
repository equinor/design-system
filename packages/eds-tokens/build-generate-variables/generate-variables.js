import { StyleDictionary as c } from "style-dictionary-utils";
import { createDensitySpaceToggleTransform as so, includeTokenFilter as p, pxFormatted as to, pxTransform as eo, pxToRem as no, fontQuote as ao, PX_TO_REM_NAME as io, PX_FORMATTED_NAME as ro, FONT_QUOTE_NAME as co } from "@equinor/eds-tokens-build";
import o from "path";
import { readJsonFiles as lo } from "@equinor/eds-tokens-sync";
const b = "cpNchKjiIM19dPqTxE0fqg", r = "FQQqyumcpPQoiFRCjdS9GM";
async function po({
  tokensDir: e,
  cssBuildPath: l,
  cssTransforms: f
}) {
  const j = "spacing/", u = o.join(
    e,
    b,
    "👾 Primitives.Value.json"
  ), T = o.join(
    e,
    b,
    "⛔️ Figma.Value.json"
  ), S = o.join(
    e,
    r,
    "💎 Density.Spacious.json"
  ), P = o.join(
    e,
    r,
    "💎 Density.Comfortable.json"
  ), y = lo([
    o.join(
      e,
      r,
      "💎 Density.Comfortable.json"
    )
  ]), R = so({
    name: "densitySpaceToggle",
    tokens: y["💎 Density.Comfortable.json"]
  });
  c.registerTransform(R);
  const A = o.resolve(process.cwd(), "build"), C = o.join(A, "js"), F = o.join(A, "json"), m = (t) => p(t, ["Density", "Spacious"]), d = (t) => p(t, ["Density", "Comfortable"]), L = new c({
    include: [u, T],
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
  }), O = new c({
    include: [u, T],
    source: [P],
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
  await L.buildAllPlatforms(), await O.buildAllPlatforms();
  const _ = o.join(
    e,
    b,
    "⛔️ Figma.Value.json"
  ), h = o.join(
    e,
    r,
    "🪐 Space proportions.Squared.json"
  ), G = o.join(
    e,
    r,
    "🗣️ Semantic.Mode 1.json"
  ), N = o.join(
    e,
    r,
    "🪐 Container space.Default.json"
  ), U = o.join(
    e,
    r,
    "🪐 Page.Default.json"
  ), s = o.join(e, r);
  o.join(s, "📦 Box.Container.json"), o.join(s, "📦 Box.Generic.json"), o.join(s, "📦 Box.Page.json"), o.join(s, "📦 Box.Selectable.json");
  const M = [
    o.join(s, "🪐 Container space.Default.json"),
    o.join(s, "🪐 Page.Default.json"),
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
  ], H = o.join(s, "🅰️ Font weight.Normal.json"), V = o.join(
    s,
    "🅰️ Font baseline.Centred.json"
  ), X = o.join(
    s,
    "🅰️ Letter spacing.Normal.json"
  ), v = o.join(s, "🅰️ Lineheight.Default.json"), B = o.join(s, "〰️ Stroke.Thin.json"), $ = o.join(
    s,
    "⭕️ Border radius.Rounded.json"
  ), q = o.join(s, "🖼️ Icon size.XS.json"), Y = o.join(s, "📐 Size.XS.json"), I = o.join(
    s,
    "🪐 Horisontal gap.XS.json"
  ), D = o.join(s, "🪐 Vertical gap.XS.json"), K = o.join(
    s,
    "🪐 Horisontal space.XS.json"
  ), Q = o.join(
    s,
    "🪐 Vertical space.XS.json"
  ), z = ["Squished", "Squared", "Stretched"], Z = (t) => {
    const a = t.toLowerCase(), n = o.join(
      e,
      r,
      `🪐 Space proportions.${t}.json`
    ), E = t === "Squared" ? ':root, [data-space-proportions="squared"]' : `[data-space-proportions="${a}"]`;
    return new c({
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
              filter: (i) => !!(p(i, [t]) || i.path && i.path[0] === "Container" && i.path[1] === "Spacing" || i.path && i.path[0] === "Page" && i.path[1] === "Spacing"),
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
  }, J = z.map(
    (t) => Z(t)
  );
  await Promise.all(
    J.map((t) => t.buildAllPlatforms())
  );
  const W = ["XS", "SM", "MD", "LG", "XL"], k = (t) => {
    const a = t.toLowerCase(), n = o.join(
      e,
      r,
      `🪐 Selectable space.${t}.json`
    ), E = t === "XS" ? ':root, [data-selectable-space="xs"]' : `[data-selectable-space="${a}"]`;
    return new c({
      include: [
        u,
        _,
        S,
        h
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
              filter: (i) => p(i, [t]),
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
    (t) => k(t)
  );
  await Promise.all(
    oo.map((t) => t.buildAllPlatforms())
  ), await new c({
    include: [
      u,
      // type-scale.inter/equinor primitives
      _,
      // figma.type-scale values
      S,
      // typography.ui-body/header values and sizing.stroke (needed for Font family and Stroke references)
      P,
      // Additional density mode
      // Visual tokens - must come before other tokens that reference them
      B,
      // Defines {Stroke.thickness} - References {sizing.stroke.thin} from DENSITY files
      $,
      q,
      Y,
      // Space tokens
      ...M,
      // Typography tokens
      ...x,
      // Include all Font family files for reference resolution
      w,
      H,
      V,
      X,
      v,
      // Gap and space tokens
      I,
      D,
      K,
      Q
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
              const a = t.path[0], n = t.path[1];
              return a === "Selectable" && (n === "Horisontal gap" || n === "Vertical gap") || a === "Container" && (n === "Horisontal gap" || n === "Vertical gap") || a === "Page" && (n === "Horizontal gap" || n === "Vertical gap") || a === "Generic" && (n === "Horizontal gap" || n === "Vertical gap");
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
const g = `${process.cwd()}/build`, fo = `${g}/css`, Po = `${g}/js`, Ao = `${g}/json`;
c.registerTransform(to);
c.registerTransform(eo);
c.registerTransform(no);
c.registerTransform(ao);
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
