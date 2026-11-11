import { useMemo, useState } from 'react'
import { Button, Dialog } from '@equinor/eds-core-react/next'
import { pickerOptions } from '../../mapping/picker'
import type { PickerSubject } from '../../mapping/picker'
import type { OverrideValue } from '../../scan/mapping'
import { VariableList } from './VariableList'

export type PickerRequest = {
  /** What is being changed, such as “Bg/Neutral/Surface” or “12 bindings” */
  title: string
  /** Where and how far the change reaches */
  description: string
  subject: PickerSubject
  /** The target in force now; undefined when the bindings differ */
  current?: string | null
  /** True when the target in force is a change someone made, so it can be undone */
  changed?: boolean
  /** A chosen target or null to leave the bindings; undefined undoes the change */
  onSave: (value: OverrideValue | undefined) => void
}

function PickerBody({
  request,
  onClose,
  colorScheme,
}: {
  request: PickerRequest
  onClose: () => void
  colorScheme: 'light' | 'dark'
}) {
  const { title, description, subject, current, changed, onSave } = request
  const options = useMemo(() => pickerOptions(subject), [subject])
  const [value, setValue] = useState<string | null | undefined>(current)

  return (
    <>
      <Dialog.Header>
        <Dialog.Title>{title}</Dialog.Title>
      </Dialog.Header>
      <Dialog.Content>
        <p className="muted">{description}</p>
        <VariableList
          options={options}
          value={value}
          onChange={setValue}
          colorScheme={colorScheme}
        />
      </Dialog.Content>
      <Dialog.Actions>
        {changed && (
          <Button
            variant="ghost"
            onClick={() => {
              onSave(undefined)
              onClose()
            }}
          >
            Undo my change
          </Button>
        )}
        <Button variant="ghost" onClick={onClose}>
          Cancel
        </Button>
        <Button
          disabled={value === undefined}
          onClick={() => {
            if (value !== undefined) onSave(value)
            onClose()
          }}
        >
          Save
        </Button>
      </Dialog.Actions>
    </>
  )
}

/** Picks one target for one binding, a row of bindings, or a selection of them. */
export function TargetPicker({
  request,
  onClose,
  colorScheme,
}: {
  request?: PickerRequest
  onClose: () => void
  colorScheme: 'light' | 'dark'
}) {
  return (
    <Dialog
      className="target-picker"
      open={request !== undefined}
      onOpenChange={(open) => {
        if (!open) onClose()
      }}
    >
      {request && (
        <PickerBody
          request={request}
          onClose={onClose}
          colorScheme={colorScheme}
        />
      )}
    </Dialog>
  )
}
