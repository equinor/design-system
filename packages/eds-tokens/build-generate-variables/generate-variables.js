import { StyleDictionary as i } from "style-dictionary-utils";
import { createDensitySpaceToggleTransform as po, includeTokenFilter as d, pxFormatted as fo, pxTransform as uo, pxToRem as jo, fontQuote as mo, PX_TO_REM_NAME as So, PX_FORMATTED_NAME as bo, FONT_QUOTE_NAME as Eo } from "@equinor/eds-tokens-build";
import s from "path";
import { readJsonFiles as go } from "@equinor/eds-tokens-sync";
const P = "cpNchKjiIM19dPqTxE0fqg", c = "FQQqyumcpPQoiFRCjdS9GM";
async function _o({
  tokensDir: e,
  cssBuildPath: l,
  cssTransforms: p
}) {
  const f = "spacing/", u = s.join(
    e,
    P,
    "👾 Primitives.Value.json"
  ), T = s.join(
    e,
    P,
    "⛔️ Figma.Value.json"
  ), j = s.join(
    e,
    c,
    "💎 Density.Spacious.json"
  ), h = s.join(
    e,
    c,
    "💎 Density.Comfortable.json"
  ), U = go([
    s.join(
      e,
      c,
      "💎 Density.Comfortable.json"
    )
  ]), $ = po({
    name: "densitySpaceToggle",
    tokens: U["💎 Density.Comfortable.json"]
  });
  i.registerTransform($);
  const C = s.resolve(process.cwd(), "build"), D = s.join(C, "js"), F = s.join(C, "json"), E = (o) => d(o, ["Density", "Spacious"]), g = (o) => d(o, ["Density", "Comfortable"]), w = new i({
    include: [u, T],
    source: [j],
    platforms: {
      ts: {
        transforms: ["name/constant"],
        buildPath: D,
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
  }), v = new i({
    include: [u, T],
    source: [h],
    platforms: {
      ts: {
        transforms: ["name/constant"],
        buildPath: D,
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
  await w.buildAllPlatforms(), await v.buildAllPlatforms();
  const m = s.join(
    e,
    P,
    "⛔️ Figma.Value.json"
  ), _ = s.join(
    e,
    c,
    "🪐 Space proportions.Squared.json"
  ), X = s.join(
    e,
    c,
    "🗣️ Semantic.Mode 1.json"
  ), I = s.join(
    e,
    c,
    "🪐 Container space.Default.json"
  ), L = s.join(
    e,
    c,
    "🪐 Page space.Default.json"
  ), t = s.join(e, c);
  s.join(t, "📦 Box.Container.json"), s.join(t, "📦 Box.Generic.json"), s.join(t, "📦 Box.Page.json"), s.join(t, "📦 Box.Selectable.json");
  const M = [
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
  ), B = s.join(t, "🅰️ Lineheight.Default.json"), Y = s.join(t, "〰️ Stroke.Thin.json"), K = s.join(
    t,
    "⭕️ Border radius.Rounded.json"
  ), Q = s.join(t, "🖼️ Icon size.XS.json"), Z = s.join(t, "📐 Size.XS.json"), G = s.join(
    t,
    "🪐 Horizontal gap.XS.json"
  ), R = s.join(t, "🪐 Vertical gap.XS.json"), J = s.join(
    t,
    "🪐 Horizontal space.XS.json"
  ), W = s.join(
    t,
    "🪐 Vertical space.XS.json"
  ), k = ["Squished", "Squared", "Stretched"], oo = (o) => {
    const n = o.toLowerCase(), a = s.join(
      e,
      c,
      `🪐 Space proportions.${o}.json`
    ), S = o === "Squared" ? ':root, [data-space-proportions="squared"]' : `[data-space-proportions="${n}"]`;
    return new i({
      include: [
        u,
        m,
        j,
        G,
        R
      ],
      source: [a, I, L],
      platforms: {
        css: {
          transformGroup: "css",
          prefix: "eds",
          buildPath: s.join(l, f),
          transforms: p,
          files: [
            {
              filter: (r) => !!(d(r, [o]) || r.path && r.path[0] === "Container" && r.path[1] === "Spacing" || r.path && r.path[0] === "Page" && r.path[1] === "Spacing"),
              destination: `space-proportions-${n}.css`,
              format: "css/variables",
              options: {
                selector: S,
                outputReferences: !0
              }
            }
          ]
        }
      }
    });
  }, so = k.map(
    (o) => oo(o)
  );
  await Promise.all(
    so.map((o) => o.buildAllPlatforms())
  );
  const to = ["XS", "SM", "MD", "LG", "XL"], eo = (o) => {
    const n = o.toLowerCase(), a = s.join(
      e,
      c,
      `🪐 Selectable space.${o}.json`
    ), S = o === "XS" ? ':root, [data-selectable-space="xs"]' : `[data-selectable-space="${n}"]`;
    return new i({
      include: [
        u,
        m,
        j,
        _
      ],
      source: [a],
      platforms: {
        css: {
          transformGroup: "css",
          prefix: "eds",
          buildPath: s.join(l, f),
          transforms: p,
          files: [
            {
              filter: (r) => d(r, [o]),
              destination: `selectable-space-${n}.css`,
              format: "css/variables",
              options: {
                selector: S,
                outputReferences: !0
              }
            }
          ]
        }
      }
    });
  }, no = to.map(
    (o) => eo(o)
  );
  await Promise.all(
    no.map((o) => o.buildAllPlatforms())
  );
  const O = [
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
  ], N = (o, n) => {
    const a = n.toLowerCase();
    o.charAt(0).toUpperCase() + o.slice(1);
    const S = s.join(
      e,
      c,
      `🪐 Horizontal ${o}.${n}.json`
    ), r = s.join(
      e,
      c,
      `🪐 Vertical ${o}.${n}.json`
    ), y = n === "XS" ? `:root, [data-horizontal-${o}="xs"]` : `[data-horizontal-${o}="${a}"]`, lo = n === "XS" ? `:root, [data-vertical-${o}="xs"]` : `[data-vertical-${o}="${a}"]`;
    return new i({
      include: [
        u,
        m,
        j
      ],
      source: [S, r],
      platforms: {
        css: {
          transformGroup: "css",
          prefix: "eds",
          buildPath: s.join(l, f),
          transforms: p,
          files: [
            {
              filter: (b) => b.path && b.path[0] === `generic-${o}-horizontal`,
              destination: `generic-${o}-horizontal-${a}.css`,
              format: "css/variables",
              options: {
                selector: y,
                outputReferences: !0
              }
            },
            {
              filter: (b) => b.path && b.path[0] === `generic-${o}-vertical`,
              destination: `generic-${o}-vertical-${a}.css`,
              format: "css/variables",
              options: {
                selector: lo,
                outputReferences: !0
              }
            }
          ]
        }
      }
    });
  }, ao = O.map(
    (o) => N("gap", o)
  ), io = O.map(
    (o) => N("space", o)
  );
  await Promise.all([
    ...ao.map((o) => o.buildAllPlatforms()),
    ...io.map((o) => o.buildAllPlatforms())
  ]);
  const ro = new i({
    include: [
      u,
      m,
      j,
      _
    ],
    source: [I],
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
              selector: ":root",
              outputReferences: !0
            }
          }
        ]
      }
    }
  }), co = new i({
    include: [
      u,
      m,
      j,
      _
    ],
    source: [L],
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
              selector: ":root",
              outputReferences: !0
            }
          }
        ]
      }
    }
  });
  await Promise.all([
    ro.buildAllPlatforms(),
    co.buildAllPlatforms()
  ]), await new i({
    include: [
      u,
      // type-scale.inter/equinor primitives
      m,
      // figma.type-scale values
      j,
      // typography.ui-body/header values and sizing.stroke (needed for Font family and Stroke references)
      h,
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
      H,
      V,
      q,
      B,
      // Gap and space tokens
      G,
      R,
      J,
      W
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
              const n = o.path[0], a = o.path[1];
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
const A = `${process.cwd()}/build`, Po = `${A}/css`, Lo = `${A}/js`, Go = `${A}/json`;
i.registerTransform(fo);
i.registerTransform(uo);
i.registerTransform(jo);
i.registerTransform(mo);
async function Ao() {
  const e = `${process.cwd()}/tokens`;
  console.info("Running Style Dictionary build script"), console.info("Tokens directory:", e), await _o({
    tokensDir: e,
    cssBuildPath: Po,
    cssTransforms: [
      "name/kebab",
      So,
      bo,
      Eo
    ]
  });
}
Ao().then(() => {
  console.log("✅ Variables generated successfully");
}).catch((e) => {
  console.error("❌ Error generating color variables:", e);
});
export {
  Po as cssBuildPath,
  Ao as generate,
  Lo as jsBuildPath,
  Go as jsonBuildPath
};
