import React, { useState, useRef } from 'react'
import { Checkbox, Icon, Typography, Button } from '@equinor/eds-core-react'
import styled from 'styled-components'
import { checkbox } from '@equinor/eds-icons'
import { useForm } from 'react-hook-form'
Icon.add({ checkbox })
const Wrapper = styled.div`
  display: grid;
  grid-template-rows: min-width;
  padding: 32px;
  padding-bottom: 8rem;
  grid-gap: 2rem;
  position: relative;
  transition: all 0.36s;
`

const BlockCheckbox = styled(Checkbox)`
  display: flex;
`

const UnstyledList = styled.ul`
  margin: 0;
  padding: 0;
  list-style-type: none;
`

export default {
  title: 'Components|Selection controls/Checkbox',
  component: Checkbox,
}

export const CheckboxControl = () => {
  // Use this to set the input to indeterminate = true as this must be done via JavaScript
  // (cannot use an HTML attribute for this)
  const indeterminateRef = useRef()
  // State for controlled example
  const [checked, updateChecked] = useState(false)

  return (
    <Wrapper>
      <div>
        <Typography variant="h2" style={{ margin: '1rem 0' }}>
          Single checkbox examples
        </Typography>
        <div>
          <Checkbox label="Check me" />
        </div>
        <div>
          <Checkbox label="You can't check me!" disabled />
        </div>
        <div>
          <Checkbox label="I'm preselected" defaultChecked />
        </div>
        <div>
          <Checkbox label="You can't uncheck me!" disabled defaultChecked />
        </div>
        <div>
          <Checkbox
            label="I'm in indeterminate state"
            indeterminate
            ref={indeterminateRef}
          />
        </div>
        <div>
          <Checkbox
            label="I'm a controlled component"
            onChange={(e) => {
              updateChecked(e.target.checked)
            }}
            checked={checked}
          />
        </div>
      </div>
    </Wrapper>
  )
}

export const CheckboxGroupControl = () => {
  return (
    <Wrapper>
      <Typography variant="h2" style={{ margin: '1rem 0' }}>
        Multiple checkboxes in a group
      </Typography>
      <fieldset>
        <legend>We are in this together! 🙌</legend>
        <Checkbox label="Check me first" name="multiple" value="first" />
        <Checkbox label="Check me second" name="multiple" value="second" />
        <Checkbox label="Check me third" name="multiple" value="third" />
      </fieldset>
    </Wrapper>
  )
}

export const WithFormsControl = () => {
  // Example with external forms library, react-hook-form
  const { register, handleSubmit, watch, errors } = useForm()
  const [isSubmitted, updateIsSubmitted] = useState(false)
  const [formData, updateFormData] = useState(null)

  const onSubmit = (data) => {
    updateFormData(JSON.stringify(data))
    updateIsSubmitted(true)
  }
  console.log(watch('example'))
  return (
    <Wrapper>
      <div>
        <Typography variant="h2" style={{ margin: '1rem 0' }}>
          Example with React Hook Form
        </Typography>
        <form onSubmit={handleSubmit(onSubmit)}>
          {isSubmitted ? (
            <>
              <span>Submitted data:</span>
              <p>{formData}</p>
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
                <legend>What's your favourites?</legend>
                <BlockCheckbox
                  name="favourites"
                  value="pineapple"
                  ref={register}
                  label="Pineapple"
                />
                <BlockCheckbox
                  name="favourites"
                  value="strawberry"
                  ref={register}
                  label="Strawberries"
                />
                <BlockCheckbox
                  name="favourites"
                  value="honeyMelon"
                  ref={register}
                  label="Honey melon"
                />
                <BlockCheckbox
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
                aria-required={true}
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
                <Button type="submit">I'm done</Button>
              </div>
            </div>
          )}
        </form>
      </div>
    </Wrapper>
  )
}

CheckboxControl.story = {
  name: 'Single',
}
CheckboxGroupControl.story = {
  name: 'Multiple',
}
WithFormsControl.story = {
  name: 'With React Hooks Forms',
}
