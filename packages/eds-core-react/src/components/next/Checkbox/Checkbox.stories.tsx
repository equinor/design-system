import { useState } from 'react'
import type { ChangeEvent, ReactNode } from 'react'
import { action } from 'storybook/actions'
import { useForm } from 'react-hook-form'
import { StoryFn, Meta } from '@storybook/react-vite'
import { Button, Table } from '../../..'
import { data } from '../../../stories/data'
import { ExampleLabel, Stack } from './../../../../.storybook/components'
import { Checkbox } from './Checkbox'
import type { CheckboxProps } from './Checkbox.types'

const meta: Meta<typeof Checkbox> = {
  title: 'EDS 2.0 (beta)/Inputs/Selection Controls/Checkbox',
  component: Checkbox,
  tags: ['beta'],
  args: {
    label: 'Label',
    disabled: false,
    indeterminate: false,
  },
  parameters: {
    docs: {
      source: {
        excludeDecorators: true,
      },
    },
  },
  argTypes: {
    // Core
    label: {
      control: 'text',
      description: 'Label text displayed next to the checkbox',
      table: {
        category: 'Core',
      },
    },

    // States
    disabled: {
      control: 'boolean',
      description: 'Disables checkbox interaction',
      table: {
        category: 'States',
        defaultValue: { summary: 'false' },
      },
    },
    indeterminate: {
      control: 'boolean',
      description:
        'Shows the indeterminate state, for a parent checkbox whose children are only partly checked.',
      table: {
        category: 'States',
        defaultValue: { summary: 'false' },
      },
    },
    checked: {
      control: 'boolean',
      description: 'Controlled checked state',
      table: {
        category: 'States',
      },
    },
    defaultChecked: {
      control: 'boolean',
      description: 'Initial checked state for uncontrolled usage',
      table: {
        category: 'States',
      },
    },

    // Styling
    className: {
      control: 'text',
      description:
        'Additional CSS class names applied to the outer wrapper element, not the hidden input',
      table: {
        category: 'Styling',
      },
    },
    style: {
      control: 'object',
      description:
        'Inline styles applied to the outer wrapper element, not the hidden input',
      table: {
        category: 'Styling',
      },
    },

    // HTML attributes
    id: {
      control: 'text',
      description: 'HTML id attribute',
      table: {
        category: 'HTML Attributes',
      },
    },
    name: {
      control: 'text',
      description: 'HTML name attribute for form submission',
      table: {
        category: 'HTML Attributes',
      },
    },
    value: {
      control: 'text',
      description: 'HTML value attribute for form submission',
      table: {
        category: 'HTML Attributes',
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
  return <Checkbox {...args} />
}

export const Overview: StoryFn<CheckboxProps> = () => (
  <Wrapper gap={8}>
    <Checkbox label="Unchecked" />
    <Checkbox label="Checked" defaultChecked />
    <Checkbox label="Indeterminate" indeterminate />
  </Wrapper>
)

export const States: StoryFn<CheckboxProps> = () => (
  <Wrapper>
    <AllVariants />
  </Wrapper>
)

States.parameters = {
  docs: {
    description: {
      story:
        'A checkbox is unchecked, checked or indeterminate, and can be disabled in any of those states.',
    },
  },
}

export const Density: StoryFn<CheckboxProps> = () => (
  <div style={{ display: 'flex', gap: '48px', alignItems: 'flex-start' }}>
    {(['compact', 'comfortable', 'relaxed'] as const).map((density) => (
      <div key={density} data-density={density}>
        <ExampleLabel>
          {density.charAt(0).toUpperCase() + density.slice(1)}
        </ExampleLabel>
        <Wrapper gap={8}>
          <Checkbox label="Email" defaultChecked />
          <Checkbox label="SMS" />
          <Checkbox label="Push" />
          <Checkbox label="In-app" />
        </Wrapper>
      </div>
    ))}
  </div>
)

Density.parameters = {
  docs: {
    description: {
      story:
        'Set `data-density` on a parent element to change the size. The default is comfortable.',
    },
  },
}

export const LightAndDarkMode: StoryFn<CheckboxProps> = () => (
  <div style={{ display: 'flex', gap: '32px' }}>
    <div
      data-color-scheme="light"
      style={{ padding: '24px', background: 'var(--eds-background-surface)' }}
    >
      <Wrapper>
        <ExampleLabel>Light Mode</ExampleLabel>
        <Checkbox label="Unchecked" />
        <Checkbox label="Checked" defaultChecked />
        <Checkbox label="Indeterminate" indeterminate />
        <Checkbox label="Disabled" disabled />
        <Checkbox label="Disabled checked" disabled defaultChecked />
      </Wrapper>
    </div>
    <div
      data-color-scheme="dark"
      style={{ padding: '24px', background: 'var(--eds-background-surface)' }}
    >
      <Wrapper>
        <ExampleLabel style={{ color: 'var(--eds-text-primary)' }}>
          Dark Mode
        </ExampleLabel>
        <Checkbox label="Unchecked" />
        <Checkbox label="Checked" defaultChecked />
        <Checkbox label="Indeterminate" indeterminate />
        <Checkbox label="Disabled" disabled />
        <Checkbox label="Disabled checked" disabled defaultChecked />
      </Wrapper>
    </div>
  </div>
)

LightAndDarkMode.parameters = {
  docs: {
    description: {
      story:
        'Checkbox follows the colour scheme set with `data-color-scheme` on a parent element.',
    },
  },
}

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

GroupedCheckbox.parameters = {
  docs: {
    description: {
      story:
        'Wrap related checkboxes in a `fieldset` with a `legend` that names the group.',
    },
  },
}

export const Subgroup: StoryFn<CheckboxProps> = () => {
  const options = ['Email', 'SMS', 'Push']
  const [selected, setSelected] = useState<string[]>(['SMS'])
  const allChecked = selected.length === options.length
  const someChecked = selected.length > 0 && !allChecked

  const toggle = (option: string) =>
    setSelected((previous) =>
      previous.includes(option)
        ? previous.filter((o) => o !== option)
        : [...previous, option],
    )

  return (
    <Wrapper gap={8}>
      <Checkbox
        label="All notifications"
        checked={allChecked}
        indeterminate={someChecked}
        onChange={() => setSelected(allChecked ? [] : options)}
      />
      <div
        role="group"
        aria-label="Notification options"
        style={{ paddingLeft: '24px' }}
      >
        <Wrapper gap={8}>
          {options.map((option) => (
            <Checkbox
              key={option}
              label={option}
              checked={selected.includes(option)}
              onChange={() => toggle(option)}
            />
          ))}
        </Wrapper>
      </div>
    </Wrapper>
  )
}

Subgroup.parameters = {
  docs: {
    description: {
      story:
        'A parent checkbox can stand for a group of child checkboxes. It shows the indeterminate state when only some of the children are checked. Pressing it selects all of them, or clears them when all are already selected.',
    },
  },
}

export const InheritedDisabled: StoryFn<CheckboxProps> = () => (
  <fieldset disabled>
    <legend>Disabled fieldset</legend>
    <Wrapper gap={8}>
      <Checkbox label="Unchecked" name="inherited" value="1" />
      <Checkbox label="Checked" name="inherited" value="2" defaultChecked />
      <Checkbox
        label="Indeterminate"
        name="inherited"
        value="3"
        indeterminate
      />
    </Wrapper>
  </fieldset>
)
InheritedDisabled.parameters = {
  docs: {
    description: {
      story:
        'Checkboxes inside a `<fieldset disabled>` are disabled by the browser without a `disabled` prop. The disabled styling is keyed off the input’s `:disabled` state, so it covers this inherited disabling too.',
    },
  },
}

export const WithoutVisibleLabel: StoryFn<CheckboxProps> = () => (
  <Checkbox aria-label="Accept terms" />
)

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

Controlled.parameters = {
  docs: {
    description: {
      story: 'Pass `checked` and `onChange` to control the state yourself.',
    },
  },
}

export const InTable: StoryFn<CheckboxProps> = () => (
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

InTable.parameters = {
  docs: {
    description: {
      story:
        'In a table, give each checkbox an `aria-label` that names its row.',
    },
  },
}

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

WithReactHookForm.parameters = {
  docs: {
    description: {
      story:
        'Checkboxes work with the `register` function from React Hook Form, as the form below shows.',
    },
  },
}
