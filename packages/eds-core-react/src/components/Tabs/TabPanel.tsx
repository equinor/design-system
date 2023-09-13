import { forwardRef, HTMLAttributes } from 'react'
import { styled, css } from 'styled-components'
import {
  outlineTemplate,
  spacingsTemplate,
  typographyTemplate,
} from '@equinor/eds-utils'

const StyledTabPanel = styled.div.attrs(
  (): HTMLAttributes<HTMLDivElement> => ({
    tabIndex: 0,
    role: 'tabpanel',
  }),
)(({ theme }) => {
  const {
    entities: { panel },
  } = theme

  return css`
    ${spacingsTemplate(panel.spacings)}
    ${typographyTemplate(panel.typography)}
    &:focus {
      outline: none;
    }
    &[data-focus-visible-added]:focus {
      ${outlineTemplate(panel.states.focus.outline)}
    }
    &:focus-visible {
      ${outlineTemplate(panel.states.focus.outline)}
    }
  `
})

export type TabPanelProps = HTMLAttributes<HTMLDivElement>

const TabPanel = forwardRef<HTMLDivElement, TabPanelProps>(function TabPanel(
  { ...props },
  ref,
) {
  return (
    <StyledTabPanel ref={ref} {...props}>
      {props.children}
    </StyledTabPanel>
  )
})

export { TabPanel }
