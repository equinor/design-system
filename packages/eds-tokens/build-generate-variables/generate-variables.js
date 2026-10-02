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
	let h = new Set([
		"generic",
		"spacing-proportions",
		"selectable-space"
	]), v = (e) => e.filePath.includes("eds-aggregated-spacing") && e.path.length >= 1 && !h.has(e.path[0]), y = (e) => l(e) ? e.filePath.includes("eds-aggregated-spacing") ? v(e) : !0 : !1, b = (e) => l(e) && !e.filePath.includes("eds-aggregated-spacing"), x = {
		ts: {
			transforms: ["name/constant"],
			buildPath: r,
			files: [{
				filter: b,
				destination: `spacing/${f}.js`,
				format: "javascript/es6"
			}, {
				filter: b,
				format: "typescript/es6-declarations",
				destination: `spacing/${f}.d.ts`
			}]
		},
		json: {
			buildPath: i,
			transforms: ["name/kebab"],
			files: [{
				filter: b,
				destination: `spacing/flat/${f}.json`,
				format: "json/flat"
			}, {
				filter: b,
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
				filter: y,
				destination: `${f}.css`,
				format: "css/variables",
				options: {
					selector: p,
					outputReferences: !1
				}
			}]
		}
	};
	m && o && (x.tsNested = {
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
		platforms: x,
		...m && { hooks: { formats: { "typescript/nested": u } } }
	}).buildAllPlatforms();
}
function x() {
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
	}])), a = () => Object.fromEntries(n.map((e) => [e, Object.fromEntries(t.map((t) => [t, {
		horizontal: r(`{spacing.inset.${t}.horizontal}`),
		vertical: r(`{spacing.inset.${t}.vertical-${e}}`)
	}]))])), o = () => Object.fromEntries(t.map((e) => [e, {
		horizontal: r(`{spacing.inset.${e}.horizontal}`),
		vertical: r(`{spacing.inset.${e}.vertical-squared}`)
	}])), s = Object.fromEntries(t.flatMap((e) => [[`spacing-proportions-${e}-horizontal`, r(`{spacing.inset.${e}.horizontal}`)], [`spacing-proportions-${e}-vertical`, r(`{spacing.inset.${e}.vertical-squared}`)]]));
	return {
		generic: {
			gap: i(),
			space: i()
		},
		"spacing-proportions": a(),
		"selectable-space": o(),
		"container-space": {
			horizontal: r("{spacing.inset.md.horizontal}"),
			vertical: r("{spacing.inset.md.vertical-squared}")
		},
		"page-space": {
			horizontal: r("{spacing.inset.xl.horizontal}"),
			vertical: r("{spacing.inset.xl.vertical-squared}")
		},
		"generic-gap-horizontal": r("{spacing.horizontal.xs}"),
		"generic-gap-vertical": r("{spacing.vertical.xs}"),
		"generic-space-horizontal": r("{spacing.horizontal.xs}"),
		"generic-space-vertical": r("{spacing.vertical.xs}"),
		"selectable-space-horizontal": r("{spacing.inset.xs.horizontal}"),
		"selectable-space-vertical": r("{spacing.inset.xs.vertical-squared}"),
		...s,
		"selectable-gap-horizontal": r("{spacing.horizontal.xs}"),
		"selectable-gap-vertical": r("{spacing.vertical.xs}"),
		"container-gap-horizontal": r("{spacing.horizontal.md}"),
		"container-gap-vertical": r("{spacing.vertical.md}"),
		"page-gap-horizontal": r("{spacing.horizontal.xl}"),
		"page-gap-vertical": r("{spacing.vertical.xl}")
	};
}
async function S({ tokensDir: e, cssBuildPath: t, cssTransforms: n }) {
	let r = d.join(e, m, "👾 Primitives.Value.json"), i = d.join(e, m, "⛔️ Figma.Value.json"), o = d.join(e, h, "💎 Density.Spacious.json"), s = d.join(e, h, "💎 Density.Comfortable.json"), c = d.resolve(process.cwd(), "build"), u = d.join(c, "js"), g = d.join(c, "json"), S = d.join(c, "ts", _), C = d.join(c, "ts", v), w = await p.promises.readdir(S).catch(() => []);
	for (let e of w) e.endsWith(".ts") && e !== "spacious.ts" && e !== "comfortable.ts" && e !== "index.ts" && await p.promises.unlink(d.join(S, e));
	let T = await p.promises.readdir(C).catch(() => []), E = (e) => e.startsWith("font-family-");
	for (let e of T) e.endsWith(".ts") && e !== "index.ts" && !E(e) && await p.promises.unlink(d.join(C, e));
	let D = x(), O = d.join(f.tmpdir(), "eds-aggregated-spacing.json");
	await p.promises.writeFile(O, JSON.stringify(D, null, 2));
	let k = [
		"documentation",
		"padding-centred",
		"padding-baselined",
		"cap-height",
		"cap-rounded"
	], A = (e) => (t) => {
		let n = t.name.toLowerCase();
		return k.some((e) => n.includes(e)) || n.endsWith("-container") ? !1 : t.filePath.includes(e) || t.filePath.includes("eds-aggregated-spacing");
	}, ee = A("Spacious"), te = A("Comfortable");
	await b({
		source: [o, O],
		include: [r, i],
		jsBuildPath: u,
		jsonBuildPath: g,
		cssBuildPath: t,
		transforms: n,
		filter: ee,
		name: "spacious",
		selector: ":root, [data-density=\"spacious\"]",
		rootName: "spacing",
		tsBuildPath: S
	}), await b({
		source: [s, O],
		include: [r, i],
		jsBuildPath: u,
		jsonBuildPath: g,
		cssBuildPath: t,
		transforms: n,
		filter: te,
		name: "comfortable",
		selector: "[data-density=\"comfortable\"]",
		rootName: "spacing",
		tsBuildPath: S
	}), await p.promises.unlink(O);
	let j = [
		"/**",
		" * Do not edit directly, this file was auto-generated.",
		" */",
		"",
		"export { spacing as spacious } from './spacious'",
		"export { spacing as comfortable } from './comfortable'",
		""
	].join("\n");
	await p.promises.writeFile(d.join(S, "index.ts"), j);
	let M = d.join(e, m, "⛔️ Figma.Value.json"), N = d.join(e, h, "🪐 Space proportions.Squared.json"), ne = d.join(e, h, "🗣️ Semantic.Mode 1.json"), P = d.join(e, h, "🪐 Container space.Default.json"), F = d.join(e, h, "🪐 Page space.Default.json"), I = d.join(e, h), re = [
		d.join(I, "🪐 Container space.Default.json"),
		d.join(I, "🪐 Page space.Default.json"),
		d.join(I, "🪐 Selectable space.XS.json"),
		d.join(I, "🪐 Selectable space.SM.json"),
		d.join(I, "🪐 Selectable space.MD.json"),
		d.join(I, "🪐 Selectable space.LG.json"),
		d.join(I, "🪐 Selectable space.XL.json"),
		d.join(I, "🪐 Space proportions.Squared.json"),
		d.join(I, "🪐 Space proportions.Squished.json"),
		d.join(I, "🪐 Space proportions.Stretched.json")
	], L = d.join(I, "🅰️ Font size.XS.json"), R = d.join(I, "🅰️ Font family.UI Body.json"), z = [
		d.join(I, "🅰️ Font family.Header.json"),
		d.join(I, "🅰️ Font family.UI and Body.json"),
		d.join(I, "🅰️ Font family.UI Body.json")
	], ie = d.join(I, "🅰️ Font weight.Normal.json"), ae = d.join(I, "🅰️ Font baseline.Centred.json"), oe = d.join(I, "🅰️ Tracking.Normal.json"), B = d.join(I, "🅰️ Line height.Default.json"), V = d.join(I, "〰️ Stroke.Thin.json"), H = d.join(I, "⭕️ Border radius.Rounded.json"), U = d.join(I, "🖼️ Icon size.XS.json"), W = d.join(I, "📐 Size.XS.json"), G = d.join(I, "🪐 Horizontal gap.XS.json"), K = d.join(I, "🪐 Vertical gap.XS.json"), se = d.join(I, "🪐 Horizontal space.XS.json"), ce = d.join(I, "🪐 Vertical space.XS.json");
	await Promise.all([
		"Squished",
		"Squared",
		"Stretched"
	].map((i) => {
		let s = i.toLowerCase(), c = d.join(e, h, `🪐 Space proportions.${i}.json`), l = i === "Squared" ? ":root, [data-space-proportions=\"squared\"]" : `[data-space-proportions="${s}"]`;
		return y({
			include: [
				r,
				M,
				o,
				G,
				K
			],
			source: [
				c,
				P,
				F
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
				M,
				o,
				N
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
			M,
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
		M,
		o,
		N
	];
	await y({
		include: J,
		source: [P],
		buildPath: d.join(t, _),
		transforms: n,
		destination: "container-space.css",
		selector: ":root, [data-space-proportions]",
		filter: (e) => !!(e.path && e.path[0] === "container-space")
	}), await y({
		include: J,
		source: [F],
		buildPath: d.join(t, _),
		transforms: n,
		destination: "page-space.css",
		selector: ":root, [data-space-proportions]",
		filter: (e) => !!(e.path && e.path[0] === "page-space")
	}), await y({
		include: [
			r,
			M,
			o,
			s,
			V,
			H,
			U,
			W,
			...re,
			...z,
			L,
			ie,
			ae,
			oe,
			B,
			G,
			K,
			se,
			ce
		],
		source: [ne],
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
			M,
			o
		],
		source: [d.join(I, `🅰️ Font family.${e}.json`)],
		buildPath: d.join(t, v),
		transforms: n,
		destination: `font-family-${i}.css`,
		selector: `[data-font-family="${i}"]`,
		filter: (t) => a(t, [e]),
		rootName: "typography",
		tsBuildPath: C,
		splitLeafPrefixes: [
			"font-weight",
			"tracking",
			"line-height"
		]
	})), pe = X.map((e) => y({
		include: [
			r,
			M,
			o,
			...z
		],
		source: [d.join(I, `🅰️ Font size.${e}.json`)],
		buildPath: d.join(t, v),
		transforms: n,
		destination: `font-size-${e.toLowerCase()}.css`,
		selector: `[data-font-size="${e.toLowerCase()}"]`,
		filter: (t) => a(t, ["Font size", e]),
		rootName: "typography",
		tsBuildPath: C
	})), me = ue.map(({ mode: e, slug: i }) => y({
		include: [
			r,
			M,
			o,
			R,
			L
		],
		source: [d.join(I, `🅰️ Font weight.${e}.json`)],
		buildPath: d.join(t, v),
		transforms: n,
		destination: `font-weight-${i}.css`,
		selector: `[data-font-weight="${i}"]`,
		filter: (e) => !!(e.path && e.path[1] === "font-weight")
	})), he = de.map(({ mode: e, slug: i }) => y({
		include: [
			r,
			M,
			o,
			R,
			L
		],
		source: [d.join(I, `🅰️ Line height.${e}.json`)],
		buildPath: d.join(t, v),
		transforms: n,
		destination: `line-height-${i}.css`,
		selector: `[data-line-height="${i}"]`,
		filter: (e) => !!(e.path && e.path[1] === "line-height")
	})), ge = Z.map(({ mode: e, slug: i }) => y({
		include: [
			r,
			M,
			o,
			R,
			L
		],
		source: [d.join(I, `🅰️ Tracking.${e}.json`)],
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
		let t = e.toLowerCase(), n = d.join(C, `font-size-${t}.ts`), r = await p.promises.readFile(n, "utf-8");
		Q[t] = {
			iconSize: $(r, "iconSize"),
			gapHorizontal: $(r, "gapHorizontal"),
			gapVertical: $(r, "gapVertical")
		};
	}
	for (let { slug: e } of Y) {
		let t = d.join(C, `font-family-${e}.ts`), n = await p.promises.readFile(t, "utf-8");
		for (let e of X) {
			let r = e.toLowerCase(), i = l(r), a = Q[r], o = `      iconSize: ${a.iconSize},\n      gapHorizontal: ${a.gapHorizontal},\n      gapVertical: ${a.gapVertical},\n`, s = RegExp(`(^    ${i}: \\{\\n[\\s\\S]*?)(^    \\},)`, "m"), c = n.replace(s, `$1${o}$2`);
			if (c === n) throw Error(`size-extras inject: size cell "${i}" not found in ${t}`);
			n = c;
		}
		await p.promises.writeFile(t, n, "utf-8");
	}
	for (let e of X) {
		let t = e.toLowerCase();
		await p.promises.unlink(d.join(C, `font-size-${t}.ts`)).catch(() => {});
	}
}
//#endregion
//#region src/generate-variables/index.ts
var C = `${process.cwd()}/build`, w = `${C}/css`, T = `${C}/js`, E = `${C}/json`;
e.registerTransform(o), e.registerTransform(c), e.registerTransform(s), e.registerTransform(i);
async function D() {
	let e = `${process.cwd()}/tokens`;
	console.info("Running Style Dictionary build script"), console.info("Tokens directory:", e), await S({
		tokensDir: e,
		cssBuildPath: w,
		cssTransforms: [
			"name/kebab",
			r,
			n,
			t
		]
	});
}
D().then(() => {
	console.log("✅ Variables generated successfully");
}).catch((e) => {
	console.error("❌ Error generating color variables:", e);
});
//#endregion
export { w as cssBuildPath, D as generate, T as jsBuildPath, E as jsonBuildPath };
