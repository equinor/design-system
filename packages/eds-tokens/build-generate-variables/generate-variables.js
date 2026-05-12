import { StyleDictionary as e } from "style-dictionary-utils";
import { FONT_QUOTE_NAME as t, PX_FORMATTED_NAME as n, PX_TO_REM_NAME as r, fontQuote as i, includeTokenFilter as a, pxFormatted as o, pxToRem as s, pxTransform as c, typescriptNestedFormat as l } from "@equinor/eds-tokens-build";
import u from "path";
import d from "os";
import f from "fs";
//#region src/generate-variables/createSpacingAndTypographyVariables.ts
var p = "cpNchKjiIM19dPqTxE0fqg", m = "FQQqyumcpPQoiFRCjdS9GM", h = "eds", g = "spacing/", _ = "typography/";
async function v({ source: t, include: n = [], buildPath: r, destination: i, selector: a = ":root", prefix: o = h, transforms: s, filter: c, outputReferences: u = !0, rootName: d, tsBuildPath: f, splitLeafPrefixes: p }) {
	let m = { css: {
		transformGroup: "css",
		prefix: o,
		buildPath: r,
		transforms: s,
		files: [{
			filter: c,
			destination: i,
			format: "css/variables",
			options: {
				selector: a,
				outputReferences: u
			}
		}]
	} };
	d && f && (m.tsNested = {
		buildPath: f,
		files: [{
			filter: c,
			destination: i.replace(/\.css$/, ".ts"),
			format: "typescript/nested",
			options: {
				rootName: d,
				splitLeafPrefixes: p
			}
		}]
	}), await new e({
		include: n,
		source: t,
		platforms: m,
		...d && { hooks: { formats: { "typescript/nested": l } } }
	}).buildAllPlatforms();
}
async function y({ source: t, include: n = [], jsBuildPath: r, jsonBuildPath: i, cssBuildPath: a, tsBuildPath: o, transforms: s, prefix: c = h, filter: d, name: f, selector: p, rootName: m }) {
	let _ = (e) => d(e) && !e.filePath.includes("eds-aggregated-spacing"), v = {
		ts: {
			transforms: ["name/constant"],
			buildPath: r,
			files: [{
				filter: _,
				destination: `spacing/${f}.js`,
				format: "javascript/es6"
			}, {
				filter: _,
				format: "typescript/es6-declarations",
				destination: `spacing/${f}.d.ts`
			}]
		},
		json: {
			buildPath: i,
			transforms: ["name/kebab"],
			files: [{
				filter: _,
				destination: `spacing/flat/${f}.json`,
				format: "json/flat"
			}, {
				filter: _,
				destination: `spacing/nested/${f}.json`,
				format: "json/nested"
			}]
		},
		css: {
			transformGroup: "css",
			prefix: c,
			buildPath: u.join(a, g),
			transforms: s,
			files: [{
				filter: _,
				destination: `${f}.css`,
				format: "css/variables",
				options: {
					selector: p,
					outputReferences: !1
				}
			}]
		}
	};
	m && o && (v.tsNested = {
		buildPath: o,
		files: [{
			filter: d,
			destination: `${f}.ts`,
			format: "typescript/nested",
			options: { rootName: m }
		}]
	}), await new e({
		include: n,
		source: t,
		platforms: v,
		...m && { hooks: { formats: { "typescript/nested": l } } }
	}).buildAllPlatforms();
}
function ee() {
	let e = [
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
	], t = [
		"xs",
		"sm",
		"md",
		"lg",
		"xl"
	], n = [
		"squished",
		"squared",
		"stretched"
	], r = (e) => ({
		$type: "number",
		$value: e
	}), i = () => Object.fromEntries(e.map((e) => [e, {
		horizontal: r(e === "none" ? 0 : `{spacing.horizontal.${e}}`),
		vertical: r(e === "none" ? 0 : `{spacing.vertical.${e}}`)
	}]));
	return {
		generic: {
			gap: i(),
			space: i()
		},
		"spacing-proportions": Object.fromEntries(n.map((e) => [e, Object.fromEntries(t.map((t) => [t, {
			horizontal: r(`{spacing.inset.${t}.horizontal}`),
			vertical: r(`{spacing.inset.${t}.vertical-${e}}`)
		}]))])),
		"selectable-space": Object.fromEntries(t.map((e) => [e, {
			horizontal: r(`{spacing.inset.${e}.horizontal}`),
			vertical: r(`{spacing.inset.${e}.vertical-squared}`)
		}])),
		"container-space": {
			horizontal: r("{spacing.inset.md.horizontal}"),
			vertical: r("{spacing.inset.md.vertical-squared}")
		},
		"page-space": {
			horizontal: r("{spacing.inset.xl.horizontal}"),
			vertical: r("{spacing.inset.xl.vertical-squared}")
		}
	};
}
async function b({ tokensDir: e, cssBuildPath: t, cssTransforms: n }) {
	let r = u.join(e, p, "👾 Primitives.Value.json"), i = u.join(e, p, "⛔️ Figma.Value.json"), o = u.join(e, m, "💎 Density.Spacious.json"), s = u.join(e, m, "💎 Density.Comfortable.json"), c = u.resolve(process.cwd(), "build"), l = u.join(c, "js"), h = u.join(c, "json"), b = u.join(c, "ts", g), x = u.join(c, "ts", _), S = await f.promises.readdir(b).catch(() => []);
	for (let e of S) e.endsWith(".ts") && e !== "spacious.ts" && e !== "comfortable.ts" && e !== "index.ts" && await f.promises.unlink(u.join(b, e));
	let C = await f.promises.readdir(x).catch(() => []), w = (e) => e.startsWith("font-family-");
	for (let e of C) e.endsWith(".ts") && e !== "index.ts" && !w(e) && await f.promises.unlink(u.join(x, e));
	let T = ee(), E = u.join(d.tmpdir(), "eds-aggregated-spacing.json");
	await f.promises.writeFile(E, JSON.stringify(T, null, 2));
	let te = [
		"documentation",
		"padding-centred",
		"padding-baselined",
		"cap-height",
		"cap-rounded"
	], D = (e) => (t) => {
		let n = t.name.toLowerCase();
		return te.some((e) => n.includes(e)) || n.includes("-container") && !n.startsWith("container-space") ? !1 : t.filePath.includes(e) || t.filePath.includes("eds-aggregated-spacing");
	}, O = D("Spacious"), k = D("Comfortable");
	await y({
		source: [o, E],
		include: [r, i],
		jsBuildPath: l,
		jsonBuildPath: h,
		cssBuildPath: t,
		transforms: n,
		filter: O,
		name: "spacious",
		selector: ":root, [data-density=\"spacious\"]",
		rootName: "spacing",
		tsBuildPath: b
	}), await y({
		source: [s, E],
		include: [r, i],
		jsBuildPath: l,
		jsonBuildPath: h,
		cssBuildPath: t,
		transforms: n,
		filter: k,
		name: "comfortable",
		selector: "[data-density=\"comfortable\"]",
		rootName: "spacing",
		tsBuildPath: b
	}), await f.promises.unlink(E);
	let ne = [
		"/**",
		" * Do not edit directly, this file was auto-generated.",
		" */",
		"",
		"export { spacing as spacious } from './spacious'",
		"export { spacing as comfortable } from './comfortable'",
		""
	].join("\n");
	await f.promises.writeFile(u.join(b, "index.ts"), ne);
	let A = u.join(e, p, "⛔️ Figma.Value.json"), j = u.join(e, m, "🪐 Space proportions.Squared.json"), re = u.join(e, m, "🗣️ Semantic.Mode 1.json"), M = u.join(e, m, "🪐 Container space.Default.json"), N = u.join(e, m, "🪐 Page space.Default.json"), P = u.join(e, m), ie = [
		u.join(P, "🪐 Container space.Default.json"),
		u.join(P, "🪐 Page space.Default.json"),
		u.join(P, "🪐 Selectable space.XS.json"),
		u.join(P, "🪐 Selectable space.SM.json"),
		u.join(P, "🪐 Selectable space.MD.json"),
		u.join(P, "🪐 Selectable space.LG.json"),
		u.join(P, "🪐 Selectable space.XL.json"),
		u.join(P, "🪐 Space proportions.Squared.json"),
		u.join(P, "🪐 Space proportions.Squished.json"),
		u.join(P, "🪐 Space proportions.Stretched.json")
	], F = u.join(P, "🅰️ Font size.XS.json"), I = u.join(P, "🅰️ Font family.UI Body.json"), L = [
		u.join(P, "🅰️ Font family.Header.json"),
		u.join(P, "🅰️ Font family.UI and Body.json"),
		u.join(P, "🅰️ Font family.UI Body.json")
	], ae = u.join(P, "🅰️ Font weight.Normal.json"), R = u.join(P, "🅰️ Font baseline.Centred.json"), z = u.join(P, "🅰️ Tracking.Normal.json"), B = u.join(P, "🅰️ Line height.Default.json"), V = u.join(P, "〰️ Stroke.Thin.json"), H = u.join(P, "⭕️ Border radius.Rounded.json"), U = u.join(P, "🖼️ Icon size.XS.json"), W = u.join(P, "📐 Size.XS.json"), G = u.join(P, "🪐 Horizontal gap.XS.json"), K = u.join(P, "🪐 Vertical gap.XS.json"), q = u.join(P, "🪐 Horizontal space.XS.json"), oe = u.join(P, "🪐 Vertical space.XS.json");
	await Promise.all([
		"Squished",
		"Squared",
		"Stretched"
	].map((i) => {
		let s = i.toLowerCase(), c = u.join(e, m, `🪐 Space proportions.${i}.json`), l = i === "Squared" ? ":root, [data-space-proportions=\"squared\"]" : `[data-space-proportions="${s}"]`;
		return v({
			include: [
				r,
				A,
				o,
				G,
				K
			],
			source: [
				c,
				M,
				N
			],
			buildPath: u.join(t, g),
			transforms: n,
			destination: `space-proportions-${s}.css`,
			selector: l,
			filter: (e) => !!(a(e, [i]) || e.path && e.path[0] === "Container" && e.path[1] === "Spacing" || e.path && e.path[0] === "Page" && e.path[1] === "Spacing")
		});
	})), await Promise.all([
		"XS",
		"SM",
		"MD",
		"LG",
		"XL"
	].map((i) => {
		let s = i.toLowerCase(), c = u.join(e, m, `🪐 Selectable space.${i}.json`), l = i === "XS" ? ":root, [data-selectable-space=\"xs\"]" : `[data-selectable-space="${s}"]`;
		return v({
			include: [
				r,
				A,
				o,
				j
			],
			source: [c],
			buildPath: u.join(t, g),
			transforms: n,
			destination: `selectable-space-${s}.css`,
			selector: l,
			filter: (e) => a(e, [i])
		});
	}));
	let se = [
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
	], J = async (i, a) => {
		let s = a.toLowerCase(), c = u.join(e, m, `🪐 Horizontal ${i}.${a}.json`), l = u.join(e, m, `🪐 Vertical ${i}.${a}.json`), d = a === "XS" ? `:root, [data-horizontal-${i}="xs"]` : `[data-horizontal-${i}="${s}"]`, f = a === "XS" ? `:root, [data-vertical-${i}="xs"]` : `[data-vertical-${i}="${s}"]`, p = [
			r,
			A,
			o
		];
		await v({
			include: p,
			source: [c],
			buildPath: u.join(t, g),
			transforms: n,
			destination: `generic-${i}-horizontal-${s}.css`,
			selector: d,
			filter: (e) => !!(e.path && e.path[0] === `generic-${i}-horizontal`)
		}), await v({
			include: p,
			source: [l],
			buildPath: u.join(t, g),
			transforms: n,
			destination: `generic-${i}-vertical-${s}.css`,
			selector: f,
			filter: (e) => !!(e.path && e.path[0] === `generic-${i}-vertical`)
		});
	};
	await Promise.all(se.flatMap((e) => [J("gap", e), J("space", e)]));
	let Y = [
		r,
		A,
		o,
		j
	];
	await v({
		include: Y,
		source: [M],
		buildPath: u.join(t, g),
		transforms: n,
		destination: "container-space.css",
		selector: ":root, [data-space-proportions]",
		filter: (e) => !!(e.path && e.path[0] === "container-space")
	}), await v({
		include: Y,
		source: [N],
		buildPath: u.join(t, g),
		transforms: n,
		destination: "page-space.css",
		selector: ":root, [data-space-proportions]",
		filter: (e) => !!(e.path && e.path[0] === "page-space")
	}), await v({
		include: [
			r,
			A,
			o,
			s,
			V,
			H,
			U,
			W,
			...ie,
			...L,
			F,
			ae,
			R,
			z,
			B,
			G,
			K,
			q,
			oe
		],
		source: [re],
		buildPath: u.join(t, g),
		transforms: n,
		destination: "semantic-spacing-gap.css",
		filter: (e) => {
			if (!e.path) return !1;
			let t = e.path[0], n = e.path[1];
			return t === "Selectable" && (n === "Gap horizontal" || n === "Gap vertical") || t === "Container" && (n === "Gap horizontal" || n === "Gap vertical") || t === "Page" && (n === "Gap horizontal" || n === "Gap vertical");
		}
	});
	let ce = [{
		mode: "Header",
		slug: "header"
	}, {
		mode: "UI Body",
		slug: "ui"
	}], X = [
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
	], le = [
		{
			mode: "Lighter",
			slug: "lighter"
		},
		{
			mode: "Normal",
			slug: "normal"
		},
		{
			mode: "Bolder",
			slug: "bolder"
		}
	], ue = [{
		mode: "Default",
		slug: "default"
	}, {
		mode: "Squished",
		slug: "squished"
	}], de = [
		{
			mode: "Tight",
			slug: "tight"
		},
		{
			mode: "Normal",
			slug: "normal"
		},
		{
			mode: "Wide",
			slug: "wide"
		},
		{
			mode: "Loose",
			slug: "loose"
		}
	], Z = ce.map(({ mode: e, slug: i }) => v({
		include: [
			r,
			A,
			o
		],
		source: [u.join(P, `🅰️ Font family.${e}.json`)],
		buildPath: u.join(t, _),
		transforms: n,
		destination: `font-family-${i}.css`,
		selector: `[data-font-family="${i}"]`,
		filter: (t) => a(t, [e]),
		rootName: "typography",
		tsBuildPath: x,
		splitLeafPrefixes: [
			"font-weight",
			"tracking",
			"line-height"
		]
	})), fe = X.map((e) => v({
		include: [
			r,
			A,
			o,
			...L
		],
		source: [u.join(P, `🅰️ Font size.${e}.json`)],
		buildPath: u.join(t, _),
		transforms: n,
		destination: `font-size-${e.toLowerCase()}.css`,
		selector: `[data-font-size="${e.toLowerCase()}"]`,
		filter: (t) => a(t, ["Font size", e]),
		rootName: "typography",
		tsBuildPath: x
	})), pe = le.map(({ mode: e, slug: i }) => v({
		include: [
			r,
			A,
			o,
			I,
			F
		],
		source: [u.join(P, `🅰️ Font weight.${e}.json`)],
		buildPath: u.join(t, _),
		transforms: n,
		destination: `font-weight-${i}.css`,
		selector: `[data-font-weight="${i}"]`,
		filter: (e) => !!(e.path && e.path[1] === "font-weight")
	})), me = ue.map(({ mode: e, slug: i }) => v({
		include: [
			r,
			A,
			o,
			I,
			F
		],
		source: [u.join(P, `🅰️ Line height.${e}.json`)],
		buildPath: u.join(t, _),
		transforms: n,
		destination: `line-height-${i}.css`,
		selector: `[data-line-height="${i}"]`,
		filter: (e) => !!(e.path && e.path[1] === "line-height")
	})), he = de.map(({ mode: e, slug: i }) => v({
		include: [
			r,
			A,
			o,
			I,
			F
		],
		source: [u.join(P, `🅰️ Tracking.${e}.json`)],
		buildPath: u.join(t, _),
		transforms: n,
		destination: `tracking-${i}.css`,
		selector: `[data-tracking="${i}"]`,
		filter: (e) => !!(e.path && e.path[1] === "tracking")
	}));
	await Promise.all([
		...Z,
		...fe,
		...pe,
		...me,
		...he
	]);
	let Q = {}, $ = (e, t) => {
		let n = RegExp(`${t}:\\s*(-?[\\d.]+)`).exec(e);
		if (!n) throw Error(`size-extras: ${t} not found while parsing per-size TS`);
		return parseFloat(n[1]);
	};
	for (let e of X) {
		let t = e.toLowerCase(), n = u.join(x, `font-size-${t}.ts`), r = await f.promises.readFile(n, "utf-8");
		Q[t] = {
			iconSize: $(r, "iconSize"),
			gapHorizontal: $(r, "gapHorizontal"),
			gapVertical: $(r, "gapVertical")
		};
	}
	let ge = {
		xs: "xs",
		sm: "sm",
		md: "md",
		lg: "lg",
		xl: "xl",
		"2xl": "twoXl",
		"3xl": "threeXl",
		"4xl": "fourXl",
		"5xl": "fiveXl",
		"6xl": "sixXl"
	};
	for (let e of ["ui", "header"]) {
		let t = u.join(x, `font-family-${e}.ts`), n = await f.promises.readFile(t, "utf-8");
		for (let e of X) {
			let r = e.toLowerCase(), i = ge[r], a = Q[r], o = `      iconSize: ${a.iconSize},\n      gapHorizontal: ${a.gapHorizontal},\n      gapVertical: ${a.gapVertical},\n`, s = RegExp(`(^    ${i}: \\{\\n[\\s\\S]*?)(^    \\},)`, "m"), c = n.replace(s, `$1${o}$2`);
			if (c === n) throw Error(`size-extras inject: size cell "${i}" not found in ${t}`);
			n = c;
		}
		await f.promises.writeFile(t, n, "utf-8");
	}
	for (let e of X) {
		let t = e.toLowerCase();
		await f.promises.unlink(u.join(x, `font-size-${t}.ts`)).catch(() => {});
	}
}
//#endregion
//#region src/generate-variables/index.ts
var x = `${process.cwd()}/build`, S = `${x}/css`, C = `${x}/js`, w = `${x}/json`;
e.registerTransform(o), e.registerTransform(c), e.registerTransform(s), e.registerTransform(i);
async function T() {
	let e = `${process.cwd()}/tokens`;
	console.info("Running Style Dictionary build script"), console.info("Tokens directory:", e), await b({
		tokensDir: e,
		cssBuildPath: S,
		cssTransforms: [
			"name/kebab",
			r,
			n,
			t
		]
	});
}
T().then(() => {
	console.log("✅ Variables generated successfully");
}).catch((e) => {
	console.error("❌ Error generating color variables:", e);
});
//#endregion
export { S as cssBuildPath, T as generate, C as jsBuildPath, w as jsonBuildPath };
