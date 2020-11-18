import React, { useState } from 'react'
import {
  Tooltip,
  TopBar,
  Scrim,
  Popover,
  Menu,
  Search,
  Chip,
  Button,
  Icon,
  Dialog,
  Snackbar,
  Typography,
  SideSheet,
} from '@equinor/eds-core-react'
import {
  save,
  folder,
  copy,
  paste,
  edit,
  delete_to_trash,
  settings,
  arrow_drop_right,
  more_verticle,
  pressure,
  bearing,
  cable,
} from '@equinor/eds-icons'
import { Story, Meta } from '@storybook/react'
import styled from 'styled-components'

const { Header } = TopBar
const { Title, CustomContent, Actions } = Dialog
const { PopoverTitle, PopoverContent, PopoverAnchor } = Popover

Icon.add({
  save,
  folder,
  copy,
  paste,
  edit,
  delete_to_trash,
  settings,
  arrow_drop_right,
  more_verticle,
  pressure,
  bearing,
  cable,
})

export default {
  title: 'Documentation/Z-Index',
} as Meta

const Wrapper = styled.div.attrs({ tabIndex: 0 })`
  height: 100vh;
  overflow: auto;
`

const Body = styled.div`
  background: #fafafa;
  display: grid;
  grid-row-gap: 16px;
  justify-items: center;
`

const TempButtonWrapper = styled.div`
  display: grid;
  column-gap: 16px;
  grid-template-columns: repeat(2, fit-content(100%));
  justify-content: end;
  justify-self: end;
`
const ListItem = styled.li`
  padding-top: 8px;
  height: 52px;
  width: 400px;
`

const FlexContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  grid-gap: 16px;
`

export const zIndex: Story<any> = () => {
  const [openSnackbar, setOpenSnackbar] = useState(false)
  const [visibleScrim, setVisibleScrim] = useState(false)
  const [openPopover, setOpenPopover] = useState(false)
  const [openSideSheet, setOpenSideSheet] = useState(false)
  const [visibleSideSheetScrim, setVisibleSideSheetScrim] = useState(false)

  const [menuState, setMenuState] = useState<{
    buttonEl: HTMLButtonElement
  }>({
    buttonEl: null,
  })

  const { buttonEl } = menuState
  const isOpen = Boolean(buttonEl)

  const openMenu = (
    e:
      | React.MouseEvent<HTMLButtonElement, MouseEvent>
      | React.KeyboardEvent<HTMLButtonElement>,
  ) => {
    const target = e.target as HTMLButtonElement
    setMenuState({ buttonEl: target })
  }

  const closeMenu = () => {
    setMenuState({ buttonEl: null })
  }

  return (
    <Wrapper>
      <TopBar>
        <Header>TopBar z-index: </Header>
      </TopBar>
      <Body>
        <ol>
          <ListItem>
            <FlexContainer>
              <Typography>Snackbar z-index: </Typography>
              <Button variant="ghost" onClick={() => setOpenSnackbar(true)}>
                Trigger Snackbar
              </Button>
            </FlexContainer>

            <Snackbar
              open={openSnackbar}
              onClose={() => setOpenSnackbar(false)}
              autoHideDuration={5000}
              leftAlignFrom="1500px"
            >
              This is a snackbar!
            </Snackbar>
          </ListItem>

          <ListItem>
            <FlexContainer>
              <Typography>Scrim z-index: </Typography>
              <Button variant="ghost" onClick={() => setVisibleScrim(true)}>
                Trigger Dialog with Scrim
              </Button>
            </FlexContainer>

            {visibleScrim && (
              <Scrim onClose={() => setVisibleScrim(false)}>
                <Dialog>
                  <Title>Title</Title>
                  <CustomContent scrollable>
                    Custom content scrollable
                  </CustomContent>
                  <Actions>
                    <TempButtonWrapper>
                      <Button
                        variant="ghost"
                        onClick={() => setVisibleScrim(false)}
                      >
                        Cancel
                      </Button>
                      <Button onClick={() => setVisibleScrim(false)}>OK</Button>
                    </TempButtonWrapper>
                  </Actions>
                </Dialog>
              </Scrim>
            )}
          </ListItem>

          <ListItem>
            <FlexContainer>
              <Typography>Tooltip z-index: </Typography>

              <Tooltip title="Tooltip">
                <Button variant="ghost">Trigger Tooltip</Button>
              </Tooltip>
            </FlexContainer>
          </ListItem>

          <ListItem>
            <FlexContainer>
              <Typography>Popover z-index: </Typography>

              <Popover onClose={() => setOpenPopover(false)} open={openPopover}>
                <PopoverAnchor>
                  <Button variant="ghost" onClick={() => setOpenPopover(true)}>
                    Trigger Popover
                  </Button>
                </PopoverAnchor>
                <PopoverTitle>Popover</PopoverTitle>
                <PopoverContent>
                  <Typography variant="body_short">
                    Popover should never be over Scrim
                  </Typography>
                </PopoverContent>
              </Popover>
            </FlexContainer>
          </ListItem>

          <ListItem>
            <FlexContainer>
              <Typography>Sidesheet z-index: </Typography>
              <Button variant="ghost" onClick={() => setOpenSideSheet(true)}>
                Trigger Sidesheet
              </Button>
            </FlexContainer>
          </ListItem>

          <ListItem>
            <FlexContainer>
              <Typography>Menu z-index: </Typography>
              <Button
                variant="ghost"
                id="menuButton"
                aria-controls="menu-on-button"
                aria-haspopup="true"
                aria-expanded={isOpen}
                onClick={(e) => (isOpen ? closeMenu() : openMenu(e))}
              >
                Open menu
              </Button>
              <Menu id="menu-iconbuttons" open anchorEl={buttonEl}>
                <Button variant="ghost_icon">
                  <Icon name="save" title="save"></Icon>
                </Button>
                <Button variant="ghost_icon">
                  <Icon name="folder" title="folder"></Icon>
                </Button>
                <Button variant="ghost_icon">
                  <Icon name="edit" title="edit"></Icon>
                </Button>
                <Button variant="ghost_icon">
                  <Icon name="settings" title="settings"></Icon>
                </Button>
              </Menu>
            </FlexContainer>
          </ListItem>

          <ListItem>
            <FlexContainer>
              <Typography>Chip z-index: </Typography>
              <Chip>This is a chip </Chip>
            </FlexContainer>
          </ListItem>
        </ol>

        <ListItem>
          <FlexContainer>
            <Typography>Sidesheet z-index: </Typography>
            <Button
              variant="ghost"
              onClick={() => setVisibleSideSheetScrim(true)}
            >
              Trigger sidesheet with scrim
            </Button>
          </FlexContainer>
        </ListItem>
        {visibleSideSheetScrim && (
          <Scrim onClose={() => setVisibleSideSheetScrim(false)}>
            <SideSheet
              variant="large"
              title="Sidesheet"
              open={visibleSideSheetScrim}
              onClose={() => setOpenSideSheet(false)}
            >
              <Typography>This is a sidesheet</Typography>
            </SideSheet>
          </Scrim>
        )}
      </Body>
    </Wrapper>
  )
}
