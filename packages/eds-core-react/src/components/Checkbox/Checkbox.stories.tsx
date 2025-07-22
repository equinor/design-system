import { useState, useEffect, useRef, ChangeEvent } from 'react'
import {
  Checkbox,
  Typography,
  Button,
  CheckboxProps,
  EdsProvider,
  Table,
  Density,
} from '../..'
import styled from 'styled-components'
import { action } from 'storybook/actions'
import { useForm } from 'react-hook-form'
import { StoryFn, Meta } from '@storybook/react-vite'
import { data } from '../../stories/data'
import { Stack } from './../../../.storybook/components'
import page from './Checkbox.docs.mdx'

const meta: Meta<typeof Checkbox> = {
  title: 'Inputs/Selection Controls/Checkbox',
  component: Checkbox,
  parameters: {
    docs: {
      page,
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

const UnstyledList = styled.ul`
  margin: 0;
  padding: 0;
  list-style-type: none;
`
const Wrapper = styled(Checkbox)`
  display: flex;
`

export const Introduction: StoryFn<CheckboxProps> = (args) => {
  return <Checkbox label="Play with me" {...args} />
}

export const SingleCheckbox: StoryFn<CheckboxProps> = () => {
  // Use this to set the input to indeterminate = true as this must be done via JavaScript
  // (cannot use an HTML attribute for this)
  const indeterminateRef = useRef()
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
            <fieldset>
              <legend>What‘s your favourites?</legend>
              {/* Just to demonstrate style addons, a list would have been better for semantic */}
              <Wrapper
                name="favourites"
                value="pineapple"
                label="Pineapple"
                {...register('favourites')}
              />
              <Wrapper
                name="favourites"
                value="strawberry"
                label="Strawberries"
                {...register('favourites')}
              />
              <Wrapper
                name="favourites"
                value="honeyMelon"
                label="Honey melon"
                {...register('favourites')}
              />
              <Wrapper
                name="favourites"
                value="apples"
                label="Apples"
                {...register('favourites')}
              />
            </fieldset>
            <Checkbox
              name="agree"
              label="I understand that these preferences will not be saved*"
              id="agree"
              aria-invalid={errors.agree ? 'true' : 'false'}
              aria-describedby="error-name-required"
              aria-required
              {...register('agree', { required: true })}
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
WithFormsControl.storyName = 'Example with React Hook Form'

export const Compact: StoryFn<CheckboxProps> = () => {
  const [density, setDensity] = useState<Density>('comfortable')

  useEffect(() => {
    // Simulate user change
    setDensity('compact')
  }, [density])

  return (
    <EdsProvider density={density}>
      <Checkbox label="I am compact" />
    </EdsProvider>
  )
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
