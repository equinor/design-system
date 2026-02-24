import { StyleDictionary as T } from "style-dictionary-utils";
import { typescriptNestedFormat as B, includeTokenFilter as A, pxFormatted as Eo, pxTransform as Po, pxToRem as _o, fontQuote as Lo, PX_TO_REM_NAME as Ao, PX_FORMATTED_NAME as Fo, FONT_QUOTE_NAME as To } from "@equinor/eds-tokens-build";
import o from "path";
const $ = "cpNchKjiIM19dPqTxE0fqg", S = "FQQqyumcpPQoiFRCjdS9GM", V = "eds", E = "spacing/", F = "typography/";
async function u({
  source: e,
  include: i = [],
  buildPath: r,
  destination: c,
  selector: P = ":root",
  prefix: l = V,
  transforms: _,
  filter: g,
  outputReferences: f = !0,
  rootName: d,
  tsBuildPath: p
}) {
  const m = {
    css: {
      transformGroup: "css",
      prefix: l,
      buildPath: r,
      transforms: _,
      files: [
        {
          filter: g,
          destination: c,
          format: "css/variables",
          options: {
            selector: P,
            outputReferences: f
          }
        }
      ]
    }
  };
  if (d && p) {
    const y = c.replace(/\.css$/, ".ts");
    m.tsNested = {
      buildPath: p,
      files: [
        {
          filter: g,
          destination: y,
          format: "typescript/nested",
          options: { rootName: d }
        }
      ]
    };
  }
  await new T({
    include: i,
    source: e,
    platforms: m,
    ...d && {
      hooks: {
        formats: {
          "typescript/nested": B
        }
      }
    }
  }).buildAllPlatforms();
}
async function q({
  source: e,
  include: i = [],
  jsBuildPath: r,
  jsonBuildPath: c,
  cssBuildPath: P,
  tsBuildPath: l,
  transforms: _,
  prefix: g = V,
  filter: f,
  name: d,
  selector: p,
  rootName: m
}) {
  const b = {
    ts: {
      transforms: ["name/constant"],
      buildPath: r,
      files: [
        {
          filter: f,
          destination: `spacing/${d}.js`,
          format: "javascript/es6"
        },
        {
          filter: f,
          format: "typescript/es6-declarations",
          destination: `spacing/${d}.d.ts`
        }
      ]
    },
    json: {
      buildPath: c,
      transforms: ["name/kebab"],
      files: [
        {
          filter: f,
          destination: `spacing/flat/${d}.json`,
          format: "json/flat"
        },
        {
          filter: f,
          destination: `spacing/nested/${d}.json`,
          format: "json/nested"
        }
      ]
    },
    css: {
      transformGroup: "css",
      prefix: g,
      buildPath: o.join(P, E),
      transforms: _,
      files: [
        {
          filter: f,
          destination: `${d}.css`,
          format: "css/variables",
          options: {
            selector: p,
            outputReferences: !1
          }
        }
      ]
    }
  };
  l && (b.tsNested = {
    buildPath: l,
    files: [
      {
        filter: f,
        destination: `${d}.ts`,
        format: "typescript/nested",
        options: { rootName: m }
      }
    ]
  }), await new T({
    include: i,
    source: e,
    platforms: b,
    hooks: {
      formats: {
        "typescript/nested": B
      }
    }
  }).buildAllPlatforms();
}
async function bo({
  tokensDir: e,
  cssBuildPath: i,
  cssTransforms: r
}) {
  const c = o.join(
    e,
    $,
    "👾 Primitives.Value.json"
  ), P = o.join(
    e,
    $,
    "⛔️ Figma.Value.json"
  ), l = o.join(
    e,
    S,
    "💎 Density.Spacious.json"
  ), _ = o.join(
    e,
    S,
    "💎 Density.Comfortable.json"
  ), g = o.resolve(process.cwd(), "build"), f = o.join(g, "js"), d = o.join(g, "json"), p = o.join(
    g,
    "ts",
    E
  ), m = o.join(g, "ts", F), b = (t) => A(t, ["Density", "Spacious"]), y = (t) => A(t, ["Density", "Comfortable"]);
  await q({
    source: [l],
    include: [c, P],
    jsBuildPath: f,
    jsonBuildPath: d,
    cssBuildPath: i,
    transforms: r,
    filter: b,
    name: "spacious",
    selector: ':root, [data-density="spacious"]',
    rootName: "spacing",
    tsBuildPath: p
  }), await q({
    source: [_],
    include: [c, P],
    jsBuildPath: f,
    jsonBuildPath: d,
    cssBuildPath: i,
    transforms: r,
    filter: y,
    name: "comfortable",
    selector: '[data-density="comfortable"]',
    rootName: "spacing",
    tsBuildPath: p
  });
  const h = o.join(
    e,
    $,
    "⛔️ Figma.Value.json"
  ), O = o.join(
    e,
    S,
    "🪐 Space proportions.Squared.json"
  ), Y = o.join(
    e,
    S,
    "🗣️ Semantic.Mode 1.json"
  ), R = o.join(
    e,
    S,
    "🪐 Container space.Default.json"
  ), G = o.join(
    e,
    S,
    "🪐 Page space.Default.json"
  ), n = o.join(e, S), x = [
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
  ], I = o.join(n, "🅰️ Font size.XS.json"), N = o.join(
    n,
    "🅰️ Font family.UI Body.json"
  ), w = [
    o.join(n, "🅰️ Font family.Header.json"),
    o.join(n, "🅰️ Font family.UI and Body.json"),
    o.join(n, "🅰️ Font family.UI Body.json")
  ], K = o.join(n, "🅰️ Font weight.Normal.json"), Q = o.join(
    n,
    "🅰️ Font baseline.Centred.json"
  ), Z = o.join(n, "🅰️ Tracking.Normal.json"), W = o.join(
    n,
    "🅰️ Line height.Default.json"
  ), J = o.join(n, "〰️ Stroke.Thin.json"), k = o.join(
    n,
    "⭕️ Border radius.Rounded.json"
  ), oo = o.join(n, "🖼️ Icon size.XS.json"), to = o.join(n, "📐 Size.XS.json"), U = o.join(
    n,
    "🪐 Horizontal gap.XS.json"
  ), X = o.join(n, "🪐 Vertical gap.XS.json"), no = o.join(
    n,
    "🪐 Horizontal space.XS.json"
  ), ao = o.join(
    n,
    "🪐 Vertical space.XS.json"
  ), so = ["Squished", "Squared", "Stretched"];
  await Promise.all(
    so.map((t) => {
      const a = t.toLowerCase(), s = o.join(
        e,
        S,
        `🪐 Space proportions.${t}.json`
      ), L = t === "Squared" ? ':root, [data-space-proportions="squared"]' : `[data-space-proportions="${a}"]`;
      return u({
        include: [
          c,
          h,
          l,
          U,
          X
        ],
        source: [s, R, G],
        buildPath: o.join(i, E),
        transforms: r,
        destination: `space-proportions-${a}.css`,
        selector: L,
        filter: (j) => !!(A(j, [t]) || j.path && j.path[0] === "Container" && j.path[1] === "Spacing" || j.path && j.path[0] === "Page" && j.path[1] === "Spacing"),
        rootName: "spacing",
        tsBuildPath: p
      });
    })
  );
  const eo = ["XS", "SM", "MD", "LG", "XL"];
  await Promise.all(
    eo.map((t) => {
      const a = t.toLowerCase(), s = o.join(
        e,
        S,
        `🪐 Selectable space.${t}.json`
      ), L = t === "XS" ? ':root, [data-selectable-space="xs"]' : `[data-selectable-space="${a}"]`;
      return u({
        include: [
          c,
          h,
          l,
          O
        ],
        source: [s],
        buildPath: o.join(i, E),
        transforms: r,
        destination: `selectable-space-${a}.css`,
        selector: L,
        filter: (j) => A(j, [t]),
        rootName: "spacing",
        tsBuildPath: p
      });
    })
  );
  const io = [
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
  ], M = async (t, a) => {
    const s = a.toLowerCase(), L = o.join(
      e,
      S,
      `🪐 Horizontal ${t}.${a}.json`
    ), j = o.join(
      e,
      S,
      `🪐 Vertical ${t}.${a}.json`
    ), v = a === "XS" ? `:root, [data-horizontal-${t}="xs"]` : `[data-horizontal-${t}="${s}"]`, go = a === "XS" ? `:root, [data-vertical-${t}="xs"]` : `[data-vertical-${t}="${s}"]`, z = [
      c,
      h,
      l
    ];
    await u({
      include: z,
      source: [L],
      buildPath: o.join(i, E),
      transforms: r,
      destination: `generic-${t}-horizontal-${s}.css`,
      selector: v,
      filter: (C) => !!(C.path && C.path[0] === `generic-${t}-horizontal`),
      rootName: "spacing",
      tsBuildPath: p
    }), await u({
      include: z,
      source: [j],
      buildPath: o.join(i, E),
      transforms: r,
      destination: `generic-${t}-vertical-${s}.css`,
      selector: go,
      filter: (C) => !!(C.path && C.path[0] === `generic-${t}-vertical`),
      rootName: "spacing",
      tsBuildPath: p
    });
  };
  await Promise.all(
    io.flatMap((t) => [
      M("gap", t),
      M("space", t)
    ])
  );
  const H = [
    c,
    h,
    l,
    O
  ];
  await u({
    include: H,
    source: [R],
    buildPath: o.join(i, E),
    transforms: r,
    destination: "container-space.css",
    selector: ":root, [data-space-proportions]",
    filter: (t) => !!(t.path && t.path[0] === "container-space"),
    rootName: "spacing",
    tsBuildPath: p
  }), await u({
    include: H,
    source: [G],
    buildPath: o.join(i, E),
    transforms: r,
    destination: "page-space.css",
    selector: ":root, [data-space-proportions]",
    filter: (t) => !!(t.path && t.path[0] === "page-space"),
    rootName: "spacing",
    tsBuildPath: p
  }), await u({
    include: [
      c,
      h,
      l,
      _,
      J,
      k,
      oo,
      to,
      ...x,
      ...w,
      I,
      K,
      Q,
      Z,
      W,
      U,
      X,
      no,
      ao
    ],
    source: [Y],
    buildPath: o.join(i, E),
    transforms: r,
    destination: "semantic-spacing-gap.css",
    filter: (t) => {
      if (!t.path) return !1;
      const a = t.path[0], s = t.path[1];
      return a === "Selectable" && (s === "Gap horizontal" || s === "Gap vertical") || a === "Container" && (s === "Gap horizontal" || s === "Gap vertical") || a === "Page" && (s === "Gap horizontal" || s === "Gap vertical");
    },
    rootName: "spacing",
    tsBuildPath: p
  });
  const ro = [
    { mode: "Header", slug: "header" },
    { mode: "UI Body", slug: "ui" }
  ], co = [
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
  ], lo = [
    { mode: "Lighter", slug: "lighter" },
    { mode: "Normal", slug: "normal" },
    { mode: "Bolder", slug: "bolder" }
  ], po = [
    { mode: "Default", slug: "default" },
    { mode: "Squished", slug: "squished" }
  ], jo = [
    { mode: "Tight", slug: "tight" },
    { mode: "Normal", slug: "normal" },
    { mode: "Wide", slug: "wide" },
    { mode: "Loose", slug: "loose" }
  ], uo = ro.map(
    ({ mode: t, slug: a }) => u({
      include: [
        c,
        h,
        l
      ],
      source: [o.join(n, `🅰️ Font family.${t}.json`)],
      buildPath: o.join(i, F),
      transforms: r,
      destination: `font-family-${a}.css`,
      selector: `[data-font-family="${a}"]`,
      filter: (s) => A(s, [t]),
      rootName: "typography",
      tsBuildPath: m
    })
  ), fo = co.map(
    (t) => u({
      include: [
        c,
        h,
        l,
        ...w
      ],
      source: [o.join(n, `🅰️ Font size.${t}.json`)],
      buildPath: o.join(i, F),
      transforms: r,
      destination: `font-size-${t.toLowerCase()}.css`,
      selector: `[data-font-size="${t.toLowerCase()}"]`,
      filter: (a) => A(a, ["Font size", t]),
      rootName: "typography",
      tsBuildPath: m
    })
  ), So = lo.map(
    ({ mode: t, slug: a }) => u({
      include: [
        c,
        h,
        l,
        N,
        I
      ],
      source: [o.join(n, `🅰️ Font weight.${t}.json`)],
      buildPath: o.join(i, F),
      transforms: r,
      destination: `font-weight-${a}.css`,
      selector: `[data-font-weight="${a}"]`,
      filter: (s) => !!(s.path && s.path[1] === "font-weight"),
      rootName: "typography",
      tsBuildPath: m
    })
  ), mo = po.map(
    ({ mode: t, slug: a }) => u({
      include: [
        c,
        h,
        l,
        N,
        I
      ],
      source: [o.join(n, `🅰️ Line height.${t}.json`)],
      buildPath: o.join(i, F),
      transforms: r,
      destination: `line-height-${a}.css`,
      selector: `[data-line-height="${a}"]`,
      filter: (s) => !!(s.path && s.path[1] === "line-height"),
      rootName: "typography",
      tsBuildPath: m
    })
  ), ho = jo.map(
    ({ mode: t, slug: a }) => u({
      include: [
        c,
        h,
        l,
        N,
        I
      ],
      source: [o.join(n, `🅰️ Tracking.${t}.json`)],
      buildPath: o.join(i, F),
      transforms: r,
      destination: `tracking-${a}.css`,
      selector: `[data-tracking="${a}"]`,
      filter: (s) => !!(s.path && s.path[1] === "tracking"),
      rootName: "typography",
      tsBuildPath: m
    })
  );
  await Promise.all([
    ...uo,
    ...fo,
    ...So,
    ...mo,
    ...ho
  ]);
}
const D = `${process.cwd()}/build`, Co = `${D}/css`, Do = `${D}/js`, Oo = `${D}/json`;
T.registerTransform(Eo);
T.registerTransform(Po);
T.registerTransform(_o);
T.registerTransform(Lo);
async function yo() {
  const e = `${process.cwd()}/tokens`;
  console.info("Running Style Dictionary build script"), console.info("Tokens directory:", e), await bo({
    tokensDir: e,
    cssBuildPath: Co,
    cssTransforms: [
      "name/kebab",
      Ao,
      Fo,
      To
    ]
  });
}
yo().then(() => {
  console.log("✅ Variables generated successfully");
}).catch((e) => {
  console.error("❌ Error generating color variables:", e);
});
export {
  Co as cssBuildPath,
  yo as generate,
  Do as jsBuildPath,
  Oo as jsonBuildPath
};
