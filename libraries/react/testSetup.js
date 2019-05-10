import React from 'react'
import Enzyme from 'enzyme'
import 'jest-styled-components'
import styled from 'styled-components'
import Adapter from 'enzyme-adapter-react-16'

Enzyme.configure({ adapter: new Adapter() })
