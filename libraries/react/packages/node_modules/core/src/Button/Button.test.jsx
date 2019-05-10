import React from 'react'
import Enzyme from 'enzyme'
import 'jest-styled-components'
import styled from 'styled-components'
import Button from './Button'

const { shallow, mount } = Enzyme

test('it matches snapshot', () => {
    const wrapper = shallow(<Button />)
    expect(wrapper).toMatchSnapshot()
})

test('it matches style rule', () => {
    const wrapper = mount(<Button />)
    expect(wrapper).toHaveStyleRule('color', 'white')
})
