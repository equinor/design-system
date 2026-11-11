import { Button, Radio } from '@equinor/eds-core-react/next'
import type { ScanProgress, Scope } from '../../shared/messages'

type ScanControlsProps = {
  scope: Scope
  onScopeChange: (scope: Scope) => void
  scanning: boolean
  progress?: ScanProgress
  onScan: () => void
  onCancel: () => void
}

export function ScanControls({
  scope,
  onScopeChange,
  scanning,
  progress,
  onScan,
  onCancel,
}: ScanControlsProps) {
  return (
    <div className="stack-tight">
      <fieldset className="scope" disabled={scanning}>
        <legend className="section-title">Scope</legend>
        <div className="scope-options">
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
        {!scanning && <Button onClick={onScan}>Scan</Button>}
      </fieldset>
      {scanning && (
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
      )}
    </div>
  )
}
