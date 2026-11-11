import { useState } from 'react'
import { Banner, Button } from '@equinor/eds-core-react/next'
import type { Command, DevExportFile } from '../../../../src/shared/messages'
import { send } from '../figma'
import { copyText, downloadText } from '../output'

type DevExportProps = {
  files: DevExportFile[]
  notes: string[]
  command: Command
}

function ExportedFile({ file }: { file: DevExportFile }) {
  const { fileName, path, json } = file
  const [status, setStatus] = useState<string>()

  const copy = async () => {
    const copied = await copyText(json)
    setStatus(copied ? 'Copied' : 'Copy failed; select the text below')
    send({
      type: 'notify',
      message: copied ? `${fileName} copied` : 'Copy failed',
    })
  }
  const download = () => {
    setStatus(
      downloadText(fileName, json) ? 'Download started' : 'Download failed',
    )
  }

  return (
    <section className="export-file" aria-labelledby={`export-${fileName}`}>
      <div className="export-file-header">
        <h2 id={`export-${fileName}`} className="section-title">
          {fileName}
        </h2>
        <div className="export-file-actions">
          <Button size="small" variant="secondary" onClick={copy}>
            Copy
          </Button>
          <Button size="small" variant="secondary" onClick={download}>
            Download
          </Button>
        </div>
      </div>
      <p className="muted">
        Replace <code>{path}</code> with it, then run the tests.
        {status && <span role="status"> {status}.</span>}
      </p>
      <textarea
        className="export-json"
        readOnly
        value={json}
        aria-label={`${fileName} contents`}
        rows={10}
      />
    </section>
  )
}

/** The output of the developer commands: the inventories, or the scan of a frame as a fixture. */
export function DevExport({ files, notes, command }: DevExportProps) {
  return (
    <div className="stack">
      {notes.map((note) => (
        <Banner key={note} tone="warning">
          <Banner.Message>{note}</Banner.Message>
        </Banner>
      ))}
      {files.map((file) => (
        <ExportedFile key={file.fileName} file={file} />
      ))}
      <Button
        variant="ghost"
        onClick={() =>
          send({
            type:
              command === 'dev-export-fixture'
                ? 'run-dev-export-fixture'
                : 'run-dev-export-inventory',
          })
        }
      >
        Export again
      </Button>
    </div>
  )
}
