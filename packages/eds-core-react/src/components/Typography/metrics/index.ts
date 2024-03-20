type FontMetrics = {
  familyName: string
  category?: string
  capHeight: number
  ascent: number
  descent: number
  lineGap: number
  unitsPerEm: number
  xHeight: number
  xWidthAvg: number
  subsets: {
    latin: {
      xWidthAvg: number
    }
    thai: {
      xWidthAvg: number
    }
  }
}

export const inter: FontMetrics = {
  familyName: 'Inter',
  category: 'sans-serif',
  capHeight: 2048,
  ascent: 2728,
  descent: -680,
  lineGap: 0,
  unitsPerEm: 2816,
  xHeight: 1536,
  xWidthAvg: 1344,
  subsets: {
    latin: {
      xWidthAvg: 1344,
    },
    thai: {
      xWidthAvg: 2800,
    },
  },
}

export const equinor: FontMetrics = {
  familyName: 'Equinor Light',
  capHeight: 700,
  ascent: 943,
  descent: -212,
  lineGap: 0,
  unitsPerEm: 1000,
  xHeight: 480,
  xWidthAvg: 426,
  subsets: {
    latin: {
      xWidthAvg: 426,
    },
    thai: {
      xWidthAvg: 544,
    },
  },
}

type Metrics = {
  equinor: FontMetrics
  inter: FontMetrics
}

export const metrics: Metrics = { equinor, inter }
