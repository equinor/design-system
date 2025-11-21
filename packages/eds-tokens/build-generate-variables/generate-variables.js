import { StyleDictionary as r } from "style-dictionary-utils";
import { includeTokenFilter as S, pxFormatted as Co, pxTransform as yo, pxToRem as Io, fontQuote as To, PX_TO_REM_NAME as Go, PX_FORMATTED_NAME as Ro, FONT_QUOTE_NAME as $o } from "@equinor/eds-tokens-build";
import t from "path";
const L = "cpNchKjiIM19dPqTxE0fqg", d = "FQQqyumcpPQoiFRCjdS9GM";
async function wo({
  tokensDir: i,
  cssBuildPath: l,
  cssTransforms: p
}) {
  const j = "spacing/", f = t.join(
    i,
    L,
    "👾 Primitives.Value.json"
  ), D = t.join(
    i,
    L,
    "⛔️ Figma.Value.json"
  ), u = t.join(
    i,
    d,
    "💎 Density.Spacious.json"
  ), C = t.join(
    i,
    d,
    "💎 Density.Comfortable.json"
  ), y = t.resolve(process.cwd(), "build"), I = t.join(y, "js"), T = t.join(y, "json"), b = (o) => S(o, ["Density", "Spacious"]), P = (o) => S(o, ["Density", "Comfortable"]), x = new r({
    include: [f, D],
    source: [u],
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
        buildPath: T,
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
        buildPath: T,
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
    L,
    "⛔️ Figma.Value.json"
  ), _ = t.join(
    i,
    d,
    "🪐 Space proportions.Squared.json"
  ), H = t.join(
    i,
    d,
    "🗣️ Semantic.Mode 1.json"
  ), G = t.join(
    i,
    d,
    "🪐 Container space.Default.json"
  ), R = t.join(
    i,
    d,
    "🪐 Page space.Default.json"
  ), e = t.join(i, d), q = [
    t.join(e, "🪐 Container space.Default.json"),
    t.join(e, "🪐 Page space.Default.json"),
    t.join(e, "🪐 Selectable space.XS.json"),
    t.join(e, "🪐 Selectable space.SM.json"),
    t.join(e, "🪐 Selectable space.MD.json"),
    t.join(e, "🪐 Selectable space.LG.json"),
    t.join(e, "🪐 Selectable space.XL.json"),
    t.join(e, "🪐 Space proportions.Squared.json"),
    t.join(e, "🪐 Space proportions.Squished.json"),
    t.join(e, "🪐 Space proportions.Stretched.json")
  ], E = t.join(e, "🅰️ Font size.XS.json"), A = t.join(
    e,
    "🅰️ Font family.UI Body.json"
  ), $ = [
    t.join(e, "🅰️ Font family.Header.json"),
    t.join(e, "🅰️ Font family.UI and Body.json"),
    t.join(e, "🅰️ Font family.UI Body.json")
  ], V = t.join(e, "🅰️ Font weight.Normal.json"), Y = t.join(
    e,
    "🅰️ Font baseline.Centred.json"
  ), K = t.join(
    e,
    "🅰️ Letter spacing.Normal.json"
  ), Q = t.join(e, "🅰️ Lineheight.Default.json"), W = t.join(e, "〰️ Stroke.Thin.json"), B = t.join(
    e,
    "⭕️ Border radius.Rounded.json"
  ), Z = t.join(e, "🖼️ Icon size.XS.json"), J = t.join(e, "📐 Size.XS.json"), w = t.join(
    e,
    "🪐 Horizontal gap.XS.json"
  ), O = t.join(e, "🪐 Vertical gap.XS.json"), k = t.join(
    e,
    "🪐 Horizontal space.XS.json"
  ), oo = t.join(
    e,
    "🪐 Vertical space.XS.json"
  ), N = ["Squished", "Squared", "Stretched"], to = (o) => {
    const n = o.toLowerCase(), s = t.join(
      i,
      d,
      `🪐 Space proportions.${o}.json`
    ), c = o === "Squared" ? ':root, [data-space-proportions="squared"]' : `[data-space-proportions="${n}"]`;
    return new r({
      include: [
        f,
        m,
        u,
        w,
        O
      ],
      source: [s, G, R],
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
  }, eo = N.map(
    (o) => to(o)
  );
  await Promise.all(
    eo.map((o) => o.buildAllPlatforms())
  );
  const so = ["XS", "SM", "MD", "LG", "XL"], no = (o) => {
    const n = o.toLowerCase(), s = t.join(
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
      source: [s],
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
  }, ao = so.map(
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
    const s = n.toLowerCase(), c = t.join(
      i,
      d,
      `🪐 Horizontal ${o}.${n}.json`
    ), a = t.join(
      i,
      d,
      `🪐 Vertical ${o}.${n}.json`
    ), M = n === "XS" ? `:root, [data-horizontal-${o}="xs"]` : `[data-horizontal-${o}="${s}"]`, Do = n === "XS" ? `:root, [data-vertical-${o}="xs"]` : `[data-vertical-${o}="${s}"]`;
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
              destination: `generic-${o}-horizontal-${s}.css`,
              format: "css/variables",
              options: {
                selector: M,
                outputReferences: !0
              }
            },
            {
              filter: (h) => h.path && h.path[0] === `generic-${o}-vertical`,
              destination: `generic-${o}-vertical-${s}.css`,
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
    source: [G],
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
    source: [R],
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
      B,
      Z,
      J,
      // Space tokens
      ...q,
      // Typography tokens
      ...$,
      // Include all Font family files for reference resolution
      E,
      V,
      Y,
      K,
      Q,
      // Gap and space tokens
      w,
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
              const n = o.path[0], s = o.path[1];
              return n === "Selectable" && (s === "Gap horizontal" || s === "Gap vertical") || n === "Container" && (s === "Gap horizontal" || s === "Gap vertical") || n === "Page" && (s === "Gap horizontal" || s === "Gap vertical");
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
    { mode: "UI and Body", slug: "ui-body" },
    { mode: "UI Body", slug: "ui-body-alt" }
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
    const { mode: n, slug: s } = o, c = t.join(e, `🅰️ Font family.${n}.json`);
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
              destination: `font-family-${s}.css`,
              format: "css/variables",
              options: {
                selector: `[data-font-family="${s}"]`,
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
    const n = t.join(e, `🅰️ Font size.${o}.json`), s = o.toLowerCase();
    return new r({
      include: [
        f,
        m,
        u,
        ...$
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
              destination: `font-size-${s}.css`,
              format: "css/variables",
              options: {
                selector: `[data-font-size="${s}"]`,
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
    const { mode: n, slug: s } = o, c = t.join(e, `🅰️ Font weight.${n}.json`);
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
              filter: (a) => a.path && a.path[0] === "Font Weight",
              destination: `font-weight-${s}.css`,
              format: "css/variables",
              options: {
                selector: `[data-font-weight="${s}"]`,
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
    const { mode: n, slug: s } = o, c = t.join(e, `🅰️ Lineheight.${n}.json`);
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
              filter: (a) => a.path && a.path[0] === "Lineheight",
              destination: `line-height-${s}.css`,
              format: "css/variables",
              options: {
                selector: `[data-line-height="${s}"]`,
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
  const Lo = (o) => {
    const { mode: n, slug: s } = o, c = t.join(e, `🅰️ Letter spacing.${n}.json`);
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
              filter: (a) => a.path && a.path[0] === "Letter spacing",
              destination: `letter-spacing-${s}.css`,
              format: "css/variables",
              options: {
                selector: `[data-tracking="${s}"]`,
                outputReferences: !0
              }
            }
          ]
        }
      }
    });
  }, Fo = jo.map(
    (o) => Lo(o)
  );
  await Promise.all(
    Fo.map((o) => o.buildAllPlatforms())
  );
}
const F = `${process.cwd()}/build`, Oo = `${F}/css`, Ho = `${F}/js`, qo = `${F}/json`;
r.registerTransform(Co);
r.registerTransform(yo);
r.registerTransform(Io);
r.registerTransform(To);
async function No() {
  const i = `${process.cwd()}/tokens`;
  console.info("Running Style Dictionary build script"), console.info("Tokens directory:", i), await wo({
    tokensDir: i,
    cssBuildPath: Oo,
    cssTransforms: [
      "name/kebab",
      Go,
      Ro,
      $o
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
