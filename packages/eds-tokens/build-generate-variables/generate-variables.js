import { StyleDictionary as r } from "style-dictionary-utils";
import { includeTokenFilter as d, pxFormatted as lo, pxTransform as po, pxToRem as fo, fontQuote as uo, PX_TO_REM_NAME as jo, PX_FORMATTED_NAME as So, FONT_QUOTE_NAME as mo } from "@equinor/eds-tokens-build";
import s from "path";
const A = "cpNchKjiIM19dPqTxE0fqg", c = "FQQqyumcpPQoiFRCjdS9GM";
async function Eo({
  tokensDir: e,
  cssBuildPath: l,
  cssTransforms: p
}) {
  const f = "spacing/", u = s.join(
    e,
    A,
    "👾 Primitives.Value.json"
  ), h = s.join(
    e,
    A,
    "⛔️ Figma.Value.json"
  ), j = s.join(
    e,
    c,
    "💎 Density.Spacious.json"
  ), T = s.join(
    e,
    c,
    "💎 Density.Comfortable.json"
  ), C = s.resolve(process.cwd(), "build"), I = s.join(C, "js"), L = s.join(C, "json"), b = (o) => d(o, ["Density", "Spacious"]), P = (o) => d(o, ["Density", "Comfortable"]), y = new r({
    include: [u, h],
    source: [j],
    platforms: {
      ts: {
        transforms: ["name/constant"],
        buildPath: I,
        files: [
          {
            filter: b,
            destination: "spacing/spacious.js",
            format: "javascript/es6"
          },
          {
            filter: b,
            format: "typescript/es6-declarations",
            destination: "spacing/spacious.d.ts"
          }
        ]
      },
      json: {
        buildPath: L,
        transforms: ["name/kebab"],
        files: [
          {
            filter: b,
            destination: "spacing/flat/spacious.json",
            format: "json/flat"
          },
          {
            filter: b,
            destination: "spacing/nested/spacious.json",
            format: "json/nested"
          }
        ]
      },
      css: {
        transformGroup: "css",
        prefix: "eds",
        buildPath: s.join(l, f),
        transforms: p,
        files: [
          {
            filter: (o) => d(o, ["Density", "Spacious"]),
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
  }), v = new r({
    include: [u, h],
    source: [T],
    platforms: {
      ts: {
        transforms: ["name/constant"],
        buildPath: I,
        files: [
          {
            filter: P,
            destination: "spacing/comfortable.js",
            format: "javascript/es6"
          },
          {
            filter: P,
            format: "typescript/es6-declarations",
            destination: "spacing/comfortable.d.ts"
          }
        ]
      },
      json: {
        buildPath: L,
        transforms: ["name/kebab"],
        files: [
          {
            filter: P,
            destination: "spacing/flat/comfortable.json",
            format: "json/flat"
          },
          {
            filter: P,
            destination: "spacing/nested/comfortable.json",
            format: "json/nested"
          }
        ]
      },
      css: {
        transformGroup: "css",
        prefix: "eds",
        buildPath: s.join(l, f),
        transforms: p,
        files: [
          {
            filter: (o) => d(o, ["Density", "Comfortable"]),
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
  await y.buildAllPlatforms(), await v.buildAllPlatforms();
  const S = s.join(
    e,
    A,
    "⛔️ Figma.Value.json"
  ), _ = s.join(
    e,
    c,
    "🪐 Space proportions.Squared.json"
  ), X = s.join(
    e,
    c,
    "🗣️ Semantic.Mode 1.json"
  ), F = s.join(
    e,
    c,
    "🪐 Container space.Default.json"
  ), D = s.join(
    e,
    c,
    "🪐 Page space.Default.json"
  ), t = s.join(e, c), M = [
    s.join(t, "🪐 Container space.Default.json"),
    s.join(t, "🪐 Page space.Default.json"),
    s.join(t, "🪐 Selectable space.XS.json"),
    s.join(t, "🪐 Selectable space.SM.json"),
    s.join(t, "🪐 Selectable space.MD.json"),
    s.join(t, "🪐 Selectable space.LG.json"),
    s.join(t, "🪐 Selectable space.XL.json"),
    s.join(t, "🪐 Space proportions.Squared.json"),
    s.join(t, "🪐 Space proportions.Squished.json"),
    s.join(t, "🪐 Space proportions.Stretched.json")
  ], x = s.join(t, "🅰️ Font size.XS.json"), z = [
    s.join(t, "🅰️ Font family.Header.json"),
    s.join(t, "🅰️ Font family.UI and Body.json"),
    s.join(t, "🅰️ Font family.UI Body.json")
  ], H = s.join(t, "🅰️ Font weight.Normal.json"), V = s.join(
    t,
    "🅰️ Font baseline.Centred.json"
  ), q = s.join(
    t,
    "🅰️ Letter spacing.Normal.json"
  ), Y = s.join(t, "🅰️ Lineheight.Default.json"), K = s.join(t, "〰️ Stroke.Thin.json"), Q = s.join(
    t,
    "⭕️ Border radius.Rounded.json"
  ), B = s.join(t, "🖼️ Icon size.XS.json"), Z = s.join(t, "📐 Size.XS.json"), R = s.join(
    t,
    "🪐 Horizontal gap.XS.json"
  ), G = s.join(t, "🪐 Vertical gap.XS.json"), W = s.join(
    t,
    "🪐 Horizontal space.XS.json"
  ), J = s.join(
    t,
    "🪐 Vertical space.XS.json"
  ), O = ["Squished", "Squared", "Stretched"], k = (o) => {
    const a = o.toLowerCase(), n = s.join(
      e,
      c,
      `🪐 Space proportions.${o}.json`
    ), m = o === "Squared" ? ':root, [data-space-proportions="squared"]' : `[data-space-proportions="${a}"]`;
    return new r({
      include: [
        u,
        S,
        j,
        R,
        G
      ],
      source: [n, F, D],
      platforms: {
        css: {
          transformGroup: "css",
          prefix: "eds",
          buildPath: s.join(l, f),
          transforms: p,
          files: [
            {
              filter: (i) => !!(d(i, [o]) || i.path && i.path[0] === "Container" && i.path[1] === "Spacing" || i.path && i.path[0] === "Page" && i.path[1] === "Spacing"),
              destination: `space-proportions-${a}.css`,
              format: "css/variables",
              options: {
                selector: m,
                outputReferences: !0
              }
            }
          ]
        }
      }
    });
  }, oo = O.map(
    (o) => k(o)
  );
  await Promise.all(
    oo.map((o) => o.buildAllPlatforms())
  );
  const so = ["XS", "SM", "MD", "LG", "XL"], to = (o) => {
    const a = o.toLowerCase(), n = s.join(
      e,
      c,
      `🪐 Selectable space.${o}.json`
    ), m = o === "XS" ? ':root, [data-selectable-space="xs"]' : `[data-selectable-space="${a}"]`;
    return new r({
      include: [
        u,
        S,
        j,
        _
      ],
      source: [n],
      platforms: {
        css: {
          transformGroup: "css",
          prefix: "eds",
          buildPath: s.join(l, f),
          transforms: p,
          files: [
            {
              filter: (i) => d(i, [o]),
              destination: `selectable-space-${a}.css`,
              format: "css/variables",
              options: {
                selector: m,
                outputReferences: !0
              }
            }
          ]
        }
      }
    });
  }, eo = so.map(
    (o) => to(o)
  );
  await Promise.all(
    eo.map((o) => o.buildAllPlatforms())
  );
  const N = [
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
  ], U = (o, a) => {
    const n = a.toLowerCase(), m = s.join(
      e,
      c,
      `🪐 Horizontal ${o}.${a}.json`
    ), i = s.join(
      e,
      c,
      `🪐 Vertical ${o}.${a}.json`
    ), w = a === "XS" ? `:root, [data-horizontal-${o}="xs"]` : `[data-horizontal-${o}="${n}"]`, co = a === "XS" ? `:root, [data-vertical-${o}="xs"]` : `[data-vertical-${o}="${n}"]`;
    return new r({
      include: [
        u,
        S,
        j
      ],
      source: [m, i],
      platforms: {
        css: {
          transformGroup: "css",
          prefix: "eds",
          buildPath: s.join(l, f),
          transforms: p,
          files: [
            {
              filter: (E) => E.path && E.path[0] === `generic-${o}-horizontal`,
              destination: `generic-${o}-horizontal-${n}.css`,
              format: "css/variables",
              options: {
                selector: w,
                outputReferences: !0
              }
            },
            {
              filter: (E) => E.path && E.path[0] === `generic-${o}-vertical`,
              destination: `generic-${o}-vertical-${n}.css`,
              format: "css/variables",
              options: {
                selector: co,
                outputReferences: !0
              }
            }
          ]
        }
      }
    });
  }, ao = N.map(
    (o) => U("gap", o)
  ), no = N.map(
    (o) => U("space", o)
  );
  await Promise.all([
    ...ao.map((o) => o.buildAllPlatforms()),
    ...no.map((o) => o.buildAllPlatforms())
  ]);
  const $ = [":root", ...O.map(
    (o) => `[data-space-proportions="${o.toLowerCase()}"]`
  )].join(
    ", "
  ), io = new r({
    include: [
      u,
      S,
      j,
      _
    ],
    source: [F],
    platforms: {
      css: {
        transformGroup: "css",
        prefix: "eds",
        buildPath: s.join(l, f),
        transforms: p,
        files: [
          {
            filter: (o) => o.path && o.path[0] === "container-space",
            destination: "container-space.css",
            format: "css/variables",
            options: {
              selector: $,
              outputReferences: !0
            }
          }
        ]
      }
    }
  }), ro = new r({
    include: [
      u,
      S,
      j,
      _
    ],
    source: [D],
    platforms: {
      css: {
        transformGroup: "css",
        prefix: "eds",
        buildPath: s.join(l, f),
        transforms: p,
        files: [
          {
            filter: (o) => o.path && o.path[0] === "page-space",
            destination: "page-space.css",
            format: "css/variables",
            options: {
              selector: $,
              outputReferences: !0
            }
          }
        ]
      }
    }
  });
  await Promise.all([
    io.buildAllPlatforms(),
    ro.buildAllPlatforms()
  ]), await new r({
    include: [
      u,
      // type-scale.inter/equinor primitives
      S,
      // figma.type-scale values
      j,
      // typography.ui-body/header values and sizing.stroke (needed for Font family and Stroke references)
      T,
      // Additional density mode
      // Visual tokens - must come before other tokens that reference them
      K,
      // Defines {Stroke.thickness} - References {sizing.stroke.thin} from DENSITY files
      Q,
      B,
      Z,
      // Space tokens
      ...M,
      // Typography tokens
      ...z,
      // Include all Font family files for reference resolution
      x,
      H,
      V,
      q,
      Y,
      // Gap and space tokens
      R,
      G,
      W,
      J
    ],
    log: {
      verbosity: "verbose"
    },
    source: [X],
    platforms: {
      css: {
        transformGroup: "css",
        prefix: "eds",
        buildPath: s.join(l, f),
        transforms: p,
        files: [
          {
            filter: (o) => {
              if (!o.path) return !1;
              const a = o.path[0], n = o.path[1];
              return a === "Selectable" && (n === "Gap horizontal" || n === "Gap vertical") || a === "Container" && (n === "Gap horizontal" || n === "Gap vertical") || a === "Page" && (n === "Gap horizontal" || n === "Gap vertical");
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
const g = `${process.cwd()}/build`, bo = `${g}/css`, Io = `${g}/js`, Lo = `${g}/json`;
r.registerTransform(lo);
r.registerTransform(po);
r.registerTransform(fo);
r.registerTransform(uo);
async function Po() {
  const e = `${process.cwd()}/tokens`;
  console.info("Running Style Dictionary build script"), console.info("Tokens directory:", e), await Eo({
    tokensDir: e,
    cssBuildPath: bo,
    cssTransforms: [
      "name/kebab",
      jo,
      So,
      mo
    ]
  });
}
Po().then(() => {
  console.log("✅ Variables generated successfully");
}).catch((e) => {
  console.error("❌ Error generating color variables:", e);
});
export {
  bo as cssBuildPath,
  Po as generate,
  Io as jsBuildPath,
  Lo as jsonBuildPath
};
