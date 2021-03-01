import React, { useEffect, MutableRefObject } from 'react'
import { action } from '@storybook/addon-actions'
import styled from 'styled-components'
import { Menu, MenuProps, Typography, Button, Icon, TopBar } from '@components'
import { Story, Meta } from '@storybook/react'

import { tokens } from '@equinor/eds-tokens'

import {
  folder,
  copy,
  paste,
  edit,
  delete_to_trash,
  settings,
  arrow_drop_right,
  more_vertical,
  pressure,
  bearing,
  cable,
} from '@equinor/eds-icons'

Icon.add({
  folder,
  copy,
  paste,
  edit,
  delete_to_trash,
  settings,
  arrow_drop_right,
  more_vertical,
  pressure,
  bearing,
  cable,
})

const { MenuItem, MenuSection } = Menu
const { Actions, Header } = TopBar
const { colors } = tokens

const Grid = styled.div`
  margin: 32px;
  display: grid;
  grid-gap: 32px;
  grid-auto-flow: column;
  width: auto;
  height: auto;
`

const onClick = (event: React.MouseEvent) => {
  action('clicked')(event)
  event.stopPropagation()
}

const bigMenuTemplate = (
  <>
    <MenuItem onClick={onClick}>
      <Typography
        color={colors.text.static_icons__tertiary.hex}
        group="navigation"
        variant="label"
      >
        <Icon name="folder" />
      </Typography>
      <Typography group="navigation" variant="menu_title">
        Open
      </Typography>
      <Typography
        color={colors.text.static_icons__tertiary.hex}
        group="navigation"
        variant="label"
      >
        CTRL+O
      </Typography>
    </MenuItem>
    <MenuItem active onClick={onClick}>
      <Typography
        color={colors.text.static_icons__tertiary.hex}
        group="navigation"
        variant="label"
      >
        <Icon name="copy" />
      </Typography>
      <Typography group="navigation" variant="menu_title">
        Copy
      </Typography>
      <Typography
        color={colors.text.static_icons__tertiary.hex}
        group="navigation"
        variant="label"
      >
        CTRL+C
      </Typography>
    </MenuItem>
    <MenuItem disabled onClick={onClick}>
      <Typography
        color={colors.text.static_icons__tertiary.hex}
        group="navigation"
        variant="label"
      >
        <Icon name="paste" />
      </Typography>
      <Typography group="navigation" variant="menu_title">
        Paste
      </Typography>
      <Typography
        color={colors.text.static_icons__tertiary.hex}
        group="navigation"
        variant="label"
      >
        CTRL+V
      </Typography>
    </MenuItem>
    <MenuItem onClick={onClick}>
      <Typography
        color={colors.text.static_icons__tertiary.hex}
        group="navigation"
        variant="label"
      >
        <Icon name="edit" />
      </Typography>
      <Typography group="navigation" variant="menu_title">
        Rename
      </Typography>
      <Typography
        color={colors.text.static_icons__tertiary.hex}
        group="navigation"
        variant="label"
      >
        CTRL+R
      </Typography>
    </MenuItem>
    <MenuItem onClick={onClick}>
      <Typography
        color={colors.text.static_icons__tertiary.hex}
        group="navigation"
        variant="label"
      >
        <Icon name="delete_to_trash" />
      </Typography>
      <Typography group="navigation" variant="menu_title">
        Delete
      </Typography>
      <Typography
        color={colors.text.static_icons__tertiary.hex}
        group="navigation"
        variant="label"
      >
        DEL
      </Typography>
    </MenuItem>
    <MenuSection title="Section">
      <MenuItem onClick={onClick}>
        <Typography
          color={colors.text.static_icons__tertiary.hex}
          group="navigation"
          variant="label"
        >
          <Icon name="settings" />
        </Typography>
        <Typography group="navigation" variant="menu_title">
          Settings
        </Typography>
      </MenuItem>
    </MenuSection>
  </>
)

export default {
  title: 'Components/Menu',
  component: Menu,
  parameters: {
    viewMode: 'story',
  },
} as Meta

