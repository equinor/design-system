import { StyleDictionary as Qe } from "style-dictionary-utils";
import { createDensitySpaceToggleTransform as ko, _extend as wr, includeTokenFilter as ut, PX_TO_REM_NAME as jr, PX_FORMATTED_NAME as Pr, FONT_QUOTE_NAME as Nr, pxFormatted as To, pxTransform as Ro, pxToRem as Io, fontQuote as jo } from "@equinor/eds-tokens-build";
import ze from "path";
import { readJsonFiles as Po } from "@equinor/eds-tokens-sync";
const Qn = ei(), No = ei(!0);
function ei(e = !1) {
  return new RegExp(
    `${e ? "(" : ""}\\{${e ? "" : "("}[^}]+${e ? "" : ")"}\\}${e ? ")" : ""}`,
    "g"
  );
}
function Vr(e) {
  const r = Qn;
  if (typeof e == "string")
    return !!e.match(r);
  if (typeof e == "object") {
    let t = !1;
    for (const n in e)
      if (Object.hasOwn(e, n)) {
        const i = e[n];
        if (Vr(i)) {
          t = !0;
          break;
        }
      }
    return t;
  }
  return !1;
}
function Fo(e) {
  if (typeof e != "string")
    throw new Error("Getting path from name failed. Token name must be a string");
  return e.split(".");
}
function Bo(e, r) {
  if (r instanceof Map)
    return r.get(`{${e.join(".")}}`);
  let t = r;
  if (Array.isArray(e)) {
    for (let n = 0; n < e.length; n++)
      if (typeof t[e[n]] < "u")
        t = t[e[n]];
      else
        return;
    return (
      /** @type {Token} */
      t
    );
  }
}
class Co {
  constructor() {
    this.groupedMessages = {}, this.GROUP = {
      PropertyReferenceWarnings: "Property Reference Errors",
      PropertyValueCollisions: "Property Value Collisions",
      TemplateDeprecationWarnings: "Template Deprecation Warnings",
      RegisterTemplateDeprecationWarnings: "Register Template Deprecation Warnings",
      SassMapFormatDeprecationWarnings: "Sass Map Format Deprecation Warnings",
      MissingRegisterTransformErrors: "Missing Register Transform Errors",
      PropertyNameCollisionWarnings: "Property Name Collision Warnings",
      FilteredOutputReferences: "Filtered Output Reference Warnings",
      UnknownCSSFontProperties: "Unknown CSS Font Shorthand Properties",
      TransformErrors: "Transform Errors"
    };
  }
  /**
   *
   * @param {string} messageGroup
   * @returns {string[]}
   */
  flush(r) {
    const t = this.fetchMessages(r);
    return this.clear(r), t;
  }
  /**
   * @param {string} messageGroup
   * @param {string} message
   */
  add(r, t) {
    r && (this.groupedMessages[r] || (this.groupedMessages[r] = []), this.groupedMessages[r].indexOf(t) === -1 && this.groupedMessages[r].push(t));
  }
  /**
   * @param {string} messageGroup
   * @param {string} message
   */
  remove(r, t) {
    if (r && this.groupedMessages[r]?.length > 0) {
      const n = this.groupedMessages[r].indexOf(t);
      n !== -1 && this.groupedMessages[r].splice(n, 1);
    }
  }
  /**
   *
   * @param {string} messageGroup
   * @returns {number}
   */
  count(r) {
    return this.groupedMessages[r] ? this.groupedMessages[r].length : 0;
  }
  /**
   *
   * @param {string} messageGroup
   * @returns {string[]}
   */
  fetchMessages(r) {
    return r && this.groupedMessages[r] || [];
  }
  /**
   * @param {string} messageGroup
   */
  clear(r) {
    r && this.groupedMessages[r] && delete this.groupedMessages[r];
  }
}
const ft = new Co();
ft.GROUP.FilteredOutputReferences;
function Fr(e) {
  if (!Array.isArray(e))
    throw new Error("Getting name for path failed. Token path must be an array of strings");
  return e.join(".");
}
const yn = ft.GROUP.PropertyReferenceWarnings;
function Do(e, r, t) {
  return ti(e, r, t);
}
function ti(e, r, {
  usesDtcg: t = !1,
  warnImmediately: n = !0,
  // for internal usage
  ignorePaths: i = /* @__PURE__ */ new Set(),
  current_context: s = "",
  stack: f = [],
  foundCirc: u = {},
  firstIteration: b = !0,
  objectsOnly: g = !1
} = {}) {
  let A = e;
  const w = t ? "$value" : "value", j = No;
  return b && s && f.push(Fr([s])), e.replace(j, (P) => {
    let x = `{${P.slice(1, P.length - 1).trim()}}`;
    if (i.has(P))
      return "";
    f.push(P);
    const p = r.get(x)?.[w], y = (m) => g && typeof m != "object" ? A : P === A ? m : `${A}`.replace(P, `${m}`);
    if (typeof p < "u")
      if (typeof p == "string" && Vr(p)) {
        if (!Object.hasOwn(u, p)) if (f.indexOf(p) !== -1) {
          const m = f.indexOf(p), S = f.slice(m);
          S.forEach(function(d) {
            u[d] = !0;
          }), S.push(p);
          const _ = `Circular definition cycle for ${s ?? ""} => ${S.join(", ")}`;
          if (n)
            throw new Error(_);
          ft.add(yn, _);
        } else {
          const m = ti(p, r, {
            ignorePaths: i,
            usesDtcg: t,
            warnImmediately: n,
            current_context: s,
            stack: f,
            foundCirc: u,
            firstIteration: !1
          });
          A = y(m);
        }
      } else
        A = y(p);
    else {
      const m = `${s ? `${s} ` : ""}tries to reference ${e}, which is not defined.`;
      if (n)
        throw new Error(m);
      ft.add(yn, m);
    }
    return f.pop(), P;
  }), A;
}
const gn = ft.GROUP.PropertyReferenceWarnings;
function Lo(e, r, t) {
  return r instanceof Map ? Do(e, r, t) : ri(e, r, t);
}
function ri(e, r, {
  usesDtcg: t = !1,
  warnImmediately: n = !0,
  // for internal usage
  ignorePaths: i = [],
  current_context: s = [],
  stack: f = [],
  foundCirc: u = {},
  firstIteration: b = !0
} = {}) {
  const g = Qn;
  let A = e, w;
  const j = t ? "$value" : "value";
  return b && s.length > 0 && f.push(Fr(s)), e.replace(g, (P, x) => {
    x = x.trim();
    const p = Fo(x), y = j === p[p.length - 1];
    if (y && i.indexOf(x) !== -1)
      return "";
    if (!y && i.indexOf(`${x}.${j}`) !== -1)
      return "";
    if (f.push(x), w = Bo(p, r), !y && w && Object.hasOwn(w, j) && (w = w[j]), typeof w < "u")
      if (typeof w == "string" || typeof w == "number") {
        if (A = e.replace(P, `${w}`), Vr(A)) {
          const m = (
            /** @type {string} */
            A.slice(1, -1)
          );
          if (!Object.hasOwn(u, m)) if (f.indexOf(m) !== -1) {
            const S = f.indexOf(m), _ = f.slice(S);
            _.forEach(function(E) {
              u[E] = !0;
            }), _.push(m);
            const d = `Circular definition cycle: ${_.join(", ")}`;
            if (n)
              throw new Error(d);
            ft.add(
              gn,
              "Circular definition cycle:  " + _.join(", ")
            );
          } else
            A = ri(
              /** @type {string} */
              A,
              r,
              {
                ignorePaths: i,
                usesDtcg: t,
                warnImmediately: n,
                current_context: s,
                stack: f,
                foundCirc: u,
                firstIteration: !1
              }
            );
        }
        typeof w == "number" && w.toString() === A && (A = w);
      } else
        A = w;
    else {
      const m = Fr(s), S = `${m ? `${m} ` : ""}tries to reference ${x}, which is not defined.`;
      if (n)
        throw new Error(S);
      ft.add(gn, S), A = w;
    }
    return f.pop(), "";
  }), A;
}
ft.GROUP.FilteredOutputReferences;
function Uo(e, { dictionary: r, usesDtcg: t }) {
  const n = t ? e.original.$value : e.original.value, i = t ? e.$value : e.value;
  return typeof n == "string" ? i === Lo(n, r.unfilteredTokens ?? r.tokens, {
    usesDtcg: t,
    warnImmediately: !1
  }) : !1;
}
const Ft = 15, Br = 30, Cr = 19, Mo = 29, sr = 256, Gr = sr + 1 + Mo, vn = 2 * Gr + 1, kt = 256, qo = 7, bn = 16, wn = 17, _n = 18, _r = 16, ar = -1, Wo = 1, Gt = 2, $o = 0, xt = 0, xn = 1, Vo = 3, Le = 4, Ge = 0, ni = 1, Ht = 2, He = -2, Go = -3, wt = -5;
function fr(e) {
  return ur(e.map(([r, t]) => new Array(r).fill(t, 0, r)));
}
function ur(e) {
  return e.reduce((r, t) => r.concat(Array.isArray(t) ? ur(t) : t), []);
}
const En = [0, 1, 2, 3].concat(...fr([
  [2, 4],
  [2, 5],
  [4, 6],
  [4, 7],
  [8, 8],
  [8, 9],
  [16, 10],
  [16, 11],
  [32, 12],
  [32, 13],
  [64, 14],
  [64, 15],
  [2, 0],
  [1, 16],
  [1, 17],
  [2, 18],
  [2, 19],
  [4, 20],
  [4, 21],
  [8, 22],
  [8, 23],
  [16, 24],
  [16, 25],
  [32, 26],
  [32, 27],
  [64, 28],
  [64, 29]
]));
function Ie() {
  const e = this;
  function r(i) {
    const s = e.dyn_tree, f = e.stat_desc.static_tree, u = e.stat_desc.extra_bits, b = e.stat_desc.extra_base, g = e.stat_desc.max_length;
    let A, w, j, P, x, p, y = 0;
    for (P = 0; P <= Ft; P++)
      i.bl_count[P] = 0;
    for (s[i.heap[i.heap_max] * 2 + 1] = 0, A = i.heap_max + 1; A < vn; A++)
      w = i.heap[A], P = s[s[w * 2 + 1] * 2 + 1] + 1, P > g && (P = g, y++), s[w * 2 + 1] = P, !(w > e.max_code) && (i.bl_count[P]++, x = 0, w >= b && (x = u[w - b]), p = s[w * 2], i.opt_len += p * (P + x), f && (i.static_len += p * (f[w * 2 + 1] + x)));
    if (y !== 0) {
      do {
        for (P = g - 1; i.bl_count[P] === 0; )
          P--;
        i.bl_count[P]--, i.bl_count[P + 1] += 2, i.bl_count[g]--, y -= 2;
      } while (y > 0);
      for (P = g; P !== 0; P--)
        for (w = i.bl_count[P]; w !== 0; )
          j = i.heap[--A], !(j > e.max_code) && (s[j * 2 + 1] != P && (i.opt_len += (P - s[j * 2 + 1]) * s[j * 2], s[j * 2 + 1] = P), w--);
    }
  }
  function t(i, s) {
    let f = 0;
    do
      f |= i & 1, i >>>= 1, f <<= 1;
    while (--s > 0);
    return f >>> 1;
  }
  function n(i, s, f) {
    const u = [];
    let b = 0, g, A, w;
    for (g = 1; g <= Ft; g++)
      u[g] = b = b + f[g - 1] << 1;
    for (A = 0; A <= s; A++)
      w = i[A * 2 + 1], w !== 0 && (i[A * 2] = t(u[w]++, w));
  }
  e.build_tree = function(i) {
    const s = e.dyn_tree, f = e.stat_desc.static_tree, u = e.stat_desc.elems;
    let b, g, A = -1, w;
    for (i.heap_len = 0, i.heap_max = vn, b = 0; b < u; b++)
      s[b * 2] !== 0 ? (i.heap[++i.heap_len] = A = b, i.depth[b] = 0) : s[b * 2 + 1] = 0;
    for (; i.heap_len < 2; )
      w = i.heap[++i.heap_len] = A < 2 ? ++A : 0, s[w * 2] = 1, i.depth[w] = 0, i.opt_len--, f && (i.static_len -= f[w * 2 + 1]);
    for (e.max_code = A, b = Math.floor(i.heap_len / 2); b >= 1; b--)
      i.pqdownheap(s, b);
    w = u;
    do
      b = i.heap[1], i.heap[1] = i.heap[i.heap_len--], i.pqdownheap(s, 1), g = i.heap[1], i.heap[--i.heap_max] = b, i.heap[--i.heap_max] = g, s[w * 2] = s[b * 2] + s[g * 2], i.depth[w] = Math.max(i.depth[b], i.depth[g]) + 1, s[b * 2 + 1] = s[g * 2 + 1] = w, i.heap[1] = w++, i.pqdownheap(s, 1);
    while (i.heap_len >= 2);
    i.heap[--i.heap_max] = i.heap[1], r(i), n(s, e.max_code, i.bl_count);
  };
}
Ie._length_code = [0, 1, 2, 3, 4, 5, 6, 7].concat(...fr([
  [2, 8],
  [2, 9],
  [2, 10],
  [2, 11],
  [4, 12],
  [4, 13],
  [4, 14],
  [4, 15],
  [8, 16],
  [8, 17],
  [8, 18],
  [8, 19],
  [16, 20],
  [16, 21],
  [16, 22],
  [16, 23],
  [32, 24],
  [32, 25],
  [32, 26],
  [31, 27],
  [1, 28]
]));
Ie.base_length = [0, 1, 2, 3, 4, 5, 6, 7, 8, 10, 12, 14, 16, 20, 24, 28, 32, 40, 48, 56, 64, 80, 96, 112, 128, 160, 192, 224, 0];
Ie.base_dist = [
  0,
  1,
  2,
  3,
  4,
  6,
  8,
  12,
  16,
  24,
  32,
  48,
  64,
  96,
  128,
  192,
  256,
  384,
  512,
  768,
  1024,
  1536,
  2048,
  3072,
  4096,
  6144,
  8192,
  12288,
  16384,
  24576
];
Ie.d_code = function(e) {
  return e < 256 ? En[e] : En[256 + (e >>> 7)];
};
Ie.extra_lbits = [0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 2, 2, 2, 2, 3, 3, 3, 3, 4, 4, 4, 4, 5, 5, 5, 5, 0];
Ie.extra_dbits = [0, 0, 0, 0, 1, 1, 2, 2, 3, 3, 4, 4, 5, 5, 6, 6, 7, 7, 8, 8, 9, 9, 10, 10, 11, 11, 12, 12, 13, 13];
Ie.extra_blbits = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 3, 7];
Ie.bl_order = [16, 17, 18, 0, 8, 7, 9, 6, 10, 5, 11, 4, 12, 3, 13, 2, 14, 1, 15];
function Ce(e, r, t, n, i) {
  const s = this;
  s.static_tree = e, s.extra_bits = r, s.extra_base = t, s.elems = n, s.max_length = i;
}
const Ho = [
  12,
  140,
  76,
  204,
  44,
  172,
  108,
  236,
  28,
  156,
  92,
  220,
  60,
  188,
  124,
  252,
  2,
  130,
  66,
  194,
  34,
  162,
  98,
  226,
  18,
  146,
  82,
  210,
  50,
  178,
  114,
  242,
  10,
  138,
  74,
  202,
  42,
  170,
  106,
  234,
  26,
  154,
  90,
  218,
  58,
  186,
  122,
  250,
  6,
  134,
  70,
  198,
  38,
  166,
  102,
  230,
  22,
  150,
  86,
  214,
  54,
  182,
  118,
  246,
  14,
  142,
  78,
  206,
  46,
  174,
  110,
  238,
  30,
  158,
  94,
  222,
  62,
  190,
  126,
  254,
  1,
  129,
  65,
  193,
  33,
  161,
  97,
  225,
  17,
  145,
  81,
  209,
  49,
  177,
  113,
  241,
  9,
  137,
  73,
  201,
  41,
  169,
  105,
  233,
  25,
  153,
  89,
  217,
  57,
  185,
  121,
  249,
  5,
  133,
  69,
  197,
  37,
  165,
  101,
  229,
  21,
  149,
  85,
  213,
  53,
  181,
  117,
  245,
  13,
  141,
  77,
  205,
  45,
  173,
  109,
  237,
  29,
  157,
  93,
  221,
  61,
  189,
  125,
  253,
  19,
  275,
  147,
  403,
  83,
  339,
  211,
  467,
  51,
  307,
  179,
  435,
  115,
  371,
  243,
  499,
  11,
  267,
  139,
  395,
  75,
  331,
  203,
  459,
  43,
  299,
  171,
  427,
  107,
  363,
  235,
  491,
  27,
  283,
  155,
  411,
  91,
  347,
  219,
  475,
  59,
  315,
  187,
  443,
  123,
  379,
  251,
  507,
  7,
  263,
  135,
  391,
  71,
  327,
  199,
  455,
  39,
  295,
  167,
  423,
  103,
  359,
  231,
  487,
  23,
  279,
  151,
  407,
  87,
  343,
  215,
  471,
  55,
  311,
  183,
  439,
  119,
  375,
  247,
  503,
  15,
  271,
  143,
  399,
  79,
  335,
  207,
  463,
  47,
  303,
  175,
  431,
  111,
  367,
  239,
  495,
  31,
  287,
  159,
  415,
  95,
  351,
  223,
  479,
  63,
  319,
  191,
  447,
  127,
  383,
  255,
  511,
  0,
  64,
  32,
  96,
  16,
  80,
  48,
  112,
  8,
  72,
  40,
  104,
  24,
  88,
  56,
  120,
  4,
  68,
  36,
  100,
  20,
  84,
  52,
  116,
  3,
  131,
  67,
  195,
  35,
  163,
  99,
  227
], Yo = fr([[144, 8], [112, 9], [24, 7], [8, 8]]);
Ce.static_ltree = ur(Ho.map((e, r) => [e, Yo[r]]));
const Ko = [0, 16, 8, 24, 4, 20, 12, 28, 2, 18, 10, 26, 6, 22, 14, 30, 1, 17, 9, 25, 5, 21, 13, 29, 3, 19, 11, 27, 7, 23], Xo = fr([[30, 5]]);
Ce.static_dtree = ur(Ko.map((e, r) => [e, Xo[r]]));
Ce.static_l_desc = new Ce(Ce.static_ltree, Ie.extra_lbits, sr + 1, Gr, Ft);
Ce.static_d_desc = new Ce(Ce.static_dtree, Ie.extra_dbits, 0, Br, Ft);
Ce.static_bl_desc = new Ce(null, Ie.extra_blbits, 0, Cr, qo);
const Jo = 9, Zo = 8;
function Ye(e, r, t, n, i) {
  const s = this;
  s.good_length = e, s.max_lazy = r, s.nice_length = t, s.max_chain = n, s.func = i;
}
const ii = 0, tr = 1, pt = 2, Ve = [
  new Ye(0, 0, 0, 0, ii),
  new Ye(4, 4, 8, 4, tr),
  new Ye(4, 5, 16, 8, tr),
  new Ye(4, 6, 32, 32, tr),
  new Ye(4, 4, 16, 16, pt),
  new Ye(8, 16, 32, 32, pt),
  new Ye(8, 16, 128, 128, pt),
  new Ye(8, 32, 128, 256, pt),
  new Ye(32, 128, 258, 1024, pt),
  new Ye(32, 258, 258, 4096, pt)
], Yt = [
  "need dictionary",
  // Z_NEED_DICT
  // 2
  "stream end",
  // Z_STREAM_END 1
  "",
  // Z_OK 0
  "",
  // Z_ERRNO (-1)
  "stream error",
  // Z_STREAM_ERROR (-2)
  "data error",
  // Z_DATA_ERROR (-3)
  "",
  // Z_MEM_ERROR (-4)
  "buffer error",
  // Z_BUF_ERROR (-5)
  "",
  // Z_VERSION_ERROR (-6)
  ""
], We = 0, Kt = 1, Tt = 2, Xt = 3, zo = 32, xr = 42, Jt = 113, Rt = 666, Er = 8, Qo = 0, Sr = 1, es = 2, Pe = 3, rr = 258, Me = rr + Pe + 1;
function Sn(e, r, t, n) {
  const i = e[r * 2], s = e[t * 2];
  return i < s || i == s && n[r] <= n[t];
}
function ts() {
  const e = this;
  let r, t, n, i, s, f, u, b, g, A, w, j, P, x, p, y, m, S, _, d, E, O, T, F, C, J, Z, se, le, pe, me, he, X;
  const te = new Ie(), ae = new Ie(), fe = new Ie();
  e.depth = [];
  let ee, R, D, W, re, M;
  e.bl_count = [], e.heap = [], me = [], he = [], X = [];
  function $() {
    g = 2 * s, w[P - 1] = 0;
    for (let V = 0; V < P - 1; V++)
      w[V] = 0;
    J = Ve[Z].max_lazy, le = Ve[Z].good_length, pe = Ve[Z].nice_length, C = Ve[Z].max_chain, E = 0, m = 0, T = 0, S = F = Pe - 1, d = 0, j = 0;
  }
  function q() {
    let V;
    for (V = 0; V < Gr; V++)
      me[V * 2] = 0;
    for (V = 0; V < Br; V++)
      he[V * 2] = 0;
    for (V = 0; V < Cr; V++)
      X[V * 2] = 0;
    me[kt * 2] = 1, e.opt_len = e.static_len = 0, R = D = 0;
  }
  function L() {
    te.dyn_tree = me, te.stat_desc = Ce.static_l_desc, ae.dyn_tree = he, ae.stat_desc = Ce.static_d_desc, fe.dyn_tree = X, fe.stat_desc = Ce.static_bl_desc, re = 0, M = 0, W = 8, q();
  }
  e.pqdownheap = function(V, U) {
    const a = e.heap, l = a[U];
    let v = U << 1;
    for (; v <= e.heap_len && (v < e.heap_len && Sn(V, a[v + 1], a[v], e.depth) && v++, !Sn(V, l, a[v], e.depth)); )
      a[U] = a[v], U = v, v <<= 1;
    a[U] = l;
  };
  function G(V, U) {
    let a = -1, l, v = V[1], I = 0, N = 7, Y = 4;
    v === 0 && (N = 138, Y = 3), V[(U + 1) * 2 + 1] = 65535;
    for (let ne = 0; ne <= U; ne++)
      l = v, v = V[(ne + 1) * 2 + 1], !(++I < N && l == v) && (I < Y ? X[l * 2] += I : l !== 0 ? (l != a && X[l * 2]++, X[bn * 2]++) : I <= 10 ? X[wn * 2]++ : X[_n * 2]++, I = 0, a = l, v === 0 ? (N = 138, Y = 3) : l == v ? (N = 6, Y = 3) : (N = 7, Y = 4));
  }
  function Q() {
    let V;
    for (G(me, te.max_code), G(he, ae.max_code), fe.build_tree(e), V = Cr - 1; V >= 3 && X[Ie.bl_order[V] * 2 + 1] === 0; V--)
      ;
    return e.opt_len += 3 * (V + 1) + 5 + 5 + 4, V;
  }
  function oe(V) {
    e.pending_buf[e.pending++] = V;
  }
  function de(V) {
    oe(V & 255), oe(V >>> 8 & 255);
  }
  function ge(V) {
    oe(V >> 8 & 255), oe(V & 255 & 255);
  }
  function ye(V, U) {
    let a;
    const l = U;
    M > _r - l ? (a = V, re |= a << M & 65535, de(re), re = a >>> _r - M, M += l - _r) : (re |= V << M & 65535, M += l);
  }
  function be(V, U) {
    const a = V * 2;
    ye(U[a] & 65535, U[a + 1] & 65535);
  }
  function Oe(V, U) {
    let a, l = -1, v, I = V[1], N = 0, Y = 7, ne = 4;
    for (I === 0 && (Y = 138, ne = 3), a = 0; a <= U; a++)
      if (v = I, I = V[(a + 1) * 2 + 1], !(++N < Y && v == I)) {
        if (N < ne)
          do
            be(v, X);
          while (--N !== 0);
        else v !== 0 ? (v != l && (be(v, X), N--), be(bn, X), ye(N - 3, 2)) : N <= 10 ? (be(wn, X), ye(N - 3, 3)) : (be(_n, X), ye(N - 11, 7));
        N = 0, l = v, I === 0 ? (Y = 138, ne = 3) : v == I ? (Y = 6, ne = 3) : (Y = 7, ne = 4);
      }
  }
  function _e(V, U, a) {
    let l;
    for (ye(V - 257, 5), ye(U - 1, 5), ye(a - 4, 4), l = 0; l < a; l++)
      ye(X[Ie.bl_order[l] * 2 + 1], 3);
    Oe(me, V - 1), Oe(he, U - 1);
  }
  function ie() {
    M == 16 ? (de(re), re = 0, M = 0) : M >= 8 && (oe(re & 255), re >>>= 8, M -= 8);
  }
  function Re() {
    ye(Sr << 1, 3), be(kt, Ce.static_ltree), ie(), 1 + W + 10 - M < 9 && (ye(Sr << 1, 3), be(kt, Ce.static_ltree), ie()), W = 7;
  }
  function xe(V, U) {
    let a, l, v;
    if (e.dist_buf[R] = V, e.lc_buf[R] = U & 255, R++, V === 0 ? me[U * 2]++ : (D++, V--, me[(Ie._length_code[U] + sr + 1) * 2]++, he[Ie.d_code(V) * 2]++), (R & 8191) === 0 && Z > 2) {
      for (a = R * 8, l = E - m, v = 0; v < Br; v++)
        a += he[v * 2] * (5 + Ie.extra_dbits[v]);
      if (a >>>= 3, D < Math.floor(R / 2) && a < Math.floor(l / 2))
        return !0;
    }
    return R == ee - 1;
  }
  function Ae(V, U) {
    let a, l, v = 0, I, N;
    if (R !== 0)
      do
        a = e.dist_buf[v], l = e.lc_buf[v], v++, a === 0 ? be(l, V) : (I = Ie._length_code[l], be(I + sr + 1, V), N = Ie.extra_lbits[I], N !== 0 && (l -= Ie.base_length[I], ye(l, N)), a--, I = Ie.d_code(a), be(I, U), N = Ie.extra_dbits[I], N !== 0 && (a -= Ie.base_dist[I], ye(a, N)));
      while (v < R);
    be(kt, V), W = V[kt * 2 + 1];
  }
  function Ee() {
    M > 8 ? de(re) : M > 0 && oe(re & 255), re = 0, M = 0;
  }
  function Ne(V, U, a) {
    Ee(), W = 8, de(U), de(~U), e.pending_buf.set(b.subarray(V, V + U), e.pending), e.pending += U;
  }
  function ke(V, U, a) {
    ye((Qo << 1) + (a ? 1 : 0), 3), Ne(V, U);
  }
  function K(V, U, a) {
    let l, v, I = 0;
    Z > 0 ? (te.build_tree(e), ae.build_tree(e), I = Q(), l = e.opt_len + 3 + 7 >>> 3, v = e.static_len + 3 + 7 >>> 3, v <= l && (l = v)) : l = v = U + 5, U + 4 <= l && V != -1 ? ke(V, U, a) : v == l ? (ye((Sr << 1) + (a ? 1 : 0), 3), Ae(Ce.static_ltree, Ce.static_dtree)) : (ye((es << 1) + (a ? 1 : 0), 3), _e(te.max_code + 1, ae.max_code + 1, I + 1), Ae(me, he)), q(), a && Ee();
  }
  function h(V) {
    K(m >= 0 ? m : -1, E - m, V), m = E, r.flush_pending();
  }
  function o() {
    let V, U, a, l;
    do {
      if (l = g - T - E, l === 0 && E === 0 && T === 0)
        l = s;
      else if (l == -1)
        l--;
      else if (E >= s + s - Me) {
        b.set(b.subarray(s, s + s), 0), O -= s, E -= s, m -= s, V = P, a = V;
        do
          U = w[--a] & 65535, w[a] = U >= s ? U - s : 0;
        while (--V !== 0);
        V = s, a = V;
        do
          U = A[--a] & 65535, A[a] = U >= s ? U - s : 0;
        while (--V !== 0);
        l += s;
      }
      if (r.avail_in === 0)
        return;
      V = r.read_buf(b, E + T, l), T += V, T >= Pe && (j = b[E] & 255, j = (j << y ^ b[E + 1] & 255) & p);
    } while (T < Me && r.avail_in !== 0);
  }
  function c(V) {
    let U = 65535, a;
    for (U > n - 5 && (U = n - 5); ; ) {
      if (T <= 1) {
        if (o(), T === 0 && V == xt)
          return We;
        if (T === 0)
          break;
      }
      if (E += T, T = 0, a = m + U, (E === 0 || E >= a) && (T = E - a, E = a, h(!1), r.avail_out === 0) || E - m >= s - Me && (h(!1), r.avail_out === 0))
        return We;
    }
    return h(V == Le), r.avail_out === 0 ? V == Le ? Tt : We : V == Le ? Xt : Kt;
  }
  function k(V) {
    let U = C, a = E, l, v, I = F;
    const N = E > s - Me ? E - (s - Me) : 0;
    let Y = pe;
    const ne = u, ue = E + rr;
    let ve = b[a + I - 1], Se = b[a + I];
    F >= le && (U >>= 2), Y > T && (Y = T);
    do
      if (l = V, !(b[l + I] != Se || b[l + I - 1] != ve || b[l] != b[a] || b[++l] != b[a + 1])) {
        a += 2, l++;
        do
          ;
        while (b[++a] == b[++l] && b[++a] == b[++l] && b[++a] == b[++l] && b[++a] == b[++l] && b[++a] == b[++l] && b[++a] == b[++l] && b[++a] == b[++l] && b[++a] == b[++l] && a < ue);
        if (v = rr - (ue - a), a = ue - rr, v > I) {
          if (O = V, I = v, v >= Y)
            break;
          ve = b[a + I - 1], Se = b[a + I];
        }
      }
    while ((V = A[V & ne] & 65535) > N && --U !== 0);
    return I <= T ? I : T;
  }
  function B(V) {
    let U = 0, a;
    for (; ; ) {
      if (T < Me) {
        if (o(), T < Me && V == xt)
          return We;
        if (T === 0)
          break;
      }
      if (T >= Pe && (j = (j << y ^ b[E + (Pe - 1)] & 255) & p, U = w[j] & 65535, A[E & u] = w[j], w[j] = E), U !== 0 && (E - U & 65535) <= s - Me && se != Gt && (S = k(U)), S >= Pe)
        if (a = xe(E - O, S - Pe), T -= S, S <= J && T >= Pe) {
          S--;
          do
            E++, j = (j << y ^ b[E + (Pe - 1)] & 255) & p, U = w[j] & 65535, A[E & u] = w[j], w[j] = E;
          while (--S !== 0);
          E++;
        } else
          E += S, S = 0, j = b[E] & 255, j = (j << y ^ b[E + 1] & 255) & p;
      else
        a = xe(0, b[E] & 255), T--, E++;
      if (a && (h(!1), r.avail_out === 0))
        return We;
    }
    return h(V == Le), r.avail_out === 0 ? V == Le ? Tt : We : V == Le ? Xt : Kt;
  }
  function H(V) {
    let U = 0, a, l;
    for (; ; ) {
      if (T < Me) {
        if (o(), T < Me && V == xt)
          return We;
        if (T === 0)
          break;
      }
      if (T >= Pe && (j = (j << y ^ b[E + (Pe - 1)] & 255) & p, U = w[j] & 65535, A[E & u] = w[j], w[j] = E), F = S, _ = O, S = Pe - 1, U !== 0 && F < J && (E - U & 65535) <= s - Me && (se != Gt && (S = k(U)), S <= 5 && (se == Wo || S == Pe && E - O > 4096) && (S = Pe - 1)), F >= Pe && S <= F) {
        l = E + T - Pe, a = xe(E - 1 - _, F - Pe), T -= F - 1, F -= 2;
        do
          ++E <= l && (j = (j << y ^ b[E + (Pe - 1)] & 255) & p, U = w[j] & 65535, A[E & u] = w[j], w[j] = E);
        while (--F !== 0);
        if (d = 0, S = Pe - 1, E++, a && (h(!1), r.avail_out === 0))
          return We;
      } else if (d !== 0) {
        if (a = xe(0, b[E - 1] & 255), a && h(!1), E++, T--, r.avail_out === 0)
          return We;
      } else
        d = 1, E++, T--;
    }
    return d !== 0 && (a = xe(0, b[E - 1] & 255), d = 0), h(V == Le), r.avail_out === 0 ? V == Le ? Tt : We : V == Le ? Xt : Kt;
  }
  function z(V) {
    return V.total_in = V.total_out = 0, V.msg = null, e.pending = 0, e.pending_out = 0, t = Jt, i = xt, L(), $(), Ge;
  }
  e.deflateInit = function(V, U, a, l, v, I) {
    return l || (l = Er), v || (v = Zo), I || (I = $o), V.msg = null, U == ar && (U = 6), v < 1 || v > Jo || l != Er || a < 9 || a > 15 || U < 0 || U > 9 || I < 0 || I > Gt ? He : (V.dstate = e, f = a, s = 1 << f, u = s - 1, x = v + 7, P = 1 << x, p = P - 1, y = Math.floor((x + Pe - 1) / Pe), b = new Uint8Array(s * 2), A = [], w = [], ee = 1 << v + 6, e.pending_buf = new Uint8Array(ee * 4), n = ee * 4, e.dist_buf = new Uint16Array(ee), e.lc_buf = new Uint8Array(ee), Z = U, se = I, z(V));
  }, e.deflateEnd = function() {
    return t != xr && t != Jt && t != Rt ? He : (e.lc_buf = null, e.dist_buf = null, e.pending_buf = null, w = null, A = null, b = null, e.dstate = null, t == Jt ? Go : Ge);
  }, e.deflateParams = function(V, U, a) {
    let l = Ge;
    return U == ar && (U = 6), U < 0 || U > 9 || a < 0 || a > Gt ? He : (Ve[Z].func != Ve[U].func && V.total_in !== 0 && (l = V.deflate(xn)), Z != U && (Z = U, J = Ve[Z].max_lazy, le = Ve[Z].good_length, pe = Ve[Z].nice_length, C = Ve[Z].max_chain), se = a, l);
  }, e.deflateSetDictionary = function(V, U, a) {
    let l = a, v, I = 0;
    if (!U || t != xr)
      return He;
    if (l < Pe)
      return Ge;
    for (l > s - Me && (l = s - Me, I = a - l), b.set(U.subarray(I, I + l), 0), E = l, m = l, j = b[0] & 255, j = (j << y ^ b[1] & 255) & p, v = 0; v <= l - Pe; v++)
      j = (j << y ^ b[v + (Pe - 1)] & 255) & p, A[v & u] = w[j], w[j] = v;
    return Ge;
  }, e.deflate = function(V, U) {
    let a, l, v, I, N;
    if (U > Le || U < 0)
      return He;
    if (!V.next_out || !V.next_in && V.avail_in !== 0 || t == Rt && U != Le)
      return V.msg = Yt[Ht - He], He;
    if (V.avail_out === 0)
      return V.msg = Yt[Ht - wt], wt;
    if (r = V, I = i, i = U, t == xr && (l = Er + (f - 8 << 4) << 8, v = (Z - 1 & 255) >> 1, v > 3 && (v = 3), l |= v << 6, E !== 0 && (l |= zo), l += 31 - l % 31, t = Jt, ge(l)), e.pending !== 0) {
      if (r.flush_pending(), r.avail_out === 0)
        return i = -1, Ge;
    } else if (r.avail_in === 0 && U <= I && U != Le)
      return r.msg = Yt[Ht - wt], wt;
    if (t == Rt && r.avail_in !== 0)
      return V.msg = Yt[Ht - wt], wt;
    if (r.avail_in !== 0 || T !== 0 || U != xt && t != Rt) {
      switch (N = -1, Ve[Z].func) {
        case ii:
          N = c(U);
          break;
        case tr:
          N = B(U);
          break;
        case pt:
          N = H(U);
          break;
      }
      if ((N == Tt || N == Xt) && (t = Rt), N == We || N == Tt)
        return r.avail_out === 0 && (i = -1), Ge;
      if (N == Kt) {
        if (U == xn)
          Re();
        else if (ke(0, 0, !1), U == Vo)
          for (a = 0; a < P; a++)
            w[a] = 0;
        if (r.flush_pending(), r.avail_out === 0)
          return i = -1, Ge;
      }
    }
    return U != Le ? Ge : ni;
  };
}
function oi() {
  const e = this;
  e.next_in_index = 0, e.next_out_index = 0, e.avail_in = 0, e.total_in = 0, e.avail_out = 0, e.total_out = 0;
}
oi.prototype = {
  deflateInit(e, r) {
    const t = this;
    return t.dstate = new ts(), r || (r = Ft), t.dstate.deflateInit(t, e, r);
  },
  deflate(e) {
    const r = this;
    return r.dstate ? r.dstate.deflate(r, e) : He;
  },
  deflateEnd() {
    const e = this;
    if (!e.dstate)
      return He;
    const r = e.dstate.deflateEnd();
    return e.dstate = null, r;
  },
  deflateParams(e, r) {
    const t = this;
    return t.dstate ? t.dstate.deflateParams(t, e, r) : He;
  },
  deflateSetDictionary(e, r) {
    const t = this;
    return t.dstate ? t.dstate.deflateSetDictionary(t, e, r) : He;
  },
  // Read a new buffer from the current input stream, update the
  // total number of bytes read. All deflate() input goes through
  // this function so some applications may wish to modify it to avoid
  // allocating a large strm->next_in buffer and copying from it.
  // (See also flush_pending()).
  read_buf(e, r, t) {
    const n = this;
    let i = n.avail_in;
    return i > t && (i = t), i === 0 ? 0 : (n.avail_in -= i, e.set(n.next_in.subarray(n.next_in_index, n.next_in_index + i), r), n.next_in_index += i, n.total_in += i, i);
  },
  // Flush as much pending output as possible. All deflate() output goes
  // through this function so some applications may wish to modify it
  // to avoid allocating a large strm->next_out buffer and copying into it.
  // (See also read_buf()).
  flush_pending() {
    const e = this;
    let r = e.dstate.pending;
    r > e.avail_out && (r = e.avail_out), r !== 0 && (e.next_out.set(e.dstate.pending_buf.subarray(e.dstate.pending_out, e.dstate.pending_out + r), e.next_out_index), e.next_out_index += r, e.dstate.pending_out += r, e.total_out += r, e.avail_out -= r, e.dstate.pending -= r, e.dstate.pending === 0 && (e.dstate.pending_out = 0));
  }
};
function rs(e) {
  const r = this, t = new oi(), n = ns(e && e.chunkSize ? e.chunkSize : 64 * 1024), i = xt, s = new Uint8Array(n);
  let f = e ? e.level : ar;
  typeof f > "u" && (f = ar), t.deflateInit(f), t.next_out = s, r.append = function(u, b) {
    let g, A, w = 0, j = 0, P = 0;
    const x = [];
    if (u.length) {
      t.next_in_index = 0, t.next_in = u, t.avail_in = u.length;
      do {
        if (t.next_out_index = 0, t.avail_out = n, g = t.deflate(i), g != Ge)
          throw new Error("deflating: " + t.msg);
        t.next_out_index && (t.next_out_index == n ? x.push(new Uint8Array(s)) : x.push(s.subarray(0, t.next_out_index))), P += t.next_out_index, b && t.next_in_index > 0 && t.next_in_index != w && (b(t.next_in_index), w = t.next_in_index);
      } while (t.avail_in > 0 || t.avail_out === 0);
      return x.length > 1 ? (A = new Uint8Array(P), x.forEach(function(p) {
        A.set(p, j), j += p.length;
      })) : A = x[0] ? new Uint8Array(x[0]) : new Uint8Array(), A;
    }
  }, r.flush = function() {
    let u, b, g = 0, A = 0;
    const w = [];
    do {
      if (t.next_out_index = 0, t.avail_out = n, u = t.deflate(Le), u != ni && u != Ge)
        throw new Error("deflating: " + t.msg);
      n - t.avail_out > 0 && w.push(s.slice(0, t.next_out_index)), A += t.next_out_index;
    } while (t.avail_in > 0 || t.avail_out === 0);
    return t.deflateEnd(), b = new Uint8Array(A), w.forEach(function(j) {
      b.set(j, g), g += j.length;
    }), b;
  };
}
function ns(e) {
  return e + 5 * (Math.floor(e / 16383) + 1);
}
const is = 15, Te = 0, tt = 1, os = 2, Ue = -2, je = -3, On = -4, rt = -5, qe = [
  0,
  1,
  3,
  7,
  15,
  31,
  63,
  127,
  255,
  511,
  1023,
  2047,
  4095,
  8191,
  16383,
  32767,
  65535
], si = 1440, ss = 0, as = 4, cs = 9, ls = 5, fs = [
  96,
  7,
  256,
  0,
  8,
  80,
  0,
  8,
  16,
  84,
  8,
  115,
  82,
  7,
  31,
  0,
  8,
  112,
  0,
  8,
  48,
  0,
  9,
  192,
  80,
  7,
  10,
  0,
  8,
  96,
  0,
  8,
  32,
  0,
  9,
  160,
  0,
  8,
  0,
  0,
  8,
  128,
  0,
  8,
  64,
  0,
  9,
  224,
  80,
  7,
  6,
  0,
  8,
  88,
  0,
  8,
  24,
  0,
  9,
  144,
  83,
  7,
  59,
  0,
  8,
  120,
  0,
  8,
  56,
  0,
  9,
  208,
  81,
  7,
  17,
  0,
  8,
  104,
  0,
  8,
  40,
  0,
  9,
  176,
  0,
  8,
  8,
  0,
  8,
  136,
  0,
  8,
  72,
  0,
  9,
  240,
  80,
  7,
  4,
  0,
  8,
  84,
  0,
  8,
  20,
  85,
  8,
  227,
  83,
  7,
  43,
  0,
  8,
  116,
  0,
  8,
  52,
  0,
  9,
  200,
  81,
  7,
  13,
  0,
  8,
  100,
  0,
  8,
  36,
  0,
  9,
  168,
  0,
  8,
  4,
  0,
  8,
  132,
  0,
  8,
  68,
  0,
  9,
  232,
  80,
  7,
  8,
  0,
  8,
  92,
  0,
  8,
  28,
  0,
  9,
  152,
  84,
  7,
  83,
  0,
  8,
  124,
  0,
  8,
  60,
  0,
  9,
  216,
  82,
  7,
  23,
  0,
  8,
  108,
  0,
  8,
  44,
  0,
  9,
  184,
  0,
  8,
  12,
  0,
  8,
  140,
  0,
  8,
  76,
  0,
  9,
  248,
  80,
  7,
  3,
  0,
  8,
  82,
  0,
  8,
  18,
  85,
  8,
  163,
  83,
  7,
  35,
  0,
  8,
  114,
  0,
  8,
  50,
  0,
  9,
  196,
  81,
  7,
  11,
  0,
  8,
  98,
  0,
  8,
  34,
  0,
  9,
  164,
  0,
  8,
  2,
  0,
  8,
  130,
  0,
  8,
  66,
  0,
  9,
  228,
  80,
  7,
  7,
  0,
  8,
  90,
  0,
  8,
  26,
  0,
  9,
  148,
  84,
  7,
  67,
  0,
  8,
  122,
  0,
  8,
  58,
  0,
  9,
  212,
  82,
  7,
  19,
  0,
  8,
  106,
  0,
  8,
  42,
  0,
  9,
  180,
  0,
  8,
  10,
  0,
  8,
  138,
  0,
  8,
  74,
  0,
  9,
  244,
  80,
  7,
  5,
  0,
  8,
  86,
  0,
  8,
  22,
  192,
  8,
  0,
  83,
  7,
  51,
  0,
  8,
  118,
  0,
  8,
  54,
  0,
  9,
  204,
  81,
  7,
  15,
  0,
  8,
  102,
  0,
  8,
  38,
  0,
  9,
  172,
  0,
  8,
  6,
  0,
  8,
  134,
  0,
  8,
  70,
  0,
  9,
  236,
  80,
  7,
  9,
  0,
  8,
  94,
  0,
  8,
  30,
  0,
  9,
  156,
  84,
  7,
  99,
  0,
  8,
  126,
  0,
  8,
  62,
  0,
  9,
  220,
  82,
  7,
  27,
  0,
  8,
  110,
  0,
  8,
  46,
  0,
  9,
  188,
  0,
  8,
  14,
  0,
  8,
  142,
  0,
  8,
  78,
  0,
  9,
  252,
  96,
  7,
  256,
  0,
  8,
  81,
  0,
  8,
  17,
  85,
  8,
  131,
  82,
  7,
  31,
  0,
  8,
  113,
  0,
  8,
  49,
  0,
  9,
  194,
  80,
  7,
  10,
  0,
  8,
  97,
  0,
  8,
  33,
  0,
  9,
  162,
  0,
  8,
  1,
  0,
  8,
  129,
  0,
  8,
  65,
  0,
  9,
  226,
  80,
  7,
  6,
  0,
  8,
  89,
  0,
  8,
  25,
  0,
  9,
  146,
  83,
  7,
  59,
  0,
  8,
  121,
  0,
  8,
  57,
  0,
  9,
  210,
  81,
  7,
  17,
  0,
  8,
  105,
  0,
  8,
  41,
  0,
  9,
  178,
  0,
  8,
  9,
  0,
  8,
  137,
  0,
  8,
  73,
  0,
  9,
  242,
  80,
  7,
  4,
  0,
  8,
  85,
  0,
  8,
  21,
  80,
  8,
  258,
  83,
  7,
  43,
  0,
  8,
  117,
  0,
  8,
  53,
  0,
  9,
  202,
  81,
  7,
  13,
  0,
  8,
  101,
  0,
  8,
  37,
  0,
  9,
  170,
  0,
  8,
  5,
  0,
  8,
  133,
  0,
  8,
  69,
  0,
  9,
  234,
  80,
  7,
  8,
  0,
  8,
  93,
  0,
  8,
  29,
  0,
  9,
  154,
  84,
  7,
  83,
  0,
  8,
  125,
  0,
  8,
  61,
  0,
  9,
  218,
  82,
  7,
  23,
  0,
  8,
  109,
  0,
  8,
  45,
  0,
  9,
  186,
  0,
  8,
  13,
  0,
  8,
  141,
  0,
  8,
  77,
  0,
  9,
  250,
  80,
  7,
  3,
  0,
  8,
  83,
  0,
  8,
  19,
  85,
  8,
  195,
  83,
  7,
  35,
  0,
  8,
  115,
  0,
  8,
  51,
  0,
  9,
  198,
  81,
  7,
  11,
  0,
  8,
  99,
  0,
  8,
  35,
  0,
  9,
  166,
  0,
  8,
  3,
  0,
  8,
  131,
  0,
  8,
  67,
  0,
  9,
  230,
  80,
  7,
  7,
  0,
  8,
  91,
  0,
  8,
  27,
  0,
  9,
  150,
  84,
  7,
  67,
  0,
  8,
  123,
  0,
  8,
  59,
  0,
  9,
  214,
  82,
  7,
  19,
  0,
  8,
  107,
  0,
  8,
  43,
  0,
  9,
  182,
  0,
  8,
  11,
  0,
  8,
  139,
  0,
  8,
  75,
  0,
  9,
  246,
  80,
  7,
  5,
  0,
  8,
  87,
  0,
  8,
  23,
  192,
  8,
  0,
  83,
  7,
  51,
  0,
  8,
  119,
  0,
  8,
  55,
  0,
  9,
  206,
  81,
  7,
  15,
  0,
  8,
  103,
  0,
  8,
  39,
  0,
  9,
  174,
  0,
  8,
  7,
  0,
  8,
  135,
  0,
  8,
  71,
  0,
  9,
  238,
  80,
  7,
  9,
  0,
  8,
  95,
  0,
  8,
  31,
  0,
  9,
  158,
  84,
  7,
  99,
  0,
  8,
  127,
  0,
  8,
  63,
  0,
  9,
  222,
  82,
  7,
  27,
  0,
  8,
  111,
  0,
  8,
  47,
  0,
  9,
  190,
  0,
  8,
  15,
  0,
  8,
  143,
  0,
  8,
  79,
  0,
  9,
  254,
  96,
  7,
  256,
  0,
  8,
  80,
  0,
  8,
  16,
  84,
  8,
  115,
  82,
  7,
  31,
  0,
  8,
  112,
  0,
  8,
  48,
  0,
  9,
  193,
  80,
  7,
  10,
  0,
  8,
  96,
  0,
  8,
  32,
  0,
  9,
  161,
  0,
  8,
  0,
  0,
  8,
  128,
  0,
  8,
  64,
  0,
  9,
  225,
  80,
  7,
  6,
  0,
  8,
  88,
  0,
  8,
  24,
  0,
  9,
  145,
  83,
  7,
  59,
  0,
  8,
  120,
  0,
  8,
  56,
  0,
  9,
  209,
  81,
  7,
  17,
  0,
  8,
  104,
  0,
  8,
  40,
  0,
  9,
  177,
  0,
  8,
  8,
  0,
  8,
  136,
  0,
  8,
  72,
  0,
  9,
  241,
  80,
  7,
  4,
  0,
  8,
  84,
  0,
  8,
  20,
  85,
  8,
  227,
  83,
  7,
  43,
  0,
  8,
  116,
  0,
  8,
  52,
  0,
  9,
  201,
  81,
  7,
  13,
  0,
  8,
  100,
  0,
  8,
  36,
  0,
  9,
  169,
  0,
  8,
  4,
  0,
  8,
  132,
  0,
  8,
  68,
  0,
  9,
  233,
  80,
  7,
  8,
  0,
  8,
  92,
  0,
  8,
  28,
  0,
  9,
  153,
  84,
  7,
  83,
  0,
  8,
  124,
  0,
  8,
  60,
  0,
  9,
  217,
  82,
  7,
  23,
  0,
  8,
  108,
  0,
  8,
  44,
  0,
  9,
  185,
  0,
  8,
  12,
  0,
  8,
  140,
  0,
  8,
  76,
  0,
  9,
  249,
  80,
  7,
  3,
  0,
  8,
  82,
  0,
  8,
  18,
  85,
  8,
  163,
  83,
  7,
  35,
  0,
  8,
  114,
  0,
  8,
  50,
  0,
  9,
  197,
  81,
  7,
  11,
  0,
  8,
  98,
  0,
  8,
  34,
  0,
  9,
  165,
  0,
  8,
  2,
  0,
  8,
  130,
  0,
  8,
  66,
  0,
  9,
  229,
  80,
  7,
  7,
  0,
  8,
  90,
  0,
  8,
  26,
  0,
  9,
  149,
  84,
  7,
  67,
  0,
  8,
  122,
  0,
  8,
  58,
  0,
  9,
  213,
  82,
  7,
  19,
  0,
  8,
  106,
  0,
  8,
  42,
  0,
  9,
  181,
  0,
  8,
  10,
  0,
  8,
  138,
  0,
  8,
  74,
  0,
  9,
  245,
  80,
  7,
  5,
  0,
  8,
  86,
  0,
  8,
  22,
  192,
  8,
  0,
  83,
  7,
  51,
  0,
  8,
  118,
  0,
  8,
  54,
  0,
  9,
  205,
  81,
  7,
  15,
  0,
  8,
  102,
  0,
  8,
  38,
  0,
  9,
  173,
  0,
  8,
  6,
  0,
  8,
  134,
  0,
  8,
  70,
  0,
  9,
  237,
  80,
  7,
  9,
  0,
  8,
  94,
  0,
  8,
  30,
  0,
  9,
  157,
  84,
  7,
  99,
  0,
  8,
  126,
  0,
  8,
  62,
  0,
  9,
  221,
  82,
  7,
  27,
  0,
  8,
  110,
  0,
  8,
  46,
  0,
  9,
  189,
  0,
  8,
  14,
  0,
  8,
  142,
  0,
  8,
  78,
  0,
  9,
  253,
  96,
  7,
  256,
  0,
  8,
  81,
  0,
  8,
  17,
  85,
  8,
  131,
  82,
  7,
  31,
  0,
  8,
  113,
  0,
  8,
  49,
  0,
  9,
  195,
  80,
  7,
  10,
  0,
  8,
  97,
  0,
  8,
  33,
  0,
  9,
  163,
  0,
  8,
  1,
  0,
  8,
  129,
  0,
  8,
  65,
  0,
  9,
  227,
  80,
  7,
  6,
  0,
  8,
  89,
  0,
  8,
  25,
  0,
  9,
  147,
  83,
  7,
  59,
  0,
  8,
  121,
  0,
  8,
  57,
  0,
  9,
  211,
  81,
  7,
  17,
  0,
  8,
  105,
  0,
  8,
  41,
  0,
  9,
  179,
  0,
  8,
  9,
  0,
  8,
  137,
  0,
  8,
  73,
  0,
  9,
  243,
  80,
  7,
  4,
  0,
  8,
  85,
  0,
  8,
  21,
  80,
  8,
  258,
  83,
  7,
  43,
  0,
  8,
  117,
  0,
  8,
  53,
  0,
  9,
  203,
  81,
  7,
  13,
  0,
  8,
  101,
  0,
  8,
  37,
  0,
  9,
  171,
  0,
  8,
  5,
  0,
  8,
  133,
  0,
  8,
  69,
  0,
  9,
  235,
  80,
  7,
  8,
  0,
  8,
  93,
  0,
  8,
  29,
  0,
  9,
  155,
  84,
  7,
  83,
  0,
  8,
  125,
  0,
  8,
  61,
  0,
  9,
  219,
  82,
  7,
  23,
  0,
  8,
  109,
  0,
  8,
  45,
  0,
  9,
  187,
  0,
  8,
  13,
  0,
  8,
  141,
  0,
  8,
  77,
  0,
  9,
  251,
  80,
  7,
  3,
  0,
  8,
  83,
  0,
  8,
  19,
  85,
  8,
  195,
  83,
  7,
  35,
  0,
  8,
  115,
  0,
  8,
  51,
  0,
  9,
  199,
  81,
  7,
  11,
  0,
  8,
  99,
  0,
  8,
  35,
  0,
  9,
  167,
  0,
  8,
  3,
  0,
  8,
  131,
  0,
  8,
  67,
  0,
  9,
  231,
  80,
  7,
  7,
  0,
  8,
  91,
  0,
  8,
  27,
  0,
  9,
  151,
  84,
  7,
  67,
  0,
  8,
  123,
  0,
  8,
  59,
  0,
  9,
  215,
  82,
  7,
  19,
  0,
  8,
  107,
  0,
  8,
  43,
  0,
  9,
  183,
  0,
  8,
  11,
  0,
  8,
  139,
  0,
  8,
  75,
  0,
  9,
  247,
  80,
  7,
  5,
  0,
  8,
  87,
  0,
  8,
  23,
  192,
  8,
  0,
  83,
  7,
  51,
  0,
  8,
  119,
  0,
  8,
  55,
  0,
  9,
  207,
  81,
  7,
  15,
  0,
  8,
  103,
  0,
  8,
  39,
  0,
  9,
  175,
  0,
  8,
  7,
  0,
  8,
  135,
  0,
  8,
  71,
  0,
  9,
  239,
  80,
  7,
  9,
  0,
  8,
  95,
  0,
  8,
  31,
  0,
  9,
  159,
  84,
  7,
  99,
  0,
  8,
  127,
  0,
  8,
  63,
  0,
  9,
  223,
  82,
  7,
  27,
  0,
  8,
  111,
  0,
  8,
  47,
  0,
  9,
  191,
  0,
  8,
  15,
  0,
  8,
  143,
  0,
  8,
  79,
  0,
  9,
  255
], us = [
  80,
  5,
  1,
  87,
  5,
  257,
  83,
  5,
  17,
  91,
  5,
  4097,
  81,
  5,
  5,
  89,
  5,
  1025,
  85,
  5,
  65,
  93,
  5,
  16385,
  80,
  5,
  3,
  88,
  5,
  513,
  84,
  5,
  33,
  92,
  5,
  8193,
  82,
  5,
  9,
  90,
  5,
  2049,
  86,
  5,
  129,
  192,
  5,
  24577,
  80,
  5,
  2,
  87,
  5,
  385,
  83,
  5,
  25,
  91,
  5,
  6145,
  81,
  5,
  7,
  89,
  5,
  1537,
  85,
  5,
  97,
  93,
  5,
  24577,
  80,
  5,
  4,
  88,
  5,
  769,
  84,
  5,
  49,
  92,
  5,
  12289,
  82,
  5,
  13,
  90,
  5,
  3073,
  86,
  5,
  193,
  192,
  5,
  24577
], ds = [
  // Copy lengths for literal codes 257..285
  3,
  4,
  5,
  6,
  7,
  8,
  9,
  10,
  11,
  13,
  15,
  17,
  19,
  23,
  27,
  31,
  35,
  43,
  51,
  59,
  67,
  83,
  99,
  115,
  131,
  163,
  195,
  227,
  258,
  0,
  0
], ps = [
  // Extra bits for literal codes 257..285
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  1,
  1,
  1,
  1,
  2,
  2,
  2,
  2,
  3,
  3,
  3,
  3,
  4,
  4,
  4,
  4,
  5,
  5,
  5,
  5,
  0,
  112,
  112
  // 112==invalid
], hs = [
  // Copy offsets for distance codes 0..29
  1,
  2,
  3,
  4,
  5,
  7,
  9,
  13,
  17,
  25,
  33,
  49,
  65,
  97,
  129,
  193,
  257,
  385,
  513,
  769,
  1025,
  1537,
  2049,
  3073,
  4097,
  6145,
  8193,
  12289,
  16385,
  24577
], ms = [
  // Extra bits for distance codes
  0,
  0,
  0,
  0,
  1,
  1,
  2,
  2,
  3,
  3,
  4,
  4,
  5,
  5,
  6,
  6,
  7,
  7,
  8,
  8,
  9,
  9,
  10,
  10,
  11,
  11,
  12,
  12,
  13,
  13
], st = 15;
function Dr() {
  const e = this;
  let r, t, n, i, s, f;
  function u(g, A, w, j, P, x, p, y, m, S, _) {
    let d, E, O, T, F, C, J, Z, se, le, pe, me, he, X, te;
    le = 0, F = w;
    do
      n[g[A + le]]++, le++, F--;
    while (F !== 0);
    if (n[0] == w)
      return p[0] = -1, y[0] = 0, Te;
    for (Z = y[0], C = 1; C <= st && n[C] === 0; C++)
      ;
    for (J = C, Z < C && (Z = C), F = st; F !== 0 && n[F] === 0; F--)
      ;
    for (O = F, Z > F && (Z = F), y[0] = Z, X = 1 << C; C < F; C++, X <<= 1)
      if ((X -= n[C]) < 0)
        return je;
    if ((X -= n[F]) < 0)
      return je;
    for (n[F] += X, f[1] = C = 0, le = 1, he = 2; --F !== 0; )
      f[he] = C += n[le], he++, le++;
    F = 0, le = 0;
    do
      (C = g[A + le]) !== 0 && (_[f[C]++] = F), le++;
    while (++F < w);
    for (w = f[O], f[0] = F = 0, le = 0, T = -1, me = -Z, s[0] = 0, pe = 0, te = 0; J <= O; J++)
      for (d = n[J]; d-- !== 0; ) {
        for (; J > me + Z; ) {
          if (T++, me += Z, te = O - me, te = te > Z ? Z : te, (E = 1 << (C = J - me)) > d + 1 && (E -= d + 1, he = J, C < te))
            for (; ++C < te && !((E <<= 1) <= n[++he]); )
              E -= n[he];
          if (te = 1 << C, S[0] + te > si)
            return je;
          s[T] = pe = /* hp+ */
          S[0], S[0] += te, T !== 0 ? (f[T] = F, i[0] = /* (byte) */
          C, i[1] = /* (byte) */
          Z, C = F >>> me - Z, i[2] = /* (int) */
          pe - s[T - 1] - C, m.set(i, (s[T - 1] + C) * 3)) : p[0] = pe;
        }
        for (i[1] = /* (byte) */
        J - me, le >= w ? i[0] = 192 : _[le] < j ? (i[0] = /* (byte) */
        _[le] < 256 ? 0 : 96, i[2] = _[le++]) : (i[0] = /* (byte) */
        x[_[le] - j] + 16 + 64, i[2] = P[_[le++] - j]), E = 1 << J - me, C = F >>> me; C < te; C += E)
          m.set(i, (pe + C) * 3);
        for (C = 1 << J - 1; (F & C) !== 0; C >>>= 1)
          F ^= C;
        for (F ^= C, se = (1 << me) - 1; (F & se) != f[T]; )
          T--, me -= Z, se = (1 << me) - 1;
      }
    return X !== 0 && O != 1 ? rt : Te;
  }
  function b(g) {
    let A;
    for (r || (r = [], t = [], n = new Int32Array(st + 1), i = [], s = new Int32Array(st), f = new Int32Array(st + 1)), t.length < g && (t = []), A = 0; A < g; A++)
      t[A] = 0;
    for (A = 0; A < st + 1; A++)
      n[A] = 0;
    for (A = 0; A < 3; A++)
      i[A] = 0;
    s.set(n.subarray(0, st), 0), f.set(n.subarray(0, st + 1), 0);
  }
  e.inflate_trees_bits = function(g, A, w, j, P) {
    let x;
    return b(19), r[0] = 0, x = u(g, 0, 19, 19, null, null, w, A, j, r, t), x == je ? P.msg = "oversubscribed dynamic bit lengths tree" : (x == rt || A[0] === 0) && (P.msg = "incomplete dynamic bit lengths tree", x = je), x;
  }, e.inflate_trees_dynamic = function(g, A, w, j, P, x, p, y, m) {
    let S;
    return b(288), r[0] = 0, S = u(w, 0, g, 257, ds, ps, x, j, y, r, t), S != Te || j[0] === 0 ? (S == je ? m.msg = "oversubscribed literal/length tree" : S != On && (m.msg = "incomplete literal/length tree", S = je), S) : (b(288), S = u(w, g, A, 0, hs, ms, p, P, y, r, t), S != Te || P[0] === 0 && g > 257 ? (S == je ? m.msg = "oversubscribed distance tree" : S == rt ? (m.msg = "incomplete distance tree", S = je) : S != On && (m.msg = "empty distance tree with lengths", S = je), S) : Te);
  };
}
Dr.inflate_trees_fixed = function(e, r, t, n) {
  return e[0] = cs, r[0] = ls, t[0] = fs, n[0] = us, Te;
};
const Zt = 0, An = 1, kn = 2, Tn = 3, Rn = 4, In = 5, jn = 6, Or = 7, Pn = 8, zt = 9;
function ys() {
  const e = this;
  let r, t = 0, n, i = 0, s = 0, f = 0, u = 0, b = 0, g = 0, A = 0, w, j = 0, P, x = 0;
  function p(y, m, S, _, d, E, O, T) {
    let F, C, J, Z, se, le, pe, me, he, X, te, ae, fe, ee, R, D;
    pe = T.next_in_index, me = T.avail_in, se = O.bitb, le = O.bitk, he = O.write, X = he < O.read ? O.read - he - 1 : O.end - he, te = qe[y], ae = qe[m];
    do {
      for (; le < 20; )
        me--, se |= (T.read_byte(pe++) & 255) << le, le += 8;
      if (F = se & te, C = S, J = _, D = (J + F) * 3, (Z = C[D]) === 0) {
        se >>= C[D + 1], le -= C[D + 1], O.win[he++] = /* (byte) */
        C[D + 2], X--;
        continue;
      }
      do {
        if (se >>= C[D + 1], le -= C[D + 1], (Z & 16) !== 0) {
          for (Z &= 15, fe = C[D + 2] + /* (int) */
          (se & qe[Z]), se >>= Z, le -= Z; le < 15; )
            me--, se |= (T.read_byte(pe++) & 255) << le, le += 8;
          F = se & ae, C = d, J = E, D = (J + F) * 3, Z = C[D];
          do
            if (se >>= C[D + 1], le -= C[D + 1], (Z & 16) !== 0) {
              for (Z &= 15; le < Z; )
                me--, se |= (T.read_byte(pe++) & 255) << le, le += 8;
              if (ee = C[D + 2] + (se & qe[Z]), se >>= Z, le -= Z, X -= fe, he >= ee)
                R = he - ee, he - R > 0 && 2 > he - R ? (O.win[he++] = O.win[R++], O.win[he++] = O.win[R++], fe -= 2) : (O.win.set(O.win.subarray(R, R + 2), he), he += 2, R += 2, fe -= 2);
              else {
                R = he - ee;
                do
                  R += O.end;
                while (R < 0);
                if (Z = O.end - R, fe > Z) {
                  if (fe -= Z, he - R > 0 && Z > he - R)
                    do
                      O.win[he++] = O.win[R++];
                    while (--Z !== 0);
                  else
                    O.win.set(O.win.subarray(R, R + Z), he), he += Z, R += Z, Z = 0;
                  R = 0;
                }
              }
              if (he - R > 0 && fe > he - R)
                do
                  O.win[he++] = O.win[R++];
                while (--fe !== 0);
              else
                O.win.set(O.win.subarray(R, R + fe), he), he += fe, R += fe, fe = 0;
              break;
            } else if ((Z & 64) === 0)
              F += C[D + 2], F += se & qe[Z], D = (J + F) * 3, Z = C[D];
            else
              return T.msg = "invalid distance code", fe = T.avail_in - me, fe = le >> 3 < fe ? le >> 3 : fe, me += fe, pe -= fe, le -= fe << 3, O.bitb = se, O.bitk = le, T.avail_in = me, T.total_in += pe - T.next_in_index, T.next_in_index = pe, O.write = he, je;
          while (!0);
          break;
        }
        if ((Z & 64) === 0) {
          if (F += C[D + 2], F += se & qe[Z], D = (J + F) * 3, (Z = C[D]) === 0) {
            se >>= C[D + 1], le -= C[D + 1], O.win[he++] = /* (byte) */
            C[D + 2], X--;
            break;
          }
        } else return (Z & 32) !== 0 ? (fe = T.avail_in - me, fe = le >> 3 < fe ? le >> 3 : fe, me += fe, pe -= fe, le -= fe << 3, O.bitb = se, O.bitk = le, T.avail_in = me, T.total_in += pe - T.next_in_index, T.next_in_index = pe, O.write = he, tt) : (T.msg = "invalid literal/length code", fe = T.avail_in - me, fe = le >> 3 < fe ? le >> 3 : fe, me += fe, pe -= fe, le -= fe << 3, O.bitb = se, O.bitk = le, T.avail_in = me, T.total_in += pe - T.next_in_index, T.next_in_index = pe, O.write = he, je);
      } while (!0);
    } while (X >= 258 && me >= 10);
    return fe = T.avail_in - me, fe = le >> 3 < fe ? le >> 3 : fe, me += fe, pe -= fe, le -= fe << 3, O.bitb = se, O.bitk = le, T.avail_in = me, T.total_in += pe - T.next_in_index, T.next_in_index = pe, O.write = he, Te;
  }
  e.init = function(y, m, S, _, d, E) {
    r = Zt, g = /* (byte) */
    y, A = /* (byte) */
    m, w = S, j = _, P = d, x = E, n = null;
  }, e.proc = function(y, m, S) {
    let _, d, E, O = 0, T = 0, F = 0, C, J, Z, se;
    for (F = m.next_in_index, C = m.avail_in, O = y.bitb, T = y.bitk, J = y.write, Z = J < y.read ? y.read - J - 1 : y.end - J; ; )
      switch (r) {
        // waiting for "i:"=input, "o:"=output, "x:"=nothing
        case Zt:
          if (Z >= 258 && C >= 10 && (y.bitb = O, y.bitk = T, m.avail_in = C, m.total_in += F - m.next_in_index, m.next_in_index = F, y.write = J, S = p(g, A, w, j, P, x, y, m), F = m.next_in_index, C = m.avail_in, O = y.bitb, T = y.bitk, J = y.write, Z = J < y.read ? y.read - J - 1 : y.end - J, S != Te)) {
            r = S == tt ? Or : zt;
            break;
          }
          s = g, n = w, i = j, r = An;
        /* falls through */
        case An:
          for (_ = s; T < _; ) {
            if (C !== 0)
              S = Te;
            else
              return y.bitb = O, y.bitk = T, m.avail_in = C, m.total_in += F - m.next_in_index, m.next_in_index = F, y.write = J, y.inflate_flush(m, S);
            C--, O |= (m.read_byte(F++) & 255) << T, T += 8;
          }
          if (d = (i + (O & qe[_])) * 3, O >>>= n[d + 1], T -= n[d + 1], E = n[d], E === 0) {
            f = n[d + 2], r = jn;
            break;
          }
          if ((E & 16) !== 0) {
            u = E & 15, t = n[d + 2], r = kn;
            break;
          }
          if ((E & 64) === 0) {
            s = E, i = d / 3 + n[d + 2];
            break;
          }
          if ((E & 32) !== 0) {
            r = Or;
            break;
          }
          return r = zt, m.msg = "invalid literal/length code", S = je, y.bitb = O, y.bitk = T, m.avail_in = C, m.total_in += F - m.next_in_index, m.next_in_index = F, y.write = J, y.inflate_flush(m, S);
        case kn:
          for (_ = u; T < _; ) {
            if (C !== 0)
              S = Te;
            else
              return y.bitb = O, y.bitk = T, m.avail_in = C, m.total_in += F - m.next_in_index, m.next_in_index = F, y.write = J, y.inflate_flush(m, S);
            C--, O |= (m.read_byte(F++) & 255) << T, T += 8;
          }
          t += O & qe[_], O >>= _, T -= _, s = A, n = P, i = x, r = Tn;
        /* falls through */
        case Tn:
          for (_ = s; T < _; ) {
            if (C !== 0)
              S = Te;
            else
              return y.bitb = O, y.bitk = T, m.avail_in = C, m.total_in += F - m.next_in_index, m.next_in_index = F, y.write = J, y.inflate_flush(m, S);
            C--, O |= (m.read_byte(F++) & 255) << T, T += 8;
          }
          if (d = (i + (O & qe[_])) * 3, O >>= n[d + 1], T -= n[d + 1], E = n[d], (E & 16) !== 0) {
            u = E & 15, b = n[d + 2], r = Rn;
            break;
          }
          if ((E & 64) === 0) {
            s = E, i = d / 3 + n[d + 2];
            break;
          }
          return r = zt, m.msg = "invalid distance code", S = je, y.bitb = O, y.bitk = T, m.avail_in = C, m.total_in += F - m.next_in_index, m.next_in_index = F, y.write = J, y.inflate_flush(m, S);
        case Rn:
          for (_ = u; T < _; ) {
            if (C !== 0)
              S = Te;
            else
              return y.bitb = O, y.bitk = T, m.avail_in = C, m.total_in += F - m.next_in_index, m.next_in_index = F, y.write = J, y.inflate_flush(m, S);
            C--, O |= (m.read_byte(F++) & 255) << T, T += 8;
          }
          b += O & qe[_], O >>= _, T -= _, r = In;
        /* falls through */
        case In:
          for (se = J - b; se < 0; )
            se += y.end;
          for (; t !== 0; ) {
            if (Z === 0 && (J == y.end && y.read !== 0 && (J = 0, Z = J < y.read ? y.read - J - 1 : y.end - J), Z === 0 && (y.write = J, S = y.inflate_flush(m, S), J = y.write, Z = J < y.read ? y.read - J - 1 : y.end - J, J == y.end && y.read !== 0 && (J = 0, Z = J < y.read ? y.read - J - 1 : y.end - J), Z === 0)))
              return y.bitb = O, y.bitk = T, m.avail_in = C, m.total_in += F - m.next_in_index, m.next_in_index = F, y.write = J, y.inflate_flush(m, S);
            y.win[J++] = y.win[se++], Z--, se == y.end && (se = 0), t--;
          }
          r = Zt;
          break;
        case jn:
          if (Z === 0 && (J == y.end && y.read !== 0 && (J = 0, Z = J < y.read ? y.read - J - 1 : y.end - J), Z === 0 && (y.write = J, S = y.inflate_flush(m, S), J = y.write, Z = J < y.read ? y.read - J - 1 : y.end - J, J == y.end && y.read !== 0 && (J = 0, Z = J < y.read ? y.read - J - 1 : y.end - J), Z === 0)))
            return y.bitb = O, y.bitk = T, m.avail_in = C, m.total_in += F - m.next_in_index, m.next_in_index = F, y.write = J, y.inflate_flush(m, S);
          S = Te, y.win[J++] = /* (byte) */
          f, Z--, r = Zt;
          break;
        case Or:
          if (T > 7 && (T -= 8, C++, F--), y.write = J, S = y.inflate_flush(m, S), J = y.write, Z = J < y.read ? y.read - J - 1 : y.end - J, y.read != y.write)
            return y.bitb = O, y.bitk = T, m.avail_in = C, m.total_in += F - m.next_in_index, m.next_in_index = F, y.write = J, y.inflate_flush(m, S);
          r = Pn;
        /* falls through */
        case Pn:
          return S = tt, y.bitb = O, y.bitk = T, m.avail_in = C, m.total_in += F - m.next_in_index, m.next_in_index = F, y.write = J, y.inflate_flush(m, S);
        case zt:
          return S = je, y.bitb = O, y.bitk = T, m.avail_in = C, m.total_in += F - m.next_in_index, m.next_in_index = F, y.write = J, y.inflate_flush(m, S);
        default:
          return S = Ue, y.bitb = O, y.bitk = T, m.avail_in = C, m.total_in += F - m.next_in_index, m.next_in_index = F, y.write = J, y.inflate_flush(m, S);
      }
  }, e.free = function() {
  };
}
const Nn = [
  // Order of the bit length code lengths
  16,
  17,
  18,
  0,
  8,
  7,
  9,
  6,
  10,
  5,
  11,
  4,
  12,
  3,
  13,
  2,
  14,
  1,
  15
], _t = 0, Ar = 1, Fn = 2, Bn = 3, Cn = 4, Dn = 5, Qt = 6, er = 7, Ln = 8, dt = 9;
function gs(e, r) {
  const t = this;
  let n = _t, i = 0, s = 0, f = 0, u;
  const b = [0], g = [0], A = new ys();
  let w = 0, j = new Int32Array(si * 3);
  const P = 0, x = new Dr();
  t.bitk = 0, t.bitb = 0, t.win = new Uint8Array(r), t.end = r, t.read = 0, t.write = 0, t.reset = function(p, y) {
    y && (y[0] = P), n == Qt && A.free(p), n = _t, t.bitk = 0, t.bitb = 0, t.read = t.write = 0;
  }, t.reset(e, null), t.inflate_flush = function(p, y) {
    let m, S, _;
    return S = p.next_out_index, _ = t.read, m = /* (int) */
    (_ <= t.write ? t.write : t.end) - _, m > p.avail_out && (m = p.avail_out), m !== 0 && y == rt && (y = Te), p.avail_out -= m, p.total_out += m, p.next_out.set(t.win.subarray(_, _ + m), S), S += m, _ += m, _ == t.end && (_ = 0, t.write == t.end && (t.write = 0), m = t.write - _, m > p.avail_out && (m = p.avail_out), m !== 0 && y == rt && (y = Te), p.avail_out -= m, p.total_out += m, p.next_out.set(t.win.subarray(_, _ + m), S), S += m, _ += m), p.next_out_index = S, t.read = _, y;
  }, t.proc = function(p, y) {
    let m, S, _, d, E, O, T, F;
    for (d = p.next_in_index, E = p.avail_in, S = t.bitb, _ = t.bitk, O = t.write, T = /* (int) */
    O < t.read ? t.read - O - 1 : t.end - O; ; ) {
      let C, J, Z, se, le, pe, me, he;
      switch (n) {
        case _t:
          for (; _ < 3; ) {
            if (E !== 0)
              y = Te;
            else
              return t.bitb = S, t.bitk = _, p.avail_in = E, p.total_in += d - p.next_in_index, p.next_in_index = d, t.write = O, t.inflate_flush(p, y);
            E--, S |= (p.read_byte(d++) & 255) << _, _ += 8;
          }
          switch (m = /* (int) */
          S & 7, w = m & 1, m >>> 1) {
            case 0:
              S >>>= 3, _ -= 3, m = _ & 7, S >>>= m, _ -= m, n = Ar;
              break;
            case 1:
              C = [], J = [], Z = [[]], se = [[]], Dr.inflate_trees_fixed(C, J, Z, se), A.init(C[0], J[0], Z[0], 0, se[0], 0), S >>>= 3, _ -= 3, n = Qt;
              break;
            case 2:
              S >>>= 3, _ -= 3, n = Bn;
              break;
            case 3:
              return S >>>= 3, _ -= 3, n = dt, p.msg = "invalid block type", y = je, t.bitb = S, t.bitk = _, p.avail_in = E, p.total_in += d - p.next_in_index, p.next_in_index = d, t.write = O, t.inflate_flush(p, y);
          }
          break;
        case Ar:
          for (; _ < 32; ) {
            if (E !== 0)
              y = Te;
            else
              return t.bitb = S, t.bitk = _, p.avail_in = E, p.total_in += d - p.next_in_index, p.next_in_index = d, t.write = O, t.inflate_flush(p, y);
            E--, S |= (p.read_byte(d++) & 255) << _, _ += 8;
          }
          if ((~S >>> 16 & 65535) != (S & 65535))
            return n = dt, p.msg = "invalid stored block lengths", y = je, t.bitb = S, t.bitk = _, p.avail_in = E, p.total_in += d - p.next_in_index, p.next_in_index = d, t.write = O, t.inflate_flush(p, y);
          i = S & 65535, S = _ = 0, n = i !== 0 ? Fn : w !== 0 ? er : _t;
          break;
        case Fn:
          if (E === 0 || T === 0 && (O == t.end && t.read !== 0 && (O = 0, T = /* (int) */
          O < t.read ? t.read - O - 1 : t.end - O), T === 0 && (t.write = O, y = t.inflate_flush(p, y), O = t.write, T = /* (int) */
          O < t.read ? t.read - O - 1 : t.end - O, O == t.end && t.read !== 0 && (O = 0, T = /* (int) */
          O < t.read ? t.read - O - 1 : t.end - O), T === 0)))
            return t.bitb = S, t.bitk = _, p.avail_in = E, p.total_in += d - p.next_in_index, p.next_in_index = d, t.write = O, t.inflate_flush(p, y);
          if (y = Te, m = i, m > E && (m = E), m > T && (m = T), t.win.set(p.read_buf(d, m), O), d += m, E -= m, O += m, T -= m, (i -= m) !== 0)
            break;
          n = w !== 0 ? er : _t;
          break;
        case Bn:
          for (; _ < 14; ) {
            if (E !== 0)
              y = Te;
            else
              return t.bitb = S, t.bitk = _, p.avail_in = E, p.total_in += d - p.next_in_index, p.next_in_index = d, t.write = O, t.inflate_flush(p, y);
            E--, S |= (p.read_byte(d++) & 255) << _, _ += 8;
          }
          if (s = m = S & 16383, (m & 31) > 29 || (m >> 5 & 31) > 29)
            return n = dt, p.msg = "too many length or distance symbols", y = je, t.bitb = S, t.bitk = _, p.avail_in = E, p.total_in += d - p.next_in_index, p.next_in_index = d, t.write = O, t.inflate_flush(p, y);
          if (m = 258 + (m & 31) + (m >> 5 & 31), !u || u.length < m)
            u = [];
          else
            for (F = 0; F < m; F++)
              u[F] = 0;
          S >>>= 14, _ -= 14, f = 0, n = Cn;
        /* falls through */
        case Cn:
          for (; f < 4 + (s >>> 10); ) {
            for (; _ < 3; ) {
              if (E !== 0)
                y = Te;
              else
                return t.bitb = S, t.bitk = _, p.avail_in = E, p.total_in += d - p.next_in_index, p.next_in_index = d, t.write = O, t.inflate_flush(p, y);
              E--, S |= (p.read_byte(d++) & 255) << _, _ += 8;
            }
            u[Nn[f++]] = S & 7, S >>>= 3, _ -= 3;
          }
          for (; f < 19; )
            u[Nn[f++]] = 0;
          if (b[0] = 7, m = x.inflate_trees_bits(u, b, g, j, p), m != Te)
            return y = m, y == je && (u = null, n = dt), t.bitb = S, t.bitk = _, p.avail_in = E, p.total_in += d - p.next_in_index, p.next_in_index = d, t.write = O, t.inflate_flush(p, y);
          f = 0, n = Dn;
        /* falls through */
        case Dn:
          for (; m = s, !(f >= 258 + (m & 31) + (m >> 5 & 31)); ) {
            let X, te;
            for (m = b[0]; _ < m; ) {
              if (E !== 0)
                y = Te;
              else
                return t.bitb = S, t.bitk = _, p.avail_in = E, p.total_in += d - p.next_in_index, p.next_in_index = d, t.write = O, t.inflate_flush(p, y);
              E--, S |= (p.read_byte(d++) & 255) << _, _ += 8;
            }
            if (m = j[(g[0] + (S & qe[m])) * 3 + 1], te = j[(g[0] + (S & qe[m])) * 3 + 2], te < 16)
              S >>>= m, _ -= m, u[f++] = te;
            else {
              for (F = te == 18 ? 7 : te - 14, X = te == 18 ? 11 : 3; _ < m + F; ) {
                if (E !== 0)
                  y = Te;
                else
                  return t.bitb = S, t.bitk = _, p.avail_in = E, p.total_in += d - p.next_in_index, p.next_in_index = d, t.write = O, t.inflate_flush(p, y);
                E--, S |= (p.read_byte(d++) & 255) << _, _ += 8;
              }
              if (S >>>= m, _ -= m, X += S & qe[F], S >>>= F, _ -= F, F = f, m = s, F + X > 258 + (m & 31) + (m >> 5 & 31) || te == 16 && F < 1)
                return u = null, n = dt, p.msg = "invalid bit length repeat", y = je, t.bitb = S, t.bitk = _, p.avail_in = E, p.total_in += d - p.next_in_index, p.next_in_index = d, t.write = O, t.inflate_flush(p, y);
              te = te == 16 ? u[F - 1] : 0;
              do
                u[F++] = te;
              while (--X !== 0);
              f = F;
            }
          }
          if (g[0] = -1, le = [], pe = [], me = [], he = [], le[0] = 9, pe[0] = 6, m = s, m = x.inflate_trees_dynamic(257 + (m & 31), 1 + (m >> 5 & 31), u, le, pe, me, he, j, p), m != Te)
            return m == je && (u = null, n = dt), y = m, t.bitb = S, t.bitk = _, p.avail_in = E, p.total_in += d - p.next_in_index, p.next_in_index = d, t.write = O, t.inflate_flush(p, y);
          A.init(le[0], pe[0], j, me[0], j, he[0]), n = Qt;
        /* falls through */
        case Qt:
          if (t.bitb = S, t.bitk = _, p.avail_in = E, p.total_in += d - p.next_in_index, p.next_in_index = d, t.write = O, (y = A.proc(t, p, y)) != tt)
            return t.inflate_flush(p, y);
          if (y = Te, A.free(p), d = p.next_in_index, E = p.avail_in, S = t.bitb, _ = t.bitk, O = t.write, T = /* (int) */
          O < t.read ? t.read - O - 1 : t.end - O, w === 0) {
            n = _t;
            break;
          }
          n = er;
        /* falls through */
        case er:
          if (t.write = O, y = t.inflate_flush(p, y), O = t.write, T = /* (int) */
          O < t.read ? t.read - O - 1 : t.end - O, t.read != t.write)
            return t.bitb = S, t.bitk = _, p.avail_in = E, p.total_in += d - p.next_in_index, p.next_in_index = d, t.write = O, t.inflate_flush(p, y);
          n = Ln;
        /* falls through */
        case Ln:
          return y = tt, t.bitb = S, t.bitk = _, p.avail_in = E, p.total_in += d - p.next_in_index, p.next_in_index = d, t.write = O, t.inflate_flush(p, y);
        case dt:
          return y = je, t.bitb = S, t.bitk = _, p.avail_in = E, p.total_in += d - p.next_in_index, p.next_in_index = d, t.write = O, t.inflate_flush(p, y);
        default:
          return y = Ue, t.bitb = S, t.bitk = _, p.avail_in = E, p.total_in += d - p.next_in_index, p.next_in_index = d, t.write = O, t.inflate_flush(p, y);
      }
    }
  }, t.free = function(p) {
    t.reset(p, null), t.win = null, j = null;
  }, t.set_dictionary = function(p, y, m) {
    t.win.set(p.subarray(y, y + m), 0), t.read = t.write = m;
  }, t.sync_point = function() {
    return n == Ar ? 1 : 0;
  };
}
const vs = 32, bs = 8, ws = 0, Un = 1, Mn = 2, qn = 3, Wn = 4, $n = 5, kr = 6, It = 7, Vn = 12, at = 13, _s = [0, 0, 255, 255];
function xs() {
  const e = this;
  e.mode = 0, e.method = 0, e.was = [0], e.need = 0, e.marker = 0, e.wbits = 0;
  function r(t) {
    return !t || !t.istate ? Ue : (t.total_in = t.total_out = 0, t.msg = null, t.istate.mode = It, t.istate.blocks.reset(t, null), Te);
  }
  e.inflateEnd = function(t) {
    return e.blocks && e.blocks.free(t), e.blocks = null, Te;
  }, e.inflateInit = function(t, n) {
    return t.msg = null, e.blocks = null, n < 8 || n > 15 ? (e.inflateEnd(t), Ue) : (e.wbits = n, t.istate.blocks = new gs(t, 1 << n), r(t), Te);
  }, e.inflate = function(t, n) {
    let i, s;
    if (!t || !t.istate || !t.next_in)
      return Ue;
    const f = t.istate;
    for (n = n == as ? rt : Te, i = rt; ; )
      switch (f.mode) {
        case ws:
          if (t.avail_in === 0)
            return i;
          if (i = n, t.avail_in--, t.total_in++, ((f.method = t.read_byte(t.next_in_index++)) & 15) != bs) {
            f.mode = at, t.msg = "unknown compression method", f.marker = 5;
            break;
          }
          if ((f.method >> 4) + 8 > f.wbits) {
            f.mode = at, t.msg = "invalid win size", f.marker = 5;
            break;
          }
          f.mode = Un;
        /* falls through */
        case Un:
          if (t.avail_in === 0)
            return i;
          if (i = n, t.avail_in--, t.total_in++, s = t.read_byte(t.next_in_index++) & 255, ((f.method << 8) + s) % 31 !== 0) {
            f.mode = at, t.msg = "incorrect header check", f.marker = 5;
            break;
          }
          if ((s & vs) === 0) {
            f.mode = It;
            break;
          }
          f.mode = Mn;
        /* falls through */
        case Mn:
          if (t.avail_in === 0)
            return i;
          i = n, t.avail_in--, t.total_in++, f.need = (t.read_byte(t.next_in_index++) & 255) << 24 & 4278190080, f.mode = qn;
        /* falls through */
        case qn:
          if (t.avail_in === 0)
            return i;
          i = n, t.avail_in--, t.total_in++, f.need += (t.read_byte(t.next_in_index++) & 255) << 16 & 16711680, f.mode = Wn;
        /* falls through */
        case Wn:
          if (t.avail_in === 0)
            return i;
          i = n, t.avail_in--, t.total_in++, f.need += (t.read_byte(t.next_in_index++) & 255) << 8 & 65280, f.mode = $n;
        /* falls through */
        case $n:
          return t.avail_in === 0 ? i : (i = n, t.avail_in--, t.total_in++, f.need += t.read_byte(t.next_in_index++) & 255, f.mode = kr, os);
        case kr:
          return f.mode = at, t.msg = "need dictionary", f.marker = 0, Ue;
        case It:
          if (i = f.blocks.proc(t, i), i == je) {
            f.mode = at, f.marker = 0;
            break;
          }
          if (i == Te && (i = n), i != tt)
            return i;
          i = n, f.blocks.reset(t, f.was), f.mode = Vn;
        /* falls through */
        case Vn:
          return t.avail_in = 0, tt;
        case at:
          return je;
        default:
          return Ue;
      }
  }, e.inflateSetDictionary = function(t, n, i) {
    let s = 0, f = i;
    if (!t || !t.istate || t.istate.mode != kr)
      return Ue;
    const u = t.istate;
    return f >= 1 << u.wbits && (f = (1 << u.wbits) - 1, s = i - f), u.blocks.set_dictionary(n, s, f), u.mode = It, Te;
  }, e.inflateSync = function(t) {
    let n, i, s, f, u;
    if (!t || !t.istate)
      return Ue;
    const b = t.istate;
    if (b.mode != at && (b.mode = at, b.marker = 0), (n = t.avail_in) === 0)
      return rt;
    for (i = t.next_in_index, s = b.marker; n !== 0 && s < 4; )
      t.read_byte(i) == _s[s] ? s++ : t.read_byte(i) !== 0 ? s = 0 : s = 4 - s, i++, n--;
    return t.total_in += i - t.next_in_index, t.next_in_index = i, t.avail_in = n, b.marker = s, s != 4 ? je : (f = t.total_in, u = t.total_out, r(t), t.total_in = f, t.total_out = u, b.mode = It, Te);
  }, e.inflateSyncPoint = function(t) {
    return !t || !t.istate || !t.istate.blocks ? Ue : t.istate.blocks.sync_point();
  };
}
function ai() {
}
ai.prototype = {
  inflateInit(e) {
    const r = this;
    return r.istate = new xs(), e || (e = is), r.istate.inflateInit(r, e);
  },
  inflate(e) {
    const r = this;
    return r.istate ? r.istate.inflate(r, e) : Ue;
  },
  inflateEnd() {
    const e = this;
    if (!e.istate)
      return Ue;
    const r = e.istate.inflateEnd(e);
    return e.istate = null, r;
  },
  inflateSync() {
    const e = this;
    return e.istate ? e.istate.inflateSync(e) : Ue;
  },
  inflateSetDictionary(e, r) {
    const t = this;
    return t.istate ? t.istate.inflateSetDictionary(t, e, r) : Ue;
  },
  read_byte(e) {
    return this.next_in[e];
  },
  read_buf(e, r) {
    return this.next_in.subarray(e, e + r);
  }
};
function Es(e) {
  const r = this, t = new ai(), n = e && e.chunkSize ? Math.floor(e.chunkSize * 2) : 128 * 1024, i = ss, s = new Uint8Array(n);
  let f = !1;
  t.inflateInit(), t.next_out = s, r.append = function(u, b) {
    const g = [];
    let A, w, j = 0, P = 0, x = 0;
    if (u.length !== 0) {
      t.next_in_index = 0, t.next_in = u, t.avail_in = u.length;
      do {
        if (t.next_out_index = 0, t.avail_out = n, t.avail_in === 0 && !f && (t.next_in_index = 0, f = !0), A = t.inflate(i), f && A === rt) {
          if (t.avail_in !== 0)
            throw new Error("inflating: bad input");
        } else if (A !== Te && A !== tt)
          throw new Error("inflating: " + t.msg);
        if ((f || A === tt) && t.avail_in === u.length)
          throw new Error("inflating: bad input");
        t.next_out_index && (t.next_out_index === n ? g.push(new Uint8Array(s)) : g.push(s.subarray(0, t.next_out_index))), x += t.next_out_index, b && t.next_in_index > 0 && t.next_in_index != j && (b(t.next_in_index), j = t.next_in_index);
      } while (t.avail_in > 0 || t.avail_out === 0);
      return g.length > 1 ? (w = new Uint8Array(x), g.forEach(function(p) {
        w.set(p, P), P += p.length;
      })) : w = g[0] ? new Uint8Array(g[0]) : new Uint8Array(), w;
    }
  }, r.flush = function() {
    t.inflateEnd();
  };
}
const dr = void 0, yt = "undefined", Hr = "function";
class Gn {
  constructor(r) {
    return class extends TransformStream {
      constructor(t, n) {
        const i = new r(n);
        super({
          transform(s, f) {
            f.enqueue(i.append(s));
          },
          flush(s) {
            const f = i.flush();
            f && s.enqueue(f);
          }
        });
      }
    };
  }
}
let ci = 2;
try {
  typeof navigator != yt && navigator.hardwareConcurrency && (ci = navigator.hardwareConcurrency);
} catch {
}
const Ss = {
  chunkSize: 512 * 1024,
  maxWorkers: ci,
  terminateWorkerTimeout: 5e3,
  useWebWorkers: !0,
  useCompressionStream: !0,
  workerScripts: dr,
  CompressionStreamNative: typeof CompressionStream != yt && CompressionStream,
  DecompressionStreamNative: typeof DecompressionStream != yt && DecompressionStream
}, ht = Object.assign({}, Ss);
function Yr(e) {
  const {
    baseURL: r,
    chunkSize: t,
    maxWorkers: n,
    terminateWorkerTimeout: i,
    useCompressionStream: s,
    useWebWorkers: f,
    Deflate: u,
    Inflate: b,
    CompressionStream: g,
    DecompressionStream: A,
    workerScripts: w
  } = e;
  if (ct("baseURL", r), ct("chunkSize", t), ct("maxWorkers", n), ct("terminateWorkerTimeout", i), ct("useCompressionStream", s), ct("useWebWorkers", f), u && (ht.CompressionStream = new Gn(u)), b && (ht.DecompressionStream = new Gn(b)), ct("CompressionStream", g), ct("DecompressionStream", A), w !== dr) {
    const { deflate: j, inflate: P } = w;
    if ((j || P) && (ht.workerScripts || (ht.workerScripts = {})), j) {
      if (!Array.isArray(j))
        throw new Error("workerScripts.deflate must be an array");
      ht.workerScripts.deflate = j;
    }
    if (P) {
      if (!Array.isArray(P))
        throw new Error("workerScripts.inflate must be an array");
      ht.workerScripts.inflate = P;
    }
  }
}
function ct(e, r) {
  r !== dr && (ht[e] = r);
}
const Tr = {
  application: {
    "andrew-inset": "ez",
    annodex: "anx",
    "atom+xml": "atom",
    "atomcat+xml": "atomcat",
    "atomserv+xml": "atomsrv",
    bbolin: "lin",
    "cu-seeme": "cu",
    "davmount+xml": "davmount",
    dsptype: "tsp",
    ecmascript: [
      "es",
      "ecma"
    ],
    futuresplash: "spl",
    hta: "hta",
    "java-archive": "jar",
    "java-serialized-object": "ser",
    "java-vm": "class",
    m3g: "m3g",
    "mac-binhex40": "hqx",
    mathematica: [
      "nb",
      "ma",
      "mb"
    ],
    msaccess: "mdb",
    msword: [
      "doc",
      "dot",
      "wiz"
    ],
    mxf: "mxf",
    oda: "oda",
    ogg: "ogx",
    pdf: "pdf",
    "pgp-keys": "key",
    "pgp-signature": [
      "asc",
      "sig"
    ],
    "pics-rules": "prf",
    postscript: [
      "ps",
      "ai",
      "eps",
      "epsi",
      "epsf",
      "eps2",
      "eps3"
    ],
    rar: "rar",
    "rdf+xml": "rdf",
    "rss+xml": "rss",
    rtf: "rtf",
    "xhtml+xml": [
      "xhtml",
      "xht"
    ],
    xml: [
      "xml",
      "xsl",
      "xsd",
      "xpdl"
    ],
    "xspf+xml": "xspf",
    zip: "zip",
    "vnd.android.package-archive": "apk",
    "vnd.cinderella": "cdy",
    "vnd.google-earth.kml+xml": "kml",
    "vnd.google-earth.kmz": "kmz",
    "vnd.mozilla.xul+xml": "xul",
    "vnd.ms-excel": [
      "xls",
      "xlb",
      "xlt",
      "xlm",
      "xla",
      "xlc",
      "xlw"
    ],
    "vnd.ms-pki.seccat": "cat",
    "vnd.ms-pki.stl": "stl",
    "vnd.ms-powerpoint": [
      "ppt",
      "pps",
      "pot",
      "ppa",
      "pwz"
    ],
    "vnd.oasis.opendocument.chart": "odc",
    "vnd.oasis.opendocument.database": "odb",
    "vnd.oasis.opendocument.formula": "odf",
    "vnd.oasis.opendocument.graphics": "odg",
    "vnd.oasis.opendocument.graphics-template": "otg",
    "vnd.oasis.opendocument.image": "odi",
    "vnd.oasis.opendocument.presentation": "odp",
    "vnd.oasis.opendocument.presentation-template": "otp",
    "vnd.oasis.opendocument.spreadsheet": "ods",
    "vnd.oasis.opendocument.spreadsheet-template": "ots",
    "vnd.oasis.opendocument.text": "odt",
    "vnd.oasis.opendocument.text-master": [
      "odm",
      "otm"
    ],
    "vnd.oasis.opendocument.text-template": "ott",
    "vnd.oasis.opendocument.text-web": "oth",
    "vnd.openxmlformats-officedocument.spreadsheetml.sheet": "xlsx",
    "vnd.openxmlformats-officedocument.spreadsheetml.template": "xltx",
    "vnd.openxmlformats-officedocument.presentationml.presentation": "pptx",
    "vnd.openxmlformats-officedocument.presentationml.slideshow": "ppsx",
    "vnd.openxmlformats-officedocument.presentationml.template": "potx",
    "vnd.openxmlformats-officedocument.wordprocessingml.document": "docx",
    "vnd.openxmlformats-officedocument.wordprocessingml.template": "dotx",
    "vnd.smaf": "mmf",
    "vnd.stardivision.calc": "sdc",
    "vnd.stardivision.chart": "sds",
    "vnd.stardivision.draw": "sda",
    "vnd.stardivision.impress": "sdd",
    "vnd.stardivision.math": [
      "sdf",
      "smf"
    ],
    "vnd.stardivision.writer": [
      "sdw",
      "vor"
    ],
    "vnd.stardivision.writer-global": "sgl",
    "vnd.sun.xml.calc": "sxc",
    "vnd.sun.xml.calc.template": "stc",
    "vnd.sun.xml.draw": "sxd",
    "vnd.sun.xml.draw.template": "std",
    "vnd.sun.xml.impress": "sxi",
    "vnd.sun.xml.impress.template": "sti",
    "vnd.sun.xml.math": "sxm",
    "vnd.sun.xml.writer": "sxw",
    "vnd.sun.xml.writer.global": "sxg",
    "vnd.sun.xml.writer.template": "stw",
    "vnd.symbian.install": [
      "sis",
      "sisx"
    ],
    "vnd.visio": [
      "vsd",
      "vst",
      "vss",
      "vsw",
      "vsdx",
      "vssx",
      "vstx",
      "vssm",
      "vstm"
    ],
    "vnd.wap.wbxml": "wbxml",
    "vnd.wap.wmlc": "wmlc",
    "vnd.wap.wmlscriptc": "wmlsc",
    "vnd.wordperfect": "wpd",
    "vnd.wordperfect5.1": "wp5",
    "x-123": "wk",
    "x-7z-compressed": "7z",
    "x-abiword": "abw",
    "x-apple-diskimage": "dmg",
    "x-bcpio": "bcpio",
    "x-bittorrent": "torrent",
    "x-cbr": [
      "cbr",
      "cba",
      "cbt",
      "cb7"
    ],
    "x-cbz": "cbz",
    "x-cdf": [
      "cdf",
      "cda"
    ],
    "x-cdlink": "vcd",
    "x-chess-pgn": "pgn",
    "x-cpio": "cpio",
    "x-csh": "csh",
    "x-director": [
      "dir",
      "dxr",
      "cst",
      "cct",
      "cxt",
      "w3d",
      "fgd",
      "swa"
    ],
    "x-dms": "dms",
    "x-doom": "wad",
    "x-dvi": "dvi",
    "x-httpd-eruby": "rhtml",
    "x-font": "pcf.Z",
    "x-freemind": "mm",
    "x-gnumeric": "gnumeric",
    "x-go-sgf": "sgf",
    "x-graphing-calculator": "gcf",
    "x-gtar": [
      "gtar",
      "taz"
    ],
    "x-hdf": "hdf",
    "x-httpd-php": [
      "phtml",
      "pht",
      "php"
    ],
    "x-httpd-php-source": "phps",
    "x-httpd-php3": "php3",
    "x-httpd-php3-preprocessed": "php3p",
    "x-httpd-php4": "php4",
    "x-httpd-php5": "php5",
    "x-ica": "ica",
    "x-info": "info",
    "x-internet-signup": [
      "ins",
      "isp"
    ],
    "x-iphone": "iii",
    "x-iso9660-image": "iso",
    "x-java-jnlp-file": "jnlp",
    "x-jmol": "jmz",
    "x-killustrator": "kil",
    "x-latex": "latex",
    "x-lyx": "lyx",
    "x-lzx": "lzx",
    "x-maker": [
      "frm",
      "fb",
      "fbdoc"
    ],
    "x-ms-wmd": "wmd",
    "x-msdos-program": [
      "com",
      "exe",
      "bat",
      "dll"
    ],
    "x-netcdf": [
      "nc"
    ],
    "x-ns-proxy-autoconfig": [
      "pac",
      "dat"
    ],
    "x-nwc": "nwc",
    "x-object": "o",
    "x-oz-application": "oza",
    "x-pkcs7-certreqresp": "p7r",
    "x-python-code": [
      "pyc",
      "pyo"
    ],
    "x-qgis": [
      "qgs",
      "shp",
      "shx"
    ],
    "x-quicktimeplayer": "qtl",
    "x-redhat-package-manager": [
      "rpm",
      "rpa"
    ],
    "x-ruby": "rb",
    "x-sh": "sh",
    "x-shar": "shar",
    "x-shockwave-flash": [
      "swf",
      "swfl"
    ],
    "x-silverlight": "scr",
    "x-stuffit": "sit",
    "x-sv4cpio": "sv4cpio",
    "x-sv4crc": "sv4crc",
    "x-tar": "tar",
    "x-tex-gf": "gf",
    "x-tex-pk": "pk",
    "x-texinfo": [
      "texinfo",
      "texi"
    ],
    "x-trash": [
      "~",
      "%",
      "bak",
      "old",
      "sik"
    ],
    "x-ustar": "ustar",
    "x-wais-source": "src",
    "x-wingz": "wz",
    "x-x509-ca-cert": [
      "crt",
      "der",
      "cer"
    ],
    "x-xcf": "xcf",
    "x-xfig": "fig",
    "x-xpinstall": "xpi",
    applixware: "aw",
    "atomsvc+xml": "atomsvc",
    "ccxml+xml": "ccxml",
    "cdmi-capability": "cdmia",
    "cdmi-container": "cdmic",
    "cdmi-domain": "cdmid",
    "cdmi-object": "cdmio",
    "cdmi-queue": "cdmiq",
    "docbook+xml": "dbk",
    "dssc+der": "dssc",
    "dssc+xml": "xdssc",
    "emma+xml": "emma",
    "epub+zip": "epub",
    exi: "exi",
    "font-tdpfr": "pfr",
    "gml+xml": "gml",
    "gpx+xml": "gpx",
    gxf: "gxf",
    hyperstudio: "stk",
    "inkml+xml": [
      "ink",
      "inkml"
    ],
    ipfix: "ipfix",
    "jsonml+json": "jsonml",
    "lost+xml": "lostxml",
    "mads+xml": "mads",
    marc: "mrc",
    "marcxml+xml": "mrcx",
    "mathml+xml": [
      "mathml",
      "mml"
    ],
    mbox: "mbox",
    "mediaservercontrol+xml": "mscml",
    "metalink+xml": "metalink",
    "metalink4+xml": "meta4",
    "mets+xml": "mets",
    "mods+xml": "mods",
    mp21: [
      "m21",
      "mp21"
    ],
    mp4: "mp4s",
    "oebps-package+xml": "opf",
    "omdoc+xml": "omdoc",
    onenote: [
      "onetoc",
      "onetoc2",
      "onetmp",
      "onepkg"
    ],
    oxps: "oxps",
    "patch-ops-error+xml": "xer",
    "pgp-encrypted": "pgp",
    pkcs10: "p10",
    "pkcs7-mime": [
      "p7m",
      "p7c"
    ],
    "pkcs7-signature": "p7s",
    pkcs8: "p8",
    "pkix-attr-cert": "ac",
    "pkix-crl": "crl",
    "pkix-pkipath": "pkipath",
    pkixcmp: "pki",
    "pls+xml": "pls",
    "prs.cww": "cww",
    "pskc+xml": "pskcxml",
    "reginfo+xml": "rif",
    "relax-ng-compact-syntax": "rnc",
    "resource-lists+xml": "rl",
    "resource-lists-diff+xml": "rld",
    "rls-services+xml": "rs",
    "rpki-ghostbusters": "gbr",
    "rpki-manifest": "mft",
    "rpki-roa": "roa",
    "rsd+xml": "rsd",
    "sbml+xml": "sbml",
    "scvp-cv-request": "scq",
    "scvp-cv-response": "scs",
    "scvp-vp-request": "spq",
    "scvp-vp-response": "spp",
    sdp: "sdp",
    "set-payment-initiation": "setpay",
    "set-registration-initiation": "setreg",
    "shf+xml": "shf",
    "sparql-query": "rq",
    "sparql-results+xml": "srx",
    srgs: "gram",
    "srgs+xml": "grxml",
    "sru+xml": "sru",
    "ssdl+xml": "ssdl",
    "ssml+xml": "ssml",
    "tei+xml": [
      "tei",
      "teicorpus"
    ],
    "thraud+xml": "tfi",
    "timestamped-data": "tsd",
    "vnd.3gpp.pic-bw-large": "plb",
    "vnd.3gpp.pic-bw-small": "psb",
    "vnd.3gpp.pic-bw-var": "pvb",
    "vnd.3gpp2.tcap": "tcap",
    "vnd.3m.post-it-notes": "pwn",
    "vnd.accpac.simply.aso": "aso",
    "vnd.accpac.simply.imp": "imp",
    "vnd.acucobol": "acu",
    "vnd.acucorp": [
      "atc",
      "acutc"
    ],
    "vnd.adobe.air-application-installer-package+zip": "air",
    "vnd.adobe.formscentral.fcdt": "fcdt",
    "vnd.adobe.fxp": [
      "fxp",
      "fxpl"
    ],
    "vnd.adobe.xdp+xml": "xdp",
    "vnd.adobe.xfdf": "xfdf",
    "vnd.ahead.space": "ahead",
    "vnd.airzip.filesecure.azf": "azf",
    "vnd.airzip.filesecure.azs": "azs",
    "vnd.amazon.ebook": "azw",
    "vnd.americandynamics.acc": "acc",
    "vnd.amiga.ami": "ami",
    "vnd.anser-web-certificate-issue-initiation": "cii",
    "vnd.anser-web-funds-transfer-initiation": "fti",
    "vnd.antix.game-component": "atx",
    "vnd.apple.installer+xml": "mpkg",
    "vnd.apple.mpegurl": "m3u8",
    "vnd.aristanetworks.swi": "swi",
    "vnd.astraea-software.iota": "iota",
    "vnd.audiograph": "aep",
    "vnd.blueice.multipass": "mpm",
    "vnd.bmi": "bmi",
    "vnd.businessobjects": "rep",
    "vnd.chemdraw+xml": "cdxml",
    "vnd.chipnuts.karaoke-mmd": "mmd",
    "vnd.claymore": "cla",
    "vnd.cloanto.rp9": "rp9",
    "vnd.clonk.c4group": [
      "c4g",
      "c4d",
      "c4f",
      "c4p",
      "c4u"
    ],
    "vnd.cluetrust.cartomobile-config": "c11amc",
    "vnd.cluetrust.cartomobile-config-pkg": "c11amz",
    "vnd.commonspace": "csp",
    "vnd.contact.cmsg": "cdbcmsg",
    "vnd.cosmocaller": "cmc",
    "vnd.crick.clicker": "clkx",
    "vnd.crick.clicker.keyboard": "clkk",
    "vnd.crick.clicker.palette": "clkp",
    "vnd.crick.clicker.template": "clkt",
    "vnd.crick.clicker.wordbank": "clkw",
    "vnd.criticaltools.wbs+xml": "wbs",
    "vnd.ctc-posml": "pml",
    "vnd.cups-ppd": "ppd",
    "vnd.curl.car": "car",
    "vnd.curl.pcurl": "pcurl",
    "vnd.dart": "dart",
    "vnd.data-vision.rdz": "rdz",
    "vnd.dece.data": [
      "uvf",
      "uvvf",
      "uvd",
      "uvvd"
    ],
    "vnd.dece.ttml+xml": [
      "uvt",
      "uvvt"
    ],
    "vnd.dece.unspecified": [
      "uvx",
      "uvvx"
    ],
    "vnd.dece.zip": [
      "uvz",
      "uvvz"
    ],
    "vnd.denovo.fcselayout-link": "fe_launch",
    "vnd.dna": "dna",
    "vnd.dolby.mlp": "mlp",
    "vnd.dpgraph": "dpg",
    "vnd.dreamfactory": "dfac",
    "vnd.ds-keypoint": "kpxx",
    "vnd.dvb.ait": "ait",
    "vnd.dvb.service": "svc",
    "vnd.dynageo": "geo",
    "vnd.ecowin.chart": "mag",
    "vnd.enliven": "nml",
    "vnd.epson.esf": "esf",
    "vnd.epson.msf": "msf",
    "vnd.epson.quickanime": "qam",
    "vnd.epson.salt": "slt",
    "vnd.epson.ssf": "ssf",
    "vnd.eszigno3+xml": [
      "es3",
      "et3"
    ],
    "vnd.ezpix-album": "ez2",
    "vnd.ezpix-package": "ez3",
    "vnd.fdf": "fdf",
    "vnd.fdsn.mseed": "mseed",
    "vnd.fdsn.seed": [
      "seed",
      "dataless"
    ],
    "vnd.flographit": "gph",
    "vnd.fluxtime.clip": "ftc",
    "vnd.framemaker": [
      "fm",
      "frame",
      "maker",
      "book"
    ],
    "vnd.frogans.fnc": "fnc",
    "vnd.frogans.ltf": "ltf",
    "vnd.fsc.weblaunch": "fsc",
    "vnd.fujitsu.oasys": "oas",
    "vnd.fujitsu.oasys2": "oa2",
    "vnd.fujitsu.oasys3": "oa3",
    "vnd.fujitsu.oasysgp": "fg5",
    "vnd.fujitsu.oasysprs": "bh2",
    "vnd.fujixerox.ddd": "ddd",
    "vnd.fujixerox.docuworks": "xdw",
    "vnd.fujixerox.docuworks.binder": "xbd",
    "vnd.fuzzysheet": "fzs",
    "vnd.genomatix.tuxedo": "txd",
    "vnd.geogebra.file": "ggb",
    "vnd.geogebra.tool": "ggt",
    "vnd.geometry-explorer": [
      "gex",
      "gre"
    ],
    "vnd.geonext": "gxt",
    "vnd.geoplan": "g2w",
    "vnd.geospace": "g3w",
    "vnd.gmx": "gmx",
    "vnd.grafeq": [
      "gqf",
      "gqs"
    ],
    "vnd.groove-account": "gac",
    "vnd.groove-help": "ghf",
    "vnd.groove-identity-message": "gim",
    "vnd.groove-injector": "grv",
    "vnd.groove-tool-message": "gtm",
    "vnd.groove-tool-template": "tpl",
    "vnd.groove-vcard": "vcg",
    "vnd.hal+xml": "hal",
    "vnd.handheld-entertainment+xml": "zmm",
    "vnd.hbci": "hbci",
    "vnd.hhe.lesson-player": "les",
    "vnd.hp-hpgl": "hpgl",
    "vnd.hp-hpid": "hpid",
    "vnd.hp-hps": "hps",
    "vnd.hp-jlyt": "jlt",
    "vnd.hp-pcl": "pcl",
    "vnd.hp-pclxl": "pclxl",
    "vnd.hydrostatix.sof-data": "sfd-hdstx",
    "vnd.ibm.minipay": "mpy",
    "vnd.ibm.modcap": [
      "afp",
      "listafp",
      "list3820"
    ],
    "vnd.ibm.rights-management": "irm",
    "vnd.ibm.secure-container": "sc",
    "vnd.iccprofile": [
      "icc",
      "icm"
    ],
    "vnd.igloader": "igl",
    "vnd.immervision-ivp": "ivp",
    "vnd.immervision-ivu": "ivu",
    "vnd.insors.igm": "igm",
    "vnd.intercon.formnet": [
      "xpw",
      "xpx"
    ],
    "vnd.intergeo": "i2g",
    "vnd.intu.qbo": "qbo",
    "vnd.intu.qfx": "qfx",
    "vnd.ipunplugged.rcprofile": "rcprofile",
    "vnd.irepository.package+xml": "irp",
    "vnd.is-xpr": "xpr",
    "vnd.isac.fcs": "fcs",
    "vnd.jam": "jam",
    "vnd.jcp.javame.midlet-rms": "rms",
    "vnd.jisp": "jisp",
    "vnd.joost.joda-archive": "joda",
    "vnd.kahootz": [
      "ktz",
      "ktr"
    ],
    "vnd.kde.karbon": "karbon",
    "vnd.kde.kchart": "chrt",
    "vnd.kde.kformula": "kfo",
    "vnd.kde.kivio": "flw",
    "vnd.kde.kontour": "kon",
    "vnd.kde.kpresenter": [
      "kpr",
      "kpt"
    ],
    "vnd.kde.kspread": "ksp",
    "vnd.kde.kword": [
      "kwd",
      "kwt"
    ],
    "vnd.kenameaapp": "htke",
    "vnd.kidspiration": "kia",
    "vnd.kinar": [
      "kne",
      "knp"
    ],
    "vnd.koan": [
      "skp",
      "skd",
      "skt",
      "skm"
    ],
    "vnd.kodak-descriptor": "sse",
    "vnd.las.las+xml": "lasxml",
    "vnd.llamagraphics.life-balance.desktop": "lbd",
    "vnd.llamagraphics.life-balance.exchange+xml": "lbe",
    "vnd.lotus-1-2-3": "123",
    "vnd.lotus-approach": "apr",
    "vnd.lotus-freelance": "pre",
    "vnd.lotus-notes": "nsf",
    "vnd.lotus-organizer": "org",
    "vnd.lotus-screencam": "scm",
    "vnd.lotus-wordpro": "lwp",
    "vnd.macports.portpkg": "portpkg",
    "vnd.mcd": "mcd",
    "vnd.medcalcdata": "mc1",
    "vnd.mediastation.cdkey": "cdkey",
    "vnd.mfer": "mwf",
    "vnd.mfmp": "mfm",
    "vnd.micrografx.flo": "flo",
    "vnd.micrografx.igx": "igx",
    "vnd.mif": "mif",
    "vnd.mobius.daf": "daf",
    "vnd.mobius.dis": "dis",
    "vnd.mobius.mbk": "mbk",
    "vnd.mobius.mqy": "mqy",
    "vnd.mobius.msl": "msl",
    "vnd.mobius.plc": "plc",
    "vnd.mobius.txf": "txf",
    "vnd.mophun.application": "mpn",
    "vnd.mophun.certificate": "mpc",
    "vnd.ms-artgalry": "cil",
    "vnd.ms-cab-compressed": "cab",
    "vnd.ms-excel.addin.macroenabled.12": "xlam",
    "vnd.ms-excel.sheet.binary.macroenabled.12": "xlsb",
    "vnd.ms-excel.sheet.macroenabled.12": "xlsm",
    "vnd.ms-excel.template.macroenabled.12": "xltm",
    "vnd.ms-fontobject": "eot",
    "vnd.ms-htmlhelp": "chm",
    "vnd.ms-ims": "ims",
    "vnd.ms-lrm": "lrm",
    "vnd.ms-officetheme": "thmx",
    "vnd.ms-powerpoint.addin.macroenabled.12": "ppam",
    "vnd.ms-powerpoint.presentation.macroenabled.12": "pptm",
    "vnd.ms-powerpoint.slide.macroenabled.12": "sldm",
    "vnd.ms-powerpoint.slideshow.macroenabled.12": "ppsm",
    "vnd.ms-powerpoint.template.macroenabled.12": "potm",
    "vnd.ms-project": [
      "mpp",
      "mpt"
    ],
    "vnd.ms-word.document.macroenabled.12": "docm",
    "vnd.ms-word.template.macroenabled.12": "dotm",
    "vnd.ms-works": [
      "wps",
      "wks",
      "wcm",
      "wdb"
    ],
    "vnd.ms-wpl": "wpl",
    "vnd.ms-xpsdocument": "xps",
    "vnd.mseq": "mseq",
    "vnd.musician": "mus",
    "vnd.muvee.style": "msty",
    "vnd.mynfc": "taglet",
    "vnd.neurolanguage.nlu": "nlu",
    "vnd.nitf": [
      "ntf",
      "nitf"
    ],
    "vnd.noblenet-directory": "nnd",
    "vnd.noblenet-sealer": "nns",
    "vnd.noblenet-web": "nnw",
    "vnd.nokia.n-gage.data": "ngdat",
    "vnd.nokia.n-gage.symbian.install": "n-gage",
    "vnd.nokia.radio-preset": "rpst",
    "vnd.nokia.radio-presets": "rpss",
    "vnd.novadigm.edm": "edm",
    "vnd.novadigm.edx": "edx",
    "vnd.novadigm.ext": "ext",
    "vnd.oasis.opendocument.chart-template": "otc",
    "vnd.oasis.opendocument.formula-template": "odft",
    "vnd.oasis.opendocument.image-template": "oti",
    "vnd.olpc-sugar": "xo",
    "vnd.oma.dd2+xml": "dd2",
    "vnd.openofficeorg.extension": "oxt",
    "vnd.openxmlformats-officedocument.presentationml.slide": "sldx",
    "vnd.osgeo.mapguide.package": "mgp",
    "vnd.osgi.dp": "dp",
    "vnd.osgi.subsystem": "esa",
    "vnd.palm": [
      "pdb",
      "pqa",
      "oprc"
    ],
    "vnd.pawaafile": "paw",
    "vnd.pg.format": "str",
    "vnd.pg.osasli": "ei6",
    "vnd.picsel": "efif",
    "vnd.pmi.widget": "wg",
    "vnd.pocketlearn": "plf",
    "vnd.powerbuilder6": "pbd",
    "vnd.previewsystems.box": "box",
    "vnd.proteus.magazine": "mgz",
    "vnd.publishare-delta-tree": "qps",
    "vnd.pvi.ptid1": "ptid",
    "vnd.quark.quarkxpress": [
      "qxd",
      "qxt",
      "qwd",
      "qwt",
      "qxl",
      "qxb"
    ],
    "vnd.realvnc.bed": "bed",
    "vnd.recordare.musicxml": "mxl",
    "vnd.recordare.musicxml+xml": "musicxml",
    "vnd.rig.cryptonote": "cryptonote",
    "vnd.rn-realmedia": "rm",
    "vnd.rn-realmedia-vbr": "rmvb",
    "vnd.route66.link66+xml": "link66",
    "vnd.sailingtracker.track": "st",
    "vnd.seemail": "see",
    "vnd.sema": "sema",
    "vnd.semd": "semd",
    "vnd.semf": "semf",
    "vnd.shana.informed.formdata": "ifm",
    "vnd.shana.informed.formtemplate": "itp",
    "vnd.shana.informed.interchange": "iif",
    "vnd.shana.informed.package": "ipk",
    "vnd.simtech-mindmapper": [
      "twd",
      "twds"
    ],
    "vnd.smart.teacher": "teacher",
    "vnd.solent.sdkm+xml": [
      "sdkm",
      "sdkd"
    ],
    "vnd.spotfire.dxp": "dxp",
    "vnd.spotfire.sfs": "sfs",
    "vnd.stepmania.package": "smzip",
    "vnd.stepmania.stepchart": "sm",
    "vnd.sus-calendar": [
      "sus",
      "susp"
    ],
    "vnd.svd": "svd",
    "vnd.syncml+xml": "xsm",
    "vnd.syncml.dm+wbxml": "bdm",
    "vnd.syncml.dm+xml": "xdm",
    "vnd.tao.intent-module-archive": "tao",
    "vnd.tcpdump.pcap": [
      "pcap",
      "cap",
      "dmp"
    ],
    "vnd.tmobile-livetv": "tmo",
    "vnd.trid.tpt": "tpt",
    "vnd.triscape.mxs": "mxs",
    "vnd.trueapp": "tra",
    "vnd.ufdl": [
      "ufd",
      "ufdl"
    ],
    "vnd.uiq.theme": "utz",
    "vnd.umajin": "umj",
    "vnd.unity": "unityweb",
    "vnd.uoml+xml": "uoml",
    "vnd.vcx": "vcx",
    "vnd.visionary": "vis",
    "vnd.vsf": "vsf",
    "vnd.webturbo": "wtb",
    "vnd.wolfram.player": "nbp",
    "vnd.wqd": "wqd",
    "vnd.wt.stf": "stf",
    "vnd.xara": "xar",
    "vnd.xfdl": "xfdl",
    "vnd.yamaha.hv-dic": "hvd",
    "vnd.yamaha.hv-script": "hvs",
    "vnd.yamaha.hv-voice": "hvp",
    "vnd.yamaha.openscoreformat": "osf",
    "vnd.yamaha.openscoreformat.osfpvg+xml": "osfpvg",
    "vnd.yamaha.smaf-audio": "saf",
    "vnd.yamaha.smaf-phrase": "spf",
    "vnd.yellowriver-custom-menu": "cmp",
    "vnd.zul": [
      "zir",
      "zirz"
    ],
    "vnd.zzazz.deck+xml": "zaz",
    "voicexml+xml": "vxml",
    widget: "wgt",
    winhlp: "hlp",
    "wsdl+xml": "wsdl",
    "wspolicy+xml": "wspolicy",
    "x-ace-compressed": "ace",
    "x-authorware-bin": [
      "aab",
      "x32",
      "u32",
      "vox"
    ],
    "x-authorware-map": "aam",
    "x-authorware-seg": "aas",
    "x-blorb": [
      "blb",
      "blorb"
    ],
    "x-bzip": "bz",
    "x-bzip2": [
      "bz2",
      "boz"
    ],
    "x-cfs-compressed": "cfs",
    "x-chat": "chat",
    "x-conference": "nsc",
    "x-dgc-compressed": "dgc",
    "x-dtbncx+xml": "ncx",
    "x-dtbook+xml": "dtb",
    "x-dtbresource+xml": "res",
    "x-eva": "eva",
    "x-font-bdf": "bdf",
    "x-font-ghostscript": "gsf",
    "x-font-linux-psf": "psf",
    "x-font-pcf": "pcf",
    "x-font-snf": "snf",
    "x-font-ttf": [
      "ttf",
      "ttc"
    ],
    "x-font-type1": [
      "pfa",
      "pfb",
      "pfm",
      "afm"
    ],
    "x-freearc": "arc",
    "x-gca-compressed": "gca",
    "x-glulx": "ulx",
    "x-gramps-xml": "gramps",
    "x-install-instructions": "install",
    "x-lzh-compressed": [
      "lzh",
      "lha"
    ],
    "x-mie": "mie",
    "x-mobipocket-ebook": [
      "prc",
      "mobi"
    ],
    "x-ms-application": "application",
    "x-ms-shortcut": "lnk",
    "x-ms-xbap": "xbap",
    "x-msbinder": "obd",
    "x-mscardfile": "crd",
    "x-msclip": "clp",
    "application/x-ms-installer": "msi",
    "x-msmediaview": [
      "mvb",
      "m13",
      "m14"
    ],
    "x-msmetafile": [
      "wmf",
      "wmz",
      "emf",
      "emz"
    ],
    "x-msmoney": "mny",
    "x-mspublisher": "pub",
    "x-msschedule": "scd",
    "x-msterminal": "trm",
    "x-mswrite": "wri",
    "x-nzb": "nzb",
    "x-pkcs12": [
      "p12",
      "pfx"
    ],
    "x-pkcs7-certificates": [
      "p7b",
      "spc"
    ],
    "x-research-info-systems": "ris",
    "x-silverlight-app": "xap",
    "x-sql": "sql",
    "x-stuffitx": "sitx",
    "x-subrip": "srt",
    "x-t3vm-image": "t3",
    "x-tex-tfm": "tfm",
    "x-tgif": "obj",
    "x-xliff+xml": "xlf",
    "x-xz": "xz",
    "x-zmachine": [
      "z1",
      "z2",
      "z3",
      "z4",
      "z5",
      "z6",
      "z7",
      "z8"
    ],
    "xaml+xml": "xaml",
    "xcap-diff+xml": "xdf",
    "xenc+xml": "xenc",
    "xml-dtd": "dtd",
    "xop+xml": "xop",
    "xproc+xml": "xpl",
    "xslt+xml": "xslt",
    "xv+xml": [
      "mxml",
      "xhvml",
      "xvml",
      "xvm"
    ],
    yang: "yang",
    "yin+xml": "yin",
    envoy: "evy",
    fractals: "fif",
    "internet-property-stream": "acx",
    olescript: "axs",
    "vnd.ms-outlook": "msg",
    "vnd.ms-pkicertstore": "sst",
    "x-compress": "z",
    "x-perfmon": [
      "pma",
      "pmc",
      "pmr",
      "pmw"
    ],
    "ynd.ms-pkipko": "pko",
    gzip: [
      "gz",
      "tgz"
    ],
    "smil+xml": [
      "smi",
      "smil"
    ],
    "vnd.debian.binary-package": [
      "deb",
      "udeb"
    ],
    "vnd.hzn-3d-crossword": "x3d",
    "vnd.sqlite3": [
      "db",
      "sqlite",
      "sqlite3",
      "db-wal",
      "sqlite-wal",
      "db-shm",
      "sqlite-shm"
    ],
    "vnd.wap.sic": "sic",
    "vnd.wap.slc": "slc",
    "x-krita": [
      "kra",
      "krz"
    ],
    "x-perl": [
      "pm",
      "pl"
    ],
    yaml: [
      "yaml",
      "yml"
    ]
  },
  audio: {
    amr: "amr",
    "amr-wb": "awb",
    annodex: "axa",
    basic: [
      "au",
      "snd"
    ],
    flac: "flac",
    midi: [
      "mid",
      "midi",
      "kar",
      "rmi"
    ],
    mpeg: [
      "mpga",
      "mpega",
      "mp3",
      "m4a",
      "mp2a",
      "m2a",
      "m3a"
    ],
    mpegurl: "m3u",
    ogg: [
      "oga",
      "ogg",
      "spx"
    ],
    "prs.sid": "sid",
    "x-aiff": "aifc",
    "x-gsm": "gsm",
    "x-ms-wma": "wma",
    "x-ms-wax": "wax",
    "x-pn-realaudio": "ram",
    "x-realaudio": "ra",
    "x-sd2": "sd2",
    adpcm: "adp",
    mp4: "mp4a",
    s3m: "s3m",
    silk: "sil",
    "vnd.dece.audio": [
      "uva",
      "uvva"
    ],
    "vnd.digital-winds": "eol",
    "vnd.dra": "dra",
    "vnd.dts": "dts",
    "vnd.dts.hd": "dtshd",
    "vnd.lucent.voice": "lvp",
    "vnd.ms-playready.media.pya": "pya",
    "vnd.nuera.ecelp4800": "ecelp4800",
    "vnd.nuera.ecelp7470": "ecelp7470",
    "vnd.nuera.ecelp9600": "ecelp9600",
    "vnd.rip": "rip",
    webm: "weba",
    "x-caf": "caf",
    "x-matroska": "mka",
    "x-pn-realaudio-plugin": "rmp",
    xm: "xm",
    aac: "aac",
    aiff: [
      "aiff",
      "aif",
      "aff"
    ],
    opus: "opus",
    wav: "wav"
  },
  chemical: {
    "x-alchemy": "alc",
    "x-cache": [
      "cac",
      "cache"
    ],
    "x-cache-csf": "csf",
    "x-cactvs-binary": [
      "cbin",
      "cascii",
      "ctab"
    ],
    "x-cdx": "cdx",
    "x-chem3d": "c3d",
    "x-cif": "cif",
    "x-cmdf": "cmdf",
    "x-cml": "cml",
    "x-compass": "cpa",
    "x-crossfire": "bsd",
    "x-csml": [
      "csml",
      "csm"
    ],
    "x-ctx": "ctx",
    "x-cxf": [
      "cxf",
      "cef"
    ],
    "x-embl-dl-nucleotide": [
      "emb",
      "embl"
    ],
    "x-gamess-input": [
      "inp",
      "gam",
      "gamin"
    ],
    "x-gaussian-checkpoint": [
      "fch",
      "fchk"
    ],
    "x-gaussian-cube": "cub",
    "x-gaussian-input": [
      "gau",
      "gjc",
      "gjf"
    ],
    "x-gaussian-log": "gal",
    "x-gcg8-sequence": "gcg",
    "x-genbank": "gen",
    "x-hin": "hin",
    "x-isostar": [
      "istr",
      "ist"
    ],
    "x-jcamp-dx": [
      "jdx",
      "dx"
    ],
    "x-kinemage": "kin",
    "x-macmolecule": "mcm",
    "x-macromodel-input": "mmod",
    "x-mdl-molfile": "mol",
    "x-mdl-rdfile": "rd",
    "x-mdl-rxnfile": "rxn",
    "x-mdl-sdfile": "sd",
    "x-mdl-tgf": "tgf",
    "x-mmcif": "mcif",
    "x-mol2": "mol2",
    "x-molconn-Z": "b",
    "x-mopac-graph": "gpt",
    "x-mopac-input": [
      "mop",
      "mopcrt",
      "zmt"
    ],
    "x-mopac-out": "moo",
    "x-ncbi-asn1": "asn",
    "x-ncbi-asn1-ascii": [
      "prt",
      "ent"
    ],
    "x-ncbi-asn1-binary": "val",
    "x-rosdal": "ros",
    "x-swissprot": "sw",
    "x-vamas-iso14976": "vms",
    "x-vmd": "vmd",
    "x-xtel": "xtel",
    "x-xyz": "xyz"
  },
  font: {
    otf: "otf",
    woff: "woff",
    woff2: "woff2"
  },
  image: {
    gif: "gif",
    ief: "ief",
    jpeg: [
      "jpeg",
      "jpg",
      "jpe",
      "jfif",
      "jfif-tbnl",
      "jif"
    ],
    pcx: "pcx",
    png: "png",
    "svg+xml": [
      "svg",
      "svgz"
    ],
    tiff: [
      "tiff",
      "tif"
    ],
    "vnd.djvu": [
      "djvu",
      "djv"
    ],
    "vnd.wap.wbmp": "wbmp",
    "x-canon-cr2": "cr2",
    "x-canon-crw": "crw",
    "x-cmu-raster": "ras",
    "x-coreldraw": "cdr",
    "x-coreldrawpattern": "pat",
    "x-coreldrawtemplate": "cdt",
    "x-corelphotopaint": "cpt",
    "x-epson-erf": "erf",
    "x-icon": "ico",
    "x-jg": "art",
    "x-jng": "jng",
    "x-nikon-nef": "nef",
    "x-olympus-orf": "orf",
    "x-portable-anymap": "pnm",
    "x-portable-bitmap": "pbm",
    "x-portable-graymap": "pgm",
    "x-portable-pixmap": "ppm",
    "x-rgb": "rgb",
    "x-xbitmap": "xbm",
    "x-xpixmap": "xpm",
    "x-xwindowdump": "xwd",
    bmp: "bmp",
    cgm: "cgm",
    g3fax: "g3",
    ktx: "ktx",
    "prs.btif": "btif",
    sgi: "sgi",
    "vnd.dece.graphic": [
      "uvi",
      "uvvi",
      "uvg",
      "uvvg"
    ],
    "vnd.dwg": "dwg",
    "vnd.dxf": "dxf",
    "vnd.fastbidsheet": "fbs",
    "vnd.fpx": "fpx",
    "vnd.fst": "fst",
    "vnd.fujixerox.edmics-mmr": "mmr",
    "vnd.fujixerox.edmics-rlc": "rlc",
    "vnd.ms-modi": "mdi",
    "vnd.ms-photo": "wdp",
    "vnd.net-fpx": "npx",
    "vnd.xiff": "xif",
    webp: "webp",
    "x-3ds": "3ds",
    "x-cmx": "cmx",
    "x-freehand": [
      "fh",
      "fhc",
      "fh4",
      "fh5",
      "fh7"
    ],
    "x-pict": [
      "pic",
      "pct"
    ],
    "x-tga": "tga",
    "cis-cod": "cod",
    avif: "avifs",
    heic: [
      "heif",
      "heic"
    ],
    pjpeg: [
      "pjpg"
    ],
    "vnd.adobe.photoshop": "psd",
    "x-adobe-dng": "dng",
    "x-fuji-raf": "raf",
    "x-icns": "icns",
    "x-kodak-dcr": "dcr",
    "x-kodak-k25": "k25",
    "x-kodak-kdc": "kdc",
    "x-minolta-mrw": "mrw",
    "x-panasonic-raw": [
      "raw",
      "rw2",
      "rwl"
    ],
    "x-pentax-pef": [
      "pef",
      "ptx"
    ],
    "x-sigma-x3f": "x3f",
    "x-sony-arw": "arw",
    "x-sony-sr2": "sr2",
    "x-sony-srf": "srf"
  },
  message: {
    rfc822: [
      "eml",
      "mime",
      "mht",
      "mhtml",
      "nws"
    ]
  },
  model: {
    iges: [
      "igs",
      "iges"
    ],
    mesh: [
      "msh",
      "mesh",
      "silo"
    ],
    vrml: [
      "wrl",
      "vrml"
    ],
    "x3d+vrml": [
      "x3dv",
      "x3dvz"
    ],
    "x3d+xml": "x3dz",
    "x3d+binary": [
      "x3db",
      "x3dbz"
    ],
    "vnd.collada+xml": "dae",
    "vnd.dwf": "dwf",
    "vnd.gdl": "gdl",
    "vnd.gtw": "gtw",
    "vnd.mts": "mts",
    "vnd.usdz+zip": "usdz",
    "vnd.vtu": "vtu"
  },
  text: {
    "cache-manifest": [
      "manifest",
      "appcache"
    ],
    calendar: [
      "ics",
      "icz",
      "ifb"
    ],
    css: "css",
    csv: "csv",
    h323: "323",
    html: [
      "html",
      "htm",
      "shtml",
      "stm"
    ],
    iuls: "uls",
    plain: [
      "txt",
      "text",
      "brf",
      "conf",
      "def",
      "list",
      "log",
      "in",
      "bas",
      "diff",
      "ksh"
    ],
    richtext: "rtx",
    scriptlet: [
      "sct",
      "wsc"
    ],
    texmacs: "tm",
    "tab-separated-values": "tsv",
    "vnd.sun.j2me.app-descriptor": "jad",
    "vnd.wap.wml": "wml",
    "vnd.wap.wmlscript": "wmls",
    "x-bibtex": "bib",
    "x-boo": "boo",
    "x-c++hdr": [
      "h++",
      "hpp",
      "hxx",
      "hh"
    ],
    "x-c++src": [
      "c++",
      "cpp",
      "cxx",
      "cc"
    ],
    "x-component": "htc",
    "x-dsrc": "d",
    "x-diff": "patch",
    "x-haskell": "hs",
    "x-java": "java",
    "x-literate-haskell": "lhs",
    "x-moc": "moc",
    "x-pascal": [
      "p",
      "pas",
      "pp",
      "inc"
    ],
    "x-pcs-gcd": "gcd",
    "x-python": "py",
    "x-scala": "scala",
    "x-setext": "etx",
    "x-tcl": [
      "tcl",
      "tk"
    ],
    "x-tex": [
      "tex",
      "ltx",
      "sty",
      "cls"
    ],
    "x-vcalendar": "vcs",
    "x-vcard": "vcf",
    n3: "n3",
    "prs.lines.tag": "dsc",
    sgml: [
      "sgml",
      "sgm"
    ],
    troff: [
      "t",
      "tr",
      "roff",
      "man",
      "me",
      "ms"
    ],
    turtle: "ttl",
    "uri-list": [
      "uri",
      "uris",
      "urls"
    ],
    vcard: "vcard",
    "vnd.curl": "curl",
    "vnd.curl.dcurl": "dcurl",
    "vnd.curl.scurl": "scurl",
    "vnd.curl.mcurl": "mcurl",
    "vnd.dvb.subtitle": "sub",
    "vnd.fly": "fly",
    "vnd.fmi.flexstor": "flx",
    "vnd.graphviz": "gv",
    "vnd.in3d.3dml": "3dml",
    "vnd.in3d.spot": "spot",
    "x-asm": [
      "s",
      "asm"
    ],
    "x-c": [
      "c",
      "h",
      "dic"
    ],
    "x-fortran": [
      "f",
      "for",
      "f77",
      "f90"
    ],
    "x-opml": "opml",
    "x-nfo": "nfo",
    "x-sfv": "sfv",
    "x-uuencode": "uu",
    webviewhtml: "htt",
    javascript: "js",
    json: "json",
    markdown: [
      "md",
      "markdown",
      "mdown",
      "markdn"
    ],
    "vnd.wap.si": "si",
    "vnd.wap.sl": "sl"
  },
  video: {
    avif: "avif",
    "3gpp": "3gp",
    annodex: "axv",
    dl: "dl",
    dv: [
      "dif",
      "dv"
    ],
    fli: "fli",
    gl: "gl",
    mpeg: [
      "mpeg",
      "mpg",
      "mpe",
      "m1v",
      "m2v",
      "mp2",
      "mpa",
      "mpv2"
    ],
    mp4: [
      "mp4",
      "mp4v",
      "mpg4"
    ],
    quicktime: [
      "qt",
      "mov"
    ],
    ogg: "ogv",
    "vnd.mpegurl": [
      "mxu",
      "m4u"
    ],
    "x-flv": "flv",
    "x-la-asf": [
      "lsf",
      "lsx"
    ],
    "x-mng": "mng",
    "x-ms-asf": [
      "asf",
      "asx",
      "asr"
    ],
    "x-ms-wm": "wm",
    "x-ms-wmv": "wmv",
    "x-ms-wmx": "wmx",
    "x-ms-wvx": "wvx",
    "x-msvideo": "avi",
    "x-sgi-movie": "movie",
    "x-matroska": [
      "mpv",
      "mkv",
      "mk3d",
      "mks"
    ],
    "3gpp2": "3g2",
    h261: "h261",
    h263: "h263",
    h264: "h264",
    jpeg: "jpgv",
    jpm: [
      "jpm",
      "jpgm"
    ],
    mj2: [
      "mj2",
      "mjp2"
    ],
    "vnd.dece.hd": [
      "uvh",
      "uvvh"
    ],
    "vnd.dece.mobile": [
      "uvm",
      "uvvm"
    ],
    "vnd.dece.pd": [
      "uvp",
      "uvvp"
    ],
    "vnd.dece.sd": [
      "uvs",
      "uvvs"
    ],
    "vnd.dece.video": [
      "uvv",
      "uvvv"
    ],
    "vnd.dvb.file": "dvb",
    "vnd.fvt": "fvt",
    "vnd.ms-playready.media.pyv": "pyv",
    "vnd.uvvu.mp4": [
      "uvu",
      "uvvu"
    ],
    "vnd.vivo": "viv",
    webm: "webm",
    "x-f4v": "f4v",
    "x-m4v": "m4v",
    "x-ms-vob": "vob",
    "x-smv": "smv",
    mp2t: "ts"
  },
  "x-conference": {
    "x-cooltalk": "ice"
  },
  "x-world": {
    "x-vrml": [
      "vrm",
      "flr",
      "wrz",
      "xaf",
      "xof"
    ]
  }
};
(() => {
  const e = {};
  for (const r of Object.keys(Tr))
    for (const t of Object.keys(Tr[r])) {
      const n = Tr[r][t];
      if (typeof n == "string")
        e[n] = r + "/" + t;
      else
        for (let i = 0; i < n.length; i++)
          e[n[i]] = r + "/" + t;
    }
  return e;
})();
const li = [];
for (let e = 0; e < 256; e++) {
  let r = e;
  for (let t = 0; t < 8; t++)
    r & 1 ? r = r >>> 1 ^ 3988292384 : r = r >>> 1;
  li[e] = r;
}
class Lr {
  constructor(r) {
    this.crc = r || -1;
  }
  append(r) {
    let t = this.crc | 0;
    for (let n = 0, i = r.length | 0; n < i; n++)
      t = t >>> 8 ^ li[(t ^ r[n]) & 255];
    this.crc = t;
  }
  get() {
    return ~this.crc;
  }
}
class fi extends TransformStream {
  constructor() {
    let r;
    const t = new Lr();
    super({
      transform(n, i) {
        t.append(n), i.enqueue(n);
      },
      flush() {
        const n = new Uint8Array(4);
        new DataView(n.buffer).setUint32(0, t.get()), r.value = n;
      }
    }), r = this;
  }
}
function Os(e) {
  if (typeof TextEncoder == yt) {
    e = unescape(encodeURIComponent(e));
    const r = new Uint8Array(e.length);
    for (let t = 0; t < r.length; t++)
      r[t] = e.charCodeAt(t);
    return r;
  } else
    return new TextEncoder().encode(e);
}
const De = {
  /**
   * Concatenate two bit arrays.
   * @param {bitArray} a1 The first array.
   * @param {bitArray} a2 The second array.
   * @return {bitArray} The concatenation of a1 and a2.
   */
  concat(e, r) {
    if (e.length === 0 || r.length === 0)
      return e.concat(r);
    const t = e[e.length - 1], n = De.getPartial(t);
    return n === 32 ? e.concat(r) : De._shiftRight(r, n, t | 0, e.slice(0, e.length - 1));
  },
  /**
   * Find the length of an array of bits.
   * @param {bitArray} a The array.
   * @return {Number} The length of a, in bits.
   */
  bitLength(e) {
    const r = e.length;
    if (r === 0)
      return 0;
    const t = e[r - 1];
    return (r - 1) * 32 + De.getPartial(t);
  },
  /**
   * Truncate an array.
   * @param {bitArray} a The array.
   * @param {Number} len The length to truncate to, in bits.
   * @return {bitArray} A new array, truncated to len bits.
   */
  clamp(e, r) {
    if (e.length * 32 < r)
      return e;
    e = e.slice(0, Math.ceil(r / 32));
    const t = e.length;
    return r = r & 31, t > 0 && r && (e[t - 1] = De.partial(r, e[t - 1] & 2147483648 >> r - 1, 1)), e;
  },
  /**
   * Make a partial word for a bit array.
   * @param {Number} len The number of bits in the word.
   * @param {Number} x The bits.
   * @param {Number} [_end=0] Pass 1 if x has already been shifted to the high side.
   * @return {Number} The partial word.
   */
  partial(e, r, t) {
    return e === 32 ? r : (t ? r | 0 : r << 32 - e) + e * 1099511627776;
  },
  /**
   * Get the number of bits used by a partial word.
   * @param {Number} x The partial word.
   * @return {Number} The number of bits used by the partial word.
   */
  getPartial(e) {
    return Math.round(e / 1099511627776) || 32;
  },
  /** Shift an array right.
   * @param {bitArray} a The array to shift.
   * @param {Number} shift The number of bits to shift.
   * @param {Number} [carry=0] A byte to carry in
   * @param {bitArray} [out=[]] An array to prepend to the output.
   * @private
   */
  _shiftRight(e, r, t, n) {
    for (n === void 0 && (n = []); r >= 32; r -= 32)
      n.push(t), t = 0;
    if (r === 0)
      return n.concat(e);
    for (let f = 0; f < e.length; f++)
      n.push(t | e[f] >>> r), t = e[f] << 32 - r;
    const i = e.length ? e[e.length - 1] : 0, s = De.getPartial(i);
    return n.push(De.partial(r + s & 31, r + s > 32 ? t : n.pop(), 1)), n;
  }
}, cr = {
  bytes: {
    /** Convert from a bitArray to an array of bytes. */
    fromBits(e) {
      const t = De.bitLength(e) / 8, n = new Uint8Array(t);
      let i;
      for (let s = 0; s < t; s++)
        (s & 3) === 0 && (i = e[s / 4]), n[s] = i >>> 24, i <<= 8;
      return n;
    },
    /** Convert from an array of bytes to a bitArray. */
    toBits(e) {
      const r = [];
      let t, n = 0;
      for (t = 0; t < e.length; t++)
        n = n << 8 | e[t], (t & 3) === 3 && (r.push(n), n = 0);
      return t & 3 && r.push(De.partial(8 * (t & 3), n)), r;
    }
  }
}, ui = {};
ui.sha1 = class {
  constructor(e) {
    const r = this;
    r.blockSize = 512, r._init = [1732584193, 4023233417, 2562383102, 271733878, 3285377520], r._key = [1518500249, 1859775393, 2400959708, 3395469782], e ? (r._h = e._h.slice(0), r._buffer = e._buffer.slice(0), r._length = e._length) : r.reset();
  }
  /**
   * Reset the hash state.
   * @return this
   */
  reset() {
    const e = this;
    return e._h = e._init.slice(0), e._buffer = [], e._length = 0, e;
  }
  /**
   * Input several words to the hash.
   * @param {bitArray|String} data the data to hash.
   * @return this
   */
  update(e) {
    const r = this;
    typeof e == "string" && (e = cr.utf8String.toBits(e));
    const t = r._buffer = De.concat(r._buffer, e), n = r._length, i = r._length = n + De.bitLength(e);
    if (i > 9007199254740991)
      throw new Error("Cannot hash more than 2^53 - 1 bits");
    const s = new Uint32Array(t);
    let f = 0;
    for (let u = r.blockSize + n - (r.blockSize + n & r.blockSize - 1); u <= i; u += r.blockSize)
      r._block(s.subarray(16 * f, 16 * (f + 1))), f += 1;
    return t.splice(0, 16 * f), r;
  }
  /**
   * Complete hashing and output the hash value.
   * @return {bitArray} The hash value, an array of 5 big-endian words. TODO
   */
  finalize() {
    const e = this;
    let r = e._buffer;
    const t = e._h;
    r = De.concat(r, [De.partial(1, 1)]);
    for (let n = r.length + 2; n & 15; n++)
      r.push(0);
    for (r.push(Math.floor(e._length / 4294967296)), r.push(e._length | 0); r.length; )
      e._block(r.splice(0, 16));
    return e.reset(), t;
  }
  /**
   * The SHA-1 logical functions f(0), f(1), ..., f(79).
   * @private
   */
  _f(e, r, t, n) {
    if (e <= 19)
      return r & t | ~r & n;
    if (e <= 39)
      return r ^ t ^ n;
    if (e <= 59)
      return r & t | r & n | t & n;
    if (e <= 79)
      return r ^ t ^ n;
  }
  /**
   * Circular left-shift operator.
   * @private
   */
  _S(e, r) {
    return r << e | r >>> 32 - e;
  }
  /**
   * Perform one cycle of SHA-1.
   * @param {Uint32Array|bitArray} words one block of words.
   * @private
   */
  _block(e) {
    const r = this, t = r._h, n = Array(80);
    for (let g = 0; g < 16; g++)
      n[g] = e[g];
    let i = t[0], s = t[1], f = t[2], u = t[3], b = t[4];
    for (let g = 0; g <= 79; g++) {
      g >= 16 && (n[g] = r._S(1, n[g - 3] ^ n[g - 8] ^ n[g - 14] ^ n[g - 16]));
      const A = r._S(5, i) + r._f(g, s, f, u) + b + n[g] + r._key[Math.floor(g / 20)] | 0;
      b = u, u = f, f = r._S(30, s), s = i, i = A;
    }
    t[0] = t[0] + i | 0, t[1] = t[1] + s | 0, t[2] = t[2] + f | 0, t[3] = t[3] + u | 0, t[4] = t[4] + b | 0;
  }
};
const di = {};
di.aes = class {
  constructor(e) {
    const r = this;
    r._tables = [[[], [], [], [], []], [[], [], [], [], []]], r._tables[0][0][0] || r._precompute();
    const t = r._tables[0][4], n = r._tables[1], i = e.length;
    let s, f, u, b = 1;
    if (i !== 4 && i !== 6 && i !== 8)
      throw new Error("invalid aes key size");
    for (r._key = [f = e.slice(0), u = []], s = i; s < 4 * i + 28; s++) {
      let g = f[s - 1];
      (s % i === 0 || i === 8 && s % i === 4) && (g = t[g >>> 24] << 24 ^ t[g >> 16 & 255] << 16 ^ t[g >> 8 & 255] << 8 ^ t[g & 255], s % i === 0 && (g = g << 8 ^ g >>> 24 ^ b << 24, b = b << 1 ^ (b >> 7) * 283)), f[s] = f[s - i] ^ g;
    }
    for (let g = 0; s; g++, s--) {
      const A = f[g & 3 ? s : s - 4];
      s <= 4 || g < 4 ? u[g] = A : u[g] = n[0][t[A >>> 24]] ^ n[1][t[A >> 16 & 255]] ^ n[2][t[A >> 8 & 255]] ^ n[3][t[A & 255]];
    }
  }
  // public
  /* Something like this might appear here eventually
  name: "AES",
  blockSize: 4,
  keySizes: [4,6,8],
  */
  /**
   * Encrypt an array of 4 big-endian words.
   * @param {Array} data The plaintext.
   * @return {Array} The ciphertext.
   */
  encrypt(e) {
    return this._crypt(e, 0);
  }
  /**
   * Decrypt an array of 4 big-endian words.
   * @param {Array} data The ciphertext.
   * @return {Array} The plaintext.
   */
  decrypt(e) {
    return this._crypt(e, 1);
  }
  /**
   * Expand the S-box tables.
   *
   * @private
   */
  _precompute() {
    const e = this._tables[0], r = this._tables[1], t = e[4], n = r[4], i = [], s = [];
    let f, u, b, g;
    for (let A = 0; A < 256; A++)
      s[(i[A] = A << 1 ^ (A >> 7) * 283) ^ A] = A;
    for (let A = f = 0; !t[A]; A ^= u || 1, f = s[f] || 1) {
      let w = f ^ f << 1 ^ f << 2 ^ f << 3 ^ f << 4;
      w = w >> 8 ^ w & 255 ^ 99, t[A] = w, n[w] = A, g = i[b = i[u = i[A]]];
      let j = g * 16843009 ^ b * 65537 ^ u * 257 ^ A * 16843008, P = i[w] * 257 ^ w * 16843008;
      for (let x = 0; x < 4; x++)
        e[x][A] = P = P << 24 ^ P >>> 8, r[x][w] = j = j << 24 ^ j >>> 8;
    }
    for (let A = 0; A < 5; A++)
      e[A] = e[A].slice(0), r[A] = r[A].slice(0);
  }
  /**
   * Encryption and decryption core.
   * @param {Array} input Four words to be encrypted or decrypted.
   * @param dir The direction, 0 for encrypt and 1 for decrypt.
   * @return {Array} The four encrypted or decrypted words.
   * @private
   */
  _crypt(e, r) {
    if (e.length !== 4)
      throw new Error("invalid aes block size");
    const t = this._key[r], n = t.length / 4 - 2, i = [0, 0, 0, 0], s = this._tables[r], f = s[0], u = s[1], b = s[2], g = s[3], A = s[4];
    let w = e[0] ^ t[0], j = e[r ? 3 : 1] ^ t[1], P = e[2] ^ t[2], x = e[r ? 1 : 3] ^ t[3], p = 4, y, m, S;
    for (let _ = 0; _ < n; _++)
      y = f[w >>> 24] ^ u[j >> 16 & 255] ^ b[P >> 8 & 255] ^ g[x & 255] ^ t[p], m = f[j >>> 24] ^ u[P >> 16 & 255] ^ b[x >> 8 & 255] ^ g[w & 255] ^ t[p + 1], S = f[P >>> 24] ^ u[x >> 16 & 255] ^ b[w >> 8 & 255] ^ g[j & 255] ^ t[p + 2], x = f[x >>> 24] ^ u[w >> 16 & 255] ^ b[j >> 8 & 255] ^ g[P & 255] ^ t[p + 3], p += 4, w = y, j = m, P = S;
    for (let _ = 0; _ < 4; _++)
      i[r ? 3 & -_ : _] = A[w >>> 24] << 24 ^ A[j >> 16 & 255] << 16 ^ A[P >> 8 & 255] << 8 ^ A[x & 255] ^ t[p++], y = w, w = j, j = P, P = x, x = y;
    return i;
  }
};
const As = {
  /** 
   * Generate random words with pure js, cryptographically not as strong & safe as native implementation.
   * @param {TypedArray} typedArray The array to fill.
   * @return {TypedArray} The random values.
   */
  getRandomValues(e) {
    const r = new Uint32Array(e.buffer), t = (n) => {
      let i = 987654321;
      const s = 4294967295;
      return function() {
        return i = 36969 * (i & 65535) + (i >> 16) & s, n = 18e3 * (n & 65535) + (n >> 16) & s, (((i << 16) + n & s) / 4294967296 + 0.5) * (Math.random() > 0.5 ? 1 : -1);
      };
    };
    for (let n = 0, i; n < e.length; n += 4) {
      const s = t((i || Math.random()) * 4294967296);
      i = s() * 987654071, r[n / 4] = s() * 4294967296 | 0;
    }
    return e;
  }
}, pi = {};
pi.ctrGladman = class {
  constructor(e, r) {
    this._prf = e, this._initIv = r, this._iv = r;
  }
  reset() {
    this._iv = this._initIv;
  }
  /** Input some data to calculate.
   * @param {bitArray} data the data to process, it must be intergral multiple of 128 bits unless it's the last.
   */
  update(e) {
    return this.calculate(this._prf, e, this._iv);
  }
  incWord(e) {
    if ((e >> 24 & 255) === 255) {
      let r = e >> 16 & 255, t = e >> 8 & 255, n = e & 255;
      r === 255 ? (r = 0, t === 255 ? (t = 0, n === 255 ? n = 0 : ++n) : ++t) : ++r, e = 0, e += r << 16, e += t << 8, e += n;
    } else
      e += 1 << 24;
    return e;
  }
  incCounter(e) {
    (e[0] = this.incWord(e[0])) === 0 && (e[1] = this.incWord(e[1]));
  }
  calculate(e, r, t) {
    let n;
    if (!(n = r.length))
      return [];
    const i = De.bitLength(r);
    for (let s = 0; s < n; s += 4) {
      this.incCounter(t);
      const f = e.encrypt(t);
      r[s] ^= f[0], r[s + 1] ^= f[1], r[s + 2] ^= f[2], r[s + 3] ^= f[3];
    }
    return De.clamp(r, i);
  }
};
const gt = {
  importKey(e) {
    return new gt.hmacSha1(cr.bytes.toBits(e));
  },
  pbkdf2(e, r, t, n) {
    if (t = t || 1e4, n < 0 || t < 0)
      throw new Error("invalid params to pbkdf2");
    const i = (n >> 5) + 1 << 2;
    let s, f, u, b, g;
    const A = new ArrayBuffer(i), w = new DataView(A);
    let j = 0;
    const P = De;
    for (r = cr.bytes.toBits(r), g = 1; j < (i || 1); g++) {
      for (s = f = e.encrypt(P.concat(r, [g])), u = 1; u < t; u++)
        for (f = e.encrypt(f), b = 0; b < f.length; b++)
          s[b] ^= f[b];
      for (u = 0; j < (i || 1) && u < s.length; u++)
        w.setInt32(j, s[u]), j += 4;
    }
    return A.slice(0, n / 8);
  }
};
gt.hmacSha1 = class {
  constructor(e) {
    const r = this, t = r._hash = ui.sha1, n = [[], []];
    r._baseHash = [new t(), new t()];
    const i = r._baseHash[0].blockSize / 32;
    e.length > i && (e = new t().update(e).finalize());
    for (let s = 0; s < i; s++)
      n[0][s] = e[s] ^ 909522486, n[1][s] = e[s] ^ 1549556828;
    r._baseHash[0].update(n[0]), r._baseHash[1].update(n[1]), r._resultHash = new t(r._baseHash[0]);
  }
  reset() {
    const e = this;
    e._resultHash = new e._hash(e._baseHash[0]), e._updated = !1;
  }
  update(e) {
    const r = this;
    r._updated = !0, r._resultHash.update(e);
  }
  digest() {
    const e = this, r = e._resultHash.finalize(), t = new e._hash(e._baseHash[1]).update(r).finalize();
    return e.reset(), t;
  }
  encrypt(e) {
    if (this._updated)
      throw new Error("encrypt on already updated hmac called!");
    return this.update(e), this.digest(e);
  }
};
const ks = typeof crypto != yt && typeof crypto.getRandomValues == Hr, hi = "Invalid password", mi = "Invalid signature", yi = "zipjs-abort-check-password";
function gi(e) {
  return ks ? crypto.getRandomValues(e) : As.getRandomValues(e);
}
const Et = 16, Ts = "raw", vi = { name: "PBKDF2" }, Rs = { name: "HMAC" }, Is = "SHA-1", js = Object.assign({ hash: Rs }, vi), Ur = Object.assign({ iterations: 1e3, hash: { name: Is } }, vi), Ps = ["deriveBits"], Bt = [8, 12, 16], jt = [16, 24, 32], lt = 10, Ns = [0, 0, 0, 0], pr = typeof crypto != yt, Mt = pr && crypto.subtle, bi = pr && typeof Mt != yt, Je = cr.bytes, Fs = di.aes, Bs = pi.ctrGladman, Cs = gt.hmacSha1;
let Hn = pr && bi && typeof Mt.importKey == Hr, Yn = pr && bi && typeof Mt.deriveBits == Hr;
class Ds extends TransformStream {
  constructor({ password: r, rawPassword: t, signed: n, encryptionStrength: i, checkPasswordOnly: s }) {
    super({
      start() {
        Object.assign(this, {
          ready: new Promise((f) => this.resolveReady = f),
          password: xi(r, t),
          signed: n,
          strength: i - 1,
          pending: new Uint8Array()
        });
      },
      async transform(f, u) {
        const b = this, {
          password: g,
          strength: A,
          resolveReady: w,
          ready: j
        } = b;
        g ? (await Us(b, A, g, $e(f, 0, Bt[A] + 2)), f = $e(f, Bt[A] + 2), s ? u.error(new Error(yi)) : w()) : await j;
        const P = new Uint8Array(f.length - lt - (f.length - lt) % Et);
        u.enqueue(wi(b, f, P, 0, lt, !0));
      },
      async flush(f) {
        const {
          signed: u,
          ctr: b,
          hmac: g,
          pending: A,
          ready: w
        } = this;
        if (g && b) {
          await w;
          const j = $e(A, 0, A.length - lt), P = $e(A, A.length - lt);
          let x = new Uint8Array();
          if (j.length) {
            const p = Dt(Je, j);
            g.update(p);
            const y = b.update(p);
            x = Ct(Je, y);
          }
          if (u) {
            const p = $e(Ct(Je, g.digest()), 0, lt);
            for (let y = 0; y < lt; y++)
              if (p[y] != P[y])
                throw new Error(mi);
          }
          f.enqueue(x);
        }
      }
    });
  }
}
class Ls extends TransformStream {
  constructor({ password: r, rawPassword: t, encryptionStrength: n }) {
    let i;
    super({
      start() {
        Object.assign(this, {
          ready: new Promise((s) => this.resolveReady = s),
          password: xi(r, t),
          strength: n - 1,
          pending: new Uint8Array()
        });
      },
      async transform(s, f) {
        const u = this, {
          password: b,
          strength: g,
          resolveReady: A,
          ready: w
        } = u;
        let j = new Uint8Array();
        b ? (j = await Ms(u, g, b), A()) : await w;
        const P = new Uint8Array(j.length + s.length - s.length % Et);
        P.set(j, 0), f.enqueue(wi(u, s, P, j.length, 0));
      },
      async flush(s) {
        const {
          ctr: f,
          hmac: u,
          pending: b,
          ready: g
        } = this;
        if (u && f) {
          await g;
          let A = new Uint8Array();
          if (b.length) {
            const w = f.update(Dt(Je, b));
            u.update(w), A = Ct(Je, w);
          }
          i.signature = Ct(Je, u.digest()).slice(0, lt), s.enqueue(Kr(A, i.signature));
        }
      }
    }), i = this;
  }
}
function wi(e, r, t, n, i, s) {
  const {
    ctr: f,
    hmac: u,
    pending: b
  } = e, g = r.length - i;
  b.length && (r = Kr(b, r), t = $s(t, g - g % Et));
  let A;
  for (A = 0; A <= g - Et; A += Et) {
    const w = Dt(Je, $e(r, A, A + Et));
    s && u.update(w);
    const j = f.update(w);
    s || u.update(j), t.set(Ct(Je, j), A + n);
  }
  return e.pending = $e(r, A), t;
}
async function Us(e, r, t, n) {
  const i = await _i(e, r, t, $e(n, 0, Bt[r])), s = $e(n, Bt[r]);
  if (i[0] != s[0] || i[1] != s[1])
    throw new Error(hi);
}
async function Ms(e, r, t) {
  const n = gi(new Uint8Array(Bt[r])), i = await _i(e, r, t, n);
  return Kr(n, i);
}
async function _i(e, r, t, n) {
  e.password = null;
  const i = await qs(Ts, t, js, !1, Ps), s = await Ws(Object.assign({ salt: n }, Ur), i, 8 * (jt[r] * 2 + 2)), f = new Uint8Array(s), u = Dt(Je, $e(f, 0, jt[r])), b = Dt(Je, $e(f, jt[r], jt[r] * 2)), g = $e(f, jt[r] * 2);
  return Object.assign(e, {
    keys: {
      key: u,
      authentication: b,
      passwordVerification: g
    },
    ctr: new Bs(new Fs(u), Array.from(Ns)),
    hmac: new Cs(b)
  }), g;
}
async function qs(e, r, t, n, i) {
  if (Hn)
    try {
      return await Mt.importKey(e, r, t, n, i);
    } catch {
      return Hn = !1, gt.importKey(r);
    }
  else
    return gt.importKey(r);
}
async function Ws(e, r, t) {
  if (Yn)
    try {
      return await Mt.deriveBits(e, r, t);
    } catch {
      return Yn = !1, gt.pbkdf2(r, e.salt, Ur.iterations, t);
    }
  else
    return gt.pbkdf2(r, e.salt, Ur.iterations, t);
}
function xi(e, r) {
  return r === dr ? Os(e) : r;
}
function Kr(e, r) {
  let t = e;
  return e.length + r.length && (t = new Uint8Array(e.length + r.length), t.set(e, 0), t.set(r, e.length)), t;
}
function $s(e, r) {
  if (r && r > e.length) {
    const t = e;
    e = new Uint8Array(r), e.set(t, 0);
  }
  return e;
}
function $e(e, r, t) {
  return e.subarray(r, t);
}
function Ct(e, r) {
  return e.fromBits(r);
}
function Dt(e, r) {
  return e.toBits(r);
}
const Nt = 12;
class Vs extends TransformStream {
  constructor({ password: r, passwordVerification: t, checkPasswordOnly: n }) {
    super({
      start() {
        Object.assign(this, {
          password: r,
          passwordVerification: t
        }), Ei(this, r);
      },
      transform(i, s) {
        const f = this;
        if (f.password) {
          const u = Kn(f, i.subarray(0, Nt));
          if (f.password = null, u.at(-1) != f.passwordVerification)
            throw new Error(hi);
          i = i.subarray(Nt);
        }
        n ? s.error(new Error(yi)) : s.enqueue(Kn(f, i));
      }
    });
  }
}
class Gs extends TransformStream {
  constructor({ password: r, passwordVerification: t }) {
    super({
      start() {
        Object.assign(this, {
          password: r,
          passwordVerification: t
        }), Ei(this, r);
      },
      transform(n, i) {
        const s = this;
        let f, u;
        if (s.password) {
          s.password = null;
          const b = gi(new Uint8Array(Nt));
          b[Nt - 1] = s.passwordVerification, f = new Uint8Array(n.length + b.length), f.set(Xn(s, b), 0), u = Nt;
        } else
          f = new Uint8Array(n.length), u = 0;
        f.set(Xn(s, n), u), i.enqueue(f);
      }
    });
  }
}
function Kn(e, r) {
  const t = new Uint8Array(r.length);
  for (let n = 0; n < r.length; n++)
    t[n] = Si(e) ^ r[n], Xr(e, t[n]);
  return t;
}
function Xn(e, r) {
  const t = new Uint8Array(r.length);
  for (let n = 0; n < r.length; n++)
    t[n] = Si(e) ^ r[n], Xr(e, r[n]);
  return t;
}
function Ei(e, r) {
  const t = [305419896, 591751049, 878082192];
  Object.assign(e, {
    keys: t,
    crcKey0: new Lr(t[0]),
    crcKey2: new Lr(t[2])
  });
  for (let n = 0; n < r.length; n++)
    Xr(e, r.charCodeAt(n));
}
function Xr(e, r) {
  let [t, n, i] = e.keys;
  e.crcKey0.append([r]), t = ~e.crcKey0.get(), n = Jn(Math.imul(Jn(n + Oi(t)), 134775813) + 1), e.crcKey2.append([n >>> 24]), i = ~e.crcKey2.get(), e.keys = [t, n, i];
}
function Si(e) {
  const r = e.keys[2] | 2;
  return Oi(Math.imul(r, r ^ 1) >>> 8);
}
function Oi(e) {
  return e & 255;
}
function Jn(e) {
  return e & 4294967295;
}
const Hs = "Invalid uncompressed size", Zn = "deflate-raw";
class Ys extends TransformStream {
  constructor(r, { chunkSize: t, CompressionStream: n, CompressionStreamNative: i }) {
    super({});
    const { compressed: s, encrypted: f, useCompressionStream: u, zipCrypto: b, signed: g, level: A } = r, w = this;
    let j, P, x = super.readable;
    (!f || b) && g && (j = new fi(), x = nt(x, j)), s && (x = ki(x, u, { level: A, chunkSize: t }, i, n)), f && (b ? x = nt(x, new Gs(r)) : (P = new Ls(r), x = nt(x, P))), Ai(w, x, () => {
      let p;
      f && !b && (p = P.signature), (!f || b) && g && (p = new DataView(j.value.buffer).getUint32(0)), w.signature = p;
    });
  }
}
class Ks extends TransformStream {
  constructor(r, { chunkSize: t, DecompressionStream: n, DecompressionStreamNative: i }) {
    super({});
    const { zipCrypto: s, encrypted: f, signed: u, signature: b, compressed: g, useCompressionStream: A } = r;
    let w, j, P = super.readable;
    f && (s ? P = nt(P, new Vs(r)) : (j = new Ds(r), P = nt(P, j))), g && (P = ki(P, A, { chunkSize: t }, i, n)), (!f || s) && u && (w = new fi(), P = nt(P, w)), Ai(this, P, () => {
      if ((!f || s) && u) {
        const x = new DataView(w.value.buffer);
        if (b != x.getUint32(0, !1))
          throw new Error(mi);
      }
    });
  }
}
function Ai(e, r, t) {
  r = nt(r, new TransformStream({ flush: t })), Object.defineProperty(e, "readable", {
    get() {
      return r;
    }
  });
}
function ki(e, r, t, n, i) {
  try {
    const s = r && n ? n : i;
    e = nt(e, new s(Zn, t));
  } catch (s) {
    if (r)
      e = nt(e, new i(Zn, t));
    else
      throw s;
  }
  return e;
}
function nt(e, r) {
  return e.pipeThrough(r);
}
const Xs = "deflate", Js = "inflate";
class Vc extends TransformStream {
  constructor(r, t) {
    super({});
    const n = this, { codecType: i } = r;
    let s;
    i.startsWith(Xs) ? s = Ys : i.startsWith(Js) && (s = Ks), n.outputSize = 0;
    let f = 0;
    const u = new s(r, t), b = super.readable, g = new TransformStream({
      transform(w, j) {
        w && w.length && (f += w.length, j.enqueue(w));
      },
      flush() {
        Object.assign(n, {
          inputSize: f
        });
      }
    }), A = new TransformStream({
      transform(w, j) {
        if (w && w.length && (j.enqueue(w), n.outputSize += w.length, r.outputSize && n.outputSize > r.outputSize))
          throw new Error(Hs);
      },
      flush() {
        const { signature: w } = u;
        Object.assign(n, {
          signature: w,
          inputSize: f
        });
      }
    });
    Object.defineProperty(n, "readable", {
      get() {
        return b.pipeThrough(g).pipeThrough(u).pipeThrough(A);
      }
    });
  }
}
class Gc extends TransformStream {
  constructor(r) {
    let t;
    super({
      transform: n,
      flush(i) {
        t && t.length && i.enqueue(t);
      }
    });
    function n(i, s) {
      if (t) {
        const f = new Uint8Array(t.length + i.length);
        f.set(t), f.set(i, t.length), i = f, t = null;
      }
      i.length > r ? (s.enqueue(i.slice(0, r)), n(i.slice(r), s)) : t = i;
    }
  }
}
class Hc extends TransformStream {
  constructor({ onstart: r, onprogress: t, size: n, onend: i }) {
    let s = 0;
    super({
      async start() {
        r && await Rr(r, n);
      },
      async transform(f, u) {
        s += f.length, t && await Rr(t, s, n), u.enqueue(f);
      },
      async flush() {
        i && await Rr(i, s);
      }
    });
  }
}
async function Rr(e, ...r) {
  try {
    await e(...r);
  } catch {
  }
}
function Zs(e, r = {}) {
  const t = `const{Array:e,Object:t,Number:n,Math:r,Error:s,Uint8Array:i,Uint16Array:o,Uint32Array:c,Int32Array:f,Map:a,DataView:l,Promise:u,TextEncoder:w,crypto:h,postMessage:d,TransformStream:p,ReadableStream:y,WritableStream:m,CompressionStream:b,DecompressionStream:g}=self,k=void 0,v="undefined",S="function";class z{constructor(e){return class extends p{constructor(t,n){const r=new e(n);super({transform(e,t){t.enqueue(r.append(e))},flush(e){const t=r.flush();t&&e.enqueue(t)}})}}}}const C=[];for(let e=0;256>e;e++){let t=e;for(let e=0;8>e;e++)1&t?t=t>>>1^3988292384:t>>>=1;C[e]=t}class x{constructor(e){this.t=e||-1}append(e){let t=0|this.t;for(let n=0,r=0|e.length;r>n;n++)t=t>>>8^C[255&(t^e[n])];this.t=t}get(){return~this.t}}class A extends p{constructor(){let e;const t=new x;super({transform(e,n){t.append(e),n.enqueue(e)},flush(){const n=new i(4);new l(n.buffer).setUint32(0,t.get()),e.value=n}}),e=this}}const I={concat(e,t){if(0===e.length||0===t.length)return e.concat(t);const n=e[e.length-1],r=I.i(n);return 32===r?e.concat(t):I.o(t,r,0|n,e.slice(0,e.length-1))},l(e){const t=e.length;if(0===t)return 0;const n=e[t-1];return 32*(t-1)+I.i(n)},u(e,t){if(32*e.length<t)return e;const n=(e=e.slice(0,r.ceil(t/32))).length;return t&=31,n>0&&t&&(e[n-1]=I.h(t,e[n-1]&2147483648>>t-1,1)),e},h:(e,t,n)=>32===e?t:(n?0|t:t<<32-e)+1099511627776*e,i:e=>r.round(e/1099511627776)||32,o(e,t,n,r){for(void 0===r&&(r=[]);t>=32;t-=32)r.push(n),n=0;if(0===t)return r.concat(e);for(let s=0;s<e.length;s++)r.push(n|e[s]>>>t),n=e[s]<<32-t;const s=e.length?e[e.length-1]:0,i=I.i(s);return r.push(I.h(t+i&31,t+i>32?n:r.pop(),1)),r}},_={bytes:{p(e){const t=I.l(e)/8,n=new i(t);let r;for(let s=0;t>s;s++)3&s||(r=e[s/4]),n[s]=r>>>24,r<<=8;return n},m(e){const t=[];let n,r=0;for(n=0;n<e.length;n++)r=r<<8|e[n],3&~n||(t.push(r),r=0);return 3&n&&t.push(I.h(8*(3&n),r)),t}}},P=class{constructor(e){const t=this;t.blockSize=512,t.k=[1732584193,4023233417,2562383102,271733878,3285377520],t.v=[1518500249,1859775393,2400959708,3395469782],e?(t.S=e.S.slice(0),t.C=e.C.slice(0),t.A=e.A):t.reset()}reset(){const e=this;return e.S=e.k.slice(0),e.C=[],e.A=0,e}update(e){const t=this;"string"==typeof e&&(e=_.I.m(e));const n=t.C=I.concat(t.C,e),r=t.A,i=t.A=r+I.l(e);if(i>9007199254740991)throw new s("Cannot hash more than 2^53 - 1 bits");const o=new c(n);let f=0;for(let e=t.blockSize+r-(t.blockSize+r&t.blockSize-1);i>=e;e+=t.blockSize)t._(o.subarray(16*f,16*(f+1))),f+=1;return n.splice(0,16*f),t}P(){const e=this;let t=e.C;const n=e.S;t=I.concat(t,[I.h(1,1)]);for(let e=t.length+2;15&e;e++)t.push(0);for(t.push(r.floor(e.A/4294967296)),t.push(0|e.A);t.length;)e._(t.splice(0,16));return e.reset(),n}D(e,t,n,r){return e>19?e>39?e>59?e>79?void 0:t^n^r:t&n|t&r|n&r:t^n^r:t&n|~t&r}V(e,t){return t<<e|t>>>32-e}_(t){const n=this,s=n.S,i=e(80);for(let e=0;16>e;e++)i[e]=t[e];let o=s[0],c=s[1],f=s[2],a=s[3],l=s[4];for(let e=0;79>=e;e++){16>e||(i[e]=n.V(1,i[e-3]^i[e-8]^i[e-14]^i[e-16]));const t=n.V(5,o)+n.D(e,c,f,a)+l+i[e]+n.v[r.floor(e/20)]|0;l=a,a=f,f=n.V(30,c),c=o,o=t}s[0]=s[0]+o|0,s[1]=s[1]+c|0,s[2]=s[2]+f|0,s[3]=s[3]+a|0,s[4]=s[4]+l|0}},D={getRandomValues(e){const t=new c(e.buffer),n=e=>{let t=987654321;const n=4294967295;return()=>(t=36969*(65535&t)+(t>>16)&n,(((t<<16)+(e=18e3*(65535&e)+(e>>16)&n)&n)/4294967296+.5)*(r.random()>.5?1:-1))};for(let s,i=0;i<e.length;i+=4){const e=n(4294967296*(s||r.random()));s=987654071*e(),t[i/4]=4294967296*e()|0}return e}},V={importKey:e=>new V.R(_.bytes.m(e)),B(e,t,n,r){if(n=n||1e4,0>r||0>n)throw new s("invalid params to pbkdf2");const i=1+(r>>5)<<2;let o,c,f,a,u;const w=new ArrayBuffer(i),h=new l(w);let d=0;const p=I;for(t=_.bytes.m(t),u=1;(i||1)>d;u++){for(o=c=e.encrypt(p.concat(t,[u])),f=1;n>f;f++)for(c=e.encrypt(c),a=0;a<c.length;a++)o[a]^=c[a];for(f=0;(i||1)>d&&f<o.length;f++)h.setInt32(d,o[f]),d+=4}return w.slice(0,r/8)},R:class{constructor(e){const t=this,n=t.M=P,r=[[],[]];t.U=[new n,new n];const s=t.U[0].blockSize/32;e.length>s&&(e=(new n).update(e).P());for(let t=0;s>t;t++)r[0][t]=909522486^e[t],r[1][t]=1549556828^e[t];t.U[0].update(r[0]),t.U[1].update(r[1]),t.K=new n(t.U[0])}reset(){const e=this;e.K=new e.M(e.U[0]),e.N=!1}update(e){this.N=!0,this.K.update(e)}digest(){const e=this,t=e.K.P(),n=new e.M(e.U[1]).update(t).P();return e.reset(),n}encrypt(e){if(this.N)throw new s("encrypt on already updated hmac called!");return this.update(e),this.digest(e)}}},R=typeof h!=v&&typeof h.getRandomValues==S,B="Invalid password",E="Invalid signature",M="zipjs-abort-check-password";function U(e){return R?h.getRandomValues(e):D.getRandomValues(e)}const K=16,N={name:"PBKDF2"},O=t.assign({hash:{name:"HMAC"}},N),T=t.assign({iterations:1e3,hash:{name:"SHA-1"}},N),W=["deriveBits"],j=[8,12,16],H=[16,24,32],L=10,F=[0,0,0,0],q=typeof h!=v,G=q&&h.subtle,J=q&&typeof G!=v,Q=_.bytes,X=class{constructor(e){const t=this;t.O=[[[],[],[],[],[]],[[],[],[],[],[]]],t.O[0][0][0]||t.T();const n=t.O[0][4],r=t.O[1],i=e.length;let o,c,f,a=1;if(4!==i&&6!==i&&8!==i)throw new s("invalid aes key size");for(t.v=[c=e.slice(0),f=[]],o=i;4*i+28>o;o++){let e=c[o-1];(o%i===0||8===i&&o%i===4)&&(e=n[e>>>24]<<24^n[e>>16&255]<<16^n[e>>8&255]<<8^n[255&e],o%i===0&&(e=e<<8^e>>>24^a<<24,a=a<<1^283*(a>>7))),c[o]=c[o-i]^e}for(let e=0;o;e++,o--){const t=c[3&e?o:o-4];f[e]=4>=o||4>e?t:r[0][n[t>>>24]]^r[1][n[t>>16&255]]^r[2][n[t>>8&255]]^r[3][n[255&t]]}}encrypt(e){return this.W(e,0)}decrypt(e){return this.W(e,1)}T(){const e=this.O[0],t=this.O[1],n=e[4],r=t[4],s=[],i=[];let o,c,f,a;for(let e=0;256>e;e++)i[(s[e]=e<<1^283*(e>>7))^e]=e;for(let l=o=0;!n[l];l^=c||1,o=i[o]||1){let i=o^o<<1^o<<2^o<<3^o<<4;i=i>>8^255&i^99,n[l]=i,r[i]=l,a=s[f=s[c=s[l]]];let u=16843009*a^65537*f^257*c^16843008*l,w=257*s[i]^16843008*i;for(let n=0;4>n;n++)e[n][l]=w=w<<24^w>>>8,t[n][i]=u=u<<24^u>>>8}for(let n=0;5>n;n++)e[n]=e[n].slice(0),t[n]=t[n].slice(0)}W(e,t){if(4!==e.length)throw new s("invalid aes block size");const n=this.v[t],r=n.length/4-2,i=[0,0,0,0],o=this.O[t],c=o[0],f=o[1],a=o[2],l=o[3],u=o[4];let w,h,d,p=e[0]^n[0],y=e[t?3:1]^n[1],m=e[2]^n[2],b=e[t?1:3]^n[3],g=4;for(let e=0;r>e;e++)w=c[p>>>24]^f[y>>16&255]^a[m>>8&255]^l[255&b]^n[g],h=c[y>>>24]^f[m>>16&255]^a[b>>8&255]^l[255&p]^n[g+1],d=c[m>>>24]^f[b>>16&255]^a[p>>8&255]^l[255&y]^n[g+2],b=c[b>>>24]^f[p>>16&255]^a[y>>8&255]^l[255&m]^n[g+3],g+=4,p=w,y=h,m=d;for(let e=0;4>e;e++)i[t?3&-e:e]=u[p>>>24]<<24^u[y>>16&255]<<16^u[m>>8&255]<<8^u[255&b]^n[g++],w=p,p=y,y=m,m=b,b=w;return i}},Y=class{constructor(e,t){this.j=e,this.H=t,this.L=t}reset(){this.L=this.H}update(e){return this.F(this.j,e,this.L)}q(e){if(255&~(e>>24))e+=1<<24;else{let t=e>>16&255,n=e>>8&255,r=255&e;255===t?(t=0,255===n?(n=0,255===r?r=0:++r):++n):++t,e=0,e+=t<<16,e+=n<<8,e+=r}return e}G(e){0===(e[0]=this.q(e[0]))&&(e[1]=this.q(e[1]))}F(e,t,n){let r;if(!(r=t.length))return[];const s=I.l(t);for(let s=0;r>s;s+=4){this.G(n);const r=e.encrypt(n);t[s]^=r[0],t[s+1]^=r[1],t[s+2]^=r[2],t[s+3]^=r[3]}return I.u(t,s)}},Z=V.R;let $=q&&J&&typeof G.importKey==S,ee=q&&J&&typeof G.deriveBits==S;class te extends p{constructor({password:e,rawPassword:n,signed:r,encryptionStrength:o,checkPasswordOnly:c}){super({start(){t.assign(this,{ready:new u(e=>this.J=e),password:ie(e,n),signed:r,X:o-1,pending:new i})},async transform(e,t){const n=this,{password:r,X:o,J:f,ready:a}=n;r?(await(async(e,t,n,r)=>{const i=await se(e,t,n,ce(r,0,j[t])),o=ce(r,j[t]);if(i[0]!=o[0]||i[1]!=o[1])throw new s(B)})(n,o,r,ce(e,0,j[o]+2)),e=ce(e,j[o]+2),c?t.error(new s(M)):f()):await a;const l=new i(e.length-L-(e.length-L)%K);t.enqueue(re(n,e,l,0,L,!0))},async flush(e){const{signed:t,Y:n,Z:r,pending:o,ready:c}=this;if(r&&n){await c;const f=ce(o,0,o.length-L),a=ce(o,o.length-L);let l=new i;if(f.length){const e=ae(Q,f);r.update(e);const t=n.update(e);l=fe(Q,t)}if(t){const e=ce(fe(Q,r.digest()),0,L);for(let t=0;L>t;t++)if(e[t]!=a[t])throw new s(E)}e.enqueue(l)}}})}}class ne extends p{constructor({password:e,rawPassword:n,encryptionStrength:r}){let s;super({start(){t.assign(this,{ready:new u(e=>this.J=e),password:ie(e,n),X:r-1,pending:new i})},async transform(e,t){const n=this,{password:r,X:s,J:o,ready:c}=n;let f=new i;r?(f=await(async(e,t,n)=>{const r=U(new i(j[t]));return oe(r,await se(e,t,n,r))})(n,s,r),o()):await c;const a=new i(f.length+e.length-e.length%K);a.set(f,0),t.enqueue(re(n,e,a,f.length,0))},async flush(e){const{Y:t,Z:n,pending:r,ready:o}=this;if(n&&t){await o;let c=new i;if(r.length){const e=t.update(ae(Q,r));n.update(e),c=fe(Q,e)}s.signature=fe(Q,n.digest()).slice(0,L),e.enqueue(oe(c,s.signature))}}}),s=this}}function re(e,t,n,r,s,o){const{Y:c,Z:f,pending:a}=e,l=t.length-s;let u;for(a.length&&(t=oe(a,t),n=((e,t)=>{if(t&&t>e.length){const n=e;(e=new i(t)).set(n,0)}return e})(n,l-l%K)),u=0;l-K>=u;u+=K){const e=ae(Q,ce(t,u,u+K));o&&f.update(e);const s=c.update(e);o||f.update(s),n.set(fe(Q,s),u+r)}return e.pending=ce(t,u),n}async function se(n,r,s,o){n.password=null;const c=await(async(e,t,n,r,s)=>{if(!$)return V.importKey(t);try{return await G.importKey("raw",t,n,!1,s)}catch(e){return $=!1,V.importKey(t)}})(0,s,O,0,W),f=await(async(e,t,n)=>{if(!ee)return V.B(t,e.salt,T.iterations,n);try{return await G.deriveBits(e,t,n)}catch(r){return ee=!1,V.B(t,e.salt,T.iterations,n)}})(t.assign({salt:o},T),c,8*(2*H[r]+2)),a=new i(f),l=ae(Q,ce(a,0,H[r])),u=ae(Q,ce(a,H[r],2*H[r])),w=ce(a,2*H[r]);return t.assign(n,{keys:{key:l,$:u,passwordVerification:w},Y:new Y(new X(l),e.from(F)),Z:new Z(u)}),w}function ie(e,t){return t===k?(e=>{if(typeof w==v){const t=new i((e=unescape(encodeURIComponent(e))).length);for(let n=0;n<t.length;n++)t[n]=e.charCodeAt(n);return t}return(new w).encode(e)})(e):t}function oe(e,t){let n=e;return e.length+t.length&&(n=new i(e.length+t.length),n.set(e,0),n.set(t,e.length)),n}function ce(e,t,n){return e.subarray(t,n)}function fe(e,t){return e.p(t)}function ae(e,t){return e.m(t)}class le extends p{constructor({password:e,passwordVerification:n,checkPasswordOnly:r}){super({start(){t.assign(this,{password:e,passwordVerification:n}),de(this,e)},transform(e,t){const n=this;if(n.password){const t=we(n,e.subarray(0,12));if(n.password=null,t.at(-1)!=n.passwordVerification)throw new s(B);e=e.subarray(12)}r?t.error(new s(M)):t.enqueue(we(n,e))}})}}class ue extends p{constructor({password:e,passwordVerification:n}){super({start(){t.assign(this,{password:e,passwordVerification:n}),de(this,e)},transform(e,t){const n=this;let r,s;if(n.password){n.password=null;const t=U(new i(12));t[11]=n.passwordVerification,r=new i(e.length+t.length),r.set(he(n,t),0),s=12}else r=new i(e.length),s=0;r.set(he(n,e),s),t.enqueue(r)}})}}function we(e,t){const n=new i(t.length);for(let r=0;r<t.length;r++)n[r]=ye(e)^t[r],pe(e,n[r]);return n}function he(e,t){const n=new i(t.length);for(let r=0;r<t.length;r++)n[r]=ye(e)^t[r],pe(e,t[r]);return n}function de(e,n){const r=[305419896,591751049,878082192];t.assign(e,{keys:r,ee:new x(r[0]),te:new x(r[2])});for(let t=0;t<n.length;t++)pe(e,n.charCodeAt(t))}function pe(e,t){let[n,s,i]=e.keys;e.ee.append([t]),n=~e.ee.get(),s=be(r.imul(be(s+me(n)),134775813)+1),e.te.append([s>>>24]),i=~e.te.get(),e.keys=[n,s,i]}function ye(e){const t=2|e.keys[2];return me(r.imul(t,1^t)>>>8)}function me(e){return 255&e}function be(e){return 4294967295&e}const ge="deflate-raw";class ke extends p{constructor(e,{chunkSize:t,CompressionStream:n,CompressionStreamNative:r}){super({});const{compressed:s,encrypted:i,useCompressionStream:o,zipCrypto:c,signed:f,level:a}=e,u=this;let w,h,d=super.readable;i&&!c||!f||(w=new A,d=Ce(d,w)),s&&(d=ze(d,o,{level:a,chunkSize:t},r,n)),i&&(c?d=Ce(d,new ue(e)):(h=new ne(e),d=Ce(d,h))),Se(u,d,()=>{let e;i&&!c&&(e=h.signature),i&&!c||!f||(e=new l(w.value.buffer).getUint32(0)),u.signature=e})}}class ve extends p{constructor(e,{chunkSize:t,DecompressionStream:n,DecompressionStreamNative:r}){super({});const{zipCrypto:i,encrypted:o,signed:c,signature:f,compressed:a,useCompressionStream:u}=e;let w,h,d=super.readable;o&&(i?d=Ce(d,new le(e)):(h=new te(e),d=Ce(d,h))),a&&(d=ze(d,u,{chunkSize:t},r,n)),o&&!i||!c||(w=new A,d=Ce(d,w)),Se(this,d,()=>{if((!o||i)&&c){const e=new l(w.value.buffer);if(f!=e.getUint32(0,!1))throw new s(E)}})}}function Se(e,n,r){n=Ce(n,new p({flush:r})),t.defineProperty(e,"readable",{get:()=>n})}function ze(e,t,n,r,s){try{e=Ce(e,new(t&&r?r:s)(ge,n))}catch(r){if(!t)throw r;e=Ce(e,new s(ge,n))}return e}function Ce(e,t){return e.pipeThrough(t)}const xe="data",Ae="close";class Ie extends p{constructor(e,n){super({});const r=this,{codecType:i}=e;let o;i.startsWith("deflate")?o=ke:i.startsWith("inflate")&&(o=ve),r.outputSize=0;let c=0;const f=new o(e,n),a=super.readable,l=new p({transform(e,t){e&&e.length&&(c+=e.length,t.enqueue(e))},flush(){t.assign(r,{inputSize:c})}}),u=new p({transform(t,n){if(t&&t.length&&(n.enqueue(t),r.outputSize+=t.length,e.outputSize&&r.outputSize>e.outputSize))throw new s("Invalid uncompressed size")},flush(){const{signature:e}=f;t.assign(r,{signature:e,inputSize:c})}});t.defineProperty(r,"readable",{get:()=>a.pipeThrough(l).pipeThrough(f).pipeThrough(u)})}}class _e extends p{constructor(e){let t;super({transform:function n(r,s){if(t){const e=new i(t.length+r.length);e.set(t),e.set(r,t.length),r=e,t=null}r.length>e?(s.enqueue(r.slice(0,e)),n(r.slice(e),s)):t=r},flush(e){t&&t.length&&e.enqueue(t)}})}}const Pe=new a,De=new a;let Ve,Re=0,Be=!0;async function Ee(e){try{const{options:t,scripts:r,config:s}=e;if(r&&r.length)try{Be?importScripts.apply(k,r):await Me(r)}catch(e){Be=!1,await Me(r)}self.initCodec&&self.initCodec(),s.CompressionStreamNative=self.CompressionStream,s.DecompressionStreamNative=self.DecompressionStream,self.Deflate&&(s.CompressionStream=new z(self.Deflate)),self.Inflate&&(s.DecompressionStream=new z(self.Inflate));const i={highWaterMark:1},o=e.readable||new y({async pull(e){const t=new u(e=>Pe.set(Re,e));Ue({type:"pull",messageId:Re}),Re=(Re+1)%n.MAX_SAFE_INTEGER;const{value:r,done:s}=await t;e.enqueue(r),s&&e.close()}},i),c=e.writable||new m({async write(e){let t;const r=new u(e=>t=e);De.set(Re,t),Ue({type:xe,value:e,messageId:Re}),Re=(Re+1)%n.MAX_SAFE_INTEGER,await r}},i),f=new Ie(t,s);Ve=new AbortController;const{signal:a}=Ve;await o.pipeThrough(f).pipeThrough(new _e(s.chunkSize)).pipeTo(c,{signal:a,preventClose:!0,preventAbort:!0}),await c.getWriter().close();const{signature:l,inputSize:w,outputSize:h}=f;Ue({type:Ae,result:{signature:l,inputSize:w,outputSize:h}})}catch(e){e.outputSize=0,Ke(e)}}async function Me(e){for(const t of e)await import(t)}function Ue(e){let{value:t}=e;if(t)if(t.length)try{t=new i(t),e.value=t.buffer,d(e,[e.value])}catch(t){d(e)}else d(e);else d(e)}function Ke(e=new s("Unknown error")){const{message:t,stack:n,code:r,name:i,outputSize:o}=e;d({error:{message:t,stack:n,code:r,name:i,outputSize:o}})}addEventListener("message",({data:e})=>{const{type:t,messageId:n,value:r,done:s}=e;try{if("start"==t&&Ee(e),t==xe){const e=Pe.get(n);Pe.delete(n),e({value:new i(r),done:s})}if("ack"==t){const e=De.get(n);De.delete(n),e()}t==Ae&&Ve.abort()}catch(e){Ke(e)}});const Ne=-2;function Oe(t){return Te(t.map(([t,n])=>new e(t).fill(n,0,t)))}function Te(t){return t.reduce((t,n)=>t.concat(e.isArray(n)?Te(n):n),[])}const We=[0,1,2,3].concat(...Oe([[2,4],[2,5],[4,6],[4,7],[8,8],[8,9],[16,10],[16,11],[32,12],[32,13],[64,14],[64,15],[2,0],[1,16],[1,17],[2,18],[2,19],[4,20],[4,21],[8,22],[8,23],[16,24],[16,25],[32,26],[32,27],[64,28],[64,29]]));function je(){const e=this;function t(e,t){let n=0;do{n|=1&e,e>>>=1,n<<=1}while(--t>0);return n>>>1}e.ne=n=>{const s=e.re,i=e.ie.se,o=e.ie.oe;let c,f,a,l=-1;for(n.ce=0,n.fe=573,c=0;o>c;c++)0!==s[2*c]?(n.ae[++n.ce]=l=c,n.le[c]=0):s[2*c+1]=0;for(;2>n.ce;)a=n.ae[++n.ce]=2>l?++l:0,s[2*a]=1,n.le[a]=0,n.ue--,i&&(n.we-=i[2*a+1]);for(e.he=l,c=r.floor(n.ce/2);c>=1;c--)n.de(s,c);a=o;do{c=n.ae[1],n.ae[1]=n.ae[n.ce--],n.de(s,1),f=n.ae[1],n.ae[--n.fe]=c,n.ae[--n.fe]=f,s[2*a]=s[2*c]+s[2*f],n.le[a]=r.max(n.le[c],n.le[f])+1,s[2*c+1]=s[2*f+1]=a,n.ae[1]=a++,n.de(s,1)}while(n.ce>=2);n.ae[--n.fe]=n.ae[1],(t=>{const n=e.re,r=e.ie.se,s=e.ie.pe,i=e.ie.ye,o=e.ie.me;let c,f,a,l,u,w,h=0;for(l=0;15>=l;l++)t.be[l]=0;for(n[2*t.ae[t.fe]+1]=0,c=t.fe+1;573>c;c++)f=t.ae[c],l=n[2*n[2*f+1]+1]+1,l>o&&(l=o,h++),n[2*f+1]=l,f>e.he||(t.be[l]++,u=0,i>f||(u=s[f-i]),w=n[2*f],t.ue+=w*(l+u),r&&(t.we+=w*(r[2*f+1]+u)));if(0!==h){do{for(l=o-1;0===t.be[l];)l--;t.be[l]--,t.be[l+1]+=2,t.be[o]--,h-=2}while(h>0);for(l=o;0!==l;l--)for(f=t.be[l];0!==f;)a=t.ae[--c],a>e.he||(n[2*a+1]!=l&&(t.ue+=(l-n[2*a+1])*n[2*a],n[2*a+1]=l),f--)}})(n),((e,n,r)=>{const s=[];let i,o,c,f=0;for(i=1;15>=i;i++)s[i]=f=f+r[i-1]<<1;for(o=0;n>=o;o++)c=e[2*o+1],0!==c&&(e[2*o]=t(s[c]++,c))})(s,e.he,n.be)}}function He(e,t,n,r,s){const i=this;i.se=e,i.pe=t,i.ye=n,i.oe=r,i.me=s}je.ge=[0,1,2,3,4,5,6,7].concat(...Oe([[2,8],[2,9],[2,10],[2,11],[4,12],[4,13],[4,14],[4,15],[8,16],[8,17],[8,18],[8,19],[16,20],[16,21],[16,22],[16,23],[32,24],[32,25],[32,26],[31,27],[1,28]])),je.ke=[0,1,2,3,4,5,6,7,8,10,12,14,16,20,24,28,32,40,48,56,64,80,96,112,128,160,192,224,0],je.ve=[0,1,2,3,4,6,8,12,16,24,32,48,64,96,128,192,256,384,512,768,1024,1536,2048,3072,4096,6144,8192,12288,16384,24576],je.Se=e=>256>e?We[e]:We[256+(e>>>7)],je.ze=[0,0,0,0,0,0,0,0,1,1,1,1,2,2,2,2,3,3,3,3,4,4,4,4,5,5,5,5,0],je.Ce=[0,0,0,0,1,1,2,2,3,3,4,4,5,5,6,6,7,7,8,8,9,9,10,10,11,11,12,12,13,13],je.xe=[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,2,3,7],je.Ae=[16,17,18,0,8,7,9,6,10,5,11,4,12,3,13,2,14,1,15];const Le=Oe([[144,8],[112,9],[24,7],[8,8]]);He.Ie=Te([12,140,76,204,44,172,108,236,28,156,92,220,60,188,124,252,2,130,66,194,34,162,98,226,18,146,82,210,50,178,114,242,10,138,74,202,42,170,106,234,26,154,90,218,58,186,122,250,6,134,70,198,38,166,102,230,22,150,86,214,54,182,118,246,14,142,78,206,46,174,110,238,30,158,94,222,62,190,126,254,1,129,65,193,33,161,97,225,17,145,81,209,49,177,113,241,9,137,73,201,41,169,105,233,25,153,89,217,57,185,121,249,5,133,69,197,37,165,101,229,21,149,85,213,53,181,117,245,13,141,77,205,45,173,109,237,29,157,93,221,61,189,125,253,19,275,147,403,83,339,211,467,51,307,179,435,115,371,243,499,11,267,139,395,75,331,203,459,43,299,171,427,107,363,235,491,27,283,155,411,91,347,219,475,59,315,187,443,123,379,251,507,7,263,135,391,71,327,199,455,39,295,167,423,103,359,231,487,23,279,151,407,87,343,215,471,55,311,183,439,119,375,247,503,15,271,143,399,79,335,207,463,47,303,175,431,111,367,239,495,31,287,159,415,95,351,223,479,63,319,191,447,127,383,255,511,0,64,32,96,16,80,48,112,8,72,40,104,24,88,56,120,4,68,36,100,20,84,52,116,3,131,67,195,35,163,99,227].map((e,t)=>[e,Le[t]]));const Fe=Oe([[30,5]]);function qe(e,t,n,r,s){const i=this;i._e=e,i.Pe=t,i.De=n,i.Ve=r,i.Re=s}He.Be=Te([0,16,8,24,4,20,12,28,2,18,10,26,6,22,14,30,1,17,9,25,5,21,13,29,3,19,11,27,7,23].map((e,t)=>[e,Fe[t]])),He.Ee=new He(He.Ie,je.ze,257,286,15),He.Me=new He(He.Be,je.Ce,0,30,15),He.Ue=new He(null,je.xe,0,19,7);const Ge=[new qe(0,0,0,0,0),new qe(4,4,8,4,1),new qe(4,5,16,8,1),new qe(4,6,32,32,1),new qe(4,4,16,16,2),new qe(8,16,32,32,2),new qe(8,16,128,128,2),new qe(8,32,128,256,2),new qe(32,128,258,1024,2),new qe(32,258,258,4096,2)],Je=["need dictionary","stream end","","","stream error","data error","","buffer error","",""],Qe=113,Xe=666,Ye=262;function Ze(e,t,n,r){const s=e[2*t],i=e[2*n];return i>s||s==i&&r[t]<=r[n]}function $e(){const e=this;let t,n,s,c,f,a,l,u,w,h,d,p,y,m,b,g,k,v,S,z,C,x,A,I,_,P,D,V,R,B,E,M,U;const K=new je,N=new je,O=new je;let T,W,j,H,L,F;function q(){let t;for(t=0;286>t;t++)E[2*t]=0;for(t=0;30>t;t++)M[2*t]=0;for(t=0;19>t;t++)U[2*t]=0;E[512]=1,e.ue=e.we=0,W=j=0}function G(e,t){let n,r=-1,s=e[1],i=0,o=7,c=4;0===s&&(o=138,c=3),e[2*(t+1)+1]=65535;for(let f=0;t>=f;f++)n=s,s=e[2*(f+1)+1],++i<o&&n==s||(c>i?U[2*n]+=i:0!==n?(n!=r&&U[2*n]++,U[32]++):i>10?U[36]++:U[34]++,i=0,r=n,0===s?(o=138,c=3):n==s?(o=6,c=3):(o=7,c=4))}function J(t){e.Ke[e.pending++]=t}function Q(e){J(255&e),J(e>>>8&255)}function X(e,t){let n;const r=t;F>16-r?(n=e,L|=n<<F&65535,Q(L),L=n>>>16-F,F+=r-16):(L|=e<<F&65535,F+=r)}function Y(e,t){const n=2*e;X(65535&t[n],65535&t[n+1])}function Z(e,t){let n,r,s=-1,i=e[1],o=0,c=7,f=4;for(0===i&&(c=138,f=3),n=0;t>=n;n++)if(r=i,i=e[2*(n+1)+1],++o>=c||r!=i){if(f>o)do{Y(r,U)}while(0!==--o);else 0!==r?(r!=s&&(Y(r,U),o--),Y(16,U),X(o-3,2)):o>10?(Y(18,U),X(o-11,7)):(Y(17,U),X(o-3,3));o=0,s=r,0===i?(c=138,f=3):r==i?(c=6,f=3):(c=7,f=4)}}function $(){16==F?(Q(L),L=0,F=0):8>F||(J(255&L),L>>>=8,F-=8)}function ee(t,n){let s,i,o;if(e.Ne[W]=t,e.Oe[W]=255&n,W++,0===t?E[2*n]++:(j++,t--,E[2*(je.ge[n]+256+1)]++,M[2*je.Se(t)]++),!(8191&W)&&D>2){for(s=8*W,i=C-k,o=0;30>o;o++)s+=M[2*o]*(5+je.Ce[o]);if(s>>>=3,j<r.floor(W/2)&&s<r.floor(i/2))return!0}return W==T-1}function te(t,n){let r,s,i,o,c=0;if(0!==W)do{r=e.Ne[c],s=e.Oe[c],c++,0===r?Y(s,t):(i=je.ge[s],Y(i+256+1,t),o=je.ze[i],0!==o&&(s-=je.ke[i],X(s,o)),r--,i=je.Se(r),Y(i,n),o=je.Ce[i],0!==o&&(r-=je.ve[i],X(r,o)))}while(W>c);Y(256,t),H=t[513]}function ne(){F>8?Q(L):F>0&&J(255&L),L=0,F=0}function re(t,n,r){X(0+(r?1:0),3),((t,n)=>{ne(),H=8,Q(n),Q(~n),e.Ke.set(u.subarray(t,t+n),e.pending),e.pending+=n})(t,n)}function se(n){((t,n,r)=>{let s,i,o=0;D>0?(K.ne(e),N.ne(e),o=(()=>{let t;for(G(E,K.he),G(M,N.he),O.ne(e),t=18;t>=3&&0===U[2*je.Ae[t]+1];t--);return e.ue+=14+3*(t+1),t})(),s=e.ue+3+7>>>3,i=e.we+3+7>>>3,i>s||(s=i)):s=i=n+5,n+4>s||-1==t?i==s?(X(2+(r?1:0),3),te(He.Ie,He.Be)):(X(4+(r?1:0),3),((e,t,n)=>{let r;for(X(e-257,5),X(t-1,5),X(n-4,4),r=0;n>r;r++)X(U[2*je.Ae[r]+1],3);Z(E,e-1),Z(M,t-1)})(K.he+1,N.he+1,o+1),te(E,M)):re(t,n,r),q(),r&&ne()})(0>k?-1:k,C-k,n),k=C,t.Te()}function ie(){let e,n,r,s;do{if(s=w-A-C,0===s&&0===C&&0===A)s=f;else if(-1==s)s--;else if(C>=f+f-Ye){u.set(u.subarray(f,f+f),0),x-=f,C-=f,k-=f,e=y,r=e;do{n=65535&d[--r],d[r]=f>n?0:n-f}while(0!==--e);e=f,r=e;do{n=65535&h[--r],h[r]=f>n?0:n-f}while(0!==--e);s+=f}if(0===t.We)return;e=t.je(u,C+A,s),A+=e,3>A||(p=255&u[C],p=(p<<g^255&u[C+1])&b)}while(Ye>A&&0!==t.We)}function oe(e){let t,n,r=_,s=C,i=I;const o=C>f-Ye?C-(f-Ye):0;let c=B;const a=l,w=C+258;let d=u[s+i-1],p=u[s+i];R>I||(r>>=2),c>A&&(c=A);do{if(t=e,u[t+i]==p&&u[t+i-1]==d&&u[t]==u[s]&&u[++t]==u[s+1]){s+=2,t++;do{}while(u[++s]==u[++t]&&u[++s]==u[++t]&&u[++s]==u[++t]&&u[++s]==u[++t]&&u[++s]==u[++t]&&u[++s]==u[++t]&&u[++s]==u[++t]&&u[++s]==u[++t]&&w>s);if(n=258-(w-s),s=w-258,n>i){if(x=e,i=n,n>=c)break;d=u[s+i-1],p=u[s+i]}}}while((e=65535&h[e&a])>o&&0!==--r);return i>A?A:i}e.le=[],e.be=[],e.ae=[],E=[],M=[],U=[],e.de=(t,n)=>{const r=e.ae,s=r[n];let i=n<<1;for(;i<=e.ce&&(i<e.ce&&Ze(t,r[i+1],r[i],e.le)&&i++,!Ze(t,s,r[i],e.le));)r[n]=r[i],n=i,i<<=1;r[n]=s},e.He=(t,S,x,W,j,G)=>(W||(W=8),j||(j=8),G||(G=0),t.Le=null,-1==S&&(S=6),1>j||j>9||8!=W||9>x||x>15||0>S||S>9||0>G||G>2?Ne:(t.Fe=e,a=x,f=1<<a,l=f-1,m=j+7,y=1<<m,b=y-1,g=r.floor((m+3-1)/3),u=new i(2*f),h=[],d=[],T=1<<j+6,e.Ke=new i(4*T),s=4*T,e.Ne=new o(T),e.Oe=new i(T),D=S,V=G,(t=>(t.qe=t.Ge=0,t.Le=null,e.pending=0,e.Je=0,n=Qe,c=0,K.re=E,K.ie=He.Ee,N.re=M,N.ie=He.Me,O.re=U,O.ie=He.Ue,L=0,F=0,H=8,q(),(()=>{w=2*f,d[y-1]=0;for(let e=0;y-1>e;e++)d[e]=0;P=Ge[D].Pe,R=Ge[D]._e,B=Ge[D].De,_=Ge[D].Ve,C=0,k=0,A=0,v=I=2,z=0,p=0})(),0))(t))),e.Qe=()=>42!=n&&n!=Qe&&n!=Xe?Ne:(e.Oe=null,e.Ne=null,e.Ke=null,d=null,h=null,u=null,e.Fe=null,n==Qe?-3:0),e.Xe=(e,t,n)=>{let r=0;return-1==t&&(t=6),0>t||t>9||0>n||n>2?Ne:(Ge[D].Re!=Ge[t].Re&&0!==e.qe&&(r=e.Ye(1)),D!=t&&(D=t,P=Ge[D].Pe,R=Ge[D]._e,B=Ge[D].De,_=Ge[D].Ve),V=n,r)},e.Ze=(e,t,r)=>{let s,i=r,o=0;if(!t||42!=n)return Ne;if(3>i)return 0;for(i>f-Ye&&(i=f-Ye,o=r-i),u.set(t.subarray(o,o+i),0),C=i,k=i,p=255&u[0],p=(p<<g^255&u[1])&b,s=0;i-3>=s;s++)p=(p<<g^255&u[s+2])&b,h[s&l]=d[p],d[p]=s;return 0},e.Ye=(r,i)=>{let o,w,m,_,R;if(i>4||0>i)return Ne;if(!r.$e||!r.et&&0!==r.We||n==Xe&&4!=i)return r.Le=Je[4],Ne;if(0===r.tt)return r.Le=Je[7],-5;var B;if(t=r,_=c,c=i,42==n&&(w=8+(a-8<<4)<<8,m=(D-1&255)>>1,m>3&&(m=3),w|=m<<6,0!==C&&(w|=32),w+=31-w%31,n=Qe,J((B=w)>>8&255),J(255&B)),0!==e.pending){if(t.Te(),0===t.tt)return c=-1,0}else if(0===t.We&&_>=i&&4!=i)return t.Le=Je[7],-5;if(n==Xe&&0!==t.We)return r.Le=Je[7],-5;if(0!==t.We||0!==A||0!=i&&n!=Xe){switch(R=-1,Ge[D].Re){case 0:R=(e=>{let n,r=65535;for(r>s-5&&(r=s-5);;){if(1>=A){if(ie(),0===A&&0==e)return 0;if(0===A)break}if(C+=A,A=0,n=k+r,(0===C||C>=n)&&(A=C-n,C=n,se(!1),0===t.tt))return 0;if(C-k>=f-Ye&&(se(!1),0===t.tt))return 0}return se(4==e),0===t.tt?4==e?2:0:4==e?3:1})(i);break;case 1:R=(e=>{let n,r=0;for(;;){if(Ye>A){if(ie(),Ye>A&&0==e)return 0;if(0===A)break}if(3>A||(p=(p<<g^255&u[C+2])&b,r=65535&d[p],h[C&l]=d[p],d[p]=C),0===r||(C-r&65535)>f-Ye||2!=V&&(v=oe(r)),3>v)n=ee(0,255&u[C]),A--,C++;else if(n=ee(C-x,v-3),A-=v,v>P||3>A)C+=v,v=0,p=255&u[C],p=(p<<g^255&u[C+1])&b;else{v--;do{C++,p=(p<<g^255&u[C+2])&b,r=65535&d[p],h[C&l]=d[p],d[p]=C}while(0!==--v);C++}if(n&&(se(!1),0===t.tt))return 0}return se(4==e),0===t.tt?4==e?2:0:4==e?3:1})(i);break;case 2:R=(e=>{let n,r,s=0;for(;;){if(Ye>A){if(ie(),Ye>A&&0==e)return 0;if(0===A)break}if(3>A||(p=(p<<g^255&u[C+2])&b,s=65535&d[p],h[C&l]=d[p],d[p]=C),I=v,S=x,v=2,0!==s&&P>I&&f-Ye>=(C-s&65535)&&(2!=V&&(v=oe(s)),5>=v&&(1==V||3==v&&C-x>4096)&&(v=2)),3>I||v>I)if(0!==z){if(n=ee(0,255&u[C-1]),n&&se(!1),C++,A--,0===t.tt)return 0}else z=1,C++,A--;else{r=C+A-3,n=ee(C-1-S,I-3),A-=I-1,I-=2;do{++C>r||(p=(p<<g^255&u[C+2])&b,s=65535&d[p],h[C&l]=d[p],d[p]=C)}while(0!==--I);if(z=0,v=2,C++,n&&(se(!1),0===t.tt))return 0}}return 0!==z&&(n=ee(0,255&u[C-1]),z=0),se(4==e),0===t.tt?4==e?2:0:4==e?3:1})(i)}if(2!=R&&3!=R||(n=Xe),0==R||2==R)return 0===t.tt&&(c=-1),0;if(1==R){if(1==i)X(2,3),Y(256,He.Ie),$(),9>1+H+10-F&&(X(2,3),Y(256,He.Ie),$()),H=7;else if(re(0,0,!1),3==i)for(o=0;y>o;o++)d[o]=0;if(t.Te(),0===t.tt)return c=-1,0}}return 4!=i?0:1}}function et(){const e=this;e.nt=0,e.rt=0,e.We=0,e.qe=0,e.tt=0,e.Ge=0}function tt(e){const t=new et,n=(o=e&&e.chunkSize?e.chunkSize:65536)+5*(r.floor(o/16383)+1);var o;const c=new i(n);let f=e?e.level:-1;void 0===f&&(f=-1),t.He(f),t.$e=c,this.append=(e,r)=>{let o,f,a=0,l=0,u=0;const w=[];if(e.length){t.nt=0,t.et=e,t.We=e.length;do{if(t.rt=0,t.tt=n,o=t.Ye(0),0!=o)throw new s("deflating: "+t.Le);t.rt&&(t.rt==n?w.push(new i(c)):w.push(c.subarray(0,t.rt))),u+=t.rt,r&&t.nt>0&&t.nt!=a&&(r(t.nt),a=t.nt)}while(t.We>0||0===t.tt);return w.length>1?(f=new i(u),w.forEach(e=>{f.set(e,l),l+=e.length})):f=w[0]?new i(w[0]):new i,f}},this.flush=()=>{let e,r,o=0,f=0;const a=[];do{if(t.rt=0,t.tt=n,e=t.Ye(4),1!=e&&0!=e)throw new s("deflating: "+t.Le);n-t.tt>0&&a.push(c.slice(0,t.rt)),f+=t.rt}while(t.We>0||0===t.tt);return t.Qe(),r=new i(f),a.forEach(e=>{r.set(e,o),o+=e.length}),r}}et.prototype={He(e,t){const n=this;return n.Fe=new $e,t||(t=15),n.Fe.He(n,e,t)},Ye(e){const t=this;return t.Fe?t.Fe.Ye(t,e):Ne},Qe(){const e=this;if(!e.Fe)return Ne;const t=e.Fe.Qe();return e.Fe=null,t},Xe(e,t){const n=this;return n.Fe?n.Fe.Xe(n,e,t):Ne},Ze(e,t){const n=this;return n.Fe?n.Fe.Ze(n,e,t):Ne},je(e,t,n){const r=this;let s=r.We;return s>n&&(s=n),0===s?0:(r.We-=s,e.set(r.et.subarray(r.nt,r.nt+s),t),r.nt+=s,r.qe+=s,s)},Te(){const e=this;let t=e.Fe.pending;t>e.tt&&(t=e.tt),0!==t&&(e.$e.set(e.Fe.Ke.subarray(e.Fe.Je,e.Fe.Je+t),e.rt),e.rt+=t,e.Fe.Je+=t,e.Ge+=t,e.tt-=t,e.Fe.pending-=t,0===e.Fe.pending&&(e.Fe.Je=0))}};const nt=-2,rt=-3,st=-5,it=[0,1,3,7,15,31,63,127,255,511,1023,2047,4095,8191,16383,32767,65535],ot=[96,7,256,0,8,80,0,8,16,84,8,115,82,7,31,0,8,112,0,8,48,0,9,192,80,7,10,0,8,96,0,8,32,0,9,160,0,8,0,0,8,128,0,8,64,0,9,224,80,7,6,0,8,88,0,8,24,0,9,144,83,7,59,0,8,120,0,8,56,0,9,208,81,7,17,0,8,104,0,8,40,0,9,176,0,8,8,0,8,136,0,8,72,0,9,240,80,7,4,0,8,84,0,8,20,85,8,227,83,7,43,0,8,116,0,8,52,0,9,200,81,7,13,0,8,100,0,8,36,0,9,168,0,8,4,0,8,132,0,8,68,0,9,232,80,7,8,0,8,92,0,8,28,0,9,152,84,7,83,0,8,124,0,8,60,0,9,216,82,7,23,0,8,108,0,8,44,0,9,184,0,8,12,0,8,140,0,8,76,0,9,248,80,7,3,0,8,82,0,8,18,85,8,163,83,7,35,0,8,114,0,8,50,0,9,196,81,7,11,0,8,98,0,8,34,0,9,164,0,8,2,0,8,130,0,8,66,0,9,228,80,7,7,0,8,90,0,8,26,0,9,148,84,7,67,0,8,122,0,8,58,0,9,212,82,7,19,0,8,106,0,8,42,0,9,180,0,8,10,0,8,138,0,8,74,0,9,244,80,7,5,0,8,86,0,8,22,192,8,0,83,7,51,0,8,118,0,8,54,0,9,204,81,7,15,0,8,102,0,8,38,0,9,172,0,8,6,0,8,134,0,8,70,0,9,236,80,7,9,0,8,94,0,8,30,0,9,156,84,7,99,0,8,126,0,8,62,0,9,220,82,7,27,0,8,110,0,8,46,0,9,188,0,8,14,0,8,142,0,8,78,0,9,252,96,7,256,0,8,81,0,8,17,85,8,131,82,7,31,0,8,113,0,8,49,0,9,194,80,7,10,0,8,97,0,8,33,0,9,162,0,8,1,0,8,129,0,8,65,0,9,226,80,7,6,0,8,89,0,8,25,0,9,146,83,7,59,0,8,121,0,8,57,0,9,210,81,7,17,0,8,105,0,8,41,0,9,178,0,8,9,0,8,137,0,8,73,0,9,242,80,7,4,0,8,85,0,8,21,80,8,258,83,7,43,0,8,117,0,8,53,0,9,202,81,7,13,0,8,101,0,8,37,0,9,170,0,8,5,0,8,133,0,8,69,0,9,234,80,7,8,0,8,93,0,8,29,0,9,154,84,7,83,0,8,125,0,8,61,0,9,218,82,7,23,0,8,109,0,8,45,0,9,186,0,8,13,0,8,141,0,8,77,0,9,250,80,7,3,0,8,83,0,8,19,85,8,195,83,7,35,0,8,115,0,8,51,0,9,198,81,7,11,0,8,99,0,8,35,0,9,166,0,8,3,0,8,131,0,8,67,0,9,230,80,7,7,0,8,91,0,8,27,0,9,150,84,7,67,0,8,123,0,8,59,0,9,214,82,7,19,0,8,107,0,8,43,0,9,182,0,8,11,0,8,139,0,8,75,0,9,246,80,7,5,0,8,87,0,8,23,192,8,0,83,7,51,0,8,119,0,8,55,0,9,206,81,7,15,0,8,103,0,8,39,0,9,174,0,8,7,0,8,135,0,8,71,0,9,238,80,7,9,0,8,95,0,8,31,0,9,158,84,7,99,0,8,127,0,8,63,0,9,222,82,7,27,0,8,111,0,8,47,0,9,190,0,8,15,0,8,143,0,8,79,0,9,254,96,7,256,0,8,80,0,8,16,84,8,115,82,7,31,0,8,112,0,8,48,0,9,193,80,7,10,0,8,96,0,8,32,0,9,161,0,8,0,0,8,128,0,8,64,0,9,225,80,7,6,0,8,88,0,8,24,0,9,145,83,7,59,0,8,120,0,8,56,0,9,209,81,7,17,0,8,104,0,8,40,0,9,177,0,8,8,0,8,136,0,8,72,0,9,241,80,7,4,0,8,84,0,8,20,85,8,227,83,7,43,0,8,116,0,8,52,0,9,201,81,7,13,0,8,100,0,8,36,0,9,169,0,8,4,0,8,132,0,8,68,0,9,233,80,7,8,0,8,92,0,8,28,0,9,153,84,7,83,0,8,124,0,8,60,0,9,217,82,7,23,0,8,108,0,8,44,0,9,185,0,8,12,0,8,140,0,8,76,0,9,249,80,7,3,0,8,82,0,8,18,85,8,163,83,7,35,0,8,114,0,8,50,0,9,197,81,7,11,0,8,98,0,8,34,0,9,165,0,8,2,0,8,130,0,8,66,0,9,229,80,7,7,0,8,90,0,8,26,0,9,149,84,7,67,0,8,122,0,8,58,0,9,213,82,7,19,0,8,106,0,8,42,0,9,181,0,8,10,0,8,138,0,8,74,0,9,245,80,7,5,0,8,86,0,8,22,192,8,0,83,7,51,0,8,118,0,8,54,0,9,205,81,7,15,0,8,102,0,8,38,0,9,173,0,8,6,0,8,134,0,8,70,0,9,237,80,7,9,0,8,94,0,8,30,0,9,157,84,7,99,0,8,126,0,8,62,0,9,221,82,7,27,0,8,110,0,8,46,0,9,189,0,8,14,0,8,142,0,8,78,0,9,253,96,7,256,0,8,81,0,8,17,85,8,131,82,7,31,0,8,113,0,8,49,0,9,195,80,7,10,0,8,97,0,8,33,0,9,163,0,8,1,0,8,129,0,8,65,0,9,227,80,7,6,0,8,89,0,8,25,0,9,147,83,7,59,0,8,121,0,8,57,0,9,211,81,7,17,0,8,105,0,8,41,0,9,179,0,8,9,0,8,137,0,8,73,0,9,243,80,7,4,0,8,85,0,8,21,80,8,258,83,7,43,0,8,117,0,8,53,0,9,203,81,7,13,0,8,101,0,8,37,0,9,171,0,8,5,0,8,133,0,8,69,0,9,235,80,7,8,0,8,93,0,8,29,0,9,155,84,7,83,0,8,125,0,8,61,0,9,219,82,7,23,0,8,109,0,8,45,0,9,187,0,8,13,0,8,141,0,8,77,0,9,251,80,7,3,0,8,83,0,8,19,85,8,195,83,7,35,0,8,115,0,8,51,0,9,199,81,7,11,0,8,99,0,8,35,0,9,167,0,8,3,0,8,131,0,8,67,0,9,231,80,7,7,0,8,91,0,8,27,0,9,151,84,7,67,0,8,123,0,8,59,0,9,215,82,7,19,0,8,107,0,8,43,0,9,183,0,8,11,0,8,139,0,8,75,0,9,247,80,7,5,0,8,87,0,8,23,192,8,0,83,7,51,0,8,119,0,8,55,0,9,207,81,7,15,0,8,103,0,8,39,0,9,175,0,8,7,0,8,135,0,8,71,0,9,239,80,7,9,0,8,95,0,8,31,0,9,159,84,7,99,0,8,127,0,8,63,0,9,223,82,7,27,0,8,111,0,8,47,0,9,191,0,8,15,0,8,143,0,8,79,0,9,255],ct=[80,5,1,87,5,257,83,5,17,91,5,4097,81,5,5,89,5,1025,85,5,65,93,5,16385,80,5,3,88,5,513,84,5,33,92,5,8193,82,5,9,90,5,2049,86,5,129,192,5,24577,80,5,2,87,5,385,83,5,25,91,5,6145,81,5,7,89,5,1537,85,5,97,93,5,24577,80,5,4,88,5,769,84,5,49,92,5,12289,82,5,13,90,5,3073,86,5,193,192,5,24577],ft=[3,4,5,6,7,8,9,10,11,13,15,17,19,23,27,31,35,43,51,59,67,83,99,115,131,163,195,227,258,0,0],at=[0,0,0,0,0,0,0,0,1,1,1,1,2,2,2,2,3,3,3,3,4,4,4,4,5,5,5,5,0,112,112],lt=[1,2,3,4,5,7,9,13,17,25,33,49,65,97,129,193,257,385,513,769,1025,1537,2049,3073,4097,6145,8193,12289,16385,24577],ut=[0,0,0,0,1,1,2,2,3,3,4,4,5,5,6,6,7,7,8,8,9,9,10,10,11,11,12,12,13,13];function wt(){let e,t,n,r,s,i;function o(e,t,o,c,f,a,l,u,w,h,d){let p,y,m,b,g,k,v,S,z,C,x,A,I,_,P;C=0,g=o;do{n[e[t+C]]++,C++,g--}while(0!==g);if(n[0]==o)return l[0]=-1,u[0]=0,0;for(S=u[0],k=1;15>=k&&0===n[k];k++);for(v=k,k>S&&(S=k),g=15;0!==g&&0===n[g];g--);for(m=g,S>g&&(S=g),u[0]=S,_=1<<k;g>k;k++,_<<=1)if(0>(_-=n[k]))return rt;if(0>(_-=n[g]))return rt;for(n[g]+=_,i[1]=k=0,C=1,I=2;0!==--g;)i[I]=k+=n[C],I++,C++;g=0,C=0;do{0!==(k=e[t+C])&&(d[i[k]++]=g),C++}while(++g<o);for(o=i[m],i[0]=g=0,C=0,b=-1,A=-S,s[0]=0,x=0,P=0;m>=v;v++)for(p=n[v];0!==p--;){for(;v>A+S;){if(b++,A+=S,P=m-A,P=P>S?S:P,(y=1<<(k=v-A))>p+1&&(y-=p+1,I=v,P>k))for(;++k<P&&(y<<=1)>n[++I];)y-=n[I];if(P=1<<k,h[0]+P>1440)return rt;s[b]=x=h[0],h[0]+=P,0!==b?(i[b]=g,r[0]=k,r[1]=S,k=g>>>A-S,r[2]=x-s[b-1]-k,w.set(r,3*(s[b-1]+k))):l[0]=x}for(r[1]=v-A,o>C?d[C]<c?(r[0]=256>d[C]?0:96,r[2]=d[C++]):(r[0]=a[d[C]-c]+16+64,r[2]=f[d[C++]-c]):r[0]=192,y=1<<v-A,k=g>>>A;P>k;k+=y)w.set(r,3*(x+k));for(k=1<<v-1;0!==(g&k);k>>>=1)g^=k;for(g^=k,z=(1<<A)-1;(g&z)!=i[b];)b--,A-=S,z=(1<<A)-1}return 0!==_&&1!=m?st:0}function c(o){let c;for(e||(e=[],t=[],n=new f(16),r=[],s=new f(15),i=new f(16)),t.length<o&&(t=[]),c=0;o>c;c++)t[c]=0;for(c=0;16>c;c++)n[c]=0;for(c=0;3>c;c++)r[c]=0;s.set(n.subarray(0,15),0),i.set(n.subarray(0,16),0)}this.st=(n,r,s,i,f)=>{let a;return c(19),e[0]=0,a=o(n,0,19,19,null,null,s,r,i,e,t),a==rt?f.Le="oversubscribed dynamic bit lengths tree":a!=st&&0!==r[0]||(f.Le="incomplete dynamic bit lengths tree",a=rt),a},this.it=(n,r,s,i,f,a,l,u,w)=>{let h;return c(288),e[0]=0,h=o(s,0,n,257,ft,at,a,i,u,e,t),0!=h||0===i[0]?(h==rt?w.Le="oversubscribed literal/length tree":-4!=h&&(w.Le="incomplete literal/length tree",h=rt),h):(c(288),h=o(s,n,r,0,lt,ut,l,f,u,e,t),0!=h||0===f[0]&&n>257?(h==rt?w.Le="oversubscribed distance tree":h==st?(w.Le="incomplete distance tree",h=rt):-4!=h&&(w.Le="empty distance tree with lengths",h=rt),h):0)}}function ht(){const e=this;let t,n,r,s,i=0,o=0,c=0,f=0,a=0,l=0,u=0,w=0,h=0,d=0;function p(e,t,n,r,s,i,o,c){let f,a,l,u,w,h,d,p,y,m,b,g,k,v,S,z;d=c.nt,p=c.We,w=o.ot,h=o.ct,y=o.write,m=y<o.read?o.read-y-1:o.end-y,b=it[e],g=it[t];do{for(;20>h;)p--,w|=(255&c.ft(d++))<<h,h+=8;if(f=w&b,a=n,l=r,z=3*(l+f),0!==(u=a[z]))for(;;){if(w>>=a[z+1],h-=a[z+1],16&u){for(u&=15,k=a[z+2]+(w&it[u]),w>>=u,h-=u;15>h;)p--,w|=(255&c.ft(d++))<<h,h+=8;for(f=w&g,a=s,l=i,z=3*(l+f),u=a[z];;){if(w>>=a[z+1],h-=a[z+1],16&u){for(u&=15;u>h;)p--,w|=(255&c.ft(d++))<<h,h+=8;if(v=a[z+2]+(w&it[u]),w>>=u,h-=u,m-=k,v>y){S=y-v;do{S+=o.end}while(0>S);if(u=o.end-S,k>u){if(k-=u,y-S>0&&u>y-S)do{o.lt[y++]=o.lt[S++]}while(0!==--u);else o.lt.set(o.lt.subarray(S,S+u),y),y+=u,S+=u,u=0;S=0}}else S=y-v,y-S>0&&2>y-S?(o.lt[y++]=o.lt[S++],o.lt[y++]=o.lt[S++],k-=2):(o.lt.set(o.lt.subarray(S,S+2),y),y+=2,S+=2,k-=2);if(y-S>0&&k>y-S)do{o.lt[y++]=o.lt[S++]}while(0!==--k);else o.lt.set(o.lt.subarray(S,S+k),y),y+=k,S+=k,k=0;break}if(64&u)return c.Le="invalid distance code",k=c.We-p,k=k>h>>3?h>>3:k,p+=k,d-=k,h-=k<<3,o.ot=w,o.ct=h,c.We=p,c.qe+=d-c.nt,c.nt=d,o.write=y,rt;f+=a[z+2],f+=w&it[u],z=3*(l+f),u=a[z]}break}if(64&u)return 32&u?(k=c.We-p,k=k>h>>3?h>>3:k,p+=k,d-=k,h-=k<<3,o.ot=w,o.ct=h,c.We=p,c.qe+=d-c.nt,c.nt=d,o.write=y,1):(c.Le="invalid literal/length code",k=c.We-p,k=k>h>>3?h>>3:k,p+=k,d-=k,h-=k<<3,o.ot=w,o.ct=h,c.We=p,c.qe+=d-c.nt,c.nt=d,o.write=y,rt);if(f+=a[z+2],f+=w&it[u],z=3*(l+f),0===(u=a[z])){w>>=a[z+1],h-=a[z+1],o.lt[y++]=a[z+2],m--;break}}else w>>=a[z+1],h-=a[z+1],o.lt[y++]=a[z+2],m--}while(m>=258&&p>=10);return k=c.We-p,k=k>h>>3?h>>3:k,p+=k,d-=k,h-=k<<3,o.ot=w,o.ct=h,c.We=p,c.qe+=d-c.nt,c.nt=d,o.write=y,0}e.init=(e,i,o,c,f,a)=>{t=0,u=e,w=i,r=o,h=c,s=f,d=a,n=null},e.ut=(e,y,m)=>{let b,g,k,v,S,z,C,x=0,A=0,I=0;for(I=y.nt,v=y.We,x=e.ot,A=e.ct,S=e.write,z=S<e.read?e.read-S-1:e.end-S;;)switch(t){case 0:if(z>=258&&v>=10&&(e.ot=x,e.ct=A,y.We=v,y.qe+=I-y.nt,y.nt=I,e.write=S,m=p(u,w,r,h,s,d,e,y),I=y.nt,v=y.We,x=e.ot,A=e.ct,S=e.write,z=S<e.read?e.read-S-1:e.end-S,0!=m)){t=1==m?7:9;break}c=u,n=r,o=h,t=1;case 1:for(b=c;b>A;){if(0===v)return e.ot=x,e.ct=A,y.We=v,y.qe+=I-y.nt,y.nt=I,e.write=S,e.wt(y,m);m=0,v--,x|=(255&y.ft(I++))<<A,A+=8}if(g=3*(o+(x&it[b])),x>>>=n[g+1],A-=n[g+1],k=n[g],0===k){f=n[g+2],t=6;break}if(16&k){a=15&k,i=n[g+2],t=2;break}if(!(64&k)){c=k,o=g/3+n[g+2];break}if(32&k){t=7;break}return t=9,y.Le="invalid literal/length code",m=rt,e.ot=x,e.ct=A,y.We=v,y.qe+=I-y.nt,y.nt=I,e.write=S,e.wt(y,m);case 2:for(b=a;b>A;){if(0===v)return e.ot=x,e.ct=A,y.We=v,y.qe+=I-y.nt,y.nt=I,e.write=S,e.wt(y,m);m=0,v--,x|=(255&y.ft(I++))<<A,A+=8}i+=x&it[b],x>>=b,A-=b,c=w,n=s,o=d,t=3;case 3:for(b=c;b>A;){if(0===v)return e.ot=x,e.ct=A,y.We=v,y.qe+=I-y.nt,y.nt=I,e.write=S,e.wt(y,m);m=0,v--,x|=(255&y.ft(I++))<<A,A+=8}if(g=3*(o+(x&it[b])),x>>=n[g+1],A-=n[g+1],k=n[g],16&k){a=15&k,l=n[g+2],t=4;break}if(!(64&k)){c=k,o=g/3+n[g+2];break}return t=9,y.Le="invalid distance code",m=rt,e.ot=x,e.ct=A,y.We=v,y.qe+=I-y.nt,y.nt=I,e.write=S,e.wt(y,m);case 4:for(b=a;b>A;){if(0===v)return e.ot=x,e.ct=A,y.We=v,y.qe+=I-y.nt,y.nt=I,e.write=S,e.wt(y,m);m=0,v--,x|=(255&y.ft(I++))<<A,A+=8}l+=x&it[b],x>>=b,A-=b,t=5;case 5:for(C=S-l;0>C;)C+=e.end;for(;0!==i;){if(0===z&&(S==e.end&&0!==e.read&&(S=0,z=S<e.read?e.read-S-1:e.end-S),0===z&&(e.write=S,m=e.wt(y,m),S=e.write,z=S<e.read?e.read-S-1:e.end-S,S==e.end&&0!==e.read&&(S=0,z=S<e.read?e.read-S-1:e.end-S),0===z)))return e.ot=x,e.ct=A,y.We=v,y.qe+=I-y.nt,y.nt=I,e.write=S,e.wt(y,m);e.lt[S++]=e.lt[C++],z--,C==e.end&&(C=0),i--}t=0;break;case 6:if(0===z&&(S==e.end&&0!==e.read&&(S=0,z=S<e.read?e.read-S-1:e.end-S),0===z&&(e.write=S,m=e.wt(y,m),S=e.write,z=S<e.read?e.read-S-1:e.end-S,S==e.end&&0!==e.read&&(S=0,z=S<e.read?e.read-S-1:e.end-S),0===z)))return e.ot=x,e.ct=A,y.We=v,y.qe+=I-y.nt,y.nt=I,e.write=S,e.wt(y,m);m=0,e.lt[S++]=f,z--,t=0;break;case 7:if(A>7&&(A-=8,v++,I--),e.write=S,m=e.wt(y,m),S=e.write,z=S<e.read?e.read-S-1:e.end-S,e.read!=e.write)return e.ot=x,e.ct=A,y.We=v,y.qe+=I-y.nt,y.nt=I,e.write=S,e.wt(y,m);t=8;case 8:return m=1,e.ot=x,e.ct=A,y.We=v,y.qe+=I-y.nt,y.nt=I,e.write=S,e.wt(y,m);case 9:return m=rt,e.ot=x,e.ct=A,y.We=v,y.qe+=I-y.nt,y.nt=I,e.write=S,e.wt(y,m);default:return m=nt,e.ot=x,e.ct=A,y.We=v,y.qe+=I-y.nt,y.nt=I,e.write=S,e.wt(y,m)}},e.ht=()=>{}}wt.dt=(e,t,n,r)=>(e[0]=9,t[0]=5,n[0]=ot,r[0]=ct,0);const dt=[16,17,18,0,8,7,9,6,10,5,11,4,12,3,13,2,14,1,15];function pt(e,t){const n=this;let r,s=0,o=0,c=0,a=0;const l=[0],u=[0],w=new ht;let h=0,d=new f(4320);const p=new wt;n.ct=0,n.ot=0,n.lt=new i(t),n.end=t,n.read=0,n.write=0,n.reset=(e,t)=>{t&&(t[0]=0),6==s&&w.ht(e),s=0,n.ct=0,n.ot=0,n.read=n.write=0},n.reset(e,null),n.wt=(e,t)=>{let r,s,i;return s=e.rt,i=n.read,r=(i>n.write?n.end:n.write)-i,r>e.tt&&(r=e.tt),0!==r&&t==st&&(t=0),e.tt-=r,e.Ge+=r,e.$e.set(n.lt.subarray(i,i+r),s),s+=r,i+=r,i==n.end&&(i=0,n.write==n.end&&(n.write=0),r=n.write-i,r>e.tt&&(r=e.tt),0!==r&&t==st&&(t=0),e.tt-=r,e.Ge+=r,e.$e.set(n.lt.subarray(i,i+r),s),s+=r,i+=r),e.rt=s,n.read=i,t},n.ut=(e,t)=>{let i,f,y,m,b,g,k,v;for(m=e.nt,b=e.We,f=n.ot,y=n.ct,g=n.write,k=g<n.read?n.read-g-1:n.end-g;;){let S,z,C,x,A,I,_,P;switch(s){case 0:for(;3>y;){if(0===b)return n.ot=f,n.ct=y,e.We=b,e.qe+=m-e.nt,e.nt=m,n.write=g,n.wt(e,t);t=0,b--,f|=(255&e.ft(m++))<<y,y+=8}switch(i=7&f,h=1&i,i>>>1){case 0:f>>>=3,y-=3,i=7&y,f>>>=i,y-=i,s=1;break;case 1:S=[],z=[],C=[[]],x=[[]],wt.dt(S,z,C,x),w.init(S[0],z[0],C[0],0,x[0],0),f>>>=3,y-=3,s=6;break;case 2:f>>>=3,y-=3,s=3;break;case 3:return f>>>=3,y-=3,s=9,e.Le="invalid block type",t=rt,n.ot=f,n.ct=y,e.We=b,e.qe+=m-e.nt,e.nt=m,n.write=g,n.wt(e,t)}break;case 1:for(;32>y;){if(0===b)return n.ot=f,n.ct=y,e.We=b,e.qe+=m-e.nt,e.nt=m,n.write=g,n.wt(e,t);t=0,b--,f|=(255&e.ft(m++))<<y,y+=8}if((~f>>>16&65535)!=(65535&f))return s=9,e.Le="invalid stored block lengths",t=rt,n.ot=f,n.ct=y,e.We=b,e.qe+=m-e.nt,e.nt=m,n.write=g,n.wt(e,t);o=65535&f,f=y=0,s=0!==o?2:0!==h?7:0;break;case 2:if(0===b)return n.ot=f,n.ct=y,e.We=b,e.qe+=m-e.nt,e.nt=m,n.write=g,n.wt(e,t);if(0===k&&(g==n.end&&0!==n.read&&(g=0,k=g<n.read?n.read-g-1:n.end-g),0===k&&(n.write=g,t=n.wt(e,t),g=n.write,k=g<n.read?n.read-g-1:n.end-g,g==n.end&&0!==n.read&&(g=0,k=g<n.read?n.read-g-1:n.end-g),0===k)))return n.ot=f,n.ct=y,e.We=b,e.qe+=m-e.nt,e.nt=m,n.write=g,n.wt(e,t);if(t=0,i=o,i>b&&(i=b),i>k&&(i=k),n.lt.set(e.je(m,i),g),m+=i,b-=i,g+=i,k-=i,0!==(o-=i))break;s=0!==h?7:0;break;case 3:for(;14>y;){if(0===b)return n.ot=f,n.ct=y,e.We=b,e.qe+=m-e.nt,e.nt=m,n.write=g,n.wt(e,t);t=0,b--,f|=(255&e.ft(m++))<<y,y+=8}if(c=i=16383&f,(31&i)>29||(i>>5&31)>29)return s=9,e.Le="too many length or distance symbols",t=rt,n.ot=f,n.ct=y,e.We=b,e.qe+=m-e.nt,e.nt=m,n.write=g,n.wt(e,t);if(i=258+(31&i)+(i>>5&31),!r||r.length<i)r=[];else for(v=0;i>v;v++)r[v]=0;f>>>=14,y-=14,a=0,s=4;case 4:for(;4+(c>>>10)>a;){for(;3>y;){if(0===b)return n.ot=f,n.ct=y,e.We=b,e.qe+=m-e.nt,e.nt=m,n.write=g,n.wt(e,t);t=0,b--,f|=(255&e.ft(m++))<<y,y+=8}r[dt[a++]]=7&f,f>>>=3,y-=3}for(;19>a;)r[dt[a++]]=0;if(l[0]=7,i=p.st(r,l,u,d,e),0!=i)return(t=i)==rt&&(r=null,s=9),n.ot=f,n.ct=y,e.We=b,e.qe+=m-e.nt,e.nt=m,n.write=g,n.wt(e,t);a=0,s=5;case 5:for(;i=c,258+(31&i)+(i>>5&31)>a;){let o,w;for(i=l[0];i>y;){if(0===b)return n.ot=f,n.ct=y,e.We=b,e.qe+=m-e.nt,e.nt=m,n.write=g,n.wt(e,t);t=0,b--,f|=(255&e.ft(m++))<<y,y+=8}if(i=d[3*(u[0]+(f&it[i]))+1],w=d[3*(u[0]+(f&it[i]))+2],16>w)f>>>=i,y-=i,r[a++]=w;else{for(v=18==w?7:w-14,o=18==w?11:3;i+v>y;){if(0===b)return n.ot=f,n.ct=y,e.We=b,e.qe+=m-e.nt,e.nt=m,n.write=g,n.wt(e,t);t=0,b--,f|=(255&e.ft(m++))<<y,y+=8}if(f>>>=i,y-=i,o+=f&it[v],f>>>=v,y-=v,v=a,i=c,v+o>258+(31&i)+(i>>5&31)||16==w&&1>v)return r=null,s=9,e.Le="invalid bit length repeat",t=rt,n.ot=f,n.ct=y,e.We=b,e.qe+=m-e.nt,e.nt=m,n.write=g,n.wt(e,t);w=16==w?r[v-1]:0;do{r[v++]=w}while(0!==--o);a=v}}if(u[0]=-1,A=[],I=[],_=[],P=[],A[0]=9,I[0]=6,i=c,i=p.it(257+(31&i),1+(i>>5&31),r,A,I,_,P,d,e),0!=i)return i==rt&&(r=null,s=9),t=i,n.ot=f,n.ct=y,e.We=b,e.qe+=m-e.nt,e.nt=m,n.write=g,n.wt(e,t);w.init(A[0],I[0],d,_[0],d,P[0]),s=6;case 6:if(n.ot=f,n.ct=y,e.We=b,e.qe+=m-e.nt,e.nt=m,n.write=g,1!=(t=w.ut(n,e,t)))return n.wt(e,t);if(t=0,w.ht(e),m=e.nt,b=e.We,f=n.ot,y=n.ct,g=n.write,k=g<n.read?n.read-g-1:n.end-g,0===h){s=0;break}s=7;case 7:if(n.write=g,t=n.wt(e,t),g=n.write,k=g<n.read?n.read-g-1:n.end-g,n.read!=n.write)return n.ot=f,n.ct=y,e.We=b,e.qe+=m-e.nt,e.nt=m,n.write=g,n.wt(e,t);s=8;case 8:return t=1,n.ot=f,n.ct=y,e.We=b,e.qe+=m-e.nt,e.nt=m,n.write=g,n.wt(e,t);case 9:return t=rt,n.ot=f,n.ct=y,e.We=b,e.qe+=m-e.nt,e.nt=m,n.write=g,n.wt(e,t);default:return t=nt,n.ot=f,n.ct=y,e.We=b,e.qe+=m-e.nt,e.nt=m,n.write=g,n.wt(e,t)}}},n.ht=e=>{n.reset(e,null),n.lt=null,d=null},n.yt=(e,t,r)=>{n.lt.set(e.subarray(t,t+r),0),n.read=n.write=r},n.bt=()=>1==s?1:0}const yt=13,mt=[0,0,255,255];function bt(){const e=this;function t(e){return e&&e.gt?(e.qe=e.Ge=0,e.Le=null,e.gt.mode=7,e.gt.kt.reset(e,null),0):nt}e.mode=0,e.method=0,e.vt=[0],e.St=0,e.marker=0,e.zt=0,e.Ct=t=>(e.kt&&e.kt.ht(t),e.kt=null,0),e.xt=(n,r)=>(n.Le=null,e.kt=null,8>r||r>15?(e.Ct(n),nt):(e.zt=r,n.gt.kt=new pt(n,1<<r),t(n),0)),e.At=(e,t)=>{let n,r;if(!e||!e.gt||!e.et)return nt;const s=e.gt;for(t=4==t?st:0,n=st;;)switch(s.mode){case 0:if(0===e.We)return n;if(n=t,e.We--,e.qe++,8!=(15&(s.method=e.ft(e.nt++)))){s.mode=yt,e.Le="unknown compression method",s.marker=5;break}if(8+(s.method>>4)>s.zt){s.mode=yt,e.Le="invalid win size",s.marker=5;break}s.mode=1;case 1:if(0===e.We)return n;if(n=t,e.We--,e.qe++,r=255&e.ft(e.nt++),((s.method<<8)+r)%31!=0){s.mode=yt,e.Le="incorrect header check",s.marker=5;break}if(!(32&r)){s.mode=7;break}s.mode=2;case 2:if(0===e.We)return n;n=t,e.We--,e.qe++,s.St=(255&e.ft(e.nt++))<<24&4278190080,s.mode=3;case 3:if(0===e.We)return n;n=t,e.We--,e.qe++,s.St+=(255&e.ft(e.nt++))<<16&16711680,s.mode=4;case 4:if(0===e.We)return n;n=t,e.We--,e.qe++,s.St+=(255&e.ft(e.nt++))<<8&65280,s.mode=5;case 5:return 0===e.We?n:(n=t,e.We--,e.qe++,s.St+=255&e.ft(e.nt++),s.mode=6,2);case 6:return s.mode=yt,e.Le="need dictionary",s.marker=0,nt;case 7:if(n=s.kt.ut(e,n),n==rt){s.mode=yt,s.marker=0;break}if(0==n&&(n=t),1!=n)return n;n=t,s.kt.reset(e,s.vt),s.mode=12;case 12:return e.We=0,1;case yt:return rt;default:return nt}},e.It=(e,t,n)=>{let r=0,s=n;if(!e||!e.gt||6!=e.gt.mode)return nt;const i=e.gt;return s<1<<i.zt||(s=(1<<i.zt)-1,r=n-s),i.kt.yt(t,r,s),i.mode=7,0},e._t=e=>{let n,r,s,i,o;if(!e||!e.gt)return nt;const c=e.gt;if(c.mode!=yt&&(c.mode=yt,c.marker=0),0===(n=e.We))return st;for(r=e.nt,s=c.marker;0!==n&&4>s;)e.ft(r)==mt[s]?s++:s=0!==e.ft(r)?0:4-s,r++,n--;return e.qe+=r-e.nt,e.nt=r,e.We=n,c.marker=s,4!=s?rt:(i=e.qe,o=e.Ge,t(e),e.qe=i,e.Ge=o,c.mode=7,0)},e.Pt=e=>e&&e.gt&&e.gt.kt?e.gt.kt.bt():nt}function gt(){}function kt(e){const t=new gt,n=e&&e.chunkSize?r.floor(2*e.chunkSize):131072,o=new i(n);let c=!1;t.xt(),t.$e=o,this.append=(e,r)=>{const f=[];let a,l,u=0,w=0,h=0;if(0!==e.length){t.nt=0,t.et=e,t.We=e.length;do{if(t.rt=0,t.tt=n,0!==t.We||c||(t.nt=0,c=!0),a=t.At(0),c&&a===st){if(0!==t.We)throw new s("inflating: bad input")}else if(0!==a&&1!==a)throw new s("inflating: "+t.Le);if((c||1===a)&&t.We===e.length)throw new s("inflating: bad input");t.rt&&(t.rt===n?f.push(new i(o)):f.push(o.subarray(0,t.rt))),h+=t.rt,r&&t.nt>0&&t.nt!=u&&(r(t.nt),u=t.nt)}while(t.We>0||0===t.tt);return f.length>1?(l=new i(h),f.forEach(e=>{l.set(e,w),w+=e.length})):l=f[0]?new i(f[0]):new i,l}},this.flush=()=>{t.Ct()}}gt.prototype={xt(e){const t=this;return t.gt=new bt,e||(e=15),t.gt.xt(t,e)},At(e){const t=this;return t.gt?t.gt.At(t,e):nt},Ct(){const e=this;if(!e.gt)return nt;const t=e.gt.Ct(e);return e.gt=null,t},_t(){const e=this;return e.gt?e.gt._t(e):nt},It(e,t){const n=this;return n.gt?n.gt.It(n,e,t):nt},ft(e){return this.et[e]},je(e,t){return this.et.subarray(e,e+t)}},self.initCodec=()=>{self.Deflate=tt,self.Inflate=kt};
`, n = () => r.useDataURI ? "data:text/javascript," + encodeURIComponent(t) : URL.createObjectURL(new Blob([t], { type: "text/javascript" }));
  e({ workerScripts: { inflate: [n], deflate: [n] } });
}
const zs = "\0☺☻♥♦♣♠•◘○◙♂♀♪♫☼►◄↕‼¶§▬↨↑↓→←∟↔▲▼ !\"#$%&'()*+,-./0123456789:;<=>?@ABCDEFGHIJKLMNOPQRSTUVWXYZ[\\]^_`abcdefghijklmnopqrstuvwxyz{|}~⌂ÇüéâäàåçêëèïîìÄÅÉæÆôöòûùÿÖÜ¢£¥₧ƒáíóúñÑªº¿⌐¬½¼¡«»░▒▓│┤╡╢╖╕╣║╗╝╜╛┐└┴┬├─┼╞╟╚╔╩╦╠═╬╧╨╤╥╙╘╒╓╫╪┘┌█▄▌▐▀αßΓπΣσµτΦΘΩδ∞φε∩≡±≥≤⌠⌡÷≈°∙·√ⁿ²■ ".split("");
zs.length == 256;
let Ti;
try {
  Ti = import.meta.url;
} catch {
}
Yr({ baseURL: Ti });
Zs(Yr);
Yr({ Deflate: rs, Inflate: Es });
var we = {}, Ke, Xe;
function Mr() {
  throw new Error("setTimeout has not been defined");
}
function qr() {
  throw new Error("clearTimeout has not been defined");
}
(function() {
  try {
    typeof setTimeout == "function" ? Ke = setTimeout : Ke = Mr;
  } catch {
    Ke = Mr;
  }
  try {
    typeof clearTimeout == "function" ? Xe = clearTimeout : Xe = qr;
  } catch {
    Xe = qr;
  }
})();
function Ri(e) {
  if (Ke === setTimeout)
    return setTimeout(e, 0);
  if ((Ke === Mr || !Ke) && setTimeout)
    return Ke = setTimeout, setTimeout(e, 0);
  try {
    return Ke(e, 0);
  } catch {
    try {
      return Ke.call(null, e, 0);
    } catch {
      return Ke.call(this, e, 0);
    }
  }
}
function Qs(e) {
  if (Xe === clearTimeout)
    return clearTimeout(e);
  if ((Xe === qr || !Xe) && clearTimeout)
    return Xe = clearTimeout, clearTimeout(e);
  try {
    return Xe(e);
  } catch {
    try {
      return Xe.call(null, e);
    } catch {
      return Xe.call(this, e);
    }
  }
}
var et = [], St = !1, mt, nr = -1;
function ea() {
  !St || !mt || (St = !1, mt.length ? et = mt.concat(et) : nr = -1, et.length && Ii());
}
function Ii() {
  if (!St) {
    var e = Ri(ea);
    St = !0;
    for (var r = et.length; r; ) {
      for (mt = et, et = []; ++nr < r; )
        mt && mt[nr].run();
      nr = -1, r = et.length;
    }
    mt = null, St = !1, Qs(e);
  }
}
we.nextTick = function(e) {
  var r = new Array(arguments.length - 1);
  if (arguments.length > 1)
    for (var t = 1; t < arguments.length; t++)
      r[t - 1] = arguments[t];
  et.push(new ji(e, r)), et.length === 1 && !St && Ri(Ii);
};
function ji(e, r) {
  this.fun = e, this.array = r;
}
ji.prototype.run = function() {
  this.fun.apply(null, this.array);
};
we.title = "browser";
we.browser = !0;
we.env = {};
we.argv = [];
we.version = "";
we.versions = {};
function it() {
}
we.on = it;
we.addListener = it;
we.once = it;
we.off = it;
we.removeListener = it;
we.removeAllListeners = it;
we.emit = it;
we.prependListener = it;
we.prependOnceListener = it;
we.listeners = function(e) {
  return [];
};
we.binding = function(e) {
  throw new Error("process.binding is not supported");
};
we.cwd = function() {
  return "/";
};
we.chdir = function(e) {
  throw new Error("process.chdir is not supported");
};
we.umask = function() {
  return 0;
};
var ta = Object.create, hr = Object.defineProperty, ra = Object.getOwnPropertyDescriptor, Jr = Object.getOwnPropertyNames, na = Object.getPrototypeOf, ia = Object.prototype.hasOwnProperty, oa = /* @__PURE__ */ ((e) => typeof require < "u" ? require : typeof Proxy < "u" ? new Proxy(e, {
  get: (r, t) => (typeof require < "u" ? require : r)[t]
}) : e)(function(e) {
  if (typeof require < "u") return require.apply(this, arguments);
  throw Error('Dynamic require of "' + e + '" is not supported');
}), sa = (e, r) => function() {
  return e && (r = (0, e[Jr(e)[0]])(e = 0)), r;
}, ce = (e, r) => function() {
  return r || (0, e[Jr(e)[0]])((r = { exports: {} }).exports, r), r.exports;
}, aa = (e, r) => {
  for (var t in r)
    hr(e, t, { get: r[t], enumerable: !0 });
}, Pi = (e, r, t, n) => {
  if (r && typeof r == "object" || typeof r == "function")
    for (let i of Jr(r))
      !ia.call(e, i) && i !== t && hr(e, i, { get: () => r[i], enumerable: !(n = ra(r, i)) || n.enumerable });
  return e;
}, ca = (e, r, t) => (t = e != null ? ta(na(e)) : {}, Pi(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  hr(t, "default", { value: e, enumerable: !0 }),
  e
)), la = (e) => Pi(hr({}, "__esModule", { value: !0 }), e), bt = ce({
  "node_modules/memfs/lib/constants.js"(e) {
    Object.defineProperty(e, "__esModule", { value: !0 }), e.constants = void 0, e.constants = {
      O_RDONLY: 0,
      O_WRONLY: 1,
      O_RDWR: 2,
      S_IFMT: 61440,
      S_IFREG: 32768,
      S_IFDIR: 16384,
      S_IFCHR: 8192,
      S_IFBLK: 24576,
      S_IFIFO: 4096,
      S_IFLNK: 40960,
      S_IFSOCK: 49152,
      O_CREAT: 64,
      O_EXCL: 128,
      O_NOCTTY: 256,
      O_TRUNC: 512,
      O_APPEND: 1024,
      O_DIRECTORY: 65536,
      O_NOATIME: 262144,
      O_NOFOLLOW: 131072,
      O_SYNC: 1052672,
      O_SYMLINK: 2097152,
      O_DIRECT: 16384,
      O_NONBLOCK: 2048,
      S_IRWXU: 448,
      S_IRUSR: 256,
      S_IWUSR: 128,
      S_IXUSR: 64,
      S_IRWXG: 56,
      S_IRGRP: 32,
      S_IWGRP: 16,
      S_IXGRP: 8,
      S_IRWXO: 7,
      S_IROTH: 4,
      S_IWOTH: 2,
      S_IXOTH: 1,
      F_OK: 0,
      R_OK: 4,
      W_OK: 2,
      X_OK: 1,
      UV_FS_SYMLINK_DIR: 1,
      UV_FS_SYMLINK_JUNCTION: 2,
      UV_FS_COPYFILE_EXCL: 1,
      UV_FS_COPYFILE_FICLONE: 2,
      UV_FS_COPYFILE_FICLONE_FORCE: 4,
      COPYFILE_EXCL: 1,
      COPYFILE_FICLONE: 2,
      COPYFILE_FICLONE_FORCE: 4
    };
  }
}), Zr = ce({
  "node_modules/memfs/lib/Stats.js"(e) {
    Object.defineProperty(e, "__esModule", { value: !0 }), e.Stats = void 0;
    var r = bt(), { S_IFMT: t, S_IFDIR: n, S_IFREG: i, S_IFBLK: s, S_IFCHR: f, S_IFLNK: u, S_IFIFO: b, S_IFSOCK: g } = r.constants, A = class Ni {
      static build(j, P = !1) {
        const x = new Ni(), { uid: p, gid: y, atime: m, mtime: S, ctime: _ } = j, d = P ? (O) => BigInt(O) : (O) => O;
        x.uid = d(p), x.gid = d(y), x.rdev = d(j.rdev), x.blksize = d(4096), x.ino = d(j.ino), x.size = d(j.getSize()), x.blocks = d(1), x.atime = m, x.mtime = S, x.ctime = _, x.birthtime = _, x.atimeMs = d(m.getTime()), x.mtimeMs = d(S.getTime());
        const E = d(_.getTime());
        if (x.ctimeMs = E, x.birthtimeMs = E, P) {
          x.atimeNs = BigInt(m.getTime()) * BigInt(1e6), x.mtimeNs = BigInt(S.getTime()) * BigInt(1e6);
          const O = BigInt(_.getTime()) * BigInt(1e6);
          x.ctimeNs = O, x.birthtimeNs = O;
        }
        return x.dev = d(0), x.mode = d(j.mode), x.nlink = d(j.nlink), x;
      }
      _checkModeProperty(j) {
        return (Number(this.mode) & t) === j;
      }
      isDirectory() {
        return this._checkModeProperty(n);
      }
      isFile() {
        return this._checkModeProperty(i);
      }
      isBlockDevice() {
        return this._checkModeProperty(s);
      }
      isCharacterDevice() {
        return this._checkModeProperty(f);
      }
      isSymbolicLink() {
        return this._checkModeProperty(u);
      }
      isFIFO() {
        return this._checkModeProperty(b);
      }
      isSocket() {
        return this._checkModeProperty(g);
      }
    };
    e.Stats = A, e.default = A;
  }
}), fa = ce({
  "node_modules/base64-js/index.js"(e) {
    e.byteLength = b, e.toByteArray = A, e.fromByteArray = P;
    var r = [], t = [], n = typeof Uint8Array < "u" ? Uint8Array : Array, i = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
    for (s = 0, f = i.length; s < f; ++s)
      r[s] = i[s], t[i.charCodeAt(s)] = s;
    var s, f;
    t[45] = 62, t[95] = 63;
    function u(x) {
      var p = x.length;
      if (p % 4 > 0)
        throw new Error("Invalid string. Length must be a multiple of 4");
      var y = x.indexOf("=");
      y === -1 && (y = p);
      var m = y === p ? 0 : 4 - y % 4;
      return [y, m];
    }
    function b(x) {
      var p = u(x), y = p[0], m = p[1];
      return (y + m) * 3 / 4 - m;
    }
    function g(x, p, y) {
      return (p + y) * 3 / 4 - y;
    }
    function A(x) {
      var p, y = u(x), m = y[0], S = y[1], _ = new n(g(x, m, S)), d = 0, E = S > 0 ? m - 4 : m, O;
      for (O = 0; O < E; O += 4)
        p = t[x.charCodeAt(O)] << 18 | t[x.charCodeAt(O + 1)] << 12 | t[x.charCodeAt(O + 2)] << 6 | t[x.charCodeAt(O + 3)], _[d++] = p >> 16 & 255, _[d++] = p >> 8 & 255, _[d++] = p & 255;
      return S === 2 && (p = t[x.charCodeAt(O)] << 2 | t[x.charCodeAt(O + 1)] >> 4, _[d++] = p & 255), S === 1 && (p = t[x.charCodeAt(O)] << 10 | t[x.charCodeAt(O + 1)] << 4 | t[x.charCodeAt(O + 2)] >> 2, _[d++] = p >> 8 & 255, _[d++] = p & 255), _;
    }
    function w(x) {
      return r[x >> 18 & 63] + r[x >> 12 & 63] + r[x >> 6 & 63] + r[x & 63];
    }
    function j(x, p, y) {
      for (var m, S = [], _ = p; _ < y; _ += 3)
        m = (x[_] << 16 & 16711680) + (x[_ + 1] << 8 & 65280) + (x[_ + 2] & 255), S.push(w(m));
      return S.join("");
    }
    function P(x) {
      for (var p, y = x.length, m = y % 3, S = [], _ = 16383, d = 0, E = y - m; d < E; d += _)
        S.push(j(x, d, d + _ > E ? E : d + _));
      return m === 1 ? (p = x[y - 1], S.push(
        r[p >> 2] + r[p << 4 & 63] + "=="
      )) : m === 2 && (p = (x[y - 2] << 8) + x[y - 1], S.push(
        r[p >> 10] + r[p >> 4 & 63] + r[p << 2 & 63] + "="
      )), S.join("");
    }
  }
}), ua = ce({
  "node_modules/ieee754/index.js"(e) {
    e.read = function(r, t, n, i, s) {
      var f, u, b = s * 8 - i - 1, g = (1 << b) - 1, A = g >> 1, w = -7, j = n ? s - 1 : 0, P = n ? -1 : 1, x = r[t + j];
      for (j += P, f = x & (1 << -w) - 1, x >>= -w, w += b; w > 0; f = f * 256 + r[t + j], j += P, w -= 8)
        ;
      for (u = f & (1 << -w) - 1, f >>= -w, w += i; w > 0; u = u * 256 + r[t + j], j += P, w -= 8)
        ;
      if (f === 0)
        f = 1 - A;
      else {
        if (f === g)
          return u ? NaN : (x ? -1 : 1) * (1 / 0);
        u = u + Math.pow(2, i), f = f - A;
      }
      return (x ? -1 : 1) * u * Math.pow(2, f - i);
    }, e.write = function(r, t, n, i, s, f) {
      var u, b, g, A = f * 8 - s - 1, w = (1 << A) - 1, j = w >> 1, P = s === 23 ? Math.pow(2, -24) - Math.pow(2, -77) : 0, x = i ? 0 : f - 1, p = i ? 1 : -1, y = t < 0 || t === 0 && 1 / t < 0 ? 1 : 0;
      for (t = Math.abs(t), isNaN(t) || t === 1 / 0 ? (b = isNaN(t) ? 1 : 0, u = w) : (u = Math.floor(Math.log(t) / Math.LN2), t * (g = Math.pow(2, -u)) < 1 && (u--, g *= 2), u + j >= 1 ? t += P / g : t += P * Math.pow(2, 1 - j), t * g >= 2 && (u++, g /= 2), u + j >= w ? (b = 0, u = w) : u + j >= 1 ? (b = (t * g - 1) * Math.pow(2, s), u = u + j) : (b = t * Math.pow(2, j - 1) * Math.pow(2, s), u = 0)); s >= 8; r[n + x] = b & 255, x += p, b /= 256, s -= 8)
        ;
      for (u = u << s | b, A += s; A > 0; r[n + x] = u & 255, x += p, u /= 256, A -= 8)
        ;
      r[n + x - p] |= y * 128;
    };
  }
}), da = ce({
  "node_modules/buffer/index.js"(e) {
    var r = fa(), t = ua(), n = typeof Symbol == "function" && typeof Symbol.for == "function" ? Symbol.for("nodejs.util.inspect.custom") : null;
    e.Buffer = u, e.SlowBuffer = S, e.INSPECT_MAX_BYTES = 50;
    var i = 2147483647;
    e.kMaxLength = i, u.TYPED_ARRAY_SUPPORT = s(), !u.TYPED_ARRAY_SUPPORT && typeof console < "u" && typeof console.error == "function" && console.error(
      "This browser lacks typed array (Uint8Array) support which is required by `buffer` v5.x. Use `buffer` v4.x if you require old browser support."
    );
    function s() {
      try {
        const h = new Uint8Array(1), o = { foo: function() {
          return 42;
        } };
        return Object.setPrototypeOf(o, Uint8Array.prototype), Object.setPrototypeOf(h, o), h.foo() === 42;
      } catch {
        return !1;
      }
    }
    Object.defineProperty(u.prototype, "parent", {
      enumerable: !0,
      get: function() {
        if (u.isBuffer(this))
          return this.buffer;
      }
    }), Object.defineProperty(u.prototype, "offset", {
      enumerable: !0,
      get: function() {
        if (u.isBuffer(this))
          return this.byteOffset;
      }
    });
    function f(h) {
      if (h > i)
        throw new RangeError('The value "' + h + '" is invalid for option "size"');
      const o = new Uint8Array(h);
      return Object.setPrototypeOf(o, u.prototype), o;
    }
    function u(h, o, c) {
      if (typeof h == "number") {
        if (typeof o == "string")
          throw new TypeError(
            'The "string" argument must be of type string. Received type number'
          );
        return w(h);
      }
      return b(h, o, c);
    }
    u.poolSize = 8192;
    function b(h, o, c) {
      if (typeof h == "string")
        return j(h, o);
      if (ArrayBuffer.isView(h))
        return x(h);
      if (h == null)
        throw new TypeError(
          "The first argument must be one of type string, Buffer, ArrayBuffer, Array, or Array-like Object. Received type " + typeof h
        );
      if (Ae(h, ArrayBuffer) || h && Ae(h.buffer, ArrayBuffer) || typeof SharedArrayBuffer < "u" && (Ae(h, SharedArrayBuffer) || h && Ae(h.buffer, SharedArrayBuffer)))
        return p(h, o, c);
      if (typeof h == "number")
        throw new TypeError(
          'The "value" argument must not be of type number. Received type number'
        );
      const k = h.valueOf && h.valueOf();
      if (k != null && k !== h)
        return u.from(k, o, c);
      const B = y(h);
      if (B) return B;
      if (typeof Symbol < "u" && Symbol.toPrimitive != null && typeof h[Symbol.toPrimitive] == "function")
        return u.from(h[Symbol.toPrimitive]("string"), o, c);
      throw new TypeError(
        "The first argument must be one of type string, Buffer, ArrayBuffer, Array, or Array-like Object. Received type " + typeof h
      );
    }
    u.from = function(h, o, c) {
      return b(h, o, c);
    }, Object.setPrototypeOf(u.prototype, Uint8Array.prototype), Object.setPrototypeOf(u, Uint8Array);
    function g(h) {
      if (typeof h != "number")
        throw new TypeError('"size" argument must be of type number');
      if (h < 0)
        throw new RangeError('The value "' + h + '" is invalid for option "size"');
    }
    function A(h, o, c) {
      return g(h), h <= 0 ? f(h) : o !== void 0 ? typeof c == "string" ? f(h).fill(o, c) : f(h).fill(o) : f(h);
    }
    u.alloc = function(h, o, c) {
      return A(h, o, c);
    };
    function w(h) {
      return g(h), f(h < 0 ? 0 : m(h) | 0);
    }
    u.allocUnsafe = function(h) {
      return w(h);
    }, u.allocUnsafeSlow = function(h) {
      return w(h);
    };
    function j(h, o) {
      if ((typeof o != "string" || o === "") && (o = "utf8"), !u.isEncoding(o))
        throw new TypeError("Unknown encoding: " + o);
      const c = _(h, o) | 0;
      let k = f(c);
      const B = k.write(h, o);
      return B !== c && (k = k.slice(0, B)), k;
    }
    function P(h) {
      const o = h.length < 0 ? 0 : m(h.length) | 0, c = f(o);
      for (let k = 0; k < o; k += 1)
        c[k] = h[k] & 255;
      return c;
    }
    function x(h) {
      if (Ae(h, Uint8Array)) {
        const o = new Uint8Array(h);
        return p(o.buffer, o.byteOffset, o.byteLength);
      }
      return P(h);
    }
    function p(h, o, c) {
      if (o < 0 || h.byteLength < o)
        throw new RangeError('"offset" is outside of buffer bounds');
      if (h.byteLength < o + (c || 0))
        throw new RangeError('"length" is outside of buffer bounds');
      let k;
      return o === void 0 && c === void 0 ? k = new Uint8Array(h) : c === void 0 ? k = new Uint8Array(h, o) : k = new Uint8Array(h, o, c), Object.setPrototypeOf(k, u.prototype), k;
    }
    function y(h) {
      if (u.isBuffer(h)) {
        const o = m(h.length) | 0, c = f(o);
        return c.length === 0 || h.copy(c, 0, 0, o), c;
      }
      if (h.length !== void 0)
        return typeof h.length != "number" || Ee(h.length) ? f(0) : P(h);
      if (h.type === "Buffer" && Array.isArray(h.data))
        return P(h.data);
    }
    function m(h) {
      if (h >= i)
        throw new RangeError("Attempt to allocate Buffer larger than maximum size: 0x" + i.toString(16) + " bytes");
      return h | 0;
    }
    function S(h) {
      return +h != h && (h = 0), u.alloc(+h);
    }
    u.isBuffer = function(o) {
      return o != null && o._isBuffer === !0 && o !== u.prototype;
    }, u.compare = function(o, c) {
      if (Ae(o, Uint8Array) && (o = u.from(o, o.offset, o.byteLength)), Ae(c, Uint8Array) && (c = u.from(c, c.offset, c.byteLength)), !u.isBuffer(o) || !u.isBuffer(c))
        throw new TypeError(
          'The "buf1", "buf2" arguments must be one of type Buffer or Uint8Array'
        );
      if (o === c) return 0;
      let k = o.length, B = c.length;
      for (let H = 0, z = Math.min(k, B); H < z; ++H)
        if (o[H] !== c[H]) {
          k = o[H], B = c[H];
          break;
        }
      return k < B ? -1 : B < k ? 1 : 0;
    }, u.isEncoding = function(o) {
      switch (String(o).toLowerCase()) {
        case "hex":
        case "utf8":
        case "utf-8":
        case "ascii":
        case "latin1":
        case "binary":
        case "base64":
        case "ucs2":
        case "ucs-2":
        case "utf16le":
        case "utf-16le":
          return !0;
        default:
          return !1;
      }
    }, u.concat = function(o, c) {
      if (!Array.isArray(o))
        throw new TypeError('"list" argument must be an Array of Buffers');
      if (o.length === 0)
        return u.alloc(0);
      let k;
      if (c === void 0)
        for (c = 0, k = 0; k < o.length; ++k)
          c += o[k].length;
      const B = u.allocUnsafe(c);
      let H = 0;
      for (k = 0; k < o.length; ++k) {
        let z = o[k];
        if (Ae(z, Uint8Array))
          H + z.length > B.length ? (u.isBuffer(z) || (z = u.from(z)), z.copy(B, H)) : Uint8Array.prototype.set.call(
            B,
            z,
            H
          );
        else if (u.isBuffer(z))
          z.copy(B, H);
        else
          throw new TypeError('"list" argument must be an Array of Buffers');
        H += z.length;
      }
      return B;
    };
    function _(h, o) {
      if (u.isBuffer(h))
        return h.length;
      if (ArrayBuffer.isView(h) || Ae(h, ArrayBuffer))
        return h.byteLength;
      if (typeof h != "string")
        throw new TypeError(
          'The "string" argument must be one of type string, Buffer, or ArrayBuffer. Received type ' + typeof h
        );
      const c = h.length, k = arguments.length > 2 && arguments[2] === !0;
      if (!k && c === 0) return 0;
      let B = !1;
      for (; ; )
        switch (o) {
          case "ascii":
          case "latin1":
          case "binary":
            return c;
          case "utf8":
          case "utf-8":
            return Oe(h).length;
          case "ucs2":
          case "ucs-2":
          case "utf16le":
          case "utf-16le":
            return c * 2;
          case "hex":
            return c >>> 1;
          case "base64":
            return Re(h).length;
          default:
            if (B)
              return k ? -1 : Oe(h).length;
            o = ("" + o).toLowerCase(), B = !0;
        }
    }
    u.byteLength = _;
    function d(h, o, c) {
      let k = !1;
      if ((o === void 0 || o < 0) && (o = 0), o > this.length || ((c === void 0 || c > this.length) && (c = this.length), c <= 0) || (c >>>= 0, o >>>= 0, c <= o))
        return "";
      for (h || (h = "utf8"); ; )
        switch (h) {
          case "hex":
            return ae(this, o, c);
          case "utf8":
          case "utf-8":
            return pe(this, o, c);
          case "ascii":
            return X(this, o, c);
          case "latin1":
          case "binary":
            return te(this, o, c);
          case "base64":
            return le(this, o, c);
          case "ucs2":
          case "ucs-2":
          case "utf16le":
          case "utf-16le":
            return fe(this, o, c);
          default:
            if (k) throw new TypeError("Unknown encoding: " + h);
            h = (h + "").toLowerCase(), k = !0;
        }
    }
    u.prototype._isBuffer = !0;
    function E(h, o, c) {
      const k = h[o];
      h[o] = h[c], h[c] = k;
    }
    u.prototype.swap16 = function() {
      const o = this.length;
      if (o % 2 !== 0)
        throw new RangeError("Buffer size must be a multiple of 16-bits");
      for (let c = 0; c < o; c += 2)
        E(this, c, c + 1);
      return this;
    }, u.prototype.swap32 = function() {
      const o = this.length;
      if (o % 4 !== 0)
        throw new RangeError("Buffer size must be a multiple of 32-bits");
      for (let c = 0; c < o; c += 4)
        E(this, c, c + 3), E(this, c + 1, c + 2);
      return this;
    }, u.prototype.swap64 = function() {
      const o = this.length;
      if (o % 8 !== 0)
        throw new RangeError("Buffer size must be a multiple of 64-bits");
      for (let c = 0; c < o; c += 8)
        E(this, c, c + 7), E(this, c + 1, c + 6), E(this, c + 2, c + 5), E(this, c + 3, c + 4);
      return this;
    }, u.prototype.toString = function() {
      const o = this.length;
      return o === 0 ? "" : arguments.length === 0 ? pe(this, 0, o) : d.apply(this, arguments);
    }, u.prototype.toLocaleString = u.prototype.toString, u.prototype.equals = function(o) {
      if (!u.isBuffer(o)) throw new TypeError("Argument must be a Buffer");
      return this === o ? !0 : u.compare(this, o) === 0;
    }, u.prototype.inspect = function() {
      let o = "";
      const c = e.INSPECT_MAX_BYTES;
      return o = this.toString("hex", 0, c).replace(/(.{2})/g, "$1 ").trim(), this.length > c && (o += " ... "), "<Buffer " + o + ">";
    }, n && (u.prototype[n] = u.prototype.inspect), u.prototype.compare = function(o, c, k, B, H) {
      if (Ae(o, Uint8Array) && (o = u.from(o, o.offset, o.byteLength)), !u.isBuffer(o))
        throw new TypeError(
          'The "target" argument must be one of type Buffer or Uint8Array. Received type ' + typeof o
        );
      if (c === void 0 && (c = 0), k === void 0 && (k = o ? o.length : 0), B === void 0 && (B = 0), H === void 0 && (H = this.length), c < 0 || k > o.length || B < 0 || H > this.length)
        throw new RangeError("out of range index");
      if (B >= H && c >= k)
        return 0;
      if (B >= H)
        return -1;
      if (c >= k)
        return 1;
      if (c >>>= 0, k >>>= 0, B >>>= 0, H >>>= 0, this === o) return 0;
      let z = H - B, V = k - c;
      const U = Math.min(z, V), a = this.slice(B, H), l = o.slice(c, k);
      for (let v = 0; v < U; ++v)
        if (a[v] !== l[v]) {
          z = a[v], V = l[v];
          break;
        }
      return z < V ? -1 : V < z ? 1 : 0;
    };
    function O(h, o, c, k, B) {
      if (h.length === 0) return -1;
      if (typeof c == "string" ? (k = c, c = 0) : c > 2147483647 ? c = 2147483647 : c < -2147483648 && (c = -2147483648), c = +c, Ee(c) && (c = B ? 0 : h.length - 1), c < 0 && (c = h.length + c), c >= h.length) {
        if (B) return -1;
        c = h.length - 1;
      } else if (c < 0)
        if (B) c = 0;
        else return -1;
      if (typeof o == "string" && (o = u.from(o, k)), u.isBuffer(o))
        return o.length === 0 ? -1 : T(h, o, c, k, B);
      if (typeof o == "number")
        return o = o & 255, typeof Uint8Array.prototype.indexOf == "function" ? B ? Uint8Array.prototype.indexOf.call(h, o, c) : Uint8Array.prototype.lastIndexOf.call(h, o, c) : T(h, [o], c, k, B);
      throw new TypeError("val must be string, number or Buffer");
    }
    function T(h, o, c, k, B) {
      let H = 1, z = h.length, V = o.length;
      if (k !== void 0 && (k = String(k).toLowerCase(), k === "ucs2" || k === "ucs-2" || k === "utf16le" || k === "utf-16le")) {
        if (h.length < 2 || o.length < 2)
          return -1;
        H = 2, z /= 2, V /= 2, c /= 2;
      }
      function U(l, v) {
        return H === 1 ? l[v] : l.readUInt16BE(v * H);
      }
      let a;
      if (B) {
        let l = -1;
        for (a = c; a < z; a++)
          if (U(h, a) === U(o, l === -1 ? 0 : a - l)) {
            if (l === -1 && (l = a), a - l + 1 === V) return l * H;
          } else
            l !== -1 && (a -= a - l), l = -1;
      } else
        for (c + V > z && (c = z - V), a = c; a >= 0; a--) {
          let l = !0;
          for (let v = 0; v < V; v++)
            if (U(h, a + v) !== U(o, v)) {
              l = !1;
              break;
            }
          if (l) return a;
        }
      return -1;
    }
    u.prototype.includes = function(o, c, k) {
      return this.indexOf(o, c, k) !== -1;
    }, u.prototype.indexOf = function(o, c, k) {
      return O(this, o, c, k, !0);
    }, u.prototype.lastIndexOf = function(o, c, k) {
      return O(this, o, c, k, !1);
    };
    function F(h, o, c, k) {
      c = Number(c) || 0;
      const B = h.length - c;
      k ? (k = Number(k), k > B && (k = B)) : k = B;
      const H = o.length;
      k > H / 2 && (k = H / 2);
      let z;
      for (z = 0; z < k; ++z) {
        const V = parseInt(o.substr(z * 2, 2), 16);
        if (Ee(V)) return z;
        h[c + z] = V;
      }
      return z;
    }
    function C(h, o, c, k) {
      return xe(Oe(o, h.length - c), h, c, k);
    }
    function J(h, o, c, k) {
      return xe(_e(o), h, c, k);
    }
    function Z(h, o, c, k) {
      return xe(Re(o), h, c, k);
    }
    function se(h, o, c, k) {
      return xe(ie(o, h.length - c), h, c, k);
    }
    u.prototype.write = function(o, c, k, B) {
      if (c === void 0)
        B = "utf8", k = this.length, c = 0;
      else if (k === void 0 && typeof c == "string")
        B = c, k = this.length, c = 0;
      else if (isFinite(c))
        c = c >>> 0, isFinite(k) ? (k = k >>> 0, B === void 0 && (B = "utf8")) : (B = k, k = void 0);
      else
        throw new Error(
          "Buffer.write(string, encoding, offset[, length]) is no longer supported"
        );
      const H = this.length - c;
      if ((k === void 0 || k > H) && (k = H), o.length > 0 && (k < 0 || c < 0) || c > this.length)
        throw new RangeError("Attempt to write outside buffer bounds");
      B || (B = "utf8");
      let z = !1;
      for (; ; )
        switch (B) {
          case "hex":
            return F(this, o, c, k);
          case "utf8":
          case "utf-8":
            return C(this, o, c, k);
          case "ascii":
          case "latin1":
          case "binary":
            return J(this, o, c, k);
          case "base64":
            return Z(this, o, c, k);
          case "ucs2":
          case "ucs-2":
          case "utf16le":
          case "utf-16le":
            return se(this, o, c, k);
          default:
            if (z) throw new TypeError("Unknown encoding: " + B);
            B = ("" + B).toLowerCase(), z = !0;
        }
    }, u.prototype.toJSON = function() {
      return {
        type: "Buffer",
        data: Array.prototype.slice.call(this._arr || this, 0)
      };
    };
    function le(h, o, c) {
      return o === 0 && c === h.length ? r.fromByteArray(h) : r.fromByteArray(h.slice(o, c));
    }
    function pe(h, o, c) {
      c = Math.min(h.length, c);
      const k = [];
      let B = o;
      for (; B < c; ) {
        const H = h[B];
        let z = null, V = H > 239 ? 4 : H > 223 ? 3 : H > 191 ? 2 : 1;
        if (B + V <= c) {
          let U, a, l, v;
          switch (V) {
            case 1:
              H < 128 && (z = H);
              break;
            case 2:
              U = h[B + 1], (U & 192) === 128 && (v = (H & 31) << 6 | U & 63, v > 127 && (z = v));
              break;
            case 3:
              U = h[B + 1], a = h[B + 2], (U & 192) === 128 && (a & 192) === 128 && (v = (H & 15) << 12 | (U & 63) << 6 | a & 63, v > 2047 && (v < 55296 || v > 57343) && (z = v));
              break;
            case 4:
              U = h[B + 1], a = h[B + 2], l = h[B + 3], (U & 192) === 128 && (a & 192) === 128 && (l & 192) === 128 && (v = (H & 15) << 18 | (U & 63) << 12 | (a & 63) << 6 | l & 63, v > 65535 && v < 1114112 && (z = v));
          }
        }
        z === null ? (z = 65533, V = 1) : z > 65535 && (z -= 65536, k.push(z >>> 10 & 1023 | 55296), z = 56320 | z & 1023), k.push(z), B += V;
      }
      return he(k);
    }
    var me = 4096;
    function he(h) {
      const o = h.length;
      if (o <= me)
        return String.fromCharCode.apply(String, h);
      let c = "", k = 0;
      for (; k < o; )
        c += String.fromCharCode.apply(
          String,
          h.slice(k, k += me)
        );
      return c;
    }
    function X(h, o, c) {
      let k = "";
      c = Math.min(h.length, c);
      for (let B = o; B < c; ++B)
        k += String.fromCharCode(h[B] & 127);
      return k;
    }
    function te(h, o, c) {
      let k = "";
      c = Math.min(h.length, c);
      for (let B = o; B < c; ++B)
        k += String.fromCharCode(h[B]);
      return k;
    }
    function ae(h, o, c) {
      const k = h.length;
      (!o || o < 0) && (o = 0), (!c || c < 0 || c > k) && (c = k);
      let B = "";
      for (let H = o; H < c; ++H)
        B += Ne[h[H]];
      return B;
    }
    function fe(h, o, c) {
      const k = h.slice(o, c);
      let B = "";
      for (let H = 0; H < k.length - 1; H += 2)
        B += String.fromCharCode(k[H] + k[H + 1] * 256);
      return B;
    }
    u.prototype.slice = function(o, c) {
      const k = this.length;
      o = ~~o, c = c === void 0 ? k : ~~c, o < 0 ? (o += k, o < 0 && (o = 0)) : o > k && (o = k), c < 0 ? (c += k, c < 0 && (c = 0)) : c > k && (c = k), c < o && (c = o);
      const B = this.subarray(o, c);
      return Object.setPrototypeOf(B, u.prototype), B;
    };
    function ee(h, o, c) {
      if (h % 1 !== 0 || h < 0) throw new RangeError("offset is not uint");
      if (h + o > c) throw new RangeError("Trying to access beyond buffer length");
    }
    u.prototype.readUintLE = u.prototype.readUIntLE = function(o, c, k) {
      o = o >>> 0, c = c >>> 0, k || ee(o, c, this.length);
      let B = this[o], H = 1, z = 0;
      for (; ++z < c && (H *= 256); )
        B += this[o + z] * H;
      return B;
    }, u.prototype.readUintBE = u.prototype.readUIntBE = function(o, c, k) {
      o = o >>> 0, c = c >>> 0, k || ee(o, c, this.length);
      let B = this[o + --c], H = 1;
      for (; c > 0 && (H *= 256); )
        B += this[o + --c] * H;
      return B;
    }, u.prototype.readUint8 = u.prototype.readUInt8 = function(o, c) {
      return o = o >>> 0, c || ee(o, 1, this.length), this[o];
    }, u.prototype.readUint16LE = u.prototype.readUInt16LE = function(o, c) {
      return o = o >>> 0, c || ee(o, 2, this.length), this[o] | this[o + 1] << 8;
    }, u.prototype.readUint16BE = u.prototype.readUInt16BE = function(o, c) {
      return o = o >>> 0, c || ee(o, 2, this.length), this[o] << 8 | this[o + 1];
    }, u.prototype.readUint32LE = u.prototype.readUInt32LE = function(o, c) {
      return o = o >>> 0, c || ee(o, 4, this.length), (this[o] | this[o + 1] << 8 | this[o + 2] << 16) + this[o + 3] * 16777216;
    }, u.prototype.readUint32BE = u.prototype.readUInt32BE = function(o, c) {
      return o = o >>> 0, c || ee(o, 4, this.length), this[o] * 16777216 + (this[o + 1] << 16 | this[o + 2] << 8 | this[o + 3]);
    }, u.prototype.readBigUInt64LE = ke(function(o) {
      o = o >>> 0, de(o, "offset");
      const c = this[o], k = this[o + 7];
      (c === void 0 || k === void 0) && ge(o, this.length - 8);
      const B = c + this[++o] * 2 ** 8 + this[++o] * 2 ** 16 + this[++o] * 2 ** 24, H = this[++o] + this[++o] * 2 ** 8 + this[++o] * 2 ** 16 + k * 2 ** 24;
      return BigInt(B) + (BigInt(H) << BigInt(32));
    }), u.prototype.readBigUInt64BE = ke(function(o) {
      o = o >>> 0, de(o, "offset");
      const c = this[o], k = this[o + 7];
      (c === void 0 || k === void 0) && ge(o, this.length - 8);
      const B = c * 2 ** 24 + this[++o] * 2 ** 16 + this[++o] * 2 ** 8 + this[++o], H = this[++o] * 2 ** 24 + this[++o] * 2 ** 16 + this[++o] * 2 ** 8 + k;
      return (BigInt(B) << BigInt(32)) + BigInt(H);
    }), u.prototype.readIntLE = function(o, c, k) {
      o = o >>> 0, c = c >>> 0, k || ee(o, c, this.length);
      let B = this[o], H = 1, z = 0;
      for (; ++z < c && (H *= 256); )
        B += this[o + z] * H;
      return H *= 128, B >= H && (B -= Math.pow(2, 8 * c)), B;
    }, u.prototype.readIntBE = function(o, c, k) {
      o = o >>> 0, c = c >>> 0, k || ee(o, c, this.length);
      let B = c, H = 1, z = this[o + --B];
      for (; B > 0 && (H *= 256); )
        z += this[o + --B] * H;
      return H *= 128, z >= H && (z -= Math.pow(2, 8 * c)), z;
    }, u.prototype.readInt8 = function(o, c) {
      return o = o >>> 0, c || ee(o, 1, this.length), this[o] & 128 ? (255 - this[o] + 1) * -1 : this[o];
    }, u.prototype.readInt16LE = function(o, c) {
      o = o >>> 0, c || ee(o, 2, this.length);
      const k = this[o] | this[o + 1] << 8;
      return k & 32768 ? k | 4294901760 : k;
    }, u.prototype.readInt16BE = function(o, c) {
      o = o >>> 0, c || ee(o, 2, this.length);
      const k = this[o + 1] | this[o] << 8;
      return k & 32768 ? k | 4294901760 : k;
    }, u.prototype.readInt32LE = function(o, c) {
      return o = o >>> 0, c || ee(o, 4, this.length), this[o] | this[o + 1] << 8 | this[o + 2] << 16 | this[o + 3] << 24;
    }, u.prototype.readInt32BE = function(o, c) {
      return o = o >>> 0, c || ee(o, 4, this.length), this[o] << 24 | this[o + 1] << 16 | this[o + 2] << 8 | this[o + 3];
    }, u.prototype.readBigInt64LE = ke(function(o) {
      o = o >>> 0, de(o, "offset");
      const c = this[o], k = this[o + 7];
      (c === void 0 || k === void 0) && ge(o, this.length - 8);
      const B = this[o + 4] + this[o + 5] * 2 ** 8 + this[o + 6] * 2 ** 16 + (k << 24);
      return (BigInt(B) << BigInt(32)) + BigInt(c + this[++o] * 2 ** 8 + this[++o] * 2 ** 16 + this[++o] * 2 ** 24);
    }), u.prototype.readBigInt64BE = ke(function(o) {
      o = o >>> 0, de(o, "offset");
      const c = this[o], k = this[o + 7];
      (c === void 0 || k === void 0) && ge(o, this.length - 8);
      const B = (c << 24) + // Overflow
      this[++o] * 2 ** 16 + this[++o] * 2 ** 8 + this[++o];
      return (BigInt(B) << BigInt(32)) + BigInt(this[++o] * 2 ** 24 + this[++o] * 2 ** 16 + this[++o] * 2 ** 8 + k);
    }), u.prototype.readFloatLE = function(o, c) {
      return o = o >>> 0, c || ee(o, 4, this.length), t.read(this, o, !0, 23, 4);
    }, u.prototype.readFloatBE = function(o, c) {
      return o = o >>> 0, c || ee(o, 4, this.length), t.read(this, o, !1, 23, 4);
    }, u.prototype.readDoubleLE = function(o, c) {
      return o = o >>> 0, c || ee(o, 8, this.length), t.read(this, o, !0, 52, 8);
    }, u.prototype.readDoubleBE = function(o, c) {
      return o = o >>> 0, c || ee(o, 8, this.length), t.read(this, o, !1, 52, 8);
    };
    function R(h, o, c, k, B, H) {
      if (!u.isBuffer(h)) throw new TypeError('"buffer" argument must be a Buffer instance');
      if (o > B || o < H) throw new RangeError('"value" argument is out of bounds');
      if (c + k > h.length) throw new RangeError("Index out of range");
    }
    u.prototype.writeUintLE = u.prototype.writeUIntLE = function(o, c, k, B) {
      if (o = +o, c = c >>> 0, k = k >>> 0, !B) {
        const V = Math.pow(2, 8 * k) - 1;
        R(this, o, c, k, V, 0);
      }
      let H = 1, z = 0;
      for (this[c] = o & 255; ++z < k && (H *= 256); )
        this[c + z] = o / H & 255;
      return c + k;
    }, u.prototype.writeUintBE = u.prototype.writeUIntBE = function(o, c, k, B) {
      if (o = +o, c = c >>> 0, k = k >>> 0, !B) {
        const V = Math.pow(2, 8 * k) - 1;
        R(this, o, c, k, V, 0);
      }
      let H = k - 1, z = 1;
      for (this[c + H] = o & 255; --H >= 0 && (z *= 256); )
        this[c + H] = o / z & 255;
      return c + k;
    }, u.prototype.writeUint8 = u.prototype.writeUInt8 = function(o, c, k) {
      return o = +o, c = c >>> 0, k || R(this, o, c, 1, 255, 0), this[c] = o & 255, c + 1;
    }, u.prototype.writeUint16LE = u.prototype.writeUInt16LE = function(o, c, k) {
      return o = +o, c = c >>> 0, k || R(this, o, c, 2, 65535, 0), this[c] = o & 255, this[c + 1] = o >>> 8, c + 2;
    }, u.prototype.writeUint16BE = u.prototype.writeUInt16BE = function(o, c, k) {
      return o = +o, c = c >>> 0, k || R(this, o, c, 2, 65535, 0), this[c] = o >>> 8, this[c + 1] = o & 255, c + 2;
    }, u.prototype.writeUint32LE = u.prototype.writeUInt32LE = function(o, c, k) {
      return o = +o, c = c >>> 0, k || R(this, o, c, 4, 4294967295, 0), this[c + 3] = o >>> 24, this[c + 2] = o >>> 16, this[c + 1] = o >>> 8, this[c] = o & 255, c + 4;
    }, u.prototype.writeUint32BE = u.prototype.writeUInt32BE = function(o, c, k) {
      return o = +o, c = c >>> 0, k || R(this, o, c, 4, 4294967295, 0), this[c] = o >>> 24, this[c + 1] = o >>> 16, this[c + 2] = o >>> 8, this[c + 3] = o & 255, c + 4;
    };
    function D(h, o, c, k, B) {
      oe(o, k, B, h, c, 7);
      let H = Number(o & BigInt(4294967295));
      h[c++] = H, H = H >> 8, h[c++] = H, H = H >> 8, h[c++] = H, H = H >> 8, h[c++] = H;
      let z = Number(o >> BigInt(32) & BigInt(4294967295));
      return h[c++] = z, z = z >> 8, h[c++] = z, z = z >> 8, h[c++] = z, z = z >> 8, h[c++] = z, c;
    }
    function W(h, o, c, k, B) {
      oe(o, k, B, h, c, 7);
      let H = Number(o & BigInt(4294967295));
      h[c + 7] = H, H = H >> 8, h[c + 6] = H, H = H >> 8, h[c + 5] = H, H = H >> 8, h[c + 4] = H;
      let z = Number(o >> BigInt(32) & BigInt(4294967295));
      return h[c + 3] = z, z = z >> 8, h[c + 2] = z, z = z >> 8, h[c + 1] = z, z = z >> 8, h[c] = z, c + 8;
    }
    u.prototype.writeBigUInt64LE = ke(function(o, c = 0) {
      return D(this, o, c, BigInt(0), BigInt("0xffffffffffffffff"));
    }), u.prototype.writeBigUInt64BE = ke(function(o, c = 0) {
      return W(this, o, c, BigInt(0), BigInt("0xffffffffffffffff"));
    }), u.prototype.writeIntLE = function(o, c, k, B) {
      if (o = +o, c = c >>> 0, !B) {
        const U = Math.pow(2, 8 * k - 1);
        R(this, o, c, k, U - 1, -U);
      }
      let H = 0, z = 1, V = 0;
      for (this[c] = o & 255; ++H < k && (z *= 256); )
        o < 0 && V === 0 && this[c + H - 1] !== 0 && (V = 1), this[c + H] = (o / z >> 0) - V & 255;
      return c + k;
    }, u.prototype.writeIntBE = function(o, c, k, B) {
      if (o = +o, c = c >>> 0, !B) {
        const U = Math.pow(2, 8 * k - 1);
        R(this, o, c, k, U - 1, -U);
      }
      let H = k - 1, z = 1, V = 0;
      for (this[c + H] = o & 255; --H >= 0 && (z *= 256); )
        o < 0 && V === 0 && this[c + H + 1] !== 0 && (V = 1), this[c + H] = (o / z >> 0) - V & 255;
      return c + k;
    }, u.prototype.writeInt8 = function(o, c, k) {
      return o = +o, c = c >>> 0, k || R(this, o, c, 1, 127, -128), o < 0 && (o = 255 + o + 1), this[c] = o & 255, c + 1;
    }, u.prototype.writeInt16LE = function(o, c, k) {
      return o = +o, c = c >>> 0, k || R(this, o, c, 2, 32767, -32768), this[c] = o & 255, this[c + 1] = o >>> 8, c + 2;
    }, u.prototype.writeInt16BE = function(o, c, k) {
      return o = +o, c = c >>> 0, k || R(this, o, c, 2, 32767, -32768), this[c] = o >>> 8, this[c + 1] = o & 255, c + 2;
    }, u.prototype.writeInt32LE = function(o, c, k) {
      return o = +o, c = c >>> 0, k || R(this, o, c, 4, 2147483647, -2147483648), this[c] = o & 255, this[c + 1] = o >>> 8, this[c + 2] = o >>> 16, this[c + 3] = o >>> 24, c + 4;
    }, u.prototype.writeInt32BE = function(o, c, k) {
      return o = +o, c = c >>> 0, k || R(this, o, c, 4, 2147483647, -2147483648), o < 0 && (o = 4294967295 + o + 1), this[c] = o >>> 24, this[c + 1] = o >>> 16, this[c + 2] = o >>> 8, this[c + 3] = o & 255, c + 4;
    }, u.prototype.writeBigInt64LE = ke(function(o, c = 0) {
      return D(this, o, c, -BigInt("0x8000000000000000"), BigInt("0x7fffffffffffffff"));
    }), u.prototype.writeBigInt64BE = ke(function(o, c = 0) {
      return W(this, o, c, -BigInt("0x8000000000000000"), BigInt("0x7fffffffffffffff"));
    });
    function re(h, o, c, k, B, H) {
      if (c + k > h.length) throw new RangeError("Index out of range");
      if (c < 0) throw new RangeError("Index out of range");
    }
    function M(h, o, c, k, B) {
      return o = +o, c = c >>> 0, B || re(h, o, c, 4), t.write(h, o, c, k, 23, 4), c + 4;
    }
    u.prototype.writeFloatLE = function(o, c, k) {
      return M(this, o, c, !0, k);
    }, u.prototype.writeFloatBE = function(o, c, k) {
      return M(this, o, c, !1, k);
    };
    function $(h, o, c, k, B) {
      return o = +o, c = c >>> 0, B || re(h, o, c, 8), t.write(h, o, c, k, 52, 8), c + 8;
    }
    u.prototype.writeDoubleLE = function(o, c, k) {
      return $(this, o, c, !0, k);
    }, u.prototype.writeDoubleBE = function(o, c, k) {
      return $(this, o, c, !1, k);
    }, u.prototype.copy = function(o, c, k, B) {
      if (!u.isBuffer(o)) throw new TypeError("argument should be a Buffer");
      if (k || (k = 0), !B && B !== 0 && (B = this.length), c >= o.length && (c = o.length), c || (c = 0), B > 0 && B < k && (B = k), B === k || o.length === 0 || this.length === 0) return 0;
      if (c < 0)
        throw new RangeError("targetStart out of bounds");
      if (k < 0 || k >= this.length) throw new RangeError("Index out of range");
      if (B < 0) throw new RangeError("sourceEnd out of bounds");
      B > this.length && (B = this.length), o.length - c < B - k && (B = o.length - c + k);
      const H = B - k;
      return this === o && typeof Uint8Array.prototype.copyWithin == "function" ? this.copyWithin(c, k, B) : Uint8Array.prototype.set.call(
        o,
        this.subarray(k, B),
        c
      ), H;
    }, u.prototype.fill = function(o, c, k, B) {
      if (typeof o == "string") {
        if (typeof c == "string" ? (B = c, c = 0, k = this.length) : typeof k == "string" && (B = k, k = this.length), B !== void 0 && typeof B != "string")
          throw new TypeError("encoding must be a string");
        if (typeof B == "string" && !u.isEncoding(B))
          throw new TypeError("Unknown encoding: " + B);
        if (o.length === 1) {
          const z = o.charCodeAt(0);
          (B === "utf8" && z < 128 || B === "latin1") && (o = z);
        }
      } else typeof o == "number" ? o = o & 255 : typeof o == "boolean" && (o = Number(o));
      if (c < 0 || this.length < c || this.length < k)
        throw new RangeError("Out of range index");
      if (k <= c)
        return this;
      c = c >>> 0, k = k === void 0 ? this.length : k >>> 0, o || (o = 0);
      let H;
      if (typeof o == "number")
        for (H = c; H < k; ++H)
          this[H] = o;
      else {
        const z = u.isBuffer(o) ? o : u.from(o, B), V = z.length;
        if (V === 0)
          throw new TypeError('The value "' + o + '" is invalid for argument "value"');
        for (H = 0; H < k - c; ++H)
          this[H + c] = z[H % V];
      }
      return this;
    };
    var q = {};
    function L(h, o, c) {
      q[h] = class extends c {
        constructor() {
          super(), Object.defineProperty(this, "message", {
            value: o.apply(this, arguments),
            writable: !0,
            configurable: !0
          }), this.name = `${this.name} [${h}]`, this.stack, delete this.name;
        }
        get code() {
          return h;
        }
        set code(B) {
          Object.defineProperty(this, "code", {
            configurable: !0,
            enumerable: !0,
            value: B,
            writable: !0
          });
        }
        toString() {
          return `${this.name} [${h}]: ${this.message}`;
        }
      };
    }
    L(
      "ERR_BUFFER_OUT_OF_BOUNDS",
      function(h) {
        return h ? `${h} is outside of buffer bounds` : "Attempt to access memory outside buffer bounds";
      },
      RangeError
    ), L(
      "ERR_INVALID_ARG_TYPE",
      function(h, o) {
        return `The "${h}" argument must be of type number. Received type ${typeof o}`;
      },
      TypeError
    ), L(
      "ERR_OUT_OF_RANGE",
      function(h, o, c) {
        let k = `The value of "${h}" is out of range.`, B = c;
        return Number.isInteger(c) && Math.abs(c) > 2 ** 32 ? B = G(String(c)) : typeof c == "bigint" && (B = String(c), (c > BigInt(2) ** BigInt(32) || c < -(BigInt(2) ** BigInt(32))) && (B = G(B)), B += "n"), k += ` It must be ${o}. Received ${B}`, k;
      },
      RangeError
    );
    function G(h) {
      let o = "", c = h.length;
      const k = h[0] === "-" ? 1 : 0;
      for (; c >= k + 4; c -= 3)
        o = `_${h.slice(c - 3, c)}${o}`;
      return `${h.slice(0, c)}${o}`;
    }
    function Q(h, o, c) {
      de(o, "offset"), (h[o] === void 0 || h[o + c] === void 0) && ge(o, h.length - (c + 1));
    }
    function oe(h, o, c, k, B, H) {
      if (h > c || h < o) {
        const z = typeof o == "bigint" ? "n" : "";
        let V;
        throw o === 0 || o === BigInt(0) ? V = `>= 0${z} and < 2${z} ** ${(H + 1) * 8}${z}` : V = `>= -(2${z} ** ${(H + 1) * 8 - 1}${z}) and < 2 ** ${(H + 1) * 8 - 1}${z}`, new q.ERR_OUT_OF_RANGE("value", V, h);
      }
      Q(k, B, H);
    }
    function de(h, o) {
      if (typeof h != "number")
        throw new q.ERR_INVALID_ARG_TYPE(o, "number", h);
    }
    function ge(h, o, c) {
      throw Math.floor(h) !== h ? (de(h, c), new q.ERR_OUT_OF_RANGE("offset", "an integer", h)) : o < 0 ? new q.ERR_BUFFER_OUT_OF_BOUNDS() : new q.ERR_OUT_OF_RANGE(
        "offset",
        `>= 0 and <= ${o}`,
        h
      );
    }
    var ye = /[^+/0-9A-Za-z-_]/g;
    function be(h) {
      if (h = h.split("=")[0], h = h.trim().replace(ye, ""), h.length < 2) return "";
      for (; h.length % 4 !== 0; )
        h = h + "=";
      return h;
    }
    function Oe(h, o) {
      o = o || 1 / 0;
      let c;
      const k = h.length;
      let B = null;
      const H = [];
      for (let z = 0; z < k; ++z) {
        if (c = h.charCodeAt(z), c > 55295 && c < 57344) {
          if (!B) {
            if (c > 56319) {
              (o -= 3) > -1 && H.push(239, 191, 189);
              continue;
            } else if (z + 1 === k) {
              (o -= 3) > -1 && H.push(239, 191, 189);
              continue;
            }
            B = c;
            continue;
          }
          if (c < 56320) {
            (o -= 3) > -1 && H.push(239, 191, 189), B = c;
            continue;
          }
          c = (B - 55296 << 10 | c - 56320) + 65536;
        } else B && (o -= 3) > -1 && H.push(239, 191, 189);
        if (B = null, c < 128) {
          if ((o -= 1) < 0) break;
          H.push(c);
        } else if (c < 2048) {
          if ((o -= 2) < 0) break;
          H.push(
            c >> 6 | 192,
            c & 63 | 128
          );
        } else if (c < 65536) {
          if ((o -= 3) < 0) break;
          H.push(
            c >> 12 | 224,
            c >> 6 & 63 | 128,
            c & 63 | 128
          );
        } else if (c < 1114112) {
          if ((o -= 4) < 0) break;
          H.push(
            c >> 18 | 240,
            c >> 12 & 63 | 128,
            c >> 6 & 63 | 128,
            c & 63 | 128
          );
        } else
          throw new Error("Invalid code point");
      }
      return H;
    }
    function _e(h) {
      const o = [];
      for (let c = 0; c < h.length; ++c)
        o.push(h.charCodeAt(c) & 255);
      return o;
    }
    function ie(h, o) {
      let c, k, B;
      const H = [];
      for (let z = 0; z < h.length && !((o -= 2) < 0); ++z)
        c = h.charCodeAt(z), k = c >> 8, B = c % 256, H.push(B), H.push(k);
      return H;
    }
    function Re(h) {
      return r.toByteArray(be(h));
    }
    function xe(h, o, c, k) {
      let B;
      for (B = 0; B < k && !(B + c >= o.length || B >= h.length); ++B)
        o[B + c] = h[B];
      return B;
    }
    function Ae(h, o) {
      return h instanceof o || h != null && h.constructor != null && h.constructor.name != null && h.constructor.name === o.name;
    }
    function Ee(h) {
      return h !== h;
    }
    var Ne = (function() {
      const h = "0123456789abcdef", o = new Array(256);
      for (let c = 0; c < 16; ++c) {
        const k = c * 16;
        for (let B = 0; B < 16; ++B)
          o[k + B] = h[c] + h[B];
      }
      return o;
    })();
    function ke(h) {
      return typeof BigInt > "u" ? K : h;
    }
    function K() {
      throw new Error("BigInt not supported");
    }
  }
}), Lt = ce({
  "node_modules/memfs/lib/internal/buffer.js"(e) {
    Object.defineProperty(e, "__esModule", { value: !0 }), e.bufferFrom = e.bufferAllocUnsafe = e.Buffer = void 0;
    var r = da();
    Object.defineProperty(e, "Buffer", { enumerable: !0, get: function() {
      return r.Buffer;
    } });
    function t(s, ...f) {
      return new r.Buffer(s, ...f);
    }
    var n = r.Buffer.allocUnsafe || t;
    e.bufferAllocUnsafe = n;
    var i = r.Buffer.from || t;
    e.bufferFrom = i;
  }
}), zr = ce({
  "node_modules/has-symbols/shams.js"(e, r) {
    r.exports = function() {
      if (typeof Symbol != "function" || typeof Object.getOwnPropertySymbols != "function")
        return !1;
      if (typeof Symbol.iterator == "symbol")
        return !0;
      var n = {}, i = Symbol("test"), s = Object(i);
      if (typeof i == "string" || Object.prototype.toString.call(i) !== "[object Symbol]" || Object.prototype.toString.call(s) !== "[object Symbol]")
        return !1;
      var f = 42;
      n[i] = f;
      for (var u in n)
        return !1;
      if (typeof Object.keys == "function" && Object.keys(n).length !== 0 || typeof Object.getOwnPropertyNames == "function" && Object.getOwnPropertyNames(n).length !== 0)
        return !1;
      var b = Object.getOwnPropertySymbols(n);
      if (b.length !== 1 || b[0] !== i || !Object.prototype.propertyIsEnumerable.call(n, i))
        return !1;
      if (typeof Object.getOwnPropertyDescriptor == "function") {
        var g = (
          /** @type {PropertyDescriptor} */
          Object.getOwnPropertyDescriptor(n, i)
        );
        if (g.value !== f || g.enumerable !== !0)
          return !1;
      }
      return !0;
    };
  }
}), Qr = ce({
  "node_modules/has-tostringtag/shams.js"(e, r) {
    var t = zr();
    r.exports = function() {
      return t() && !!Symbol.toStringTag;
    };
  }
}), en = ce({
  "node_modules/es-object-atoms/index.js"(e, r) {
    r.exports = Object;
  }
}), pa = ce({
  "node_modules/es-errors/index.js"(e, r) {
    r.exports = Error;
  }
}), ha = ce({
  "node_modules/es-errors/eval.js"(e, r) {
    r.exports = EvalError;
  }
}), ma = ce({
  "node_modules/es-errors/range.js"(e, r) {
    r.exports = RangeError;
  }
}), ya = ce({
  "node_modules/es-errors/ref.js"(e, r) {
    r.exports = ReferenceError;
  }
}), Fi = ce({
  "node_modules/es-errors/syntax.js"(e, r) {
    r.exports = SyntaxError;
  }
}), mr = ce({
  "node_modules/es-errors/type.js"(e, r) {
    r.exports = TypeError;
  }
}), ga = ce({
  "node_modules/es-errors/uri.js"(e, r) {
    r.exports = URIError;
  }
}), va = ce({
  "node_modules/math-intrinsics/abs.js"(e, r) {
    r.exports = Math.abs;
  }
}), ba = ce({
  "node_modules/math-intrinsics/floor.js"(e, r) {
    r.exports = Math.floor;
  }
}), wa = ce({
  "node_modules/math-intrinsics/max.js"(e, r) {
    r.exports = Math.max;
  }
}), _a = ce({
  "node_modules/math-intrinsics/min.js"(e, r) {
    r.exports = Math.min;
  }
}), xa = ce({
  "node_modules/math-intrinsics/pow.js"(e, r) {
    r.exports = Math.pow;
  }
}), Ea = ce({
  "node_modules/math-intrinsics/round.js"(e, r) {
    r.exports = Math.round;
  }
}), Sa = ce({
  "node_modules/math-intrinsics/isNaN.js"(e, r) {
    r.exports = Number.isNaN || function(n) {
      return n !== n;
    };
  }
}), Oa = ce({
  "node_modules/math-intrinsics/sign.js"(e, r) {
    var t = Sa();
    r.exports = function(i) {
      return t(i) || i === 0 ? i : i < 0 ? -1 : 1;
    };
  }
}), Aa = ce({
  "node_modules/gopd/gOPD.js"(e, r) {
    r.exports = Object.getOwnPropertyDescriptor;
  }
}), qt = ce({
  "node_modules/gopd/index.js"(e, r) {
    var t = Aa();
    if (t)
      try {
        t([], "length");
      } catch {
        t = null;
      }
    r.exports = t;
  }
}), yr = ce({
  "node_modules/es-define-property/index.js"(e, r) {
    var t = Object.defineProperty || !1;
    if (t)
      try {
        t({}, "a", { value: 1 });
      } catch {
        t = !1;
      }
    r.exports = t;
  }
}), ka = ce({
  "node_modules/has-symbols/index.js"(e, r) {
    var t = typeof Symbol < "u" && Symbol, n = zr();
    r.exports = function() {
      return typeof t != "function" || typeof Symbol != "function" || typeof t("foo") != "symbol" || typeof Symbol("bar") != "symbol" ? !1 : n();
    };
  }
}), Bi = ce({
  "node_modules/get-proto/Reflect.getPrototypeOf.js"(e, r) {
    r.exports = typeof Reflect < "u" && Reflect.getPrototypeOf || null;
  }
}), Ci = ce({
  "node_modules/get-proto/Object.getPrototypeOf.js"(e, r) {
    var t = en();
    r.exports = t.getPrototypeOf || null;
  }
}), Ta = ce({
  "node_modules/function-bind/implementation.js"(e, r) {
    var t = "Function.prototype.bind called on incompatible ", n = Object.prototype.toString, i = Math.max, s = "[object Function]", f = function(A, w) {
      for (var j = [], P = 0; P < A.length; P += 1)
        j[P] = A[P];
      for (var x = 0; x < w.length; x += 1)
        j[x + A.length] = w[x];
      return j;
    }, u = function(A, w) {
      for (var j = [], P = w, x = 0; P < A.length; P += 1, x += 1)
        j[x] = A[P];
      return j;
    }, b = function(g, A) {
      for (var w = "", j = 0; j < g.length; j += 1)
        w += g[j], j + 1 < g.length && (w += A);
      return w;
    };
    r.exports = function(A) {
      var w = this;
      if (typeof w != "function" || n.apply(w) !== s)
        throw new TypeError(t + w);
      for (var j = u(arguments, 1), P, x = function() {
        if (this instanceof P) {
          var _ = w.apply(
            this,
            f(j, arguments)
          );
          return Object(_) === _ ? _ : this;
        }
        return w.apply(
          A,
          f(j, arguments)
        );
      }, p = i(0, w.length - j.length), y = [], m = 0; m < p; m++)
        y[m] = "$" + m;
      if (P = Function("binder", "return function (" + b(y, ",") + "){ return binder.apply(this,arguments); }")(x), w.prototype) {
        var S = function() {
        };
        S.prototype = w.prototype, P.prototype = new S(), S.prototype = null;
      }
      return P;
    };
  }
}), Wt = ce({
  "node_modules/function-bind/index.js"(e, r) {
    var t = Ta();
    r.exports = Function.prototype.bind || t;
  }
}), tn = ce({
  "node_modules/call-bind-apply-helpers/functionCall.js"(e, r) {
    r.exports = Function.prototype.call;
  }
}), rn = ce({
  "node_modules/call-bind-apply-helpers/functionApply.js"(e, r) {
    r.exports = Function.prototype.apply;
  }
}), Ra = ce({
  "node_modules/call-bind-apply-helpers/reflectApply.js"(e, r) {
    r.exports = typeof Reflect < "u" && Reflect && Reflect.apply;
  }
}), Di = ce({
  "node_modules/call-bind-apply-helpers/actualApply.js"(e, r) {
    var t = Wt(), n = rn(), i = tn(), s = Ra();
    r.exports = s || t.call(i, n);
  }
}), nn = ce({
  "node_modules/call-bind-apply-helpers/index.js"(e, r) {
    var t = Wt(), n = mr(), i = tn(), s = Di();
    r.exports = function(u) {
      if (u.length < 1 || typeof u[0] != "function")
        throw new n("a function is required");
      return s(t, i, u);
    };
  }
}), Ia = ce({
  "node_modules/dunder-proto/get.js"(e, r) {
    var t = nn(), n = qt(), i;
    try {
      i = /** @type {{ __proto__?: typeof Array.prototype }} */
      [].__proto__ === Array.prototype;
    } catch (b) {
      if (!b || typeof b != "object" || !("code" in b) || b.code !== "ERR_PROTO_ACCESS")
        throw b;
    }
    var s = !!i && n && n(
      Object.prototype,
      /** @type {keyof typeof Object.prototype} */
      "__proto__"
    ), f = Object, u = f.getPrototypeOf;
    r.exports = s && typeof s.get == "function" ? t([s.get]) : typeof u == "function" ? (
      /** @type {import('./get')} */
      (function(g) {
        return u(g == null ? g : f(g));
      })
    ) : !1;
  }
}), ja = ce({
  "node_modules/get-proto/index.js"(e, r) {
    var t = Bi(), n = Ci(), i = Ia();
    r.exports = t ? function(f) {
      return t(f);
    } : n ? function(f) {
      if (!f || typeof f != "object" && typeof f != "function")
        throw new TypeError("getProto: not an object");
      return n(f);
    } : i ? function(f) {
      return i(f);
    } : null;
  }
}), Pa = ce({
  "node_modules/hasown/index.js"(e, r) {
    var t = Function.prototype.call, n = Object.prototype.hasOwnProperty, i = Wt();
    r.exports = i.call(t, n);
  }
}), on = ce({
  "node_modules/get-intrinsic/index.js"(e, r) {
    var t, n = en(), i = pa(), s = ha(), f = ma(), u = ya(), b = Fi(), g = mr(), A = ga(), w = va(), j = ba(), P = wa(), x = _a(), p = xa(), y = Ea(), m = Oa(), S = Function, _ = function(Q) {
      try {
        return S('"use strict"; return (' + Q + ").constructor;")();
      } catch {
      }
    }, d = qt(), E = yr(), O = function() {
      throw new g();
    }, T = d ? (function() {
      try {
        return arguments.callee, O;
      } catch {
        try {
          return d(arguments, "callee").get;
        } catch {
          return O;
        }
      }
    })() : O, F = ka()(), C = ja(), J = Ci(), Z = Bi(), se = rn(), le = tn(), pe = {}, me = typeof Uint8Array > "u" || !C ? t : C(Uint8Array), he = {
      __proto__: null,
      "%AggregateError%": typeof AggregateError > "u" ? t : AggregateError,
      "%Array%": Array,
      "%ArrayBuffer%": typeof ArrayBuffer > "u" ? t : ArrayBuffer,
      "%ArrayIteratorPrototype%": F && C ? C([][Symbol.iterator]()) : t,
      "%AsyncFromSyncIteratorPrototype%": t,
      "%AsyncFunction%": pe,
      "%AsyncGenerator%": pe,
      "%AsyncGeneratorFunction%": pe,
      "%AsyncIteratorPrototype%": pe,
      "%Atomics%": typeof Atomics > "u" ? t : Atomics,
      "%BigInt%": typeof BigInt > "u" ? t : BigInt,
      "%BigInt64Array%": typeof BigInt64Array > "u" ? t : BigInt64Array,
      "%BigUint64Array%": typeof BigUint64Array > "u" ? t : BigUint64Array,
      "%Boolean%": Boolean,
      "%DataView%": typeof DataView > "u" ? t : DataView,
      "%Date%": Date,
      "%decodeURI%": decodeURI,
      "%decodeURIComponent%": decodeURIComponent,
      "%encodeURI%": encodeURI,
      "%encodeURIComponent%": encodeURIComponent,
      "%Error%": i,
      "%eval%": eval,
      // eslint-disable-line no-eval
      "%EvalError%": s,
      "%Float16Array%": typeof Float16Array > "u" ? t : Float16Array,
      "%Float32Array%": typeof Float32Array > "u" ? t : Float32Array,
      "%Float64Array%": typeof Float64Array > "u" ? t : Float64Array,
      "%FinalizationRegistry%": typeof FinalizationRegistry > "u" ? t : FinalizationRegistry,
      "%Function%": S,
      "%GeneratorFunction%": pe,
      "%Int8Array%": typeof Int8Array > "u" ? t : Int8Array,
      "%Int16Array%": typeof Int16Array > "u" ? t : Int16Array,
      "%Int32Array%": typeof Int32Array > "u" ? t : Int32Array,
      "%isFinite%": isFinite,
      "%isNaN%": isNaN,
      "%IteratorPrototype%": F && C ? C(C([][Symbol.iterator]())) : t,
      "%JSON%": typeof JSON == "object" ? JSON : t,
      "%Map%": typeof Map > "u" ? t : Map,
      "%MapIteratorPrototype%": typeof Map > "u" || !F || !C ? t : C((/* @__PURE__ */ new Map())[Symbol.iterator]()),
      "%Math%": Math,
      "%Number%": Number,
      "%Object%": n,
      "%Object.getOwnPropertyDescriptor%": d,
      "%parseFloat%": parseFloat,
      "%parseInt%": parseInt,
      "%Promise%": typeof Promise > "u" ? t : Promise,
      "%Proxy%": typeof Proxy > "u" ? t : Proxy,
      "%RangeError%": f,
      "%ReferenceError%": u,
      "%Reflect%": typeof Reflect > "u" ? t : Reflect,
      "%RegExp%": RegExp,
      "%Set%": typeof Set > "u" ? t : Set,
      "%SetIteratorPrototype%": typeof Set > "u" || !F || !C ? t : C((/* @__PURE__ */ new Set())[Symbol.iterator]()),
      "%SharedArrayBuffer%": typeof SharedArrayBuffer > "u" ? t : SharedArrayBuffer,
      "%String%": String,
      "%StringIteratorPrototype%": F && C ? C(""[Symbol.iterator]()) : t,
      "%Symbol%": F ? Symbol : t,
      "%SyntaxError%": b,
      "%ThrowTypeError%": T,
      "%TypedArray%": me,
      "%TypeError%": g,
      "%Uint8Array%": typeof Uint8Array > "u" ? t : Uint8Array,
      "%Uint8ClampedArray%": typeof Uint8ClampedArray > "u" ? t : Uint8ClampedArray,
      "%Uint16Array%": typeof Uint16Array > "u" ? t : Uint16Array,
      "%Uint32Array%": typeof Uint32Array > "u" ? t : Uint32Array,
      "%URIError%": A,
      "%WeakMap%": typeof WeakMap > "u" ? t : WeakMap,
      "%WeakRef%": typeof WeakRef > "u" ? t : WeakRef,
      "%WeakSet%": typeof WeakSet > "u" ? t : WeakSet,
      "%Function.prototype.call%": le,
      "%Function.prototype.apply%": se,
      "%Object.defineProperty%": E,
      "%Object.getPrototypeOf%": J,
      "%Math.abs%": w,
      "%Math.floor%": j,
      "%Math.max%": P,
      "%Math.min%": x,
      "%Math.pow%": p,
      "%Math.round%": y,
      "%Math.sign%": m,
      "%Reflect.getPrototypeOf%": Z
    };
    if (C)
      try {
        null.error;
      } catch (Q) {
        X = C(C(Q)), he["%Error.prototype%"] = X;
      }
    var X, te = function Q(oe) {
      var de;
      if (oe === "%AsyncFunction%")
        de = _("async function () {}");
      else if (oe === "%GeneratorFunction%")
        de = _("function* () {}");
      else if (oe === "%AsyncGeneratorFunction%")
        de = _("async function* () {}");
      else if (oe === "%AsyncGenerator%") {
        var ge = Q("%AsyncGeneratorFunction%");
        ge && (de = ge.prototype);
      } else if (oe === "%AsyncIteratorPrototype%") {
        var ye = Q("%AsyncGenerator%");
        ye && C && (de = C(ye.prototype));
      }
      return he[oe] = de, de;
    }, ae = {
      __proto__: null,
      "%ArrayBufferPrototype%": ["ArrayBuffer", "prototype"],
      "%ArrayPrototype%": ["Array", "prototype"],
      "%ArrayProto_entries%": ["Array", "prototype", "entries"],
      "%ArrayProto_forEach%": ["Array", "prototype", "forEach"],
      "%ArrayProto_keys%": ["Array", "prototype", "keys"],
      "%ArrayProto_values%": ["Array", "prototype", "values"],
      "%AsyncFunctionPrototype%": ["AsyncFunction", "prototype"],
      "%AsyncGenerator%": ["AsyncGeneratorFunction", "prototype"],
      "%AsyncGeneratorPrototype%": ["AsyncGeneratorFunction", "prototype", "prototype"],
      "%BooleanPrototype%": ["Boolean", "prototype"],
      "%DataViewPrototype%": ["DataView", "prototype"],
      "%DatePrototype%": ["Date", "prototype"],
      "%ErrorPrototype%": ["Error", "prototype"],
      "%EvalErrorPrototype%": ["EvalError", "prototype"],
      "%Float32ArrayPrototype%": ["Float32Array", "prototype"],
      "%Float64ArrayPrototype%": ["Float64Array", "prototype"],
      "%FunctionPrototype%": ["Function", "prototype"],
      "%Generator%": ["GeneratorFunction", "prototype"],
      "%GeneratorPrototype%": ["GeneratorFunction", "prototype", "prototype"],
      "%Int8ArrayPrototype%": ["Int8Array", "prototype"],
      "%Int16ArrayPrototype%": ["Int16Array", "prototype"],
      "%Int32ArrayPrototype%": ["Int32Array", "prototype"],
      "%JSONParse%": ["JSON", "parse"],
      "%JSONStringify%": ["JSON", "stringify"],
      "%MapPrototype%": ["Map", "prototype"],
      "%NumberPrototype%": ["Number", "prototype"],
      "%ObjectPrototype%": ["Object", "prototype"],
      "%ObjProto_toString%": ["Object", "prototype", "toString"],
      "%ObjProto_valueOf%": ["Object", "prototype", "valueOf"],
      "%PromisePrototype%": ["Promise", "prototype"],
      "%PromiseProto_then%": ["Promise", "prototype", "then"],
      "%Promise_all%": ["Promise", "all"],
      "%Promise_reject%": ["Promise", "reject"],
      "%Promise_resolve%": ["Promise", "resolve"],
      "%RangeErrorPrototype%": ["RangeError", "prototype"],
      "%ReferenceErrorPrototype%": ["ReferenceError", "prototype"],
      "%RegExpPrototype%": ["RegExp", "prototype"],
      "%SetPrototype%": ["Set", "prototype"],
      "%SharedArrayBufferPrototype%": ["SharedArrayBuffer", "prototype"],
      "%StringPrototype%": ["String", "prototype"],
      "%SymbolPrototype%": ["Symbol", "prototype"],
      "%SyntaxErrorPrototype%": ["SyntaxError", "prototype"],
      "%TypedArrayPrototype%": ["TypedArray", "prototype"],
      "%TypeErrorPrototype%": ["TypeError", "prototype"],
      "%Uint8ArrayPrototype%": ["Uint8Array", "prototype"],
      "%Uint8ClampedArrayPrototype%": ["Uint8ClampedArray", "prototype"],
      "%Uint16ArrayPrototype%": ["Uint16Array", "prototype"],
      "%Uint32ArrayPrototype%": ["Uint32Array", "prototype"],
      "%URIErrorPrototype%": ["URIError", "prototype"],
      "%WeakMapPrototype%": ["WeakMap", "prototype"],
      "%WeakSetPrototype%": ["WeakSet", "prototype"]
    }, fe = Wt(), ee = Pa(), R = fe.call(le, Array.prototype.concat), D = fe.call(se, Array.prototype.splice), W = fe.call(le, String.prototype.replace), re = fe.call(le, String.prototype.slice), M = fe.call(le, RegExp.prototype.exec), $ = /[^%.[\]]+|\[(?:(-?\d+(?:\.\d+)?)|(["'])((?:(?!\2)[^\\]|\\.)*?)\2)\]|(?=(?:\.|\[\])(?:\.|\[\]|%$))/g, q = /\\(\\)?/g, L = function(oe) {
      var de = re(oe, 0, 1), ge = re(oe, -1);
      if (de === "%" && ge !== "%")
        throw new b("invalid intrinsic syntax, expected closing `%`");
      if (ge === "%" && de !== "%")
        throw new b("invalid intrinsic syntax, expected opening `%`");
      var ye = [];
      return W(oe, $, function(be, Oe, _e, ie) {
        ye[ye.length] = _e ? W(ie, q, "$1") : Oe || be;
      }), ye;
    }, G = function(oe, de) {
      var ge = oe, ye;
      if (ee(ae, ge) && (ye = ae[ge], ge = "%" + ye[0] + "%"), ee(he, ge)) {
        var be = he[ge];
        if (be === pe && (be = te(ge)), typeof be > "u" && !de)
          throw new g("intrinsic " + oe + " exists, but is not available. Please file an issue!");
        return {
          alias: ye,
          name: ge,
          value: be
        };
      }
      throw new b("intrinsic " + oe + " does not exist!");
    };
    r.exports = function(oe, de) {
      if (typeof oe != "string" || oe.length === 0)
        throw new g("intrinsic name must be a non-empty string");
      if (arguments.length > 1 && typeof de != "boolean")
        throw new g('"allowMissing" argument must be a boolean');
      if (M(/^%?[^%]*%?$/, oe) === null)
        throw new b("`%` may not be present anywhere but at the beginning and end of the intrinsic name");
      var ge = L(oe), ye = ge.length > 0 ? ge[0] : "", be = G("%" + ye + "%", de), Oe = be.name, _e = be.value, ie = !1, Re = be.alias;
      Re && (ye = Re[0], D(ge, R([0, 1], Re)));
      for (var xe = 1, Ae = !0; xe < ge.length; xe += 1) {
        var Ee = ge[xe], Ne = re(Ee, 0, 1), ke = re(Ee, -1);
        if ((Ne === '"' || Ne === "'" || Ne === "`" || ke === '"' || ke === "'" || ke === "`") && Ne !== ke)
          throw new b("property names with quotes must have matching quotes");
        if ((Ee === "constructor" || !Ae) && (ie = !0), ye += "." + Ee, Oe = "%" + ye + "%", ee(he, Oe))
          _e = he[Oe];
        else if (_e != null) {
          if (!(Ee in _e)) {
            if (!de)
              throw new g("base intrinsic for " + oe + " exists, but the property is not available.");
            return;
          }
          if (d && xe + 1 >= ge.length) {
            var K = d(_e, Ee);
            Ae = !!K, Ae && "get" in K && !("originalValue" in K.get) ? _e = K.get : _e = _e[Ee];
          } else
            Ae = ee(_e, Ee), _e = _e[Ee];
          Ae && !ie && (he[Oe] = _e);
        }
      }
      return _e;
    };
  }
}), Li = ce({
  "node_modules/define-data-property/index.js"(e, r) {
    var t = yr(), n = Fi(), i = mr(), s = qt();
    r.exports = function(u, b, g) {
      if (!u || typeof u != "object" && typeof u != "function")
        throw new i("`obj` must be an object or a function`");
      if (typeof b != "string" && typeof b != "symbol")
        throw new i("`property` must be a string or a symbol`");
      if (arguments.length > 3 && typeof arguments[3] != "boolean" && arguments[3] !== null)
        throw new i("`nonEnumerable`, if provided, must be a boolean or null");
      if (arguments.length > 4 && typeof arguments[4] != "boolean" && arguments[4] !== null)
        throw new i("`nonWritable`, if provided, must be a boolean or null");
      if (arguments.length > 5 && typeof arguments[5] != "boolean" && arguments[5] !== null)
        throw new i("`nonConfigurable`, if provided, must be a boolean or null");
      if (arguments.length > 6 && typeof arguments[6] != "boolean")
        throw new i("`loose`, if provided, must be a boolean");
      var A = arguments.length > 3 ? arguments[3] : null, w = arguments.length > 4 ? arguments[4] : null, j = arguments.length > 5 ? arguments[5] : null, P = arguments.length > 6 ? arguments[6] : !1, x = !!s && s(u, b);
      if (t)
        t(u, b, {
          configurable: j === null && x ? x.configurable : !j,
          enumerable: A === null && x ? x.enumerable : !A,
          value: g,
          writable: w === null && x ? x.writable : !w
        });
      else if (P || !A && !w && !j)
        u[b] = g;
      else
        throw new n("This environment does not support defining a property as non-configurable, non-writable, or non-enumerable.");
    };
  }
}), Ui = ce({
  "node_modules/has-property-descriptors/index.js"(e, r) {
    var t = yr(), n = function() {
      return !!t;
    };
    n.hasArrayLengthDefineBug = function() {
      if (!t)
        return null;
      try {
        return t([], "length", { value: 1 }).length !== 1;
      } catch {
        return !0;
      }
    }, r.exports = n;
  }
}), Na = ce({
  "node_modules/set-function-length/index.js"(e, r) {
    var t = on(), n = Li(), i = Ui()(), s = qt(), f = mr(), u = t("%Math.floor%");
    r.exports = function(g, A) {
      if (typeof g != "function")
        throw new f("`fn` is not a function");
      if (typeof A != "number" || A < 0 || A > 4294967295 || u(A) !== A)
        throw new f("`length` must be a positive 32-bit integer");
      var w = arguments.length > 2 && !!arguments[2], j = !0, P = !0;
      if ("length" in g && s) {
        var x = s(g, "length");
        x && !x.configurable && (j = !1), x && !x.writable && (P = !1);
      }
      return (j || P || !w) && (i ? n(
        /** @type {Parameters<define>[0]} */
        g,
        "length",
        A,
        !0,
        !0
      ) : n(
        /** @type {Parameters<define>[0]} */
        g,
        "length",
        A
      )), g;
    };
  }
}), Fa = ce({
  "node_modules/call-bind-apply-helpers/applyBind.js"(e, r) {
    var t = Wt(), n = rn(), i = Di();
    r.exports = function() {
      return i(t, n, arguments);
    };
  }
}), gr = ce({
  "node_modules/call-bind/index.js"(e, r) {
    var t = Na(), n = yr(), i = nn(), s = Fa();
    r.exports = function(u) {
      var b = i(arguments), g = u.length - (arguments.length - 1);
      return t(
        b,
        1 + (g > 0 ? g : 0),
        !0
      );
    }, n ? n(r.exports, "apply", { value: s }) : r.exports.apply = s;
  }
}), sn = ce({
  "node_modules/call-bind/callBound.js"(e, r) {
    var t = on(), n = gr(), i = n(t("String.prototype.indexOf"));
    r.exports = function(f, u) {
      var b = t(f, !!u);
      return typeof b == "function" && i(f, ".prototype.") > -1 ? n(b) : b;
    };
  }
}), Ba = ce({
  "node_modules/is-arguments/index.js"(e, r) {
    var t = Qr()(), n = sn(), i = n("Object.prototype.toString"), s = function(g) {
      return t && g && typeof g == "object" && Symbol.toStringTag in g ? !1 : i(g) === "[object Arguments]";
    }, f = function(g) {
      return s(g) ? !0 : g !== null && typeof g == "object" && typeof g.length == "number" && g.length >= 0 && i(g) !== "[object Array]" && i(g.callee) === "[object Function]";
    }, u = (function() {
      return s(arguments);
    })();
    s.isLegacyArguments = f, r.exports = u ? s : f;
  }
}), Ca = ce({
  "node_modules/is-generator-function/index.js"(e, r) {
    var t = Object.prototype.toString, n = Function.prototype.toString, i = /^\s*(?:function)?\*/, s = Qr()(), f = Object.getPrototypeOf, u = function() {
      if (!s)
        return !1;
      try {
        return Function("return function*() {}")();
      } catch {
      }
    }, b;
    r.exports = function(A) {
      if (typeof A != "function")
        return !1;
      if (i.test(n.call(A)))
        return !0;
      if (!s) {
        var w = t.call(A);
        return w === "[object GeneratorFunction]";
      }
      if (!f)
        return !1;
      if (typeof b > "u") {
        var j = u();
        b = j ? f(j) : !1;
      }
      return f(A) === b;
    };
  }
}), Da = ce({
  "node_modules/is-callable/index.js"(e, r) {
    var t = Function.prototype.toString, n = typeof Reflect == "object" && Reflect !== null && Reflect.apply, i, s;
    if (typeof n == "function" && typeof Object.defineProperty == "function")
      try {
        i = Object.defineProperty({}, "length", {
          get: function() {
            throw s;
          }
        }), s = {}, n(function() {
          throw 42;
        }, null, i);
      } catch (d) {
        d !== s && (n = null);
      }
    else
      n = null;
    var f = /^\s*class\b/, u = function(E) {
      try {
        var O = t.call(E);
        return f.test(O);
      } catch {
        return !1;
      }
    }, b = function(E) {
      try {
        return u(E) ? !1 : (t.call(E), !0);
      } catch {
        return !1;
      }
    }, g = Object.prototype.toString, A = "[object Object]", w = "[object Function]", j = "[object GeneratorFunction]", P = "[object HTMLAllCollection]", x = "[object HTML document.all class]", p = "[object HTMLCollection]", y = typeof Symbol == "function" && !!Symbol.toStringTag, m = !(0 in [,]), S = function() {
      return !1;
    };
    typeof document == "object" && (_ = document.all, g.call(_) === g.call(document.all) && (S = function(E) {
      if ((m || !E) && (typeof E > "u" || typeof E == "object"))
        try {
          var O = g.call(E);
          return (O === P || O === x || O === p || O === A) && E("") == null;
        } catch {
        }
      return !1;
    }));
    var _;
    r.exports = n ? function(E) {
      if (S(E))
        return !0;
      if (!E || typeof E != "function" && typeof E != "object")
        return !1;
      try {
        n(E, null, i);
      } catch (O) {
        if (O !== s)
          return !1;
      }
      return !u(E) && b(E);
    } : function(E) {
      if (S(E))
        return !0;
      if (!E || typeof E != "function" && typeof E != "object")
        return !1;
      if (y)
        return b(E);
      if (u(E))
        return !1;
      var O = g.call(E);
      return O !== w && O !== j && !/^\[object HTML/.test(O) ? !1 : b(E);
    };
  }
}), La = ce({
  "node_modules/for-each/index.js"(e, r) {
    var t = Da(), n = Object.prototype.toString, i = Object.prototype.hasOwnProperty, s = function(A, w, j) {
      for (var P = 0, x = A.length; P < x; P++)
        i.call(A, P) && (j == null ? w(A[P], P, A) : w.call(j, A[P], P, A));
    }, f = function(A, w, j) {
      for (var P = 0, x = A.length; P < x; P++)
        j == null ? w(A.charAt(P), P, A) : w.call(j, A.charAt(P), P, A);
    }, u = function(A, w, j) {
      for (var P in A)
        i.call(A, P) && (j == null ? w(A[P], P, A) : w.call(j, A[P], P, A));
    }, b = function(A, w, j) {
      if (!t(w))
        throw new TypeError("iterator must be a function");
      var P;
      arguments.length >= 3 && (P = j), n.call(A) === "[object Array]" ? s(A, w, P) : typeof A == "string" ? f(A, w, P) : u(A, w, P);
    };
    r.exports = b;
  }
}), Ua = ce({
  "node_modules/available-typed-arrays/index.js"(e, r) {
    var t = [
      "BigInt64Array",
      "BigUint64Array",
      "Float32Array",
      "Float64Array",
      "Int16Array",
      "Int32Array",
      "Int8Array",
      "Uint16Array",
      "Uint32Array",
      "Uint8Array",
      "Uint8ClampedArray"
    ], n = typeof globalThis > "u" ? global : globalThis;
    r.exports = function() {
      for (var s = [], f = 0; f < t.length; f++)
        typeof n[t[f]] == "function" && (s[s.length] = t[f]);
      return s;
    };
  }
}), Mi = ce({
  "node_modules/which-typed-array/index.js"(e, r) {
    var t = La(), n = Ua(), i = gr(), s = sn(), f = qt(), u = s("Object.prototype.toString"), b = Qr()(), g = typeof globalThis > "u" ? global : globalThis, A = n(), w = s("String.prototype.slice"), j = Object.getPrototypeOf, P = s("Array.prototype.indexOf", !0) || function(S, _) {
      for (var d = 0; d < S.length; d += 1)
        if (S[d] === _)
          return d;
      return -1;
    }, x = { __proto__: null };
    b && f && j ? t(A, function(m) {
      var S = new g[m]();
      if (Symbol.toStringTag in S) {
        var _ = j(S), d = f(_, Symbol.toStringTag);
        if (!d) {
          var E = j(_);
          d = f(E, Symbol.toStringTag);
        }
        x["$" + m] = i(d.get);
      }
    }) : t(A, function(m) {
      var S = new g[m]();
      x["$" + m] = i(S.slice);
    });
    var p = function(S) {
      var _ = !1;
      return t(x, function(d, E) {
        if (!_)
          try {
            "$" + d(S) === E && (_ = w(E, 1));
          } catch {
          }
      }), _;
    }, y = function(S) {
      var _ = !1;
      return t(x, function(d, E) {
        if (!_)
          try {
            d(S), _ = w(E, 1);
          } catch {
          }
      }), _;
    };
    r.exports = function(S) {
      if (!S || typeof S != "object")
        return !1;
      if (!b) {
        var _ = w(u(S), 8, -1);
        return P(A, _) > -1 ? _ : _ !== "Object" ? !1 : y(S);
      }
      return f ? p(S) : null;
    };
  }
}), Ma = ce({
  "node_modules/is-typed-array/index.js"(e, r) {
    var t = Mi();
    r.exports = function(i) {
      return !!t(i);
    };
  }
}), qa = ce({
  "node_modules/util/support/types.js"(e) {
    var r = Ba(), t = Ca(), n = Mi(), i = Ma();
    function s(ie) {
      return ie.call.bind(ie);
    }
    var f = typeof BigInt < "u", u = typeof Symbol < "u", b = s(Object.prototype.toString), g = s(Number.prototype.valueOf), A = s(String.prototype.valueOf), w = s(Boolean.prototype.valueOf);
    f && (j = s(BigInt.prototype.valueOf));
    var j;
    u && (P = s(Symbol.prototype.valueOf));
    var P;
    function x(ie, Re) {
      if (typeof ie != "object")
        return !1;
      try {
        return Re(ie), !0;
      } catch {
        return !1;
      }
    }
    e.isArgumentsObject = r, e.isGeneratorFunction = t, e.isTypedArray = i;
    function p(ie) {
      return typeof Promise < "u" && ie instanceof Promise || ie !== null && typeof ie == "object" && typeof ie.then == "function" && typeof ie.catch == "function";
    }
    e.isPromise = p;
    function y(ie) {
      return typeof ArrayBuffer < "u" && ArrayBuffer.isView ? ArrayBuffer.isView(ie) : i(ie) || D(ie);
    }
    e.isArrayBufferView = y;
    function m(ie) {
      return n(ie) === "Uint8Array";
    }
    e.isUint8Array = m;
    function S(ie) {
      return n(ie) === "Uint8ClampedArray";
    }
    e.isUint8ClampedArray = S;
    function _(ie) {
      return n(ie) === "Uint16Array";
    }
    e.isUint16Array = _;
    function d(ie) {
      return n(ie) === "Uint32Array";
    }
    e.isUint32Array = d;
    function E(ie) {
      return n(ie) === "Int8Array";
    }
    e.isInt8Array = E;
    function O(ie) {
      return n(ie) === "Int16Array";
    }
    e.isInt16Array = O;
    function T(ie) {
      return n(ie) === "Int32Array";
    }
    e.isInt32Array = T;
    function F(ie) {
      return n(ie) === "Float32Array";
    }
    e.isFloat32Array = F;
    function C(ie) {
      return n(ie) === "Float64Array";
    }
    e.isFloat64Array = C;
    function J(ie) {
      return n(ie) === "BigInt64Array";
    }
    e.isBigInt64Array = J;
    function Z(ie) {
      return n(ie) === "BigUint64Array";
    }
    e.isBigUint64Array = Z;
    function se(ie) {
      return b(ie) === "[object Map]";
    }
    se.working = typeof Map < "u" && se(/* @__PURE__ */ new Map());
    function le(ie) {
      return typeof Map > "u" ? !1 : se.working ? se(ie) : ie instanceof Map;
    }
    e.isMap = le;
    function pe(ie) {
      return b(ie) === "[object Set]";
    }
    pe.working = typeof Set < "u" && pe(/* @__PURE__ */ new Set());
    function me(ie) {
      return typeof Set > "u" ? !1 : pe.working ? pe(ie) : ie instanceof Set;
    }
    e.isSet = me;
    function he(ie) {
      return b(ie) === "[object WeakMap]";
    }
    he.working = typeof WeakMap < "u" && he(/* @__PURE__ */ new WeakMap());
    function X(ie) {
      return typeof WeakMap > "u" ? !1 : he.working ? he(ie) : ie instanceof WeakMap;
    }
    e.isWeakMap = X;
    function te(ie) {
      return b(ie) === "[object WeakSet]";
    }
    te.working = typeof WeakSet < "u" && te(/* @__PURE__ */ new WeakSet());
    function ae(ie) {
      return te(ie);
    }
    e.isWeakSet = ae;
    function fe(ie) {
      return b(ie) === "[object ArrayBuffer]";
    }
    fe.working = typeof ArrayBuffer < "u" && fe(new ArrayBuffer());
    function ee(ie) {
      return typeof ArrayBuffer > "u" ? !1 : fe.working ? fe(ie) : ie instanceof ArrayBuffer;
    }
    e.isArrayBuffer = ee;
    function R(ie) {
      return b(ie) === "[object DataView]";
    }
    R.working = typeof ArrayBuffer < "u" && typeof DataView < "u" && R(new DataView(new ArrayBuffer(1), 0, 1));
    function D(ie) {
      return typeof DataView > "u" ? !1 : R.working ? R(ie) : ie instanceof DataView;
    }
    e.isDataView = D;
    var W = typeof SharedArrayBuffer < "u" ? SharedArrayBuffer : void 0;
    function re(ie) {
      return b(ie) === "[object SharedArrayBuffer]";
    }
    function M(ie) {
      return typeof W > "u" ? !1 : (typeof re.working > "u" && (re.working = re(new W())), re.working ? re(ie) : ie instanceof W);
    }
    e.isSharedArrayBuffer = M;
    function $(ie) {
      return b(ie) === "[object AsyncFunction]";
    }
    e.isAsyncFunction = $;
    function q(ie) {
      return b(ie) === "[object Map Iterator]";
    }
    e.isMapIterator = q;
    function L(ie) {
      return b(ie) === "[object Set Iterator]";
    }
    e.isSetIterator = L;
    function G(ie) {
      return b(ie) === "[object Generator]";
    }
    e.isGeneratorObject = G;
    function Q(ie) {
      return b(ie) === "[object WebAssembly.Module]";
    }
    e.isWebAssemblyCompiledModule = Q;
    function oe(ie) {
      return x(ie, g);
    }
    e.isNumberObject = oe;
    function de(ie) {
      return x(ie, A);
    }
    e.isStringObject = de;
    function ge(ie) {
      return x(ie, w);
    }
    e.isBooleanObject = ge;
    function ye(ie) {
      return f && x(ie, j);
    }
    e.isBigIntObject = ye;
    function be(ie) {
      return u && x(ie, P);
    }
    e.isSymbolObject = be;
    function Oe(ie) {
      return oe(ie) || de(ie) || ge(ie) || ye(ie) || be(ie);
    }
    e.isBoxedPrimitive = Oe;
    function _e(ie) {
      return typeof Uint8Array < "u" && (ee(ie) || M(ie));
    }
    e.isAnyArrayBuffer = _e, ["isProxy", "isExternal", "isModuleNamespaceObject"].forEach(function(ie) {
      Object.defineProperty(e, ie, {
        enumerable: !1,
        value: function() {
          throw new Error(ie + " is not supported in userland");
        }
      });
    });
  }
}), Wa = ce({
  "node_modules/util/support/isBufferBrowser.js"(e, r) {
    r.exports = function(n) {
      return n && typeof n == "object" && typeof n.copy == "function" && typeof n.fill == "function" && typeof n.readUInt8 == "function";
    };
  }
}), $a = ce({
  "node_modules/inherits/inherits_browser.js"(e, r) {
    typeof Object.create == "function" ? r.exports = function(n, i) {
      i && (n.super_ = i, n.prototype = Object.create(i.prototype, {
        constructor: {
          value: n,
          enumerable: !1,
          writable: !0,
          configurable: !0
        }
      }));
    } : r.exports = function(n, i) {
      if (i) {
        n.super_ = i;
        var s = function() {
        };
        s.prototype = i.prototype, n.prototype = new s(), n.prototype.constructor = n;
      }
    };
  }
}), vt = ce({
  "node_modules/util/util.js"(e) {
    var r = Object.getOwnPropertyDescriptors || function(D) {
      for (var W = Object.keys(D), re = {}, M = 0; M < W.length; M++)
        re[W[M]] = Object.getOwnPropertyDescriptor(D, W[M]);
      return re;
    }, t = /%[sdj%]/g;
    e.format = function(R) {
      if (!E(R)) {
        for (var D = [], W = 0; W < arguments.length; W++)
          D.push(f(arguments[W]));
        return D.join(" ");
      }
      for (var W = 1, re = arguments, M = re.length, $ = String(R).replace(t, function(L) {
        if (L === "%%") return "%";
        if (W >= M) return L;
        switch (L) {
          case "%s":
            return String(re[W++]);
          case "%d":
            return Number(re[W++]);
          case "%j":
            try {
              return JSON.stringify(re[W++]);
            } catch {
              return "[Circular]";
            }
          default:
            return L;
        }
      }), q = re[W]; W < M; q = re[++W])
        S(q) || !C(q) ? $ += " " + q : $ += " " + f(q);
      return $;
    }, e.deprecate = function(R, D) {
      if (typeof we < "u" && we.noDeprecation === !0)
        return R;
      if (typeof we > "u")
        return function() {
          return e.deprecate(R, D).apply(this, arguments);
        };
      var W = !1;
      function re() {
        if (!W) {
          if (we.throwDeprecation)
            throw new Error(D);
          we.traceDeprecation ? console.trace(D) : console.error(D), W = !0;
        }
        return R.apply(this, arguments);
      }
      return re;
    };
    var n = {}, i = /^$/;
    we.env.NODE_DEBUG && (s = we.env.NODE_DEBUG, s = s.replace(/[|\\{}()[\]^$+?.]/g, "\\$&").replace(/\*/g, ".*").replace(/,/g, "$|^").toUpperCase(), i = new RegExp("^" + s + "$", "i"));
    var s;
    e.debuglog = function(R) {
      if (R = R.toUpperCase(), !n[R])
        if (i.test(R)) {
          var D = we.pid;
          n[R] = function() {
            var W = e.format.apply(e, arguments);
            console.error("%s %d: %s", R, D, W);
          };
        } else
          n[R] = function() {
          };
      return n[R];
    };
    function f(R, D) {
      var W = {
        seen: [],
        stylize: b
      };
      return arguments.length >= 3 && (W.depth = arguments[2]), arguments.length >= 4 && (W.colors = arguments[3]), m(D) ? W.showHidden = D : D && e._extend(W, D), T(W.showHidden) && (W.showHidden = !1), T(W.depth) && (W.depth = 2), T(W.colors) && (W.colors = !1), T(W.customInspect) && (W.customInspect = !0), W.colors && (W.stylize = u), A(W, R, W.depth);
    }
    e.inspect = f, f.colors = {
      bold: [1, 22],
      italic: [3, 23],
      underline: [4, 24],
      inverse: [7, 27],
      white: [37, 39],
      grey: [90, 39],
      black: [30, 39],
      blue: [34, 39],
      cyan: [36, 39],
      green: [32, 39],
      magenta: [35, 39],
      red: [31, 39],
      yellow: [33, 39]
    }, f.styles = {
      special: "cyan",
      number: "yellow",
      boolean: "yellow",
      undefined: "grey",
      null: "bold",
      string: "green",
      date: "magenta",
      // "name": intentionally not styling
      regexp: "red"
    };
    function u(R, D) {
      var W = f.styles[D];
      return W ? "\x1B[" + f.colors[W][0] + "m" + R + "\x1B[" + f.colors[W][1] + "m" : R;
    }
    function b(R, D) {
      return R;
    }
    function g(R) {
      var D = {};
      return R.forEach(function(W, re) {
        D[W] = !0;
      }), D;
    }
    function A(R, D, W) {
      if (R.customInspect && D && se(D.inspect) && // Filter out the util module, it's inspect function is special
      D.inspect !== e.inspect && // Also filter out any prototype objects using the circular check.
      !(D.constructor && D.constructor.prototype === D)) {
        var re = D.inspect(W, R);
        return E(re) || (re = A(R, re, W)), re;
      }
      var M = w(R, D);
      if (M)
        return M;
      var $ = Object.keys(D), q = g($);
      if (R.showHidden && ($ = Object.getOwnPropertyNames(D)), Z(D) && ($.indexOf("message") >= 0 || $.indexOf("description") >= 0))
        return j(D);
      if ($.length === 0) {
        if (se(D)) {
          var L = D.name ? ": " + D.name : "";
          return R.stylize("[Function" + L + "]", "special");
        }
        if (F(D))
          return R.stylize(RegExp.prototype.toString.call(D), "regexp");
        if (J(D))
          return R.stylize(Date.prototype.toString.call(D), "date");
        if (Z(D))
          return j(D);
      }
      var G = "", Q = !1, oe = ["{", "}"];
      if (y(D) && (Q = !0, oe = ["[", "]"]), se(D)) {
        var de = D.name ? ": " + D.name : "";
        G = " [Function" + de + "]";
      }
      if (F(D) && (G = " " + RegExp.prototype.toString.call(D)), J(D) && (G = " " + Date.prototype.toUTCString.call(D)), Z(D) && (G = " " + j(D)), $.length === 0 && (!Q || D.length == 0))
        return oe[0] + G + oe[1];
      if (W < 0)
        return F(D) ? R.stylize(RegExp.prototype.toString.call(D), "regexp") : R.stylize("[Object]", "special");
      R.seen.push(D);
      var ge;
      return Q ? ge = P(R, D, W, q, $) : ge = $.map(function(ye) {
        return x(R, D, W, q, ye, Q);
      }), R.seen.pop(), p(ge, G, oe);
    }
    function w(R, D) {
      if (T(D))
        return R.stylize("undefined", "undefined");
      if (E(D)) {
        var W = "'" + JSON.stringify(D).replace(/^"|"$/g, "").replace(/'/g, "\\'").replace(/\\"/g, '"') + "'";
        return R.stylize(W, "string");
      }
      if (d(D))
        return R.stylize("" + D, "number");
      if (m(D))
        return R.stylize("" + D, "boolean");
      if (S(D))
        return R.stylize("null", "null");
    }
    function j(R) {
      return "[" + Error.prototype.toString.call(R) + "]";
    }
    function P(R, D, W, re, M) {
      for (var $ = [], q = 0, L = D.length; q < L; ++q)
        te(D, String(q)) ? $.push(x(
          R,
          D,
          W,
          re,
          String(q),
          !0
        )) : $.push("");
      return M.forEach(function(G) {
        G.match(/^\d+$/) || $.push(x(
          R,
          D,
          W,
          re,
          G,
          !0
        ));
      }), $;
    }
    function x(R, D, W, re, M, $) {
      var q, L, G;
      if (G = Object.getOwnPropertyDescriptor(D, M) || { value: D[M] }, G.get ? G.set ? L = R.stylize("[Getter/Setter]", "special") : L = R.stylize("[Getter]", "special") : G.set && (L = R.stylize("[Setter]", "special")), te(re, M) || (q = "[" + M + "]"), L || (R.seen.indexOf(G.value) < 0 ? (S(W) ? L = A(R, G.value, null) : L = A(R, G.value, W - 1), L.indexOf(`
`) > -1 && ($ ? L = L.split(`
`).map(function(Q) {
        return "  " + Q;
      }).join(`
`).slice(2) : L = `
` + L.split(`
`).map(function(Q) {
        return "   " + Q;
      }).join(`
`))) : L = R.stylize("[Circular]", "special")), T(q)) {
        if ($ && M.match(/^\d+$/))
          return L;
        q = JSON.stringify("" + M), q.match(/^"([a-zA-Z_][a-zA-Z_0-9]*)"$/) ? (q = q.slice(1, -1), q = R.stylize(q, "name")) : (q = q.replace(/'/g, "\\'").replace(/\\"/g, '"').replace(/(^"|"$)/g, "'"), q = R.stylize(q, "string"));
      }
      return q + ": " + L;
    }
    function p(R, D, W) {
      var re = R.reduce(function(M, $) {
        return $.indexOf(`
`) >= 0, M + $.replace(/\u001b\[\d\d?m/g, "").length + 1;
      }, 0);
      return re > 60 ? W[0] + (D === "" ? "" : D + `
 `) + " " + R.join(`,
  `) + " " + W[1] : W[0] + D + " " + R.join(", ") + " " + W[1];
    }
    e.types = qa();
    function y(R) {
      return Array.isArray(R);
    }
    e.isArray = y;
    function m(R) {
      return typeof R == "boolean";
    }
    e.isBoolean = m;
    function S(R) {
      return R === null;
    }
    e.isNull = S;
    function _(R) {
      return R == null;
    }
    e.isNullOrUndefined = _;
    function d(R) {
      return typeof R == "number";
    }
    e.isNumber = d;
    function E(R) {
      return typeof R == "string";
    }
    e.isString = E;
    function O(R) {
      return typeof R == "symbol";
    }
    e.isSymbol = O;
    function T(R) {
      return R === void 0;
    }
    e.isUndefined = T;
    function F(R) {
      return C(R) && pe(R) === "[object RegExp]";
    }
    e.isRegExp = F, e.types.isRegExp = F;
    function C(R) {
      return typeof R == "object" && R !== null;
    }
    e.isObject = C;
    function J(R) {
      return C(R) && pe(R) === "[object Date]";
    }
    e.isDate = J, e.types.isDate = J;
    function Z(R) {
      return C(R) && (pe(R) === "[object Error]" || R instanceof Error);
    }
    e.isError = Z, e.types.isNativeError = Z;
    function se(R) {
      return typeof R == "function";
    }
    e.isFunction = se;
    function le(R) {
      return R === null || typeof R == "boolean" || typeof R == "number" || typeof R == "string" || typeof R == "symbol" || // ES6 symbol
      typeof R > "u";
    }
    e.isPrimitive = le, e.isBuffer = Wa();
    function pe(R) {
      return Object.prototype.toString.call(R);
    }
    function me(R) {
      return R < 10 ? "0" + R.toString(10) : R.toString(10);
    }
    var he = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec"
    ];
    function X() {
      var R = /* @__PURE__ */ new Date(), D = [
        me(R.getHours()),
        me(R.getMinutes()),
        me(R.getSeconds())
      ].join(":");
      return [R.getDate(), he[R.getMonth()], D].join(" ");
    }
    e.log = function() {
      console.log("%s - %s", X(), e.format.apply(e, arguments));
    }, e.inherits = $a(), e._extend = function(R, D) {
      if (!D || !C(D)) return R;
      for (var W = Object.keys(D), re = W.length; re--; )
        R[W[re]] = D[W[re]];
      return R;
    };
    function te(R, D) {
      return Object.prototype.hasOwnProperty.call(R, D);
    }
    var ae = typeof Symbol < "u" ? Symbol("util.promisify.custom") : void 0;
    e.promisify = function(D) {
      if (typeof D != "function")
        throw new TypeError('The "original" argument must be of type Function');
      if (ae && D[ae]) {
        var W = D[ae];
        if (typeof W != "function")
          throw new TypeError('The "util.promisify.custom" argument must be of type Function');
        return Object.defineProperty(W, ae, {
          value: W,
          enumerable: !1,
          writable: !1,
          configurable: !0
        }), W;
      }
      function W() {
        for (var re, M, $ = new Promise(function(G, Q) {
          re = G, M = Q;
        }), q = [], L = 0; L < arguments.length; L++)
          q.push(arguments[L]);
        q.push(function(G, Q) {
          G ? M(G) : re(Q);
        });
        try {
          D.apply(this, q);
        } catch (G) {
          M(G);
        }
        return $;
      }
      return Object.setPrototypeOf(W, Object.getPrototypeOf(D)), ae && Object.defineProperty(W, ae, {
        value: W,
        enumerable: !1,
        writable: !1,
        configurable: !0
      }), Object.defineProperties(
        W,
        r(D)
      );
    }, e.promisify.custom = ae;
    function fe(R, D) {
      if (!R) {
        var W = new Error("Promise was rejected with a falsy value");
        W.reason = R, R = W;
      }
      return D(R);
    }
    function ee(R) {
      if (typeof R != "function")
        throw new TypeError('The "original" argument must be of type Function');
      function D() {
        for (var W = [], re = 0; re < arguments.length; re++)
          W.push(arguments[re]);
        var M = W.pop();
        if (typeof M != "function")
          throw new TypeError("The last argument must be of type Function");
        var $ = this, q = function() {
          return M.apply($, arguments);
        };
        R.apply(this, W).then(
          function(L) {
            we.nextTick(q.bind(null, null, L));
          },
          function(L) {
            we.nextTick(fe.bind(null, L, q));
          }
        );
      }
      return Object.setPrototypeOf(D, Object.getPrototypeOf(R)), Object.defineProperties(
        D,
        r(R)
      ), D;
    }
    e.callbackify = ee;
  }
}), qi = ce({
  "node_modules/assert/build/internal/errors.js"(e, r) {
    function t(d) {
      "@babel/helpers - typeof";
      return t = typeof Symbol == "function" && typeof Symbol.iterator == "symbol" ? function(E) {
        return typeof E;
      } : function(E) {
        return E && typeof Symbol == "function" && E.constructor === Symbol && E !== Symbol.prototype ? "symbol" : typeof E;
      }, t(d);
    }
    function n(d, E, O) {
      return Object.defineProperty(d, "prototype", { writable: !1 }), d;
    }
    function i(d, E) {
      if (!(d instanceof E))
        throw new TypeError("Cannot call a class as a function");
    }
    function s(d, E) {
      if (typeof E != "function" && E !== null)
        throw new TypeError("Super expression must either be null or a function");
      d.prototype = Object.create(E && E.prototype, { constructor: { value: d, writable: !0, configurable: !0 } }), Object.defineProperty(d, "prototype", { writable: !1 }), E && f(d, E);
    }
    function f(d, E) {
      return f = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function(T, F) {
        return T.__proto__ = F, T;
      }, f(d, E);
    }
    function u(d) {
      var E = A();
      return function() {
        var T = w(d), F;
        if (E) {
          var C = w(this).constructor;
          F = Reflect.construct(T, arguments, C);
        } else
          F = T.apply(this, arguments);
        return b(this, F);
      };
    }
    function b(d, E) {
      if (E && (t(E) === "object" || typeof E == "function"))
        return E;
      if (E !== void 0)
        throw new TypeError("Derived constructors may only return object or undefined");
      return g(d);
    }
    function g(d) {
      if (d === void 0)
        throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
      return d;
    }
    function A() {
      if (typeof Reflect > "u" || !Reflect.construct || Reflect.construct.sham) return !1;
      if (typeof Proxy == "function") return !0;
      try {
        return Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function() {
        })), !0;
      } catch {
        return !1;
      }
    }
    function w(d) {
      return w = Object.setPrototypeOf ? Object.getPrototypeOf.bind() : function(O) {
        return O.__proto__ || Object.getPrototypeOf(O);
      }, w(d);
    }
    var j = {}, P, x;
    function p(d, E, O) {
      O || (O = Error);
      function T(C, J, Z) {
        return typeof E == "string" ? E : E(C, J, Z);
      }
      var F = /* @__PURE__ */ (function(C) {
        s(Z, C);
        var J = u(Z);
        function Z(se, le, pe) {
          var me;
          return i(this, Z), me = J.call(this, T(se, le, pe)), me.code = d, me;
        }
        return n(Z);
      })(O);
      j[d] = F;
    }
    function y(d, E) {
      if (Array.isArray(d)) {
        var O = d.length;
        return d = d.map(function(T) {
          return String(T);
        }), O > 2 ? "one of ".concat(E, " ").concat(d.slice(0, O - 1).join(", "), ", or ") + d[O - 1] : O === 2 ? "one of ".concat(E, " ").concat(d[0], " or ").concat(d[1]) : "of ".concat(E, " ").concat(d[0]);
      } else
        return "of ".concat(E, " ").concat(String(d));
    }
    function m(d, E, O) {
      return d.substr(0, E.length) === E;
    }
    function S(d, E, O) {
      return (O === void 0 || O > d.length) && (O = d.length), d.substring(O - E.length, O) === E;
    }
    function _(d, E, O) {
      return typeof O != "number" && (O = 0), O + E.length > d.length ? !1 : d.indexOf(E, O) !== -1;
    }
    p("ERR_AMBIGUOUS_ARGUMENT", 'The "%s" argument is ambiguous. %s', TypeError), p("ERR_INVALID_ARG_TYPE", function(d, E, O) {
      P === void 0 && (P = Wr()), P(typeof d == "string", "'name' must be a string");
      var T;
      typeof E == "string" && m(E, "not ") ? (T = "must not be", E = E.replace(/^not /, "")) : T = "must be";
      var F;
      if (S(d, " argument"))
        F = "The ".concat(d, " ").concat(T, " ").concat(y(E, "type"));
      else {
        var C = _(d, ".") ? "property" : "argument";
        F = 'The "'.concat(d, '" ').concat(C, " ").concat(T, " ").concat(y(E, "type"));
      }
      return F += ". Received type ".concat(t(O)), F;
    }, TypeError), p("ERR_INVALID_ARG_VALUE", function(d, E) {
      var O = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : "is invalid";
      x === void 0 && (x = vt());
      var T = x.inspect(E);
      return T.length > 128 && (T = "".concat(T.slice(0, 128), "...")), "The argument '".concat(d, "' ").concat(O, ". Received ").concat(T);
    }, TypeError), p("ERR_INVALID_RETURN_VALUE", function(d, E, O) {
      var T;
      return O && O.constructor && O.constructor.name ? T = "instance of ".concat(O.constructor.name) : T = "type ".concat(t(O)), "Expected ".concat(d, ' to be returned from the "').concat(E, '"') + " function but got ".concat(T, ".");
    }, TypeError), p("ERR_MISSING_ARGS", function() {
      for (var d = arguments.length, E = new Array(d), O = 0; O < d; O++)
        E[O] = arguments[O];
      P === void 0 && (P = Wr()), P(E.length > 0, "At least one arg needs to be specified");
      var T = "The ", F = E.length;
      switch (E = E.map(function(C) {
        return '"'.concat(C, '"');
      }), F) {
        case 1:
          T += "".concat(E[0], " argument");
          break;
        case 2:
          T += "".concat(E[0], " and ").concat(E[1], " arguments");
          break;
        default:
          T += E.slice(0, F - 1).join(", "), T += ", and ".concat(E[F - 1], " arguments");
          break;
      }
      return "".concat(T, " must be specified");
    }, TypeError), r.exports.codes = j;
  }
}), Va = ce({
  "node_modules/assert/build/internal/assert/assertion_error.js"(e, r) {
    function t(ee, R) {
      var D = Object.keys(ee);
      if (Object.getOwnPropertySymbols) {
        var W = Object.getOwnPropertySymbols(ee);
        R && (W = W.filter(function(re) {
          return Object.getOwnPropertyDescriptor(ee, re).enumerable;
        })), D.push.apply(D, W);
      }
      return D;
    }
    function n(ee) {
      for (var R = 1; R < arguments.length; R++) {
        var D = arguments[R] != null ? arguments[R] : {};
        R % 2 ? t(Object(D), !0).forEach(function(W) {
          i(ee, W, D[W]);
        }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(ee, Object.getOwnPropertyDescriptors(D)) : t(Object(D)).forEach(function(W) {
          Object.defineProperty(ee, W, Object.getOwnPropertyDescriptor(D, W));
        });
      }
      return ee;
    }
    function i(ee, R, D) {
      return R = b(R), R in ee ? Object.defineProperty(ee, R, { value: D, enumerable: !0, configurable: !0, writable: !0 }) : ee[R] = D, ee;
    }
    function s(ee, R) {
      if (!(ee instanceof R))
        throw new TypeError("Cannot call a class as a function");
    }
    function f(ee, R) {
      for (var D = 0; D < R.length; D++) {
        var W = R[D];
        W.enumerable = W.enumerable || !1, W.configurable = !0, "value" in W && (W.writable = !0), Object.defineProperty(ee, b(W.key), W);
      }
    }
    function u(ee, R, D) {
      return R && f(ee.prototype, R), Object.defineProperty(ee, "prototype", { writable: !1 }), ee;
    }
    function b(ee) {
      var R = g(ee, "string");
      return d(R) === "symbol" ? R : String(R);
    }
    function g(ee, R) {
      if (d(ee) !== "object" || ee === null) return ee;
      var D = ee[Symbol.toPrimitive];
      if (D !== void 0) {
        var W = D.call(ee, R);
        if (d(W) !== "object") return W;
        throw new TypeError("@@toPrimitive must return a primitive value.");
      }
      return String(ee);
    }
    function A(ee, R) {
      if (typeof R != "function" && R !== null)
        throw new TypeError("Super expression must either be null or a function");
      ee.prototype = Object.create(R && R.prototype, { constructor: { value: ee, writable: !0, configurable: !0 } }), Object.defineProperty(ee, "prototype", { writable: !1 }), R && S(ee, R);
    }
    function w(ee) {
      var R = y();
      return function() {
        var W = _(ee), re;
        if (R) {
          var M = _(this).constructor;
          re = Reflect.construct(W, arguments, M);
        } else
          re = W.apply(this, arguments);
        return j(this, re);
      };
    }
    function j(ee, R) {
      if (R && (d(R) === "object" || typeof R == "function"))
        return R;
      if (R !== void 0)
        throw new TypeError("Derived constructors may only return object or undefined");
      return P(ee);
    }
    function P(ee) {
      if (ee === void 0)
        throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
      return ee;
    }
    function x(ee) {
      var R = typeof Map == "function" ? /* @__PURE__ */ new Map() : void 0;
      return x = function(W) {
        if (W === null || !m(W)) return W;
        if (typeof W != "function")
          throw new TypeError("Super expression must either be null or a function");
        if (typeof R < "u") {
          if (R.has(W)) return R.get(W);
          R.set(W, re);
        }
        function re() {
          return p(W, arguments, _(this).constructor);
        }
        return re.prototype = Object.create(W.prototype, { constructor: { value: re, enumerable: !1, writable: !0, configurable: !0 } }), S(re, W);
      }, x(ee);
    }
    function p(ee, R, D) {
      return y() ? p = Reflect.construct.bind() : p = function(re, M, $) {
        var q = [null];
        q.push.apply(q, M);
        var L = Function.bind.apply(re, q), G = new L();
        return $ && S(G, $.prototype), G;
      }, p.apply(null, arguments);
    }
    function y() {
      if (typeof Reflect > "u" || !Reflect.construct || Reflect.construct.sham) return !1;
      if (typeof Proxy == "function") return !0;
      try {
        return Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function() {
        })), !0;
      } catch {
        return !1;
      }
    }
    function m(ee) {
      return Function.toString.call(ee).indexOf("[native code]") !== -1;
    }
    function S(ee, R) {
      return S = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function(W, re) {
        return W.__proto__ = re, W;
      }, S(ee, R);
    }
    function _(ee) {
      return _ = Object.setPrototypeOf ? Object.getPrototypeOf.bind() : function(D) {
        return D.__proto__ || Object.getPrototypeOf(D);
      }, _(ee);
    }
    function d(ee) {
      "@babel/helpers - typeof";
      return d = typeof Symbol == "function" && typeof Symbol.iterator == "symbol" ? function(R) {
        return typeof R;
      } : function(R) {
        return R && typeof Symbol == "function" && R.constructor === Symbol && R !== Symbol.prototype ? "symbol" : typeof R;
      }, d(ee);
    }
    var E = vt(), O = E.inspect, T = qi(), F = T.codes.ERR_INVALID_ARG_TYPE;
    function C(ee, R, D) {
      return (D === void 0 || D > ee.length) && (D = ee.length), ee.substring(D - R.length, D) === R;
    }
    function J(ee, R) {
      if (R = Math.floor(R), ee.length == 0 || R == 0) return "";
      var D = ee.length * R;
      for (R = Math.floor(Math.log(R) / Math.log(2)); R; )
        ee += ee, R--;
      return ee += ee.substring(0, D - ee.length), ee;
    }
    var Z = "", se = "", le = "", pe = "", me = {
      deepStrictEqual: "Expected values to be strictly deep-equal:",
      strictEqual: "Expected values to be strictly equal:",
      strictEqualObject: 'Expected "actual" to be reference-equal to "expected":',
      deepEqual: "Expected values to be loosely deep-equal:",
      equal: "Expected values to be loosely equal:",
      notDeepStrictEqual: 'Expected "actual" not to be strictly deep-equal to:',
      notStrictEqual: 'Expected "actual" to be strictly unequal to:',
      notStrictEqualObject: 'Expected "actual" not to be reference-equal to "expected":',
      notDeepEqual: 'Expected "actual" not to be loosely deep-equal to:',
      notEqual: 'Expected "actual" to be loosely unequal to:',
      notIdentical: "Values identical but not reference-equal:"
    }, he = 10;
    function X(ee) {
      var R = Object.keys(ee), D = Object.create(Object.getPrototypeOf(ee));
      return R.forEach(function(W) {
        D[W] = ee[W];
      }), Object.defineProperty(D, "message", {
        value: ee.message
      }), D;
    }
    function te(ee) {
      return O(ee, {
        compact: !1,
        customInspect: !1,
        depth: 1e3,
        maxArrayLength: 1 / 0,
        // Assert compares only enumerable properties (with a few exceptions).
        showHidden: !1,
        // Having a long line as error is better than wrapping the line for
        // comparison for now.
        // TODO(BridgeAR): `breakLength` should be limited as soon as soon as we
        // have meta information about the inspected properties (i.e., know where
        // in what line the property starts and ends).
        breakLength: 1 / 0,
        // Assert does not detect proxies currently.
        showProxy: !1,
        sorted: !0,
        // Inspect getters as we also check them when comparing entries.
        getters: !0
      });
    }
    function ae(ee, R, D) {
      var W = "", re = "", M = 0, $ = "", q = !1, L = te(ee), G = L.split(`
`), Q = te(R).split(`
`), oe = 0, de = "";
      if (D === "strictEqual" && d(ee) === "object" && d(R) === "object" && ee !== null && R !== null && (D = "strictEqualObject"), G.length === 1 && Q.length === 1 && G[0] !== Q[0]) {
        var ge = G[0].length + Q[0].length;
        if (ge <= he) {
          if ((d(ee) !== "object" || ee === null) && (d(R) !== "object" || R === null) && (ee !== 0 || R !== 0))
            return "".concat(me[D], `

`) + "".concat(G[0], " !== ").concat(Q[0], `
`);
        } else if (D !== "strictEqualObject") {
          var ye = we.stderr && we.stderr.isTTY ? we.stderr.columns : 80;
          if (ge < ye) {
            for (; G[0][oe] === Q[0][oe]; )
              oe++;
            oe > 2 && (de = `
  `.concat(J(" ", oe), "^"), oe = 0);
          }
        }
      }
      for (var be = G[G.length - 1], Oe = Q[Q.length - 1]; be === Oe && (oe++ < 2 ? $ = `
  `.concat(be).concat($) : W = be, G.pop(), Q.pop(), !(G.length === 0 || Q.length === 0)); )
        be = G[G.length - 1], Oe = Q[Q.length - 1];
      var _e = Math.max(G.length, Q.length);
      if (_e === 0) {
        var ie = L.split(`
`);
        if (ie.length > 30)
          for (ie[26] = "".concat(Z, "...").concat(pe); ie.length > 27; )
            ie.pop();
        return "".concat(me.notIdentical, `

`).concat(ie.join(`
`), `
`);
      }
      oe > 3 && ($ = `
`.concat(Z, "...").concat(pe).concat($), q = !0), W !== "" && ($ = `
  `.concat(W).concat($), W = "");
      var Re = 0, xe = me[D] + `
`.concat(se, "+ actual").concat(pe, " ").concat(le, "- expected").concat(pe), Ae = " ".concat(Z, "...").concat(pe, " Lines skipped");
      for (oe = 0; oe < _e; oe++) {
        var Ee = oe - M;
        if (G.length < oe + 1)
          Ee > 1 && oe > 2 && (Ee > 4 ? (re += `
`.concat(Z, "...").concat(pe), q = !0) : Ee > 3 && (re += `
  `.concat(Q[oe - 2]), Re++), re += `
  `.concat(Q[oe - 1]), Re++), M = oe, W += `
`.concat(le, "-").concat(pe, " ").concat(Q[oe]), Re++;
        else if (Q.length < oe + 1)
          Ee > 1 && oe > 2 && (Ee > 4 ? (re += `
`.concat(Z, "...").concat(pe), q = !0) : Ee > 3 && (re += `
  `.concat(G[oe - 2]), Re++), re += `
  `.concat(G[oe - 1]), Re++), M = oe, re += `
`.concat(se, "+").concat(pe, " ").concat(G[oe]), Re++;
        else {
          var Ne = Q[oe], ke = G[oe], K = ke !== Ne && (!C(ke, ",") || ke.slice(0, -1) !== Ne);
          K && C(Ne, ",") && Ne.slice(0, -1) === ke && (K = !1, ke += ","), K ? (Ee > 1 && oe > 2 && (Ee > 4 ? (re += `
`.concat(Z, "...").concat(pe), q = !0) : Ee > 3 && (re += `
  `.concat(G[oe - 2]), Re++), re += `
  `.concat(G[oe - 1]), Re++), M = oe, re += `
`.concat(se, "+").concat(pe, " ").concat(ke), W += `
`.concat(le, "-").concat(pe, " ").concat(Ne), Re += 2) : (re += W, W = "", (Ee === 1 || oe === 0) && (re += `
  `.concat(ke), Re++));
        }
        if (Re > 20 && oe < _e - 2)
          return "".concat(xe).concat(Ae, `
`).concat(re, `
`).concat(Z, "...").concat(pe).concat(W, `
`) + "".concat(Z, "...").concat(pe);
      }
      return "".concat(xe).concat(q ? Ae : "", `
`).concat(re).concat(W).concat($).concat(de);
    }
    var fe = /* @__PURE__ */ (function(ee, R) {
      A(W, ee);
      var D = w(W);
      function W(re) {
        var M;
        if (s(this, W), d(re) !== "object" || re === null)
          throw new F("options", "Object", re);
        var $ = re.message, q = re.operator, L = re.stackStartFn, G = re.actual, Q = re.expected, oe = Error.stackTraceLimit;
        if (Error.stackTraceLimit = 0, $ != null)
          M = D.call(this, String($));
        else if (we.stderr && we.stderr.isTTY && (we.stderr && we.stderr.getColorDepth && we.stderr.getColorDepth() !== 1 ? (Z = "\x1B[34m", se = "\x1B[32m", pe = "\x1B[39m", le = "\x1B[31m") : (Z = "", se = "", pe = "", le = "")), d(G) === "object" && G !== null && d(Q) === "object" && Q !== null && "stack" in G && G instanceof Error && "stack" in Q && Q instanceof Error && (G = X(G), Q = X(Q)), q === "deepStrictEqual" || q === "strictEqual")
          M = D.call(this, ae(G, Q, q));
        else if (q === "notDeepStrictEqual" || q === "notStrictEqual") {
          var de = me[q], ge = te(G).split(`
`);
          if (q === "notStrictEqual" && d(G) === "object" && G !== null && (de = me.notStrictEqualObject), ge.length > 30)
            for (ge[26] = "".concat(Z, "...").concat(pe); ge.length > 27; )
              ge.pop();
          ge.length === 1 ? M = D.call(this, "".concat(de, " ").concat(ge[0])) : M = D.call(this, "".concat(de, `

`).concat(ge.join(`
`), `
`));
        } else {
          var ye = te(G), be = "", Oe = me[q];
          q === "notDeepEqual" || q === "notEqual" ? (ye = "".concat(me[q], `

`).concat(ye), ye.length > 1024 && (ye = "".concat(ye.slice(0, 1021), "..."))) : (be = "".concat(te(Q)), ye.length > 512 && (ye = "".concat(ye.slice(0, 509), "...")), be.length > 512 && (be = "".concat(be.slice(0, 509), "...")), q === "deepEqual" || q === "equal" ? ye = "".concat(Oe, `

`).concat(ye, `

should equal

`) : be = " ".concat(q, " ").concat(be)), M = D.call(this, "".concat(ye).concat(be));
        }
        return Error.stackTraceLimit = oe, M.generatedMessage = !$, Object.defineProperty(P(M), "name", {
          value: "AssertionError [ERR_ASSERTION]",
          enumerable: !1,
          writable: !0,
          configurable: !0
        }), M.code = "ERR_ASSERTION", M.actual = G, M.expected = Q, M.operator = q, Error.captureStackTrace && Error.captureStackTrace(P(M), L), M.stack, M.name = "AssertionError", j(M);
      }
      return u(W, [{
        key: "toString",
        value: function() {
          return "".concat(this.name, " [").concat(this.code, "]: ").concat(this.message);
        }
      }, {
        key: R,
        value: function(M, $) {
          return O(this, n(n({}, $), {}, {
            customInspect: !1,
            depth: 0
          }));
        }
      }]), W;
    })(/* @__PURE__ */ x(Error), O.custom);
    r.exports = fe;
  }
}), Wi = ce({
  "node_modules/object-keys/isArguments.js"(e, r) {
    var t = Object.prototype.toString;
    r.exports = function(i) {
      var s = t.call(i), f = s === "[object Arguments]";
      return f || (f = s !== "[object Array]" && i !== null && typeof i == "object" && typeof i.length == "number" && i.length >= 0 && t.call(i.callee) === "[object Function]"), f;
    };
  }
}), Ga = ce({
  "node_modules/object-keys/implementation.js"(e, r) {
    var t;
    Object.keys || (n = Object.prototype.hasOwnProperty, i = Object.prototype.toString, s = Wi(), f = Object.prototype.propertyIsEnumerable, u = !f.call({ toString: null }, "toString"), b = f.call(function() {
    }, "prototype"), g = [
      "toString",
      "toLocaleString",
      "valueOf",
      "hasOwnProperty",
      "isPrototypeOf",
      "propertyIsEnumerable",
      "constructor"
    ], A = function(x) {
      var p = x.constructor;
      return p && p.prototype === x;
    }, w = {
      $applicationCache: !0,
      $console: !0,
      $external: !0,
      $frame: !0,
      $frameElement: !0,
      $frames: !0,
      $innerHeight: !0,
      $innerWidth: !0,
      $onmozfullscreenchange: !0,
      $onmozfullscreenerror: !0,
      $outerHeight: !0,
      $outerWidth: !0,
      $pageXOffset: !0,
      $pageYOffset: !0,
      $parent: !0,
      $scrollLeft: !0,
      $scrollTop: !0,
      $scrollX: !0,
      $scrollY: !0,
      $self: !0,
      $webkitIndexedDB: !0,
      $webkitStorageInfo: !0,
      $window: !0
    }, j = (function() {
      if (typeof window > "u")
        return !1;
      for (var x in window)
        try {
          if (!w["$" + x] && n.call(window, x) && window[x] !== null && typeof window[x] == "object")
            try {
              A(window[x]);
            } catch {
              return !0;
            }
        } catch {
          return !0;
        }
      return !1;
    })(), P = function(x) {
      if (typeof window > "u" || !j)
        return A(x);
      try {
        return A(x);
      } catch {
        return !1;
      }
    }, t = function(p) {
      var y = p !== null && typeof p == "object", m = i.call(p) === "[object Function]", S = s(p), _ = y && i.call(p) === "[object String]", d = [];
      if (!y && !m && !S)
        throw new TypeError("Object.keys called on a non-object");
      var E = b && m;
      if (_ && p.length > 0 && !n.call(p, 0))
        for (var O = 0; O < p.length; ++O)
          d.push(String(O));
      if (S && p.length > 0)
        for (var T = 0; T < p.length; ++T)
          d.push(String(T));
      else
        for (var F in p)
          !(E && F === "prototype") && n.call(p, F) && d.push(String(F));
      if (u)
        for (var C = P(p), J = 0; J < g.length; ++J)
          !(C && g[J] === "constructor") && n.call(p, g[J]) && d.push(g[J]);
      return d;
    });
    var n, i, s, f, u, b, g, A, w, j, P;
    r.exports = t;
  }
}), $i = ce({
  "node_modules/object-keys/index.js"(e, r) {
    var t = Array.prototype.slice, n = Wi(), i = Object.keys, s = i ? function(b) {
      return i(b);
    } : Ga(), f = Object.keys;
    s.shim = function() {
      if (Object.keys) {
        var b = (function() {
          var g = Object.keys(arguments);
          return g && g.length === arguments.length;
        })(1, 2);
        b || (Object.keys = function(A) {
          return n(A) ? f(t.call(A)) : f(A);
        });
      } else
        Object.keys = s;
      return Object.keys || s;
    }, r.exports = s;
  }
}), Ha = ce({
  "node_modules/call-bound/index.js"(e, r) {
    var t = on(), n = nn(), i = n([t("%String.prototype.indexOf%")]);
    r.exports = function(f, u) {
      var b = (
        /** @type {(this: unknown, ...args: unknown[]) => unknown} */
        t(f, !!u)
      );
      return typeof b == "function" && i(f, ".prototype.") > -1 ? n(
        /** @type {const} */
        [b]
      ) : b;
    };
  }
}), Ya = ce({
  "node_modules/object.assign/implementation.js"(e, r) {
    var t = $i(), n = zr()(), i = Ha(), s = en(), f = i("Array.prototype.push"), u = i("Object.prototype.propertyIsEnumerable"), b = n ? s.getOwnPropertySymbols : null;
    r.exports = function(A, w) {
      if (A == null)
        throw new TypeError("target must be an object");
      var j = s(A);
      if (arguments.length === 1)
        return j;
      for (var P = 1; P < arguments.length; ++P) {
        var x = s(arguments[P]), p = t(x), y = n && (s.getOwnPropertySymbols || b);
        if (y)
          for (var m = y(x), S = 0; S < m.length; ++S) {
            var _ = m[S];
            u(x, _) && f(p, _);
          }
        for (var d = 0; d < p.length; ++d) {
          var E = p[d];
          if (u(x, E)) {
            var O = x[E];
            j[E] = O;
          }
        }
      }
      return j;
    };
  }
}), Ka = ce({
  "node_modules/object.assign/polyfill.js"(e, r) {
    var t = Ya(), n = function() {
      if (!Object.assign)
        return !1;
      for (var s = "abcdefghijklmnopqrst", f = s.split(""), u = {}, b = 0; b < f.length; ++b)
        u[f[b]] = f[b];
      var g = Object.assign({}, u), A = "";
      for (var w in g)
        A += w;
      return s !== A;
    }, i = function() {
      if (!Object.assign || !Object.preventExtensions)
        return !1;
      var s = Object.preventExtensions({ 1: 2 });
      try {
        Object.assign(s, "xy");
      } catch {
        return s[1] === "y";
      }
      return !1;
    };
    r.exports = function() {
      return !Object.assign || n() || i() ? t : Object.assign;
    };
  }
}), Vi = ce({
  "node_modules/object-is/implementation.js"(e, r) {
    var t = function(n) {
      return n !== n;
    };
    r.exports = function(i, s) {
      return i === 0 && s === 0 ? 1 / i === 1 / s : !!(i === s || t(i) && t(s));
    };
  }
}), an = ce({
  "node_modules/object-is/polyfill.js"(e, r) {
    var t = Vi();
    r.exports = function() {
      return typeof Object.is == "function" ? Object.is : t;
    };
  }
}), vr = ce({
  "node_modules/define-properties/index.js"(e, r) {
    var t = $i(), n = typeof Symbol == "function" && typeof Symbol("foo") == "symbol", i = Object.prototype.toString, s = Array.prototype.concat, f = Li(), u = function(w) {
      return typeof w == "function" && i.call(w) === "[object Function]";
    }, b = Ui()(), g = function(w, j, P, x) {
      if (j in w) {
        if (x === !0) {
          if (w[j] === P)
            return;
        } else if (!u(x) || !x())
          return;
      }
      b ? f(w, j, P, !0) : f(w, j, P);
    }, A = function(w, j) {
      var P = arguments.length > 2 ? arguments[2] : {}, x = t(j);
      n && (x = s.call(x, Object.getOwnPropertySymbols(j)));
      for (var p = 0; p < x.length; p += 1)
        g(w, x[p], j[x[p]], P[x[p]]);
    };
    A.supportsDescriptors = !!b, r.exports = A;
  }
}), Xa = ce({
  "node_modules/object-is/shim.js"(e, r) {
    var t = an(), n = vr();
    r.exports = function() {
      var s = t();
      return n(Object, { is: s }, {
        is: function() {
          return Object.is !== s;
        }
      }), s;
    };
  }
}), Ja = ce({
  "node_modules/object-is/index.js"(e, r) {
    var t = vr(), n = gr(), i = Vi(), s = an(), f = Xa(), u = n(s(), Object);
    t(u, {
      getPolyfill: s,
      implementation: i,
      shim: f
    }), r.exports = u;
  }
}), Gi = ce({
  "node_modules/is-nan/implementation.js"(e, r) {
    r.exports = function(n) {
      return n !== n;
    };
  }
}), Hi = ce({
  "node_modules/is-nan/polyfill.js"(e, r) {
    var t = Gi();
    r.exports = function() {
      return Number.isNaN && Number.isNaN(NaN) && !Number.isNaN("a") ? Number.isNaN : t;
    };
  }
}), Za = ce({
  "node_modules/is-nan/shim.js"(e, r) {
    var t = vr(), n = Hi();
    r.exports = function() {
      var s = n();
      return t(Number, { isNaN: s }, {
        isNaN: function() {
          return Number.isNaN !== s;
        }
      }), s;
    };
  }
}), za = ce({
  "node_modules/is-nan/index.js"(e, r) {
    var t = gr(), n = vr(), i = Gi(), s = Hi(), f = Za(), u = t(s(), Number);
    n(u, {
      getPolyfill: s,
      implementation: i,
      shim: f
    }), r.exports = u;
  }
}), Qa = ce({
  "node_modules/assert/build/internal/util/comparisons.js"(e, r) {
    function t(K, h) {
      return u(K) || f(K, h) || i(K, h) || n();
    }
    function n() {
      throw new TypeError(`Invalid attempt to destructure non-iterable instance.
In order to be iterable, non-array objects must have a [Symbol.iterator]() method.`);
    }
    function i(K, h) {
      if (K) {
        if (typeof K == "string") return s(K, h);
        var o = Object.prototype.toString.call(K).slice(8, -1);
        if (o === "Object" && K.constructor && (o = K.constructor.name), o === "Map" || o === "Set") return Array.from(K);
        if (o === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(o)) return s(K, h);
      }
    }
    function s(K, h) {
      (h == null || h > K.length) && (h = K.length);
      for (var o = 0, c = new Array(h); o < h; o++) c[o] = K[o];
      return c;
    }
    function f(K, h) {
      var o = K == null ? null : typeof Symbol < "u" && K[Symbol.iterator] || K["@@iterator"];
      if (o != null) {
        var c, k, B, H, z = [], V = !0, U = !1;
        try {
          if (B = (o = o.call(K)).next, h !== 0) for (; !(V = (c = B.call(o)).done) && (z.push(c.value), z.length !== h); V = !0) ;
        } catch (a) {
          U = !0, k = a;
        } finally {
          try {
            if (!V && o.return != null && (H = o.return(), Object(H) !== H)) return;
          } finally {
            if (U) throw k;
          }
        }
        return z;
      }
    }
    function u(K) {
      if (Array.isArray(K)) return K;
    }
    function b(K) {
      "@babel/helpers - typeof";
      return b = typeof Symbol == "function" && typeof Symbol.iterator == "symbol" ? function(h) {
        return typeof h;
      } : function(h) {
        return h && typeof Symbol == "function" && h.constructor === Symbol && h !== Symbol.prototype ? "symbol" : typeof h;
      }, b(K);
    }
    var g = /a/g.flags !== void 0, A = function(h) {
      var o = [];
      return h.forEach(function(c) {
        return o.push(c);
      }), o;
    }, w = function(h) {
      var o = [];
      return h.forEach(function(c, k) {
        return o.push([k, c]);
      }), o;
    }, j = Object.is ? Object.is : Ja(), P = Object.getOwnPropertySymbols ? Object.getOwnPropertySymbols : function() {
      return [];
    }, x = Number.isNaN ? Number.isNaN : za();
    function p(K) {
      return K.call.bind(K);
    }
    var y = p(Object.prototype.hasOwnProperty), m = p(Object.prototype.propertyIsEnumerable), S = p(Object.prototype.toString), _ = vt().types, d = _.isAnyArrayBuffer, E = _.isArrayBufferView, O = _.isDate, T = _.isMap, F = _.isRegExp, C = _.isSet, J = _.isNativeError, Z = _.isBoxedPrimitive, se = _.isNumberObject, le = _.isStringObject, pe = _.isBooleanObject, me = _.isBigIntObject, he = _.isSymbolObject, X = _.isFloat32Array, te = _.isFloat64Array;
    function ae(K) {
      if (K.length === 0 || K.length > 10) return !0;
      for (var h = 0; h < K.length; h++) {
        var o = K.charCodeAt(h);
        if (o < 48 || o > 57) return !0;
      }
      return K.length === 10 && K >= Math.pow(2, 32);
    }
    function fe(K) {
      return Object.keys(K).filter(ae).concat(P(K).filter(Object.prototype.propertyIsEnumerable.bind(K)));
    }
    function ee(K, h) {
      if (K === h)
        return 0;
      for (var o = K.length, c = h.length, k = 0, B = Math.min(o, c); k < B; ++k)
        if (K[k] !== h[k]) {
          o = K[k], c = h[k];
          break;
        }
      return o < c ? -1 : c < o ? 1 : 0;
    }
    var R = !0, D = !1, W = 0, re = 1, M = 2, $ = 3;
    function q(K, h) {
      return g ? K.source === h.source && K.flags === h.flags : RegExp.prototype.toString.call(K) === RegExp.prototype.toString.call(h);
    }
    function L(K, h) {
      if (K.byteLength !== h.byteLength)
        return !1;
      for (var o = 0; o < K.byteLength; o++)
        if (K[o] !== h[o])
          return !1;
      return !0;
    }
    function G(K, h) {
      return K.byteLength !== h.byteLength ? !1 : ee(new Uint8Array(K.buffer, K.byteOffset, K.byteLength), new Uint8Array(h.buffer, h.byteOffset, h.byteLength)) === 0;
    }
    function Q(K, h) {
      return K.byteLength === h.byteLength && ee(new Uint8Array(K), new Uint8Array(h)) === 0;
    }
    function oe(K, h) {
      return se(K) ? se(h) && j(Number.prototype.valueOf.call(K), Number.prototype.valueOf.call(h)) : le(K) ? le(h) && String.prototype.valueOf.call(K) === String.prototype.valueOf.call(h) : pe(K) ? pe(h) && Boolean.prototype.valueOf.call(K) === Boolean.prototype.valueOf.call(h) : me(K) ? me(h) && BigInt.prototype.valueOf.call(K) === BigInt.prototype.valueOf.call(h) : he(h) && Symbol.prototype.valueOf.call(K) === Symbol.prototype.valueOf.call(h);
    }
    function de(K, h, o, c) {
      if (K === h)
        return K !== 0 ? !0 : o ? j(K, h) : !0;
      if (o) {
        if (b(K) !== "object")
          return typeof K == "number" && x(K) && x(h);
        if (b(h) !== "object" || K === null || h === null || Object.getPrototypeOf(K) !== Object.getPrototypeOf(h))
          return !1;
      } else {
        if (K === null || b(K) !== "object")
          return h === null || b(h) !== "object" ? K == h : !1;
        if (h === null || b(h) !== "object")
          return !1;
      }
      var k = S(K), B = S(h);
      if (k !== B)
        return !1;
      if (Array.isArray(K)) {
        if (K.length !== h.length)
          return !1;
        var H = fe(K), z = fe(h);
        return H.length !== z.length ? !1 : ye(K, h, o, c, re, H);
      }
      if (k === "[object Object]" && (!T(K) && T(h) || !C(K) && C(h)))
        return !1;
      if (O(K)) {
        if (!O(h) || Date.prototype.getTime.call(K) !== Date.prototype.getTime.call(h))
          return !1;
      } else if (F(K)) {
        if (!F(h) || !q(K, h))
          return !1;
      } else if (J(K) || K instanceof Error) {
        if (K.message !== h.message || K.name !== h.name)
          return !1;
      } else if (E(K)) {
        if (!o && (X(K) || te(K))) {
          if (!L(K, h))
            return !1;
        } else if (!G(K, h))
          return !1;
        var V = fe(K), U = fe(h);
        return V.length !== U.length ? !1 : ye(K, h, o, c, W, V);
      } else {
        if (C(K))
          return !C(h) || K.size !== h.size ? !1 : ye(K, h, o, c, M);
        if (T(K))
          return !T(h) || K.size !== h.size ? !1 : ye(K, h, o, c, $);
        if (d(K)) {
          if (!Q(K, h))
            return !1;
        } else if (Z(K) && !oe(K, h))
          return !1;
      }
      return ye(K, h, o, c, W);
    }
    function ge(K, h) {
      return h.filter(function(o) {
        return m(K, o);
      });
    }
    function ye(K, h, o, c, k, B) {
      if (arguments.length === 5) {
        B = Object.keys(K);
        var H = Object.keys(h);
        if (B.length !== H.length)
          return !1;
      }
      for (var z = 0; z < B.length; z++)
        if (!y(h, B[z]))
          return !1;
      if (o && arguments.length === 5) {
        var V = P(K);
        if (V.length !== 0) {
          var U = 0;
          for (z = 0; z < V.length; z++) {
            var a = V[z];
            if (m(K, a)) {
              if (!m(h, a))
                return !1;
              B.push(a), U++;
            } else if (m(h, a))
              return !1;
          }
          var l = P(h);
          if (V.length !== l.length && ge(h, l).length !== U)
            return !1;
        } else {
          var v = P(h);
          if (v.length !== 0 && ge(h, v).length !== 0)
            return !1;
        }
      }
      if (B.length === 0 && (k === W || k === re && K.length === 0 || K.size === 0))
        return !0;
      if (c === void 0)
        c = {
          val1: /* @__PURE__ */ new Map(),
          val2: /* @__PURE__ */ new Map(),
          position: 0
        };
      else {
        var I = c.val1.get(K);
        if (I !== void 0) {
          var N = c.val2.get(h);
          if (N !== void 0)
            return I === N;
        }
        c.position++;
      }
      c.val1.set(K, c.position), c.val2.set(h, c.position);
      var Y = Ee(K, h, o, B, c, k);
      return c.val1.delete(K), c.val2.delete(h), Y;
    }
    function be(K, h, o, c) {
      for (var k = A(K), B = 0; B < k.length; B++) {
        var H = k[B];
        if (de(h, H, o, c))
          return K.delete(H), !0;
      }
      return !1;
    }
    function Oe(K) {
      switch (b(K)) {
        case "undefined":
          return null;
        case "object":
          return;
        case "symbol":
          return !1;
        case "string":
          K = +K;
        // Loose equal entries exist only if the string is possible to convert to
        // a regular number and not NaN.
        // Fall through
        case "number":
          if (x(K))
            return !1;
      }
      return !0;
    }
    function _e(K, h, o) {
      var c = Oe(o);
      return c ?? (h.has(c) && !K.has(c));
    }
    function ie(K, h, o, c, k) {
      var B = Oe(o);
      if (B != null)
        return B;
      var H = h.get(B);
      return H === void 0 && !h.has(B) || !de(c, H, !1, k) ? !1 : !K.has(B) && de(c, H, !1, k);
    }
    function Re(K, h, o, c) {
      for (var k = null, B = A(K), H = 0; H < B.length; H++) {
        var z = B[H];
        if (b(z) === "object" && z !== null)
          k === null && (k = /* @__PURE__ */ new Set()), k.add(z);
        else if (!h.has(z)) {
          if (o || !_e(K, h, z))
            return !1;
          k === null && (k = /* @__PURE__ */ new Set()), k.add(z);
        }
      }
      if (k !== null) {
        for (var V = A(h), U = 0; U < V.length; U++) {
          var a = V[U];
          if (b(a) === "object" && a !== null) {
            if (!be(k, a, o, c)) return !1;
          } else if (!o && !K.has(a) && !be(k, a, o, c))
            return !1;
        }
        return k.size === 0;
      }
      return !0;
    }
    function xe(K, h, o, c, k, B) {
      for (var H = A(K), z = 0; z < H.length; z++) {
        var V = H[z];
        if (de(o, V, k, B) && de(c, h.get(V), k, B))
          return K.delete(V), !0;
      }
      return !1;
    }
    function Ae(K, h, o, c) {
      for (var k = null, B = w(K), H = 0; H < B.length; H++) {
        var z = t(B[H], 2), V = z[0], U = z[1];
        if (b(V) === "object" && V !== null)
          k === null && (k = /* @__PURE__ */ new Set()), k.add(V);
        else {
          var a = h.get(V);
          if (a === void 0 && !h.has(V) || !de(U, a, o, c)) {
            if (o || !ie(K, h, V, U, c)) return !1;
            k === null && (k = /* @__PURE__ */ new Set()), k.add(V);
          }
        }
      }
      if (k !== null) {
        for (var l = w(h), v = 0; v < l.length; v++) {
          var I = t(l[v], 2), N = I[0], Y = I[1];
          if (b(N) === "object" && N !== null) {
            if (!xe(k, K, N, Y, o, c)) return !1;
          } else if (!o && (!K.has(N) || !de(K.get(N), Y, !1, c)) && !xe(k, K, N, Y, !1, c))
            return !1;
        }
        return k.size === 0;
      }
      return !0;
    }
    function Ee(K, h, o, c, k, B) {
      var H = 0;
      if (B === M) {
        if (!Re(K, h, o, k))
          return !1;
      } else if (B === $) {
        if (!Ae(K, h, o, k))
          return !1;
      } else if (B === re)
        for (; H < K.length; H++)
          if (y(K, H)) {
            if (!y(h, H) || !de(K[H], h[H], o, k))
              return !1;
          } else {
            if (y(h, H))
              return !1;
            for (var z = Object.keys(K); H < z.length; H++) {
              var V = z[H];
              if (!y(h, V) || !de(K[V], h[V], o, k))
                return !1;
            }
            return z.length === Object.keys(h).length;
          }
      for (H = 0; H < c.length; H++) {
        var U = c[H];
        if (!de(K[U], h[U], o, k))
          return !1;
      }
      return !0;
    }
    function Ne(K, h) {
      return de(K, h, D);
    }
    function ke(K, h) {
      return de(K, h, R);
    }
    r.exports = {
      isDeepEqual: Ne,
      isDeepStrictEqual: ke
    };
  }
}), Wr = ce({
  "node_modules/assert/build/assert.js"(e, r) {
    function t(M) {
      "@babel/helpers - typeof";
      return t = typeof Symbol == "function" && typeof Symbol.iterator == "symbol" ? function($) {
        return typeof $;
      } : function($) {
        return $ && typeof Symbol == "function" && $.constructor === Symbol && $ !== Symbol.prototype ? "symbol" : typeof $;
      }, t(M);
    }
    function n(M, $, q) {
      return Object.defineProperty(M, "prototype", { writable: !1 }), M;
    }
    function i(M, $) {
      if (!(M instanceof $))
        throw new TypeError("Cannot call a class as a function");
    }
    var s = qi(), f = s.codes, u = f.ERR_AMBIGUOUS_ARGUMENT, b = f.ERR_INVALID_ARG_TYPE, g = f.ERR_INVALID_ARG_VALUE, A = f.ERR_INVALID_RETURN_VALUE, w = f.ERR_MISSING_ARGS, j = Va(), P = vt(), x = P.inspect, p = vt().types, y = p.isPromise, m = p.isRegExp, S = Ka()(), _ = an()(), d = sn()("RegExp.prototype.test"), E, O;
    function T() {
      var M = Qa();
      E = M.isDeepEqual, O = M.isDeepStrictEqual;
    }
    var F = !1, C = r.exports = pe, J = {};
    function Z(M) {
      throw M.message instanceof Error ? M.message : new j(M);
    }
    function se(M, $, q, L, G) {
      var Q = arguments.length, oe;
      if (Q === 0)
        oe = "Failed";
      else if (Q === 1)
        q = M, M = void 0;
      else {
        if (F === !1) {
          F = !0;
          var de = we.emitWarning ? we.emitWarning : console.warn.bind(console);
          de("assert.fail() with more than one argument is deprecated. Please use assert.strictEqual() instead or only pass a message.", "DeprecationWarning", "DEP0094");
        }
        Q === 2 && (L = "!=");
      }
      if (q instanceof Error) throw q;
      var ge = {
        actual: M,
        expected: $,
        operator: L === void 0 ? "fail" : L,
        stackStartFn: G || se
      };
      q !== void 0 && (ge.message = q);
      var ye = new j(ge);
      throw oe && (ye.message = oe, ye.generatedMessage = !0), ye;
    }
    C.fail = se, C.AssertionError = j;
    function le(M, $, q, L) {
      if (!q) {
        var G = !1;
        if ($ === 0)
          G = !0, L = "No value argument passed to `assert.ok()`";
        else if (L instanceof Error)
          throw L;
        var Q = new j({
          actual: q,
          expected: !0,
          message: L,
          operator: "==",
          stackStartFn: M
        });
        throw Q.generatedMessage = G, Q;
      }
    }
    function pe() {
      for (var M = arguments.length, $ = new Array(M), q = 0; q < M; q++)
        $[q] = arguments[q];
      le.apply(void 0, [pe, $.length].concat($));
    }
    C.ok = pe, C.equal = function M($, q, L) {
      if (arguments.length < 2)
        throw new w("actual", "expected");
      $ != q && Z({
        actual: $,
        expected: q,
        message: L,
        operator: "==",
        stackStartFn: M
      });
    }, C.notEqual = function M($, q, L) {
      if (arguments.length < 2)
        throw new w("actual", "expected");
      $ == q && Z({
        actual: $,
        expected: q,
        message: L,
        operator: "!=",
        stackStartFn: M
      });
    }, C.deepEqual = function M($, q, L) {
      if (arguments.length < 2)
        throw new w("actual", "expected");
      E === void 0 && T(), E($, q) || Z({
        actual: $,
        expected: q,
        message: L,
        operator: "deepEqual",
        stackStartFn: M
      });
    }, C.notDeepEqual = function M($, q, L) {
      if (arguments.length < 2)
        throw new w("actual", "expected");
      E === void 0 && T(), E($, q) && Z({
        actual: $,
        expected: q,
        message: L,
        operator: "notDeepEqual",
        stackStartFn: M
      });
    }, C.deepStrictEqual = function M($, q, L) {
      if (arguments.length < 2)
        throw new w("actual", "expected");
      E === void 0 && T(), O($, q) || Z({
        actual: $,
        expected: q,
        message: L,
        operator: "deepStrictEqual",
        stackStartFn: M
      });
    }, C.notDeepStrictEqual = me;
    function me(M, $, q) {
      if (arguments.length < 2)
        throw new w("actual", "expected");
      E === void 0 && T(), O(M, $) && Z({
        actual: M,
        expected: $,
        message: q,
        operator: "notDeepStrictEqual",
        stackStartFn: me
      });
    }
    C.strictEqual = function M($, q, L) {
      if (arguments.length < 2)
        throw new w("actual", "expected");
      _($, q) || Z({
        actual: $,
        expected: q,
        message: L,
        operator: "strictEqual",
        stackStartFn: M
      });
    }, C.notStrictEqual = function M($, q, L) {
      if (arguments.length < 2)
        throw new w("actual", "expected");
      _($, q) && Z({
        actual: $,
        expected: q,
        message: L,
        operator: "notStrictEqual",
        stackStartFn: M
      });
    };
    var he = /* @__PURE__ */ n(function M($, q, L) {
      var G = this;
      i(this, M), q.forEach(function(Q) {
        Q in $ && (L !== void 0 && typeof L[Q] == "string" && m($[Q]) && d($[Q], L[Q]) ? G[Q] = L[Q] : G[Q] = $[Q]);
      });
    });
    function X(M, $, q, L, G, Q) {
      if (!(q in M) || !O(M[q], $[q])) {
        if (!L) {
          var oe = new he(M, G), de = new he($, G, M), ge = new j({
            actual: oe,
            expected: de,
            operator: "deepStrictEqual",
            stackStartFn: Q
          });
          throw ge.actual = M, ge.expected = $, ge.operator = Q.name, ge;
        }
        Z({
          actual: M,
          expected: $,
          message: L,
          operator: Q.name,
          stackStartFn: Q
        });
      }
    }
    function te(M, $, q, L) {
      if (typeof $ != "function") {
        if (m($)) return d($, M);
        if (arguments.length === 2)
          throw new b("expected", ["Function", "RegExp"], $);
        if (t(M) !== "object" || M === null) {
          var G = new j({
            actual: M,
            expected: $,
            message: q,
            operator: "deepStrictEqual",
            stackStartFn: L
          });
          throw G.operator = L.name, G;
        }
        var Q = Object.keys($);
        if ($ instanceof Error)
          Q.push("name", "message");
        else if (Q.length === 0)
          throw new g("error", $, "may not be an empty object");
        return E === void 0 && T(), Q.forEach(function(oe) {
          typeof M[oe] == "string" && m($[oe]) && d($[oe], M[oe]) || X(M, $, oe, q, Q, L);
        }), !0;
      }
      return $.prototype !== void 0 && M instanceof $ ? !0 : Error.isPrototypeOf($) ? !1 : $.call({}, M) === !0;
    }
    function ae(M) {
      if (typeof M != "function")
        throw new b("fn", "Function", M);
      try {
        M();
      } catch ($) {
        return $;
      }
      return J;
    }
    function fe(M) {
      return y(M) || M !== null && t(M) === "object" && typeof M.then == "function" && typeof M.catch == "function";
    }
    function ee(M) {
      return Promise.resolve().then(function() {
        var $;
        if (typeof M == "function") {
          if ($ = M(), !fe($))
            throw new A("instance of Promise", "promiseFn", $);
        } else if (fe(M))
          $ = M;
        else
          throw new b("promiseFn", ["Function", "Promise"], M);
        return Promise.resolve().then(function() {
          return $;
        }).then(function() {
          return J;
        }).catch(function(q) {
          return q;
        });
      });
    }
    function R(M, $, q, L) {
      if (typeof q == "string") {
        if (arguments.length === 4)
          throw new b("error", ["Object", "Error", "Function", "RegExp"], q);
        if (t($) === "object" && $ !== null) {
          if ($.message === q)
            throw new u("error/message", 'The error message "'.concat($.message, '" is identical to the message.'));
        } else if ($ === q)
          throw new u("error/message", 'The error "'.concat($, '" is identical to the message.'));
        L = q, q = void 0;
      } else if (q != null && t(q) !== "object" && typeof q != "function")
        throw new b("error", ["Object", "Error", "Function", "RegExp"], q);
      if ($ === J) {
        var G = "";
        q && q.name && (G += " (".concat(q.name, ")")), G += L ? ": ".concat(L) : ".";
        var Q = M.name === "rejects" ? "rejection" : "exception";
        Z({
          actual: void 0,
          expected: q,
          operator: M.name,
          message: "Missing expected ".concat(Q).concat(G),
          stackStartFn: M
        });
      }
      if (q && !te($, q, L, M))
        throw $;
    }
    function D(M, $, q, L) {
      if ($ !== J) {
        if (typeof q == "string" && (L = q, q = void 0), !q || te($, q)) {
          var G = L ? ": ".concat(L) : ".", Q = M.name === "doesNotReject" ? "rejection" : "exception";
          Z({
            actual: $,
            expected: q,
            operator: M.name,
            message: "Got unwanted ".concat(Q).concat(G, `
`) + 'Actual message: "'.concat($ && $.message, '"'),
            stackStartFn: M
          });
        }
        throw $;
      }
    }
    C.throws = function M($) {
      for (var q = arguments.length, L = new Array(q > 1 ? q - 1 : 0), G = 1; G < q; G++)
        L[G - 1] = arguments[G];
      R.apply(void 0, [M, ae($)].concat(L));
    }, C.rejects = function M($) {
      for (var q = arguments.length, L = new Array(q > 1 ? q - 1 : 0), G = 1; G < q; G++)
        L[G - 1] = arguments[G];
      return ee($).then(function(Q) {
        return R.apply(void 0, [M, Q].concat(L));
      });
    }, C.doesNotThrow = function M($) {
      for (var q = arguments.length, L = new Array(q > 1 ? q - 1 : 0), G = 1; G < q; G++)
        L[G - 1] = arguments[G];
      D.apply(void 0, [M, ae($)].concat(L));
    }, C.doesNotReject = function M($) {
      for (var q = arguments.length, L = new Array(q > 1 ? q - 1 : 0), G = 1; G < q; G++)
        L[G - 1] = arguments[G];
      return ee($).then(function(Q) {
        return D.apply(void 0, [M, Q].concat(L));
      });
    }, C.ifError = function M($) {
      if ($ != null) {
        var q = "ifError got unwanted exception: ";
        t($) === "object" && typeof $.message == "string" ? $.message.length === 0 && $.constructor ? q += $.constructor.name : q += $.message : q += x($);
        var L = new j({
          actual: $,
          expected: null,
          operator: "ifError",
          message: q,
          stackStartFn: M
        }), G = $.stack;
        if (typeof G == "string") {
          var Q = G.split(`
`);
          Q.shift();
          for (var oe = L.stack.split(`
`), de = 0; de < Q.length; de++) {
            var ge = oe.indexOf(Q[de]);
            if (ge !== -1) {
              oe = oe.slice(0, ge);
              break;
            }
          }
          L.stack = "".concat(oe.join(`
`), `
`).concat(Q.join(`
`));
        }
        throw L;
      }
    };
    function W(M, $, q, L, G) {
      if (!m($))
        throw new b("regexp", "RegExp", $);
      var Q = G === "match";
      if (typeof M != "string" || d($, M) !== Q) {
        if (q instanceof Error)
          throw q;
        var oe = !q;
        q = q || (typeof M != "string" ? 'The "string" argument must be of type string. Received type ' + "".concat(t(M), " (").concat(x(M), ")") : (Q ? "The input did not match the regular expression " : "The input was expected to not match the regular expression ") + "".concat(x($), `. Input:

`).concat(x(M), `
`));
        var de = new j({
          actual: M,
          expected: $,
          message: q,
          operator: G,
          stackStartFn: L
        });
        throw de.generatedMessage = oe, de;
      }
    }
    C.match = function M($, q, L) {
      W($, q, L, M, "match");
    }, C.doesNotMatch = function M($, q, L) {
      W($, q, L, M, "doesNotMatch");
    };
    function re() {
      for (var M = arguments.length, $ = new Array(M), q = 0; q < M; q++)
        $[q] = arguments[q];
      le.apply(void 0, [re, $.length].concat($));
    }
    C.strict = S(re, C, {
      equal: C.strictEqual,
      deepEqual: C.deepStrictEqual,
      notEqual: C.notStrictEqual,
      notDeepEqual: C.notDeepStrictEqual
    }), C.strict.strict = C.strict;
  }
}), Yi = ce({
  "node_modules/memfs/lib/internal/errors.js"(e) {
    Object.defineProperty(e, "__esModule", { value: !0 }), e.AssertionError = e.RangeError = e.TypeError = e.Error = void 0, e.message = b, e.E = g;
    var r = Wr(), t = vt(), n = typeof Symbol > "u" ? "_kCode" : Symbol("code"), i = {};
    function s(x) {
      return class extends x {
        constructor(y, ...m) {
          super(b(y, m)), this.code = y, this[n] = y, this.name = `${super.name} [${this[n]}]`;
        }
      };
    }
    var f = typeof globalThis < "u" ? globalThis : global, u = class extends f.Error {
      constructor(x) {
        if (typeof x != "object" || x === null)
          throw new e.TypeError("ERR_INVALID_ARG_TYPE", "options", "object");
        x.message ? super(x.message) : super(`${t.inspect(x.actual).slice(0, 128)} ${x.operator} ${t.inspect(x.expected).slice(0, 128)}`), this.generatedMessage = !x.message, this.name = "AssertionError [ERR_ASSERTION]", this.code = "ERR_ASSERTION", this.actual = x.actual, this.expected = x.expected, this.operator = x.operator, e.Error.captureStackTrace(this, x.stackStartFunction);
      }
    };
    e.AssertionError = u;
    function b(x, p) {
      r.strictEqual(typeof x, "string");
      const y = i[x];
      r(y, `An invalid error message key was used: ${x}.`);
      let m;
      if (typeof y == "function")
        m = y;
      else {
        if (m = t.format, p === void 0 || p.length === 0)
          return y;
        p.unshift(y);
      }
      return String(m.apply(null, p));
    }
    function g(x, p) {
      i[x] = typeof p == "function" ? p : String(p);
    }
    e.Error = s(f.Error), e.TypeError = s(f.TypeError), e.RangeError = s(f.RangeError), g("ERR_ARG_NOT_ITERABLE", "%s must be iterable"), g("ERR_ASSERTION", "%s"), g("ERR_BUFFER_OUT_OF_BOUNDS", P), g("ERR_CHILD_CLOSED_BEFORE_REPLY", "Child closed before reply received"), g("ERR_CONSOLE_WRITABLE_STREAM", "Console expects a writable stream instance for %s"), g("ERR_CPU_USAGE", "Unable to obtain cpu usage %s"), g("ERR_DNS_SET_SERVERS_FAILED", (x, p) => `c-ares failed to set servers: "${x}" [${p}]`), g("ERR_FALSY_VALUE_REJECTION", "Promise was rejected with falsy value"), g("ERR_ENCODING_NOT_SUPPORTED", (x) => `The "${x}" encoding is not supported`), g("ERR_ENCODING_INVALID_ENCODED_DATA", (x) => `The encoded data was not valid for encoding ${x}`), g("ERR_HTTP_HEADERS_SENT", "Cannot render headers after they are sent to the client"), g("ERR_HTTP_INVALID_STATUS_CODE", "Invalid status code: %s"), g("ERR_HTTP_TRAILER_INVALID", "Trailers are invalid with this transfer encoding"), g("ERR_INDEX_OUT_OF_RANGE", "Index out of range"), g("ERR_INVALID_ARG_TYPE", A), g("ERR_INVALID_ARRAY_LENGTH", (x, p, y) => (r.strictEqual(typeof y, "number"), `The array "${x}" (length ${y}) must be of length ${p}.`)), g("ERR_INVALID_BUFFER_SIZE", "Buffer size must be a multiple of %s"), g("ERR_INVALID_CALLBACK", "Callback must be a function"), g("ERR_INVALID_CHAR", "Invalid character in %s"), g("ERR_INVALID_CURSOR_POS", "Cannot set cursor row without setting its column"), g("ERR_INVALID_FD", '"fd" must be a positive integer: %s'), g("ERR_INVALID_FILE_URL_HOST", 'File URL host must be "localhost" or empty on %s'), g("ERR_INVALID_FILE_URL_PATH", "File URL path %s"), g("ERR_INVALID_HANDLE_TYPE", "This handle type cannot be sent"), g("ERR_INVALID_IP_ADDRESS", "Invalid IP address: %s"), g("ERR_INVALID_OPT_VALUE", (x, p) => `The value "${String(p)}" is invalid for option "${x}"`), g("ERR_INVALID_OPT_VALUE_ENCODING", (x) => `The value "${String(x)}" is invalid for option "encoding"`), g("ERR_INVALID_REPL_EVAL_CONFIG", 'Cannot specify both "breakEvalOnSigint" and "eval" for REPL'), g("ERR_INVALID_SYNC_FORK_INPUT", "Asynchronous forks do not support Buffer, Uint8Array or string input: %s"), g("ERR_INVALID_THIS", 'Value of "this" must be of type %s'), g("ERR_INVALID_TUPLE", "%s must be an iterable %s tuple"), g("ERR_INVALID_URL", "Invalid URL: %s"), g("ERR_INVALID_URL_SCHEME", (x) => `The URL must be ${j(x, "scheme")}`), g("ERR_IPC_CHANNEL_CLOSED", "Channel closed"), g("ERR_IPC_DISCONNECTED", "IPC channel is already disconnected"), g("ERR_IPC_ONE_PIPE", "Child process can have only one IPC pipe"), g("ERR_IPC_SYNC_FORK", "IPC cannot be used with synchronous forks"), g("ERR_MISSING_ARGS", w), g("ERR_MULTIPLE_CALLBACK", "Callback called multiple times"), g("ERR_NAPI_CONS_FUNCTION", "Constructor must be a function"), g("ERR_NAPI_CONS_PROTOTYPE_OBJECT", "Constructor.prototype must be an object"), g("ERR_NO_CRYPTO", "Node.js is not compiled with OpenSSL crypto support"), g("ERR_NO_LONGER_SUPPORTED", "%s is no longer supported"), g("ERR_PARSE_HISTORY_DATA", "Could not parse history data in %s"), g("ERR_SOCKET_ALREADY_BOUND", "Socket is already bound"), g("ERR_SOCKET_BAD_PORT", "Port should be > 0 and < 65536"), g("ERR_SOCKET_BAD_TYPE", "Bad socket type specified. Valid types are: udp4, udp6"), g("ERR_SOCKET_CANNOT_SEND", "Unable to send data"), g("ERR_SOCKET_CLOSED", "Socket is closed"), g("ERR_SOCKET_DGRAM_NOT_RUNNING", "Not running"), g("ERR_STDERR_CLOSE", "process.stderr cannot be closed"), g("ERR_STDOUT_CLOSE", "process.stdout cannot be closed"), g("ERR_STREAM_WRAP", "Stream has StringDecoder set or is in objectMode"), g("ERR_TLS_CERT_ALTNAME_INVALID", "Hostname/IP does not match certificate's altnames: %s"), g("ERR_TLS_DH_PARAM_SIZE", (x) => `DH parameter size ${x} is less than 2048`), g("ERR_TLS_HANDSHAKE_TIMEOUT", "TLS handshake timeout"), g("ERR_TLS_RENEGOTIATION_FAILED", "Failed to renegotiate"), g("ERR_TLS_REQUIRED_SERVER_NAME", '"servername" is required parameter for Server.addContext'), g("ERR_TLS_SESSION_ATTACK", "TSL session renegotiation attack detected"), g("ERR_TRANSFORM_ALREADY_TRANSFORMING", "Calling transform done when still transforming"), g("ERR_TRANSFORM_WITH_LENGTH_0", "Calling transform done when writableState.length != 0"), g("ERR_UNKNOWN_ENCODING", "Unknown encoding: %s"), g("ERR_UNKNOWN_SIGNAL", "Unknown signal: %s"), g("ERR_UNKNOWN_STDIN_TYPE", "Unknown stdin file type"), g("ERR_UNKNOWN_STREAM_TYPE", "Unknown stream file type"), g("ERR_V8BREAKITERATOR", "Full ICU data not installed. See https://github.com/nodejs/node/wiki/Intl");
    function A(x, p, y) {
      r(x, "name is required");
      let m;
      p.includes("not ") ? (m = "must not be", p = p.split("not ")[1]) : m = "must be";
      let S;
      if (Array.isArray(x))
        S = `The ${x.map((d) => `"${d}"`).join(", ")} arguments ${m} ${j(p, "type")}`;
      else if (x.includes(" argument"))
        S = `The ${x} ${m} ${j(p, "type")}`;
      else {
        const _ = x.includes(".") ? "property" : "argument";
        S = `The "${x}" ${_} ${m} ${j(p, "type")}`;
      }
      return arguments.length >= 3 && (S += `. Received type ${y !== null ? typeof y : "null"}`), S;
    }
    function w(...x) {
      r(x.length > 0, "At least one arg needs to be specified");
      let p = "The ";
      const y = x.length;
      switch (x = x.map((m) => `"${m}"`), y) {
        case 1:
          p += `${x[0]} argument`;
          break;
        case 2:
          p += `${x[0]} and ${x[1]} arguments`;
          break;
        default:
          p += x.slice(0, y - 1).join(", "), p += `, and ${x[y - 1]} arguments`;
          break;
      }
      return `${p} must be specified`;
    }
    function j(x, p) {
      if (r(x, "expected is required"), r(typeof p == "string", "thing is required"), Array.isArray(x)) {
        const y = x.length;
        return r(y > 0, "At least one expected value needs to be specified"), x = x.map((m) => String(m)), y > 2 ? `one of ${p} ${x.slice(0, y - 1).join(", ")}, or ` + x[y - 1] : y === 2 ? `one of ${p} ${x[0]} or ${x[1]}` : `of ${p} ${x[0]}`;
      } else
        return `of ${p} ${String(x)}`;
    }
    function P(x, p) {
      return p ? "Attempt to write outside buffer bounds" : `"${x}" is outside of buffer bounds`;
    }
  }
}), br = ce({
  "node_modules/memfs/lib/encoding.js"(e) {
    Object.defineProperty(e, "__esModule", { value: !0 }), e.ENCODING_UTF8 = void 0, e.assertEncoding = n, e.strToEncoding = i;
    var r = Lt(), t = Yi();
    e.ENCODING_UTF8 = "utf8";
    function n(s) {
      if (s && !r.Buffer.isEncoding(s))
        throw new t.TypeError("ERR_INVALID_OPT_VALUE_ENCODING", s);
    }
    function i(s, f) {
      return !f || f === e.ENCODING_UTF8 ? s : f === "buffer" ? new r.Buffer(s) : new r.Buffer(s).toString(f);
    }
  }
}), cn = ce({
  "node_modules/memfs/lib/Dirent.js"(e) {
    Object.defineProperty(e, "__esModule", { value: !0 }), e.Dirent = void 0;
    var r = bt(), t = br(), { S_IFMT: n, S_IFDIR: i, S_IFREG: s, S_IFBLK: f, S_IFCHR: u, S_IFLNK: b, S_IFIFO: g, S_IFSOCK: A } = r.constants, w = class Ki {
      constructor() {
        this.name = "", this.path = "", this.parentPath = "", this.mode = 0;
      }
      static build(P, x) {
        const p = new Ki(), { mode: y } = P.getNode();
        return p.name = (0, t.strToEncoding)(P.getName(), x), p.mode = y, p.path = P.getParentPath(), p.parentPath = p.path, p;
      }
      _checkModeProperty(P) {
        return (this.mode & n) === P;
      }
      isDirectory() {
        return this._checkModeProperty(i);
      }
      isFile() {
        return this._checkModeProperty(s);
      }
      isBlockDevice() {
        return this._checkModeProperty(f);
      }
      isCharacterDevice() {
        return this._checkModeProperty(u);
      }
      isSymbolicLink() {
        return this._checkModeProperty(b);
      }
      isFIFO() {
        return this._checkModeProperty(g);
      }
      isSocket() {
        return this._checkModeProperty(A);
      }
    };
    e.Dirent = w, e.default = w;
  }
}), ec = ce({
  "node_modules/path/node_modules/util/support/isBufferBrowser.js"(e, r) {
    r.exports = function(n) {
      return n && typeof n == "object" && typeof n.copy == "function" && typeof n.fill == "function" && typeof n.readUInt8 == "function";
    };
  }
}), tc = ce({
  "node_modules/path/node_modules/inherits/inherits_browser.js"(e, r) {
    typeof Object.create == "function" ? r.exports = function(n, i) {
      n.super_ = i, n.prototype = Object.create(i.prototype, {
        constructor: {
          value: n,
          enumerable: !1,
          writable: !0,
          configurable: !0
        }
      });
    } : r.exports = function(n, i) {
      n.super_ = i;
      var s = function() {
      };
      s.prototype = i.prototype, n.prototype = new s(), n.prototype.constructor = n;
    };
  }
}), rc = ce({
  "node_modules/path/node_modules/util/util.js"(e) {
    var r = /%[sdj%]/g;
    e.format = function(X) {
      if (!_(X)) {
        for (var te = [], ae = 0; ae < arguments.length; ae++)
          te.push(i(arguments[ae]));
        return te.join(" ");
      }
      for (var ae = 1, fe = arguments, ee = fe.length, R = String(X).replace(r, function(W) {
        if (W === "%%") return "%";
        if (ae >= ee) return W;
        switch (W) {
          case "%s":
            return String(fe[ae++]);
          case "%d":
            return Number(fe[ae++]);
          case "%j":
            try {
              return JSON.stringify(fe[ae++]);
            } catch {
              return "[Circular]";
            }
          default:
            return W;
        }
      }), D = fe[ae]; ae < ee; D = fe[++ae])
        y(D) || !T(D) ? R += " " + D : R += " " + i(D);
      return R;
    }, e.deprecate = function(X, te) {
      if (E(global.process))
        return function() {
          return e.deprecate(X, te).apply(this, arguments);
        };
      if (we.noDeprecation === !0)
        return X;
      var ae = !1;
      function fe() {
        if (!ae) {
          if (we.throwDeprecation)
            throw new Error(te);
          we.traceDeprecation ? console.trace(te) : console.error(te), ae = !0;
        }
        return X.apply(this, arguments);
      }
      return fe;
    };
    var t = {}, n;
    e.debuglog = function(X) {
      if (E(n) && (n = we.env.NODE_DEBUG || ""), X = X.toUpperCase(), !t[X])
        if (new RegExp("\\b" + X + "\\b", "i").test(n)) {
          var te = we.pid;
          t[X] = function() {
            var ae = e.format.apply(e, arguments);
            console.error("%s %d: %s", X, te, ae);
          };
        } else
          t[X] = function() {
          };
      return t[X];
    };
    function i(X, te) {
      var ae = {
        seen: [],
        stylize: f
      };
      return arguments.length >= 3 && (ae.depth = arguments[2]), arguments.length >= 4 && (ae.colors = arguments[3]), p(te) ? ae.showHidden = te : te && e._extend(ae, te), E(ae.showHidden) && (ae.showHidden = !1), E(ae.depth) && (ae.depth = 2), E(ae.colors) && (ae.colors = !1), E(ae.customInspect) && (ae.customInspect = !0), ae.colors && (ae.stylize = s), b(ae, X, ae.depth);
    }
    e.inspect = i, i.colors = {
      bold: [1, 22],
      italic: [3, 23],
      underline: [4, 24],
      inverse: [7, 27],
      white: [37, 39],
      grey: [90, 39],
      black: [30, 39],
      blue: [34, 39],
      cyan: [36, 39],
      green: [32, 39],
      magenta: [35, 39],
      red: [31, 39],
      yellow: [33, 39]
    }, i.styles = {
      special: "cyan",
      number: "yellow",
      boolean: "yellow",
      undefined: "grey",
      null: "bold",
      string: "green",
      date: "magenta",
      // "name": intentionally not styling
      regexp: "red"
    };
    function s(X, te) {
      var ae = i.styles[te];
      return ae ? "\x1B[" + i.colors[ae][0] + "m" + X + "\x1B[" + i.colors[ae][1] + "m" : X;
    }
    function f(X, te) {
      return X;
    }
    function u(X) {
      var te = {};
      return X.forEach(function(ae, fe) {
        te[ae] = !0;
      }), te;
    }
    function b(X, te, ae) {
      if (X.customInspect && te && J(te.inspect) && // Filter out the util module, it's inspect function is special
      te.inspect !== e.inspect && // Also filter out any prototype objects using the circular check.
      !(te.constructor && te.constructor.prototype === te)) {
        var fe = te.inspect(ae, X);
        return _(fe) || (fe = b(X, fe, ae)), fe;
      }
      var ee = g(X, te);
      if (ee)
        return ee;
      var R = Object.keys(te), D = u(R);
      if (X.showHidden && (R = Object.getOwnPropertyNames(te)), C(te) && (R.indexOf("message") >= 0 || R.indexOf("description") >= 0))
        return A(te);
      if (R.length === 0) {
        if (J(te)) {
          var W = te.name ? ": " + te.name : "";
          return X.stylize("[Function" + W + "]", "special");
        }
        if (O(te))
          return X.stylize(RegExp.prototype.toString.call(te), "regexp");
        if (F(te))
          return X.stylize(Date.prototype.toString.call(te), "date");
        if (C(te))
          return A(te);
      }
      var re = "", M = !1, $ = ["{", "}"];
      if (x(te) && (M = !0, $ = ["[", "]"]), J(te)) {
        var q = te.name ? ": " + te.name : "";
        re = " [Function" + q + "]";
      }
      if (O(te) && (re = " " + RegExp.prototype.toString.call(te)), F(te) && (re = " " + Date.prototype.toUTCString.call(te)), C(te) && (re = " " + A(te)), R.length === 0 && (!M || te.length == 0))
        return $[0] + re + $[1];
      if (ae < 0)
        return O(te) ? X.stylize(RegExp.prototype.toString.call(te), "regexp") : X.stylize("[Object]", "special");
      X.seen.push(te);
      var L;
      return M ? L = w(X, te, ae, D, R) : L = R.map(function(G) {
        return j(X, te, ae, D, G, M);
      }), X.seen.pop(), P(L, re, $);
    }
    function g(X, te) {
      if (E(te))
        return X.stylize("undefined", "undefined");
      if (_(te)) {
        var ae = "'" + JSON.stringify(te).replace(/^"|"$/g, "").replace(/'/g, "\\'").replace(/\\"/g, '"') + "'";
        return X.stylize(ae, "string");
      }
      if (S(te))
        return X.stylize("" + te, "number");
      if (p(te))
        return X.stylize("" + te, "boolean");
      if (y(te))
        return X.stylize("null", "null");
    }
    function A(X) {
      return "[" + Error.prototype.toString.call(X) + "]";
    }
    function w(X, te, ae, fe, ee) {
      for (var R = [], D = 0, W = te.length; D < W; ++D)
        he(te, String(D)) ? R.push(j(
          X,
          te,
          ae,
          fe,
          String(D),
          !0
        )) : R.push("");
      return ee.forEach(function(re) {
        re.match(/^\d+$/) || R.push(j(
          X,
          te,
          ae,
          fe,
          re,
          !0
        ));
      }), R;
    }
    function j(X, te, ae, fe, ee, R) {
      var D, W, re;
      if (re = Object.getOwnPropertyDescriptor(te, ee) || { value: te[ee] }, re.get ? re.set ? W = X.stylize("[Getter/Setter]", "special") : W = X.stylize("[Getter]", "special") : re.set && (W = X.stylize("[Setter]", "special")), he(fe, ee) || (D = "[" + ee + "]"), W || (X.seen.indexOf(re.value) < 0 ? (y(ae) ? W = b(X, re.value, null) : W = b(X, re.value, ae - 1), W.indexOf(`
`) > -1 && (R ? W = W.split(`
`).map(function(M) {
        return "  " + M;
      }).join(`
`).substr(2) : W = `
` + W.split(`
`).map(function(M) {
        return "   " + M;
      }).join(`
`))) : W = X.stylize("[Circular]", "special")), E(D)) {
        if (R && ee.match(/^\d+$/))
          return W;
        D = JSON.stringify("" + ee), D.match(/^"([a-zA-Z_][a-zA-Z_0-9]*)"$/) ? (D = D.substr(1, D.length - 2), D = X.stylize(D, "name")) : (D = D.replace(/'/g, "\\'").replace(/\\"/g, '"').replace(/(^"|"$)/g, "'"), D = X.stylize(D, "string"));
      }
      return D + ": " + W;
    }
    function P(X, te, ae) {
      var fe = X.reduce(function(ee, R) {
        return R.indexOf(`
`) >= 0, ee + R.replace(/\u001b\[\d\d?m/g, "").length + 1;
      }, 0);
      return fe > 60 ? ae[0] + (te === "" ? "" : te + `
 `) + " " + X.join(`,
  `) + " " + ae[1] : ae[0] + te + " " + X.join(", ") + " " + ae[1];
    }
    function x(X) {
      return Array.isArray(X);
    }
    e.isArray = x;
    function p(X) {
      return typeof X == "boolean";
    }
    e.isBoolean = p;
    function y(X) {
      return X === null;
    }
    e.isNull = y;
    function m(X) {
      return X == null;
    }
    e.isNullOrUndefined = m;
    function S(X) {
      return typeof X == "number";
    }
    e.isNumber = S;
    function _(X) {
      return typeof X == "string";
    }
    e.isString = _;
    function d(X) {
      return typeof X == "symbol";
    }
    e.isSymbol = d;
    function E(X) {
      return X === void 0;
    }
    e.isUndefined = E;
    function O(X) {
      return T(X) && se(X) === "[object RegExp]";
    }
    e.isRegExp = O;
    function T(X) {
      return typeof X == "object" && X !== null;
    }
    e.isObject = T;
    function F(X) {
      return T(X) && se(X) === "[object Date]";
    }
    e.isDate = F;
    function C(X) {
      return T(X) && (se(X) === "[object Error]" || X instanceof Error);
    }
    e.isError = C;
    function J(X) {
      return typeof X == "function";
    }
    e.isFunction = J;
    function Z(X) {
      return X === null || typeof X == "boolean" || typeof X == "number" || typeof X == "string" || typeof X == "symbol" || // ES6 symbol
      typeof X > "u";
    }
    e.isPrimitive = Z, e.isBuffer = ec();
    function se(X) {
      return Object.prototype.toString.call(X);
    }
    function le(X) {
      return X < 10 ? "0" + X.toString(10) : X.toString(10);
    }
    var pe = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec"
    ];
    function me() {
      var X = /* @__PURE__ */ new Date(), te = [
        le(X.getHours()),
        le(X.getMinutes()),
        le(X.getSeconds())
      ].join(":");
      return [X.getDate(), pe[X.getMonth()], te].join(" ");
    }
    e.log = function() {
      console.log("%s - %s", me(), e.format.apply(e, arguments));
    }, e.inherits = tc(), e._extend = function(X, te) {
      if (!te || !T(te)) return X;
      for (var ae = Object.keys(te), fe = ae.length; fe--; )
        X[ae[fe]] = te[ae[fe]];
      return X;
    };
    function he(X, te) {
      return Object.prototype.hasOwnProperty.call(X, te);
    }
  }
}), nc = ce({
  "node_modules/path/path.js"(e, r) {
    var t = we.platform === "win32", n = rc();
    function i(p, y) {
      for (var m = [], S = 0; S < p.length; S++) {
        var _ = p[S];
        !_ || _ === "." || (_ === ".." ? m.length && m[m.length - 1] !== ".." ? m.pop() : y && m.push("..") : m.push(_));
      }
      return m;
    }
    function s(p) {
      for (var y = p.length - 1, m = 0; m <= y && !p[m]; m++)
        ;
      for (var S = y; S >= 0 && !p[S]; S--)
        ;
      return m === 0 && S === y ? p : m > S ? [] : p.slice(m, S + 1);
    }
    var f = /^([a-zA-Z]:|[\\\/]{2}[^\\\/]+[\\\/]+[^\\\/]+)?([\\\/])?([\s\S]*?)$/, u = /^([\s\S]*?)((?:\.{1,2}|[^\\\/]+?|)(\.[^.\/\\]*|))(?:[\\\/]*)$/, b = {};
    function g(p) {
      var y = f.exec(p), m = (y[1] || "") + (y[2] || ""), S = y[3] || "", _ = u.exec(S), d = _[1], E = _[2], O = _[3];
      return [m, d, E, O];
    }
    function A(p) {
      var y = f.exec(p), m = y[1] || "", S = !!m && m[1] !== ":";
      return {
        device: m,
        isUnc: S,
        isAbsolute: S || !!y[2],
        // UNC paths are always absolute
        tail: y[3]
      };
    }
    function w(p) {
      return "\\\\" + p.replace(/^[\\\/]+/, "").replace(/[\\\/]+/g, "\\");
    }
    b.resolve = function() {
      for (var p = "", y = "", m = !1, S = arguments.length - 1; S >= -1; S--) {
        var _;
        if (S >= 0 ? _ = arguments[S] : p ? (_ = we.env["=" + p], (!_ || _.substr(0, 3).toLowerCase() !== p.toLowerCase() + "\\") && (_ = p + "\\")) : _ = we.cwd(), n.isString(_)) {
          if (!_)
            continue;
        } else throw new TypeError("Arguments to path.resolve must be strings");
        var d = A(_), E = d.device, O = d.isUnc, T = d.isAbsolute, F = d.tail;
        if (!(E && p && E.toLowerCase() !== p.toLowerCase()) && (p || (p = E), m || (y = F + "\\" + y, m = T), p && m))
          break;
      }
      return O && (p = w(p)), y = i(
        y.split(/[\\\/]+/),
        !m
      ).join("\\"), p + (m ? "\\" : "") + y || ".";
    }, b.normalize = function(p) {
      var y = A(p), m = y.device, S = y.isUnc, _ = y.isAbsolute, d = y.tail, E = /[\\\/]$/.test(d);
      return d = i(d.split(/[\\\/]+/), !_).join("\\"), !d && !_ && (d = "."), d && E && (d += "\\"), S && (m = w(m)), m + (_ ? "\\" : "") + d;
    }, b.isAbsolute = function(p) {
      return A(p).isAbsolute;
    }, b.join = function() {
      for (var p = [], y = 0; y < arguments.length; y++) {
        var m = arguments[y];
        if (!n.isString(m))
          throw new TypeError("Arguments to path.join must be strings");
        m && p.push(m);
      }
      var S = p.join("\\");
      return /^[\\\/]{2}[^\\\/]/.test(p[0]) || (S = S.replace(/^[\\\/]{2,}/, "\\")), b.normalize(S);
    }, b.relative = function(p, y) {
      p = b.resolve(p), y = b.resolve(y);
      for (var m = p.toLowerCase(), S = y.toLowerCase(), _ = s(y.split("\\")), d = s(m.split("\\")), E = s(S.split("\\")), O = Math.min(d.length, E.length), T = O, F = 0; F < O; F++)
        if (d[F] !== E[F]) {
          T = F;
          break;
        }
      if (T == 0)
        return y;
      for (var C = [], F = T; F < d.length; F++)
        C.push("..");
      return C = C.concat(_.slice(T)), C.join("\\");
    }, b._makeLong = function(p) {
      if (!n.isString(p))
        return p;
      if (!p)
        return "";
      var y = b.resolve(p);
      return /^[a-zA-Z]\:\\/.test(y) ? "\\\\?\\" + y : /^\\\\[^?.]/.test(y) ? "\\\\?\\UNC\\" + y.substring(2) : p;
    }, b.dirname = function(p) {
      var y = g(p), m = y[0], S = y[1];
      return !m && !S ? "." : (S && (S = S.substr(0, S.length - 1)), m + S);
    }, b.basename = function(p, y) {
      var m = g(p)[2];
      return y && m.substr(-1 * y.length) === y && (m = m.substr(0, m.length - y.length)), m;
    }, b.extname = function(p) {
      return g(p)[3];
    }, b.format = function(p) {
      if (!n.isObject(p))
        throw new TypeError(
          "Parameter 'pathObject' must be an object, not " + typeof p
        );
      var y = p.root || "";
      if (!n.isString(y))
        throw new TypeError(
          "'pathObject.root' must be a string or undefined, not " + typeof p.root
        );
      var m = p.dir, S = p.base || "";
      return m ? m[m.length - 1] === b.sep ? m + S : m + b.sep + S : S;
    }, b.parse = function(p) {
      if (!n.isString(p))
        throw new TypeError(
          "Parameter 'pathString' must be a string, not " + typeof p
        );
      var y = g(p);
      if (!y || y.length !== 4)
        throw new TypeError("Invalid path '" + p + "'");
      return {
        root: y[0],
        dir: y[0] + y[1].slice(0, -1),
        base: y[2],
        ext: y[3],
        name: y[2].slice(0, y[2].length - y[3].length)
      };
    }, b.sep = "\\", b.delimiter = ";";
    var j = /^(\/?|)([\s\S]*?)((?:\.{1,2}|[^\/]+?|)(\.[^.\/]*|))(?:[\/]*)$/, P = {};
    function x(p) {
      return j.exec(p).slice(1);
    }
    P.resolve = function() {
      for (var p = "", y = !1, m = arguments.length - 1; m >= -1 && !y; m--) {
        var S = m >= 0 ? arguments[m] : we.cwd();
        if (n.isString(S)) {
          if (!S)
            continue;
        } else throw new TypeError("Arguments to path.resolve must be strings");
        p = S + "/" + p, y = S[0] === "/";
      }
      return p = i(
        p.split("/"),
        !y
      ).join("/"), (y ? "/" : "") + p || ".";
    }, P.normalize = function(p) {
      var y = P.isAbsolute(p), m = p && p[p.length - 1] === "/";
      return p = i(p.split("/"), !y).join("/"), !p && !y && (p = "."), p && m && (p += "/"), (y ? "/" : "") + p;
    }, P.isAbsolute = function(p) {
      return p.charAt(0) === "/";
    }, P.join = function() {
      for (var p = "", y = 0; y < arguments.length; y++) {
        var m = arguments[y];
        if (!n.isString(m))
          throw new TypeError("Arguments to path.join must be strings");
        m && (p ? p += "/" + m : p += m);
      }
      return P.normalize(p);
    }, P.relative = function(p, y) {
      p = P.resolve(p).substr(1), y = P.resolve(y).substr(1);
      for (var m = s(p.split("/")), S = s(y.split("/")), _ = Math.min(m.length, S.length), d = _, E = 0; E < _; E++)
        if (m[E] !== S[E]) {
          d = E;
          break;
        }
      for (var O = [], E = d; E < m.length; E++)
        O.push("..");
      return O = O.concat(S.slice(d)), O.join("/");
    }, P._makeLong = function(p) {
      return p;
    }, P.dirname = function(p) {
      var y = x(p), m = y[0], S = y[1];
      return !m && !S ? "." : (S && (S = S.substr(0, S.length - 1)), m + S);
    }, P.basename = function(p, y) {
      var m = x(p)[2];
      return y && m.substr(-1 * y.length) === y && (m = m.substr(0, m.length - y.length)), m;
    }, P.extname = function(p) {
      return x(p)[3];
    }, P.format = function(p) {
      if (!n.isObject(p))
        throw new TypeError(
          "Parameter 'pathObject' must be an object, not " + typeof p
        );
      var y = p.root || "";
      if (!n.isString(y))
        throw new TypeError(
          "'pathObject.root' must be a string or undefined, not " + typeof p.root
        );
      var m = p.dir ? p.dir + P.sep : "", S = p.base || "";
      return m + S;
    }, P.parse = function(p) {
      if (!n.isString(p))
        throw new TypeError(
          "Parameter 'pathString' must be a string, not " + typeof p
        );
      var y = x(p);
      if (!y || y.length !== 4)
        throw new TypeError("Invalid path '" + p + "'");
      return y[1] = y[1] || "", y[2] = y[2] || "", y[3] = y[3] || "", {
        root: y[0],
        dir: y[0] + y[1].slice(0, -1),
        base: y[2],
        ext: y[3],
        name: y[2].slice(0, y[2].length - y[3].length)
      };
    }, P.sep = "/", P.delimiter = ":", t ? r.exports = b : r.exports = P, r.exports.posix = P, r.exports.win32 = b;
  }
}), ic = ce({
  "node_modules/process/browser.js"(e, r) {
    var t = r.exports = {}, n, i;
    function s() {
      throw new Error("setTimeout has not been defined");
    }
    function f() {
      throw new Error("clearTimeout has not been defined");
    }
    (function() {
      try {
        typeof setTimeout == "function" ? n = setTimeout : n = s;
      } catch {
        n = s;
      }
      try {
        typeof clearTimeout == "function" ? i = clearTimeout : i = f;
      } catch {
        i = f;
      }
    })();
    function u(m) {
      if (n === setTimeout)
        return setTimeout(m, 0);
      if ((n === s || !n) && setTimeout)
        return n = setTimeout, setTimeout(m, 0);
      try {
        return n(m, 0);
      } catch {
        try {
          return n.call(null, m, 0);
        } catch {
          return n.call(this, m, 0);
        }
      }
    }
    function b(m) {
      if (i === clearTimeout)
        return clearTimeout(m);
      if ((i === f || !i) && clearTimeout)
        return i = clearTimeout, clearTimeout(m);
      try {
        return i(m);
      } catch {
        try {
          return i.call(null, m);
        } catch {
          return i.call(this, m);
        }
      }
    }
    var g = [], A = !1, w, j = -1;
    function P() {
      !A || !w || (A = !1, w.length ? g = w.concat(g) : j = -1, g.length && x());
    }
    function x() {
      if (!A) {
        var m = u(P);
        A = !0;
        for (var S = g.length; S; ) {
          for (w = g, g = []; ++j < S; )
            w && w[j].run();
          j = -1, S = g.length;
        }
        w = null, A = !1, b(m);
      }
    }
    t.nextTick = function(m) {
      var S = new Array(arguments.length - 1);
      if (arguments.length > 1)
        for (var _ = 1; _ < arguments.length; _++)
          S[_ - 1] = arguments[_];
      g.push(new p(m, S)), g.length === 1 && !A && u(x);
    };
    function p(m, S) {
      this.fun = m, this.array = S;
    }
    p.prototype.run = function() {
      this.fun.apply(null, this.array);
    }, t.title = "browser", t.browser = !0, t.env = {}, t.argv = [], t.version = "", t.versions = {};
    function y() {
    }
    t.on = y, t.addListener = y, t.once = y, t.off = y, t.removeListener = y, t.removeAllListeners = y, t.emit = y, t.prependListener = y, t.prependOnceListener = y, t.listeners = function(m) {
      return [];
    }, t.binding = function(m) {
      throw new Error("process.binding is not supported");
    }, t.cwd = function() {
      return "/";
    }, t.chdir = function(m) {
      throw new Error("process.chdir is not supported");
    }, t.umask = function() {
      return 0;
    };
  }
}), Xi = ce({
  "node_modules/memfs/lib/process.js"(e) {
    Object.defineProperty(e, "__esModule", { value: !0 }), e.createProcess = t;
    var r = () => {
      if (typeof we < "u")
        return we;
      try {
        return ic();
      } catch {
        return;
      }
    };
    function t() {
      const n = r() || {};
      return n.cwd || (n.cwd = () => "/"), n.emitWarning || (n.emitWarning = (i, s) => {
        console.warn(`${s}${s ? ": " : ""}${i}`);
      }), n.env || (n.env = {}), n;
    }
    e.default = t();
  }
}), Ji = ce({
  "node_modules/events/events.js"(e, r) {
    var t = typeof Reflect == "object" ? Reflect : null, n = t && typeof t.apply == "function" ? t.apply : function(T, F, C) {
      return Function.prototype.apply.call(T, F, C);
    }, i;
    t && typeof t.ownKeys == "function" ? i = t.ownKeys : Object.getOwnPropertySymbols ? i = function(T) {
      return Object.getOwnPropertyNames(T).concat(Object.getOwnPropertySymbols(T));
    } : i = function(T) {
      return Object.getOwnPropertyNames(T);
    };
    function s(O) {
      console && console.warn && console.warn(O);
    }
    var f = Number.isNaN || function(T) {
      return T !== T;
    };
    function u() {
      u.init.call(this);
    }
    r.exports = u, r.exports.once = _, u.EventEmitter = u, u.prototype._events = void 0, u.prototype._eventsCount = 0, u.prototype._maxListeners = void 0;
    var b = 10;
    function g(O) {
      if (typeof O != "function")
        throw new TypeError('The "listener" argument must be of type Function. Received type ' + typeof O);
    }
    Object.defineProperty(u, "defaultMaxListeners", {
      enumerable: !0,
      get: function() {
        return b;
      },
      set: function(O) {
        if (typeof O != "number" || O < 0 || f(O))
          throw new RangeError('The value of "defaultMaxListeners" is out of range. It must be a non-negative number. Received ' + O + ".");
        b = O;
      }
    }), u.init = function() {
      (this._events === void 0 || this._events === Object.getPrototypeOf(this)._events) && (this._events = /* @__PURE__ */ Object.create(null), this._eventsCount = 0), this._maxListeners = this._maxListeners || void 0;
    }, u.prototype.setMaxListeners = function(T) {
      if (typeof T != "number" || T < 0 || f(T))
        throw new RangeError('The value of "n" is out of range. It must be a non-negative number. Received ' + T + ".");
      return this._maxListeners = T, this;
    };
    function A(O) {
      return O._maxListeners === void 0 ? u.defaultMaxListeners : O._maxListeners;
    }
    u.prototype.getMaxListeners = function() {
      return A(this);
    }, u.prototype.emit = function(T) {
      for (var F = [], C = 1; C < arguments.length; C++) F.push(arguments[C]);
      var J = T === "error", Z = this._events;
      if (Z !== void 0)
        J = J && Z.error === void 0;
      else if (!J)
        return !1;
      if (J) {
        var se;
        if (F.length > 0 && (se = F[0]), se instanceof Error)
          throw se;
        var le = new Error("Unhandled error." + (se ? " (" + se.message + ")" : ""));
        throw le.context = se, le;
      }
      var pe = Z[T];
      if (pe === void 0)
        return !1;
      if (typeof pe == "function")
        n(pe, this, F);
      else
        for (var me = pe.length, he = y(pe, me), C = 0; C < me; ++C)
          n(he[C], this, F);
      return !0;
    };
    function w(O, T, F, C) {
      var J, Z, se;
      if (g(F), Z = O._events, Z === void 0 ? (Z = O._events = /* @__PURE__ */ Object.create(null), O._eventsCount = 0) : (Z.newListener !== void 0 && (O.emit(
        "newListener",
        T,
        F.listener ? F.listener : F
      ), Z = O._events), se = Z[T]), se === void 0)
        se = Z[T] = F, ++O._eventsCount;
      else if (typeof se == "function" ? se = Z[T] = C ? [F, se] : [se, F] : C ? se.unshift(F) : se.push(F), J = A(O), J > 0 && se.length > J && !se.warned) {
        se.warned = !0;
        var le = new Error("Possible EventEmitter memory leak detected. " + se.length + " " + String(T) + " listeners added. Use emitter.setMaxListeners() to increase limit");
        le.name = "MaxListenersExceededWarning", le.emitter = O, le.type = T, le.count = se.length, s(le);
      }
      return O;
    }
    u.prototype.addListener = function(T, F) {
      return w(this, T, F, !1);
    }, u.prototype.on = u.prototype.addListener, u.prototype.prependListener = function(T, F) {
      return w(this, T, F, !0);
    };
    function j() {
      if (!this.fired)
        return this.target.removeListener(this.type, this.wrapFn), this.fired = !0, arguments.length === 0 ? this.listener.call(this.target) : this.listener.apply(this.target, arguments);
    }
    function P(O, T, F) {
      var C = { fired: !1, wrapFn: void 0, target: O, type: T, listener: F }, J = j.bind(C);
      return J.listener = F, C.wrapFn = J, J;
    }
    u.prototype.once = function(T, F) {
      return g(F), this.on(T, P(this, T, F)), this;
    }, u.prototype.prependOnceListener = function(T, F) {
      return g(F), this.prependListener(T, P(this, T, F)), this;
    }, u.prototype.removeListener = function(T, F) {
      var C, J, Z, se, le;
      if (g(F), J = this._events, J === void 0)
        return this;
      if (C = J[T], C === void 0)
        return this;
      if (C === F || C.listener === F)
        --this._eventsCount === 0 ? this._events = /* @__PURE__ */ Object.create(null) : (delete J[T], J.removeListener && this.emit("removeListener", T, C.listener || F));
      else if (typeof C != "function") {
        for (Z = -1, se = C.length - 1; se >= 0; se--)
          if (C[se] === F || C[se].listener === F) {
            le = C[se].listener, Z = se;
            break;
          }
        if (Z < 0)
          return this;
        Z === 0 ? C.shift() : m(C, Z), C.length === 1 && (J[T] = C[0]), J.removeListener !== void 0 && this.emit("removeListener", T, le || F);
      }
      return this;
    }, u.prototype.off = u.prototype.removeListener, u.prototype.removeAllListeners = function(T) {
      var F, C, J;
      if (C = this._events, C === void 0)
        return this;
      if (C.removeListener === void 0)
        return arguments.length === 0 ? (this._events = /* @__PURE__ */ Object.create(null), this._eventsCount = 0) : C[T] !== void 0 && (--this._eventsCount === 0 ? this._events = /* @__PURE__ */ Object.create(null) : delete C[T]), this;
      if (arguments.length === 0) {
        var Z = Object.keys(C), se;
        for (J = 0; J < Z.length; ++J)
          se = Z[J], se !== "removeListener" && this.removeAllListeners(se);
        return this.removeAllListeners("removeListener"), this._events = /* @__PURE__ */ Object.create(null), this._eventsCount = 0, this;
      }
      if (F = C[T], typeof F == "function")
        this.removeListener(T, F);
      else if (F !== void 0)
        for (J = F.length - 1; J >= 0; J--)
          this.removeListener(T, F[J]);
      return this;
    };
    function x(O, T, F) {
      var C = O._events;
      if (C === void 0)
        return [];
      var J = C[T];
      return J === void 0 ? [] : typeof J == "function" ? F ? [J.listener || J] : [J] : F ? S(J) : y(J, J.length);
    }
    u.prototype.listeners = function(T) {
      return x(this, T, !0);
    }, u.prototype.rawListeners = function(T) {
      return x(this, T, !1);
    }, u.listenerCount = function(O, T) {
      return typeof O.listenerCount == "function" ? O.listenerCount(T) : p.call(O, T);
    }, u.prototype.listenerCount = p;
    function p(O) {
      var T = this._events;
      if (T !== void 0) {
        var F = T[O];
        if (typeof F == "function")
          return 1;
        if (F !== void 0)
          return F.length;
      }
      return 0;
    }
    u.prototype.eventNames = function() {
      return this._eventsCount > 0 ? i(this._events) : [];
    };
    function y(O, T) {
      for (var F = new Array(T), C = 0; C < T; ++C)
        F[C] = O[C];
      return F;
    }
    function m(O, T) {
      for (; T + 1 < O.length; T++)
        O[T] = O[T + 1];
      O.pop();
    }
    function S(O) {
      for (var T = new Array(O.length), F = 0; F < T.length; ++F)
        T[F] = O[F].listener || O[F];
      return T;
    }
    function _(O, T) {
      return new Promise(function(F, C) {
        function J(se) {
          O.removeListener(T, Z), C(se);
        }
        function Z() {
          typeof O.removeListener == "function" && O.removeListener("error", J), F([].slice.call(arguments));
        }
        E(O, T, Z, { once: !0 }), T !== "error" && d(O, J, { once: !0 });
      });
    }
    function d(O, T, F) {
      typeof O.on == "function" && E(O, "error", T, F);
    }
    function E(O, T, F, C) {
      if (typeof O.on == "function")
        C.once ? O.once(T, F) : O.on(T, F);
      else if (typeof O.addEventListener == "function")
        O.addEventListener(T, function J(Z) {
          C.once && O.removeEventListener(T, J), F(Z);
        });
      else
        throw new TypeError('The "emitter" argument must be of type EventEmitter. Received type ' + typeof O);
    }
  }
}), oc = ce({
  "node_modules/memfs/lib/node.js"(e) {
    Object.defineProperty(e, "__esModule", { value: !0 }), e.File = e.Link = e.Node = e.SEP = void 0;
    var r = Xi(), t = Lt(), n = bt(), i = Ji(), s = Zr(), { S_IFMT: f, S_IFDIR: u, S_IFREG: b, S_IFLNK: g, S_IFCHR: A, O_APPEND: w } = n.constants, j = () => {
      var m, S;
      return (S = (m = r.default.getuid) === null || m === void 0 ? void 0 : m.call(r.default)) !== null && S !== void 0 ? S : 0;
    }, P = () => {
      var m, S;
      return (S = (m = r.default.getgid) === null || m === void 0 ? void 0 : m.call(r.default)) !== null && S !== void 0 ? S : 0;
    };
    e.SEP = "/";
    var x = class extends i.EventEmitter {
      constructor(m, S = 438) {
        super(), this._uid = j(), this._gid = P(), this._atime = /* @__PURE__ */ new Date(), this._mtime = /* @__PURE__ */ new Date(), this._ctime = /* @__PURE__ */ new Date(), this.rdev = 0, this._nlink = 1, this.mode = S, this.ino = m;
      }
      set ctime(m) {
        this._ctime = m;
      }
      get ctime() {
        return this._ctime;
      }
      set uid(m) {
        this._uid = m, this.ctime = /* @__PURE__ */ new Date();
      }
      get uid() {
        return this._uid;
      }
      set gid(m) {
        this._gid = m, this.ctime = /* @__PURE__ */ new Date();
      }
      get gid() {
        return this._gid;
      }
      set atime(m) {
        this._atime = m, this.ctime = /* @__PURE__ */ new Date();
      }
      get atime() {
        return this._atime;
      }
      set mtime(m) {
        this._mtime = m, this.ctime = /* @__PURE__ */ new Date();
      }
      get mtime() {
        return this._mtime;
      }
      get perm() {
        return this.mode & ~f;
      }
      set perm(m) {
        this.mode = this.mode & f | m & ~f, this.ctime = /* @__PURE__ */ new Date();
      }
      set nlink(m) {
        this._nlink = m, this.ctime = /* @__PURE__ */ new Date();
      }
      get nlink() {
        return this._nlink;
      }
      getString(m = "utf8") {
        return this.atime = /* @__PURE__ */ new Date(), this.getBuffer().toString(m);
      }
      setString(m) {
        this.buf = (0, t.bufferFrom)(m, "utf8"), this.touch();
      }
      getBuffer() {
        return this.atime = /* @__PURE__ */ new Date(), this.buf || this.setBuffer((0, t.bufferAllocUnsafe)(0)), (0, t.bufferFrom)(this.buf);
      }
      setBuffer(m) {
        this.buf = (0, t.bufferFrom)(m), this.touch();
      }
      getSize() {
        return this.buf ? this.buf.length : 0;
      }
      setModeProperty(m) {
        this.mode = m;
      }
      isFile() {
        return (this.mode & f) === b;
      }
      isDirectory() {
        return (this.mode & f) === u;
      }
      isSymlink() {
        return (this.mode & f) === g;
      }
      isCharacterDevice() {
        return (this.mode & f) === A;
      }
      makeSymlink(m) {
        this.mode = g | 438, this.symlink = m;
      }
      write(m, S = 0, _ = m.length, d = 0) {
        if (this.buf || (this.buf = (0, t.bufferAllocUnsafe)(0)), d + _ > this.buf.length) {
          const E = (0, t.bufferAllocUnsafe)(d + _);
          this.buf.copy(E, 0, 0, this.buf.length), this.buf = E;
        }
        return m.copy(this.buf, d, S, S + _), this.touch(), _;
      }
      // Returns the number of bytes read.
      read(m, S = 0, _ = m.byteLength, d = 0) {
        this.atime = /* @__PURE__ */ new Date(), this.buf || (this.buf = (0, t.bufferAllocUnsafe)(0));
        let E = _;
        E > m.byteLength && (E = m.byteLength), E + d > this.buf.length && (E = this.buf.length - d);
        const O = m instanceof t.Buffer ? m : t.Buffer.from(m.buffer);
        return this.buf.copy(O, S, d, d + E), E;
      }
      truncate(m = 0) {
        if (!m)
          this.buf = (0, t.bufferAllocUnsafe)(0);
        else if (this.buf || (this.buf = (0, t.bufferAllocUnsafe)(0)), m <= this.buf.length)
          this.buf = this.buf.slice(0, m);
        else {
          const S = (0, t.bufferAllocUnsafe)(m);
          this.buf.copy(S), S.fill(0, this.buf.length), this.buf = S;
        }
        this.touch();
      }
      chmod(m) {
        this.mode = this.mode & f | m & ~f, this.touch();
      }
      chown(m, S) {
        this.uid = m, this.gid = S, this.touch();
      }
      touch() {
        this.mtime = /* @__PURE__ */ new Date(), this.emit("change", this);
      }
      canRead(m = j(), S = P()) {
        return !!(this.perm & 4 || S === this.gid && this.perm & 32 || m === this.uid && this.perm & 256);
      }
      canWrite(m = j(), S = P()) {
        return !!(this.perm & 2 || S === this.gid && this.perm & 16 || m === this.uid && this.perm & 128);
      }
      canExecute(m = j(), S = P()) {
        return !!(this.perm & 1 || S === this.gid && this.perm & 8 || m === this.uid && this.perm & 64);
      }
      del() {
        this.emit("delete", this);
      }
      toJSON() {
        return {
          ino: this.ino,
          uid: this.uid,
          gid: this.gid,
          atime: this.atime.getTime(),
          mtime: this.mtime.getTime(),
          ctime: this.ctime.getTime(),
          perm: this.perm,
          mode: this.mode,
          nlink: this.nlink,
          symlink: this.symlink,
          data: this.getString()
        };
      }
    };
    e.Node = x;
    var p = class $r extends i.EventEmitter {
      get steps() {
        return this._steps;
      }
      // Recursively sync children steps, e.g. in case of dir rename
      set steps(S) {
        this._steps = S;
        for (const [_, d] of this.children.entries())
          _ === "." || _ === ".." || d?.syncSteps();
      }
      constructor(S, _, d) {
        super(), this.children = /* @__PURE__ */ new Map(), this._steps = [], this.ino = 0, this.length = 0, this.vol = S, this.parent = _, this.name = d, this.syncSteps();
      }
      setNode(S) {
        this.node = S, this.ino = S.ino;
      }
      getNode() {
        return this.node;
      }
      createChild(S, _ = this.vol.createNode(b | 438)) {
        const d = new $r(this.vol, this, S);
        return d.setNode(_), _.isDirectory() && (d.children.set(".", d), d.getNode().nlink++), this.setChild(S, d), d;
      }
      setChild(S, _ = new $r(this.vol, this, S)) {
        return this.children.set(S, _), _.parent = this, this.length++, _.getNode().isDirectory() && (_.children.set("..", this), this.getNode().nlink++), this.getNode().mtime = /* @__PURE__ */ new Date(), this.emit("child:add", _, this), _;
      }
      deleteChild(S) {
        S.getNode().isDirectory() && (S.children.delete(".."), this.getNode().nlink--), this.children.delete(S.getName()), this.length--, this.getNode().mtime = /* @__PURE__ */ new Date(), this.emit("child:delete", S, this);
      }
      getChild(S) {
        return this.getNode().mtime = /* @__PURE__ */ new Date(), this.children.get(S);
      }
      getPath() {
        return this.steps.join(e.SEP);
      }
      getParentPath() {
        return this.steps.slice(0, -1).join(e.SEP);
      }
      getName() {
        return this.steps[this.steps.length - 1];
      }
      // del() {
      //     const parent = this.parent;
      //     if(parent) {
      //         parent.deleteChild(link);
      //     }
      //     this.parent = null;
      //     this.vol = null;
      // }
      toJSON() {
        return {
          steps: this.steps,
          ino: this.ino,
          children: Array.from(this.children.keys())
        };
      }
      syncSteps() {
        this.steps = this.parent ? this.parent.steps.concat([this.name]) : [this.name];
      }
    };
    e.Link = p;
    var y = class {
      /**
       * Open a Link-Node pair. `node` is provided separately as that might be a different node
       * rather the one `link` points to, because it might be a symlink.
       * @param link
       * @param node
       * @param flags
       * @param fd
       */
      constructor(m, S, _, d) {
        this.link = m, this.node = S, this.flags = _, this.fd = d, this.position = 0, this.flags & w && (this.position = this.getSize());
      }
      getString(m = "utf8") {
        return this.node.getString();
      }
      setString(m) {
        this.node.setString(m);
      }
      getBuffer() {
        return this.node.getBuffer();
      }
      setBuffer(m) {
        this.node.setBuffer(m);
      }
      getSize() {
        return this.node.getSize();
      }
      truncate(m) {
        this.node.truncate(m);
      }
      seekTo(m) {
        this.position = m;
      }
      stats() {
        return s.default.build(this.node);
      }
      write(m, S = 0, _ = m.length, d) {
        typeof d != "number" && (d = this.position);
        const E = this.node.write(m, S, _, d);
        return this.position = d + E, E;
      }
      read(m, S = 0, _ = m.byteLength, d) {
        typeof d != "number" && (d = this.position);
        const E = this.node.read(m, S, _, d);
        return this.position = d + E, E;
      }
      chmod(m) {
        this.node.chmod(m);
      }
      chown(m, S) {
        this.node.chown(m, S);
      }
    };
    e.File = y;
  }
}), sc = ce({
  "node_modules/memfs/lib/setImmediate.js"(e) {
    Object.defineProperty(e, "__esModule", { value: !0 });
    var r;
    typeof setImmediate == "function" ? r = setImmediate.bind(typeof globalThis < "u" ? globalThis : global) : r = setTimeout.bind(typeof globalThis < "u" ? globalThis : global), e.default = r;
  }
}), Zi = ce({
  "node_modules/memfs/lib/queueMicrotask.js"(e) {
    Object.defineProperty(e, "__esModule", { value: !0 }), e.default = typeof queueMicrotask == "function" ? queueMicrotask : (r) => Promise.resolve().then(() => r()).catch(() => {
    });
  }
}), ac = ce({
  "node_modules/memfs/lib/setTimeoutUnref.js"(e) {
    Object.defineProperty(e, "__esModule", { value: !0 });
    function r(t, n, i) {
      const s = setTimeout.apply(typeof globalThis < "u" ? globalThis : global, arguments);
      return s && typeof s == "object" && typeof s.unref == "function" && s.unref(), s;
    }
    e.default = r;
  }
}), cc = ce({
  "node_modules/component-emitter/index.js"(e, r) {
    function t(i) {
      if (i)
        return n(i);
      this._callbacks = /* @__PURE__ */ new Map();
    }
    function n(i) {
      return Object.assign(i, t.prototype), i._callbacks = /* @__PURE__ */ new Map(), i;
    }
    t.prototype.on = function(i, s) {
      const f = this._callbacks.get(i) ?? [];
      return f.push(s), this._callbacks.set(i, f), this;
    }, t.prototype.once = function(i, s) {
      const f = (...u) => {
        this.off(i, f), s.apply(this, u);
      };
      return f.fn = s, this.on(i, f), this;
    }, t.prototype.off = function(i, s) {
      if (i === void 0 && s === void 0)
        return this._callbacks.clear(), this;
      if (s === void 0)
        return this._callbacks.delete(i), this;
      const f = this._callbacks.get(i);
      if (f) {
        for (const [u, b] of f.entries())
          if (b === s || b.fn === s) {
            f.splice(u, 1);
            break;
          }
        f.length === 0 ? this._callbacks.delete(i) : this._callbacks.set(i, f);
      }
      return this;
    }, t.prototype.emit = function(i, ...s) {
      const f = this._callbacks.get(i);
      if (f) {
        const u = [...f];
        for (const b of u)
          b.apply(this, s);
      }
      return this;
    }, t.prototype.listeners = function(i) {
      return this._callbacks.get(i) ?? [];
    }, t.prototype.listenerCount = function(i) {
      if (i)
        return this.listeners(i).length;
      let s = 0;
      for (const f of this._callbacks.values())
        s += f.length;
      return s;
    }, t.prototype.hasListeners = function(i) {
      return this.listenerCount(i) > 0;
    }, t.prototype.addEventListener = t.prototype.on, t.prototype.removeListener = t.prototype.off, t.prototype.removeEventListener = t.prototype.off, t.prototype.removeAllListeners = t.prototype.off, typeof r < "u" && (r.exports = t);
  }
}), lc = ce({
  "node_modules/stream/index.js"(e, r) {
    var t = cc();
    function n() {
      t.call(this);
    }
    n.prototype = new t(), r.exports = n, n.Stream = n, n.prototype.pipe = function(i, s) {
      var f = this;
      function u(x) {
        i.writable && i.write(x) === !1 && f.pause && f.pause();
      }
      f.on("data", u);
      function b() {
        f.readable && f.resume && f.resume();
      }
      i.on("drain", b), !i._isStdio && (!s || s.end !== !1) && (f.on("end", A), f.on("close", w));
      var g = !1;
      function A() {
        g || (g = !0, i.end());
      }
      function w() {
        g || (g = !0, typeof i.destroy == "function" && i.destroy());
      }
      function j(x) {
        if (P(), !this.hasListeners("error"))
          throw x;
      }
      f.on("error", j), i.on("error", j);
      function P() {
        f.off("data", u), i.off("drain", b), f.off("end", A), f.off("close", w), f.off("error", j), i.off("error", j), f.off("end", P), f.off("close", P), i.off("end", P), i.off("close", P);
      }
      return f.on("end", P), f.on("close", P), i.on("end", P), i.on("close", P), i.emit("pipe", f), i;
    };
  }
}), ln = ce({
  "node_modules/memfs/lib/node/constants.js"(e) {
    Object.defineProperty(e, "__esModule", { value: !0 }), e.FLAGS = e.ERRSTR = void 0;
    var r = bt();
    e.ERRSTR = {
      PATH_STR: "path must be a string, Buffer, or Uint8Array",
      // FD:             'file descriptor must be a unsigned 32-bit integer',
      FD: "fd must be a file descriptor",
      MODE_INT: "mode must be an int",
      CB: "callback must be a function",
      UID: "uid must be an unsigned int",
      GID: "gid must be an unsigned int",
      LEN: "len must be an integer",
      ATIME: "atime must be an integer",
      MTIME: "mtime must be an integer",
      PREFIX: "filename prefix is required",
      BUFFER: "buffer must be an instance of Buffer or StaticBuffer",
      OFFSET: "offset must be an integer",
      LENGTH: "length must be an integer",
      POSITION: "position must be an integer"
    };
    var { O_RDONLY: t, O_WRONLY: n, O_RDWR: i, O_CREAT: s, O_EXCL: f, O_TRUNC: u, O_APPEND: b, O_SYNC: g } = r.constants, A;
    (function(w) {
      w[w.r = t] = "r", w[w["r+"] = i] = "r+", w[w.rs = t | g] = "rs", w[w.sr = w.rs] = "sr", w[w["rs+"] = i | g] = "rs+", w[w["sr+"] = w["rs+"]] = "sr+", w[w.w = n | s | u] = "w", w[w.wx = n | s | u | f] = "wx", w[w.xw = w.wx] = "xw", w[w["w+"] = i | s | u] = "w+", w[w["wx+"] = i | s | u | f] = "wx+", w[w["xw+"] = w["wx+"]] = "xw+", w[w.a = n | b | s] = "a", w[w.ax = n | b | s | f] = "ax", w[w.xa = w.ax] = "xa", w[w["a+"] = i | b | s] = "a+", w[w["ax+"] = i | b | s | f] = "ax+", w[w["xa+"] = w["ax+"]] = "xa+";
    })(A || (e.FLAGS = A = {}));
  }
}), $t = ce({
  "node_modules/memfs/lib/node/util.js"(e) {
    Object.defineProperty(e, "__esModule", { value: !0 }), e.unixify = e.getWriteSyncArgs = e.getWriteArgs = e.bufToUint8 = e.isWin = void 0, e.promisify = u, e.validateCallback = b, e.modeToNumber = A, e.nullCheck = w, e.pathToFilename = P, e.createError = le, e.genRndStr6 = pe, e.flagsToNumber = me, e.isFd = he, e.validateFd = X, e.streamToBuffer = te, e.dataToBuffer = ae, e.bufferToEncoding = D, e.isReadableStream = W;
    var r = ln(), t = Yi(), n = Lt(), i = br(), s = Lt(), f = Zi();
    e.isWin = we.platform === "win32";
    function u(L, G, Q = (oe) => oe) {
      return (...oe) => new Promise((de, ge) => {
        L[G].bind(L)(...oe, (ye, be) => ye ? ge(ye) : de(Q(be)));
      });
    }
    function b(L) {
      if (typeof L != "function")
        throw TypeError(r.ERRSTR.CB);
      return L;
    }
    function g(L, G) {
      if (typeof L == "number")
        return L;
      if (typeof L == "string")
        return parseInt(L, 8);
      if (G)
        return A(G);
    }
    function A(L, G) {
      const Q = g(L, G);
      if (typeof Q != "number" || isNaN(Q))
        throw new TypeError(r.ERRSTR.MODE_INT);
      return Q;
    }
    function w(L, G) {
      if (("" + L).indexOf("\0") !== -1) {
        const Q = new Error("Path must be a string without null bytes");
        if (Q.code = "ENOENT", typeof G != "function")
          throw Q;
        return (0, f.default)(() => {
          G(Q);
        }), !1;
      }
      return !0;
    }
    function j(L) {
      if (L.hostname !== "")
        throw new t.TypeError("ERR_INVALID_FILE_URL_HOST", we.platform);
      const G = L.pathname;
      for (let Q = 0; Q < G.length; Q++)
        if (G[Q] === "%") {
          const oe = G.codePointAt(Q + 2) | 32;
          if (G[Q + 1] === "2" && oe === 102)
            throw new t.TypeError("ERR_INVALID_FILE_URL_PATH", "must not include encoded / characters");
        }
      return decodeURIComponent(G);
    }
    function P(L) {
      if (L instanceof Uint8Array && (L = (0, s.bufferFrom)(L)), typeof L != "string" && !n.Buffer.isBuffer(L)) {
        try {
          if (!(L instanceof oa("url").URL))
            throw new TypeError(r.ERRSTR.PATH_STR);
        } catch {
          throw new TypeError(r.ERRSTR.PATH_STR);
        }
        L = j(L);
      }
      const G = String(L);
      return w(G), G;
    }
    var x = "ENOENT", p = "EBADF", y = "EINVAL", m = "EPERM", S = "EPROTO", _ = "EEXIST", d = "ENOTDIR", E = "EMFILE", O = "EACCES", T = "EISDIR", F = "ENOTEMPTY", C = "ENOSYS", J = "ERR_FS_EISDIR", Z = "ERR_OUT_OF_RANGE";
    function se(L, G = "", Q = "", oe = "") {
      let de = "";
      switch (Q && (de = ` '${Q}'`), oe && (de += ` -> '${oe}'`), L) {
        case x:
          return `ENOENT: no such file or directory, ${G}${de}`;
        case p:
          return `EBADF: bad file descriptor, ${G}${de}`;
        case y:
          return `EINVAL: invalid argument, ${G}${de}`;
        case m:
          return `EPERM: operation not permitted, ${G}${de}`;
        case S:
          return `EPROTO: protocol error, ${G}${de}`;
        case _:
          return `EEXIST: file already exists, ${G}${de}`;
        case d:
          return `ENOTDIR: not a directory, ${G}${de}`;
        case T:
          return `EISDIR: illegal operation on a directory, ${G}${de}`;
        case O:
          return `EACCES: permission denied, ${G}${de}`;
        case F:
          return `ENOTEMPTY: directory not empty, ${G}${de}`;
        case E:
          return `EMFILE: too many open files, ${G}${de}`;
        case C:
          return `ENOSYS: function not implemented, ${G}${de}`;
        case J:
          return `[ERR_FS_EISDIR]: Path is a directory: ${G} returned EISDIR (is a directory) ${Q}`;
        case Z:
          return `[ERR_OUT_OF_RANGE]: value out of range, ${G}${de}`;
        default:
          return `${L}: error occurred, ${G}${de}`;
      }
    }
    function le(L, G = "", Q = "", oe = "", de = Error) {
      const ge = new de(se(L, G, Q, oe));
      return ge.code = L, Q && (ge.path = Q), ge;
    }
    function pe() {
      const L = (Math.random() + 1).toString(36).substring(2, 8);
      return L.length === 6 ? L : pe();
    }
    function me(L) {
      if (typeof L == "number")
        return L;
      if (typeof L == "string") {
        const G = r.FLAGS[L];
        if (typeof G < "u")
          return G;
      }
      throw new t.TypeError("ERR_INVALID_OPT_VALUE", "flags", L);
    }
    function he(L) {
      return L >>> 0 === L;
    }
    function X(L) {
      if (!he(L))
        throw TypeError(r.ERRSTR.FD);
    }
    function te(L) {
      const G = [];
      return new Promise((Q, oe) => {
        L.on("data", (de) => G.push(de)), L.on("end", () => Q(n.Buffer.concat(G))), L.on("error", oe);
      });
    }
    function ae(L, G = i.ENCODING_UTF8) {
      return n.Buffer.isBuffer(L) ? L : L instanceof Uint8Array ? (0, s.bufferFrom)(L) : (0, s.bufferFrom)(String(L), G);
    }
    var fe = (L) => new Uint8Array(L.buffer, L.byteOffset, L.byteLength);
    e.bufToUint8 = fe;
    var ee = (L, G, Q, oe, de, ge) => {
      X(L);
      let ye = 0, be, Oe = null, _e, ie;
      const Re = typeof G, xe = typeof Q, Ae = typeof oe, Ee = typeof de;
      Re !== "string" ? xe === "function" ? ie = Q : Ae === "function" ? (ye = Q | 0, ie = oe) : Ee === "function" ? (ye = Q | 0, be = oe, ie = de) : (ye = Q | 0, be = oe, Oe = de, ie = ge) : xe === "function" ? ie = Q : Ae === "function" ? (Oe = Q, ie = oe) : Ee === "function" && (Oe = Q, _e = oe, ie = de);
      const Ne = ae(G, _e);
      Re !== "string" ? typeof be > "u" && (be = Ne.length) : (ye = 0, be = Ne.length);
      const ke = b(ie);
      return [L, Re === "string", Ne, ye, be, Oe, ke];
    };
    e.getWriteArgs = ee;
    var R = (L, G, Q, oe, de) => {
      X(L);
      let ge, ye, be, Oe;
      const _e = typeof G != "string";
      _e ? (ye = (Q || 0) | 0, be = oe, Oe = de) : (Oe = Q, ge = oe);
      const ie = ae(G, ge);
      return _e ? typeof be > "u" && (be = ie.length) : (ye = 0, be = ie.length), [L, ie, ye || 0, be, Oe];
    };
    e.getWriteSyncArgs = R;
    function D(L, G) {
      return !G || G === "buffer" ? L : L.toString(G);
    }
    function W(L) {
      return L !== null && typeof L == "object" && typeof L.pipe == "function" && typeof L.on == "function" && L.readable === !0;
    }
    var re = (L, G) => {
      let Q = L[G];
      return G > 0 && (Q === "/" || e.isWin && Q === "\\");
    }, M = (L) => {
      let G = L.length - 1;
      if (G < 2)
        return L;
      for (; re(L, G); )
        G--;
      return L.substr(0, G + 1);
    }, $ = (L, G) => {
      if (typeof L != "string")
        throw new TypeError("expected a string");
      return L = L.replace(/[\\\/]+/g, "/"), G !== !1 && (L = M(L)), L;
    }, q = (L, G = !0) => e.isWin ? (L = $(L, G), L.replace(/^([a-zA-Z]+:|\.\/)/, "")) : L;
    e.unixify = q;
  }
}), fc = ce({
  "node_modules/memfs/lib/node/FileHandle.js"(e) {
    Object.defineProperty(e, "__esModule", { value: !0 }), e.FileHandle = void 0;
    var r = $t(), t = class {
      constructor(n, i) {
        this.fs = n, this.fd = i;
      }
      appendFile(n, i) {
        return (0, r.promisify)(this.fs, "appendFile")(this.fd, n, i);
      }
      chmod(n) {
        return (0, r.promisify)(this.fs, "fchmod")(this.fd, n);
      }
      chown(n, i) {
        return (0, r.promisify)(this.fs, "fchown")(this.fd, n, i);
      }
      close() {
        return (0, r.promisify)(this.fs, "close")(this.fd);
      }
      datasync() {
        return (0, r.promisify)(this.fs, "fdatasync")(this.fd);
      }
      createReadStream(n) {
        return this.fs.createReadStream("", Object.assign(Object.assign({}, n), { fd: this }));
      }
      createWriteStream(n) {
        return this.fs.createWriteStream("", Object.assign(Object.assign({}, n), { fd: this }));
      }
      readableWebStream(n) {
        return new ReadableStream({
          pull: async (i) => {
            const s = await this.readFile();
            i.enqueue(s), i.close();
          }
        });
      }
      read(n, i, s, f) {
        return (0, r.promisify)(this.fs, "read", (u) => ({ bytesRead: u, buffer: n }))(this.fd, n, i, s, f);
      }
      readv(n, i) {
        return (0, r.promisify)(this.fs, "readv", (s) => ({ bytesRead: s, buffers: n }))(this.fd, n, i);
      }
      readFile(n) {
        return (0, r.promisify)(this.fs, "readFile")(this.fd, n);
      }
      stat(n) {
        return (0, r.promisify)(this.fs, "fstat")(this.fd, n);
      }
      sync() {
        return (0, r.promisify)(this.fs, "fsync")(this.fd);
      }
      truncate(n) {
        return (0, r.promisify)(this.fs, "ftruncate")(this.fd, n);
      }
      utimes(n, i) {
        return (0, r.promisify)(this.fs, "futimes")(this.fd, n, i);
      }
      write(n, i, s, f) {
        return (0, r.promisify)(this.fs, "write", (u) => ({ bytesWritten: u, buffer: n }))(this.fd, n, i, s, f);
      }
      writev(n, i) {
        return (0, r.promisify)(this.fs, "writev", (s) => ({ bytesWritten: s, buffers: n }))(this.fd, n, i);
      }
      writeFile(n, i) {
        return (0, r.promisify)(this.fs, "writeFile")(this.fd, n, i);
      }
    };
    e.FileHandle = t;
  }
}), uc = ce({
  "node_modules/memfs/lib/node/FsPromises.js"(e) {
    Object.defineProperty(e, "__esModule", { value: !0 }), e.FsPromises = void 0;
    var r = $t(), t = bt(), n = class {
      constructor(i, s) {
        this.fs = i, this.FileHandle = s, this.constants = t.constants, this.cp = (0, r.promisify)(this.fs, "cp"), this.opendir = (0, r.promisify)(this.fs, "opendir"), this.statfs = (0, r.promisify)(this.fs, "statfs"), this.lutimes = (0, r.promisify)(this.fs, "lutimes"), this.access = (0, r.promisify)(this.fs, "access"), this.chmod = (0, r.promisify)(this.fs, "chmod"), this.chown = (0, r.promisify)(this.fs, "chown"), this.copyFile = (0, r.promisify)(this.fs, "copyFile"), this.lchmod = (0, r.promisify)(this.fs, "lchmod"), this.lchown = (0, r.promisify)(this.fs, "lchown"), this.link = (0, r.promisify)(this.fs, "link"), this.lstat = (0, r.promisify)(this.fs, "lstat"), this.mkdir = (0, r.promisify)(this.fs, "mkdir"), this.mkdtemp = (0, r.promisify)(this.fs, "mkdtemp"), this.readdir = (0, r.promisify)(this.fs, "readdir"), this.readlink = (0, r.promisify)(this.fs, "readlink"), this.realpath = (0, r.promisify)(this.fs, "realpath"), this.rename = (0, r.promisify)(this.fs, "rename"), this.rmdir = (0, r.promisify)(this.fs, "rmdir"), this.rm = (0, r.promisify)(this.fs, "rm"), this.stat = (0, r.promisify)(this.fs, "stat"), this.symlink = (0, r.promisify)(this.fs, "symlink"), this.truncate = (0, r.promisify)(this.fs, "truncate"), this.unlink = (0, r.promisify)(this.fs, "unlink"), this.utimes = (0, r.promisify)(this.fs, "utimes"), this.readFile = (f, u) => (0, r.promisify)(this.fs, "readFile")(f instanceof this.FileHandle ? f.fd : f, u), this.appendFile = (f, u, b) => (0, r.promisify)(this.fs, "appendFile")(f instanceof this.FileHandle ? f.fd : f, u, b), this.open = (f, u = "r", b) => (0, r.promisify)(this.fs, "open", (g) => new this.FileHandle(this.fs, g))(f, u, b), this.writeFile = (f, u, b) => ((0, r.isReadableStream)(u) ? (0, r.streamToBuffer)(u) : Promise.resolve(u)).then((A) => (0, r.promisify)(this.fs, "writeFile")(f instanceof this.FileHandle ? f.fd : f, A, b)), this.watch = () => {
          throw new Error("Not implemented");
        };
      }
    };
    e.FsPromises = n;
  }
}), zi = {};
aa(zi, {
  __addDisposableResource: () => wo,
  __assign: () => Pt,
  __asyncDelegator: () => uo,
  __asyncGenerator: () => fo,
  __asyncValues: () => po,
  __await: () => Ot,
  __awaiter: () => io,
  __classPrivateFieldGet: () => go,
  __classPrivateFieldIn: () => bo,
  __classPrivateFieldSet: () => vo,
  __createBinding: () => Ut,
  __decorate: () => to,
  __disposeResources: () => _o,
  __esDecorate: () => dc,
  __exportStar: () => so,
  __extends: () => Qi,
  __generator: () => oo,
  __importDefault: () => yo,
  __importStar: () => mo,
  __makeTemplateObject: () => ho,
  __metadata: () => no,
  __param: () => ro,
  __propKey: () => hc,
  __read: () => fn,
  __rest: () => eo,
  __runInitializers: () => pc,
  __setFunctionName: () => mc,
  __spread: () => ao,
  __spreadArray: () => lo,
  __spreadArrays: () => co,
  __values: () => lr,
  default: () => So
});
function Qi(e, r) {
  if (typeof r != "function" && r !== null)
    throw new TypeError("Class extends value " + String(r) + " is not a constructor or null");
  ir(e, r);
  function t() {
    this.constructor = e;
  }
  e.prototype = r === null ? Object.create(r) : (t.prototype = r.prototype, new t());
}
function eo(e, r) {
  var t = {};
  for (var n in e) Object.prototype.hasOwnProperty.call(e, n) && r.indexOf(n) < 0 && (t[n] = e[n]);
  if (e != null && typeof Object.getOwnPropertySymbols == "function")
    for (var i = 0, n = Object.getOwnPropertySymbols(e); i < n.length; i++)
      r.indexOf(n[i]) < 0 && Object.prototype.propertyIsEnumerable.call(e, n[i]) && (t[n[i]] = e[n[i]]);
  return t;
}
function to(e, r, t, n) {
  var i = arguments.length, s = i < 3 ? r : n === null ? n = Object.getOwnPropertyDescriptor(r, t) : n, f;
  if (typeof Reflect == "object" && typeof Reflect.decorate == "function") s = Reflect.decorate(e, r, t, n);
  else for (var u = e.length - 1; u >= 0; u--) (f = e[u]) && (s = (i < 3 ? f(s) : i > 3 ? f(r, t, s) : f(r, t)) || s);
  return i > 3 && s && Object.defineProperty(r, t, s), s;
}
function ro(e, r) {
  return function(t, n) {
    r(t, n, e);
  };
}
function dc(e, r, t, n, i, s) {
  function f(m) {
    if (m !== void 0 && typeof m != "function") throw new TypeError("Function expected");
    return m;
  }
  for (var u = n.kind, b = u === "getter" ? "get" : u === "setter" ? "set" : "value", g = !r && e ? n.static ? e : e.prototype : null, A = r || (g ? Object.getOwnPropertyDescriptor(g, n.name) : {}), w, j = !1, P = t.length - 1; P >= 0; P--) {
    var x = {};
    for (var p in n) x[p] = p === "access" ? {} : n[p];
    for (var p in n.access) x.access[p] = n.access[p];
    x.addInitializer = function(m) {
      if (j) throw new TypeError("Cannot add initializers after decoration has completed");
      s.push(f(m || null));
    };
    var y = (0, t[P])(u === "accessor" ? { get: A.get, set: A.set } : A[b], x);
    if (u === "accessor") {
      if (y === void 0) continue;
      if (y === null || typeof y != "object") throw new TypeError("Object expected");
      (w = f(y.get)) && (A.get = w), (w = f(y.set)) && (A.set = w), (w = f(y.init)) && i.unshift(w);
    } else (w = f(y)) && (u === "field" ? i.unshift(w) : A[b] = w);
  }
  g && Object.defineProperty(g, n.name, A), j = !0;
}
function pc(e, r, t) {
  for (var n = arguments.length > 2, i = 0; i < r.length; i++)
    t = n ? r[i].call(e, t) : r[i].call(e);
  return n ? t : void 0;
}
function hc(e) {
  return typeof e == "symbol" ? e : "".concat(e);
}
function mc(e, r, t) {
  return typeof r == "symbol" && (r = r.description ? "[".concat(r.description, "]") : ""), Object.defineProperty(e, "name", { configurable: !0, value: t ? "".concat(t, " ", r) : r });
}
function no(e, r) {
  if (typeof Reflect == "object" && typeof Reflect.metadata == "function") return Reflect.metadata(e, r);
}
function io(e, r, t, n) {
  function i(s) {
    return s instanceof t ? s : new t(function(f) {
      f(s);
    });
  }
  return new (t || (t = Promise))(function(s, f) {
    function u(A) {
      try {
        g(n.next(A));
      } catch (w) {
        f(w);
      }
    }
    function b(A) {
      try {
        g(n.throw(A));
      } catch (w) {
        f(w);
      }
    }
    function g(A) {
      A.done ? s(A.value) : i(A.value).then(u, b);
    }
    g((n = n.apply(e, r || [])).next());
  });
}
function oo(e, r) {
  var t = { label: 0, sent: function() {
    if (s[0] & 1) throw s[1];
    return s[1];
  }, trys: [], ops: [] }, n, i, s, f;
  return f = { next: u(0), throw: u(1), return: u(2) }, typeof Symbol == "function" && (f[Symbol.iterator] = function() {
    return this;
  }), f;
  function u(g) {
    return function(A) {
      return b([g, A]);
    };
  }
  function b(g) {
    if (n) throw new TypeError("Generator is already executing.");
    for (; f && (f = 0, g[0] && (t = 0)), t; ) try {
      if (n = 1, i && (s = g[0] & 2 ? i.return : g[0] ? i.throw || ((s = i.return) && s.call(i), 0) : i.next) && !(s = s.call(i, g[1])).done) return s;
      switch (i = 0, s && (g = [g[0] & 2, s.value]), g[0]) {
        case 0:
        case 1:
          s = g;
          break;
        case 4:
          return t.label++, { value: g[1], done: !1 };
        case 5:
          t.label++, i = g[1], g = [0];
          continue;
        case 7:
          g = t.ops.pop(), t.trys.pop();
          continue;
        default:
          if (s = t.trys, !(s = s.length > 0 && s[s.length - 1]) && (g[0] === 6 || g[0] === 2)) {
            t = 0;
            continue;
          }
          if (g[0] === 3 && (!s || g[1] > s[0] && g[1] < s[3])) {
            t.label = g[1];
            break;
          }
          if (g[0] === 6 && t.label < s[1]) {
            t.label = s[1], s = g;
            break;
          }
          if (s && t.label < s[2]) {
            t.label = s[2], t.ops.push(g);
            break;
          }
          s[2] && t.ops.pop(), t.trys.pop();
          continue;
      }
      g = r.call(e, t);
    } catch (A) {
      g = [6, A], i = 0;
    } finally {
      n = s = 0;
    }
    if (g[0] & 5) throw g[1];
    return { value: g[0] ? g[1] : void 0, done: !0 };
  }
}
function so(e, r) {
  for (var t in e) t !== "default" && !Object.prototype.hasOwnProperty.call(r, t) && Ut(r, e, t);
}
function lr(e) {
  var r = typeof Symbol == "function" && Symbol.iterator, t = r && e[r], n = 0;
  if (t) return t.call(e);
  if (e && typeof e.length == "number") return {
    next: function() {
      return e && n >= e.length && (e = void 0), { value: e && e[n++], done: !e };
    }
  };
  throw new TypeError(r ? "Object is not iterable." : "Symbol.iterator is not defined.");
}
function fn(e, r) {
  var t = typeof Symbol == "function" && e[Symbol.iterator];
  if (!t) return e;
  var n = t.call(e), i, s = [], f;
  try {
    for (; (r === void 0 || r-- > 0) && !(i = n.next()).done; ) s.push(i.value);
  } catch (u) {
    f = { error: u };
  } finally {
    try {
      i && !i.done && (t = n.return) && t.call(n);
    } finally {
      if (f) throw f.error;
    }
  }
  return s;
}
function ao() {
  for (var e = [], r = 0; r < arguments.length; r++)
    e = e.concat(fn(arguments[r]));
  return e;
}
function co() {
  for (var e = 0, r = 0, t = arguments.length; r < t; r++) e += arguments[r].length;
  for (var n = Array(e), i = 0, r = 0; r < t; r++)
    for (var s = arguments[r], f = 0, u = s.length; f < u; f++, i++)
      n[i] = s[f];
  return n;
}
function lo(e, r, t) {
  if (t || arguments.length === 2) for (var n = 0, i = r.length, s; n < i; n++)
    (s || !(n in r)) && (s || (s = Array.prototype.slice.call(r, 0, n)), s[n] = r[n]);
  return e.concat(s || Array.prototype.slice.call(r));
}
function Ot(e) {
  return this instanceof Ot ? (this.v = e, this) : new Ot(e);
}
function fo(e, r, t) {
  if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
  var n = t.apply(e, r || []), i, s = [];
  return i = {}, f("next"), f("throw"), f("return"), i[Symbol.asyncIterator] = function() {
    return this;
  }, i;
  function f(j) {
    n[j] && (i[j] = function(P) {
      return new Promise(function(x, p) {
        s.push([j, P, x, p]) > 1 || u(j, P);
      });
    });
  }
  function u(j, P) {
    try {
      b(n[j](P));
    } catch (x) {
      w(s[0][3], x);
    }
  }
  function b(j) {
    j.value instanceof Ot ? Promise.resolve(j.value.v).then(g, A) : w(s[0][2], j);
  }
  function g(j) {
    u("next", j);
  }
  function A(j) {
    u("throw", j);
  }
  function w(j, P) {
    j(P), s.shift(), s.length && u(s[0][0], s[0][1]);
  }
}
function uo(e) {
  var r, t;
  return r = {}, n("next"), n("throw", function(i) {
    throw i;
  }), n("return"), r[Symbol.iterator] = function() {
    return this;
  }, r;
  function n(i, s) {
    r[i] = e[i] ? function(f) {
      return (t = !t) ? { value: Ot(e[i](f)), done: !1 } : s ? s(f) : f;
    } : s;
  }
}
function po(e) {
  if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
  var r = e[Symbol.asyncIterator], t;
  return r ? r.call(e) : (e = typeof lr == "function" ? lr(e) : e[Symbol.iterator](), t = {}, n("next"), n("throw"), n("return"), t[Symbol.asyncIterator] = function() {
    return this;
  }, t);
  function n(s) {
    t[s] = e[s] && function(f) {
      return new Promise(function(u, b) {
        f = e[s](f), i(u, b, f.done, f.value);
      });
    };
  }
  function i(s, f, u, b) {
    Promise.resolve(b).then(function(g) {
      s({ value: g, done: u });
    }, f);
  }
}
function ho(e, r) {
  return Object.defineProperty ? Object.defineProperty(e, "raw", { value: r }) : e.raw = r, e;
}
function mo(e) {
  if (e && e.__esModule) return e;
  var r = {};
  if (e != null)
    for (var t in e) t !== "default" && Object.prototype.hasOwnProperty.call(e, t) && Ut(r, e, t);
  return xo(r, e), r;
}
function yo(e) {
  return e && e.__esModule ? e : { default: e };
}
function go(e, r, t, n) {
  if (t === "a" && !n) throw new TypeError("Private accessor was defined without a getter");
  if (typeof r == "function" ? e !== r || !n : !r.has(e)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
  return t === "m" ? n : t === "a" ? n.call(e) : n ? n.value : r.get(e);
}
function vo(e, r, t, n, i) {
  if (n === "m") throw new TypeError("Private method is not writable");
  if (n === "a" && !i) throw new TypeError("Private accessor was defined without a setter");
  if (typeof r == "function" ? e !== r || !i : !r.has(e)) throw new TypeError("Cannot write private member to an object whose class did not declare it");
  return n === "a" ? i.call(e, t) : i ? i.value = t : r.set(e, t), t;
}
function bo(e, r) {
  if (r === null || typeof r != "object" && typeof r != "function") throw new TypeError("Cannot use 'in' operator on non-object");
  return typeof e == "function" ? r === e : e.has(r);
}
function wo(e, r, t) {
  if (r != null) {
    if (typeof r != "object" && typeof r != "function") throw new TypeError("Object expected.");
    var n;
    if (t) {
      if (!Symbol.asyncDispose) throw new TypeError("Symbol.asyncDispose is not defined.");
      n = r[Symbol.asyncDispose];
    }
    if (n === void 0) {
      if (!Symbol.dispose) throw new TypeError("Symbol.dispose is not defined.");
      n = r[Symbol.dispose];
    }
    if (typeof n != "function") throw new TypeError("Object not disposable.");
    e.stack.push({ value: r, dispose: n, async: t });
  } else t && e.stack.push({ async: !0 });
  return r;
}
function _o(e) {
  function r(n) {
    e.error = e.hasError ? new Eo(n, e.error, "An error was suppressed during disposal.") : n, e.hasError = !0;
  }
  function t() {
    for (; e.stack.length; ) {
      var n = e.stack.pop();
      try {
        var i = n.dispose && n.dispose.call(n.value);
        if (n.async) return Promise.resolve(i).then(t, function(s) {
          return r(s), t();
        });
      } catch (s) {
        r(s);
      }
    }
    if (e.hasError) throw e.error;
  }
  return t();
}
var ir, Pt, Ut, xo, Eo, So, yc = sa({
  "node_modules/tslib/tslib.es6.mjs"() {
    ir = function(e, r) {
      return ir = Object.setPrototypeOf || { __proto__: [] } instanceof Array && function(t, n) {
        t.__proto__ = n;
      } || function(t, n) {
        for (var i in n) Object.prototype.hasOwnProperty.call(n, i) && (t[i] = n[i]);
      }, ir(e, r);
    }, Pt = function() {
      return Pt = Object.assign || function(r) {
        for (var t, n = 1, i = arguments.length; n < i; n++) {
          t = arguments[n];
          for (var s in t) Object.prototype.hasOwnProperty.call(t, s) && (r[s] = t[s]);
        }
        return r;
      }, Pt.apply(this, arguments);
    }, Ut = Object.create ? function(e, r, t, n) {
      n === void 0 && (n = t);
      var i = Object.getOwnPropertyDescriptor(r, t);
      (!i || ("get" in i ? !r.__esModule : i.writable || i.configurable)) && (i = { enumerable: !0, get: function() {
        return r[t];
      } }), Object.defineProperty(e, n, i);
    } : function(e, r, t, n) {
      n === void 0 && (n = t), e[n] = r[t];
    }, xo = Object.create ? function(e, r) {
      Object.defineProperty(e, "default", { enumerable: !0, value: r });
    } : function(e, r) {
      e.default = r;
    }, Eo = typeof SuppressedError == "function" ? SuppressedError : function(e, r, t) {
      var n = new Error(t);
      return n.name = "SuppressedError", n.error = e, n.suppressed = r, n;
    }, So = {
      __extends: Qi,
      __assign: Pt,
      __rest: eo,
      __decorate: to,
      __param: ro,
      __metadata: no,
      __awaiter: io,
      __generator: oo,
      __createBinding: Ut,
      __exportStar: so,
      __values: lr,
      __read: fn,
      __spread: ao,
      __spreadArrays: co,
      __spreadArray: lo,
      __await: Ot,
      __asyncGenerator: fo,
      __asyncDelegator: uo,
      __asyncValues: po,
      __makeTemplateObject: ho,
      __importStar: mo,
      __importDefault: yo,
      __classPrivateFieldGet: go,
      __classPrivateFieldSet: vo,
      __classPrivateFieldIn: bo,
      __addDisposableResource: wo,
      __disposeResources: _o
    };
  }
}), gc = ce({
  "node_modules/tree-dump/lib/printTree.js"(e) {
    Object.defineProperty(e, "__esModule", { value: !0 }), e.printTree = void 0;
    var r = (t = "", n) => {
      let i = "", s = n.length - 1;
      for (; s >= 0 && !n[s]; s--)
        ;
      for (let f = 0; f <= s; f++) {
        const u = n[f];
        if (!u)
          continue;
        const b = f === s, g = u(t + (b ? " " : "│") + "  "), A = g ? b ? "└─" : "├─" : "│";
        i += `
` + t + A + (g ? " " + g : "");
      }
      return i;
    };
    e.printTree = r;
  }
}), vc = ce({
  "node_modules/tree-dump/lib/printBinary.js"(e) {
    Object.defineProperty(e, "__esModule", { value: !0 }), e.printBinary = void 0;
    var r = (t = "", n) => {
      const i = n[0], s = n[1];
      let f = "";
      return i && (f += `
` + t + "← " + i(t + "  ")), s && (f += `
` + t + "→ " + s(t + "  ")), f;
    };
    e.printBinary = r;
  }
}), bc = ce({
  "node_modules/tree-dump/lib/index.js"(e) {
    Object.defineProperty(e, "__esModule", { value: !0 });
    var r = (yc(), la(zi));
    r.__exportStar(gc(), e), r.__exportStar(vc(), e);
  }
}), wc = ce({
  "node_modules/memfs/lib/node-to-fsa/util.js"(e) {
    Object.defineProperty(e, "__esModule", { value: !0 }), e.newNotAllowedError = e.newTypeMismatchError = e.newNotFoundError = e.assertCanWrite = e.assertName = e.basename = e.ctx = void 0;
    var r = (g = {}) => Object.assign({ separator: "/", syncHandleAllowed: !1, mode: "read" }, g);
    e.ctx = r;
    var t = (g, A) => {
      g[g.length - 1] === A && (g = g.slice(0, -1));
      const w = g.lastIndexOf(A);
      return w === -1 ? g : g.slice(w + 1);
    };
    e.basename = t;
    var n = /^(\.{1,2})$|^(.*([\/\\]).*)$/, i = (g, A, w) => {
      if (!g || n.test(g))
        throw new TypeError(`Failed to execute '${A}' on '${w}': Name is not allowed.`);
    };
    e.assertName = i;
    var s = (g) => {
      if (g !== "readwrite")
        throw new DOMException("The request is not allowed by the user agent or the platform in the current context.", "NotAllowedError");
    };
    e.assertCanWrite = s;
    var f = () => new DOMException("A requested file or directory could not be found at the time an operation was processed.", "NotFoundError");
    e.newNotFoundError = f;
    var u = () => new DOMException("The path supplied exists, but was not an entry of requested type.", "TypeMismatchError");
    e.newTypeMismatchError = u;
    var b = () => new DOMException("Permission not granted.", "NotAllowedError");
    e.newNotAllowedError = b;
  }
}), _c = ce({
  "node_modules/memfs/lib/print/index.js"(e) {
    Object.defineProperty(e, "__esModule", { value: !0 }), e.toTreeSync = void 0;
    var r = bc(), t = wc(), n = (i, s = {}) => {
      var f;
      const u = s.separator || "/";
      let b = s.dir || u;
      b[b.length - 1] !== u && (b += u);
      const g = s.tab || "", A = (f = s.depth) !== null && f !== void 0 ? f : 10;
      let w = " (...)";
      if (A > 0) {
        const P = i.readdirSync(b, { withFileTypes: !0 });
        w = (0, r.printTree)(g, P.map((x) => (p) => x.isDirectory() ? (0, e.toTreeSync)(i, { dir: b + x.name, depth: A - 1, tab: p }) : x.isSymbolicLink() ? "" + x.name + " → " + i.readlinkSync(b + x.name) : "" + x.name));
      }
      return (0, t.basename)(b, u) + u + w;
    };
    e.toTreeSync = n;
  }
}), xc = ce({
  "node_modules/memfs/lib/node/options.js"(e) {
    Object.defineProperty(e, "__esModule", { value: !0 }), e.getWriteFileOptions = e.writeFileDefaults = e.getRealpathOptsAndCb = e.getRealpathOptions = e.getStatOptsAndCb = e.getStatOptions = e.getAppendFileOptsAndCb = e.getAppendFileOpts = e.getOpendirOptsAndCb = e.getOpendirOptions = e.getReaddirOptsAndCb = e.getReaddirOptions = e.getReadFileOptions = e.getRmOptsAndCb = e.getRmdirOptions = e.getDefaultOptsAndCb = e.getDefaultOpts = e.optsDefaults = e.getMkdirOptions = void 0, e.getOptions = u, e.optsGenerator = b, e.optsAndCbGenerator = g;
    var r = ln(), t = br(), n = $t(), i = {
      mode: 511,
      recursive: !1
    }, s = (E) => typeof E == "number" ? Object.assign({}, i, { mode: E }) : Object.assign({}, i, E);
    e.getMkdirOptions = s;
    var f = (E) => `Expected options to be either an object or a string, but got ${E} instead`;
    function u(E, O) {
      let T;
      if (O) {
        const F = typeof O;
        switch (F) {
          case "string":
            T = Object.assign({}, E, { encoding: O });
            break;
          case "object":
            T = Object.assign({}, E, O);
            break;
          default:
            throw TypeError(f(F));
        }
      } else
        return E;
      return T.encoding !== "buffer" && (0, t.assertEncoding)(T.encoding), T;
    }
    function b(E) {
      return (O) => u(E, O);
    }
    function g(E) {
      return (O, T) => typeof O == "function" ? [E(), O] : [E(O), (0, n.validateCallback)(T)];
    }
    e.optsDefaults = {
      encoding: "utf8"
    }, e.getDefaultOpts = b(e.optsDefaults), e.getDefaultOptsAndCb = g(e.getDefaultOpts);
    var A = {
      recursive: !1
    }, w = (E) => Object.assign({}, A, E);
    e.getRmdirOptions = w;
    var j = b(e.optsDefaults);
    e.getRmOptsAndCb = g(j);
    var P = {
      flag: "r"
    };
    e.getReadFileOptions = b(P);
    var x = {
      encoding: "utf8",
      recursive: !1,
      withFileTypes: !1
    };
    e.getReaddirOptions = b(x), e.getReaddirOptsAndCb = g(e.getReaddirOptions);
    var p = {
      encoding: "utf8",
      bufferSize: 32,
      recursive: !1
    };
    e.getOpendirOptions = b(p), e.getOpendirOptsAndCb = g(e.getOpendirOptions);
    var y = {
      encoding: "utf8",
      mode: 438,
      flag: r.FLAGS[r.FLAGS.a]
    };
    e.getAppendFileOpts = b(y), e.getAppendFileOptsAndCb = g(e.getAppendFileOpts);
    var m = {
      bigint: !1
    }, S = (E = {}) => Object.assign({}, m, E);
    e.getStatOptions = S;
    var _ = (E, O) => typeof E == "function" ? [(0, e.getStatOptions)(), E] : [(0, e.getStatOptions)(E), (0, n.validateCallback)(O)];
    e.getStatOptsAndCb = _;
    var d = e.optsDefaults;
    e.getRealpathOptions = b(d), e.getRealpathOptsAndCb = g(e.getRealpathOptions), e.writeFileDefaults = {
      encoding: "utf8",
      mode: 438,
      flag: r.FLAGS[r.FLAGS.w]
    }, e.getWriteFileOptions = b(e.writeFileDefaults);
  }
}), Ec = ce({
  "node_modules/memfs/lib/Dir.js"(e) {
    Object.defineProperty(e, "__esModule", { value: !0 }), e.Dir = void 0;
    var r = $t(), t = cn(), n = class {
      constructor(i, s) {
        this.link = i, this.options = s, this.iteratorInfo = [], this.path = i.getParentPath(), this.iteratorInfo.push(i.children[Symbol.iterator]());
      }
      wrapAsync(i, s, f) {
        (0, r.validateCallback)(f), setImmediate(() => {
          let u;
          try {
            u = i.apply(this, s);
          } catch (b) {
            f(b);
            return;
          }
          f(null, u);
        });
      }
      isFunction(i) {
        return typeof i == "function";
      }
      promisify(i, s) {
        return (...f) => new Promise((u, b) => {
          this.isFunction(i[s]) ? i[s].bind(i)(...f, (g, A) => {
            g && b(g), u(A);
          }) : b("Not a function");
        });
      }
      closeBase() {
      }
      readBase(i) {
        let s, f, u, b;
        do {
          do
            if ({ done: s, value: f } = i[i.length - 1].next(), !s)
              [u, b] = f;
            else
              break;
          while (u === "." || u === "..");
          if (s) {
            if (i.pop(), i.length === 0)
              break;
            s = !1;
          } else
            return this.options.recursive && b.children.size && i.push(b.children[Symbol.iterator]()), t.default.build(b, this.options.encoding);
        } while (!s);
        return null;
      }
      closeBaseAsync(i) {
        this.wrapAsync(this.closeBase, [], i);
      }
      close(i) {
        if (typeof i == "function")
          this.closeBaseAsync(i);
        else
          return this.promisify(this, "closeBaseAsync")();
      }
      closeSync() {
        this.closeBase();
      }
      readBaseAsync(i) {
        this.wrapAsync(this.readBase, [this.iteratorInfo], i);
      }
      read(i) {
        if (typeof i == "function")
          this.readBaseAsync(i);
        else
          return this.promisify(this, "readBaseAsync")();
      }
      readSync() {
        return this.readBase(this.iteratorInfo);
      }
      [Symbol.asyncIterator]() {
        const i = [], s = this;
        i.push(s.link.children[Symbol.iterator]());
        const f = {
          readBaseAsync(u) {
            s.wrapAsync(s.readBase, [i], u);
          }
        };
        return {
          async next() {
            const u = await s.promisify(f, "readBaseAsync")();
            return u !== null ? { done: !1, value: u } : { done: !0, value: void 0 };
          },
          [Symbol.asyncIterator]() {
            throw new Error("Not implemented");
          }
        };
      }
    };
    e.Dir = n;
  }
}), Sc = ce({
  "node_modules/memfs/lib/volume.js"(e) {
    Object.defineProperty(e, "__esModule", { value: !0 }), e.FSWatcher = e.StatWatcher = e.Volume = void 0, e.filenameToSteps = _e, e.pathToSteps = ie, e.dataToStr = Re, e.toUnixTimestamp = xe;
    var r = nc(), t = oc(), n = Zr(), i = cn(), s = Lt(), f = sc(), u = Zi(), b = Xi(), g = ac(), A = lc(), w = bt(), j = Ji(), P = br(), x = fc(), p = vt(), y = uc(), m = _c(), S = ln(), _ = xc(), d = $t(), E = Ec(), O = r.resolve, { O_RDONLY: T, O_WRONLY: F, O_RDWR: C, O_CREAT: J, O_EXCL: Z, O_TRUNC: se, O_APPEND: le, O_DIRECTORY: pe, O_SYMLINK: me, F_OK: he, COPYFILE_EXCL: X, COPYFILE_FICLONE_FORCE: te } = w.constants, { sep: ae, relative: fe, join: ee, dirname: R } = r.posix ? r.posix : r, D = 128, W = "EPERM", re = "ENOENT", M = "EBADF", $ = "EINVAL", q = "EEXIST", L = "ENOTDIR", G = "EMFILE", Q = "EACCES", oe = "EISDIR", de = "ENOTEMPTY", ge = "ENOSYS", ye = "ERR_FS_EISDIR", be = "ERR_OUT_OF_RANGE", Oe = (U, a = b.default.cwd()) => O(a, U);
    if (d.isWin) {
      const U = Oe;
      Oe = (a, l) => (0, d.unixify)(U(a, l));
    }
    function _e(U, a) {
      const v = Oe(U, a).substring(1);
      return v ? v.split(ae) : [];
    }
    function ie(U) {
      return _e((0, d.pathToFilename)(U));
    }
    function Re(U, a = P.ENCODING_UTF8) {
      return s.Buffer.isBuffer(U) ? U.toString(a) : U instanceof Uint8Array ? (0, s.bufferFrom)(U).toString(a) : String(U);
    }
    function xe(U) {
      if (typeof U == "string" && +U == U)
        return +U;
      if (U instanceof Date)
        return U.getTime() / 1e3;
      if (isFinite(U))
        return U < 0 ? Date.now() / 1e3 : U;
      throw new Error("Cannot parse time: " + U);
    }
    function Ae(U) {
      if (typeof U != "number")
        throw TypeError(S.ERRSTR.UID);
    }
    function Ee(U) {
      if (typeof U != "number")
        throw TypeError(S.ERRSTR.GID);
    }
    function Ne(U) {
      const a = {};
      function l(v, I) {
        for (const N in I) {
          const Y = I[N], ne = ee(v, N);
          typeof Y == "string" || Y instanceof s.Buffer ? a[ne] = Y : typeof Y == "object" && Y !== null && Object.keys(Y).length > 0 ? l(ne, Y) : a[ne] = null;
        }
      }
      return l("", U), a;
    }
    var ke = () => {
      throw new Error("Not implemented");
    }, K = class or {
      static fromJSON(a, l) {
        const v = new or();
        return v.fromJSON(a, l), v;
      }
      static fromNestedJSON(a, l) {
        const v = new or();
        return v.fromNestedJSON(a, l), v;
      }
      get promises() {
        if (this.promisesApi === null)
          throw new Error("Promise is not supported in this environment.");
        return this.promisesApi;
      }
      constructor(a = {}) {
        this.ino = 0, this.inodes = {}, this.releasedInos = [], this.fds = {}, this.releasedFds = [], this.maxFiles = 1e4, this.openFiles = 0, this.promisesApi = new y.FsPromises(this, x.FileHandle), this.statWatchers = {}, this.cpSync = ke, this.statfsSync = ke, this.cp = ke, this.statfs = ke, this.openAsBlob = ke, this.props = Object.assign({ Node: t.Node, Link: t.Link, File: t.File }, a);
        const l = this.createLink();
        l.setNode(this.createNode(w.constants.S_IFDIR | 511));
        const v = this;
        this.StatWatcher = class extends o {
          constructor() {
            super(v);
          }
        };
        const I = B;
        this.ReadStream = class extends I {
          constructor(...Y) {
            super(v, ...Y);
          }
        };
        const N = z;
        this.WriteStream = class extends N {
          constructor(...Y) {
            super(v, ...Y);
          }
        }, this.FSWatcher = class extends V {
          constructor() {
            super(v);
          }
        }, l.setChild(".", l), l.getNode().nlink++, l.setChild("..", l), l.getNode().nlink++, this.root = l;
      }
      createLink(a, l, v = !1, I) {
        if (!a)
          return new this.props.Link(this, null, "");
        if (!l)
          throw new Error("createLink: name cannot be empty");
        const N = I ?? (v ? 511 : 438), ne = I && I & w.constants.S_IFMT ? I & w.constants.S_IFMT : v ? w.constants.S_IFDIR : w.constants.S_IFREG, ue = N & ~w.constants.S_IFMT | ne;
        return a.createChild(l, this.createNode(ue));
      }
      deleteLink(a) {
        const l = a.parent;
        return l ? (l.deleteChild(a), !0) : !1;
      }
      newInoNumber() {
        const a = this.releasedInos.pop();
        return a || (this.ino = (this.ino + 1) % 4294967295, this.ino);
      }
      newFdNumber() {
        const a = this.releasedFds.pop();
        return typeof a == "number" ? a : or.fd--;
      }
      createNode(a) {
        const l = new this.props.Node(this.newInoNumber(), a);
        return this.inodes[l.ino] = l, l;
      }
      deleteNode(a) {
        a.del(), delete this.inodes[a.ino], this.releasedInos.push(a.ino);
      }
      walk(a, l = !1, v = !1, I = !1, N) {
        var Y;
        let ne, ue;
        a instanceof t.Link ? (ne = a.steps, ue = ae + ne.join(ae)) : typeof a == "string" ? (ne = _e(a), ue = a) : (ne = a, ue = ae + ne.join(ae));
        let ve = this.root, Se = 0;
        for (; Se < ne.length; ) {
          let Fe = ve.getNode();
          if (Fe.isDirectory()) {
            if (I && !Fe.canExecute())
              throw (0, d.createError)(Q, N, ue);
          } else if (Se < ne.length - 1)
            throw (0, d.createError)(L, N, ue);
          if (ve = (Y = ve.getChild(ne[Se])) !== null && Y !== void 0 ? Y : null, !ve) {
            if (v)
              throw (0, d.createError)(re, N, ue);
            return null;
          }
          if (Fe = ve?.getNode(), l && Fe.isSymlink()) {
            const Ze = r.isAbsolute(Fe.symlink) ? Fe.symlink : ee(r.dirname(ve.getPath()), Fe.symlink);
            ne = _e(Ze).concat(ne.slice(Se + 1)), ve = this.root, Se = 0;
            continue;
          }
          Se++;
        }
        return ve;
      }
      // Returns a `Link` (hard link) referenced by path "split" into steps.
      getLink(a) {
        return this.walk(a, !1, !1, !1);
      }
      // Just link `getLink`, but throws a correct user error, if link to found.
      getLinkOrThrow(a, l) {
        return this.walk(a, !1, !0, !0, l);
      }
      // Just like `getLink`, but also dereference/resolves symbolic links.
      getResolvedLink(a) {
        return this.walk(a, !0, !1, !1);
      }
      // Just like `getLinkOrThrow`, but also dereference/resolves symbolic links.
      getResolvedLinkOrThrow(a, l) {
        return this.walk(a, !0, !0, !0, l);
      }
      resolveSymlinks(a) {
        return this.getResolvedLink(a.steps.slice(1));
      }
      // Just like `getLinkOrThrow`, but also verifies that the link is a directory.
      getLinkAsDirOrThrow(a, l) {
        const v = this.getLinkOrThrow(a, l);
        if (!v.getNode().isDirectory())
          throw (0, d.createError)(L, l, a);
        return v;
      }
      // Get the immediate parent directory of the link.
      getLinkParent(a) {
        return this.getLink(a.slice(0, -1));
      }
      getLinkParentAsDirOrThrow(a, l) {
        const v = (a instanceof Array ? a : _e(a)).slice(0, -1), I = ae + v.join(ae), N = this.getLinkOrThrow(I, l);
        if (!N.getNode().isDirectory())
          throw (0, d.createError)(L, l, I);
        return N;
      }
      getFileByFd(a) {
        return this.fds[String(a)];
      }
      getFileByFdOrThrow(a, l) {
        if (!(0, d.isFd)(a))
          throw TypeError(S.ERRSTR.FD);
        const v = this.getFileByFd(a);
        if (!v)
          throw (0, d.createError)(M, l);
        return v;
      }
      /**
       * @todo This is not used anymore. Remove.
       */
      /*
        private getNodeByIdOrCreate(id: TFileId, flags: number, perm: number): Node {
          if (typeof id === 'number') {
            const file = this.getFileByFd(id);
            if (!file) throw Error('File nto found');
            return file.node;
          } else {
            const steps = pathToSteps(id as PathLike);
            let link = this.getLink(steps);
            if (link) return link.getNode();
      
            // Try creating a node if not found.
            if (flags & O_CREAT) {
              const dirLink = this.getLinkParent(steps);
              if (dirLink) {
                const name = steps[steps.length - 1];
                link = this.createLink(dirLink, name, false, perm);
                return link.getNode();
              }
            }
      
            throw createError(ENOENT, 'getNodeByIdOrCreate', pathToFilename(id));
          }
        }
        */
      wrapAsync(a, l, v) {
        (0, d.validateCallback)(v), (0, f.default)(() => {
          let I;
          try {
            I = a.apply(this, l);
          } catch (N) {
            v(N);
            return;
          }
          v(null, I);
        });
      }
      _toJSON(a = this.root, l = {}, v, I) {
        let N = !0, Y = a.children;
        a.getNode().isFile() && (Y = /* @__PURE__ */ new Map([[a.getName(), a.parent.getChild(a.getName())]]), a = a.parent);
        for (const ue of Y.keys()) {
          if (ue === "." || ue === "..")
            continue;
          N = !1;
          const ve = a.getChild(ue);
          if (!ve)
            throw new Error("_toJSON: unexpected undefined");
          const Se = ve.getNode();
          if (Se.isFile()) {
            let Fe = ve.getPath();
            v && (Fe = fe(v, Fe)), l[Fe] = I ? Se.getBuffer() : Se.getString();
          } else Se.isDirectory() && this._toJSON(ve, l, v, I);
        }
        let ne = a.getPath();
        return v && (ne = fe(v, ne)), ne && N && (l[ne] = null), l;
      }
      toJSON(a, l = {}, v = !1, I = !1) {
        const N = [];
        if (a) {
          Array.isArray(a) || (a = [a]);
          for (const Y of a) {
            const ne = (0, d.pathToFilename)(Y), ue = this.getResolvedLink(ne);
            ue && N.push(ue);
          }
        } else
          N.push(this.root);
        if (!N.length)
          return l;
        for (const Y of N)
          this._toJSON(Y, l, v ? Y.getPath() : "", I);
        return l;
      }
      // TODO: `cwd` should probably not invoke `process.cwd()`.
      fromJSON(a, l = b.default.cwd()) {
        for (let v in a) {
          const I = a[v];
          if (v = Oe(v, l), typeof I == "string" || I instanceof s.Buffer) {
            const N = R(v);
            this.mkdirpBase(
              N,
              511
              /* MODE.DIR */
            ), this.writeFileSync(v, I);
          } else
            this.mkdirpBase(
              v,
              511
              /* MODE.DIR */
            );
        }
      }
      fromNestedJSON(a, l) {
        this.fromJSON(Ne(a), l);
      }
      toTree(a = { separator: ae }) {
        return (0, m.toTreeSync)(this, a);
      }
      reset() {
        this.ino = 0, this.inodes = {}, this.releasedInos = [], this.fds = {}, this.releasedFds = [], this.openFiles = 0, this.root = this.createLink(), this.root.setNode(this.createNode(w.constants.S_IFDIR | 511));
      }
      // Legacy interface
      mountSync(a, l) {
        this.fromJSON(l, a);
      }
      openLink(a, l, v = !0) {
        if (this.openFiles >= this.maxFiles)
          throw (0, d.createError)(G, "open", a.getPath());
        let I = a;
        v && (I = this.getResolvedLinkOrThrow(a.getPath(), "open"));
        const N = I.getNode();
        if (N.isDirectory()) {
          if ((l & (T | C | F)) !== T)
            throw (0, d.createError)(oe, "open", a.getPath());
        } else if (l & pe)
          throw (0, d.createError)(L, "open", a.getPath());
        if (!(l & F) && !N.canRead() || !(l & T) && !N.canWrite())
          throw (0, d.createError)(Q, "open", a.getPath());
        const Y = new this.props.File(a, N, l, this.newFdNumber());
        return this.fds[Y.fd] = Y, this.openFiles++, l & se && Y.truncate(), Y;
      }
      openFile(a, l, v, I = !0) {
        const N = _e(a);
        let Y;
        try {
          if (Y = I ? this.getResolvedLinkOrThrow(a, "open") : this.getLinkOrThrow(a, "open"), Y && l & J && l & Z)
            throw (0, d.createError)(q, "open", a);
        } catch (ne) {
          if (ne.code === re && l & J) {
            const ue = r.dirname(a), ve = this.getResolvedLinkOrThrow(ue), Se = ve.getNode();
            if (!Se.isDirectory())
              throw (0, d.createError)(L, "open", a);
            if (!Se.canExecute() || !Se.canWrite())
              throw (0, d.createError)(Q, "open", a);
            v ?? (v = 438), Y = this.createLink(ve, N[N.length - 1], !1, v);
          } else
            throw ne;
        }
        if (Y)
          return this.openLink(Y, l, I);
        throw (0, d.createError)(re, "open", a);
      }
      openBase(a, l, v, I = !0) {
        const N = this.openFile(a, l, v, I);
        if (!N)
          throw (0, d.createError)(re, "open", a);
        return N.fd;
      }
      openSync(a, l, v = 438) {
        const I = (0, d.modeToNumber)(v), N = (0, d.pathToFilename)(a), Y = (0, d.flagsToNumber)(l);
        return this.openBase(N, Y, I, !(Y & me));
      }
      open(a, l, v, I) {
        let N = v, Y = I;
        typeof v == "function" && (N = 438, Y = v), N = N || 438;
        const ne = (0, d.modeToNumber)(N), ue = (0, d.pathToFilename)(a), ve = (0, d.flagsToNumber)(l);
        this.wrapAsync(this.openBase, [ue, ve, ne, !(ve & me)], Y);
      }
      closeFile(a) {
        this.fds[a.fd] && (this.openFiles--, delete this.fds[a.fd], this.releasedFds.push(a.fd));
      }
      closeSync(a) {
        (0, d.validateFd)(a);
        const l = this.getFileByFdOrThrow(a, "close");
        this.closeFile(l);
      }
      close(a, l) {
        (0, d.validateFd)(a);
        const v = this.getFileByFdOrThrow(a, "close");
        this.wrapAsync(this.closeFile, [v], l);
      }
      openFileOrGetById(a, l, v) {
        if (typeof a == "number") {
          const I = this.fds[a];
          if (!I)
            throw (0, d.createError)(re);
          return I;
        } else
          return this.openFile((0, d.pathToFilename)(a), l, v);
      }
      readBase(a, l, v, I, N) {
        if (l.byteLength < I)
          throw (0, d.createError)(be, "read", void 0, void 0, RangeError);
        const Y = this.getFileByFdOrThrow(a);
        if (Y.node.isSymlink())
          throw (0, d.createError)(W, "read", Y.link.getPath());
        return Y.read(l, Number(v), Number(I), N === -1 || typeof N != "number" ? void 0 : N);
      }
      readSync(a, l, v, I, N) {
        return (0, d.validateFd)(a), this.readBase(a, l, v, I, N);
      }
      read(a, l, v, I, N, Y) {
        if ((0, d.validateCallback)(Y), I === 0)
          return (0, u.default)(() => {
            Y && Y(null, 0, l);
          });
        (0, f.default)(() => {
          try {
            const ne = this.readBase(a, l, v, I, N);
            Y(null, ne, l);
          } catch (ne) {
            Y(ne);
          }
        });
      }
      readvBase(a, l, v) {
        const I = this.getFileByFdOrThrow(a);
        let N = v ?? void 0;
        N === -1 && (N = void 0);
        let Y = 0;
        for (const ne of l) {
          const ue = I.read(ne, 0, ne.byteLength, N);
          if (N = void 0, Y += ue, ue < ne.byteLength)
            break;
        }
        return Y;
      }
      readv(a, l, v, I) {
        let N = v, Y = I;
        typeof v == "function" && (N = null, Y = v), (0, d.validateCallback)(Y), (0, f.default)(() => {
          try {
            const ne = this.readvBase(a, l, N);
            Y(null, ne, l);
          } catch (ne) {
            Y(ne);
          }
        });
      }
      readvSync(a, l, v) {
        return (0, d.validateFd)(a), this.readvBase(a, l, v);
      }
      readFileBase(a, l, v) {
        let I;
        const Y = typeof a == "number" && (0, d.isFd)(a);
        let ne;
        if (Y)
          ne = a;
        else {
          const ue = (0, d.pathToFilename)(a), ve = this.getResolvedLinkOrThrow(ue, "open");
          if (ve.getNode().isDirectory())
            throw (0, d.createError)(oe, "open", ve.getPath());
          ne = this.openSync(a, l);
        }
        try {
          I = (0, d.bufferToEncoding)(this.getFileByFdOrThrow(ne).getBuffer(), v);
        } finally {
          Y || this.closeSync(ne);
        }
        return I;
      }
      readFileSync(a, l) {
        const v = (0, _.getReadFileOptions)(l), I = (0, d.flagsToNumber)(v.flag);
        return this.readFileBase(a, I, v.encoding);
      }
      readFile(a, l, v) {
        const [I, N] = (0, _.optsAndCbGenerator)(_.getReadFileOptions)(l, v), Y = (0, d.flagsToNumber)(I.flag);
        this.wrapAsync(this.readFileBase, [a, Y, I.encoding], N);
      }
      writeBase(a, l, v, I, N) {
        const Y = this.getFileByFdOrThrow(a, "write");
        if (Y.node.isSymlink())
          throw (0, d.createError)(M, "write", Y.link.getPath());
        return Y.write(l, v, I, N === -1 || typeof N != "number" ? void 0 : N);
      }
      writeSync(a, l, v, I, N) {
        const [, Y, ne, ue, ve] = (0, d.getWriteSyncArgs)(a, l, v, I, N);
        return this.writeBase(a, Y, ne, ue, ve);
      }
      write(a, l, v, I, N, Y) {
        const [, ne, ue, ve, Se, Fe, Ze] = (0, d.getWriteArgs)(a, l, v, I, N, Y);
        (0, f.default)(() => {
          try {
            const Be = this.writeBase(a, ue, ve, Se, Fe);
            ne ? Ze(null, Be, l) : Ze(null, Be, ue);
          } catch (Be) {
            Ze(Be);
          }
        });
      }
      writevBase(a, l, v) {
        const I = this.getFileByFdOrThrow(a);
        let N = v ?? void 0;
        N === -1 && (N = void 0);
        let Y = 0;
        for (const ne of l) {
          const ue = s.Buffer.from(ne.buffer, ne.byteOffset, ne.byteLength), ve = I.write(ue, 0, ue.byteLength, N);
          if (N = void 0, Y += ve, ve < ue.byteLength)
            break;
        }
        return Y;
      }
      writev(a, l, v, I) {
        let N = v, Y = I;
        typeof v == "function" && (N = null, Y = v), (0, d.validateCallback)(Y), (0, f.default)(() => {
          try {
            const ne = this.writevBase(a, l, N);
            Y(null, ne, l);
          } catch (ne) {
            Y(ne);
          }
        });
      }
      writevSync(a, l, v) {
        return (0, d.validateFd)(a), this.writevBase(a, l, v);
      }
      writeFileBase(a, l, v, I) {
        const N = typeof a == "number";
        let Y;
        N ? Y = a : Y = this.openBase((0, d.pathToFilename)(a), v, I);
        let ne = 0, ue = l.length, ve = v & le ? void 0 : 0;
        try {
          for (; ue > 0; ) {
            const Se = this.writeSync(Y, l, ne, ue, ve);
            ne += Se, ue -= Se, ve !== void 0 && (ve += Se);
          }
        } finally {
          N || this.closeSync(Y);
        }
      }
      writeFileSync(a, l, v) {
        const I = (0, _.getWriteFileOptions)(v), N = (0, d.flagsToNumber)(I.flag), Y = (0, d.modeToNumber)(I.mode), ne = (0, d.dataToBuffer)(l, I.encoding);
        this.writeFileBase(a, ne, N, Y);
      }
      writeFile(a, l, v, I) {
        let N = v, Y = I;
        typeof v == "function" && (N = _.writeFileDefaults, Y = v);
        const ne = (0, d.validateCallback)(Y), ue = (0, _.getWriteFileOptions)(N), ve = (0, d.flagsToNumber)(ue.flag), Se = (0, d.modeToNumber)(ue.mode), Fe = (0, d.dataToBuffer)(l, ue.encoding);
        this.wrapAsync(this.writeFileBase, [a, Fe, ve, Se], ne);
      }
      linkBase(a, l) {
        let v;
        try {
          v = this.getLinkOrThrow(a, "link");
        } catch (ue) {
          throw ue.code && (ue = (0, d.createError)(ue.code, "link", a, l)), ue;
        }
        const I = r.dirname(l);
        let N;
        try {
          N = this.getLinkOrThrow(I, "link");
        } catch (ue) {
          throw ue.code && (ue = (0, d.createError)(ue.code, "link", a, l)), ue;
        }
        const Y = r.basename(l);
        if (N.getChild(Y))
          throw (0, d.createError)(q, "link", a, l);
        const ne = v.getNode();
        ne.nlink++, N.createChild(Y, ne);
      }
      copyFileBase(a, l, v) {
        const I = this.readFileSync(a);
        if (v & X && this.existsSync(l))
          throw (0, d.createError)(q, "copyFile", a, l);
        if (v & te)
          throw (0, d.createError)(ge, "copyFile", a, l);
        this.writeFileBase(
          l,
          I,
          S.FLAGS.w,
          438
          /* MODE.DEFAULT */
        );
      }
      copyFileSync(a, l, v) {
        const I = (0, d.pathToFilename)(a), N = (0, d.pathToFilename)(l);
        return this.copyFileBase(I, N, (v || 0) | 0);
      }
      copyFile(a, l, v, I) {
        const N = (0, d.pathToFilename)(a), Y = (0, d.pathToFilename)(l);
        let ne, ue;
        typeof v == "function" ? (ne = 0, ue = v) : (ne = v, ue = I), (0, d.validateCallback)(ue), this.wrapAsync(this.copyFileBase, [N, Y, ne], ue);
      }
      linkSync(a, l) {
        const v = (0, d.pathToFilename)(a), I = (0, d.pathToFilename)(l);
        this.linkBase(v, I);
      }
      link(a, l, v) {
        const I = (0, d.pathToFilename)(a), N = (0, d.pathToFilename)(l);
        this.wrapAsync(this.linkBase, [I, N], v);
      }
      unlinkBase(a) {
        const l = this.getLinkOrThrow(a, "unlink");
        if (l.length)
          throw Error("Dir not empty...");
        this.deleteLink(l);
        const v = l.getNode();
        v.nlink--, v.nlink <= 0 && this.deleteNode(v);
      }
      unlinkSync(a) {
        const l = (0, d.pathToFilename)(a);
        this.unlinkBase(l);
      }
      unlink(a, l) {
        const v = (0, d.pathToFilename)(a);
        this.wrapAsync(this.unlinkBase, [v], l);
      }
      symlinkBase(a, l) {
        const v = _e(l);
        let I;
        try {
          I = this.getLinkParentAsDirOrThrow(v);
        } catch (ue) {
          throw ue.code && (ue = (0, d.createError)(ue.code, "symlink", a, l)), ue;
        }
        const N = v[v.length - 1];
        if (I.getChild(N))
          throw (0, d.createError)(q, "symlink", a, l);
        const Y = I.getNode();
        if (!Y.canExecute() || !Y.canWrite())
          throw (0, d.createError)(Q, "symlink", a, l);
        const ne = I.createChild(N);
        return ne.getNode().makeSymlink(a), ne;
      }
      // `type` argument works only on Windows.
      symlinkSync(a, l, v) {
        const I = (0, d.pathToFilename)(a), N = (0, d.pathToFilename)(l);
        this.symlinkBase(I, N);
      }
      symlink(a, l, v, I) {
        const N = (0, d.validateCallback)(typeof v == "function" ? v : I), Y = (0, d.pathToFilename)(a), ne = (0, d.pathToFilename)(l);
        this.wrapAsync(this.symlinkBase, [Y, ne], N);
      }
      realpathBase(a, l) {
        const v = this.getResolvedLinkOrThrow(a, "realpath");
        return (0, P.strToEncoding)(v.getPath() || "/", l);
      }
      realpathSync(a, l) {
        return this.realpathBase((0, d.pathToFilename)(a), (0, _.getRealpathOptions)(l).encoding);
      }
      realpath(a, l, v) {
        const [I, N] = (0, _.getRealpathOptsAndCb)(l, v), Y = (0, d.pathToFilename)(a);
        this.wrapAsync(this.realpathBase, [Y, I.encoding], N);
      }
      lstatBase(a, l = !1, v = !1) {
        let I;
        try {
          I = this.getLinkOrThrow(a, "lstat");
        } catch (N) {
          if (N.code === re && !v)
            return;
          throw N;
        }
        return n.default.build(I.getNode(), l);
      }
      lstatSync(a, l) {
        const { throwIfNoEntry: v = !0, bigint: I = !1 } = (0, _.getStatOptions)(l);
        return this.lstatBase((0, d.pathToFilename)(a), I, v);
      }
      lstat(a, l, v) {
        const [{ throwIfNoEntry: I = !0, bigint: N = !1 }, Y] = (0, _.getStatOptsAndCb)(l, v);
        this.wrapAsync(this.lstatBase, [(0, d.pathToFilename)(a), N, I], Y);
      }
      statBase(a, l = !1, v = !0) {
        let I;
        try {
          I = this.getResolvedLinkOrThrow(a, "stat");
        } catch (N) {
          if (N.code === re && !v)
            return;
          throw N;
        }
        return n.default.build(I.getNode(), l);
      }
      statSync(a, l) {
        const { bigint: v = !0, throwIfNoEntry: I = !0 } = (0, _.getStatOptions)(l);
        return this.statBase((0, d.pathToFilename)(a), v, I);
      }
      stat(a, l, v) {
        const [{ bigint: I = !1, throwIfNoEntry: N = !0 }, Y] = (0, _.getStatOptsAndCb)(l, v);
        this.wrapAsync(this.statBase, [(0, d.pathToFilename)(a), I, N], Y);
      }
      fstatBase(a, l = !1) {
        const v = this.getFileByFd(a);
        if (!v)
          throw (0, d.createError)(M, "fstat");
        return n.default.build(v.node, l);
      }
      fstatSync(a, l) {
        return this.fstatBase(a, (0, _.getStatOptions)(l).bigint);
      }
      fstat(a, l, v) {
        const [I, N] = (0, _.getStatOptsAndCb)(l, v);
        this.wrapAsync(this.fstatBase, [a, I.bigint], N);
      }
      renameBase(a, l) {
        let v;
        try {
          v = this.getResolvedLinkOrThrow(a);
        } catch (ve) {
          throw ve.code && (ve = (0, d.createError)(ve.code, "rename", a, l)), ve;
        }
        let I;
        try {
          I = this.getLinkParentAsDirOrThrow(l);
        } catch (ve) {
          throw ve.code && (ve = (0, d.createError)(ve.code, "rename", a, l)), ve;
        }
        const N = v.parent, Y = N.getNode(), ne = I.getNode();
        if (!Y.canExecute() || !Y.canWrite() || !ne.canExecute() || !ne.canWrite())
          throw (0, d.createError)(Q, "rename", a, l);
        N.deleteChild(v);
        const ue = r.basename(l);
        v.name = ue, v.steps = [...I.steps, ue], I.setChild(v.getName(), v);
      }
      renameSync(a, l) {
        const v = (0, d.pathToFilename)(a), I = (0, d.pathToFilename)(l);
        this.renameBase(v, I);
      }
      rename(a, l, v) {
        const I = (0, d.pathToFilename)(a), N = (0, d.pathToFilename)(l);
        this.wrapAsync(this.renameBase, [I, N], v);
      }
      existsBase(a) {
        return !!this.statBase(a);
      }
      existsSync(a) {
        try {
          return this.existsBase((0, d.pathToFilename)(a));
        } catch {
          return !1;
        }
      }
      exists(a, l) {
        const v = (0, d.pathToFilename)(a);
        if (typeof l != "function")
          throw Error(S.ERRSTR.CB);
        (0, f.default)(() => {
          try {
            l(this.existsBase(v));
          } catch {
            l(!1);
          }
        });
      }
      accessBase(a, l) {
        this.getLinkOrThrow(a, "access");
      }
      accessSync(a, l = he) {
        const v = (0, d.pathToFilename)(a);
        l = l | 0, this.accessBase(v, l);
      }
      access(a, l, v) {
        let I = he, N;
        typeof l != "function" ? (I = l | 0, N = (0, d.validateCallback)(v)) : N = l;
        const Y = (0, d.pathToFilename)(a);
        this.wrapAsync(this.accessBase, [Y, I], N);
      }
      appendFileSync(a, l, v) {
        const I = (0, _.getAppendFileOpts)(v);
        (!I.flag || (0, d.isFd)(a)) && (I.flag = "a"), this.writeFileSync(a, l, I);
      }
      appendFile(a, l, v, I) {
        const [N, Y] = (0, _.getAppendFileOptsAndCb)(v, I);
        (!N.flag || (0, d.isFd)(a)) && (N.flag = "a"), this.writeFile(a, l, N, Y);
      }
      readdirBase(a, l) {
        _e(a);
        const v = this.getResolvedLinkOrThrow(a, "scandir"), I = v.getNode();
        if (!I.isDirectory())
          throw (0, d.createError)(L, "scandir", a);
        if (!I.canRead())
          throw (0, d.createError)(Q, "scandir", a);
        const N = [];
        for (const ne of v.children.keys()) {
          const ue = v.getChild(ne);
          if (!(!ue || ne === "." || ne === "..") && (N.push(i.default.build(ue, l.encoding)), l.recursive && ue.children.size)) {
            const ve = Object.assign(Object.assign({}, l), { recursive: !0, withFileTypes: !0 }), Se = this.readdirBase(ue.getPath(), ve);
            N.push(...Se);
          }
        }
        if (!d.isWin && l.encoding !== "buffer" && N.sort((ne, ue) => ne.name < ue.name ? -1 : ne.name > ue.name ? 1 : 0), l.withFileTypes)
          return N;
        let Y = a;
        return d.isWin && (Y = Y.replace(/\\/g, "/")), N.map((ne) => {
          if (l.recursive) {
            let ue = r.join(ne.parentPath, ne.name.toString());
            return d.isWin && (ue = ue.replace(/\\/g, "/")), ue.replace(Y + r.posix.sep, "");
          }
          return ne.name;
        });
      }
      readdirSync(a, l) {
        const v = (0, _.getReaddirOptions)(l), I = (0, d.pathToFilename)(a);
        return this.readdirBase(I, v);
      }
      readdir(a, l, v) {
        const [I, N] = (0, _.getReaddirOptsAndCb)(l, v), Y = (0, d.pathToFilename)(a);
        this.wrapAsync(this.readdirBase, [Y, I], N);
      }
      readlinkBase(a, l) {
        const I = this.getLinkOrThrow(a, "readlink").getNode();
        if (!I.isSymlink())
          throw (0, d.createError)($, "readlink", a);
        return (0, P.strToEncoding)(I.symlink, l);
      }
      readlinkSync(a, l) {
        const v = (0, _.getDefaultOpts)(l), I = (0, d.pathToFilename)(a);
        return this.readlinkBase(I, v.encoding);
      }
      readlink(a, l, v) {
        const [I, N] = (0, _.getDefaultOptsAndCb)(l, v), Y = (0, d.pathToFilename)(a);
        this.wrapAsync(this.readlinkBase, [Y, I.encoding], N);
      }
      fsyncBase(a) {
        this.getFileByFdOrThrow(a, "fsync");
      }
      fsyncSync(a) {
        this.fsyncBase(a);
      }
      fsync(a, l) {
        this.wrapAsync(this.fsyncBase, [a], l);
      }
      fdatasyncBase(a) {
        this.getFileByFdOrThrow(a, "fdatasync");
      }
      fdatasyncSync(a) {
        this.fdatasyncBase(a);
      }
      fdatasync(a, l) {
        this.wrapAsync(this.fdatasyncBase, [a], l);
      }
      ftruncateBase(a, l) {
        this.getFileByFdOrThrow(a, "ftruncate").truncate(l);
      }
      ftruncateSync(a, l) {
        this.ftruncateBase(a, l);
      }
      ftruncate(a, l, v) {
        const I = typeof l == "number" ? l : 0, N = (0, d.validateCallback)(typeof l == "number" ? v : l);
        this.wrapAsync(this.ftruncateBase, [a, I], N);
      }
      truncateBase(a, l) {
        const v = this.openSync(a, "r+");
        try {
          this.ftruncateSync(v, l);
        } finally {
          this.closeSync(v);
        }
      }
      /**
       * `id` should be a file descriptor or a path. `id` as file descriptor will
       * not be supported soon.
       */
      truncateSync(a, l) {
        if ((0, d.isFd)(a))
          return this.ftruncateSync(a, l);
        this.truncateBase(a, l);
      }
      truncate(a, l, v) {
        const I = typeof l == "number" ? l : 0, N = (0, d.validateCallback)(typeof l == "number" ? v : l);
        if ((0, d.isFd)(a))
          return this.ftruncate(a, I, N);
        this.wrapAsync(this.truncateBase, [a, I], N);
      }
      futimesBase(a, l, v) {
        const N = this.getFileByFdOrThrow(a, "futimes").node;
        N.atime = new Date(l * 1e3), N.mtime = new Date(v * 1e3);
      }
      futimesSync(a, l, v) {
        this.futimesBase(a, xe(l), xe(v));
      }
      futimes(a, l, v, I) {
        this.wrapAsync(this.futimesBase, [a, xe(l), xe(v)], I);
      }
      utimesBase(a, l, v, I = !0) {
        const Y = (I ? this.getResolvedLinkOrThrow(a, "utimes") : this.getLinkOrThrow(a, "lutimes")).getNode();
        Y.atime = new Date(l * 1e3), Y.mtime = new Date(v * 1e3);
      }
      utimesSync(a, l, v) {
        this.utimesBase((0, d.pathToFilename)(a), xe(l), xe(v), !0);
      }
      utimes(a, l, v, I) {
        this.wrapAsync(this.utimesBase, [(0, d.pathToFilename)(a), xe(l), xe(v), !0], I);
      }
      lutimesSync(a, l, v) {
        this.utimesBase((0, d.pathToFilename)(a), xe(l), xe(v), !1);
      }
      lutimes(a, l, v, I) {
        this.wrapAsync(this.utimesBase, [(0, d.pathToFilename)(a), xe(l), xe(v), !1], I);
      }
      mkdirBase(a, l) {
        const v = _e(a);
        if (!v.length)
          throw (0, d.createError)(q, "mkdir", a);
        const I = this.getLinkParentAsDirOrThrow(a, "mkdir"), N = v[v.length - 1];
        if (I.getChild(N))
          throw (0, d.createError)(q, "mkdir", a);
        const Y = I.getNode();
        if (!Y.canWrite() || !Y.canExecute())
          throw (0, d.createError)(Q, "mkdir", a);
        I.createChild(N, this.createNode(w.constants.S_IFDIR | l));
      }
      /**
       * Creates directory tree recursively.
       */
      mkdirpBase(a, l) {
        let v = !1;
        const I = _e(a);
        let N = null, Y = I.length;
        for (Y = I.length; Y >= 0 && (N = this.getResolvedLink(I.slice(0, Y)), !N); Y--)
          ;
        for (N || (N = this.root, Y = 0), N = this.getResolvedLinkOrThrow(ae + I.slice(0, Y).join(ae), "mkdir"), Y; Y < I.length; Y++) {
          const ne = N.getNode();
          if (ne.isDirectory()) {
            if (!ne.canExecute() || !ne.canWrite())
              throw (0, d.createError)(Q, "mkdir", a);
          } else
            throw (0, d.createError)(L, "mkdir", a);
          v = !0, N = N.createChild(I[Y], this.createNode(w.constants.S_IFDIR | l));
        }
        return v ? a : void 0;
      }
      mkdirSync(a, l) {
        const v = (0, _.getMkdirOptions)(l), I = (0, d.modeToNumber)(v.mode, 511), N = (0, d.pathToFilename)(a);
        if (v.recursive)
          return this.mkdirpBase(N, I);
        this.mkdirBase(N, I);
      }
      mkdir(a, l, v) {
        const I = (0, _.getMkdirOptions)(l), N = (0, d.validateCallback)(typeof l == "function" ? l : v), Y = (0, d.modeToNumber)(I.mode, 511), ne = (0, d.pathToFilename)(a);
        I.recursive ? this.wrapAsync(this.mkdirpBase, [ne, Y], N) : this.wrapAsync(this.mkdirBase, [ne, Y], N);
      }
      mkdtempBase(a, l, v = 5) {
        const I = a + (0, d.genRndStr6)();
        try {
          return this.mkdirBase(
            I,
            511
            /* MODE.DIR */
          ), (0, P.strToEncoding)(I, l);
        } catch (N) {
          if (N.code === q) {
            if (v > 1)
              return this.mkdtempBase(a, l, v - 1);
            throw Error("Could not create temp dir.");
          } else
            throw N;
        }
      }
      mkdtempSync(a, l) {
        const { encoding: v } = (0, _.getDefaultOpts)(l);
        if (!a || typeof a != "string")
          throw new TypeError("filename prefix is required");
        return (0, d.nullCheck)(a), this.mkdtempBase(a, v);
      }
      mkdtemp(a, l, v) {
        const [{ encoding: I }, N] = (0, _.getDefaultOptsAndCb)(l, v);
        if (!a || typeof a != "string")
          throw new TypeError("filename prefix is required");
        (0, d.nullCheck)(a) && this.wrapAsync(this.mkdtempBase, [a, I], N);
      }
      rmdirBase(a, l) {
        const v = (0, _.getRmdirOptions)(l), I = this.getLinkAsDirOrThrow(a, "rmdir");
        if (I.length && !v.recursive)
          throw (0, d.createError)(de, "rmdir", a);
        this.deleteLink(I);
      }
      rmdirSync(a, l) {
        this.rmdirBase((0, d.pathToFilename)(a), l);
      }
      rmdir(a, l, v) {
        const I = (0, _.getRmdirOptions)(l), N = (0, d.validateCallback)(typeof l == "function" ? l : v);
        this.wrapAsync(this.rmdirBase, [(0, d.pathToFilename)(a), I], N);
      }
      rmBase(a, l = {}) {
        let v;
        try {
          v = this.getResolvedLinkOrThrow(a, "stat");
        } catch (I) {
          if (I.code === re && l.force)
            return;
          throw I;
        }
        if (v.getNode().isDirectory() && !l.recursive)
          throw (0, d.createError)(ye, "rm", a);
        if (!v.parent.getNode().canWrite())
          throw (0, d.createError)(Q, "rm", a);
        this.deleteLink(v);
      }
      rmSync(a, l) {
        this.rmBase((0, d.pathToFilename)(a), l);
      }
      rm(a, l, v) {
        const [I, N] = (0, _.getRmOptsAndCb)(l, v);
        this.wrapAsync(this.rmBase, [(0, d.pathToFilename)(a), I], N);
      }
      fchmodBase(a, l) {
        this.getFileByFdOrThrow(a, "fchmod").chmod(l);
      }
      fchmodSync(a, l) {
        this.fchmodBase(a, (0, d.modeToNumber)(l));
      }
      fchmod(a, l, v) {
        this.wrapAsync(this.fchmodBase, [a, (0, d.modeToNumber)(l)], v);
      }
      chmodBase(a, l, v = !0) {
        (v ? this.getResolvedLinkOrThrow(a, "chmod") : this.getLinkOrThrow(a, "chmod")).getNode().chmod(l);
      }
      chmodSync(a, l) {
        const v = (0, d.modeToNumber)(l), I = (0, d.pathToFilename)(a);
        this.chmodBase(I, v, !0);
      }
      chmod(a, l, v) {
        const I = (0, d.modeToNumber)(l), N = (0, d.pathToFilename)(a);
        this.wrapAsync(this.chmodBase, [N, I], v);
      }
      lchmodBase(a, l) {
        this.chmodBase(a, l, !1);
      }
      lchmodSync(a, l) {
        const v = (0, d.modeToNumber)(l), I = (0, d.pathToFilename)(a);
        this.lchmodBase(I, v);
      }
      lchmod(a, l, v) {
        const I = (0, d.modeToNumber)(l), N = (0, d.pathToFilename)(a);
        this.wrapAsync(this.lchmodBase, [N, I], v);
      }
      fchownBase(a, l, v) {
        this.getFileByFdOrThrow(a, "fchown").chown(l, v);
      }
      fchownSync(a, l, v) {
        Ae(l), Ee(v), this.fchownBase(a, l, v);
      }
      fchown(a, l, v, I) {
        Ae(l), Ee(v), this.wrapAsync(this.fchownBase, [a, l, v], I);
      }
      chownBase(a, l, v) {
        this.getResolvedLinkOrThrow(a, "chown").getNode().chown(l, v);
      }
      chownSync(a, l, v) {
        Ae(l), Ee(v), this.chownBase((0, d.pathToFilename)(a), l, v);
      }
      chown(a, l, v, I) {
        Ae(l), Ee(v), this.wrapAsync(this.chownBase, [(0, d.pathToFilename)(a), l, v], I);
      }
      lchownBase(a, l, v) {
        this.getLinkOrThrow(a, "lchown").getNode().chown(l, v);
      }
      lchownSync(a, l, v) {
        Ae(l), Ee(v), this.lchownBase((0, d.pathToFilename)(a), l, v);
      }
      lchown(a, l, v, I) {
        Ae(l), Ee(v), this.wrapAsync(this.lchownBase, [(0, d.pathToFilename)(a), l, v], I);
      }
      watchFile(a, l, v) {
        const I = (0, d.pathToFilename)(a);
        let N = l, Y = v;
        if (typeof N == "function" && (Y = l, N = null), typeof Y != "function")
          throw Error('"watchFile()" requires a listener function');
        let ne = 5007, ue = !0;
        N && typeof N == "object" && (typeof N.interval == "number" && (ne = N.interval), typeof N.persistent == "boolean" && (ue = N.persistent));
        let ve = this.statWatchers[I];
        return ve || (ve = new this.StatWatcher(), ve.start(I, ue, ne), this.statWatchers[I] = ve), ve.addListener("change", Y), ve;
      }
      unwatchFile(a, l) {
        const v = (0, d.pathToFilename)(a), I = this.statWatchers[v];
        I && (typeof l == "function" ? I.removeListener("change", l) : I.removeAllListeners("change"), I.listenerCount("change") === 0 && (I.stop(), delete this.statWatchers[v]));
      }
      createReadStream(a, l) {
        return new this.ReadStream(a, l);
      }
      createWriteStream(a, l) {
        return new this.WriteStream(a, l);
      }
      // watch(path: PathLike): FSWatcher;
      // watch(path: PathLike, options?: IWatchOptions | string): FSWatcher;
      watch(a, l, v) {
        const I = (0, d.pathToFilename)(a);
        let N = l;
        typeof l == "function" && (v = l, N = null);
        let { persistent: Y, recursive: ne, encoding: ue } = (0, _.getDefaultOpts)(N);
        Y === void 0 && (Y = !0), ne === void 0 && (ne = !1);
        const ve = new this.FSWatcher();
        return ve.start(I, Y, ne, ue), v && ve.addListener("change", v), ve;
      }
      opendirBase(a, l) {
        const v = this.getResolvedLinkOrThrow(a, "scandir");
        if (!v.getNode().isDirectory())
          throw (0, d.createError)(L, "scandir", a);
        return new E.Dir(v, l);
      }
      opendirSync(a, l) {
        const v = (0, _.getOpendirOptions)(l), I = (0, d.pathToFilename)(a);
        return this.opendirBase(I, v);
      }
      opendir(a, l, v) {
        const [I, N] = (0, _.getOpendirOptsAndCb)(l, v), Y = (0, d.pathToFilename)(a);
        this.wrapAsync(this.opendirBase, [Y, I], N);
      }
    };
    e.Volume = K, K.fd = 2147483647;
    function h(U) {
      U.emit("stop");
    }
    var o = class extends j.EventEmitter {
      constructor(U) {
        super(), this.onInterval = () => {
          try {
            const a = this.vol.statSync(this.filename);
            this.hasChanged(a) && (this.emit("change", a, this.prev), this.prev = a);
          } finally {
            this.loop();
          }
        }, this.vol = U;
      }
      loop() {
        this.timeoutRef = this.setTimeout(this.onInterval, this.interval);
      }
      hasChanged(U) {
        return U.mtimeMs > this.prev.mtimeMs || U.nlink !== this.prev.nlink;
      }
      start(U, a = !0, l = 5007) {
        this.filename = (0, d.pathToFilename)(U), this.setTimeout = a ? setTimeout.bind(typeof globalThis < "u" ? globalThis : global) : g.default, this.interval = l, this.prev = this.vol.statSync(this.filename), this.loop();
      }
      stop() {
        clearTimeout(this.timeoutRef), (0, u.default)(() => {
          h.call(this, this);
        });
      }
    };
    e.StatWatcher = o;
    var c;
    function k(U) {
      c = (0, s.bufferAllocUnsafe)(U), c.used = 0;
    }
    p.inherits(B, A.Readable), e.ReadStream = B;
    function B(U, a, l) {
      if (!(this instanceof B))
        return new B(U, a, l);
      if (this._vol = U, l = Object.assign({}, (0, _.getOptions)(l, {})), l.highWaterMark === void 0 && (l.highWaterMark = 64 * 1024), A.Readable.call(this, l), this.path = (0, d.pathToFilename)(a), this.fd = l.fd === void 0 ? null : typeof l.fd != "number" ? l.fd.fd : l.fd, this.flags = l.flags === void 0 ? "r" : l.flags, this.mode = l.mode === void 0 ? 438 : l.mode, this.start = l.start, this.end = l.end, this.autoClose = l.autoClose === void 0 ? !0 : l.autoClose, this.pos = void 0, this.bytesRead = 0, this.start !== void 0) {
        if (typeof this.start != "number")
          throw new TypeError('"start" option must be a Number');
        if (this.end === void 0)
          this.end = 1 / 0;
        else if (typeof this.end != "number")
          throw new TypeError('"end" option must be a Number');
        if (this.start > this.end)
          throw new Error('"start" option must be <= "end" option');
        this.pos = this.start;
      }
      typeof this.fd != "number" && this.open(), this.on("end", function() {
        this.autoClose && this.destroy && this.destroy();
      });
    }
    B.prototype.open = function() {
      var U = this;
      this._vol.open(this.path, this.flags, this.mode, (a, l) => {
        if (a) {
          U.autoClose && U.destroy && U.destroy(), U.emit("error", a);
          return;
        }
        U.fd = l, U.emit("open", l), U.read();
      });
    }, B.prototype._read = function(U) {
      if (typeof this.fd != "number")
        return this.once("open", function() {
          this._read(U);
        });
      if (this.destroyed)
        return;
      (!c || c.length - c.used < D) && k(this._readableState.highWaterMark);
      var a = c, l = Math.min(c.length - c.used, U), v = c.used;
      if (this.pos !== void 0 && (l = Math.min(this.end - this.pos + 1, l)), l <= 0)
        return this.push(null);
      var I = this;
      this._vol.read(this.fd, c, c.used, l, this.pos, N), this.pos !== void 0 && (this.pos += l), c.used += l;
      function N(Y, ne) {
        if (Y)
          I.autoClose && I.destroy && I.destroy(), I.emit("error", Y);
        else {
          var ue = null;
          ne > 0 && (I.bytesRead += ne, ue = a.slice(v, v + ne)), I.push(ue);
        }
      }
    }, B.prototype._destroy = function(U, a) {
      this.close((l) => {
        a(U || l);
      });
    }, B.prototype.close = function(U) {
      var a;
      if (U && this.once("close", U), this.closed || typeof this.fd != "number") {
        if (typeof this.fd != "number") {
          this.once("open", H);
          return;
        }
        return (0, u.default)(() => this.emit("close"));
      }
      typeof ((a = this._readableState) === null || a === void 0 ? void 0 : a.closed) == "boolean" ? this._readableState.closed = !0 : this.closed = !0, this._vol.close(this.fd, (l) => {
        l ? this.emit("error", l) : this.emit("close");
      }), this.fd = null;
    };
    function H(U) {
      this.close();
    }
    p.inherits(z, A.Writable), e.WriteStream = z;
    function z(U, a, l) {
      if (!(this instanceof z))
        return new z(U, a, l);
      if (this._vol = U, l = Object.assign({}, (0, _.getOptions)(l, {})), A.Writable.call(this, l), this.path = (0, d.pathToFilename)(a), this.fd = l.fd === void 0 ? null : typeof l.fd != "number" ? l.fd.fd : l.fd, this.flags = l.flags === void 0 ? "w" : l.flags, this.mode = l.mode === void 0 ? 438 : l.mode, this.start = l.start, this.autoClose = l.autoClose === void 0 ? !0 : !!l.autoClose, this.pos = void 0, this.bytesWritten = 0, this.pending = !0, this.start !== void 0) {
        if (typeof this.start != "number")
          throw new TypeError('"start" option must be a Number');
        if (this.start < 0)
          throw new Error('"start" must be >= zero');
        this.pos = this.start;
      }
      l.encoding && this.setDefaultEncoding(l.encoding), typeof this.fd != "number" && this.open(), this.once("finish", function() {
        this.autoClose && this.close();
      });
    }
    z.prototype.open = function() {
      this._vol.open(this.path, this.flags, this.mode, (function(U, a) {
        if (U) {
          this.autoClose && this.destroy && this.destroy(), this.emit("error", U);
          return;
        }
        this.fd = a, this.pending = !1, this.emit("open", a);
      }).bind(this));
    }, z.prototype._write = function(U, a, l) {
      if (!(U instanceof s.Buffer || U instanceof Uint8Array))
        return this.emit("error", new Error("Invalid data"));
      if (typeof this.fd != "number")
        return this.once("open", function() {
          this._write(U, a, l);
        });
      var v = this;
      this._vol.write(this.fd, U, 0, U.length, this.pos, (I, N) => {
        if (I)
          return v.autoClose && v.destroy && v.destroy(), l(I);
        v.bytesWritten += N, l();
      }), this.pos !== void 0 && (this.pos += U.length);
    }, z.prototype._writev = function(U, a) {
      if (typeof this.fd != "number")
        return this.once("open", function() {
          this._writev(U, a);
        });
      const l = this, v = U.length, I = new Array(v);
      for (var N = 0, Y = 0; Y < v; Y++) {
        var ne = U[Y].chunk;
        I[Y] = ne, N += ne.length;
      }
      const ue = s.Buffer.concat(I);
      this._vol.write(this.fd, ue, 0, ue.length, this.pos, (ve, Se) => {
        if (ve)
          return l.destroy && l.destroy(), a(ve);
        l.bytesWritten += Se, a();
      }), this.pos !== void 0 && (this.pos += N);
    }, z.prototype.close = function(U) {
      var a;
      if (U && this.once("close", U), this.closed || typeof this.fd != "number") {
        if (typeof this.fd != "number") {
          this.once("open", H);
          return;
        }
        return (0, u.default)(() => this.emit("close"));
      }
      typeof ((a = this._writableState) === null || a === void 0 ? void 0 : a.closed) == "boolean" ? this._writableState.closed = !0 : this.closed = !0, this._vol.close(this.fd, (l) => {
        l ? this.emit("error", l) : this.emit("close");
      }), this.fd = null;
    }, z.prototype._destroy = B.prototype._destroy, z.prototype.destroySoon = z.prototype.end;
    var V = class extends j.EventEmitter {
      constructor(U) {
        super(), this._filename = "", this._filenameEncoded = "", this._recursive = !1, this._encoding = P.ENCODING_UTF8, this._listenerRemovers = /* @__PURE__ */ new Map(), this._onParentChild = (a) => {
          a.getName() === this._getName() && this._emit("rename");
        }, this._emit = (a) => {
          this.emit("change", a, this._filenameEncoded);
        }, this._persist = () => {
          this._timer = setTimeout(this._persist, 1e6);
        }, this._vol = U;
      }
      _getName() {
        return this._steps[this._steps.length - 1];
      }
      start(U, a = !0, l = !1, v = P.ENCODING_UTF8) {
        this._filename = (0, d.pathToFilename)(U), this._steps = _e(this._filename), this._filenameEncoded = (0, P.strToEncoding)(this._filename), this._recursive = l, this._encoding = v;
        try {
          this._link = this._vol.getLinkOrThrow(this._filename, "FSWatcher");
        } catch (ne) {
          const ue = new Error(`watch ${this._filename} ${ne.code}`);
          throw ue.code = ne.code, ue.errno = ne.code, ue;
        }
        const I = (ne) => {
          var ue;
          const ve = ne.getPath(), Se = ne.getNode(), Fe = () => {
            let Be = fe(this._filename, ve);
            return Be || (Be = this._getName()), this.emit("change", "change", Be);
          };
          Se.on("change", Fe);
          const Ze = (ue = this._listenerRemovers.get(Se.ino)) !== null && ue !== void 0 ? ue : [];
          Ze.push(() => Se.removeListener("change", Fe)), this._listenerRemovers.set(Se.ino, Ze);
        }, N = (ne) => {
          var ue;
          const ve = ne.getNode(), Se = (Be) => {
            this.emit("change", "rename", fe(this._filename, Be.getPath())), setTimeout(() => {
              I(Be), N(Be);
            });
          }, Fe = (Be) => {
            const ot = (dn) => {
              const pn = dn.getNode().ino, hn = this._listenerRemovers.get(pn);
              hn && (hn.forEach((Vt) => Vt()), this._listenerRemovers.delete(pn));
              for (const [Vt, mn] of dn.children.entries())
                mn && Vt !== "." && Vt !== ".." && ot(mn);
            };
            ot(Be), this.emit("change", "rename", fe(this._filename, Be.getPath()));
          };
          for (const [Be, ot] of ne.children.entries())
            ot && Be !== "." && Be !== ".." && I(ot);
          if (ne.on("child:add", Se), ne.on("child:delete", Fe), ((ue = this._listenerRemovers.get(ve.ino)) !== null && ue !== void 0 ? ue : []).push(() => {
            ne.removeListener("child:add", Se), ne.removeListener("child:delete", Fe);
          }), l)
            for (const [Be, ot] of ne.children.entries())
              ot && Be !== "." && Be !== ".." && N(ot);
        };
        I(this._link), N(this._link);
        const Y = this._link.parent;
        Y && (Y.setMaxListeners(Y.getMaxListeners() + 1), Y.on("child:delete", this._onParentChild)), a && this._persist();
      }
      close() {
        clearTimeout(this._timer), this._listenerRemovers.forEach((a) => {
          a.forEach((l) => l());
        }), this._listenerRemovers.clear();
        const U = this._link.parent;
        U && U.removeListener("child:delete", this._onParentChild);
      }
    };
    e.FSWatcher = V;
  }
}), Oc = ce({
  "node_modules/memfs/lib/node/lists/fsSynchronousApiList.js"(e) {
    Object.defineProperty(e, "__esModule", { value: !0 }), e.fsSynchronousApiList = void 0, e.fsSynchronousApiList = [
      "accessSync",
      "appendFileSync",
      "chmodSync",
      "chownSync",
      "closeSync",
      "copyFileSync",
      "existsSync",
      "fchmodSync",
      "fchownSync",
      "fdatasyncSync",
      "fstatSync",
      "fsyncSync",
      "ftruncateSync",
      "futimesSync",
      "lchmodSync",
      "lchownSync",
      "linkSync",
      "lstatSync",
      "mkdirSync",
      "mkdtempSync",
      "openSync",
      "readdirSync",
      "readFileSync",
      "readlinkSync",
      "readSync",
      "readvSync",
      "realpathSync",
      "renameSync",
      "rmdirSync",
      "rmSync",
      "statSync",
      "symlinkSync",
      "truncateSync",
      "unlinkSync",
      "utimesSync",
      "lutimesSync",
      "writeFileSync",
      "writeSync",
      "writevSync"
      // 'cpSync',
      // 'statfsSync',
    ];
  }
}), Ac = ce({
  "node_modules/memfs/lib/node/lists/fsCallbackApiList.js"(e) {
    Object.defineProperty(e, "__esModule", { value: !0 }), e.fsCallbackApiList = void 0, e.fsCallbackApiList = [
      "access",
      "appendFile",
      "chmod",
      "chown",
      "close",
      "copyFile",
      "createReadStream",
      "createWriteStream",
      "exists",
      "fchmod",
      "fchown",
      "fdatasync",
      "fstat",
      "fsync",
      "ftruncate",
      "futimes",
      "lchmod",
      "lchown",
      "link",
      "lstat",
      "mkdir",
      "mkdtemp",
      "open",
      "read",
      "readv",
      "readdir",
      "readFile",
      "readlink",
      "realpath",
      "rename",
      "rm",
      "rmdir",
      "stat",
      "symlink",
      "truncate",
      "unlink",
      "unwatchFile",
      "utimes",
      "lutimes",
      "watch",
      "watchFile",
      "write",
      "writev",
      "writeFile"
    ];
  }
}), kc = ce({
  "node_modules/memfs/lib/index.js"(e, r) {
    Object.defineProperty(e, "__esModule", { value: !0 }), e.memfs = e.fs = e.vol = e.Volume = void 0, e.createFsFromVolume = j;
    var t = Zr(), n = cn(), i = Sc(), s = bt(), f = Oc(), u = Ac(), { F_OK: b, R_OK: g, W_OK: A, X_OK: w } = s.constants;
    e.Volume = i.Volume, e.vol = new i.Volume();
    function j(x) {
      const p = { F_OK: b, R_OK: g, W_OK: A, X_OK: w, constants: s.constants, Stats: t.default, Dirent: n.default };
      for (const y of f.fsSynchronousApiList)
        typeof x[y] == "function" && (p[y] = x[y].bind(x));
      for (const y of u.fsCallbackApiList)
        typeof x[y] == "function" && (p[y] = x[y].bind(x));
      return p.StatWatcher = x.StatWatcher, p.FSWatcher = x.FSWatcher, p.WriteStream = x.WriteStream, p.ReadStream = x.ReadStream, p.promises = x.promises, p._toUnixTimestamp = i.toUnixTimestamp, p.__vol = x, p;
    }
    e.fs = j(e.vol);
    var P = (x = {}, p = "/") => {
      const y = e.Volume.fromNestedJSON(x, p);
      return { fs: j(y), vol: y };
    };
    e.memfs = P, r.exports = Object.assign(Object.assign({}, r.exports), e.fs), r.exports.semantic = !0;
  }
}), At = ca(kc());
At.default;
At.memfs;
At.fs;
At.createFsFromVolume;
At.vol;
At.Volume;
/*! Bundled license information:

ieee754/index.js:
  (*! ieee754. BSD-3-Clause License. Feross Aboukhadijeh <https://feross.org/opensource> *)

buffer/index.js:
  (*!
   * The buffer module from node.js, for the browser.
   *
   * @author   Feross Aboukhadijeh <https://feross.org>
   * @license  MIT
   *)

assert/build/internal/util/comparisons.js:
  (*!
   * The buffer module from node.js, for the browser.
   *
   * @author   Feross Aboukhadijeh <feross@feross.org> <http://feross.org>
   * @license  MIT
   *)
*/
var Tc = Object.create, Oo = Object.defineProperty, Rc = Object.getOwnPropertyDescriptor, Ao = Object.getOwnPropertyNames, Ic = Object.getPrototypeOf, jc = Object.prototype.hasOwnProperty, Pc = (e, r) => function() {
  return r || (0, e[Ao(e)[0]])((r = { exports: {} }).exports, r), r.exports;
}, Nc = (e, r, t, n) => {
  if (r && typeof r == "object" || typeof r == "function")
    for (let i of Ao(r))
      !jc.call(e, i) && i !== t && Oo(e, i, { get: () => r[i], enumerable: !(n = Rc(r, i)) || n.enumerable });
  return e;
}, Fc = (e, r, t) => (t = e != null ? Tc(Ic(e)) : {}, Nc(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  Oo(t, "default", { value: e, enumerable: !0 }),
  e
)), Bc = Pc({
  "node_modules/deepmerge/dist/cjs.js"(e, r) {
    var t = function(d) {
      return n(d) && !i(d);
    };
    function n(_) {
      return !!_ && typeof _ == "object";
    }
    function i(_) {
      var d = Object.prototype.toString.call(_);
      return d === "[object RegExp]" || d === "[object Date]" || u(_);
    }
    var s = typeof Symbol == "function" && Symbol.for, f = s ? Symbol.for("react.element") : 60103;
    function u(_) {
      return _.$$typeof === f;
    }
    function b(_) {
      return Array.isArray(_) ? [] : {};
    }
    function g(_, d) {
      return d.clone !== !1 && d.isMergeableObject(_) ? m(b(_), _, d) : _;
    }
    function A(_, d, E) {
      return _.concat(d).map(function(O) {
        return g(O, E);
      });
    }
    function w(_, d) {
      if (!d.customMerge)
        return m;
      var E = d.customMerge(_);
      return typeof E == "function" ? E : m;
    }
    function j(_) {
      return Object.getOwnPropertySymbols ? Object.getOwnPropertySymbols(_).filter(function(d) {
        return Object.propertyIsEnumerable.call(_, d);
      }) : [];
    }
    function P(_) {
      return Object.keys(_).concat(j(_));
    }
    function x(_, d) {
      try {
        return d in _;
      } catch {
        return !1;
      }
    }
    function p(_, d) {
      return x(_, d) && !(Object.hasOwnProperty.call(_, d) && Object.propertyIsEnumerable.call(_, d));
    }
    function y(_, d, E) {
      var O = {};
      return E.isMergeableObject(_) && P(_).forEach(function(T) {
        O[T] = g(_[T], E);
      }), P(d).forEach(function(T) {
        p(_, T) || (x(_, T) && E.isMergeableObject(d[T]) ? O[T] = w(T, E)(_[T], d[T], E) : O[T] = g(d[T], E));
      }), O;
    }
    function m(_, d, E) {
      E = E || {}, E.arrayMerge = E.arrayMerge || A, E.isMergeableObject = E.isMergeableObject || t, E.cloneUnlessOtherwiseSpecified = g;
      var O = Array.isArray(d), T = Array.isArray(_), F = O === T;
      return F ? O ? E.arrayMerge(_, d, E) : y(_, d, E) : g(d, E);
    }
    m.all = function(d, E) {
      if (!Array.isArray(d))
        throw new Error("first argument should be an array");
      return d.reduce(function(O, T) {
        return m(O, T, E);
      }, {});
    };
    var S = m;
    r.exports = S;
  }
}), Cc = Fc(Bc());
Cc.default;
const zn = "cpNchKjiIM19dPqTxE0fqg", Ir = "FQQqyumcpPQoiFRCjdS9GM";
async function Dc({
  tokensDir: e,
  cssBuildPath: r,
  cssTransforms: t
}) {
  const i = "spacing/", f = ze.join(
    e,
    zn,
    "👾 Primitives.Value.json"
  ), u = ze.join(
    e,
    zn,
    "⛔️ Figma.Value.json"
  ), b = ze.join(
    e,
    Ir,
    "💎 Density.Spacious.json"
  ), g = ze.join(
    e,
    Ir,
    "💎 Density.Comfortable.json"
  ), A = Po([
    ze.join(
      e,
      Ir,
      "💎 Density.Comfortable.json"
    )
  ]), w = ko({
    name: "densitySpaceToggle",
    tokens: A["💎 Density.Comfortable.json"]
  });
  Qe.registerTransform(w);
  const j = wr({
    source: [f],
    buildPath: i,
    prefix: "eds",
    fileName: "primitives",
    filter: (_) => ut(_),
    transforms: t
  }), P = wr({
    include: [f, u],
    source: [g],
    buildPath: i,
    prefix: "eds",
    fileName: "comfortable",
    selector: '[data-density="comfortable"]',
    filter: (_) => ut(_, ["Density"]),
    outputReferences: !0,
    transforms: t
  }), x = wr({
    include: [f, u],
    source: [b],
    buildPath: i,
    prefix: "eds",
    fileName: "spacious",
    selector: ':root, [data-density="spacious"]',
    filter: (_) => ut(_, ["Density"]),
    outputReferences: !0,
    transforms: t
  }), p = new Qe({
    include: [f, u],
    source: [b],
    platforms: {
      css: {
        transformGroup: "css",
        prefix: "eds",
        buildPath: ze.join(r, i),
        transforms: [
          "name/kebab",
          jr,
          Pr,
          Nr,
          "densitySpaceToggle"
        ],
        files: [
          {
            filter: (_) => ut(_, ["Density"]),
            destination: "spacing-trimmed.css",
            format: "css/variables",
            options: {
              selector: ":root, [data-density]",
              outputReferences: !1
            }
          }
        ]
      }
    }
  }), y = new Qe({
    include: [f, u],
    source: [b],
    platforms: {
      css: {
        transformGroup: "css",
        prefix: "eds",
        buildPath: ze.join(r, i),
        transforms: [
          "name/kebab",
          jr,
          Pr,
          Nr,
          "densitySpaceToggle"
        ],
        files: [
          {
            filter: (_) => ut(_, ["Density"]),
            destination: "spacing-verbose.css",
            format: "css/variables",
            options: {
              selector: ":root, [data-density]",
              outputReferences: Uo
            }
          }
        ]
      }
    }
  }), m = new Qe({
    include: [f, u],
    source: [b],
    platforms: {
      css: {
        transformGroup: "css",
        prefix: "eds",
        buildPath: ze.join(r, i),
        transforms: t,
        files: [
          {
            filter: (_) => ut(_, ["Density", "Spacious"]),
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
  }), S = new Qe({
    include: [f, u],
    source: [g],
    platforms: {
      css: {
        transformGroup: "css",
        prefix: "eds",
        buildPath: ze.join(r, i),
        transforms: t,
        files: [
          {
            filter: (_) => ut(_, ["Density", "Comfortable"]),
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
  await j.buildAllPlatforms(), await P.buildAllPlatforms(), await x.buildAllPlatforms(), await m.buildAllPlatforms(), await S.buildAllPlatforms(), await p.buildAllPlatforms(), await y.buildAllPlatforms();
}
const un = `${process.cwd()}/build`, Lc = `${un}/css`, Xc = `${un}/js`, Jc = `${un}/json`;
Qe.registerTransform(To);
Qe.registerTransform(Ro);
Qe.registerTransform(Io);
Qe.registerTransform(jo);
async function Uc() {
  const e = `${process.cwd()}/tokens`;
  console.info("Running Style Dictionary build script"), console.info("Tokens directory:", e), await Dc({
    tokensDir: e,
    cssBuildPath: Lc,
    cssTransforms: [
      "name/kebab",
      jr,
      Pr,
      Nr
    ]
  });
}
Uc().then(() => {
  console.log("✅ Variables generated successfully");
}).catch((e) => {
  console.error("❌ Error generating color variables:", e);
});
export {
  Lc as cssBuildPath,
  Uc as generate,
  Xc as jsBuildPath,
  Jc as jsonBuildPath
};
