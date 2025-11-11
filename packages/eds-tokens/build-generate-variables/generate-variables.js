import { StyleDictionary as e } from "style-dictionary-utils";
import { createDensitySpaceToggleTransform as G, includeTokenFilter as n, pxFormatted as $, pxTransform as x, pxToRem as L, fontQuote as v, PX_TO_REM_NAME as U, PX_FORMATTED_NAME as Y, FONT_QUOTE_NAME as q } from "@equinor/eds-tokens-build";
import o from "path";
import { readJsonFiles as Q } from "@equinor/eds-tokens-sync";
const b = "cpNchKjiIM19dPqTxE0fqg", a = "FQQqyumcpPQoiFRCjdS9GM";
async function V({
  tokensDir: t,
  cssBuildPath: r,
  cssTransforms: c
}) {
  const l = "spacing/", f = o.join(
    t,
    b,
    "👾 Primitives.Value.json"
  ), P = o.join(
    t,
    b,
    "⛔️ Figma.Value.json"
  ), u = o.join(
    t,
    a,
    "💎 Density.Spacious.json"
  ), E = o.join(
    t,
    a,
    "💎 Density.Comfortable.json"
  ), C = Q([
    o.join(
      t,
      a,
      "💎 Density.Comfortable.json"
    )
  ]), R = G({
    name: "densitySpaceToggle",
    tokens: C["💎 Density.Comfortable.json"]
  });
  e.registerTransform(R);
  const g = o.resolve(process.cwd(), "build"), y = o.join(g, "js"), T = o.join(g, "json"), p = (s) => n(s, ["Density", "Spacious"]), m = (s) => n(s, ["Density", "Comfortable"]), A = new e({
    include: [f, P],
    source: [u],
    platforms: {
      ts: {
        transforms: ["name/constant"],
        buildPath: y,
        files: [
          {
            filter: p,
            destination: "spacing/spacious.js",
            format: "javascript/es6"
          },
          {
            filter: p,
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
            filter: p,
            destination: "spacing/flat/spacious.json",
            format: "json/flat"
          },
          {
            filter: p,
            destination: "spacing/nested/spacious.json",
            format: "json/nested"
          }
        ]
      },
      css: {
        transformGroup: "css",
        prefix: "eds",
        buildPath: o.join(r, l),
        transforms: c,
        files: [
          {
            filter: (s) => n(s, ["Density", "Spacious"]),
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
  }), I = new e({
    include: [f, P],
    source: [E],
    platforms: {
      ts: {
        transforms: ["name/constant"],
        buildPath: y,
        files: [
          {
            filter: m,
            destination: "spacing/comfortable.js",
            format: "javascript/es6"
          },
          {
            filter: m,
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
            filter: m,
            destination: "spacing/flat/comfortable.json",
            format: "json/flat"
          },
          {
            filter: m,
            destination: "spacing/nested/comfortable.json",
            format: "json/nested"
          }
        ]
      },
      css: {
        transformGroup: "css",
        prefix: "eds",
        buildPath: o.join(r, l),
        transforms: c,
        files: [
          {
            filter: (s) => n(s, ["Density", "Comfortable"]),
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
  await A.buildAllPlatforms(), await I.buildAllPlatforms();
  const _ = o.join(
    t,
    b,
    "⛔️ Figma.Value.json"
  ), h = o.join(
    t,
    a,
    "🪐 Space proportions.Squared.json"
  ), O = ["Squished", "Squared", "Stretched"], D = (s) => {
    const i = s.toLowerCase(), d = o.join(
      t,
      a,
      `🪐 Space proportions.${s}.json`
    );
    return new e({
      include: [
        f,
        _,
        u
      ],
      source: [d],
      platforms: {
        css: {
          transformGroup: "css",
          prefix: "eds",
          buildPath: o.join(r, l),
          transforms: c,
          files: [
            {
              filter: (j) => n(j, [s]),
              destination: `space-proportions-${i}.css`,
              format: "css/variables",
              options: {
                selector: `[data-space-proportions="${i}"]`,
                outputReferences: !0
              }
            }
          ]
        }
      }
    });
  }, F = O.map(
    (s) => D(s)
  );
  await Promise.all(
    F.map((s) => s.buildAllPlatforms())
  );
  const w = ["XS", "SM", "MD", "LG", "XL"], N = (s) => {
    const i = s.toLowerCase(), d = o.join(
      t,
      a,
      `🪐 Selectable space.${s}.json`
    );
    return new e({
      include: [
        f,
        _,
        u,
        h
      ],
      source: [d],
      platforms: {
        css: {
          transformGroup: "css",
          prefix: "eds",
          buildPath: o.join(r, l),
          transforms: c,
          files: [
            {
              filter: (j) => n(j, [s]),
              destination: `selectable-space-${i}.css`,
              format: "css/variables",
              options: {
                selector: `[data-selectable-space="${i}"]`,
                outputReferences: !0
              }
            }
          ]
        }
      }
    });
  }, M = w.map(
    (s) => N(s)
  );
  await Promise.all(
    M.map((s) => s.buildAllPlatforms())
  );
}
const S = `${process.cwd()}/build`, K = `${S}/css`, W = `${S}/js`, Z = `${S}/json`;
e.registerTransform($);
e.registerTransform(x);
e.registerTransform(L);
e.registerTransform(v);
async function B() {
  const t = `${process.cwd()}/tokens`;
  console.info("Running Style Dictionary build script"), console.info("Tokens directory:", t), await V({
    tokensDir: t,
    cssBuildPath: K,
    cssTransforms: [
      "name/kebab",
      U,
      Y,
      q
    ]
  });
}
B().then(() => {
  console.log("✅ Variables generated successfully");
}).catch((t) => {
  console.error("❌ Error generating color variables:", t);
});
export {
  K as cssBuildPath,
  B as generate,
  W as jsBuildPath,
  Z as jsonBuildPath
};
