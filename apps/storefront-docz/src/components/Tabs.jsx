import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { Link } from 'gatsby'
import { media } from '../gatsby-theme-docz/theme/breakpoints'

const StyledTabs = styled.ul`
  list-style-type: none;
  padding-left: 0 !important;
  display: flex;
  flex-direction: column;
  margin: 2rem 0 0 0;
  ${media.small} {
    flex-direction: row;
  }
`

const StyledTab = styled.li`
  position: relative;
  @media (--large) {
    margin-bottom: 0;
  }
`

const StyledTabLink = styled(Link)`
  padding: 1px 16px;
  display: block;
  text-decoration: none;
  color: ${(props) => (props.active === 'true' ? '#007079' : 'inherit')};
  letter-spacing: 0.2px;
  font-size: 16px;
  line-height: 46px;
  position: relative;
  &::after {
    content: '';
    height: 2px;
    background-color: ${(props) =>
      props.active === 'true' ? '#007079' : '#dcdcdc'};
    width: 100%;
    position: absolute;
    bottom: 0;
    left: 0;
  }
  &:hover {
    background-color: #deedee;
  }
`

export const Tabs = ({ children }) => {
  return <StyledTabs>{children}</StyledTabs>
}

Tabs.propTypes = {
  children: PropTypes.node.isRequired,
}
export const Tab = ({ children }) => {
  return <StyledTab>{children}</StyledTab>
}

Tab.propTypes = {
  children: PropTypes.node.isRequired,
}

export const TabLink = ({ href, isSelected, children }) => {
  return (
    <StyledTabLink active={isSelected.toString()} to={href}>
      {children}
    </StyledTabLink>
  )
}
