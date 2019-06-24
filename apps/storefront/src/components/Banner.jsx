import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { Link } from 'gatsby'

const Wrapper = styled.div`
  background: darkgray;
  z-index: 2;
  position: fixed;
  top: 0;
  right: 0;
  left: 0;
  display: grid;
  grid-template-columns: 1fr auto;
  grid-template-rows: var(--Banner-height);
  border-bottom: 1px solid var(--borderColor);
  font-size: small;

  a {
    color: inherit;
  }

  & > :first-child {
    margin: 0;
    background: darkgray;
    padding-left: 3rem;
    padding-right: 1em;
    display: grid;
    align-items: center;

    p {
      text-overflow: ellipsis;
      overflow: hidden;
      white-space: nowrap;
    }
  }

  & > :last-child {
    display: grid;
    align-items: center;
    margin: 0;
    background: #666;
    padding-left: 2em;
    padding-right: 2em;
    color: white;
    text-decoration: none;

    &:hover {
      background: #777;
    }
  }
`

const link = '//components/component-status'

const Banner = () => (
  <Wrapper>
    <div>
      <p>
        The EDS is currently under construction. Check the{' '}
        <Link to={link}>component status</Link> page for updates.
      </p>
    </div>
    <Link to={link}>Component Status</Link>
  </Wrapper>
)

export default Banner
