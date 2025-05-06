import { APCA_CONTRAST_LEVELS } from "@/config/APCA_CONTRAST_LEVELS";
import { WCAG_CONTRAST_LEVELS } from "@/config/WCAG_CONTRAST_LEVELS";

export const lightnessValuesInDarkMode = [
  0.218, // --ld-1
  0.253, // --ld-2
  0.304, // --ld-3
  0.356, // --ld-4
  0.407, // --ld-5
  0.433, // --ld-6
  0.574, // --ld-7
  0.7, // --ld-8
  0.821, // --ld-12
  0.947, // --ld-13
];

export const lightnessValuesInLightMode = [
  1, 0.965, 0.91, 0.857, 0.804, 0.788, 0.584, 0.482, 0.39, 0.237,
];

type ColorPairRequirements = {
  stepIndex: number;
  lc: (typeof APCA_CONTRAST_LEVELS)[keyof typeof APCA_CONTRAST_LEVELS];
  wcag: (typeof WCAG_CONTRAST_LEVELS)[keyof typeof WCAG_CONTRAST_LEVELS];
};

type ColorPair = {
  usedOnStep?: Array<ColorPairRequirements>;
};

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
        lc: APCA_CONTRAST_LEVELS.LC_90,
        wcag: WCAG_CONTRAST_LEVELS.AAA_NORMAL,
      },
      {
        stepIndex: 3,
        lc: APCA_CONTRAST_LEVELS.LC_90,
        wcag: WCAG_CONTRAST_LEVELS.AAA_NORMAL,
      },
      {
        stepIndex: 4,
        lc: APCA_CONTRAST_LEVELS.LC_90,
        wcag: WCAG_CONTRAST_LEVELS.AAA_NORMAL,
      },
    ],
  },
  // solid 11
  {
    // usedOnStep: [
    //   { stepIndex: 0, lc: APCA_CONTRAST_LEVELS.LC_60, wcag: WCAG_CONTRAST_LEVELS.AA_LARGE.value }, // For UI elements
    //   { stepIndex: 1, lc: APCA_CONTRAST_LEVELS.LC_60, wcag: WCAG_CONTRAST_LEVELS.AA_LARGE.value }, // For UI elements
    // ],
  },
  // solid 12 (hover)
  {
    // usedOnStep: [
    //   { stepIndex: 0, lc: APCA_CONTRAST_LEVELS.LC_45, wcag: WCAG_CONTRAST_LEVELS.UI_COMPONENTS.value }, // For interactive states
    //   { stepIndex: 1, lc: APCA_CONTRAST_LEVELS.LC_45, wcag: WCAG_CONTRAST_LEVELS.UI_COMPONENTS.value }, // For interactive states
    // ],
  },
  // solid 13 (active)
  {
    // usedOnStep: [
    //   { stepIndex: 0, lc: APCA_CONTRAST_LEVELS.LC_45, wcag: WCAG_CONTRAST_LEVELS.UI_COMPONENTS.value }, // For interactive states
    //   { stepIndex: 1, lc: APCA_CONTRAST_LEVELS.LC_45, wcag: WCAG_CONTRAST_LEVELS.UI_COMPONENTS.value }, // For interactive states
    // ],
  },
];
