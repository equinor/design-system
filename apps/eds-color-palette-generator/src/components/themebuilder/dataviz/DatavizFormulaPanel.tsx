'use client'

import { useId, useMemo, useState } from 'react'
import { useColorScheme } from '@/context/ColorSchemeContext'
import {
  DATAVIZ_FORMULA_STEPS,
  SCHEMES,
  TS_DATAVIZ,
  TS_DATAVIZ_FORMULA,
} from '@/config/tokensStudio'
import type {
  DatavizFormulaInputs,
  DatavizFormulaStep,
  Scheme,
} from '@/config/tokensStudio'
import { DEFAULT_CATEGORICAL } from '@/config/dataviz-defaults'
import {
  datavizRampValues,
  datavizStepSide,
  generateDatavizRamps,
} from '@/utils/dataviz'
import {
  CVD_TOLERANCE,
  DATAVIZ_RAMP_TARGETS as T,
  DATAVIZ_SCORED_SERIES,
  checkDatavizCategory,
  scoreDatavizSeries,
} from '@/utils/dataviz-a11y'
import type { ContrastPair, DatavizCategoryCheck } from '@/utils/dataviz-a11y'
import { resolveToken, toneRamps } from '@/utils/semanticTokens'
import { Badge } from '@/components/shared/Badge'
import { Button } from '@/components/shared/Button'
import { Card } from '@/components/shared/Card'
import { SegmentedControl } from '@/components/shared/SegmentedControl'
import type { SegmentedOption } from '@/components/shared/SegmentedControl'

const SCHEME_OPTIONS: SegmentedOption<Scheme>[] = [
  { value: 'light', label: 'Light' },
  { value: 'dark', label: 'Dark' },
]

const INPUT_CLASS =
  'w-20 rounded border border-input bg-input px-2 py-1 text-sm text-primary hover:border-input-hover'

const TH =
  'border-b border-muted px-2 py-1.5 text-left align-bottom text-xs font-medium text-secondary'

const TD = 'border-b border-muted px-2 py-1.5 align-top'

/** The same floor the categorical generator above uses for its CVD audit. */
const CVD_FLOOR = DEFAULT_CATEGORICAL.minDeltaE * CVD_TOLERANCE

const TOTAL_VALUES = SCHEMES.length * TS_DATAVIZ_FORMULA.bases.length * 5

const formatRatio = (ratio: number) => `${ratio.toFixed(2)}:1`
const formatLc = (lc: number) => `Lc ${lc.toFixed(1)}`

/** The number of inputs that differ from Tokens Studio. */
function changedInputs(inputs: DatavizFormulaInputs): number {
  const ts = TS_DATAVIZ_FORMULA
  let count = inputs.bases.filter((base, i) => base !== ts.bases[i]).length
  for (const scheme of SCHEMES) {
    for (const step of DATAVIZ_FORMULA_STEPS) {
      if (inputs.weight[scheme][step] !== ts.weight[scheme][step]) count++
    }
    for (const side of ['background', 'contrast'] as const) {
      if (
        inputs.chromaReduction[scheme][side] !==
        ts.chromaReduction[scheme][side]
      )
        count++
    }
  }
  return count
}

/** A value with a badge: Pass/Fail for a requirement, Met/Below for a goal. */
function Measure({
  text,
  pass,
  kind,
}: {
  text: string
  pass: boolean
  kind: 'requirement' | 'goal'
}) {
  const label =
    kind === 'requirement' ? (pass ? 'Pass' : 'Fail') : pass ? 'Met' : 'Below'
  return (
    <span className="flex items-center gap-1.5 whitespace-nowrap">
      <span className="font-mono text-xs text-primary">{text}</span>
      <Badge pass={pass} label={label} />
    </span>
  )
}

