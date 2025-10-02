'use client'

import { PALETTE_STEPS } from '@/config/config'
import { APCA_CONTRAST_LEVELS } from '@/config/APCA_CONTRAST_LEVELS'
import { WCAG_CONTRAST_LEVELS } from '@/config/WCAG_CONTRAST_LEVELS'

export const ContrastRequirementsTable = () => {
  // Get all steps with contrast requirements
  const stepsWithContrast = PALETTE_STEPS.filter(
    (step) => step.contrastWith && step.contrastWith.length > 0,
  )

  return (
    <div className="space-y-6">
      {stepsWithContrast.map((step) => (
        <div key={step.id} className="bg-surface rounded-lg p-6">
          <div className="mb-4">
            <h4 className="text-lg font-semibold">{step.name}</h4>
            <p className="text-sm text-neutral-subtle">
              Category: {step.category}
              {step.variant && ` • Variant: ${step.variant}`}
            </p>
            <div className="flex gap-4 mt-2 text-sm">
              <span className="text-neutral-subtle">
                Light mode: L = {step.lightValue.toFixed(3)}
              </span>
              <span className="text-neutral-subtle">
                Dark mode: L = {step.darkValue.toFixed(3)}
              </span>
            </div>
          </div>

          <div className="space-y-3">
            <p className="text-sm font-medium">Contrast requirements with:</p>
            {step.contrastWith?.map((contrast, index) => {
              const targetStep = PALETTE_STEPS.find(
                (s) => s.id === contrast.targetStep,
              )
              const apcaLevel = Object.entries(APCA_CONTRAST_LEVELS).find(
                ([, value]) => value === contrast.lc,
              )
              const wcagLevel = Object.entries(WCAG_CONTRAST_LEVELS).find(
                ([, value]) => value === contrast.wcag,
              )

              return (
                <div
                  key={index}
                  className="border-l-2 border-blue-500 pl-4 py-2 border border-neutral-subtle rounded"
                >
                  <p className="text-sm font-medium mb-2">
                    {targetStep?.name || contrast.targetStep}
                  </p>

                  <div className="space-y-2">
                    {/* APCA Level */}
                    <div className="text-sm">
                      <div className="flex items-baseline gap-2 mb-1">
                        <span className="font-medium text-blue-600 dark:text-blue-400">
                          <abbr title="Accessible Perceptual Contrast Algorithm">
                            APCA
                          </abbr>{' '}
                          Lc {contrast.lc.value}:
                        </span>
                        <span className="text-neutral-subtle">
                          {contrast.lc.description}
                        </span>
                      </div>
                      {apcaLevel && contrast.lc.rules && (
                        <ul className="list-disc list-inside ml-4 text-xs text-neutral-subtle space-y-0.5">
                          {contrast.lc.rules.map((rule, ruleIndex) => (
                            <li key={ruleIndex}>{rule}</li>
                          ))}
                        </ul>
                      )}
                    </div>

                    {/* WCAG Level */}
                    <div className="text-sm">
                      <div className="flex items-baseline gap-2 mb-1">
                        <span className="font-medium text-green-600 dark:text-green-400">
                          <abbr title="Web Content Accessibility Guidelines">
                            WCAG
                          </abbr>{' '}
                          {contrast.wcag.value}:1:
                        </span>
                        <span className="text-neutral-subtle">
                          {contrast.wcag.description}
                        </span>
                      </div>
                      {wcagLevel && contrast.wcag.rules && (
                        <ul className="list-disc list-inside ml-4 text-xs text-neutral-subtle space-y-0.5">
                          {contrast.wcag.rules.map((rule, ruleIndex) => (
                            <li key={ruleIndex}>{rule}</li>
                          ))}
                        </ul>
                      )}
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      ))}
    </div>
  )
}
