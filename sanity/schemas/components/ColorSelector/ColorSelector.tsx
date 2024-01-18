import { Box, Card, Flex, Stack, Tooltip, Text } from '@sanity/ui'
import { useCallback } from 'react'
import { set } from 'sanity'
import type { ObjectInputProps } from 'sanity'
import styled from 'styled-components'
import { defaultColors } from './defaultColors'

const Circle = styled.div<{ active: boolean }>`
  display: inline-block;
  border: solid 2px ${({ active }) => (active ? 'var(--card-focus-ring-color)' : 'transparent')};
  border-radius: 50%;
  padding: 4px;
  cursor: pointer;
`

const InnerCircle = styled.div<{ color: string }>`
  background-color: ${({ color }) => color};
  border: 1px solid var(--card-hairline-soft-color);
  padding: 15px;
  border-radius: 50%;
`

export type ColorSelectorValue = {
  title: string
  value: string
}

type ColorCircleProps = {
  color: ColorSelectorValue
  active: boolean
  onClickHandler: (val: ColorSelectorValue) => void
}

const ColorCircle = ({ color, active, onClickHandler }: ColorCircleProps) => (
  <Card paddingY={1}>
    <Tooltip
      content={
        <Box padding={2}>
          <Text muted size={1}>
            {color.title}
          </Text>
        </Box>
      }
      fallbackPlacements={['right', 'left']}
      placement="top"
      portal
    >
      <Circle active={active} onClick={() => onClickHandler(color)}>
        <InnerCircle color={color.value} />
      </Circle>
    </Tooltip>
  </Card>
)

type ColorSelectorProps = ObjectInputProps

export const ColorSelector = ({ value, onChange, schemaType }: ColorSelectorProps) => {
  const { options } = schemaType
  const colors = (options?.colors as ColorSelectorValue[]) || defaultColors

  const handleSelect = useCallback(
    (selected: ColorSelectorValue) => {
      if (selected === value) return

      onChange(set(selected.title, ['title']))
      onChange(set(selected.value, ['value']))
    },
    [onChange, value],
  )

  return (
    <Stack space={3}>
      {colors && (
        <Card>
          <Flex direction={'row'} wrap={'wrap'}>
            {colors.map((colorItem: ColorSelectorValue) => {
              return (
                <ColorCircle
                  key={colorItem.value}
                  color={colorItem}
                  active={colorItem.value === value?.value}
                  onClickHandler={handleSelect}
                />
              )
            })}
          </Flex>
        </Card>
      )}
    </Stack>
  )
}

export default ColorSelector
