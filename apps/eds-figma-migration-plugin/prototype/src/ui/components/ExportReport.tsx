import { useState } from 'react'
import { Button, Dialog } from '@equinor/eds-core-react/next'
import type { Report } from '../../../../src/scan/report'

type ExportReportProps = {
  report?: Report
  onRequest: () => void
  onClose: () => void
  /** False when the report is opened from the settings menu */
  showButton?: boolean
}

function download(text: string, fileName: string, type: string) {
  const url = URL.createObjectURL(new Blob([text], { type }))
  const link = document.createElement('a')
  link.href = url
  link.download = fileName
  document.body.appendChild(link)
  link.click()
  link.remove()
  setTimeout(() => URL.revokeObjectURL(url), 1000)
}

/** Copies text; the clipboard API is not always allowed in a plugin window, so a hidden text area is the fallback. */
async function copy(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text)
    return true
  } catch {
    const area = document.createElement('textarea')
    area.value = text
    area.setAttribute('readonly', '')
    area.style.position = 'fixed'
    area.style.opacity = '0'
    document.body.appendChild(area)
    area.select()
    const done = document.execCommand('copy')
    area.remove()
    return done
  }
}

/**
 * Export report: Markdown for people, CSV for a spreadsheet. A download is
 * offered first; copying the Markdown works where downloads from the plugin
 * window are blocked.
 */
export function ExportReport({
  report,
  onRequest,
  onClose,
  showButton = true,
}: ExportReportProps) {
  const [copied, setCopied] = useState<boolean>()
  return (
    <>
      {showButton && (
        <Button variant="ghost" size="small" onClick={onRequest}>
          Export report
        </Button>
      )}
      <Dialog
        open={report !== undefined}
        onOpenChange={(open) => {
          if (!open) {
            setCopied(undefined)
            onClose()
          }
        }}
      >
        {report && (
          <>
            <Dialog.Header>
              <Dialog.Title>Export report</Dialog.Title>
            </Dialog.Header>
            <Dialog.Content>
              <p className="muted">
                The Markdown report has the health, every frame, the bindings
                that need a check or have no equivalent, and the instances with
                legacy variables. The CSV has one row per binding.
              </p>
              <pre className="report-preview">
                {report.markdown.split('\n').slice(0, 14).join('\n')}
              </pre>
              {copied !== undefined && (
                <p className="muted" role="status">
                  {copied
                    ? 'The Markdown report is copied.'
                    : 'The report could not be copied. Download it instead.'}
                </p>
              )}
            </Dialog.Content>
            <Dialog.Actions>
              <Button
                variant="ghost"
                onClick={async () => setCopied(await copy(report.markdown))}
              >
                Copy Markdown
              </Button>
              <Button
                variant="secondary"
                onClick={() =>
                  download(report.csv, `${report.baseName}.csv`, 'text/csv')
                }
              >
                Download CSV
              </Button>
              <Button
                onClick={() =>
                  download(
                    report.markdown,
                    `${report.baseName}.md`,
                    'text/markdown',
                  )
                }
              >
                Download Markdown
              </Button>
            </Dialog.Actions>
          </>
        )}
      </Dialog>
    </>
  )
}
