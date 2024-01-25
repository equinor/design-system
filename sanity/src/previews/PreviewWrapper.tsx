import styled from 'styled-components'
import { ReactNode } from 'react'
import { useToast, Button, Tooltip, Box, Text } from '@sanity/ui'
import { CopyIcon } from '@sanity/icons'

export const StyledWrapper = styled.div`
  height: 100%;
  width: 100%;
  p {
    padding: 1em;
  }
`

const StyledButton = styled(Button)`
  position: absolute;
  right: 11px;
  top: 8px;
`

type Props = {
  src: string
  children: ReactNode
  shareable?: boolean
}

export const PreviewWrapper = ({ src, children, shareable = true }: Props) => {
  const toast = useToast()
  const handleClick = () => {
    navigator.clipboard.writeText(src)
    toast.push({
      status: 'success',
      title: 'Preview link copied to clipboard',
    })
  }

  return (
    <StyledWrapper>
      {shareable && (
        <Tooltip
          content={
            <Box padding={2}>
              <Text muted size={1}>
                Copy shareable link to clipboard
              </Text>
            </Box>
          }
          placement="left"
          portal
        >
          <StyledButton tone="primary" radius={6} icon={CopyIcon} onClick={handleClick} />
        </Tooltip>
      )}
      {children}
    </StyledWrapper>
  )
}
