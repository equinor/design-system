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
  Dialog,
  Snackbar,
} from '@equinor/eds-core-react'
import { Story, Meta } from '@storybook/react'
import styled from 'styled-components'

const { Header } = TopBar
const { Title, CustomContent, Actions } = Dialog

export default {
  title: 'Customization/Z-Index',
} as Meta

const Wrapper = styled.div.attrs({ tabIndex: 0 })`
  height: 100vh;
  overflow: auto;
`

const Body = styled.div`
  background: #ebebeb;
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

export const zIndexExample: Story<any> = () => {
  const [openSnackbar, setOpenSnackbar] = useState(false)
  const [visibleScrim, setVisibleScrim] = useState(false)
  const handleCloseDialog = () => {
    setVisibleScrim(!visibleScrim)
  }

  return (
    <Wrapper>
      <TopBar>
        <Header>TopBar Header</Header>
      </TopBar>
      <Body>
        <Button onClick={() => setOpenSnackbar(true)}>Trigger Snackbar</Button>
        <Snackbar
          open={openSnackbar}
          onClose={() => setOpenSnackbar(false)}
          autoHideDuration={5000}
          leftAlignFrom="1500px"
        >
          This is a snackbar!
        </Snackbar>
        <Button onClick={() => setVisibleScrim(true)}>
          Trigger Dialog with Scrim
        </Button>
        {visibleScrim && (
          <Scrim onClose={handleCloseDialog}>
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
      </Body>
    </Wrapper>
  )
}
