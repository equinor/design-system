import { useState } from 'react'
import { Button, Radio } from '@equinor/eds-core-react/next'
import type { Scope, SelectionComponent } from '../../shared/messages'
import { pageCountText, pagesToScan } from '../../shared/pages'
import type { FilePage } from '../../shared/pages'
import { InsideMainComponent, MainComponentLabel } from './MainComponentLabel'
import { PagePicker } from './PagePicker'

export type SelectionInfo = {
  count: number
  firstName?: string
  /** The selection is main components, or one layer inside a main component */
  component?: SelectionComponent
}

type ScanControlsProps = {
  scope: Scope
  onScopeChange: (scope: Scope) => void
  selection: SelectionInfo
  /** The scan loader shows the progress and Cancel, so Scan is hidden meanwhile */
  scanning: boolean
  onScan: () => void
  /** After a scan: scope and Scan on one line, as Check designs keeps its controls small */
  compact?: boolean
  /** Selects the scanned layers, as Check designs' refocus (final review FR6) */
  onGoToScope?: () => void
  /** The pages in the file, for Select pages beside File */
  pages: FilePage[]
  /** The pages a scan of the file leaves out */
  leftOutPages: string[]
  /** The page picker opens; the pages are asked for again */
  onOpenPages: () => void
  onLeftOutPagesChange: (pageIds: string[]) => void
}

/** “Main component” or “2 main components”, in the purple label */
function componentText({ count }: SelectionInfo): string {
  return count === 1 ? 'Main component' : `${count} main components`
}

function selectionText({ count, firstName }: SelectionInfo): string {
  if (count === 0) return 'Nothing is selected.'
  if (count === 1) return `Selected: ${firstName ?? '1 layer'}`
  return `Selected: ${count} layers`
}

export function ScanControls({
  scope,
  onScopeChange,
  selection,
  scanning,
  onScan,
  compact = false,
  onGoToScope,
  pages,
  leftOutPages,
  onOpenPages,
  onLeftOutPagesChange,
}: ScanControlsProps) {
  const [pagesOpen, setPagesOpen] = useState(false)
  const nothingSelected = scope === 'selection' && selection.count === 0
  const noPages =
    scope === 'file' &&
    pages.length > 0 &&
    pagesToScan(pages, leftOutPages).length === 0
  return (
    <div className={compact ? 'scan-controls compact' : 'stack-tight'}>
      <fieldset className="scope" disabled={scanning}>
        <legend className="section-title">Scope</legend>
        <div className="scope-options">
          <Radio
            name="scope"
            label="Selection"
            value="selection"
            checked={scope === 'selection'}
            disabled={selection.count === 0}
            onChange={() => onScopeChange('selection')}
          />
          <Radio
            name="scope"
            label="Page"
            value="page"
            checked={scope === 'page'}
            onChange={() => onScopeChange('page')}
          />
          <Radio
            name="scope"
            label="File"
            value="file"
            checked={scope === 'file'}
            onChange={() => onScopeChange('file')}
          />
          {scope === 'file' && pages.length > 0 && (
            <span className="pages-line">
              <Button
                variant="ghost"
                size="small"
                onClick={() => {
                  onOpenPages()
                  setPagesOpen(true)
                }}
              >
                Select pages
              </Button>
              <span className="muted pages-count">
                {pageCountText(pages, leftOutPages)}
              </span>
            </span>
          )}
        </div>
        {scope === 'selection' && (
          <span className="selection-line">
            <span className="muted selection-text">
              {selectionText(selection)}
            </span>
            {selection.component?.kind === 'inside' ? (
              <InsideMainComponent name={selection.component.name} />
            ) : (
              selection.component && (
                <MainComponentLabel>
                  {componentText(selection)}
                </MainComponentLabel>
              )
            )}
          </span>
        )}
      </fieldset>
      {!scanning && (
        <div className="scan-action">
          {compact && onGoToScope && (
            <Button variant="secondary" size="small" onClick={onGoToScope}>
              Go to scope
            </Button>
          )}
          <Button
            size={compact ? 'small' : undefined}
            onClick={onScan}
            disabled={nothingSelected || noPages}
          >
            {compact ? 'Scan again' : 'Scan'}
          </Button>
          {nothingSelected && (
            <span className="muted">Select one or more frames first.</span>
          )}
          {noPages && (
            <span className="muted">Select one or more pages first.</span>
          )}
        </div>
      )}
      <PagePicker
        open={pagesOpen}
        pages={pages}
        leftOut={leftOutPages}
        onClose={() => setPagesOpen(false)}
        onSave={(pageIds) => {
          setPagesOpen(false)
          onLeftOutPagesChange(pageIds)
        }}
      />
    </div>
  )
}
