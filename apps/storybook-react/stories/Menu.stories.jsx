import React, { useEffect } from 'react'
import { withKnobs, select, text, boolean } from '@storybook/addon-knobs'
import { action } from '@storybook/addon-actions'
import styled from 'styled-components'
import {
  Menu,
  Typography,
  Button,
  Icon,
  Divider,
} from '@equinor/eds-core-react'
import {
  folder,
  copy,
  paste,
  edit,
  delete_to_trash,
  settings,
} from '@equinor/eds-icons'

Icon.add({ folder, copy, paste, edit, delete_to_trash, settings })

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

export const Preview = () => {
  const anchorRef = React.useRef(null)
  const [anchorEl, setAnchorEl] = React.useState(null)

  // Forcing open menu on render
  useEffect(() => {
    if (anchorEl === null && anchorRef.current) {
      setAnchorEl(anchorRef.current)
    }
    return () => {}
  })

  return (
    <div>
      <Wrapper>
        <Typography variant="h4">Menu</Typography>
        <Forced ref={anchorRef}>Attached to some anchor</Forced>
        <Menu id="menu0" aria-labelledby="menu-button0" anchorEl={anchorEl}>
          <MenuItem>
            <Icon name="folder" />
            <span>Open</span>
            <span>CTRL+O</span>
          </MenuItem>
          <MenuItem active>
            <Icon name="copy" />
            <span>Copy</span>
            <span>CTRL+C</span>
          </MenuItem>
          <MenuItem>
            <Icon name="paste" />
            <span>Paste</span>
            <span>CTRL+V</span>
          </MenuItem>
          <MenuItem>
            <Icon name="edit" />
            <span>Rename</span>
            <span>CTRL+R</span>
          </MenuItem>
          <MenuItem>
            <Icon name="delete_to_trash" />
            <span>Delete</span>
            <span>Del</span>
          </MenuItem>
          <Divider variant="small" />
          <MenuItem>
            <Icon name="settings" />
            <span>Properties</span>
          </MenuItem>
        </Menu>
      </Wrapper>
    </div>
  )
}

export const ButtonToggle = () => {
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
        <Typography variant="h4">Opened with Button</Typography>
        <Button
          id="menu-button1"
          aria-haspopup="true"
          aria-controls="menu1"
          onClick={handleOnButtonClick}
        >
          Open Menu
        </Button>
        <Menu id="menu0" aria-labelledby="menu-button0" anchorEl={button1El}>
          <MenuItem>
            <Icon name="folder" />
            <span>Open</span>
            <span>CTRL+O</span>
          </MenuItem>
          <MenuItem active>
            <Icon name="copy" />
            <span>Copy</span>
            <span>CTRL+C</span>
          </MenuItem>
          <MenuItem>
            <Icon name="paste" />
            <span>Paste</span>
            <span>CTRL+V</span>
          </MenuItem>
          <MenuItem>
            <Icon name="edit" />
            <span>Rename</span>
            <span>CTRL+R</span>
          </MenuItem>
          <MenuItem>
            <Icon name="delete_to_trash" />
            <span>Delete</span>
            <span>Del</span>
          </MenuItem>
          <Divider variant="small" />
          <MenuItem>
            <Icon name="settings" />
            <span>Properties</span>
          </MenuItem>
        </Menu>
      </Wrapper>
    </div>
  )
}
