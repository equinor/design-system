import { Button, Icon } from '@equinor/eds-core-react/next'
import { add, download } from '@equinor/eds-icons'

export function PageHeader() {
  return (
    <div className="page-header">
      <div className="page-header-text">
        <h1 className="title">People</h1>
        <p className="intro">
          Everyone with access to the field data for Johan Sverdrup. Select
          people in the table to review or change their access, or add someone
          new.
        </p>
      </div>
      <div className="actions">
        <Button variant="secondary">
          <Icon data={download} />
          Export
        </Button>
        <Button variant="primary">
          <Icon data={add} />
          Add person
        </Button>
      </div>
    </div>
  )
}
