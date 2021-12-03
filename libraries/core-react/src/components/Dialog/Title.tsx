import { forwardRef } from 'react'
import styled, { css, ThemeProvider } from 'styled-components'
import { Divider } from '../Divider'
import { typographyTemplate, spacingsTemplate } from '../../utils'
import { dialog as dialogToken } from './Dialog.tokens'
import { useEds } from '../EdsProvider'
import { useToken } from '../../hooks'

const StyledTitle = styled.div(({ theme, children }) => {
  return css`
    ${typographyTemplate(theme.entities.title.typography)}
    min-height: ${theme.entities.title.minHeight};
    align-self: end;
    justify-self: start;
    ${spacingsTemplate(theme.entities.children.spacings)};

    ${!children &&
    css`
      min-height: initial;
      height: '8px';
    `}
  `
})

const StyledDivider = styled(Divider)(({ theme }) => {
  return css`
    width: 100%;
    margin-bottom: ${theme.entities.divider.spacings.bottom};
  `
})

export type DialogTitleProps = React.HTMLAttributes<HTMLDivElement>

export const Title = forwardRef<HTMLDivElement, DialogTitleProps>(
  function Title({ children, ...rest }, ref) {
    const { density } = useEds()
    const token = useToken({ density }, dialogToken)
    return (
      <ThemeProvider theme={token}>
        <StyledTitle id="eds-dialog-title" ref={ref} {...rest}>
          {children}
        </StyledTitle>
        {children && <StyledDivider color="medium" variant="small" />}
      </ThemeProvider>
    )
  },
)
