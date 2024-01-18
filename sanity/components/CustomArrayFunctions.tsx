/* eslint-disable no-unused-vars */
// custom implementation of @sanity/form-builder/src/inputs/arrays/common/ArrayFunctions.tsx
import { ArraySchemaType, isReferenceSchemaType } from 'sanity'
import { AddIcon } from '@sanity/icons'
import { ReactNode, useMemo, useCallback } from 'react'
import { Button, Grid, Menu, MenuButton, MenuItem } from '@sanity/ui'
import { useId } from '@reach/auto-id'

// validation is defined on 'type' but not declared on SchemaType
type WithValidation = {
  validation?: any[]
}
export interface ArrayFunctionsProps<SchemaType extends ArraySchemaType, MemberType> {
  className?: string
  type: SchemaType & WithValidation
  children?: ReactNode
  value?: MemberType[]
  readOnly: boolean | null
  onAppendItem: (itemValue: MemberType) => void
  onPrependItem: (itemValue: MemberType) => void
  onFocusItem: (item: MemberType, index: number) => void
  onCreateValue: (type: SchemaType) => MemberType
  onChange: (event: any) => void
}

export default function ArrayFunctions<MemberType>(props: ArrayFunctionsProps<ArraySchemaType, MemberType>) {
  const { type, readOnly, children, onCreateValue, onAppendItem, value } = props
  const menuButtonId = useId()

  const insertItem = useCallback(
    (itemType) => {
      const item = onCreateValue(itemType)

      onAppendItem(item)
    },
    [onCreateValue, onAppendItem],
  )

  const handleAddBtnClick = useCallback(() => {
    insertItem(type.of[0])
  }, [type, insertItem])

  const popoverProps = useMemo(() => ({ constrainSize: true, portal: true }), [])

  if (readOnly) {
    return null
  }

  const maxLength = type?.validation && type.validation[0]._rules.find((rule: any) => rule.flag === 'max')

  if (maxLength && value && value.length >= maxLength.constraint) {
    return null
  }

  return (
    <Grid gap={1} style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(100px, 1fr))' }}>
      {type.of.length === 1 ? (
        <Button icon={AddIcon} mode="ghost" onClick={handleAddBtnClick} text="Add item" />
      ) : (
        <MenuButton
          button={<Button icon={AddIcon} mode="ghost" text="Add item…" />}
          id={menuButtonId || ''}
          menu={
            <Menu>
              {type.of.map((memberDef) => {
                // Use reference icon if reference is to one type only
                const referenceIcon =
                  isReferenceSchemaType(memberDef) && (memberDef.to || []).length === 1 && memberDef.to[0].icon

                const icon = memberDef.icon || memberDef.type?.icon || referenceIcon
                return (
                  <MenuItem
                    key={memberDef.name}
                    text={memberDef.title || memberDef.type?.name}
                    onClick={() => insertItem(memberDef)}
                    icon={icon}
                  />
                )
              })}
            </Menu>
          }
          popover={popoverProps}
        />
      )}

      {children}
    </Grid>
  )
}
