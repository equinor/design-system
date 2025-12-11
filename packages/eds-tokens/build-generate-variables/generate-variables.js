import { StyleDictionary as L } from "style-dictionary-utils";
import { includeTokenFilter as _, pxFormatted as ho, pxTransform as Eo, pxToRem as _o, fontQuote as Lo, PX_TO_REM_NAME as Po, PX_FORMATTED_NAME as Ao, FONT_QUOTE_NAME as Co } from "@equinor/eds-tokens-build";
import o from "path";
const b = "cpNchKjiIM19dPqTxE0fqg", u = "FQQqyumcpPQoiFRCjdS9GM", H = "eds", g = "spacing/", C = "typography/";
async function p({
  source: s,
  include: i = [],
  buildPath: r,
  destination: c,
  selector: h = ":root",
  prefix: l = H,
  transforms: E,
  filter: S,
  outputReferences: f = !0
}) {
  await new L({
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
            filter: S,
            destination: c,
            format: "css/variables",
            options: {
              selector: h,
              outputReferences: f
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
  cssBuildPath: h,
  transforms: l,
  prefix: E = H,
  filter: S,
  name: f,
  selector: P
}) {
  await new L({
    include: i,
    source: s,
    platforms: {
      ts: {
        transforms: ["name/constant"],
        buildPath: r,
        files: [
          {
            filter: S,
            destination: `spacing/${f}.js`,
            format: "javascript/es6"
          },
          {
            filter: S,
            format: "typescript/es6-declarations",
            destination: `spacing/${f}.d.ts`
          }
        ]
      },
      json: {
        buildPath: c,
        transforms: ["name/kebab"],
        files: [
          {
            filter: S,
            destination: `spacing/flat/${f}.json`,
            format: "json/flat"
          },
          {
            filter: S,
            destination: `spacing/nested/${f}.json`,
            format: "json/nested"
          }
        ]
      },
      css: {
        transformGroup: "css",
        prefix: E,
        buildPath: o.join(h, g),
        transforms: l,
        files: [
          {
            filter: S,
            destination: `${f}.css`,
            format: "css/variables",
            options: {
              selector: P,
              outputReferences: !1
            }
          }
        ]
      }
    }
  }).buildAllPlatforms();
}
async function Fo({
  tokensDir: s,
  cssBuildPath: i,
  cssTransforms: r
}) {
  const c = o.join(
    s,
    b,
    "👾 Primitives.Value.json"
  ), h = o.join(
    s,
    b,
    "⛔️ Figma.Value.json"
  ), l = o.join(
    s,
    u,
    "💎 Density.Spacious.json"
  ), E = o.join(
    s,
    u,
    "💎 Density.Comfortable.json"
  ), S = o.resolve(process.cwd(), "build"), f = o.join(S, "js"), P = o.join(S, "json"), $ = (t) => _(t, ["Density", "Spacious"]), v = (t) => _(t, ["Density", "Comfortable"]);
  await z({
    source: [l],
    include: [c, h],
    jsBuildPath: f,
    jsonBuildPath: P,
    cssBuildPath: i,
    transforms: r,
    filter: $,
    name: "spacious",
    selector: ':root, [data-density="spacious"]'
  }), await z({
    source: [E],
    include: [c, h],
    jsBuildPath: f,
    jsonBuildPath: P,
    cssBuildPath: i,
    transforms: r,
    filter: v,
    name: "comfortable",
    selector: '[data-density="comfortable"]'
  });
  const j = o.join(
    s,
    b,
    "⛔️ Figma.Value.json"
  ), D = o.join(
    s,
    u,
    "🪐 Space proportions.Squared.json"
  ), q = o.join(
    s,
    u,
    "🗣️ Semantic.Mode 1.json"
  ), O = o.join(
    s,
    u,
    "🪐 Container space.Default.json"
  ), y = o.join(
    s,
    u,
    "🪐 Page space.Default.json"
  ), n = o.join(s, u), V = [
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
  ], Y = o.join(n, "🅰️ Font weight.Normal.json"), x = o.join(
    n,
    "🅰️ Font baseline.Centred.json"
  ), K = o.join(n, "🅰️ Tracking.Normal.json"), Q = o.join(
    n,
    "🅰️ Line height.Default.json"
  ), Z = o.join(n, "〰️ Stroke.Thin.json"), W = o.join(
    n,
    "⭕️ Border radius.Rounded.json"
  ), B = o.join(n, "🖼️ Icon size.XS.json"), J = o.join(n, "📐 Size.XS.json"), R = o.join(
    n,
    "🪐 Horizontal gap.XS.json"
  ), w = o.join(n, "🪐 Vertical gap.XS.json"), k = o.join(
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
        u,
        `🪐 Space proportions.${t}.json`
      ), m = t === "Squared" ? ':root, [data-space-proportions="squared"]' : `[data-space-proportions="${e}"]`;
      return p({
        include: [
          c,
          j,
          l,
          R,
          w
        ],
        source: [a, O, y],
        buildPath: o.join(i, g),
        transforms: r,
        destination: `space-proportions-${e}.css`,
        selector: m,
        filter: (d) => !!(_(d, [t]) || d.path && d.path[0] === "Container" && d.path[1] === "Spacing" || d.path && d.path[0] === "Page" && d.path[1] === "Spacing")
      });
    })
  );
  const no = ["XS", "SM", "MD", "LG", "XL"];
  await Promise.all(
    no.map((t) => {
      const e = t.toLowerCase(), a = o.join(
        s,
        u,
        `🪐 Selectable space.${t}.json`
      ), m = t === "XS" ? ':root, [data-selectable-space="xs"]' : `[data-selectable-space="${e}"]`;
      return p({
        include: [
          c,
          j,
          l,
          D
        ],
        source: [a],
        buildPath: o.join(i, g),
        transforms: r,
        destination: `selectable-space-${e}.css`,
        selector: m,
        filter: (d) => _(d, [t])
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
  ], G = async (t, e) => {
    const a = e.toLowerCase(), m = o.join(
      s,
      u,
      `🪐 Horizontal ${t}.${e}.json`
    ), d = o.join(
      s,
      u,
      `🪐 Vertical ${t}.${e}.json`
    ), U = e === "XS" ? `:root, [data-horizontal-${t}="xs"]` : `[data-horizontal-${t}="${a}"]`, go = e === "XS" ? `:root, [data-vertical-${t}="xs"]` : `[data-vertical-${t}="${a}"]`, M = [
      c,
      j,
      l
    ];
    await p({
      include: M,
      source: [m],
      buildPath: o.join(i, g),
      transforms: r,
      destination: `generic-${t}-horizontal-${a}.css`,
      selector: U,
      filter: (A) => !!(A.path && A.path[0] === `generic-${t}-horizontal`)
    }), await p({
      include: M,
      source: [d],
      buildPath: o.join(i, g),
      transforms: r,
      destination: `generic-${t}-vertical-${a}.css`,
      selector: go,
      filter: (A) => !!(A.path && A.path[0] === `generic-${t}-vertical`)
    });
  };
  await Promise.all(
    eo.flatMap((t) => [
      G("gap", t),
      G("space", t)
    ])
  );
  const X = [
    c,
    j,
    l,
    D
  ];
  await p({
    include: X,
    source: [O],
    buildPath: o.join(i, g),
    transforms: r,
    destination: "container-space.css",
    selector: ":root, [data-space-proportions]",
    filter: (t) => !!(t.path && t.path[0] === "container-space")
  }), await p({
    include: X,
    source: [y],
    buildPath: o.join(i, g),
    transforms: r,
    destination: "page-space.css",
    selector: ":root, [data-space-proportions]",
    filter: (t) => !!(t.path && t.path[0] === "page-space")
  }), await p({
    include: [
      c,
      j,
      l,
      E,
      Z,
      W,
      B,
      J,
      ...V,
      ...N,
      F,
      Y,
      x,
      K,
      Q,
      R,
      w,
      k,
      oo
    ],
    source: [q],
    buildPath: o.join(i, g),
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
  ], lo = ["XS", "SM", "MD", "LG", "XL", "2XL"], po = ao.map(
    ({ mode: t, slug: e }) => p({
      include: [
        c,
        j,
        l
      ],
      source: [o.join(n, `🅰️ Font family.${t}.json`)],
      buildPath: o.join(i, C),
      transforms: r,
      destination: `font-family-${e}.css`,
      selector: `[data-font-family="${e}"]`,
      filter: (a) => _(a, [t])
    })
  ), jo = so.map(
    (t) => p({
      include: [
        c,
        j,
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
  ), uo = io.map(
    ({ mode: t, slug: e }) => p({
      include: [
        c,
        j,
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
  ), So = ro.map(
    ({ mode: t, slug: e }) => p({
      include: [
        c,
        j,
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
  ), fo = co.map(
    ({ mode: t, slug: e }) => p({
      include: [
        c,
        j,
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
  ), mo = lo.map((t) => {
    const e = t.toLowerCase(), a = t === "XS" ? ':root, [data-icon-size="xs"]' : `[data-icon-size="${e}"]`;
    return p({
      include: [
        c,
        j,
        l
      ],
      source: [o.join(n, `🖼️ Icon size.${t}.json`)],
      buildPath: o.join(i, g),
      transforms: r,
      destination: `icon-size-${e}.css`,
      selector: a,
      filter: (m) => !!(m.path && m.path[0] === "Icon")
    });
  });
  await Promise.all([
    ...po,
    ...jo,
    ...uo,
    ...So,
    ...fo,
    ...mo
  ]);
}
const T = `${process.cwd()}/build`, Io = `${T}/css`, Oo = `${T}/js`, yo = `${T}/json`;
L.registerTransform(ho);
L.registerTransform(Eo);
L.registerTransform(_o);
L.registerTransform(Lo);
async function bo() {
  const s = `${process.cwd()}/tokens`;
  console.info("Running Style Dictionary build script"), console.info("Tokens directory:", s), await Fo({
    tokensDir: s,
    cssBuildPath: Io,
    cssTransforms: [
      "name/kebab",
      Po,
      Ao,
      Co
    ]
  });
}
bo().then(() => {
  console.log("✅ Variables generated successfully");
}).catch((s) => {
  console.error("❌ Error generating color variables:", s);
});
export {
  Io as cssBuildPath,
  bo as generate,
  Oo as jsBuildPath,
  yo as jsonBuildPath
};