function TextCheck({ pair }: { pair: ContrastPair }) {
  return (
    <div className="flex flex-col gap-1">
      <Measure
        text={formatRatio(pair.ratio)}
        pass={pair.ratio >= T.textRatio}
        kind="requirement"
      />
      <Measure
        text={formatLc(pair.lc)}
        pass={pair.lc >= T.textLc}
        kind="goal"
      />
    </div>
  )
}

/** Chart goals: the ratio is left out where another check already covers it. */
function ChartCheck({
  pair,
  ratio,
  lc,
}: {
  pair: ContrastPair
  ratio?: number
  lc: number
}) {
  return (
    <div className="flex flex-col gap-1">
      {ratio !== undefined && (
        <Measure
          text={formatRatio(pair.ratio)}
          pass={pair.ratio >= ratio}
          kind="goal"
        />
      )}
      <Measure text={formatLc(pair.lc)} pass={pair.lc >= lc} kind="goal" />
    </div>
  )
}

function NumberInput({
  label,
  value,
  tokensStudio,
  onChange,
}: {
  label: string
  value: number
  tokensStudio: number
  onChange: (value: number) => void
}) {
  const id = useId()
  const hintId = `${id}-hint`
  // The typed text, so the field can be cleared or hold a half-typed number.
  // Only a number that parses is sent up, clamped to 0 to 1.
  const [draft, setDraft] = useState(String(value))
  // Take the value again when it changes from outside, e.g. on Reset or when
  // the scheme changes
  const [syncedValue, setSyncedValue] = useState(value)
  if (value !== syncedValue) {
    setSyncedValue(value)
    setDraft(String(value))
  }

  return (
    <div className="flex flex-col gap-1 text-sm text-primary">
      <label htmlFor={id} className="font-medium">
        {label}
      </label>
      <input
        id={id}
        type="number"
        min={0}
        max={1}
        step={0.01}
        value={draft}
        aria-describedby={hintId}
        onChange={(e) => {
          const text = e.target.value
          setDraft(text)
          const next = Number(text)
          if (text.trim() !== '' && Number.isFinite(next)) {
            onChange(Math.min(1, Math.max(0, next)))
          }
        }}
        // An empty or unfinished field shows the value in use again
        onBlur={() => setDraft(String(value))}
        className={INPUT_CLASS}
      />
      <span id={hintId} className="text-xs text-secondary">
        {value === tokensStudio
          ? 'Tokens Studio value'
          : `Tokens Studio: ${tokensStudio}`}
      </span>
    </div>
  )
}

/**
 * The EDS categorical ramps, computed from the Tokens Studio formula inputs,
 * with the contrast and colour-blindness checks per category. The inputs can
 * be changed here to try a proposal before it is made in Tokens Studio.
 */
