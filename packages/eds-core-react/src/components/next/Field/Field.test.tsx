import { render, screen } from '@testing-library/react'
import { axe } from 'jest-axe'
import { Field } from './Field'
import { Input } from '../Input'
import { Label } from '../Label'
import { ValidationMessage } from '../ValidationMessage'

describe('Field', () => {
  describe('Accessibility', () => {
    it('Should pass a11y test', async () => {
      const { container } = render(
        <Field>
          <Label htmlFor="test-input" label="Label" />
          <Input id="test-input" placeholder="Placeholder" />
        </Field>,
      )
      expect(await axe(container)).toHaveNoViolations()
    })

    it('Should pass a11y test with description and validation message', async () => {
      const { container } = render(
        <Field>
          <Label htmlFor="test-input" label="Label" />
          <Field.Description id="desc-id">Help text</Field.Description>
          <Input
            id="test-input"
            aria-describedby="desc-id validation-id"
            placeholder="Placeholder"
          />
          <ValidationMessage id="validation-id">
            Validation text
          </ValidationMessage>
        </Field>,
      )
      expect(await axe(container)).toHaveNoViolations()
    })
  })

  describe('Rendering', () => {
    it('Renders children', () => {
      render(
        <Field>
          <Input data-testid="child-input" />
        </Field>,
      )
      expect(screen.getByTestId('child-input')).toBeInTheDocument()
    })

    it('Renders Label as child', () => {
      render(
        <Field>
          <Label htmlFor="username" label="Username" />
          <Input id="username" />
        </Field>,
      )
      expect(screen.getByText('Username')).toBeInTheDocument()
    })

    it('Renders Field.Description as child', () => {
      render(
        <Field>
          <Field.Description>Enter your username</Field.Description>
          <Input />
        </Field>,
      )
      expect(screen.getByText('Enter your username')).toBeInTheDocument()
    })

    it('Renders ValidationMessage as child', () => {
      render(
        <Field>
          <Input />
          <ValidationMessage>This field is required</ValidationMessage>
        </Field>,
      )
      expect(screen.getByText('This field is required')).toBeInTheDocument()
    })

    it('Renders all elements in correct order', () => {
      const { container } = render(
        <Field>
          <Label htmlFor="test" label="Label" />
          <Field.Description>Description</Field.Description>
          <Input id="test" data-testid="input" />
          <ValidationMessage>Validation</ValidationMessage>
        </Field>,
      )
      const wrapper = container.querySelector('.eds-field')
      const children = wrapper?.children
      expect(children?.[0]).toHaveTextContent('Label')
      expect(children?.[1]).toHaveTextContent('Description')
      expect(children?.[2]).toHaveClass('eds-input-container')
      expect(children?.[3]).toHaveTextContent('Validation')
    })
  })

  describe('Field.Description', () => {
    it('Applies id for aria-describedby', () => {
      render(
        <Field>
          <Field.Description id="help-text-id">Help text</Field.Description>
          <Input />
        </Field>,
      )
      expect(screen.getByText('Help text')).toHaveAttribute(
        'id',
        'help-text-id',
      )
    })

    it('Applies custom className', () => {
      render(
        <Field>
          <Field.Description className="custom-desc">
            Description
          </Field.Description>
        </Field>,
      )
      expect(screen.getByText('Description')).toHaveClass(
        'eds-field__description',
        'custom-desc',
      )
    })
  })

  describe('Styling and props', () => {
    it('Applies custom className', () => {
      render(
        <Field className="custom-class" data-testid="field">
          <Input />
        </Field>,
      )
      expect(screen.getByTestId('field')).toHaveClass(
        'eds-field',
        'custom-class',
      )
    })

    it('Forwards ref to wrapper div', () => {
      const ref = { current: null } as React.RefObject<HTMLDivElement>
      render(
        <Field ref={ref}>
          <Input />
        </Field>,
      )
      expect(ref.current).toBeInstanceOf(HTMLDivElement)
    })

    it('Spreads additional props to wrapper div', () => {
      render(
        <Field data-testid="field" aria-label="Field wrapper">
          <Input />
        </Field>,
      )
      expect(screen.getByTestId('field')).toHaveAttribute(
        'aria-label',
        'Field wrapper',
      )
    })
  })
})
