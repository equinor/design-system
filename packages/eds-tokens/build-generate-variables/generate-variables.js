import { StyleDictionary as g } from "style-dictionary-utils";
import { includeTokenFilter as P, pxFormatted as mo, pxTransform as go, pxToRem as ho, fontQuote as Eo, iconContainerPaddingToEm as _o, ICON_CONTAINER_PADDING_TO_EM_NAME as Po, PX_TO_REM_NAME as Ao, PX_FORMATTED_NAME as Lo, FONT_QUOTE_NAME as Co } from "@equinor/eds-tokens-build";
import o from "path";
const I = "cpNchKjiIM19dPqTxE0fqg", j = "FQQqyumcpPQoiFRCjdS9GM", v = "eds", m = "spacing/", C = "typography/";
async function d({
  source: s,
  include: i = [],
  buildPath: r,
  destination: c,
  selector: h = ":root",
  prefix: l = v,
  transforms: E,
  filter: u,
  outputReferences: S = !0
}) {
  await new g({
    include: i,
    source: s,
    platforms: {
      css: {
        transformGroup: "css",
        prefix: l,
        buildPath: r,
        transforms: E,
        files: [
          {
            filter: u,
            destination: c,
            format: "css/variables",
            options: {
              selector: h,
              outputReferences: S
            }
          }
        ]
      }
    }
  }).buildAllPlatforms();
}
async function H({
  source: s,
  include: i = [],
  jsBuildPath: r,
  jsonBuildPath: c,
  cssBuildPath: h,
  transforms: l,
  prefix: E = v,
  filter: u,
  name: S,
  selector: A
}) {
  await new g({
    include: i,
    source: s,
    platforms: {
      ts: {
        transforms: ["name/constant"],
        buildPath: r,
        files: [
          {
            filter: u,
            destination: `spacing/${S}.js`,
            format: "javascript/es6"
          },
          {
            filter: u,
            format: "typescript/es6-declarations",
            destination: `spacing/${S}.d.ts`
          }
        ]
      },
      json: {
        buildPath: c,
        transforms: ["name/kebab"],
        files: [
          {
            filter: u,
            destination: `spacing/flat/${S}.json`,
            format: "json/flat"
          },
          {
            filter: u,
            destination: `spacing/nested/${S}.json`,
            format: "json/nested"
          }
        ]
      },
      css: {
        transformGroup: "css",
        prefix: E,
        buildPath: o.join(h, m),
        transforms: l,
        files: [
          {
            filter: u,
            destination: `${S}.css`,
            format: "css/variables",
            options: {
              selector: A,
              outputReferences: !1
            }
          }
        ]
      }
    }
  }).buildAllPlatforms();
}
async function To({
  tokensDir: s,
  cssBuildPath: i,
  cssTransforms: r
}) {
  const c = o.join(
    s,
    I,
    "👾 Primitives.Value.json"
  ), h = o.join(
    s,
    I,
    "⛔️ Figma.Value.json"
  ), l = o.join(
    s,
    j,
    "💎 Density.Spacious.json"
  ), E = o.join(
    s,
    j,
    "💎 Density.Comfortable.json"
  ), u = o.resolve(process.cwd(), "build"), S = o.join(u, "js"), A = o.join(u, "json"), $ = (t) => P(t, ["Density", "Spacious"]), z = (t) => P(t, ["Density", "Comfortable"]);
  await H({
    source: [l],
    include: [c, h],
    jsBuildPath: S,
    jsonBuildPath: A,
    cssBuildPath: i,
    transforms: r,
    filter: $,
    name: "spacious",
    selector: ':root, [data-density="spacious"]'
  }), await H({
    source: [E],
    include: [c, h],
    jsBuildPath: S,
    jsonBuildPath: A,
    cssBuildPath: i,
    transforms: r,
    filter: z,
    name: "comfortable",
    selector: '[data-density="comfortable"]'
  });
  const f = o.join(
    s,
    I,
    "⛔️ Figma.Value.json"
  ), O = o.join(
    s,
    j,
    "🪐 Space proportions.Squared.json"
  ), q = o.join(
    s,
    j,
    "🗣️ Semantic.Mode 1.json"
  ), N = o.join(
    s,
    j,
    "🪐 Container space.Default.json"
  ), D = o.join(
    s,
    j,
    "🪐 Page space.Default.json"
  ), n = o.join(s, j), V = [
    o.join(n, "🪐 Container space.Default.json"),
    o.join(n, "🪐 Page space.Default.json"),
    o.join(n, "🪐 Selectable space.XS.json"),
    o.join(n, "🪐 Selectable space.SM.json"),
    o.join(n, "🪐 Selectable space.MD.json"),
    o.join(n, "🪐 Selectable space.LG.json"),
    o.join(n, "🪐 Selectable space.XL.json"),
    o.join(n, "🪐 Space proportions.Squared.json"),
    o.join(n, "🪐 Space proportions.Squished.json"),
    o.join(n, "🪐 Space proportions.Stretched.json")
  ], T = o.join(n, "🅰️ Font size.XS.json"), F = o.join(
    n,
    "🅰️ Font family.UI Body.json"
  ), R = [
    o.join(n, "🅰️ Font family.Header.json"),
    o.join(n, "🅰️ Font family.UI and Body.json"),
    o.join(n, "🅰️ Font family.UI Body.json")
  ], Y = o.join(n, "🅰️ Font weight.Normal.json"), x = o.join(
    n,
    "🅰️ Font baseline.Centred.json"
  ), K = o.join(n, "🅰️ Tracking.Normal.json"), Q = o.join(
    n,
    "🅰️ Line height.Default.json"
  ), Z = o.join(n, "〰️ Stroke.Thin.json"), W = o.join(
    n,
    "⭕️ Border radius.Rounded.json"
  ), B = o.join(n, "🖼️ Icon size.XS.json"), J = o.join(n, "📐 Size.XS.json"), y = o.join(
    n,
    "🪐 Horizontal gap.XS.json"
  ), G = o.join(n, "🪐 Vertical gap.XS.json"), k = o.join(
    n,
    "🪐 Horizontal space.XS.json"
  ), oo = o.join(
    n,
    "🪐 Vertical space.XS.json"
  ), to = ["Squished", "Squared", "Stretched"];
  await Promise.all(
    to.map((t) => {
      const e = t.toLowerCase(), a = o.join(
        s,
        j,
        `🪐 Space proportions.${t}.json`
      ), _ = t === "Squared" ? ':root, [data-space-proportions="squared"]' : `[data-space-proportions="${e}"]`;
      return d({
        include: [
          c,
          f,
          l,
          y,
          G
        ],
        source: [a, N, D],
        buildPath: o.join(i, m),
        transforms: r,
        destination: `space-proportions-${e}.css`,
        selector: _,
        filter: (p) => !!(P(p, [t]) || p.path && p.path[0] === "Container" && p.path[1] === "Spacing" || p.path && p.path[0] === "Page" && p.path[1] === "Spacing")
      });
    })
  );
  const no = ["XS", "SM", "MD", "LG", "XL"];
  await Promise.all(
    no.map((t) => {
      const e = t.toLowerCase(), a = o.join(
        s,
        j,
        `🪐 Selectable space.${t}.json`
      ), _ = t === "XS" ? ':root, [data-selectable-space="xs"]' : `[data-selectable-space="${e}"]`;
      return d({
        include: [
          c,
          f,
          l,
          O
        ],
        source: [a],
        buildPath: o.join(i, m),
        transforms: r,
        destination: `selectable-space-${e}.css`,
        selector: _,
        filter: (p) => P(p, [t])
      });
    })
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
  ], w = async (t, e) => {
    const a = e.toLowerCase(), _ = o.join(
      s,
      j,
      `🪐 Horizontal ${t}.${e}.json`
    ), p = o.join(
      s,
      j,
      `🪐 Vertical ${t}.${e}.json`
    ), X = e === "XS" ? `:root, [data-horizontal-${t}="xs"]` : `[data-horizontal-${t}="${a}"]`, fo = e === "XS" ? `:root, [data-vertical-${t}="xs"]` : `[data-vertical-${t}="${a}"]`, M = [
      c,
      f,
      l
    ];
    await d({
      include: M,
      source: [_],
      buildPath: o.join(i, m),
      transforms: r,
      destination: `generic-${t}-horizontal-${a}.css`,
      selector: X,
      filter: (L) => !!(L.path && L.path[0] === `generic-${t}-horizontal`)
    }), await d({
      include: M,
      source: [p],
      buildPath: o.join(i, m),
      transforms: r,
      destination: `generic-${t}-vertical-${a}.css`,
      selector: fo,
      filter: (L) => !!(L.path && L.path[0] === `generic-${t}-vertical`)
    });
  };
  await Promise.all(
    eo.flatMap((t) => [
      w("gap", t),
      w("space", t)
    ])
  );
  const U = [
    c,
    f,
    l,
    O
  ];
  await d({
    include: U,
    source: [N],
    buildPath: o.join(i, m),
    transforms: r,
    destination: "container-space.css",
    selector: ":root, [data-space-proportions]",
    filter: (t) => !!(t.path && t.path[0] === "container-space")
  }), await d({
    include: U,
    source: [D],
    buildPath: o.join(i, m),
    transforms: r,
    destination: "page-space.css",
    selector: ":root, [data-space-proportions]",
    filter: (t) => !!(t.path && t.path[0] === "page-space")
  }), await d({
    include: [
      c,
      f,
      l,
      E,
      Z,
      W,
      B,
      J,
      ...V,
      ...R,
      T,
      Y,
      x,
      K,
      Q,
      y,
      G,
      k,
      oo
    ],
    source: [q],
    buildPath: o.join(i, m),
    transforms: r,
    destination: "semantic-spacing-gap.css",
    filter: (t) => {
      if (!t.path) return !1;
      const e = t.path[0], a = t.path[1];
      return e === "Selectable" && (a === "Gap horizontal" || a === "Gap vertical") || e === "Container" && (a === "Gap horizontal" || a === "Gap vertical") || e === "Page" && (a === "Gap horizontal" || a === "Gap vertical");
    }
  });
  const ao = [
    { mode: "Header", slug: "header" },
    { mode: "UI Body", slug: "ui" }
  ], so = [
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
  ], io = [
    { mode: "Lighter", slug: "lighter" },
    { mode: "Normal", slug: "normal" },
    { mode: "Bolder", slug: "bolder" }
  ], ro = [
    { mode: "Default", slug: "default" },
    { mode: "Squished", slug: "squished" }
  ], co = [
    { mode: "Tight", slug: "tight" },
    { mode: "Normal", slug: "normal" },
    { mode: "Wide", slug: "wide" },
    { mode: "Loose", slug: "loose" }
  ], lo = ao.map(
    ({ mode: t, slug: e }) => d({
      include: [
        c,
        f,
        l
      ],
      source: [o.join(n, `🅰️ Font family.${t}.json`)],
      buildPath: o.join(i, C),
      transforms: r,
      destination: `font-family-${e}.css`,
      selector: `[data-font-family="${e}"]`,
      filter: (a) => P(a, [t])
    })
  ), po = so.map(
    (t) => d({
      include: [
        c,
        f,
        l,
        ...R
      ],
      source: [o.join(n, `🅰️ Font size.${t}.json`)],
      buildPath: o.join(i, C),
      transforms: r,
      destination: `font-size-${t.toLowerCase()}.css`,
      selector: `[data-font-size="${t.toLowerCase()}"]`,
      filter: (e) => P(e, ["Font size", t])
    })
  ), jo = io.map(
    ({ mode: t, slug: e }) => d({
      include: [
        c,
        f,
        l,
        F,
        T
      ],
      source: [o.join(n, `🅰️ Font weight.${t}.json`)],
      buildPath: o.join(i, C),
      transforms: r,
      destination: `font-weight-${e}.css`,
      selector: `[data-font-weight="${e}"]`,
      filter: (a) => !!(a.path && a.path[1] === "font-weight")
    })
  ), uo = ro.map(
    ({ mode: t, slug: e }) => d({
      include: [
        c,
        f,
        l,
        F,
        T
      ],
      source: [o.join(n, `🅰️ Line height.${t}.json`)],
      buildPath: o.join(i, C),
      transforms: r,
      destination: `line-height-${e}.css`,
      selector: `[data-line-height="${e}"]`,
      filter: (a) => !!(a.path && a.path[1] === "line-height")
    })
  ), So = co.map(
    ({ mode: t, slug: e }) => d({
      include: [
        c,
        f,
        l,
        F,
        T
      ],
      source: [o.join(n, `🅰️ Tracking.${t}.json`)],
      buildPath: o.join(i, C),
      transforms: r,
      destination: `tracking-${e}.css`,
      selector: `[data-tracking="${e}"]`,
      filter: (a) => !!(a.path && a.path[1] === "tracking")
    })
  );
  await Promise.all([
    ...lo,
    ...po,
    ...jo,
    ...uo,
    ...So
  ]);
}
const b = `${process.cwd()}/build`, Fo = `${b}/css`, No = `${b}/js`, Do = `${b}/json`;
g.registerTransform(mo);
g.registerTransform(go);
g.registerTransform(ho);
g.registerTransform(Eo);
g.registerTransform(_o);
async function Io() {
  const s = `${process.cwd()}/tokens`;
  console.info("Running Style Dictionary build script"), console.info("Tokens directory:", s), await To({
    tokensDir: s,
    cssBuildPath: Fo,
    cssTransforms: [
      "name/kebab",
      Po,
      // Must run before pxToRem to intercept icon container padding tokens
      Ao,
      Lo,
      Co
    ]
  });
}
Io().then(() => {
  console.log("✅ Variables generated successfully");
}).catch((s) => {
  console.error("❌ Error generating color variables:", s);
});
export {
  Fo as cssBuildPath,
  Io as generate,
  No as jsBuildPath,
  Do as jsonBuildPath
};