export const ButtonToggle: Story<MenuProps> = () => {
  const [state, setState] = React.useState<{
    buttonEl: HTMLButtonElement
    focus: 'first' | 'last'
  }>({
    buttonEl: null,
    focus: 'first',
  })

  const { buttonEl, focus } = state
  const isOpen = Boolean(buttonEl)

  const openMenu = (
    e:
      | React.MouseEvent<HTMLButtonElement, MouseEvent>
      | React.KeyboardEvent<HTMLButtonElement>,
    focus: 'first' | 'last',
  ) => {
    const target = e.target as HTMLButtonElement
    setState({ ...state, buttonEl: target, focus })
  }

  const closeMenu = () => {
    setState({ ...state, buttonEl: null, focus })
  }

  const onKeyPress = (e: React.KeyboardEvent<HTMLButtonElement>) => {
    const { key } = e
    e.preventDefault()
    switch (key) {
      case 'ArrowDown':
        isOpen ? closeMenu() : openMenu(e, 'first')
        break
      case 'ArrowUp':
        isOpen ? closeMenu() : openMenu(e, 'last')
        break
      case 'Escape':
        closeMenu()
        break
      default:
        break
    }
  }

  return (
    <Grid style={{ gridAutoFlow: 'row', position: 'relative', margin: '5rem' }}>
      <Typography variant="h4">Click button to open Menu</Typography>
      <Button
        variant="ghost_icon"
        id="menuButton"
        aria-controls="menu-on-button"
        aria-haspopup="true"
        aria-expanded={isOpen}
        onClick={(e) => (isOpen ? closeMenu() : openMenu(e, null))}
        onKeyDown={onKeyPress}
      >
        Menu
      </Button>
      <Menu
        id="menu-on-button"
        aria-labelledby="menuButton"
        open={isOpen}
        anchorEl={buttonEl}
        onClose={closeMenu}
        focus={focus}
        placement="right-end"
      >
        {bigMenuTemplate}
      </Menu>
    </Grid>
  )
}

// export const InTopbar: Story<MenuProps> = () => {
//   const [state, setState] = React.useState<{
//     isOpen: boolean
//     focus: 'first' | 'last'
//   }>({
//     isOpen: false,
//     focus: 'first',
//   })

//   const { isOpen, focus } = state

//   const openMenu = (focus: 'first' | 'last') => {
//     setState({ ...state, focus, isOpen: true })
//   }

//   const closeMenu = () => {
//     setState({ ...state, focus, isOpen: false })
//   }

//   const onKeyPress = (e: React.KeyboardEvent<HTMLButtonElement>) => {
//     const { key } = e
//     e.preventDefault()
//     switch (key) {
//       case 'ArrowDown':
//         isOpen ? closeMenu() : openMenu('first')
//         break
//       case 'ArrowUp':
//         isOpen ? closeMenu() : openMenu('last')
//         break
//       case 'Escape':
//         closeMenu()
//         break
//       default:
//         break
//     }
//   }
//   const referenceElement = React.useRef(null)

//   return (
//     <Grid style={{ margin: 0 }}>
//       <TopBar>
//         <Header>Menu in Topbar</Header>
//         <Actions>
//           <Button
//             ref={referenceElement}
//             variant="ghost_icon"
//             id="menuButton"
//             aria-controls="menu-on-button"
//             aria-haspopup="true"
//             aria-expanded={isOpen}
//             onClick={() => (isOpen ? closeMenu() : openMenu(null))}
//             onKeyDown={onKeyPress}
//           >
//             <Icon name="more_vertical" title="more"></Icon>
//           </Button>
//           <Menu
//             id="menu-on-button"
//             aria-labelledby="menuButton"
//             focus={focus}
//             open={isOpen}
//             anchorEl={referenceElement}
//             onClose={closeMenu}
//             placement="left-end"
//           >
//             {bigMenuTemplate}
//           </Menu>
//         </Actions>
//       </TopBar>
//     </Grid>
//   )
// }

