import React, { useState, useRef } from 'react'
import {
  Radio,
  Checkbox,
  Switch,
  Icon,
  Typography,
  Button,
} from '@equinor/eds-core-react'
import styled from 'styled-components'
import { checkbox } from '@equinor/eds-icons'
import { useForm } from 'react-hook-form'
Icon.add({ checkbox })
const Wrapper = styled.div`
  display: grid;
  grid-template-rows: min-width;
  padding: 32px;
  padding-bottom: 8rem;
  grid-gap: 1rem;
  position: relative;
  background-color: ${({ darkMode }) => (darkMode ? '#0A0310' : 'white')};
  color: ${({ darkMode }) => (darkMode ? 'white' : 'black')};
  transition: all 0.36s;
`

const BlockRadio = styled(Radio)`
  display: flex;
`
const BlockCheckbox = styled(Checkbox)`
  display: flex;
`

const UnstyledList = styled.ul`
  margin: 0;
  padding: 0;
  list-style-type: none;
`

const DarkModeTypography = styled(Typography)`
  margin: '1rem 0';
  ${({ darkMode }) =>
    darkMode && {
      color: 'white',
    }};
  transition: all 0.36s;
`

export default {
  title: 'Components|Selection controls',
  component: Radio,
}

export const RadioControl = () => {
  const [checked, updateChecked] = useState('one')
  const onChange = (event, value) => {
    console.log(event)
    updateChecked(value)
  }
  return (
    <Wrapper>
      <div>
        <Typography variant="h2" style={{ margin: '1rem 0' }}>
          Single radiobox examples
        </Typography>
        <div>
          <Radio label="Check me" name="first" />
        </div>
        <div>
          <Radio label="You can't check me!" disabled name="second" />
        </div>
        <div>
          <Radio label="I'm preselected" defaultChecked name="third" />
        </div>
        <div>
          <Radio
            label="You can't uncheck me!"
            disabled
            defaultChecked
            name="fourth"
          />
        </div>
      </div>
      <div>
        <Typography variant="h2" style={{ margin: '1rem 0' }}>
          Group example
        </Typography>
        <fieldset>
          <legend>We are in this together as controlled components! 🙌</legend>
          <BlockRadio
            label="I'm number one and preselected"
            name="group"
            value="one"
            checked={checked === 'one'}
            onChange={onChange}
          />

          <BlockRadio
            label="I'm number two"
            name="group"
            value="two"
            checked={checked === 'two'}
            onChange={onChange}
          />
          <BlockRadio
            label="I'm number three"
            name="group"
            value="three"
            checked={checked === 'three'}
            onChange={onChange}
          />
        </fieldset>
      </div>
    </Wrapper>
  )
}

export const CheckboxControl = () => {
  // Use this to set the input to indeterminate = true as this must be done via JavaScript
  // (cannot use an HTML attribute for this)
  const indeterminateRef = useRef()
  // State for controlled example
  const [checked, updateChecked] = useState(false)
  // Example with external forms library, react-hook-form
  const { register, handleSubmit, watch, errors } = useForm()
  const [isSubmitted, updateIsSubmitted] = useState(false)
  const [formData, updateFormData] = useState(null)

  const onSubmit = (data) => {
    console.log(data)
    updateFormData(JSON.stringify(data))
    updateIsSubmitted(true)
  }
  console.log(watch('example'))
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
      <div>
        <Typography variant="h2" style={{ margin: '1rem 0' }}>
          Example multiple checkboxes in a group
        </Typography>
        <fieldset>
          <legend>We are in this together! 🙌</legend>
          <Checkbox label="Check me first" name="multiple" value="first" />
          <Checkbox label="Check me second" name="multiple" value="second" />
          <Checkbox label="Check me third" name="multiple" value="third" />
        </fieldset>
      </div>
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
export const SwitchControl = () => {
  const [darkMode, setDarkMode] = useState(false)
  return (
    <Wrapper darkMode={darkMode}>
      <DarkModeTypography variant="h1" darkMode={darkMode}>
        Switch
      </DarkModeTypography>
      <div>
        <DarkModeTypography variant="h2" darkMode={darkMode}>
          Basic variants
        </DarkModeTypography>
        <UnstyledList>
          <li>
            <Switch label="I'm default off" />
          </li>
          <li>
            <Switch label="I'm default on" defaultChecked />
          </li>
          <li>
            <Switch disabled label="You can't turn me on!" />
          </li>
          <li>
            <Switch disabled defaultChecked label="You can't turn me off!" />
          </li>
        </UnstyledList>
        <UnstyledList>
          <li>
            <Switch label="I'm default off" size="small" />
          </li>
          <li>
            <Switch label="I'm default on" defaultChecked size="small" />
          </li>
          <li>
            <Switch disabled label="You can't turn me on!" size="small" />
          </li>
          <li>
            <Switch
              disabled
              defaultChecked
              label="You can't turn me off!"
              size="small"
            />
          </li>
        </UnstyledList>
      </div>
      <DarkModeTypography variant="h2" darkMode={darkMode}>
        Use case with controlled component
      </DarkModeTypography>
      <div>
        <Switch
          checked={darkMode}
          ariaLabelledby="label-darkMode"
          onChange={() => setDarkMode(!darkMode)}
          label="Dark mode"
        />
      </div>
    </Wrapper>
  )
}

RadioControl.story = {
  name: 'Radio',
}

CheckboxControl.story = {
  name: 'Checkbox',
}
SwitchControl.story = {
  name: 'Switch',
}
