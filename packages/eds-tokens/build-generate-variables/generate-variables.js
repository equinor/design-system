import { StyleDictionary as s } from "style-dictionary-utils";
import { pxFormatted as n, pxTransform as i, pxToRem as c, fontQuote as l, createFoundationColorVariables as T, PX_TO_REM_NAME as m, PX_FORMATTED_NAME as u, FONT_QUOTE_NAME as d, createStaticColorVariables as f, createDynamicColorVariables as p, createSpacingAndTypographyVariables as g } from "@equinor/eds-tokens-build";
const a = `${process.cwd()}/build`, e = `${a}/css`, _ = `${a}/js`, E = `${a}/json`;
s.registerTransform(n);
s.registerTransform(i);
s.registerTransform(c);
s.registerTransform(l);
async function y() {
  const o = `${process.cwd()}/tokens`;
  console.info("Running Style Dictionary build script"), console.info("Tokens directory:", o);
  const t = "color/", r = [
    "name/kebab",
    m,
    u,
    d
  ];
  await T({
    tokensDir: o,
    cssBuildPath: e,
    colorBuildPath: t,
    cssTransforms: r
  }), await f({
    tokensDir: o,
    cssBuildPath: e,
    colorBuildPath: t,
    cssTransforms: r
  }), await p({
    tokensDir: o,
    cssBuildPath: e,
    colorBuildPath: t,
    cssTransforms: r
  }), await g({
    tokensDir: o,
    cssBuildPath: e,
    cssTransforms: r
  });
}
y().then(() => {
  console.log("✅ Variables generated successfully");
}).catch((o) => {
  console.error("❌ Error generating color variables:", o);
});
export {
  e as cssBuildPath,
  y as generate,
  _ as jsBuildPath,
  E as jsonBuildPath
};
