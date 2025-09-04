import { ThHTMLAttributes, forwardRef } from 'react'
import styled, { css, ThemeProvider } from 'styled-components'
import {
  typographyTemplate,
  spacingsTemplate,
  bordersTemplate,
  useToken,
  isFirefox,
} from '@equinor/eds-utils'
import { token as tablehead, TableHeadToken } from './HeaderCell.tokens'
import { useEds } from '../../EdsProvider'

type BaseProps = {
  theme: TableHeadToken
  $sticky: boolean
  $density: 'comfortable' | 'compact'
} & Pick<React.AriaAttributes, 'aria-sort'>

const StyledTableCell = styled.th((props: BaseProps) => {
  const { theme, $sticky, $density } = props
  const { background, height, typography, spacings } = theme
  const activeToken = theme.states.active
  const ariaSort = props['aria-sort']
  let sortStylingHover = css({})
  let sortStylingActive = css({})

  if (ariaSort) {
    sortStylingHover = css`
      @media (hover: hover) and (pointer: fine) {
        &:hover {
          cursor: pointer;
          background: ${theme.states.hover.background};
        }
      }
    `
  }

  if (ariaSort && ariaSort !== 'none') {
    sortStylingActive = css`
      ${activeToken.border.type === 'bordergroup'
        ? css`
            border-color: ${activeToken.border.bottom.color};
          `
        : ''};
      background: ${activeToken.background};
      color: ${activeToken.typography.color};
    `
  }

  // Firefox specific workaround (bug in v142.0) - see issue #3910
  // Hardcoded padding values compensate for Firefox's incorrect table cell height calculation
  const firefoxFix =
    isFirefox() && props.$density === 'compact'
      ? css`
          vertical-align: top;
          height: auto;
          min-height: ${height};

          > div {
            /* 7px padding maintains visual consistency with other browsers in compact mode */
            padding: 7px 0;
          }
        `
      : isFirefox()
        ? css`
            vertical-align: top;
            height: auto;
            min-height: ${height};

            > div {
              /* 13px padding maintains visual consistency with other browsers in comfortable mode */
              padding: 13px 0;
            }
          `
        : css``

  return css`
    min-height: ${height};
    height: ${height};
    background: ${background};
    box-sizing: border-box;
    ${spacingsTemplate(spacings)}
    ${typographyTemplate(typography)}
  ${bordersTemplate(theme.border)}
  ${sortStylingHover}
  ${sortStylingActive}
  ${firefoxFix}

  ${$sticky
      ? css`
          position: sticky;
          top: 0;
          z-index: 1;
        `
      : ''}
  `
})

const CellInner = styled.div`
  display: flex;
  align-items: center;
  height: 100%;
`

type CellProps = {
  sort?: React.AriaAttributes['aria-sort']
  sticky?: boolean
} & ThHTMLAttributes<HTMLTableCellElement>

export const TableHeaderCell = forwardRef<HTMLTableCellElement, CellProps>(
  function TableHeaderCell({ children, sort, sticky, ...rest }, ref) {
    const { density } = useEds()
    const token = useToken({ density }, tablehead)
    const props = {
      ref,
      $sticky: sticky,
      $density: density,
      ...rest,
    }

    return (
      <ThemeProvider theme={token}>
        <StyledTableCell aria-sort={sort} {...props}>
          <CellInner>{children}</CellInner>
        </StyledTableCell>
      </ThemeProvider>
    )
  },
)
