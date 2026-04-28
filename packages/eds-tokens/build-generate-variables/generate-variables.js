import { StyleDictionary as L } from "style-dictionary-utils";
import { typescriptNestedFormat as K, includeTokenFilter as N, pxFormatted as To, pxTransform as Ao, pxToRem as Co, fontQuote as yo, PX_TO_REM_NAME as Io, PX_FORMATTED_NAME as No, FONT_QUOTE_NAME as Oo } from "@equinor/eds-tokens-build";
import o from "path";
import wo from "os";
import A from "fs";
const w = "cpNchKjiIM19dPqTxE0fqg", f = "FQQqyumcpPQoiFRCjdS9GM", Q = "eds", _ = "spacing/", F = "typography/";
async function g({
  source: i,
  include: c = [],
  buildPath: l,
  destination: a,
  selector: E = ":root",
  prefix: p = Q,
  transforms: b,
  filter: r,
  outputReferences: d = !0,
  rootName: u,
  tsBuildPath: m
}) {
  const h = {
    css: {
      transformGroup: "css",
      prefix: p,
      buildPath: l,
      transforms: b,
      files: [
        {
          filter: r,
          destination: a,
          format: "css/variables",
          options: {
            selector: E,
            outputReferences: d
          }
        }
      ]
    }
  };
  if (u && m) {
    const C = a.replace(/\.css$/, ".ts");
    h.tsNested = {
      buildPath: m,
      files: [
        {
          filter: r,
          destination: C,
          format: "typescript/nested",
          options: { rootName: u }
        }
      ]
    };
  }
  await new L({
    include: c,
    source: i,
    platforms: h,
    ...u && {
      hooks: {
        formats: {
          "typescript/nested": K
        }
      }
    }
  }).buildAllPlatforms();
}
async function V({
  source: i,
  include: c = [],
  jsBuildPath: l,
  jsonBuildPath: a,
  cssBuildPath: E,
  tsBuildPath: p,
  transforms: b,
  prefix: r = Q,
  filter: d,
  name: u,
  selector: m,
  rootName: h
}) {
  const $ = {
    ts: {
      transforms: ["name/constant"],
      buildPath: l,
      files: [
        {
          filter: d,
          destination: `spacing/${u}.js`,
          format: "javascript/es6"
        },
        {
          filter: d,
          format: "typescript/es6-declarations",
          destination: `spacing/${u}.d.ts`
        }
      ]
    },
    json: {
      buildPath: a,
      transforms: ["name/kebab"],
      files: [
        {
          filter: d,
          destination: `spacing/flat/${u}.json`,
          format: "json/flat"
        },
        {
          filter: d,
          destination: `spacing/nested/${u}.json`,
          format: "json/nested"
        }
      ]
    },
    css: {
      transformGroup: "css",
      prefix: r,
      buildPath: o.join(E, _),
      transforms: b,
      files: [
        {
          filter: d,
          destination: `${u}.css`,
          format: "css/variables",
          options: {
            selector: m,
            outputReferences: !1
          }
        }
      ]
    }
  };
  p && ($.tsNested = {
    buildPath: p,
    files: [
      {
        filter: d,
        destination: `${u}.ts`,
        format: "typescript/nested",
        options: { rootName: h }
      }
    ]
  }), await new L({
    include: c,
    source: i,
    platforms: $,
    hooks: {
      formats: {
        "typescript/nested": K
      }
    }
  }).buildAllPlatforms();
}
function Do() {
  const i = [
    "none",
    "4xs",
    "3xs",
    "2xs",
    "xs",
    "sm",
    "md",
    "lg",
    "xl",
    "2xl",
    "3xl"
  ], c = ["xs", "sm", "md", "lg", "xl"], l = ["squished", "squared", "stretched"], a = (r) => ({
    $type: "number",
    $value: r
  }), E = () => Object.fromEntries(
    i.map((r) => [
      r,
      {
        horizontal: a(
          r === "none" ? 0 : `{spacing.horizontal.${r}}`
        ),
        vertical: a(r === "none" ? 0 : `{spacing.vertical.${r}}`)
      }
    ])
  ), p = () => Object.fromEntries(
    l.map((r) => [
      r,
      Object.fromEntries(
        c.map((d) => [
          d,
          {
            horizontal: a(`{spacing.inset.${d}.horizontal}`),
            vertical: a(`{spacing.inset.${d}.vertical-${r}}`)
          }
        ])
      )
    ])
  ), b = () => Object.fromEntries(
    c.map((r) => [
      r,
      {
        horizontal: a(`{spacing.inset.${r}.horizontal}`),
        vertical: a(`{spacing.inset.${r}.vertical-squared}`)
      }
    ])
  );
  return {
    generic: {
      gap: E(),
      space: E()
    },
    "spacing-proportions": p(),
    "selectable-space": b(),
    "container-space": {
      horizontal: a("{spacing.inset.md.horizontal}"),
      vertical: a("{spacing.inset.md.vertical-squared}")
    },
    "page-space": {
      horizontal: a("{spacing.inset.xl.horizontal}"),
      vertical: a("{spacing.inset.xl.vertical-squared}")
    }
  };
}
async function Ro({
  tokensDir: i,
  cssBuildPath: c,
  cssTransforms: l
}) {
  const a = o.join(
    i,
    w,
    "👾 Primitives.Value.json"
  ), E = o.join(
    i,
    w,
    "⛔️ Figma.Value.json"
  ), p = o.join(
    i,
    f,
    "💎 Density.Spacious.json"
  ), b = o.join(
    i,
    f,
    "💎 Density.Comfortable.json"
  ), r = o.resolve(process.cwd(), "build"), d = o.join(r, "js"), u = o.join(r, "json"), m = o.join(
    r,
    "ts",
    _
  ), h = o.join(r, "ts", F), $ = await A.promises.readdir(m).catch(() => []);
  for (const t of $)
    t.endsWith(".ts") && t !== "spacious.ts" && t !== "comfortable.ts" && t !== "index.ts" && await A.promises.unlink(o.join(m, t));
  const C = Do(), y = o.join(wo.tmpdir(), "eds-aggregated-spacing.json");
  await A.promises.writeFile(y, JSON.stringify(C, null, 2));
  const W = [
    "documentation",
    "padding-centred",
    "padding-baselined",
    "cap-height",
    "cap-rounded"
  ], R = (t) => (n) => {
    const s = n.name.toLowerCase();
    return W.some((P) => s.includes(P)) || s.includes("-container") && !s.startsWith("container-space") ? !1 : n.filePath.includes(t) || n.filePath.includes("eds-aggregated-spacing");
  }, B = R("Spacious"), Z = R("Comfortable");
  await V({
    source: [p, y],
    include: [a, E],
    jsBuildPath: d,
    jsonBuildPath: u,
    cssBuildPath: c,
    transforms: l,
    filter: B,
    name: "spacious",
    selector: ':root, [data-density="spacious"]',
    rootName: "spacing",
    tsBuildPath: m
  }), await V({
    source: [b, y],
    include: [a, E],
    jsBuildPath: d,
    jsonBuildPath: u,
    cssBuildPath: c,
    transforms: l,
    filter: Z,
    name: "comfortable",
    selector: '[data-density="comfortable"]',
    rootName: "spacing",
    tsBuildPath: m
  }), await A.promises.unlink(y);
  const J = [
    "/**",
    " * Do not edit directly, this file was auto-generated.",
    " */",
    "",
    "export { spacing as spacious } from './spacious'",
    "export { spacing as comfortable } from './comfortable'",
    ""
  ].join(`
`);
  await A.promises.writeFile(o.join(m, "index.ts"), J);
  const S = o.join(
    i,
    w,
    "⛔️ Figma.Value.json"
  ), G = o.join(
    i,
    f,
    "🪐 Space proportions.Squared.json"
  ), k = o.join(
    i,
    f,
    "🗣️ Semantic.Mode 1.json"
  ), U = o.join(
    i,
    f,
    "🪐 Container space.Default.json"
  ), X = o.join(
    i,
    f,
    "🪐 Page space.Default.json"
  ), e = o.join(i, f), oo = [
    o.join(e, "🪐 Container space.Default.json"),
    o.join(e, "🪐 Page space.Default.json"),
    o.join(e, "🪐 Selectable space.XS.json"),
    o.join(e, "🪐 Selectable space.SM.json"),
    o.join(e, "🪐 Selectable space.MD.json"),
    o.join(e, "🪐 Selectable space.LG.json"),
    o.join(e, "🪐 Selectable space.XL.json"),
    o.join(e, "🪐 Space proportions.Squared.json"),
    o.join(e, "🪐 Space proportions.Squished.json"),
    o.join(e, "🪐 Space proportions.Stretched.json")
  ], I = o.join(e, "🅰️ Font size.XS.json"), O = o.join(
    e,
    "🅰️ Font family.UI Body.json"
  ), v = [
    o.join(e, "🅰️ Font family.Header.json"),
    o.join(e, "🅰️ Font family.UI and Body.json"),
    o.join(e, "🅰️ Font family.UI Body.json")
  ], to = o.join(e, "🅰️ Font weight.Normal.json"), no = o.join(
    e,
    "🅰️ Font baseline.Centred.json"
  ), eo = o.join(e, "🅰️ Tracking.Normal.json"), so = o.join(
    e,
    "🅰️ Line height.Default.json"
  ), ao = o.join(e, "〰️ Stroke.Thin.json"), io = o.join(
    e,
    "⭕️ Border radius.Rounded.json"
  ), ro = o.join(e, "🖼️ Icon size.XS.json"), co = o.join(e, "📐 Size.XS.json"), z = o.join(
    e,
    "🪐 Horizontal gap.XS.json"
  ), M = o.join(e, "🪐 Vertical gap.XS.json"), lo = o.join(
    e,
    "🪐 Horizontal space.XS.json"
  ), po = o.join(
    e,
    "🪐 Vertical space.XS.json"
  ), uo = ["Squished", "Squared", "Stretched"];
  await Promise.all(
    uo.map((t) => {
      const n = t.toLowerCase(), s = o.join(
        i,
        f,
        `🪐 Space proportions.${t}.json`
      ), P = t === "Squared" ? ':root, [data-space-proportions="squared"]' : `[data-space-proportions="${n}"]`;
      return g({
        include: [
          a,
          S,
          p,
          z,
          M
        ],
        source: [s, U, X],
        buildPath: o.join(c, _),
        transforms: l,
        destination: `space-proportions-${n}.css`,
        selector: P,
        filter: (j) => !!(N(j, [t]) || j.path && j.path[0] === "Container" && j.path[1] === "Spacing" || j.path && j.path[0] === "Page" && j.path[1] === "Spacing")
      });
    })
  );
  const jo = ["XS", "SM", "MD", "LG", "XL"];
  await Promise.all(
    jo.map((t) => {
      const n = t.toLowerCase(), s = o.join(
        i,
        f,
        `🪐 Selectable space.${t}.json`
      ), P = t === "XS" ? ':root, [data-selectable-space="xs"]' : `[data-selectable-space="${n}"]`;
      return g({
        include: [
          a,
          S,
          p,
          G
        ],
        source: [s],
        buildPath: o.join(c, _),
        transforms: l,
        destination: `selectable-space-${n}.css`,
        selector: P,
        filter: (j) => N(j, [t])
      });
    })
  );
  const go = [
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
  ], x = async (t, n) => {
    const s = n.toLowerCase(), P = o.join(
      i,
      f,
      `🪐 Horizontal ${t}.${n}.json`
    ), j = o.join(
      i,
      f,
      `🪐 Vertical ${t}.${n}.json`
    ), H = n === "XS" ? `:root, [data-horizontal-${t}="xs"]` : `[data-horizontal-${t}="${s}"]`, $o = n === "XS" ? `:root, [data-vertical-${t}="xs"]` : `[data-vertical-${t}="${s}"]`, Y = [
      a,
      S,
      p
    ];
    await g({
      include: Y,
      source: [P],
      buildPath: o.join(c, _),
      transforms: l,
      destination: `generic-${t}-horizontal-${s}.css`,
      selector: H,
      filter: (T) => !!(T.path && T.path[0] === `generic-${t}-horizontal`)
    }), await g({
      include: Y,
      source: [j],
      buildPath: o.join(c, _),
      transforms: l,
      destination: `generic-${t}-vertical-${s}.css`,
      selector: $o,
      filter: (T) => !!(T.path && T.path[0] === `generic-${t}-vertical`)
    });
  };
  await Promise.all(
    go.flatMap((t) => [
      x("gap", t),
      x("space", t)
    ])
  );
  const q = [
    a,
    S,
    p,
    G
  ];
  await g({
    include: q,
    source: [U],
    buildPath: o.join(c, _),
    transforms: l,
    destination: "container-space.css",
    selector: ":root, [data-space-proportions]",
    filter: (t) => !!(t.path && t.path[0] === "container-space")
  }), await g({
    include: q,
    source: [X],
    buildPath: o.join(c, _),
    transforms: l,
    destination: "page-space.css",
    selector: ":root, [data-space-proportions]",
    filter: (t) => !!(t.path && t.path[0] === "page-space")
  }), await g({
    include: [
      a,
      S,
      p,
      b,
      ao,
      io,
      ro,
      co,
      ...oo,
      ...v,
      I,
      to,
      no,
      eo,
      so,
      z,
      M,
      lo,
      po
    ],
    source: [k],
    buildPath: o.join(c, _),
    transforms: l,
    destination: "semantic-spacing-gap.css",
    filter: (t) => {
      if (!t.path) return !1;
      const n = t.path[0], s = t.path[1];
      return n === "Selectable" && (s === "Gap horizontal" || s === "Gap vertical") || n === "Container" && (s === "Gap horizontal" || s === "Gap vertical") || n === "Page" && (s === "Gap horizontal" || s === "Gap vertical");
    }
  });
  const fo = [
    { mode: "Header", slug: "header" },
    { mode: "UI Body", slug: "ui" }
  ], mo = [
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
  ], ho = [
    { mode: "Lighter", slug: "lighter" },
    { mode: "Normal", slug: "normal" },
    { mode: "Bolder", slug: "bolder" }
  ], So = [
    { mode: "Default", slug: "default" },
    { mode: "Squished", slug: "squished" }
  ], Eo = [
    { mode: "Tight", slug: "tight" },
    { mode: "Normal", slug: "normal" },
    { mode: "Wide", slug: "wide" },
    { mode: "Loose", slug: "loose" }
  ], _o = fo.map(
    ({ mode: t, slug: n }) => g({
      include: [
        a,
        S,
        p
      ],
      source: [o.join(e, `🅰️ Font family.${t}.json`)],
      buildPath: o.join(c, F),
      transforms: l,
      destination: `font-family-${n}.css`,
      selector: `[data-font-family="${n}"]`,
      filter: (s) => N(s, [t]),
      rootName: "typography",
      tsBuildPath: h
    })
  ), bo = mo.map(
    (t) => g({
      include: [
        a,
        S,
        p,
        ...v
      ],
      source: [o.join(e, `🅰️ Font size.${t}.json`)],
      buildPath: o.join(c, F),
      transforms: l,
      destination: `font-size-${t.toLowerCase()}.css`,
      selector: `[data-font-size="${t.toLowerCase()}"]`,
      filter: (n) => N(n, ["Font size", t]),
      rootName: "typography",
      tsBuildPath: h
    })
  ), Po = ho.map(
    ({ mode: t, slug: n }) => g({
      include: [
        a,
        S,
        p,
        O,
        I
      ],
      source: [o.join(e, `🅰️ Font weight.${t}.json`)],
      buildPath: o.join(c, F),
      transforms: l,
      destination: `font-weight-${n}.css`,
      selector: `[data-font-weight="${n}"]`,
      filter: (s) => !!(s.path && s.path[1] === "font-weight"),
      rootName: "typography",
      tsBuildPath: h
    })
  ), Fo = So.map(
    ({ mode: t, slug: n }) => g({
      include: [
        a,
        S,
        p,
        O,
        I
      ],
      source: [o.join(e, `🅰️ Line height.${t}.json`)],
      buildPath: o.join(c, F),
      transforms: l,
      destination: `line-height-${n}.css`,
      selector: `[data-line-height="${n}"]`,
      filter: (s) => !!(s.path && s.path[1] === "line-height"),
      rootName: "typography",
      tsBuildPath: h
    })
  ), Lo = Eo.map(
    ({ mode: t, slug: n }) => g({
      include: [
        a,
        S,
        p,
        O,
        I
      ],
      source: [o.join(e, `🅰️ Tracking.${t}.json`)],
      buildPath: o.join(c, F),
      transforms: l,
      destination: `tracking-${n}.css`,
      selector: `[data-tracking="${n}"]`,
      filter: (s) => !!(s.path && s.path[1] === "tracking"),
      rootName: "typography",
      tsBuildPath: h
    })
  );
  await Promise.all([
    ..._o,
    ...bo,
    ...Po,
    ...Fo,
    ...Lo
  ]);
}
const D = `${process.cwd()}/build`, Go = `${D}/css`, qo = `${D}/js`, Ho = `${D}/json`;
L.registerTransform(To);
L.registerTransform(Ao);
L.registerTransform(Co);
L.registerTransform(yo);
async function Uo() {
  const i = `${process.cwd()}/tokens`;
  console.info("Running Style Dictionary build script"), console.info("Tokens directory:", i), await Ro({
    tokensDir: i,
    cssBuildPath: Go,
    cssTransforms: [
      "name/kebab",
      Io,
      No,
      Oo
    ]
  });
}
Uo().then(() => {
  console.log("✅ Variables generated successfully");
}).catch((i) => {
  console.error("❌ Error generating color variables:", i);
});
export {
  Go as cssBuildPath,
  Uo as generate,
  qo as jsBuildPath,
  Ho as jsonBuildPath
};
