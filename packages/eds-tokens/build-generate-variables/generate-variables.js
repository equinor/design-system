import { StyleDictionary as o } from "style-dictionary-utils";
import { pxFormatted as n, pxTransform as i, pxToRem as c, fontQuote as l, createMatrixColorVariables as T, createClassicColorVariables as f, PX_TO_REM_NAME as p, PX_FORMATTED_NAME as d, FONT_QUOTE_NAME as m, createSpacingAndTypographyVariables as u } from "@equinor/eds-tokens-build";
const s = `${process.cwd()}/build`, a = `${s}/css`, b = `${s}/js`, E = `${s}/json`;
o.registerTransform(n);
o.registerTransform(i);
o.registerTransform(c);
o.registerTransform(l);
async function g() {
  const r = `${process.cwd()}/tokens`;
  console.info("Running Style Dictionary build script"), console.info("Tokens directory:", r);
  const e = "color/", t = [
    "name/kebab",
    p,
    d,
    m
  ];
  await T({
    tokensDir: r,
    colorBuildPath: e,
    prefix: "eds-color"
  }), await f({
    tokensDir: r,
    cssBuildPath: a,
    colorBuildPath: e,
    cssTransforms: t
  }), await u({
    tokensDir: r,
    cssBuildPath: a,
    cssTransforms: t
  });
}
g().then(() => {
  console.log("✅ Variables generated successfully");
}).catch((r) => {
  console.error("❌ Error generating color variables:", r);
});
export {
  a as cssBuildPath,
  g as generate,
  b as jsBuildPath,
  E as jsonBuildPath
};
