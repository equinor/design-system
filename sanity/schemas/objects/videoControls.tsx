import { ValidationRule, ValidationContext } from '../../types/schemaTypes'

export default {
  name: 'videoControls',
  title: 'Video Controls',
  type: 'object',
  fields: [
    {
      name: 'playButton',
      type: 'boolean',
      title: 'Play Button',
      initialValue: false,
    },
    {
      name: 'controls',
      type: 'boolean',
      title: 'Controls',
      initialValue: true,
      validation: (Rule: ValidationRule) =>
        Rule.custom((value: boolean, context: ValidationContext) => {
          const { parent } = context
          if (!value && !parent.autoPlay && !parent.playButton) {
            return 'Hiding controls is only allowed if Play Button or Auto Play is enabled'
          }
          return true
        }),
      hidden: ({ parent }: ValidationContext) => {
        return parent?.playButton
      },
    },
    {
      name: 'autoPlay',
      type: 'boolean',
      title: 'Auto Play',
      initialValue: false,
      validation: (Rule: ValidationRule) =>
        Rule.custom((value: boolean, context: ValidationContext) => {
          const { parent } = context
          if (value && !parent.muted) {
            return 'Auto play is only allowed if video is Muted'
          } else if (value && !parent.loop && !parent.controls) {
            return 'Auto play is only allowed if Controls or Loop is enabled'
          }
          return true
        }),
      hidden: ({ parent }: ValidationContext) => {
        return parent?.playButton
      },
    },
    {
      name: 'muted',
      type: 'boolean',
      title: 'Muted',
      initialValue: false,
    },
    {
      name: 'loop',
      type: 'boolean',
      title: 'Loop',
      initialValue: false,
    },
    {
      name: 'allowFullScreen',
      type: 'boolean',
      title: 'Allow Full Screen',
      initialValue: false,
    },
  ],
}
