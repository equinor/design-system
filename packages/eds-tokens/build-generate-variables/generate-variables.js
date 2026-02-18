import { StyleDictionary as F } from "style-dictionary-utils";
import { typescriptNestedFormat as go, includeTokenFilter as L, pxFormatted as ho, pxTransform as Eo, pxToRem as _o, fontQuote as Po, PX_TO_REM_NAME as Lo, PX_FORMATTED_NAME as Ao, FONT_QUOTE_NAME as Fo } from "@equinor/eds-tokens-build";
import o from "path";
const y = "cpNchKjiIM19dPqTxE0fqg", S = "FQQqyumcpPQoiFRCjdS9GM", q = "eds", h = "spacing/", A = "typography/";
async function u({
  source: s,
  include: i = [],
  buildPath: r,
  destination: c,
  selector: E = ":root",
  prefix: l = q,
  transforms: _,
  filter: p,
  outputReferences: f = !0,
  rootName: g,
  tsBuildPath: m
}) {
  const b = {
    css: {
      transformGroup: "css",
      prefix: l,
      buildPath: r,
      transforms: _,
      files: [
        {
          filter: p,
          destination: c,
          format: "css/variables",
          options: {
            selector: E,
            outputReferences: f
          }
        }
      ]
    }
  };
  if (g && m) {
    const d = c.replace(/\.css$/, ".ts");
    b.tsNested = {
      buildPath: m,
      files: [
        {
          filter: p,
          destination: d,
          format: "typescript/nested",
          options: { rootName: g }
        }
      ]
    };
  }
  await new F({
    include: i,
    source: s,
    platforms: b,
    ...g && {
      hooks: {
        formats: {
          "typescript/nested": go
        }
      }
    }
  }).buildAllPlatforms();
}
async function z({
  source: s,
  include: i = [],
  jsBuildPath: r,
  jsonBuildPath: c,
  cssBuildPath: E,
  transforms: l,
  prefix: _ = q,
  filter: p,
  name: f,
  selector: g
}) {
  await new F({
    include: i,
    source: s,
    platforms: {
      ts: {
        transforms: ["name/constant"],
        buildPath: r,
        files: [
          {
            filter: p,
            destination: `spacing/${f}.js`,
            format: "javascript/es6"
          },
          {
            filter: p,
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
            filter: p,
            destination: `spacing/flat/${f}.json`,
            format: "json/flat"
          },
          {
            filter: p,
            destination: `spacing/nested/${f}.json`,
            format: "json/nested"
          }
        ]
      },
      css: {
        transformGroup: "css",
        prefix: _,
        buildPath: o.join(E, h),
        transforms: l,
        files: [
          {
            filter: p,
            destination: `${f}.css`,
            format: "css/variables",
            options: {
              selector: g,
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
    y,
    "👾 Primitives.Value.json"
  ), E = o.join(
    s,
    y,
    "⛔️ Figma.Value.json"
  ), l = o.join(
    s,
    S,
    "💎 Density.Spacious.json"
  ), _ = o.join(
    s,
    S,
    "💎 Density.Comfortable.json"
  ), p = o.resolve(process.cwd(), "build"), f = o.join(p, "js"), g = o.join(p, "json"), m = o.join(p, "ts", A), b = (t) => L(t, ["Density", "Spacious"]), N = (t) => L(t, ["Density", "Comfortable"]);
  await z({
    source: [l],
    include: [c, E],
    jsBuildPath: f,
    jsonBuildPath: g,
    cssBuildPath: i,
    transforms: r,
    filter: b,
    name: "spacious",
    selector: ':root, [data-density="spacious"]'
  }), await z({
    source: [_],
    include: [c, E],
    jsBuildPath: f,
    jsonBuildPath: g,
    cssBuildPath: i,
    transforms: r,
    filter: N,
    name: "comfortable",
    selector: '[data-density="comfortable"]'
  });
  const d = o.join(
    s,
    y,
    "⛔️ Figma.Value.json"
  ), D = o.join(
    s,
    S,
    "🪐 Space proportions.Squared.json"
  ), V = o.join(
    s,
    S,
    "🗣️ Semantic.Mode 1.json"
  ), O = o.join(
    s,
    S,
    "🪐 Container space.Default.json"
  ), R = o.join(
    s,
    S,
    "🪐 Page space.Default.json"
  ), n = o.join(s, S), Y = [
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
  ], I = o.join(n, "🅰️ Font size.XS.json"), T = o.join(
    n,
    "🅰️ Font family.UI Body.json"
  ), G = [
    o.join(n, "🅰️ Font family.Header.json"),
    o.join(n, "🅰️ Font family.UI and Body.json"),
    o.join(n, "🅰️ Font family.UI Body.json")
  ], x = o.join(n, "🅰️ Font weight.Normal.json"), K = o.join(
    n,
    "🅰️ Font baseline.Centred.json"
  ), Q = o.join(n, "🅰️ Tracking.Normal.json"), Z = o.join(
    n,
    "🅰️ Line height.Default.json"
  ), W = o.join(n, "〰️ Stroke.Thin.json"), B = o.join(
    n,
    "⭕️ Border radius.Rounded.json"
  ), J = o.join(n, "🖼️ Icon size.XS.json"), k = o.join(n, "📐 Size.XS.json"), w = o.join(
    n,
    "🪐 Horizontal gap.XS.json"
  ), U = o.join(n, "🪐 Vertical gap.XS.json"), oo = o.join(
    n,
    "🪐 Horizontal space.XS.json"
  ), to = o.join(
    n,
    "🪐 Vertical space.XS.json"
  ), no = ["Squished", "Squared", "Stretched"];
  await Promise.all(
    no.map((t) => {
      const e = t.toLowerCase(), a = o.join(
        s,
        S,
        `🪐 Space proportions.${t}.json`
      ), P = t === "Squared" ? ':root, [data-space-proportions="squared"]' : `[data-space-proportions="${e}"]`;
      return u({
        include: [
          c,
          d,
          l,
          w,
          U
        ],
        source: [a, O, R],
        buildPath: o.join(i, h),
        transforms: r,
        destination: `space-proportions-${e}.css`,
        selector: P,
        filter: (j) => !!(L(j, [t]) || j.path && j.path[0] === "Container" && j.path[1] === "Spacing" || j.path && j.path[0] === "Page" && j.path[1] === "Spacing")
      });
    })
  );
  const eo = ["XS", "SM", "MD", "LG", "XL"];
  await Promise.all(
    eo.map((t) => {
      const e = t.toLowerCase(), a = o.join(
        s,
        S,
        `🪐 Selectable space.${t}.json`
      ), P = t === "XS" ? ':root, [data-selectable-space="xs"]' : `[data-selectable-space="${e}"]`;
      return u({
        include: [
          c,
          d,
          l,
          D
        ],
        source: [a],
        buildPath: o.join(i, h),
        transforms: r,
        destination: `selectable-space-${e}.css`,
        selector: P,
        filter: (j) => L(j, [t])
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
  ], X = async (t, e) => {
    const a = e.toLowerCase(), P = o.join(
      s,
      S,
      `🪐 Horizontal ${t}.${e}.json`
    ), j = o.join(
      s,
      S,
      `🪐 Vertical ${t}.${e}.json`
    ), H = e === "XS" ? `:root, [data-horizontal-${t}="xs"]` : `[data-horizontal-${t}="${a}"]`, mo = e === "XS" ? `:root, [data-vertical-${t}="xs"]` : `[data-vertical-${t}="${a}"]`, v = [
      c,
      d,
      l
    ];
    await u({
      include: v,
      source: [P],
      buildPath: o.join(i, h),
      transforms: r,
      destination: `generic-${t}-horizontal-${a}.css`,
      selector: H,
      filter: (C) => !!(C.path && C.path[0] === `generic-${t}-horizontal`)
    }), await u({
      include: v,
      source: [j],
      buildPath: o.join(i, h),
      transforms: r,
      destination: `generic-${t}-vertical-${a}.css`,
      selector: mo,
      filter: (C) => !!(C.path && C.path[0] === `generic-${t}-vertical`)
    });
  };
  await Promise.all(
    ao.flatMap((t) => [
      X("gap", t),
      X("space", t)
    ])
  );
  const M = [
    c,
    d,
    l,
    D
  ];
  await u({
    include: M,
    source: [O],
    buildPath: o.join(i, h),
    transforms: r,
    destination: "container-space.css",
    selector: ":root, [data-space-proportions]",
    filter: (t) => !!(t.path && t.path[0] === "container-space")
  }), await u({
    include: M,
    source: [R],
    buildPath: o.join(i, h),
    transforms: r,
    destination: "page-space.css",
    selector: ":root, [data-space-proportions]",
    filter: (t) => !!(t.path && t.path[0] === "page-space")
  }), await u({
    include: [
      c,
      d,
      l,
      _,
      W,
      B,
      J,
      k,
      ...Y,
      ...G,
      I,
      x,
      K,
      Q,
      Z,
      w,
      U,
      oo,
      to
    ],
    source: [V],
    buildPath: o.join(i, h),
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
    ({ mode: t, slug: e }) => u({
      include: [
        c,
        d,
        l
      ],
      source: [o.join(n, `🅰️ Font family.${t}.json`)],
      buildPath: o.join(i, A),
      transforms: r,
      destination: `font-family-${e}.css`,
      selector: `[data-font-family="${e}"]`,
      filter: (a) => L(a, [t]),
      rootName: "typography",
      tsBuildPath: m
    })
  ), jo = io.map(
    (t) => u({
      include: [
        c,
        d,
        l,
        ...G
      ],
      source: [o.join(n, `🅰️ Font size.${t}.json`)],
      buildPath: o.join(i, A),
      transforms: r,
      destination: `font-size-${t.toLowerCase()}.css`,
      selector: `[data-font-size="${t.toLowerCase()}"]`,
      filter: (e) => L(e, ["Font size", t]),
      rootName: "typography",
      tsBuildPath: m
    })
  ), uo = ro.map(
    ({ mode: t, slug: e }) => u({
      include: [
        c,
        d,
        l,
        T,
        I
      ],
      source: [o.join(n, `🅰️ Font weight.${t}.json`)],
      buildPath: o.join(i, A),
      transforms: r,
      destination: `font-weight-${e}.css`,
      selector: `[data-font-weight="${e}"]`,
      filter: (a) => !!(a.path && a.path[1] === "font-weight"),
      rootName: "typography",
      tsBuildPath: m
    })
  ), So = co.map(
    ({ mode: t, slug: e }) => u({
      include: [
        c,
        d,
        l,
        T,
        I
      ],
      source: [o.join(n, `🅰️ Line height.${t}.json`)],
      buildPath: o.join(i, A),
      transforms: r,
      destination: `line-height-${e}.css`,
      selector: `[data-line-height="${e}"]`,
      filter: (a) => !!(a.path && a.path[1] === "line-height"),
      rootName: "typography",
      tsBuildPath: m
    })
  ), fo = lo.map(
    ({ mode: t, slug: e }) => u({
      include: [
        c,
        d,
        l,
        T,
        I
      ],
      source: [o.join(n, `🅰️ Tracking.${t}.json`)],
      buildPath: o.join(i, A),
      transforms: r,
      destination: `tracking-${e}.css`,
      selector: `[data-tracking="${e}"]`,
      filter: (a) => !!(a.path && a.path[1] === "tracking"),
      rootName: "typography",
      tsBuildPath: m
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
const $ = `${process.cwd()}/build`, bo = `${$}/css`, No = `${$}/js`, Do = `${$}/json`;
F.registerTransform(ho);
F.registerTransform(Eo);
F.registerTransform(_o);
F.registerTransform(Po);
async function Io() {
  const s = `${process.cwd()}/tokens`;
  console.info("Running Style Dictionary build script"), console.info("Tokens directory:", s), await Co({
    tokensDir: s,
    cssBuildPath: bo,
    cssTransforms: [
      "name/kebab",
      Lo,
      Ao,
      Fo
    ]
  });
}
Io().then(() => {
  console.log("✅ Variables generated successfully");
}).catch((s) => {
  console.error("❌ Error generating color variables:", s);
});
export {
  bo as cssBuildPath,
  Io as generate,
  No as jsBuildPath,
  Do as jsonBuildPath
};
