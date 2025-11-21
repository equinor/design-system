import { StyleDictionary as r } from "style-dictionary-utils";
import { includeTokenFilter as S, pxFormatted as Co, pxTransform as To, pxToRem as Ro, fontQuote as Go, PX_TO_REM_NAME as Io, PX_FORMATTED_NAME as yo, FONT_QUOTE_NAME as wo } from "@equinor/eds-tokens-build";
import t from "path";
const F = "cpNchKjiIM19dPqTxE0fqg", d = "FQQqyumcpPQoiFRCjdS9GM";
async function $o({
  tokensDir: i,
  cssBuildPath: l,
  cssTransforms: p
}) {
  const j = "spacing/", f = t.join(
    i,
    F,
    "👾 Primitives.Value.json"
  ), D = t.join(
    i,
    F,
    "⛔️ Figma.Value.json"
  ), u = t.join(
    i,
    d,
    "💎 Density.Spacious.json"
  ), C = t.join(
    i,
    d,
    "💎 Density.Comfortable.json"
  ), T = t.resolve(process.cwd(), "build"), R = t.join(T, "js"), G = t.join(T, "json"), b = (o) => S(o, ["Density", "Spacious"]), P = (o) => S(o, ["Density", "Comfortable"]), x = new r({
    include: [f, D],
    source: [u],
    platforms: {
      ts: {
        transforms: ["name/constant"],
        buildPath: R,
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
        buildPath: G,
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
        buildPath: t.join(l, j),
        transforms: p,
        files: [
          {
            filter: (o) => S(o, ["Density", "Spacious"]),
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
  }), z = new r({
    include: [f, D],
    source: [C],
    platforms: {
      ts: {
        transforms: ["name/constant"],
        buildPath: R,
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
        buildPath: G,
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
        buildPath: t.join(l, j),
        transforms: p,
        files: [
          {
            filter: (o) => S(o, ["Density", "Comfortable"]),
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
  await x.buildAllPlatforms(), await z.buildAllPlatforms();
  const m = t.join(
    i,
    F,
    "⛔️ Figma.Value.json"
  ), _ = t.join(
    i,
    d,
    "🪐 Space proportions.Squared.json"
  ), H = t.join(
    i,
    d,
    "🗣️ Semantic.Mode 1.json"
  ), I = t.join(
    i,
    d,
    "🪐 Container space.Default.json"
  ), y = t.join(
    i,
    d,
    "🪐 Page space.Default.json"
  ), s = t.join(i, d), q = [
    t.join(s, "🪐 Container space.Default.json"),
    t.join(s, "🪐 Page space.Default.json"),
    t.join(s, "🪐 Selectable space.XS.json"),
    t.join(s, "🪐 Selectable space.SM.json"),
    t.join(s, "🪐 Selectable space.MD.json"),
    t.join(s, "🪐 Selectable space.LG.json"),
    t.join(s, "🪐 Selectable space.XL.json"),
    t.join(s, "🪐 Space proportions.Squared.json"),
    t.join(s, "🪐 Space proportions.Squished.json"),
    t.join(s, "🪐 Space proportions.Stretched.json")
  ], E = t.join(s, "🅰️ Font size.XS.json"), A = t.join(
    s,
    "🅰️ Font family.UI Body.json"
  ), w = [
    t.join(s, "🅰️ Font family.Header.json"),
    t.join(s, "🅰️ Font family.UI and Body.json"),
    t.join(s, "🅰️ Font family.UI Body.json")
  ], V = t.join(s, "🅰️ Font weight.Normal.json"), Y = t.join(
    s,
    "🅰️ Font baseline.Centred.json"
  ), K = t.join(s, "🅰️ Tracking.Normal.json"), Q = t.join(
    s,
    "🅰️ Line height.Default.json"
  ), W = t.join(s, "〰️ Stroke.Thin.json"), Z = t.join(
    s,
    "⭕️ Border radius.Rounded.json"
  ), B = t.join(s, "🖼️ Icon size.XS.json"), J = t.join(s, "📐 Size.XS.json"), $ = t.join(
    s,
    "🪐 Horizontal gap.XS.json"
  ), O = t.join(s, "🪐 Vertical gap.XS.json"), k = t.join(
    s,
    "🪐 Horizontal space.XS.json"
  ), oo = t.join(
    s,
    "🪐 Vertical space.XS.json"
  ), N = ["Squished", "Squared", "Stretched"], to = (o) => {
    const n = o.toLowerCase(), e = t.join(
      i,
      d,
      `🪐 Space proportions.${o}.json`
    ), c = o === "Squared" ? ':root, [data-space-proportions="squared"]' : `[data-space-proportions="${n}"]`;
    return new r({
      include: [
        f,
        m,
        u,
        $,
        O
      ],
      source: [e, I, y],
      platforms: {
        css: {
          transformGroup: "css",
          prefix: "eds",
          buildPath: t.join(l, j),
          transforms: p,
          files: [
            {
              filter: (a) => !!(S(a, [o]) || a.path && a.path[0] === "Container" && a.path[1] === "Spacing" || a.path && a.path[0] === "Page" && a.path[1] === "Spacing"),
              destination: `space-proportions-${n}.css`,
              format: "css/variables",
              options: {
                selector: c,
                outputReferences: !0
              }
            }
          ]
        }
      }
    });
  }, so = N.map(
    (o) => to(o)
  );
  await Promise.all(
    so.map((o) => o.buildAllPlatforms())
  );
  const eo = ["XS", "SM", "MD", "LG", "XL"], no = (o) => {
    const n = o.toLowerCase(), e = t.join(
      i,
      d,
      `🪐 Selectable space.${o}.json`
    ), c = o === "XS" ? ':root, [data-selectable-space="xs"]' : `[data-selectable-space="${n}"]`;
    return new r({
      include: [
        f,
        m,
        u,
        _
      ],
      source: [e],
      platforms: {
        css: {
          transformGroup: "css",
          prefix: "eds",
          buildPath: t.join(l, j),
          transforms: p,
          files: [
            {
              filter: (a) => S(a, [o]),
              destination: `selectable-space-${n}.css`,
              format: "css/variables",
              options: {
                selector: c,
                outputReferences: !0
              }
            }
          ]
        }
      }
    });
  }, ao = eo.map(
    (o) => no(o)
  );
  await Promise.all(
    ao.map((o) => o.buildAllPlatforms())
  );
  const v = [
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
  ], U = (o, n) => {
    const e = n.toLowerCase(), c = t.join(
      i,
      d,
      `🪐 Horizontal ${o}.${n}.json`
    ), a = t.join(
      i,
      d,
      `🪐 Vertical ${o}.${n}.json`
    ), M = n === "XS" ? `:root, [data-horizontal-${o}="xs"]` : `[data-horizontal-${o}="${e}"]`, Do = n === "XS" ? `:root, [data-vertical-${o}="xs"]` : `[data-vertical-${o}="${e}"]`;
    return new r({
      include: [
        f,
        m,
        u
      ],
      source: [c, a],
      platforms: {
        css: {
          transformGroup: "css",
          prefix: "eds",
          buildPath: t.join(l, j),
          transforms: p,
          files: [
            {
              filter: (h) => h.path && h.path[0] === `generic-${o}-horizontal`,
              destination: `generic-${o}-horizontal-${e}.css`,
              format: "css/variables",
              options: {
                selector: M,
                outputReferences: !0
              }
            },
            {
              filter: (h) => h.path && h.path[0] === `generic-${o}-vertical`,
              destination: `generic-${o}-vertical-${e}.css`,
              format: "css/variables",
              options: {
                selector: Do,
                outputReferences: !0
              }
            }
          ]
        }
      }
    });
  }, io = v.map(
    (o) => U("gap", o)
  ), ro = v.map(
    (o) => U("space", o)
  );
  await Promise.all([
    ...io.map((o) => o.buildAllPlatforms()),
    ...ro.map((o) => o.buildAllPlatforms())
  ]);
  const X = [":root", ...N.map(
    (o) => `[data-space-proportions="${o.toLowerCase()}"]`
  )].join(
    ", "
  ), co = new r({
    include: [
      f,
      m,
      u,
      _
    ],
    source: [I],
    platforms: {
      css: {
        transformGroup: "css",
        prefix: "eds",
        buildPath: t.join(l, j),
        transforms: p,
        files: [
          {
            filter: (o) => o.path && o.path[0] === "container-space",
            destination: "container-space.css",
            format: "css/variables",
            options: {
              selector: X,
              outputReferences: !0
            }
          }
        ]
      }
    }
  }), lo = new r({
    include: [
      f,
      m,
      u,
      _
    ],
    source: [y],
    platforms: {
      css: {
        transformGroup: "css",
        prefix: "eds",
        buildPath: t.join(l, j),
        transforms: p,
        files: [
          {
            filter: (o) => o.path && o.path[0] === "page-space",
            destination: "page-space.css",
            format: "css/variables",
            options: {
              selector: X,
              outputReferences: !0
            }
          }
        ]
      }
    }
  });
  await Promise.all([
    co.buildAllPlatforms(),
    lo.buildAllPlatforms()
  ]), await new r({
    include: [
      f,
      // type-scale.inter/equinor primitives
      m,
      // figma.type-scale values
      u,
      // typography.ui-body/header values and sizing.stroke (needed for Font family and Stroke references)
      C,
      // Additional density mode
      // Visual tokens - must come before other tokens that reference them
      W,
      // Defines {Stroke.thickness} - References {sizing.stroke.thin} from DENSITY files
      Z,
      B,
      J,
      // Space tokens
      ...q,
      // Typography tokens
      ...w,
      // Include all Font family files for reference resolution
      E,
      V,
      Y,
      K,
      Q,
      // Gap and space tokens
      $,
      O,
      k,
      oo
    ],
    log: {
      verbosity: "verbose"
    },
    source: [H],
    platforms: {
      css: {
        transformGroup: "css",
        prefix: "eds",
        buildPath: t.join(l, j),
        transforms: p,
        files: [
          {
            filter: (o) => {
              if (!o.path) return !1;
              const n = o.path[0], e = o.path[1];
              return n === "Selectable" && (e === "Gap horizontal" || e === "Gap vertical") || n === "Container" && (e === "Gap horizontal" || e === "Gap vertical") || n === "Page" && (e === "Gap horizontal" || e === "Gap vertical");
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
  const g = "typography/", po = [
    { mode: "Header", slug: "header" },
    { mode: "UI Body", slug: "ui" }
  ], fo = [
    "XS",
    "SM",
    "MD",
    "LG",
    "XL",
    "2XL",
    "3XL",
    "4XL",
    "5XL",
    "6XL"
  ], uo = [
    { mode: "Lighter", slug: "lighter" },
    { mode: "Normal", slug: "normal" },
    { mode: "Bolder", slug: "bolder" }
  ], mo = [
    { mode: "Default", slug: "default" },
    { mode: "Squished", slug: "squished" }
  ], jo = [
    { mode: "Tight", slug: "tight" },
    { mode: "Normal", slug: "normal" },
    { mode: "Wide", slug: "wide" },
    { mode: "Loose", slug: "loose" }
  ], So = (o) => {
    const { mode: n, slug: e } = o, c = t.join(s, `🅰️ Font family.${n}.json`);
    return new r({
      include: [
        f,
        m,
        u
      ],
      source: [c],
      platforms: {
        css: {
          transformGroup: "css",
          prefix: "eds",
          buildPath: t.join(l, g),
          transforms: p,
          files: [
            {
              filter: (a) => S(a, [n]),
              destination: `font-family-${e}.css`,
              format: "css/variables",
              options: {
                selector: `[data-font-family="${e}"]`,
                outputReferences: !0
              }
            }
          ]
        }
      }
    });
  }, go = po.map(
    (o) => So(o)
  );
  await Promise.all(
    go.map((o) => o.buildAllPlatforms())
  );
  const ho = (o) => {
    const n = t.join(s, `🅰️ Font size.${o}.json`), e = o.toLowerCase();
    return new r({
      include: [
        f,
        m,
        u,
        ...w
      ],
      source: [n],
      log: {
        verbosity: "verbose"
      },
      platforms: {
        css: {
          transformGroup: "css",
          prefix: "eds",
          buildPath: t.join(l, g),
          transforms: p,
          files: [
            {
              filter: (c) => S(c, ["Font size", o]),
              destination: `font-size-${e}.css`,
              format: "css/variables",
              options: {
                selector: `[data-font-size="${e}"]`,
                outputReferences: !0
              }
            }
          ]
        }
      }
    });
  }, bo = fo.map(
    (o) => ho(o)
  );
  await Promise.all(
    bo.map((o) => o.buildAllPlatforms())
  );
  const Po = (o) => {
    const { mode: n, slug: e } = o, c = t.join(s, `🅰️ Font weight.${n}.json`);
    return new r({
      include: [
        f,
        m,
        u,
        A,
        E
      ],
      source: [c],
      platforms: {
        css: {
          transformGroup: "css",
          prefix: "eds",
          buildPath: t.join(l, g),
          transforms: p,
          files: [
            {
              filter: (a) => a.path && a.path[1] === "font-weight",
              destination: `font-weight-${e}.css`,
              format: "css/variables",
              options: {
                selector: `[data-font-weight="${e}"]`,
                outputReferences: !0
              }
            }
          ]
        }
      }
    });
  }, Eo = uo.map(
    (o) => Po(o)
  );
  await Promise.all(
    Eo.map((o) => o.buildAllPlatforms())
  );
  const _o = (o) => {
    const { mode: n, slug: e } = o, c = t.join(s, `🅰️ Line height.${n}.json`);
    return new r({
      include: [
        f,
        m,
        u,
        A,
        E
      ],
      source: [c],
      platforms: {
        css: {
          transformGroup: "css",
          prefix: "eds",
          buildPath: t.join(l, g),
          transforms: p,
          files: [
            {
              filter: (a) => a.path && a.path[1] === "line-height",
              destination: `line-height-${e}.css`,
              format: "css/variables",
              options: {
                selector: `[data-line-height="${e}"]`,
                outputReferences: !0
              }
            }
          ]
        }
      }
    });
  }, Ao = mo.map(
    (o) => _o(o)
  );
  await Promise.all(
    Ao.map((o) => o.buildAllPlatforms())
  );
  const Fo = (o) => {
    const { mode: n, slug: e } = o, c = t.join(s, `🅰️ Tracking.${n}.json`);
    return new r({
      include: [
        f,
        m,
        u,
        A,
        E
      ],
      source: [c],
      platforms: {
        css: {
          transformGroup: "css",
          prefix: "eds",
          buildPath: t.join(l, g),
          transforms: p,
          files: [
            {
              filter: (a) => a.path && a.path[1] === "tracking",
              destination: `tracking-${e}.css`,
              format: "css/variables",
              options: {
                selector: `[data-tracking="${e}"]`,
                outputReferences: !0
              }
            }
          ]
        }
      }
    });
  }, Lo = jo.map(
    (o) => Fo(o)
  );
  await Promise.all(
    Lo.map((o) => o.buildAllPlatforms())
  );
}
const L = `${process.cwd()}/build`, Oo = `${L}/css`, Ho = `${L}/js`, qo = `${L}/json`;
r.registerTransform(Co);
r.registerTransform(To);
r.registerTransform(Ro);
r.registerTransform(Go);
async function No() {
  const i = `${process.cwd()}/tokens`;
  console.info("Running Style Dictionary build script"), console.info("Tokens directory:", i), await $o({
    tokensDir: i,
    cssBuildPath: Oo,
    cssTransforms: [
      "name/kebab",
      Io,
      yo,
      wo
    ]
  });
}
No().then(() => {
  console.log("✅ Variables generated successfully");
}).catch((i) => {
  console.error("❌ Error generating color variables:", i);
});
export {
  Oo as cssBuildPath,
  No as generate,
  Ho as jsBuildPath,
  qo as jsonBuildPath
};
