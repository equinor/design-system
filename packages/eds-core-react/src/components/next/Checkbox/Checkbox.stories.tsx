import { useState, useRef, ChangeEvent } from 'react'
import type { LabelHTMLAttributes } from 'react'
import { action } from 'storybook/actions'
import { useForm } from 'react-hook-form'
import { StoryFn, Meta } from '@storybook/react-vite'
import { data } from '../../../stories/data'
import { Stack } from './../../../../.storybook/components'
import { Typography, Button, Table } from '../../..'
import { Field } from '../Field'
import { ValidationMessage } from '../ValidationMessage'
import { Checkbox } from './Checkbox'
import type { CheckboxProps } from './Checkbox.types'

const meta: Meta<typeof Checkbox> = {
  title: 'EDS 2.0 (beta)/Inputs/Selection Controls/Checkbox',
  component: Checkbox,
  parameters: {
    docs: {
      description: {
        component:
          'New Checkbox component using vanilla CSS and EDS foundation tokens. Consumers control tone and density via `data-*` attributes on the wrapper element',
      },
      source: {
        excludeDecorators: true,
      },
    },
  },
  decorators: [
    (Story) => {
      return (
        <Stack>
          <Story />
        </Stack>
      )
    },
  ],
}

export default meta

const UnstyledList = ({ children, ...props }) => (
  <ul
    style={{
      margin: 0,
      padding: 0,
      listStyleType: 'none',
      display: 'flex',
      flexDirection: 'column',
      gap: '1rem',
    }}
    {...props}
  >
    {children}
  </ul>
)

const CheckboxWrapper = ({ children, ...props }) => (
  <div style={{ display: 'flex' }} {...props}>
    {children}
  </div>
)

const labelData = (
  attributes: Record<`data-${string}`, string | undefined>,
): LabelHTMLAttributes<HTMLLabelElement> => attributes

const appearances = [
  'accent',
  'neutral',
  'success',
  'info',
  'warning',
  'danger',
] as const

export const Introduction: StoryFn<CheckboxProps> = (args) => {
  const accentLabelProps = labelData({
    'data-color-appearance': 'accent',
    'data-density': 'spacious',
  })

  return (
    <Checkbox
      id="intro-checkbox"
      label="Play with me"
      labelProps={accentLabelProps}
      {...args}
    />
  )
}

export const SingleCheckbox: StoryFn<CheckboxProps> = () => {
  // Use this to set the input to indeterminate = true as this must be done via JavaScript
  // (cannot use an HTML attribute for this)
  const indeterminateRef = useRef<HTMLInputElement | null>(null)
  // State for controlled example
  const [checked, updateChecked] = useState(false)
  return (
    <UnstyledList>
      <li>
        <Checkbox label="Check me" />
      </li>
      <li>
        <Checkbox label="You can't check me!" disabled />
      </li>
      <li>
        <Checkbox label="I'm preselected" defaultChecked />
      </li>
      <li>
        <Checkbox label="You can't uncheck me!" disabled defaultChecked />
      </li>
      <li>
        <Checkbox
          label="I'm in indeterminate state"
          indeterminate
          ref={indeterminateRef}
        />
      </li>
      <li>
        <Checkbox
          label="I'm a controlled component"
          onChange={(e: ChangeEvent<HTMLInputElement>) => {
            updateChecked(e.target.checked)
          }}
          checked={checked}
        />
      </li>
    </UnstyledList>
  )
}
SingleCheckbox.storyName = 'Single checkbox'

export const GroupedCheckbox: StoryFn<CheckboxProps> = () => {
  return (
    <fieldset>
      <legend>
        We are in this together!
        <span role="img" aria-label="raising hands emoji">
          🙌
        </span>
      </legend>
      <UnstyledList>
        <li>
          <Checkbox label="Check me first" name="multiple" value="first" />
        </li>
        <li>
          <Checkbox label="Check me second" name="multiple" value="second" />
        </li>
        <li>
          <Checkbox label="Check me third" name="multiple" value="third" />
        </li>
      </UnstyledList>
    </fieldset>
  )
}
GroupedCheckbox.storyName = 'Grouped checkboxes'