// export const Examples: Story<MenuProps> = () => {
//   const [state, setState] = React.useState<{
//     open: 1 | 2 | 3 | 4 | null
//   }>({
//     open: null,
//   })

//   const oneRef = React.useRef(null)
//   const twoRef = React.useRef(null)
//   const threeRef = React.useRef(null)
//   const fourRef = React.useRef(null)

//   const { open } = state

//   const openMenu = (open: 1 | 2 | 3 | 4) => {
//     setState({ open })
//   }

//   const closeMenu = () => {
//     setState({ open: null })
//   }

//   return (
//     <Grid style={{ marginBottom: '3rem' }}>
//       <Button
//         ref={oneRef}
//         id="anchor-iconbuttons"
//         aria-controls="menu-iconbuttons"
//         aria-haspopup="true"
//         aria-expanded={open === 1}
//         onClick={() => (open === 1 ? closeMenu() : openMenu(1))}
//       >
//         Icon Buttons
//       </Button>
//       <Menu
//         onClose={closeMenu}
//         id="menu-iconbuttons"
//         open={open === 1}
//         anchorEl={oneRef}
//         placement="bottom"
//       >
//         <Button variant="ghost_icon" onClick={closeMenu}>
//           <Icon name="save" title="save"></Icon>
//         </Button>
//         <Button variant="ghost_icon" onClick={closeMenu}>
//           <Icon name="folder" title="folder"></Icon>
//         </Button>
//         <Button variant="ghost_icon" onClick={closeMenu}>
//           <Icon name="edit" title="edit"></Icon>
//         </Button>
//         <Button variant="ghost_icon" onClick={closeMenu}>
//           <Icon name="settings" title="settings"></Icon>
//         </Button>
//       </Menu>
//       <Button
//         ref={twoRef}
//         id="anchor-plaintext"
//         aria-controls="menu-plaintext"
//         aria-haspopup="true"
//         aria-expanded={open === 2}
//         onClick={() => (open === 2 ? closeMenu() : openMenu(2))}
//       >
//         Text
//       </Button>
//       <Menu
//         onClose={closeMenu}
//         id="menu-plaintext"
//         open={open === 2}
//         anchorEl={twoRef}
//         placement="bottom"
//       >
//         <MenuItem onClick={onClick}>Pressure </MenuItem>
//         <MenuItem onClick={onClick}>Bearing</MenuItem>
//         <MenuItem onClick={onClick}>Cable</MenuItem>
//       </Menu>
//       <Button
//         ref={threeRef}
//         id="anchor-textIcon"
//         aria-controls="menu-textIcon"
//         aria-haspopup="true"
//         aria-expanded={open === 3}
//         onClick={() => (open === 3 ? closeMenu() : openMenu(3))}
//       >
//         Text with icons
//       </Button>
//       <Menu
//         id="menu-textIcon"
//         open={open === 3}
//         anchorEl={threeRef}
//         onClose={closeMenu}
//         placement="bottom"
//       >
//         <MenuItem onClick={onClick}>
//           <Typography group="navigation" variant="label">
//             <Icon name="pressure" />
//           </Typography>
//           Pressure
//         </MenuItem>
//         <MenuItem onClick={onClick}>
//           <Typography group="navigation" variant="label">
//             <Icon name="bearing" />
//           </Typography>
//           Bearing
//         </MenuItem>
//         <MenuItem onClick={onClick}>
//           <Typography group="navigation" variant="label">
//             <Icon name="cable" />
//           </Typography>
//           Cable
//         </MenuItem>
//       </Menu>
//       <Button
//         ref={fourRef}
//         id="anchor-bigMenu"
//         aria-controls="menu-bigMenu"
//         aria-haspopup="true"
//         aria-expanded={open === 4}
//         onClick={() => (open === 4 ? closeMenu() : openMenu(4))}
//       >
//         Complex menu
//       </Button>
//       <Menu
//         id="menu-bigMenu"
//         anchorEl={fourRef}
//         open={open === 4}
//         onClose={closeMenu}
//         placement="bottom"
//       >
//         {bigMenuTemplate}
//       </Menu>
//     </Grid>
//   )
// }
