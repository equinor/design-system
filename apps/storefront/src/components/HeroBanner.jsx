import React from 'react'
import PropTypes from 'prop-types'
import Text from './Text'
import { H1 } from './Titles'
import styled from 'styled-components'

const StyledHeroBanner = styled.div`
  background: #f7f7f7;
  display: grid;
  grid-template-areas:
    '. . .'
    '. intro .'
    '. illustration .';
  grid-template-columns: 2rem 1fr 2rem;
  grid-template-rows: 2rem min-content min-content;
  @media (min-width: 600px) {
    height: 36rem;
    padding: 2rem;
    grid-template-areas: '. intro . illustration .';
    grid-template-columns: 1rem auto 2rem 45% 1fr;
    grid-template-rows: 1fr;
  }
  @media (min-width: 1200px) {
    grid-template-columns: 4.5rem auto 2rem 45% 1fr;
  }
`
const Intro = styled.div`
  grid-area: intro;
  text-align: center;
  max-width: 420px;
  @media (min-width: 600px) {
    align-self: center;
  }
`

const Illustration = styled.div`
  grid-area: illustration;
  /*  width: 100%; */
  max-width: 600px;
  @media (min-width: 600px) {
    align-self: center;
  }
`

const HeroBanner = ({ title, children }) => {
  return (
    <StyledHeroBanner>
      <Intro>
        <H1>{title}</H1>
        <Text variant="body_short" style={{ fontSize: '18px' }}>
          {children}
        </Text>
      </Intro>
      <Illustration>
        <svg
          viewBox="0 0 623 520"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M22.7567 230.986C-0.12048 283.01 -24.0376 370.093 49.7934 450.39C122.585 530.687 208.894 452.086 320.161 463.961C431.427 475.836 525.536 504.675 529.175 422.681C532.815 340.688 561.931 327.117 566.611 250.212C571.29 173.308 522.416 113.934 448.065 62.4759C373.714 11.018 278.566 21.1964 177.698 77.1782C76.8302 133.16 45.6339 178.963 22.7567 230.986Z"
            fill="#C4C4C4"
          />
          <path
            d="M577.954 256.639C594.905 202.377 608.996 113.209 526.721 42.0843C445.479 -29.1613 368.456 58.809 256.587 59.9004C144.719 60.9918 48.0127 43.267 53.5038 125.039C58.9949 206.81 31.574 223.644 35.4668 300.486C39.3595 377.329 94.514 430.583 174.102 473.035C253.69 515.487 347.095 494.38 441.095 427.167C535.095 359.954 561.003 310.901 577.954 256.639Z"
            fill="#C4C4C4"
            fillOpacity="0.5"
          />
        </svg>
      </Illustration>
    </StyledHeroBanner>
  )
}

HeroBanner.propTypes = {
  title: PropTypes.string.isRequired,
  children: PropTypes.node,
}

HeroBanner.defaultProps = {
  children: null,
}

export default HeroBanner // eslint-disable-line
