import { StyleDictionary as c } from "style-dictionary-utils";
import { createDensitySpaceToggleTransform as eo, includeTokenFilter as p, pxFormatted as no, pxTransform as ao, pxToRem as io, fontQuote as ro, PX_TO_REM_NAME as co, PX_FORMATTED_NAME as lo, FONT_QUOTE_NAME as po } from "@equinor/eds-tokens-build";
import o from "path";
import { readJsonFiles as fo } from "@equinor/eds-tokens-sync";
const b = "cpNchKjiIM19dPqTxE0fqg", r = "FQQqyumcpPQoiFRCjdS9GM";
async function jo({
  tokensDir: e,
  cssBuildPath: l,
  cssTransforms: f
}) {
  const j = "spacing/", u = o.join(
    e,
    b,
    "👾 Primitives.Value.json"
  ), g = o.join(
    e,
    b,
    "⛔️ Figma.Value.json"
  ), S = o.join(
    e,
    r,
    "💎 Density.Spacious.json"
  ), A = o.join(
    e,
    r,
    "💎 Density.Comfortable.json"
  ), R = fo([
    o.join(
      e,
      r,
      "💎 Density.Comfortable.json"
    )
  ]), h = eo({
    name: "densitySpaceToggle",
    tokens: R["💎 Density.Comfortable.json"]
  });
  c.registerTransform(h);
  const P = o.resolve(process.cwd(), "build"), C = o.join(P, "js"), F = o.join(P, "json"), m = (t) => p(t, ["Density", "Spacious"]), d = (t) => p(t, ["Density", "Comfortable"]), G = new c({
    include: [u, g],
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
  }), N = new c({
    include: [u, g],
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
  await G.buildAllPlatforms(), await N.buildAllPlatforms();
  const _ = o.join(
    e,
    b,
    "⛔️ Figma.Value.json"
  ), U = o.join(
    e,
    r,
    "🪐 Space proportions.Squared.json"
  ), M = o.join(
    e,
    r,
    "🗣️ Semantic.Mode 1.json"
  ), w = o.join(
    e,
    r,
    "🪐 Container space.Default.json"
  ), x = o.join(
    e,
    r,
    "🪐 Page.Default.json"
  ), s = o.join(e, r), X = [
    o.join(s, "📦 Box.Container.json"),
    o.join(s, "📦 Box.Generic.json"),
    o.join(s, "📦 Box.Page.json"),
    o.join(s, "📦 Box.Selectable.json")
  ], H = [
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
  ], I = o.join(s, "🅰️ Font size.XS.json"), D = [
    o.join(s, "🅰️ Font family.Header.json"),
    o.join(s, "🅰️ Font family.UI and Body.json"),
    o.join(s, "🅰️ Font family.UI Body.json")
  ], V = o.join(s, "🅰️ Font weight.Normal.json"), B = o.join(
    s,
    "🅰️ Font baseline.Centred.json"
  ), v = o.join(
    s,
    "🅰️ Letter spacing.Normal.json"
  ), $ = o.join(s, "🅰️ Lineheight.Default.json"), L = o.join(s, "〰️ Stroke.Thin.json"), q = o.join(
    s,
    "⭕️ Border radius.Rounded.json"
  ), K = o.join(s, "🖼️ Icon size.XS.json"), Y = o.join(s, "📐 Size.XS.json"), O = o.join(
    s,
    "🪐 Horisontal gap.XS.json"
  ), y = o.join(s, "🪐 Vertical gap.XS.json"), Q = o.join(
    s,
    "🪐 Horisontal space.XS.json"
  ), z = o.join(
    s,
    "🪐 Vertical space.XS.json"
  ), Z = [
    L,
    ...X,
    ...H,
    ...D,
    // Include all Font family files for reference resolution
    I,
    V,
    B,
    v,
    $,
    q,
    K,
    Y,
    O,
    y,
    Q,
    z
  ], J = ["Squished", "Squared", "Stretched"], W = (t) => {
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
        O,
        y
      ],
      source: [n, w, x],
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
  }, k = J.map(
    (t) => W(t)
  );
  await Promise.all(
    k.map((t) => t.buildAllPlatforms())
  );
  const oo = ["XS", "SM", "MD", "LG", "XL"], so = (t) => {
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
        U
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
  }, to = oo.map(
    (t) => so(t)
  );
  await Promise.all(
    to.map((t) => t.buildAllPlatforms())
  ), await new c({
    log: { verbosity: "verbose" },
    include: [
      u,
      // type-scale.inter/equinor primitives
      _,
      // figma.type-scale values
      S,
      // typography.ui-body/header values (needed for Font family references)
      A,
      // Additional density mode
      ...Z
      // Default mode files only (Font size.XS, Font family.UI Body, etc.)
    ],
    source: [
      // Process dependency files first so tokens are available when resolving semantic token references
      // Include all Font family files in source to ensure StyleDictionary can resolve {Font family.XS.*} references
      // Token collisions are acceptable since we filter output to only gap tokens
      ...D,
      I,
      // Add to source so StyleDictionary can resolve {font-size} references
      L,
      // Add to source so StyleDictionary can resolve {Stroke.thickness} references
      M
      // Process semantic tokens last, after dependencies are loaded
    ],
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
const T = `${process.cwd()}/build`, uo = `${T}/css`, Co = `${T}/js`, Fo = `${T}/json`;
c.registerTransform(no);
c.registerTransform(ao);
c.registerTransform(io);
c.registerTransform(ro);
async function So() {
  const e = `${process.cwd()}/tokens`;
  console.info("Running Style Dictionary build script"), console.info("Tokens directory:", e), await jo({
    tokensDir: e,
    cssBuildPath: uo,
    cssTransforms: [
      "name/kebab",
      co,
      lo,
      po
    ]
  });
}
So().then(() => {
  console.log("✅ Variables generated successfully");
}).catch((e) => {
  console.error("❌ Error generating color variables:", e);
});
export {
  uo as cssBuildPath,
  So as generate,
  Co as jsBuildPath,
  Fo as jsonBuildPath
};
