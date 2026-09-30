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
        <div
          key={step.id}
          className="rounded border border-muted bg-surface p-6"
        >
          <div className="mb-4">
            <h4 className="text-lg font-medium">
              {step.name} · {step.label}
            </h4>
            {step.primaryRole && (
              <p className="text-sm text-secondary">
                <code>{step.primaryRole}</code>
              </p>
            )}
            <div className="flex gap-4 mt-2 text-sm">
              <span className="text-secondary">
                Light mode: L = {step.lightValue.toFixed(3)}
              </span>
              <span className="text-secondary">
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
                  className="rounded border border-muted border-l-2 border-l-accent-emphasis py-2 pl-4"
                >
                  <p className="text-sm font-medium mb-2">
                    {targetStep
                      ? `${targetStep.name} · ${targetStep.label}`
                      : contrast.targetStep}
                  </p>
                  <p className="text-xs text-secondary mb-2">
                    <code>{contrast.pairing}</code>
                  </p>

                  <div className="space-y-2">
                    {/* APCA Level */}
                    <div className="text-sm">
                      <div className="flex items-baseline gap-2 mb-1">
                        <span className="font-medium text-info">
                          <abbr title="Accessible Perceptual Contrast Algorithm">
                            APCA
                          </abbr>{' '}
                          Lc {contrast.lc.value}:
                        </span>
                        <span className="text-secondary">
                          {contrast.lc.description}
                        </span>
                      </div>
                      {apcaLevel && contrast.lc.rules && (
                        <ul className="list-disc list-inside ml-4 text-xs text-secondary space-y-0.5">
                          {contrast.lc.rules.map((rule, ruleIndex) => (
                            <li key={ruleIndex}>{rule}</li>
                          ))}
                        </ul>
                      )}
                    </div>

                    {/* WCAG Level */}
                    <div className="text-sm">
                      <div className="flex items-baseline gap-2 mb-1">
                        <span className="font-medium text-success">
                          <abbr title="Web Content Accessibility Guidelines">
                            WCAG
                          </abbr>{' '}
                          {contrast.wcag.value}:1:
                        </span>
                        <span className="text-secondary">
                          {contrast.wcag.description}
                        </span>
                      </div>
                      {wcagLevel && contrast.wcag.rules && (
                        <ul className="list-disc list-inside ml-4 text-xs text-secondary space-y-0.5">
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
