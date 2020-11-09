import React, { forwardRef, Fragment, HTMLAttributes } from 'react'
import styled, { css } from 'styled-components'
import { Divider } from '../Divider'
import { typographyTemplate } from '../_common/templates'

import { dialog as tokens } from './Dialog.tokens'

const { description, spacingsMedium } = tokens

const StyledCustomContent = styled.div<CustomContentProps>`
  ${typographyTemplate(description)}
  min-height: 80px;
  margin-bottom: ${spacingsMedium};
  align-self: stretch;
  justify-self: stretch;
  padding: 0 ${spacingsMedium};

  ${({ scrollable }) =>
    scrollable &&
    css`
      min-height: initial;
      height: 104px;
      overflow-y: auto;
    `}
`

const StyledDivider = styled(Divider)`
  width: 100%;
  margin-top: 0;
  margin-bottom: ${spacingsMedium};
`

type CustomContentProps = {
  /** Control if the content should be scrollable */
  scrollable?: boolean
} & HTMLAttributes<HTMLDivElement>

export const CustomContent = forwardRef<HTMLDivElement, CustomContentProps>(
  function CustomContent(
    { children, className = '', scrollable = false, ...rest },
    ref,
  ) {
    return (
      <Fragment>
        <StyledCustomContent
          className={className}
          scrollable={scrollable}
          id="eds-dialog-customcontent"
          ref={ref}
          {...rest}
        >
          {children}
        </StyledCustomContent>

        {children && scrollable && (
          <StyledDivider color="medium" variant="small" />
        )}
      </Fragment>
    )
  },
)

// CustomContent.displayName = 'EdsDialogCustomcontent'