type FormData = {
  favourites: string[]
  agree: string
}

export const WithFormsControl: StoryFn<CheckboxProps> = () => {
  // Example with external forms library, react-hook-form
  // eslint-disable-next-line @typescript-eslint/unbound-method
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>()
  const [isSubmitted, updateIsSubmitted] = useState(false)
  const [formData, updateFormData] = useState<FormData>(null)

  const onSubmit = (data: FormData) => {
    updateFormData(data)
    updateIsSubmitted(true)
    action('onSubmit')(data)
  }

  return (
    <div>
      <Typography variant="body_short" style={{ marginBottom: '1rem' }}>
        Real life example with an external{' '}
        <a
          href="https://react-hook-form.com/"
          rel="noreferrer noopener"
          target="blank"
        >
          form library
        </a>
      </Typography>
      <form onSubmit={handleSubmit(onSubmit)}>
        {isSubmitted ? (
          <>
            <span>Submitted data:</span>
            <p>{JSON.stringify(formData)}</p>
            <Button
              variant="outlined"
              onClick={() => {
                updateIsSubmitted(false)
                updateFormData(null)
              }}
            >
              Reset
            </Button>
          </>
        ) : (
          <div>
            <fieldset
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '1rem',
              }}
            >
              <legend>What&apos;s your favourites?</legend>
              <CheckboxWrapper>
                <Checkbox
                  name="favourites"
                  value="pineapple"
                  label="Pineapple"
                  {...register('favourites')}
                />
              </CheckboxWrapper>
              <CheckboxWrapper>
                <Checkbox
                  name="favourites"
                  value="strawberry"
                  label="Strawberries"
                  {...register('favourites')}
                />
              </CheckboxWrapper>
              <CheckboxWrapper>
                <Checkbox
                  name="favourites"
                  value="honeyMelon"
                  label="Honey melon"
                  {...register('favourites')}
                />
              </CheckboxWrapper>
              <CheckboxWrapper>
                <Checkbox
                  name="favourites"
                  value="apples"
                  label="Apples"
                  {...register('favourites')}
                />
              </CheckboxWrapper>
            </fieldset>
            <div style={{ marginTop: '1rem' }}>
              <Checkbox
                name="agree"
                label="I understand that these preferences will not be saved*"
                id="agree"
                aria-invalid={errors.agree ? 'true' : 'false'}
                aria-describedby="error-name-required"
                aria-required
                {...register('agree', { required: true })}
              />
            </div>
            <span
              role="alert"
              id="error-name-required"
              style={{
                color: 'red',
                paddingLeft: '3rem',
                fontSize: '0.75rem',
                display:
                  errors.agree && errors.agree.type === 'required'
                    ? 'block'
                    : 'none',
              }}
            >
              Hey you! This field is required
            </span>
            <div style={{ padding: '1rem' }}>
              <Button type="submit">I&apos;m done</Button>
            </div>
          </div>
        )}
      </form>
    </div>
  )
}
WithFormsControl.storyName = 'Example with React Hook Form'

export const Compact: StoryFn<CheckboxProps> = () => {
  return (
    <UnstyledList>
      <li>
        <Checkbox
          label="I am compact"
          labelProps={labelData({ 'data-density': 'comfortable' })}
        />
      </li>
      <li>
        <Checkbox
          label="I am also compact"
          defaultChecked
          labelProps={labelData({ 'data-density': 'comfortable' })}
        />
      </li>
      <li>
        <Checkbox
          label="I am compact and disabled"
          disabled
          labelProps={labelData({ 'data-density': 'comfortable' })}
        />
      </li>
    </UnstyledList>
  )
}
Compact.parameters = {
  docs: {
    description: {
      story:
        'Set `data-density="comfortable"` on the wrapper (`labelProps`) to switch to the compact touch area.',
    },
  },
}

