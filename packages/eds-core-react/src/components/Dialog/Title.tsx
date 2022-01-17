import { forwardRef } from 'react'
import styled, { css } from 'styled-components'
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

export type DialogTitleProps = React.HTMLAttributes<HTMLDivElement>

export const Title = forwardRef<HTMLDivElement, DialogTitleProps>(
  function Title({ children, ...rest }, ref) {
    return (
      <>
        <StyledTitle id="eds-dialog-title" ref={ref} {...rest}>
          {children}
        </StyledTitle>
      </>
    )
  },
)
