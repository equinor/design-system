import { useState, useRef, ChangeEvent } from 'react'
import { Checkbox, Typography, Button, CheckboxProps } from '../..'
import styled from 'styled-components'
import { action } from '@storybook/addon-actions'
import { useForm } from 'react-hook-form'
import { Meta, Story } from '@storybook/react'

const Wrapper = styled(Checkbox)`
  display: flex;
`

export default {
  title: 'Components/Checkbox',
  component: Checkbox,
  parameters: {
    docs: {
      description: {
        component: `Selection controls allow users to select options, make
        decisions and set preferences.
        `,
      },
    },
  },
} as Meta

export const Default: Story<CheckboxProps> = (args) => (
  <Checkbox label="Play with me" {...args} />
)

export const SingleCheckbox: Story<CheckboxProps> = () => {
  // Use this to set the input to indeterminate = true as this must be done via JavaScript
  // (cannot use an HTML attribute for this)
  const indeterminateRef = useRef()
  // State for controlled example
  const [checked, updateChecked] = useState(false)
  const UnstyledList = styled.ul`
    margin: 0;
    padding: 0;
    list-style-type: none;
  `

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

export const GroupedCheckbox: Story<CheckboxProps> = () => {
  const UnstyledList = styled.ul`
    margin: 0;
    padding: 0;
    list-style-type: none;
  `
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

type FormData = {
  favourites: string[]
  agree: string
}

export const WithFormsControl: Story<CheckboxProps> = () => {
  // Example with external forms library, react-hook-form
  // eslint-disable-next-line @typescript-eslint/unbound-method
  const { register, handleSubmit, watch, errors } = useForm<FormData>()
  const [isSubmitted, updateIsSubmitted] = useState(false)
  const [formData, updateFormData] = useState<FormData>(null)

  const onSubmit = (data: FormData) => {
    updateFormData(data)
    updateIsSubmitted(true)
    action('onSubmit')(data)
  }
  console.log(watch('example'))
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
            <fieldset>
              <legend>What‘s your favourites?</legend>
              {/* Just to demonstrate style addons, a list would have been better for semantic */}
              <Wrapper
                name="favourites"
                value="pineapple"
                ref={register}
                label="Pineapple"
              />
              <Wrapper
                name="favourites"
                value="strawberry"
                ref={register}
                label="Strawberries"
              />
              <Wrapper
                name="favourites"
                value="honeyMelon"
                ref={register}
                label="Honey melon"
              />
              <Wrapper
                name="favourites"
                value="apples"
                ref={register}
                label="Apples"
              />
            </fieldset>
            <Checkbox
              name="agree"
              ref={register({ required: true })}
              label="I understand that these preferences will not be saved*"
              id="agree"
              aria-invalid={errors.agree ? 'true' : 'false'}
              aria-describedby="error-name-required"
              aria-required
            />
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
              <Button type="submit">I‘m done</Button>
            </div>
          </div>
        )}
      </form>
    </div>
  )
}

GroupedCheckbox.storyName = 'Multiple checkboxes in a group'
WithFormsControl.storyName = 'Example with React Hook Form'
