import React from 'react'
import Enzyme from 'enzyme'
import Button from './Button'

const { shallow, mount } = Enzyme

test('it matches snapshot', () => {
    const wrapper = shallow(<Button />)
    expect(wrapper).toMatchSnapshot()
})
