import { forwardRef } from 'react'
import styled, { css } from 'styled-components'
import { Divider } from '../Divider'
import { typographyTemplate, spacingsTemplate } from '../../utils'

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
    return (
      <>
        <StyledTitle id="eds-dialog-title" ref={ref} {...rest}>
          {children}
        </StyledTitle>
        {children && <StyledDivider color="medium" variant="small" />}
      </>
    )
  },
)
