import { StyleDictionary as P } from "style-dictionary-utils";
import { includeTokenFilter as _, pxFormatted as go, pxTransform as ho, pxToRem as Eo, fontQuote as _o, PX_TO_REM_NAME as Po, PX_FORMATTED_NAME as Lo, FONT_QUOTE_NAME as Ao } from "@equinor/eds-tokens-build";
import o from "path";
const T = "cpNchKjiIM19dPqTxE0fqg", j = "FQQqyumcpPQoiFRCjdS9GM", q = "eds", m = "spacing/", C = "typography/";
async function d({
  source: s,
  include: i = [],
  buildPath: r,
  destination: c,
  selector: g = ":root",
  prefix: l = q,
  transforms: h,
  filter: u,
  outputReferences: S = !0
}) {
  await new P({
    include: i,
    source: s,
    platforms: {
      css: {
        transformGroup: "css",
        prefix: l,
        buildPath: r,
        transforms: h,
        files: [
          {
            filter: u,
            destination: c,
            format: "css/variables",
            options: {
              selector: g,
              outputReferences: S
            }
          }
        ]
      }
    }
  }).buildAllPlatforms();
}
async function z({
  source: s,
  include: i = [],
  jsBuildPath: r,
  jsonBuildPath: c,
  cssBuildPath: g,
  transforms: l,
  prefix: h = q,
  filter: u,
  name: S,
  selector: L
}) {
  await new P({
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
        prefix: h,
        buildPath: o.join(g, m),
        transforms: l,
        files: [
          {
            filter: u,
            destination: `${S}.css`,
            format: "css/variables",
            options: {
              selector: L,
              outputReferences: !1
            }
          }
        ]
      }
    }
  }).buildAllPlatforms();
}
async function Co({
  tokensDir: s,
  cssBuildPath: i,
  cssTransforms: r
}) {
  const c = o.join(
    s,
    T,
    "👾 Primitives.Value.json"
  ), g = o.join(
    s,
    T,
    "⛔️ Figma.Value.json"
  ), l = o.join(
    s,
    j,
    "💎 Density.Spacious.json"
  ), h = o.join(
    s,
    j,
    "💎 Density.Comfortable.json"
  ), u = o.resolve(process.cwd(), "build"), S = o.join(u, "js"), L = o.join(u, "json"), $ = (t) => _(t, ["Density", "Spacious"]), V = (t) => _(t, ["Density", "Comfortable"]);
  await z({
    source: [l],
    include: [c, g],
    jsBuildPath: S,
    jsonBuildPath: L,
    cssBuildPath: i,
    transforms: r,
    filter: $,
    name: "spacious",
    selector: ':root, [data-density="spacious"]'
  }), await z({
    source: [h],
    include: [c, g],
    jsBuildPath: S,
    jsonBuildPath: L,
    cssBuildPath: i,
    transforms: r,
    filter: V,
    name: "comfortable",
    selector: '[data-density="comfortable"]'
  });
  const f = o.join(
    s,
    T,
    "⛔️ Figma.Value.json"
  ), O = o.join(
    s,
    j,
    "🪐 Space proportions.Squared.json"
  ), Y = o.join(
    s,
    j,
    "🗣️ Semantic.Mode 1.json"
  ), D = o.join(
    s,
    j,
    "🪐 Container space.Default.json"
  ), y = o.join(
    s,
    j,
    "🪐 Page space.Default.json"
  ), n = o.join(s, j), x = [
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
  ], F = o.join(n, "🅰️ Font size.XS.json"), I = o.join(
    n,
    "🅰️ Font family.UI Body.json"
  ), N = [
    o.join(n, "🅰️ Font family.Header.json"),
    o.join(n, "🅰️ Font family.UI and Body.json"),
    o.join(n, "🅰️ Font family.UI Body.json")
  ], K = o.join(n, "🅰️ Font weight.Normal.json"), Q = o.join(
    n,
    "🅰️ Font baseline.Centred.json"
  ), Z = o.join(n, "🅰️ Tracking.Normal.json"), W = o.join(
    n,
    "🅰️ Line height.Default.json"
  ), B = o.join(n, "〰️ Stroke.Thin.json"), J = o.join(
    n,
    "⭕️ Border radius.Rounded.json"
  ), k = o.join(n, "🖼️ Icon size.XS.json"), oo = o.join(n, "📐 Size.XS.json"), R = o.join(
    n,
    "🪐 Horizontal gap.XS.json"
  ), w = o.join(n, "🪐 Vertical gap.XS.json"), to = o.join(
    n,
    "🪐 Horizontal space.XS.json"
  ), no = o.join(
    n,
    "🪐 Vertical space.XS.json"
  ), G = ["Squished", "Squared", "Stretched"];
  await Promise.all(
    G.map((t) => {
      const e = t.toLowerCase(), a = o.join(
        s,
        j,
        `🪐 Space proportions.${t}.json`
      ), E = t === "Squared" ? ':root, [data-space-proportions="squared"]' : `[data-space-proportions="${e}"]`;
      return d({
        include: [
          c,
          f,
          l,
          R,
          w
        ],
        source: [a, D, y],
        buildPath: o.join(i, m),
        transforms: r,
        destination: `space-proportions-${e}.css`,
        selector: E,
        filter: (p) => !!(_(p, [t]) || p.path && p.path[0] === "Container" && p.path[1] === "Spacing" || p.path && p.path[0] === "Page" && p.path[1] === "Spacing")
      });
    })
  );
  const eo = ["XS", "SM", "MD", "LG", "XL"];
  await Promise.all(
    eo.map((t) => {
      const e = t.toLowerCase(), a = o.join(
        s,
        j,
        `🪐 Selectable space.${t}.json`
      ), E = t === "XS" ? ':root, [data-selectable-space="xs"]' : `[data-selectable-space="${e}"]`;
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
        selector: E,
        filter: (p) => _(p, [t])
      });
    })
  );
  const ao = [
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
  ], U = async (t, e) => {
    const a = e.toLowerCase(), E = o.join(
      s,
      j,
      `🪐 Horizontal ${t}.${e}.json`
    ), p = o.join(
      s,
      j,
      `🪐 Vertical ${t}.${e}.json`
    ), H = e === "XS" ? `:root, [data-horizontal-${t}="xs"]` : `[data-horizontal-${t}="${a}"]`, mo = e === "XS" ? `:root, [data-vertical-${t}="xs"]` : `[data-vertical-${t}="${a}"]`, v = [
      c,
      f,
      l
    ];
    await d({
      include: v,
      source: [E],
      buildPath: o.join(i, m),
      transforms: r,
      destination: `generic-${t}-horizontal-${a}.css`,
      selector: H,
      filter: (A) => !!(A.path && A.path[0] === `generic-${t}-horizontal`)
    }), await d({
      include: v,
      source: [p],
      buildPath: o.join(i, m),
      transforms: r,
      destination: `generic-${t}-vertical-${a}.css`,
      selector: mo,
      filter: (A) => !!(A.path && A.path[0] === `generic-${t}-vertical`)
    });
  };
  await Promise.all(
    ao.flatMap((t) => [
      U("gap", t),
      U("space", t)
    ])
  );
  const X = [":root", ...G.map(
    (t) => `[data-space-proportions="${t.toLowerCase()}"]`
  )].join(
    ", "
  ), M = [
    c,
    f,
    l,
    O
  ];
  await d({
    include: M,
    source: [D],
    buildPath: o.join(i, m),
    transforms: r,
    destination: "container-space.css",
    selector: X,
    filter: (t) => !!(t.path && t.path[0] === "container-space")
  }), await d({
    include: M,
    source: [y],
    buildPath: o.join(i, m),
    transforms: r,
    destination: "page-space.css",
    selector: X,
    filter: (t) => !!(t.path && t.path[0] === "page-space")
  }), await d({
    include: [
      c,
      f,
      l,
      h,
      B,
      J,
      k,
      oo,
      ...x,
      ...N,
      F,
      K,
      Q,
      Z,
      W,
      R,
      w,
      to,
      no
    ],
    source: [Y],
    buildPath: o.join(i, m),
    transforms: r,
    destination: "semantic-spacing-gap.css",
    filter: (t) => {
      if (!t.path) return !1;
      const e = t.path[0], a = t.path[1];
      return e === "Selectable" && (a === "Gap horizontal" || a === "Gap vertical") || e === "Container" && (a === "Gap horizontal" || a === "Gap vertical") || e === "Page" && (a === "Gap horizontal" || a === "Gap vertical");
    }
  });
  const so = [
    { mode: "Header", slug: "header" },
    { mode: "UI Body", slug: "ui" }
  ], io = [
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
  ], ro = [
    { mode: "Lighter", slug: "lighter" },
    { mode: "Normal", slug: "normal" },
    { mode: "Bolder", slug: "bolder" }
  ], co = [
    { mode: "Default", slug: "default" },
    { mode: "Squished", slug: "squished" }
  ], lo = [
    { mode: "Tight", slug: "tight" },
    { mode: "Normal", slug: "normal" },
    { mode: "Wide", slug: "wide" },
    { mode: "Loose", slug: "loose" }
  ], po = so.map(
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
      filter: (a) => _(a, [t])
    })
  ), jo = io.map(
    (t) => d({
      include: [
        c,
        f,
        l,
        ...N
      ],
      source: [o.join(n, `🅰️ Font size.${t}.json`)],
      buildPath: o.join(i, C),
      transforms: r,
      destination: `font-size-${t.toLowerCase()}.css`,
      selector: `[data-font-size="${t.toLowerCase()}"]`,
      filter: (e) => _(e, ["Font size", t])
    })
  ), uo = ro.map(
    ({ mode: t, slug: e }) => d({
      include: [
        c,
        f,
        l,
        I,
        F
      ],
      source: [o.join(n, `🅰️ Font weight.${t}.json`)],
      buildPath: o.join(i, C),
      transforms: r,
      destination: `font-weight-${e}.css`,
      selector: `[data-font-weight="${e}"]`,
      filter: (a) => !!(a.path && a.path[1] === "font-weight")
    })
  ), So = co.map(
    ({ mode: t, slug: e }) => d({
      include: [
        c,
        f,
        l,
        I,
        F
      ],
      source: [o.join(n, `🅰️ Line height.${t}.json`)],
      buildPath: o.join(i, C),
      transforms: r,
      destination: `line-height-${e}.css`,
      selector: `[data-line-height="${e}"]`,
      filter: (a) => !!(a.path && a.path[1] === "line-height")
    })
  ), fo = lo.map(
    ({ mode: t, slug: e }) => d({
      include: [
        c,
        f,
        l,
        I,
        F
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
    ...po,
    ...jo,
    ...uo,
    ...So,
    ...fo
  ]);
}
const b = `${process.cwd()}/build`, Fo = `${b}/css`, Do = `${b}/js`, yo = `${b}/json`;
P.registerTransform(go);
P.registerTransform(ho);
P.registerTransform(Eo);
P.registerTransform(_o);
async function Io() {
  const s = `${process.cwd()}/tokens`;
  console.info("Running Style Dictionary build script"), console.info("Tokens directory:", s), await Co({
    tokensDir: s,
    cssBuildPath: Fo,
    cssTransforms: [
      "name/kebab",
      Po,
      Lo,
      Ao
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
  Do as jsBuildPath,
  yo as jsonBuildPath
};
