/* eslint-disable no-undef */
import { render, cleanup, screen } from '@testing-library/react'
import '@testing-library/jest-dom'
import 'jest-styled-components'
import styled from 'styled-components'
import { dialog as tokens } from './Dialog.tokens'
import { Dialog } from '.'

const { Actions, Title, CustomContent } = Dialog

const { width, minHeight } = tokens

const StyledDialog = styled(Dialog)`
  background: red;
  min-height: ${minHeight};
  width: ${width};
`

afterEach(cleanup)

describe('Dialog', () => {
  it('Matches snapshot', () => {
    const { asFragment } = render(
      <Dialog open={true}>
        <Title>Title</Title>
        <CustomContent>Description</CustomContent>
        <Actions>
          <button type="button">OK</button>
        </Actions>
      </Dialog>,
    )
    expect(asFragment()).toMatchSnapshot()
  })
  it('Has all provided content', () => {
    const testIdTitle = 'dialog-test-title'
    const testIdCenter = 'dialog-test-center'
    const testIdActions = 'dialog-test-actions'

    render(
      <Dialog open={true}>
        <Title>
          <div data-testid={testIdTitle}>Title</div>
        </Title>
        <CustomContent>
          <div data-testid={testIdCenter}>Description</div>
        </CustomContent>
        <Actions>
          <button type="button" data-testid={testIdActions}>
            OK
          </button>
        </Actions>
      </Dialog>,
    )
    expect(screen.queryByTestId(testIdTitle)).toBeDefined()
    expect(screen.queryByTestId(testIdCenter)).toBeDefined()
    expect(screen.queryByTestId(testIdActions)).toBeDefined()
  })
  it('Has scrollable content when scrollable props is present', () => {
    const testIdCenter = 'dialog-test-center'

    render(
      <Dialog open={true}>
        <Title>
          <div>Title</div>
        </Title>
        <CustomContent data-testid={testIdCenter} scrollable>
          <div>Description</div>
        </CustomContent>
        <Actions>
          <button type="button">OK</button>
        </Actions>
      </Dialog>,
    )
    expect(screen.queryByTestId(testIdCenter)).toHaveStyleRule(
      'overflow-y',
      'auto',
    )
  })

  it('Can extend the css for the component', () => {
    render(<StyledDialog open={true} data-testid="dialog" />)
    const dialog = screen.getByTestId('dialog')
    expect(dialog).toHaveStyleRule('background', 'red')
    expect(dialog).toHaveStyleRule('width', width)
    expect(dialog).toHaveStyleRule('min-height', minHeight)
  })
})
