import { StyleDictionary as e } from "style-dictionary-utils";
import { FONT_QUOTE_NAME as t, PX_FORMATTED_NAME as n, PX_TO_REM_NAME as r, fontQuote as i, includeTokenFilter as a, pxFormatted as o, pxToRem as s, pxTransform as c, toCamelCase as l, typescriptNestedFormat as u } from "@equinor/eds-tokens-build";
import d from "path";
import f from "os";
import p from "fs";
//#region src/generate-variables/createSpacingAndTypographyVariables.ts
var m = "cpNchKjiIM19dPqTxE0fqg", h = "FQQqyumcpPQoiFRCjdS9GM", g = "eds", _ = "spacing/", v = "typography/";
async function y({ source: t, include: n = [], buildPath: r, destination: i, selector: a = ":root", prefix: o = g, transforms: s, filter: c, outputReferences: l = !0, rootName: d, tsBuildPath: f, splitLeafPrefixes: p }) {
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
				outputReferences: l
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
		...d && { hooks: { formats: { "typescript/nested": u } } }
	}).buildAllPlatforms();
}
async function b({ source: t, include: n = [], jsBuildPath: r, jsonBuildPath: i, cssBuildPath: a, tsBuildPath: o, transforms: s, prefix: c = g, filter: l, name: f, selector: p, rootName: m }) {
	let h = (e) => l(e) && !e.filePath.includes("eds-aggregated-spacing"), v = {
		ts: {
			transforms: ["name/constant"],
			buildPath: r,
			files: [{
				filter: h,
				destination: `spacing/${f}.js`,
				format: "javascript/es6"
			}, {
				filter: h,
				format: "typescript/es6-declarations",
				destination: `spacing/${f}.d.ts`
			}]
		},
		json: {
			buildPath: i,
			transforms: ["name/kebab"],
			files: [{
				filter: h,
				destination: `spacing/flat/${f}.json`,
				format: "json/flat"
			}, {
				filter: h,
				destination: `spacing/nested/${f}.json`,
				format: "json/nested"
			}]
		},
		css: {
			transformGroup: "css",
			prefix: c,
			buildPath: d.join(a, _),
			transforms: s,
			files: [{
				filter: h,
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
			filter: l,
			destination: `${f}.ts`,
			format: "typescript/nested",
			options: { rootName: m }
		}]
	}), await new e({
		include: n,
		source: t,
		platforms: v,
		...m && { hooks: { formats: { "typescript/nested": u } } }
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
async function x({ tokensDir: e, cssBuildPath: t, cssTransforms: n }) {
	let r = d.join(e, m, "👾 Primitives.Value.json"), i = d.join(e, m, "⛔️ Figma.Value.json"), o = d.join(e, h, "💎 Density.Spacious.json"), s = d.join(e, h, "💎 Density.Comfortable.json"), c = d.resolve(process.cwd(), "build"), u = d.join(c, "js"), g = d.join(c, "json"), x = d.join(c, "ts", _), S = d.join(c, "ts", v), C = await p.promises.readdir(x).catch(() => []);
	for (let e of C) e.endsWith(".ts") && e !== "spacious.ts" && e !== "comfortable.ts" && e !== "index.ts" && await p.promises.unlink(d.join(x, e));
	let w = await p.promises.readdir(S).catch(() => []), T = (e) => e.startsWith("font-family-");
	for (let e of w) e.endsWith(".ts") && e !== "index.ts" && !T(e) && await p.promises.unlink(d.join(S, e));
	let E = ee(), D = d.join(f.tmpdir(), "eds-aggregated-spacing.json");
	await p.promises.writeFile(D, JSON.stringify(E, null, 2));
	let te = [
		"documentation",
		"padding-centred",
		"padding-baselined",
		"cap-height",
		"cap-rounded"
	], O = (e) => (t) => {
		let n = t.name.toLowerCase();
		return te.some((e) => n.includes(e)) || n.includes("-container") && !n.startsWith("container-space") ? !1 : t.filePath.includes(e) || t.filePath.includes("eds-aggregated-spacing");
	}, k = O("Spacious"), A = O("Comfortable");
	await b({
		source: [o, D],
		include: [r, i],
		jsBuildPath: u,
		jsonBuildPath: g,
		cssBuildPath: t,
		transforms: n,
		filter: k,
		name: "spacious",
		selector: ":root, [data-density=\"spacious\"]",
		rootName: "spacing",
		tsBuildPath: x
	}), await b({
		source: [s, D],
		include: [r, i],
		jsBuildPath: u,
		jsonBuildPath: g,
		cssBuildPath: t,
		transforms: n,
		filter: A,
		name: "comfortable",
		selector: "[data-density=\"comfortable\"]",
		rootName: "spacing",
		tsBuildPath: x
	}), await p.promises.unlink(D);
	let ne = [
		"/**",
		" * Do not edit directly, this file was auto-generated.",
		" */",
		"",
		"export { spacing as spacious } from './spacious'",
		"export { spacing as comfortable } from './comfortable'",
		""
	].join("\n");
	await p.promises.writeFile(d.join(x, "index.ts"), ne);
	let j = d.join(e, m, "⛔️ Figma.Value.json"), M = d.join(e, h, "🪐 Space proportions.Squared.json"), re = d.join(e, h, "🗣️ Semantic.Mode 1.json"), N = d.join(e, h, "🪐 Container space.Default.json"), P = d.join(e, h, "🪐 Page space.Default.json"), F = d.join(e, h), ie = [
		d.join(F, "🪐 Container space.Default.json"),
		d.join(F, "🪐 Page space.Default.json"),
		d.join(F, "🪐 Selectable space.XS.json"),
		d.join(F, "🪐 Selectable space.SM.json"),
		d.join(F, "🪐 Selectable space.MD.json"),
		d.join(F, "🪐 Selectable space.LG.json"),
		d.join(F, "🪐 Selectable space.XL.json"),
		d.join(F, "🪐 Space proportions.Squared.json"),
		d.join(F, "🪐 Space proportions.Squished.json"),
		d.join(F, "🪐 Space proportions.Stretched.json")
	], I = d.join(F, "🅰️ Font size.XS.json"), L = d.join(F, "🅰️ Font family.UI Body.json"), R = [
		d.join(F, "🅰️ Font family.Header.json"),
		d.join(F, "🅰️ Font family.UI and Body.json"),
		d.join(F, "🅰️ Font family.UI Body.json")
	], ae = d.join(F, "🅰️ Font weight.Normal.json"), oe = d.join(F, "🅰️ Font baseline.Centred.json"), z = d.join(F, "🅰️ Tracking.Normal.json"), B = d.join(F, "🅰️ Line height.Default.json"), V = d.join(F, "〰️ Stroke.Thin.json"), H = d.join(F, "⭕️ Border radius.Rounded.json"), U = d.join(F, "🖼️ Icon size.XS.json"), W = d.join(F, "📐 Size.XS.json"), G = d.join(F, "🪐 Horizontal gap.XS.json"), K = d.join(F, "🪐 Vertical gap.XS.json"), se = d.join(F, "🪐 Horizontal space.XS.json"), ce = d.join(F, "🪐 Vertical space.XS.json");
	await Promise.all([
		"Squished",
		"Squared",
		"Stretched"
	].map((i) => {
		let s = i.toLowerCase(), c = d.join(e, h, `🪐 Space proportions.${i}.json`), l = i === "Squared" ? ":root, [data-space-proportions=\"squared\"]" : `[data-space-proportions="${s}"]`;
		return y({
			include: [
				r,
				j,
				o,
				G,
				K
			],
			source: [
				c,
				N,
				P
			],
			buildPath: d.join(t, _),
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
		let s = i.toLowerCase(), c = d.join(e, h, `🪐 Selectable space.${i}.json`), l = i === "XS" ? ":root, [data-selectable-space=\"xs\"]" : `[data-selectable-space="${s}"]`;
		return y({
			include: [
				r,
				j,
				o,
				M
			],
			source: [c],
			buildPath: d.join(t, _),
			transforms: n,
			destination: `selectable-space-${s}.css`,
			selector: l,
			filter: (e) => a(e, [i])
		});
	}));
	let le = [
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
	], q = async (i, a) => {
		let s = a.toLowerCase(), c = d.join(e, h, `🪐 Horizontal ${i}.${a}.json`), l = d.join(e, h, `🪐 Vertical ${i}.${a}.json`), u = a === "XS" ? `:root, [data-horizontal-${i}="xs"]` : `[data-horizontal-${i}="${s}"]`, f = a === "XS" ? `:root, [data-vertical-${i}="xs"]` : `[data-vertical-${i}="${s}"]`, p = [
			r,
			j,
			o
		];
		await y({
			include: p,
			source: [c],
			buildPath: d.join(t, _),
			transforms: n,
			destination: `generic-${i}-horizontal-${s}.css`,
			selector: u,
			filter: (e) => !!(e.path && e.path[0] === `generic-${i}-horizontal`)
		}), await y({
			include: p,
			source: [l],
			buildPath: d.join(t, _),
			transforms: n,
			destination: `generic-${i}-vertical-${s}.css`,
			selector: f,
			filter: (e) => !!(e.path && e.path[0] === `generic-${i}-vertical`)
		});
	};
	await Promise.all(le.flatMap((e) => [q("gap", e), q("space", e)]));
	let J = [
		r,
		j,
		o,
		M
	];
	await y({
		include: J,
		source: [N],
		buildPath: d.join(t, _),
		transforms: n,
		destination: "container-space.css",
		selector: ":root, [data-space-proportions]",
		filter: (e) => !!(e.path && e.path[0] === "container-space")
	}), await y({
		include: J,
		source: [P],
		buildPath: d.join(t, _),
		transforms: n,
		destination: "page-space.css",
		selector: ":root, [data-space-proportions]",
		filter: (e) => !!(e.path && e.path[0] === "page-space")
	}), await y({
		include: [
			r,
			j,
			o,
			s,
			V,
			H,
			U,
			W,
			...ie,
			...R,
			I,
			ae,
			oe,
			z,
			B,
			G,
			K,
			se,
			ce
		],
		source: [re],
		buildPath: d.join(t, _),
		transforms: n,
		destination: "semantic-spacing-gap.css",
		filter: (e) => {
			if (!e.path) return !1;
			let t = e.path[0], n = e.path[1];
			return t === "Selectable" && (n === "Gap horizontal" || n === "Gap vertical") || t === "Container" && (n === "Gap horizontal" || n === "Gap vertical") || t === "Page" && (n === "Gap horizontal" || n === "Gap vertical");
		}
	});
	let Y = [{
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
	], ue = [
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
	], de = [{
		mode: "Default",
		slug: "default"
	}, {
		mode: "Squished",
		slug: "squished"
	}], Z = [
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
	], fe = Y.map(({ mode: e, slug: i }) => y({
		include: [
			r,
			j,
			o
		],
		source: [d.join(F, `🅰️ Font family.${e}.json`)],
		buildPath: d.join(t, v),
		transforms: n,
		destination: `font-family-${i}.css`,
		selector: `[data-font-family="${i}"]`,
		filter: (t) => a(t, [e]),
		rootName: "typography",
		tsBuildPath: S,
		splitLeafPrefixes: [
			"font-weight",
			"tracking",
			"line-height"
		]
	})), pe = X.map((e) => y({
		include: [
			r,
			j,
			o,
			...R
		],
		source: [d.join(F, `🅰️ Font size.${e}.json`)],
		buildPath: d.join(t, v),
		transforms: n,
		destination: `font-size-${e.toLowerCase()}.css`,
		selector: `[data-font-size="${e.toLowerCase()}"]`,
		filter: (t) => a(t, ["Font size", e]),
		rootName: "typography",
		tsBuildPath: S
	})), me = ue.map(({ mode: e, slug: i }) => y({
		include: [
			r,
			j,
			o,
			L,
			I
		],
		source: [d.join(F, `🅰️ Font weight.${e}.json`)],
		buildPath: d.join(t, v),
		transforms: n,
		destination: `font-weight-${i}.css`,
		selector: `[data-font-weight="${i}"]`,
		filter: (e) => !!(e.path && e.path[1] === "font-weight")
	})), he = de.map(({ mode: e, slug: i }) => y({
		include: [
			r,
			j,
			o,
			L,
			I
		],
		source: [d.join(F, `🅰️ Line height.${e}.json`)],
		buildPath: d.join(t, v),
		transforms: n,
		destination: `line-height-${i}.css`,
		selector: `[data-line-height="${i}"]`,
		filter: (e) => !!(e.path && e.path[1] === "line-height")
	})), ge = Z.map(({ mode: e, slug: i }) => y({
		include: [
			r,
			j,
			o,
			L,
			I
		],
		source: [d.join(F, `🅰️ Tracking.${e}.json`)],
		buildPath: d.join(t, v),
		transforms: n,
		destination: `tracking-${i}.css`,
		selector: `[data-tracking="${i}"]`,
		filter: (e) => !!(e.path && e.path[1] === "tracking")
	}));
	await Promise.all([
		...fe,
		...pe,
		...me,
		...he,
		...ge
	]);
	let Q = {}, $ = (e, t) => {
		let n = RegExp(`${t}:\\s*(-?[\\d.]+)`).exec(e);
		if (!n) throw Error(`size-extras: ${t} not found while parsing per-size TS`);
		return parseFloat(n[1]);
	};
	for (let e of X) {
		let t = e.toLowerCase(), n = d.join(S, `font-size-${t}.ts`), r = await p.promises.readFile(n, "utf-8");
		Q[t] = {
			iconSize: $(r, "iconSize"),
			gapHorizontal: $(r, "gapHorizontal"),
			gapVertical: $(r, "gapVertical")
		};
	}
	for (let { slug: e } of Y) {
		let t = d.join(S, `font-family-${e}.ts`), n = await p.promises.readFile(t, "utf-8");
		for (let e of X) {
			let r = e.toLowerCase(), i = l(r), a = Q[r], o = `      iconSize: ${a.iconSize},\n      gapHorizontal: ${a.gapHorizontal},\n      gapVertical: ${a.gapVertical},\n`, s = RegExp(`(^    ${i}: \\{\\n[\\s\\S]*?)(^    \\},)`, "m"), c = n.replace(s, `$1${o}$2`);
			if (c === n) throw Error(`size-extras inject: size cell "${i}" not found in ${t}`);
			n = c;
		}
		await p.promises.writeFile(t, n, "utf-8");
	}
	for (let e of X) {
		let t = e.toLowerCase();
		await p.promises.unlink(d.join(S, `font-size-${t}.ts`)).catch(() => {});
	}
}
//#endregion
//#region src/generate-variables/index.ts
var S = `${process.cwd()}/build`, C = `${S}/css`, w = `${S}/js`, T = `${S}/json`;
e.registerTransform(o), e.registerTransform(c), e.registerTransform(s), e.registerTransform(i);
async function E() {
	let e = `${process.cwd()}/tokens`;
	console.info("Running Style Dictionary build script"), console.info("Tokens directory:", e), await x({
		tokensDir: e,
		cssBuildPath: C,
		cssTransforms: [
			"name/kebab",
			r,
			n,
			t
		]
	});
}
E().then(() => {
	console.log("✅ Variables generated successfully");
}).catch((e) => {
	console.error("❌ Error generating color variables:", e);
});
//#endregion
export { C as cssBuildPath, E as generate, w as jsBuildPath, T as jsonBuildPath };