export const Appearances: StoryFn = () => (
  <UnstyledList>
    {appearances.map((appearance) => (
      <li key={appearance}>
        <Checkbox
          label={`Appearance: ${appearance}`}
          labelProps={labelData({ 'data-color-appearance': appearance })}
        />
      </li>
    ))}
  </UnstyledList>
)
Appearances.parameters = {
  docs: {
    description: {
      story:
        'Apply different tones by setting `data-color-appearance` on the wrapper element via `labelProps`.',
    },
  },
}

export const AlternativeToLabel: StoryFn<CheckboxProps> = () => (
  <Checkbox aria-label="This label is invisible, but read by screen-readers" />
)
AlternativeToLabel.storyName = 'Alternative to label'

export const TableCheckbox: StoryFn<CheckboxProps> = () => (
  <Table>
    <Table.Head>
      <Table.Row>
        <Table.Cell>Selected</Table.Cell>
      </Table.Row>
    </Table.Head>
    <Table.Body>
      {data.map((data) => (
        <Table.Row key={data.number}>
          <Table.Cell>
            <Checkbox aria-label={`Select ${data.description}`} />
          </Table.Cell>
        </Table.Row>
      ))}
    </Table.Body>
  </Table>
)
TableCheckbox.storyName = 'Table checkbox'

export const DarkMode: StoryFn<CheckboxProps> = () => {
  return (
    <div
      data-color-scheme="dark"
      style={{ padding: '2rem', background: '#0b0b0b' }}
    >
      <UnstyledList>
        <li>
          <Checkbox label="Check me in dark mode" />
        </li>
        <li>
          <Checkbox label="I'm preselected" defaultChecked />
        </li>
        <li>
          <Checkbox label="I'm disabled" disabled />
        </li>
        <li>
          <Checkbox label="I'm disabled and checked" disabled defaultChecked />
        </li>
        <li>
          <Checkbox label="I'm indeterminate" indeterminate />
        </li>
      </UnstyledList>
    </div>
  )
}
DarkMode.storyName = 'Dark mode'

// export const ErrorState: StoryFn<CheckboxProps> = () => {
//   const [checked, setChecked] = useState(false)

//   return (
//     <div>
//       <Typography variant="body_short" style={{ marginBottom: '1rem' }}>
//         Check the box to see how the error state disappears when validated.
//       </Typography>
//       <Checkbox
//         label="I agree to the terms and conditions"
//         checked={checked}
//         onChange={(e: ChangeEvent<HTMLInputElement>) =>
//           setChecked(e.target.checked)
//         }
//         error={!checked}
//       />
//       <Typography
//         variant="caption"
//         style={{
//           marginTop: '0.5rem',
//           color: 'var(--eds-color-text-danger-strong)',
//         }}
//       >
//         {!checked && 'You must accept the terms and conditions'}
//       </Typography>
//     </div>
//   )
// }
// ErrorState.storyName = 'Error state'
// ErrorState.parameters = {
//   docs: {
//     description: {
//       story:
//         'Error state is shown by setting the `error` prop to true, which applies red styling to the checkbox. Error messages should be provided by a separate form field component. This is commonly used for required fields like accepting terms and conditions.',
//     },
//   },
// }

export const WithField: StoryFn<CheckboxProps> = () => {
  const [accepted, setAccepted] = useState(false)

  const onChange = (event: ChangeEvent<HTMLInputElement>) => {
    setAccepted(event.target.checked)
  }

  return (
    <Field required>
      <Field.Label>Bruksvilkår</Field.Label>
      <Checkbox
        label="Jeg bekrefter at jeg har lest og forstått vilkårene"
        checked={accepted}
        onChange={onChange}
        error={!accepted}
      />
      {!accepted && (
        <ValidationMessage>
          Du må godta bruksvilkårene før du kan gå videre
        </ValidationMessage>
      )}
    </Field>
  )
}
WithField.storyName = 'Field integration'
