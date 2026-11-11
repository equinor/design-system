import { Button, Radio } from '@equinor/eds-core-react/next'
import type { ScanProgress, Scope } from '../../shared/messages'

export type SelectionInfo = { count: number; firstName?: string }

type ScanControlsProps = {
  scope: Scope
  onScopeChange: (scope: Scope) => void
  selection: SelectionInfo
  scanning: boolean
  progress?: ScanProgress
  onScan: () => void
  onCancel: () => void
  /** After a scan: scope and Scan on one line, as Check designs keeps its controls small */
  compact?: boolean
  /** Selects the scanned layers, as Check designs' refocus (final review FR6) */
  onGoToScope?: () => void
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
  progress,
  onScan,
  onCancel,
  compact = false,
  onGoToScope,
}: ScanControlsProps) {
  const nothingSelected = scope === 'selection' && selection.count === 0
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
        </div>
        {scope === 'selection' && (
          <span className="muted selection-text">
            {selectionText(selection)}
          </span>
        )}
      </fieldset>
      {scanning ? (
        <div className="scan-progress" role="status">
          <span>
            {progress
              ? `Scanning ${progress.pageName}${progress.pageCount > 1 ? ` (page ${progress.pageIndex + 1} of ${progress.pageCount})` : ''}, ${progress.nodes} layers`
              : 'Scanning…'}
          </span>
          <Button variant="secondary" size="small" onClick={onCancel}>
            Cancel
          </Button>
        </div>
      ) : (
        <div className="scan-action">
          {compact && onGoToScope && (
            <Button variant="secondary" size="small" onClick={onGoToScope}>
              Go to scope
            </Button>
          )}
          <Button
            size={compact ? 'small' : undefined}
            onClick={onScan}
            disabled={nothingSelected}
          >
            {compact ? 'Scan again' : 'Scan'}
          </Button>
          {nothingSelected && (
            <span className="muted">Select one or more frames first.</span>
          )}
        </div>
      )}
    </div>
  )
}
