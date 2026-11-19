/**
 * The pasted PE Editor in FRIOD Main Design (page Test, 2103:2330), as the
 * phase 1 scan reads it: the instances with legacy values they take from
 * their main components, with the tree of the instances in each. Summarised
 * in Figma on 2026-11-19 from the scan's reader; the counts match the
 * published plugin's Instances tab (Text Field 355, Switch 100, Button 92).
 */
import type { InstanceTree, OldInstance } from '../../../src/scan/types'

type Summary = {
  n: string
  c?: string
  h?: true
  s?: true
  w?: string
  k: number
  hk?: number
  o: number
  ch?: Summary[]
}

const SUMMARY: Summary[] = [
  {
    n: 'PE Editor',
    k: 32,
    o: 10,
    ch: [{ n: 'Button [EDS]', k: 22, o: 19, ch: [{ n: 'close', k: 3, o: 3 }] }],
  },
  { n: '_Badge [EDS]', h: true, s: true, w: 'PE Editor', k: 18, hk: 18, o: 18 },
  { n: '_Tab [EDS]', s: true, w: 'PE Editor', k: 17, o: 17 },
  { n: '_Tab [EDS]', s: true, w: 'PE Editor', k: 17, o: 17 },
  {
    n: 'Switch [EDS]',
    h: true,
    s: true,
    w: 'PE Editor',
    k: 50,
    hk: 50,
    o: 22,
    ch: [
      {
        n: '.Selection Icon Item',
        h: true,
        k: 28,
        hk: 28,
        o: 20,
        ch: [{ n: '_Switch Icon', h: true, k: 8, hk: 8, o: 8 }],
      },
    ],
  },
  {
    n: 'Switch [EDS]',
    s: true,
    w: 'PE Editor',
    k: 50,
    o: 22,
    ch: [
      {
        n: '.Selection Icon Item',
        k: 28,
        o: 20,
        ch: [{ n: '_Switch Icon', k: 8, o: 8 }],
      },
    ],
  },
  textField(117, 83, 48, 23, 12),
  textField(119, 85, 49, 24, 13),
  textField(119, 85, 49, 24, 13),
  { n: '_Divider [EDS]', s: true, w: 'PE Editor', k: 6, o: 6 },
  {
    n: 'Button [EDS]',
    s: true,
    w: 'PE Editor',
    k: 20,
    o: 19,
    ch: [{ n: 'undo', k: 1, o: 1 }],
  },
  {
    n: 'Button [EDS]',
    s: true,
    w: 'PE Editor',
    k: 36,
    hk: 7,
    o: 30,
    ch: [
      { n: 'Placeholder Icon', h: true, k: 3, hk: 3, o: 3 },
      { n: 'setting backup restore', k: 3, o: 3 },
    ],
  },
  {
    n: 'Button [EDS]',
    s: true,
    w: 'PE Editor',
    k: 36,
    hk: 7,
    o: 30,
    ch: [
      { n: 'Placeholder Icon', h: true, k: 3, hk: 3, o: 3 },
      { n: 'compare', k: 3, o: 3 },
    ],
  },
]

function textField(
  k: number,
  hk: number,
  o: number,
  left: number,
  leftOwn: number,
): Summary {
  const leading: Summary = {
    n: '↳ ↳ Leading Icon Item',
    c: '.Icon Wrapper',
    h: true,
    k: 7,
    hk: 7,
    o: 4,
    ch: [{ n: 'Placeholder Icon', h: true, k: 3, hk: 3, o: 3 }],
  }
  return {
    n: 'Text Field [EDS]',
    s: true,
    w: 'PE Editor',
    k,
    hk,
    o,
    ch: [
      { n: '.↳ Optional/Required', h: true, k: 4, hk: 4, o: 4 },
      {
        n: '.↳  Information Icon',
        h: true,
        k: 24,
        hk: 24,
        o: 2,
        ch: [
          {
            n: ' Icon Button [EDS]',
            h: true,
            k: 22,
            hk: 22,
            o: 19,
            ch: [{ n: 'info circle', h: true, k: 3, hk: 3, o: 3 }],
          },
        ],
      },
      {
        n: '↳ Left Adornment',
        c: '.↳ Left Adornment',
        h: true,
        k: left,
        hk: left,
        o: leftOwn,
        ch: [
          {
            n: '.↳ Left Adornment',
            h: true,
            k: 11,
            hk: 11,
            o: 4,
            ch: [leading],
          },
        ],
      },
      {
        n: '↳ Right Adornment',
        c: '.↳ Right Adornment',
        h: true,
        k: 18,
        hk: 18,
        o: 11,
        ch: [leading],
      },
    ],
  }
}

let next = 0
function toTree(summary: Summary): InstanceTree {
  next += 1
  return {
    id: `${next}`,
    name: summary.n,
    component: summary.c ?? summary.n.trim(),
    ...(summary.h ? { hidden: true as const } : {}),
    ...(summary.s ? { slot: true as const, slotName: 'Content' } : {}),
    count: summary.k,
    hiddenCount: summary.hk ?? 0,
    own: summary.o,
    children: (summary.ch ?? []).map(toTree),
  }
}

export function peEditorInstances(): OldInstance[] {
  next = 0
  const trees = SUMMARY.map(toTree)
  const owner = trees[0]
  return SUMMARY.map((summary, index) => {
    const tree = trees[index]
    return {
      id: tree.id,
      name: summary.n,
      entryId: 'test-page',
      count: summary.k,
      ...(summary.h ? { hidden: true as const } : {}),
      ...(summary.w ? { within: { id: owner.id, name: owner.name } } : {}),
      tree,
      mainComponent: { name: summary.n.trim(), key: summary.n, remote: true },
    }
  })
}
