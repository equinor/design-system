import { useState, ChangeEvent, ReactNode } from 'react'
import { action } from 'storybook/actions'
import { useForm } from 'react-hook-form'
import { StoryFn, Meta } from '@storybook/react-vite'
import { data } from '../../../stories/data'
import { Stack } from './../../../../.storybook/components'
import { Button, Table } from '../../..'
import { Checkbox } from './Checkbox'
import type { CheckboxProps } from './Checkbox.types'

const meta: Meta<typeof Checkbox> = {
  title: 'EDS 2.0 (beta)/Inputs/Selection Controls/Checkbox',
  component: Checkbox,
  parameters: {
    docs: {
      description: {
        component:
          'Checkbox component using vanilla CSS and EDS tokens. Uses Field internally for layout and accessibility.',
      },
      source: {
        excludeDecorators: true,
      },
    },
  },
  decorators: [
    (Story) => (
      <Stack>
        <Story />
      </Stack>
    ),
  ],
}

export default meta

const Wrapper = ({
  children,
  gap = 16,
  ...rest
}: {
  children: ReactNode
  gap?: number
} & React.HTMLAttributes<HTMLDivElement>) => (
  <div
    style={{
      display: 'flex',
      flexDirection: 'column',
      gap: `${gap}px`,
      alignItems: 'flex-start',
    }}
    {...rest}
  >
    {children}
  </div>
)

const AllVariants = () => (
  <>
    <Checkbox label="Unchecked" />
    <Checkbox label="Checked" defaultChecked />
    <Checkbox label="Indeterminate" indeterminate />
    <Checkbox label="Disabled" disabled />
    <Checkbox label="Disabled checked" disabled defaultChecked />
  </>
)

export const Introduction: StoryFn<CheckboxProps> = (args) => {
  return <Checkbox label="Label" {...args} />
}

export const Spacious: StoryFn<CheckboxProps> = () => (
  <Wrapper data-density="spacious">
    <AllVariants />
  </Wrapper>
)
Spacious.storyName = 'Spacious'

export const Comfortable: StoryFn<CheckboxProps> = () => (
  <Wrapper data-density="comfortable">
    <AllVariants />
  </Wrapper>
)
Comfortable.storyName = 'Comfortable'

export const ColorSchemes: StoryFn<CheckboxProps> = () => (
  <div style={{ display: 'flex', gap: '32px' }}>
    <div
      data-color-scheme="light"
      style={{ padding: '24px', background: 'var(--eds-color-bg-canvas)' }}
    >
      <Wrapper>
        <h3 style={{ margin: 0 }}>Light Mode</h3>
        <Checkbox label="Unchecked" />
        <Checkbox label="Checked" defaultChecked />
        <Checkbox label="Indeterminate" indeterminate />
        <Checkbox label="Disabled" disabled />
        <Checkbox label="Disabled checked" disabled defaultChecked />
      </Wrapper>
    </div>
    <div
      data-color-scheme="dark"
      style={{ padding: '24px', background: 'var(--eds-color-bg-canvas)' }}
    >
      <Wrapper>
        <h3 style={{ margin: 0, color: 'var(--eds-color-text-strong)' }}>
          Dark Mode
        </h3>
        <Checkbox label="Unchecked" />
        <Checkbox label="Checked" defaultChecked />
        <Checkbox label="Indeterminate" indeterminate />
        <Checkbox label="Disabled" disabled />
        <Checkbox label="Disabled checked" disabled defaultChecked />
      </Wrapper>
    </div>
  </div>
)
ColorSchemes.storyName = 'Light & Dark Mode'

export const GroupedCheckbox: StoryFn<CheckboxProps> = () => (
  <fieldset>
    <legend>Select your options</legend>
    <Wrapper gap={8}>
      <Checkbox label="Option 1" name="group" value="1" />
      <Checkbox label="Option 2" name="group" value="2" />
      <Checkbox label="Option 3" name="group" value="3" />
    </Wrapper>
  </fieldset>
)
GroupedCheckbox.storyName = 'Grouped'

export const WithoutVisibleLabel: StoryFn<CheckboxProps> = () => (
  <div style={{ display: 'flex', gap: '32px', alignItems: 'flex-start' }}>
    <div data-density="spacious">
      <p style={{ margin: '0 0 8px' }}>Spacious</p>
      <Checkbox aria-label="Spacious checkbox" />
    </div>
    <div data-density="comfortable">
      <p style={{ margin: '0 0 8px' }}>Comfortable</p>
      <Checkbox aria-label="Comfortable checkbox" />
    </div>
  </div>
)
WithoutVisibleLabel.storyName = 'Without Visible Label'
WithoutVisibleLabel.parameters = {
  docs: {
    description: {
      story:
        'When no visible label is needed, use `aria-label` to provide an accessible name for screen readers. This is common in tables or compact UIs.',
    },
  },
}

export const Controlled: StoryFn<CheckboxProps> = () => {
  const [checked, setChecked] = useState(false)
  return (
    <Checkbox
      label={checked ? 'Checked' : 'Unchecked'}
      checked={checked}
      onChange={(e: ChangeEvent<HTMLInputElement>) =>
        setChecked(e.target.checked)
      }
    />
  )
}

export const TableCheckbox: StoryFn<CheckboxProps> = () => (
  <Table>
    <Table.Head>
      <Table.Row>
        <Table.Cell>Selected</Table.Cell>
        <Table.Cell>Description</Table.Cell>
      </Table.Row>
    </Table.Head>
    <Table.Body>
      {data.slice(0, 4).map((row) => (
        <Table.Row key={row.number}>
          <Table.Cell>
            <div style={{ display: 'flex', justifyContent: 'center' }}>
              <Checkbox aria-label={`Select ${row.description}`} />
            </div>
          </Table.Cell>
          <Table.Cell>{row.description}</Table.Cell>
        </Table.Row>
      ))}
    </Table.Body>
  </Table>
)
TableCheckbox.storyName = 'In Table'

type FormData = {
  favourites: string[]
  agree: string
}

export const WithReactHookForm: StoryFn<CheckboxProps> = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>()
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [formData, setFormData] = useState<FormData | null>(null)

  const onSubmit = (data: FormData) => {
    setFormData(data)
    setIsSubmitted(true)
    action('onSubmit')(data)
  }

  if (isSubmitted) {
    return (
      <div>
        <p>Submitted: {JSON.stringify(formData)}</p>
        <Button
          variant="outlined"
          onClick={() => {
            setIsSubmitted(false)
            setFormData(null)
          }}
        >
          Reset
        </Button>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <fieldset>
        <legend>Pick your favourites</legend>
        <Wrapper gap={8}>
          <Checkbox
            label="Pineapple"
            value="pineapple"
            {...register('favourites')}
          />
          <Checkbox
            label="Strawberry"
            value="strawberry"
            {...register('favourites')}
          />
          <Checkbox label="Melon" value="melon" {...register('favourites')} />
        </Wrapper>
      </fieldset>
      <div style={{ marginTop: '16px' }}>
        <Checkbox
          label="I agree to the terms"
          aria-invalid={errors.agree ? 'true' : 'false'}
          {...register('agree', { required: true })}
        />
      </div>
      <div style={{ marginTop: '16px' }}>
        <Button type="submit">Submit</Button>
      </div>
    </form>
  )
}
WithReactHookForm.storyName = 'With React Hook Form'
