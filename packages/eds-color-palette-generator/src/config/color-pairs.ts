import { APCA_CONTRAST_LEVELS } from '@/config/APCA_CONTRAST_LEVELS'
import { WCAG_CONTRAST_LEVELS } from '@/config/WCAG_CONTRAST_LEVELS'

type ColorPairRequirements = {
  stepIndex: number
  lc: (typeof APCA_CONTRAST_LEVELS)[keyof typeof APCA_CONTRAST_LEVELS]
  wcag: (typeof WCAG_CONTRAST_LEVELS)[keyof typeof WCAG_CONTRAST_LEVELS]
}

type ColorPair = {
  usedOnStep?: Array<ColorPairRequirements>
}

export type StepLabel = {
  title: string
  span: number
}

export const stepLabels: StepLabel[] = [
  { title: 'Background [default, subtle]', span: 2 },
  { title: 'Background [medium]', span: 3 },
  { title: 'Border', span: 3 },
  { title: 'Background [strong]', span: 3 },
  { title: 'Text default [subtle, strong]', span: 2 },
  { title: 'Text inverse [subtle, strong]', span: 2 },
]

export const colorPairs: Array<ColorPair | null> = [
  // background default 1
  {
    // usedOnStep: [
    //   { stepIndex: 9, lc: APCA_CONTRAST_LEVELS.LC_75, wcag: WCAG_CONTRAST_LEVELS.AAA_NORMAL.value }, // For readable text
    //   { stepIndex: 10, lc: APCA_CONTRAST_LEVELS.LC_60, wcag: WCAG_CONTRAST_LEVELS.AA_NORMAL.value }, // For secondary text
    // ],
  },
  // background subtle 2
  {
    // usedOnStep: [
    //   { stepIndex: 9, lc: APCA_CONTRAST_LEVELS.LC_75, wcag: WCAG_CONTRAST_LEVELS.AAA_NORMAL.value }, // For readable text
    //   { stepIndex: 10, lc: APCA_CONTRAST_LEVELS.LC_60, wcag: WCAG_CONTRAST_LEVELS.AA_NORMAL.value }, // For secondary text
    // ],
  },
  // background medium 3
  {
    usedOnStep: [
      {
        stepIndex: 0,
        lc: APCA_CONTRAST_LEVELS.LC_15,
        wcag: WCAG_CONTRAST_LEVELS.UI_COMPONENTS,
      }, // For interactive elements
      {
        stepIndex: 1,
        lc: APCA_CONTRAST_LEVELS.LC_15,
        wcag: WCAG_CONTRAST_LEVELS.UI_COMPONENTS,
      }, // For interactive elements
    ],
  },
  // background medium hover 4
  {
    usedOnStep: [
      {
        stepIndex: 0,
        lc: APCA_CONTRAST_LEVELS.LC_15,
        wcag: WCAG_CONTRAST_LEVELS.UI_COMPONENTS,
      }, // For interactive elements
      {
        stepIndex: 1,
        lc: APCA_CONTRAST_LEVELS.LC_15,
        wcag: WCAG_CONTRAST_LEVELS.UI_COMPONENTS,
      }, // For interactive elements
    ],
  },
  // background medium active 5
  {
    usedOnStep: [
      {
        stepIndex: 0,
        lc: APCA_CONTRAST_LEVELS.LC_15,
        wcag: WCAG_CONTRAST_LEVELS.UI_COMPONENTS,
      }, // For interactive elements
      {
        stepIndex: 1,
        lc: APCA_CONTRAST_LEVELS.LC_15,
        wcag: WCAG_CONTRAST_LEVELS.UI_COMPONENTS,
      }, // For interactive elements
    ],
  },
  // border subtle 6
  {
    usedOnStep: [
      {
        stepIndex: 0,
        lc: APCA_CONTRAST_LEVELS.LC_15,
        wcag: WCAG_CONTRAST_LEVELS.UI_COMPONENTS,
      }, // For borders
      {
        stepIndex: 1,
        lc: APCA_CONTRAST_LEVELS.LC_15,
        wcag: WCAG_CONTRAST_LEVELS.UI_COMPONENTS,
      }, // For borders
      {
        stepIndex: 2,
        lc: APCA_CONTRAST_LEVELS.LC_15,
        wcag: WCAG_CONTRAST_LEVELS.UI_COMPONENTS,
      }, // For borders
      {
        stepIndex: 3,
        lc: APCA_CONTRAST_LEVELS.LC_15,
        wcag: WCAG_CONTRAST_LEVELS.UI_COMPONENTS,
      }, // For borders
      {
        stepIndex: 4,
        lc: APCA_CONTRAST_LEVELS.LC_15,
        wcag: WCAG_CONTRAST_LEVELS.UI_COMPONENTS,
      }, // For borders
    ],
  },
  // border medium 7
  {
    usedOnStep: [
      {
        stepIndex: 0,
        lc: APCA_CONTRAST_LEVELS.LC_15,
        wcag: WCAG_CONTRAST_LEVELS.UI_COMPONENTS,
      }, // For borders
      {
        stepIndex: 1,
        lc: APCA_CONTRAST_LEVELS.LC_15,
        wcag: WCAG_CONTRAST_LEVELS.UI_COMPONENTS,
      }, // For borders
      {
        stepIndex: 2,
        lc: APCA_CONTRAST_LEVELS.LC_15,
        wcag: WCAG_CONTRAST_LEVELS.UI_COMPONENTS,
      }, // For borders
      {
        stepIndex: 3,
        lc: APCA_CONTRAST_LEVELS.LC_15,
        wcag: WCAG_CONTRAST_LEVELS.UI_COMPONENTS,
      }, // For borders
      {
        stepIndex: 4,
        lc: APCA_CONTRAST_LEVELS.LC_15,
        wcag: WCAG_CONTRAST_LEVELS.UI_COMPONENTS,
      }, // For borders
    ],
  },
  // border strong 8
  {
    usedOnStep: [
      {
        stepIndex: 0,
        lc: APCA_CONTRAST_LEVELS.LC_15,
        wcag: WCAG_CONTRAST_LEVELS.UI_COMPONENTS,
      }, // For borders
      {
        stepIndex: 1,
        lc: APCA_CONTRAST_LEVELS.LC_15,
        wcag: WCAG_CONTRAST_LEVELS.UI_COMPONENTS,
      }, // For borders
      {
        stepIndex: 2,
        lc: APCA_CONTRAST_LEVELS.LC_15,
        wcag: WCAG_CONTRAST_LEVELS.UI_COMPONENTS,
      }, // For borders
      {
        stepIndex: 3,
        lc: APCA_CONTRAST_LEVELS.LC_15,
        wcag: WCAG_CONTRAST_LEVELS.UI_COMPONENTS,
      }, // For borders
      {
        stepIndex: 4,
        lc: APCA_CONTRAST_LEVELS.LC_15,
        wcag: WCAG_CONTRAST_LEVELS.UI_COMPONENTS,
      }, // For borders
    ],
  },
  // background strong base 9
  {
    usedOnStep: [
      {
        stepIndex: 0,
        lc: APCA_CONTRAST_LEVELS.LC_60,
        wcag: WCAG_CONTRAST_LEVELS.AAA_NORMAL,
      }, // For text on strong base
      {
        stepIndex: 1,
        lc: APCA_CONTRAST_LEVELS.LC_60,
        wcag: WCAG_CONTRAST_LEVELS.AAA_NORMAL,
      }, // For text on strong base
    ],
  },
  // background strong hover 10
  {
    usedOnStep: [
      {
        stepIndex: 0,
        lc: APCA_CONTRAST_LEVELS.LC_60,
        wcag: WCAG_CONTRAST_LEVELS.AAA_NORMAL,
      }, // For text on strong hover
      {
        stepIndex: 1,
        lc: APCA_CONTRAST_LEVELS.LC_60,
        wcag: WCAG_CONTRAST_LEVELS.AAA_NORMAL,
      }, // For text on strong hover
    ],
  },
  // background strong active 11
  {
    usedOnStep: [
      {
        stepIndex: 0,
        lc: APCA_CONTRAST_LEVELS.LC_60,
        wcag: WCAG_CONTRAST_LEVELS.AAA_NORMAL,
      }, // For text on strong active
      {
        stepIndex: 1,
        lc: APCA_CONTRAST_LEVELS.LC_60,
        wcag: WCAG_CONTRAST_LEVELS.AAA_NORMAL,
      }, // For text on strong active
    ],
  },
  // text subtle 12
  {
    usedOnStep: [
      {
        stepIndex: 0,
        lc: APCA_CONTRAST_LEVELS.LC_60,
        wcag: WCAG_CONTRAST_LEVELS.AA_NORMAL,
      },
      {
        stepIndex: 1,
        lc: APCA_CONTRAST_LEVELS.LC_60,
        wcag: WCAG_CONTRAST_LEVELS.AA_NORMAL,
      },
      {
        stepIndex: 2,
        lc: APCA_CONTRAST_LEVELS.LC_60,
        wcag: WCAG_CONTRAST_LEVELS.AA_NORMAL,
      },
      {
        stepIndex: 3,
        lc: APCA_CONTRAST_LEVELS.LC_60,
        wcag: WCAG_CONTRAST_LEVELS.AA_NORMAL,
      },
      {
        stepIndex: 4,
        lc: APCA_CONTRAST_LEVELS.LC_60,
        wcag: WCAG_CONTRAST_LEVELS.AA_NORMAL,
      },
    ],
  },
  //  text strong 13
  {
    usedOnStep: [
      {
        stepIndex: 0,
        lc: APCA_CONTRAST_LEVELS.LC_90,
        wcag: WCAG_CONTRAST_LEVELS.AAA_NORMAL,
      },
      {
        stepIndex: 1,
        lc: APCA_CONTRAST_LEVELS.LC_90,
        wcag: WCAG_CONTRAST_LEVELS.AAA_NORMAL,
      },
      {
        stepIndex: 2,
        lc: APCA_CONTRAST_LEVELS.LC_60,
        wcag: WCAG_CONTRAST_LEVELS.AAA_NORMAL,
      },
      {
        stepIndex: 3,
        lc: APCA_CONTRAST_LEVELS.LC_60,
        wcag: WCAG_CONTRAST_LEVELS.AAA_NORMAL,
      },
      {
        stepIndex: 4,
        lc: APCA_CONTRAST_LEVELS.LC_60,
        wcag: WCAG_CONTRAST_LEVELS.AAA_NORMAL,
      },
    ],
  },
  // text inverse-subtle 14
  {
    usedOnStep: [
      {
        stepIndex: 8,
        lc: APCA_CONTRAST_LEVELS.LC_60,
        wcag: WCAG_CONTRAST_LEVELS.AAA_NORMAL,
      }, // For UI elements
      {
        stepIndex: 9,
        lc: APCA_CONTRAST_LEVELS.LC_60,
        wcag: WCAG_CONTRAST_LEVELS.AAA_NORMAL,
      }, // For interactive states
      {
        stepIndex: 10,
        lc: APCA_CONTRAST_LEVELS.LC_60,
        wcag: WCAG_CONTRAST_LEVELS.AAA_NORMAL,
      }, // For interactive states
    ],
  },
  // text inverse-strong 15
  {
    usedOnStep: [
      {
        stepIndex: 8,
        lc: APCA_CONTRAST_LEVELS.LC_60,
        wcag: WCAG_CONTRAST_LEVELS.AAA_NORMAL,
      }, // For UI elements
      {
        stepIndex: 9,
        lc: APCA_CONTRAST_LEVELS.LC_60,
        wcag: WCAG_CONTRAST_LEVELS.AAA_NORMAL,
      }, // For interactive states
      {
        stepIndex: 10,
        lc: APCA_CONTRAST_LEVELS.LC_60,
        wcag: WCAG_CONTRAST_LEVELS.AAA_NORMAL,
      }, // For interactive states
    ],
  },
]
