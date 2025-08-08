import { StyleDictionary as r } from "style-dictionary-utils";
import { pxFormatted as n, pxTransform as i, pxToRem as c, fontQuote as l, createFoundationColorVariables as T, PX_TO_REM_NAME as d, PX_FORMATTED_NAME as f, FONT_QUOTE_NAME as p, createClassicColorVariables as u, createMatrixColorVariables as m, createSpacingAndTypographyVariables as g } from "@equinor/eds-tokens-build";
const a = `${process.cwd()}/build`, t = `${a}/css`, D = `${a}/js`, E = `${a}/json`;
r.registerTransform(n);
r.registerTransform(i);
r.registerTransform(c);
r.registerTransform(l);
async function b() {
  const o = `${process.cwd()}/tokens`;
  console.info("Running Style Dictionary build script"), console.info("Tokens directory:", o);
  const e = "color/", s = [
    "name/kebab",
    d,
    f,
    p
  ];
  await T({
    tokensDir: o,
    cssBuildPath: t,
    colorBuildPath: e,
    cssTransforms: s
  }), await u({
    tokensDir: o,
    cssBuildPath: t,
    colorBuildPath: e,
    cssTransforms: s
  }), await m({
    tokensDir: o,
    colorBuildPath: e,
    prefix: "eds-color"
  }), await g({
    tokensDir: o,
    cssBuildPath: t,
    cssTransforms: s
  });
}
b().then(() => {
  console.log("✅ Variables generated successfully");
}).catch((o) => {
  console.error("❌ Error generating color variables:", o);
});
export {
  t as cssBuildPath,
  b as generate,
  D as jsBuildPath,
  E as jsonBuildPath
};