export function DatavizFormulaPanel() {
  const { colorScheme } = useColorScheme()
  // Follows the page's scheme until a scheme is picked here
  const [chosenScheme, setScheme] = useState<Scheme | null>(null)
  const scheme = chosenScheme ?? colorScheme
  const [inputs, setInputs] = useState<DatavizFormulaInputs>(TS_DATAVIZ_FORMULA)
  const captionId = useId()

  const ramps = useMemo(() => generateDatavizRamps(inputs), [inputs])

  const changed = changedInputs(inputs)
  const differing = useMemo(
    () =>
      SCHEMES.reduce((count, s) => {
        const values = datavizRampValues(ramps[s])
        return (
          count +
          Object.entries(values).filter(
            ([path, hex]) => TS_DATAVIZ[s][path] !== hex,
          ).length
        )
      }, 0),
    [ramps],
  )

  // The backgrounds and text colours of the chosen scheme, from Tokens Studio
  const checks: DatavizCategoryCheck[] = useMemo(() => {
    const tones = toneRamps(scheme)
    const resolve = (path: string) =>
      resolveToken(path, tones, scheme) ?? '#808080'
    const backgrounds = {
      canvas: resolve('background.canvas'),
      surface: resolve('background.surface'),
    }
    const texts = ['text.primary', 'text.inverted'].map((token) => ({
      token,
      hex: resolve(token),
    }))
    return ramps[scheme].map((steps) =>
      checkDatavizCategory(steps, backgrounds, texts),
    )
  }, [ramps, scheme])

  const cvd = useMemo(
    () =>
      [3, 4].map((step) => ({
        step,
        scores: scoreDatavizSeries(ramps[scheme], step),
      })),
    [ramps, scheme],
  )

  const textPasses = checks.filter(
    (c) =>
      c.textOnStep1.ratio >= T.textRatio && c.textOnStep2.ratio >= T.textRatio,
  ).length
  const borderPasses = checks.filter(
    (c) =>
      c.step4OnCanvas >= T.borderRatio && c.step4OnSurface >= T.borderRatio,
  ).length
  const cvdScores = cvd.flatMap(({ scores }) => scores)
  const cvdMet = cvdScores.filter((s) => s.minDeltaE >= CVD_FLOOR).length

  const summary = `Text on steps 1 and 2 reaches ${T.textRatio}:1 in ${textPasses} of ${checks.length} categories, and step 4 reaches ${T.borderRatio}:1 on both canvas and surface in ${borderPasses} of ${checks.length}. The colour-blindness goal is met in ${cvdMet} of ${cvdScores.length} simulations.`
  // Read out by screen readers only when the proposal state or a count
  // changes, not on every change of a value
  const announcement = `${changed === 0 ? 'Tokens Studio values.' : 'Proposal.'} ${summary}`

  const setWeight = (step: DatavizFormulaStep, value: number) =>
    setInputs((prev) => ({
      ...prev,
      weight: {
        ...prev.weight,
        [scheme]: { ...prev.weight[scheme], [step]: value },
      },
    }))

  const setReduction = (side: 'background' | 'contrast', value: number) =>
    setInputs((prev) => ({
      ...prev,
      chromaReduction: {
        ...prev.chromaReduction,
        [scheme]: { ...prev.chromaReduction[scheme], [side]: value },
      },
    }))

  const setBase = (index: number, hex: string) =>
    setInputs((prev) => ({
      ...prev,
      bases: prev.bases.map((base, i) => (i === index ? hex : base)),
    }))

  return (
    <Card
      title="EDS categorical ramps"
      description="The ten categorical ramps, computed from the inputs of the formula in Tokens Studio, and checked against what components and charts need."
      actions={
        <Button
          size="sm"
          onClick={() => setInputs(TS_DATAVIZ_FORMULA)}
          disabled={changed === 0}
        >
          Reset to Tokens Studio
        </Button>
      }
    >
      <div className="flex flex-col gap-5">
        <p className="m-0 max-w-3xl text-sm text-secondary">
          Tokens Studio is the source of these values: steps 1, 2, 4 and 5 of
          each category are computed from the base colour (step 3) by moving its
          lightness towards white or black by the step&apos;s weight and
          reducing its chroma by the side&apos;s chroma reduction times the
          weight. Changes here are proposals for checking ideas. To change EDS,
          change the inputs in Tokens Studio.
        </p>

        <p className="m-0 flex flex-wrap items-center gap-2 text-sm text-secondary">
          {changed === 0 ? (
            <>
              <Badge pass={differing === 0} label="Tokens Studio" />
              {differing === 0
                ? `All ${TOTAL_VALUES} values match the Tokens Studio export.`
                : `${differing} of ${TOTAL_VALUES} values differ from the Tokens Studio export.`}
            </>
          ) : (
            <>
              <Badge pass variant="level" label="Proposal" />
              {`${changed} ${changed === 1 ? 'input differs' : 'inputs differ'} from Tokens Studio, and ${differing} of ${TOTAL_VALUES} values change.`}
            </>
          )}
        </p>

        <SegmentedControl
          mode="radio"
          aria-label="Colour scheme of the ramps"
          options={SCHEME_OPTIONS}
          value={scheme}
          onChange={setScheme}
          className="self-start"
        />

        <p className="sr-only" role="status">
          {announcement}
        </p>

        {/* Formula inputs for the chosen scheme */}
        <fieldset className="m-0 flex flex-wrap gap-5 border-0 p-0">
          <legend className="mb-2 p-0 text-sm font-medium text-primary">
            Inputs for the {scheme} scheme
          </legend>
          {DATAVIZ_FORMULA_STEPS.map((step) => (
            <NumberInput
              key={step}
              label={`Step ${step} weight (towards ${datavizStepSide(scheme, step).towards})`}
              value={inputs.weight[scheme][step]}
              tokensStudio={TS_DATAVIZ_FORMULA.weight[scheme][step]}
              onChange={(value) => setWeight(step, value)}
            />
          ))}
          <NumberInput
            label="Chroma reduction, steps 1 and 2"
            value={inputs.chromaReduction[scheme].background}
            tokensStudio={TS_DATAVIZ_FORMULA.chromaReduction[scheme].background}
            onChange={(value) => setReduction('background', value)}
          />
          <NumberInput
            label="Chroma reduction, steps 4 and 5"
            value={inputs.chromaReduction[scheme].contrast}
            tokensStudio={TS_DATAVIZ_FORMULA.chromaReduction[scheme].contrast}
            onChange={(value) => setReduction('contrast', value)}
          />
        </fieldset>

        {/* Colour-blindness score of the first five series */}
        <div className="flex flex-col gap-2 text-sm">
          <h3 className="m-0 text-sm font-medium text-primary">
            Goal: series 1 to {DATAVIZ_SCORED_SERIES} apart under colour-vision
            deficiency
          </h3>
          {cvd.map(({ step, scores }) => (
            <div
              key={step}
              className="flex flex-wrap items-center gap-3 text-secondary"
            >
              <span className="w-14 font-medium text-primary">Step {step}</span>
              {scores.map((s) => (
                <span key={s.type} className="flex items-center gap-1.5">
                  {s.type} (ΔE {s.minDeltaE.toFixed(3)}, cat.
                  {s.worstPair[0] + 1} and cat.{s.worstPair[1] + 1})
                  <Badge
                    pass={s.minDeltaE >= CVD_FLOOR}
                    label={s.minDeltaE >= CVD_FLOOR ? 'Met' : 'Below'}
                  />
                </span>
              ))}
            </div>
          ))}
          <p className="m-0 text-xs text-secondary">
            The closest pair of the five series after simulation. The goal is a
            ΔE of {CVD_FLOOR.toFixed(2)} or more, the same floor as the
            categorical generator above. It is a goal, so a pair below it is
            reported and does not fail the ramps.
          </p>
        </div>

        <p className="m-0 text-sm text-secondary">{summary}</p>

        {/* The ramps and checks, shown in the chosen scheme */}
        {/* Scrolls sideways when the table is wider than the card. It can take
            focus so the keyboard can scroll it too. */}
        <div
          data-color-scheme={scheme}
          role="region"
          aria-labelledby={captionId}
          tabIndex={0}
          className="overflow-x-auto rounded-sm border border-muted bg-surface text-primary"
        >
          <table className="w-full border-collapse text-sm">
            <caption id={captionId} className="sr-only">
              Categorical ramps and checks, {scheme} scheme
            </caption>
            <thead>
              <tr>
                <th scope="col" className={TH}>
                  Category and base colour
                </th>
                <th scope="col" className={TH}>
                  Steps 1 to 5
                </th>
                <th scope="col" className={TH}>
                  Text on step 1
                  <br />
                  {T.textRatio}:1, Lc {T.textLc} target
                </th>
                <th scope="col" className={TH}>
                  Text on step 2
                  <br />
                  {T.textRatio}:1, Lc {T.textLc} target
                </th>
                <th scope="col" className={TH}>
                  Step 4 on canvas and surface
                  <br />
                  {T.borderRatio}:1
                </th>
                <th scope="col" className={TH}>
                  Chart, step 3 on surface
                  <br />
                  Goal {T.step3ChartRatio}:1, Lc {T.step3ChartLc}
                </th>
                <th scope="col" className={TH}>
                  Chart, step 4 on surface
                  <br />
                  Goal Lc {T.step4ChartLc}
                </th>
              </tr>
            </thead>
            <tbody>
              {ramps[scheme].map((steps, i) => {
                const check = checks[i]
                const name = `cat.${i + 1}`
                const baseChanged =
                  inputs.bases[i] !== TS_DATAVIZ_FORMULA.bases[i]
                return (
                  <tr key={name} data-testid="dataviz-formula-row">
                    <th scope="row" className={`${TD} text-left font-medium`}>
                      <div className="flex items-center gap-2">
                        <span>{name}</span>
                        <input
                          type="color"
                          aria-label={`Base colour of ${name}`}
                          value={steps[2]}
                          onChange={(e) => setBase(i, e.target.value)}
                          className="h-7 w-9 cursor-pointer rounded-sm border border-input bg-input"
                        />
                      </div>
                      {baseChanged && (
                        <span className="text-xs font-normal text-secondary">
                          Tokens Studio: {TS_DATAVIZ_FORMULA.bases[i]}
                        </span>
                      )}
                    </th>
                    <td className={TD}>
                      <div className="flex gap-1">
                        {steps.map((hex, s) => (
                          <div
                            key={s}
                            className="flex flex-col items-center gap-0.5"
                          >
                            <span
                              className="flex size-10 items-center justify-center rounded-sm border border-muted text-xs font-medium"
                              style={{
                                backgroundColor: hex,
                                color: s < 2 ? check.text.hex : undefined,
                              }}
                              aria-hidden="true"
                            >
                              {s < 2 ? 'Aa' : ''}
                            </span>
                            <span className="font-mono text-xs text-secondary">
                              {hex}
                            </span>
                          </div>
                        ))}
                      </div>
                    </td>
                    <td className={TD}>
                      <div className="mb-1 text-xs text-secondary">
                        {check.text.token}
                      </div>
                      <TextCheck pair={check.textOnStep1} />
                    </td>
                    <td className={TD}>
                      <div className="mb-1 text-xs text-secondary">
                        {check.text.token}
                      </div>
                      <TextCheck pair={check.textOnStep2} />
                    </td>
                    <td className={TD}>
                      <div className="flex flex-col gap-1">
                        <Measure
                          text={formatRatio(check.step4OnCanvas)}
                          pass={check.step4OnCanvas >= T.borderRatio}
                          kind="requirement"
                        />
                        <Measure
                          text={formatRatio(check.step4OnSurface)}
                          pass={check.step4OnSurface >= T.borderRatio}
                          kind="requirement"
                        />
                      </div>
                    </td>
                    <td className={TD}>
                      <ChartCheck
                        pair={check.step3Chart}
                        ratio={T.step3ChartRatio}
                        lc={T.step3ChartLc}
                      />
                    </td>
                    <td className={TD}>
                      <ChartCheck
                        pair={check.step4Chart}
                        lc={T.step4ChartLc}
                      />
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
        <p className="m-0 text-xs text-secondary">
          Pass and Fail are requirements: text on the fills of Chip, Badge and
          diagram objects, and the step 4 border. Met and Below are targets and
          goals: the APCA target for text, the chart goals and the
          colour-blindness goal above. The 3:1 of step 4 on the surface is
          checked once, as the border requirement. The text is text.primary or text.inverted, whichever
          reads better on both steps 1 and 2, because rest and hover share it. A
          base colour applies to both schemes, as in Tokens Studio.
        </p>
      </div>
    </Card>
  )
}
