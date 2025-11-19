import { StyleDictionary as n } from "style-dictionary-utils";
import { createDensitySpaceToggleTransform as x, includeTokenFilter as r, pxFormatted as v, pxTransform as q, pxToRem as V, fontQuote as X, PX_TO_REM_NAME as Y, PX_FORMATTED_NAME as Q, FONT_QUOTE_NAME as K } from "@equinor/eds-tokens-build";
import o from "path";
import { readJsonFiles as B } from "@equinor/eds-tokens-sync";
const b = "cpNchKjiIM19dPqTxE0fqg", e = "FQQqyumcpPQoiFRCjdS9GM";
async function H({
  tokensDir: t,
  cssBuildPath: i,
  cssTransforms: l
}) {
  const p = "spacing/", f = o.join(
    t,
    b,
    "👾 Primitives.Value.json"
  ), g = o.join(
    t,
    b,
    "⛔️ Figma.Value.json"
  ), d = o.join(
    t,
    e,
    "💎 Density.Spacious.json"
  ), T = o.join(
    t,
    e,
    "💎 Density.Comfortable.json"
  ), h = B([
    o.join(
      t,
      e,
      "💎 Density.Comfortable.json"
    )
  ]), A = x({
    name: "densitySpaceToggle",
    tokens: h["💎 Density.Comfortable.json"]
  });
  n.registerTransform(A);
  const E = o.resolve(process.cwd(), "build"), _ = o.join(E, "js"), C = o.join(E, "json"), u = (s) => r(s, ["Density", "Spacious"]), m = (s) => r(s, ["Density", "Comfortable"]), R = new n({
    include: [f, g],
    source: [d],
    platforms: {
      ts: {
        transforms: ["name/constant"],
        buildPath: _,
        files: [
          {
            filter: u,
            destination: "spacing/spacious.js",
            format: "javascript/es6"
          },
          {
            filter: u,
            format: "typescript/es6-declarations",
            destination: "spacing/spacious.d.ts"
          }
        ]
      },
      json: {
        buildPath: C,
        transforms: ["name/kebab"],
        files: [
          {
            filter: u,
            destination: "spacing/flat/spacious.json",
            format: "json/flat"
          },
          {
            filter: u,
            destination: "spacing/nested/spacious.json",
            format: "json/nested"
          }
        ]
      },
      css: {
        transformGroup: "css",
        prefix: "eds",
        buildPath: o.join(i, p),
        transforms: l,
        files: [
          {
            filter: (s) => r(s, ["Density", "Spacious"]),
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
  }), O = new n({
    include: [f, g],
    source: [T],
    platforms: {
      ts: {
        transforms: ["name/constant"],
        buildPath: _,
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
        buildPath: C,
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
        buildPath: o.join(i, p),
        transforms: l,
        files: [
          {
            filter: (s) => r(s, ["Density", "Comfortable"]),
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
  await R.buildAllPlatforms(), await O.buildAllPlatforms();
  const y = o.join(
    t,
    b,
    "⛔️ Figma.Value.json"
  ), I = o.join(
    t,
    e,
    "🪐 Space proportions.Squared.json"
  );
  o.join(
    t,
    e,
    "🗣️ Semantic.Mode 1.json"
  );
  const F = o.join(
    t,
    e,
    "🪐 Container space.Default.json"
  ), M = o.join(
    t,
    e,
    "🪐 Page.Default.json"
  ), N = ["XS", "SM", "MD", "LG", "XL"].flatMap((s) => [
    o.join(
      t,
      e,
      `🪐 Horisontal gap.${s}.json`
    ),
    o.join(
      t,
      e,
      `🪐 Vertical gap.${s}.json`
    )
  ]), D = ["Squished", "Squared", "Stretched"], w = (s) => {
    const c = s.toLowerCase(), j = o.join(
      t,
      e,
      `🪐 Space proportions.${s}.json`
    ), S = s === "Squared" ? ':root, [data-space-proportions="squared"]' : `[data-space-proportions="${c}"]`;
    return new n({
      include: [
        f,
        y,
        d,
        ...N
      ],
      source: [j, F, M],
      platforms: {
        css: {
          transformGroup: "css",
          prefix: "eds",
          buildPath: o.join(i, p),
          transforms: l,
          files: [
            {
              filter: (a) => !!(r(a, [s]) || a.path && a.path[0] === "Container" && a.path[1] === "Spacing" || a.path && a.path[0] === "Page" && a.path[1] === "Spacing"),
              destination: `space-proportions-${c}.css`,
              format: "css/variables",
              options: {
                selector: S,
                outputReferences: !0
              }
            }
          ]
        }
      }
    });
  }, G = D.map(
    (s) => w(s)
  );
  await Promise.all(
    G.map((s) => s.buildAllPlatforms())
  );
  const $ = ["XS", "SM", "MD", "LG", "XL"], L = (s) => {
    const c = s.toLowerCase(), j = o.join(
      t,
      e,
      `🪐 Selectable space.${s}.json`
    ), S = s === "XS" ? ':root, [data-selectable-space="xs"]' : `[data-selectable-space="${c}"]`;
    return new n({
      include: [
        f,
        y,
        d,
        I
      ],
      source: [j],
      platforms: {
        css: {
          transformGroup: "css",
          prefix: "eds",
          buildPath: o.join(i, p),
          transforms: l,
          files: [
            {
              filter: (a) => r(a, [s]),
              destination: `selectable-space-${c}.css`,
              format: "css/variables",
              options: {
                selector: S,
                outputReferences: !0
              }
            }
          ]
        }
      }
    });
  }, U = $.map(
    (s) => L(s)
  );
  await Promise.all(
    U.map((s) => s.buildAllPlatforms())
  );
}
const P = `${process.cwd()}/build`, J = `${P}/css`, ts = `${P}/js`, es = `${P}/json`;
n.registerTransform(v);
n.registerTransform(q);
n.registerTransform(V);
n.registerTransform(X);
async function W() {
  const t = `${process.cwd()}/tokens`;
  console.info("Running Style Dictionary build script"), console.info("Tokens directory:", t), await H({
    tokensDir: t,
    cssBuildPath: J,
    cssTransforms: [
      "name/kebab",
      Y,
      Q,
      K
    ]
  });
}
W().then(() => {
  console.log("✅ Variables generated successfully");
}).catch((t) => {
  console.error("❌ Error generating color variables:", t);
});
export {
  J as cssBuildPath,
  W as generate,
  ts as jsBuildPath,
  es as jsonBuildPath
};
