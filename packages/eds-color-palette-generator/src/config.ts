import { APCA_CONTRAST_LEVELS } from '@/config/APCA_CONTRAST_LEVELS'
import { WCAG_CONTRAST_LEVELS } from '@/config/WCAG_CONTRAST_LEVELS'

export const lightnessValuesInDarkMode = [
  0.15, 0.253, 0.44, 0.356, 0.407, 0.433, 0.574, 0.7, 0.84, 0.947, 1,
]

export const lightnessValuesInLightMode = [
  1, 0.965, 0.91, 0.857, 0.804, 0.789, 0.584, 0.482, 0.35, 0.237, 1,
]

type ColorPairRequirements = {
  stepIndex: number
  lc: (typeof APCA_CONTRAST_LEVELS)[keyof typeof APCA_CONTRAST_LEVELS]
  wcag: (typeof WCAG_CONTRAST_LEVELS)[keyof typeof WCAG_CONTRAST_LEVELS]
}

type ColorPair = {
  usedOnStep?: Array<ColorPairRequirements>
}

export const colorPairs: Array<ColorPair | null> = [
  // background 1
  {
    // usedOnStep: [
    //   { stepIndex: 9, lc: APCA_CONTRAST_LEVELS.LC_75, wcag: WCAG_CONTRAST_LEVELS.AAA_NORMAL.value }, // For readable text
    //   { stepIndex: 10, lc: APCA_CONTRAST_LEVELS.LC_60, wcag: WCAG_CONTRAST_LEVELS.AA_NORMAL.value }, // For secondary text
    // ],
  },
  // background 2
  {
    // usedOnStep: [
    //   { stepIndex: 9, lc: APCA_CONTRAST_LEVELS.LC_75, wcag: WCAG_CONTRAST_LEVELS.AAA_NORMAL.value }, // For readable text
    //   { stepIndex: 10, lc: APCA_CONTRAST_LEVELS.LC_60, wcag: WCAG_CONTRAST_LEVELS.AA_NORMAL.value }, // For secondary text
    // ],
  },
  // interactive 3
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
  // interactive 4
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
  // interactive 5
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
  // accessible text 9
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
  // accessible text 10
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
  // accessible text 11
  {
    usedOnStep: [
      {
        stepIndex: 11,
        lc: APCA_CONTRAST_LEVELS.LC_60,
        wcag: WCAG_CONTRAST_LEVELS.AA_LARGE,
      }, // For UI elements
      {
        stepIndex: 12,
        lc: APCA_CONTRAST_LEVELS.LC_45,
        wcag: WCAG_CONTRAST_LEVELS.UI_COMPONENTS,
      }, // For interactive states
      {
        stepIndex: 13,
        lc: APCA_CONTRAST_LEVELS.LC_45,
        wcag: WCAG_CONTRAST_LEVELS.UI_COMPONENTS,
      }, // For interactive states
    ],
  },
  // solid 12
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
  // solid 13 (hover)
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
  // solid 14 (active)
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
