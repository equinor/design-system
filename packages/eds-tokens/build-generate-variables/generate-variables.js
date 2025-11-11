import { StyleDictionary as t } from "style-dictionary-utils";
import { createDensitySpaceToggleTransform as F, includeTokenFilter as p, pxFormatted as N, pxTransform as w, pxToRem as h, fontQuote as M, PX_TO_REM_NAME as G, PX_FORMATTED_NAME as $, FONT_QUOTE_NAME as x } from "@equinor/eds-tokens-build";
import e from "path";
import { readJsonFiles as L } from "@equinor/eds-tokens-sync";
const d = "cpNchKjiIM19dPqTxE0fqg", r = "FQQqyumcpPQoiFRCjdS9GM";
async function U({
  tokensDir: s,
  cssBuildPath: n,
  cssTransforms: i
}) {
  const c = "spacing/", l = e.join(
    s,
    d,
    "👾 Primitives.Value.json"
  ), T = e.join(
    s,
    d,
    "⛔️ Figma.Value.json"
  ), f = e.join(
    s,
    r,
    "💎 Density.Spacious.json"
  ), P = e.join(
    s,
    r,
    "💎 Density.Comfortable.json"
  ), _ = L([
    e.join(
      s,
      r,
      "💎 Density.Comfortable.json"
    )
  ]), j = F({
    name: "densitySpaceToggle",
    tokens: _["💎 Density.Comfortable.json"]
  });
  t.registerTransform(j);
  const E = new t({
    include: [l, T],
    source: [f],
    platforms: {
      css: {
        transformGroup: "css",
        prefix: "eds",
        buildPath: e.join(n, c),
        transforms: i,
        files: [
          {
            filter: (o) => p(o, ["Density", "Spacious"]),
            destination: "spacious-trimmed.css",
            format: "css/variables",
            options: {
              selector: ':root, [data-density="spacious"]',
              outputReferences: !1
            }
          }
        ]
      }
    }
  }), g = new t({
    include: [l, T],
    source: [P],
    platforms: {
      css: {
        transformGroup: "css",
        prefix: "eds",
        buildPath: e.join(n, c),
        transforms: i,
        files: [
          {
            filter: (o) => p(o, ["Density", "Comfortable"]),
            destination: "comfortable-trimmed.css",
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
  await E.buildAllPlatforms(), await g.buildAllPlatforms();
  const b = e.join(
    s,
    d,
    "⛔️ Figma.Value.json"
  ), y = e.join(
    s,
    r,
    "🪐 Space proportions.Squared.json"
  ), C = ["Squished", "Squared", "Stretched"], R = (o) => {
    const a = o.toLowerCase(), m = e.join(
      s,
      r,
      `🪐 Space proportions.${o}.json`
    );
    return new t({
      include: [
        l,
        b,
        f
      ],
      source: [m],
      platforms: {
        css: {
          transformGroup: "css",
          prefix: "eds",
          buildPath: e.join(n, c),
          transforms: i,
          files: [
            {
              filter: (u) => p(u, [o]),
              destination: `space-proportions-${a}.css`,
              format: "css/variables",
              options: {
                selector: `[data-space-proportions="${a}"]`,
                outputReferences: !0
              }
            }
          ]
        }
      }
    });
  }, A = C.map(
    (o) => R(o)
  );
  await Promise.all(
    A.map((o) => o.buildAllPlatforms())
  );
  const I = ["XS", "SM", "MD", "LG", "XL"], O = (o) => {
    const a = o.toLowerCase(), m = e.join(
      s,
      r,
      `🪐 Selectable space.${o}.json`
    );
    return new t({
      include: [
        l,
        b,
        f,
        y
      ],
      source: [m],
      platforms: {
        css: {
          transformGroup: "css",
          prefix: "eds",
          buildPath: e.join(n, c),
          transforms: i,
          files: [
            {
              filter: (u) => p(u, [o]),
              destination: `selectable-space-${a}.css`,
              format: "css/variables",
              options: {
                selector: `[data-selectable-space="${a}"]`,
                outputReferences: !0
              }
            }
          ]
        }
      }
    });
  }, D = I.map(
    (o) => O(o)
  );
  await Promise.all(
    D.map((o) => o.buildAllPlatforms())
  );
}
const S = `${process.cwd()}/build`, Y = `${S}/css`, B = `${S}/js`, H = `${S}/json`;
t.registerTransform(N);
t.registerTransform(w);
t.registerTransform(h);
t.registerTransform(M);
async function q() {
  const s = `${process.cwd()}/tokens`;
  console.info("Running Style Dictionary build script"), console.info("Tokens directory:", s), await U({
    tokensDir: s,
    cssBuildPath: Y,
    cssTransforms: [
      "name/kebab",
      G,
      $,
      x
    ]
  });
}
q().then(() => {
  console.log("✅ Variables generated successfully");
}).catch((s) => {
  console.error("❌ Error generating color variables:", s);
});
export {
  Y as cssBuildPath,
  q as generate,
  B as jsBuildPath,
  H as jsonBuildPath
};
