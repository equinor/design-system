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
  // background medium 4
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
  // background medium 5
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
  // border 6
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
  // border 7
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
  // border 8
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
  // text subtle 9
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
  //  text strong 10
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
  // text inverse-subtle 11
  {
    usedOnStep: [
      {
        stepIndex: 12,
        lc: APCA_CONTRAST_LEVELS.LC_60,
        wcag: WCAG_CONTRAST_LEVELS.AAA_NORMAL,
      }, // For UI elements
      {
        stepIndex: 13,
        lc: APCA_CONTRAST_LEVELS.LC_60,
        wcag: WCAG_CONTRAST_LEVELS.AAA_NORMAL,
      }, // For interactive states
      {
        stepIndex: 14,
        lc: APCA_CONTRAST_LEVELS.LC_60,
        wcag: WCAG_CONTRAST_LEVELS.AAA_NORMAL,
      }, // For interactive states
    ],
  },
  // text inverse-strong text 11
  {
    usedOnStep: [
      {
        stepIndex: 12,
        lc: APCA_CONTRAST_LEVELS.LC_60,
        wcag: WCAG_CONTRAST_LEVELS.AAA_NORMAL,
      }, // For UI elements
      {
        stepIndex: 13,
        lc: APCA_CONTRAST_LEVELS.LC_60,
        wcag: WCAG_CONTRAST_LEVELS.AAA_NORMAL,
      }, // For interactive states
      {
        stepIndex: 14,
        lc: APCA_CONTRAST_LEVELS.LC_60,
        wcag: WCAG_CONTRAST_LEVELS.AAA_NORMAL,
      }, // For interactive states
    ],
  },
  // background strong 12
  {
    usedOnStep: [
      {
        stepIndex: 0,
        lc: APCA_CONTRAST_LEVELS.LC_15,
        wcag: WCAG_CONTRAST_LEVELS.AA_LARGE,
      }, // For UI elements
      {
        stepIndex: 1,
        lc: APCA_CONTRAST_LEVELS.LC_15,
        wcag: WCAG_CONTRAST_LEVELS.AA_LARGE,
      }, // For UI elements
    ],
  },
  // background strong 13 (hover)
  {
    usedOnStep: [
      {
        stepIndex: 0,
        lc: APCA_CONTRAST_LEVELS.LC_15,
        wcag: WCAG_CONTRAST_LEVELS.UI_COMPONENTS,
      }, // For interactive states
      {
        stepIndex: 1,
        lc: APCA_CONTRAST_LEVELS.LC_15,
        wcag: WCAG_CONTRAST_LEVELS.UI_COMPONENTS,
      }, // For interactive states
    ],
  },
  // background strong 14 (active)
  {
    usedOnStep: [
      {
        stepIndex: 0,
        lc: APCA_CONTRAST_LEVELS.LC_15,
        wcag: WCAG_CONTRAST_LEVELS.UI_COMPONENTS,
      }, // For interactive states
      {
        stepIndex: 1,
        lc: APCA_CONTRAST_LEVELS.LC_15,
        wcag: WCAG_CONTRAST_LEVELS.UI_COMPONENTS,
      }, // For interactive states
    ],
  },
]
