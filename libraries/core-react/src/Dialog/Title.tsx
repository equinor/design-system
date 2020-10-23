import React, { forwardRef, Fragment, FunctionComponent } from 'react'
import styled, { css } from 'styled-components'
import { Divider } from '../Divider'
import { typographyTemplate } from '../_common/templates'
import { dialog as tokens } from './Dialog.tokens'

const { title, spacingsMedium } = tokens

const StyledTitle = styled.div`
  ${typographyTemplate(title)}
  min-height: 24px;
  align-self: end;
  justify-self: start;
  padding: 0 ${spacingsMedium};

  ${({ children }) =>
    !children &&
    css`
      min-height: initial;
      height: 8px;
    `}
`

const StyledDivider = styled(Divider)`
  width: 100%;
  margin-bottom: ${spacingsMedium};
`

type Props = React.HTMLAttributes<HTMLDivElement>

export const Title: FunctionComponent<Props> = forwardRef<
  HTMLDivElement,
  Props
>(function EdsDialogTitle({ children, className = '', ...props }, ref) {
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
})

// Title.displayName = 'EdsDialogTitle'
