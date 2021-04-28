import { forwardRef, Fragment } from 'react'
import styled, { css } from 'styled-components'
import { Divider } from '../Divider'
import { typographyTemplate, spacingsTemplate } from '../../utils'
import { dialog as tokens } from './Dialog.tokens'

const StyledTitle = styled.div`
  ${typographyTemplate(tokens.entities.title.typography)}
  min-height: ${tokens.entities.title.minHeight};
  align-self: end;
  justify-self: start;
  ${spacingsTemplate(tokens.entities.children.spacings)};

  ${({ children }) =>
    !children &&
    css`
      min-height: initial;
      height: '8px';
    `}
`

const StyledDivider = styled(Divider)`
  width: 100%;
  margin-bottom: ${tokens.entities.divider.spacings.bottom};
`

export type DialogTitleProps = React.HTMLAttributes<HTMLDivElement>

export const Title = forwardRef<HTMLDivElement, DialogTitleProps>(
  function Title({ children, className = '', ...props }, ref) {
    return (
      <Fragment>
        <StyledTitle
          className={className}
          id="eds-dialog-title"
          ref={ref}
          {...props}
        >
          {children}
        </StyledTitle>
        {children && <StyledDivider color="medium" variant="small" />}
      </Fragment>
    )
  },
)

// Title.displayName = 'EdsDialogTitle'
