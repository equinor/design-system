import React, { useEffect } from 'react'
import { withKnobs, select, text, boolean } from '@storybook/addon-knobs'
import { action } from '@storybook/addon-actions'
import styled from 'styled-components'
import { Menu, Typography, Button, Icon } from '@equinor/eds-core-react'
import { folder } from '@equinor/eds-icons'

Icon.add({ folder })

const { MenuItem } = Menu
const Wrapper = styled.div`
  margin: 32px;
`

const Forced = styled.div`
  background: lightgrey;
  padding: 8px;
  width: min-content;
`

export default {
  title: 'Components|Menu',
  component: Menu,
  decorators: [withKnobs],
}

const handleOnChange = action('onChange')

export const Examples = () => {
  const divRef = React.useRef(null)
  const [state, setState] = React.useState({ button1El: null, divEl: null })
  const { button1El, divEl } = state

  const handleOnButtonClick = (e) =>
    button1El
      ? setState({ ...state, button1El: null })
      : setState({ ...state, button1El: e.target })

  // Forcing open menu on render
  useEffect(() => {
    if (divEl === null && divRef.current) {
      setState({ ...state, divEl: divRef.current })
    }
    return () => {}
  })

  return (
    <div>
      <Wrapper>
        <Typography variant="h4">Menu</Typography>
        <Forced ref={divRef}>Anchor</Forced>
        <Menu id="menu0" aria-labelledby="menu-button0" anchorEl={divEl}>
          <MenuItem>
            <Icon name="folder" />
            <span>Item 1</span>
            <span>CTRL+O</span>
          </MenuItem>
          <MenuItem active>Item 2</MenuItem>
          <MenuItem>Item 3</MenuItem>
        </Menu>
      </Wrapper>
      <Wrapper>
        <Typography style={{ marginTop: '170px' }} variant="h4">
          Opened with Button
        </Typography>
        <Button
          id="menu-button1"
          aria-haspopup="true"
          aria-controls="menu1"
          onClick={handleOnButtonClick}
        >
          Open Menu
        </Button>
        <Menu id="menu1" aria-labelledby="menu-button1" anchorEl={button1El}>
          <MenuItem>Item 1</MenuItem>
          <MenuItem>Item 2</MenuItem>
          <MenuItem>Item 3</MenuItem>
        </Menu>
      </Wrapper>
    </div>
  )
}
