import { add, download } from '@equinor/eds-icons'
import { classNames, type Styles } from './classNames'
import { Icon } from './Icon'

export function PageHeader({ styles }: { styles: Styles }) {
  const c = classNames(styles)

  return (
    <div className={c('page-header')}>
      <div className={c('page-header-text')}>
        <h1 className={c('title')}>People</h1>
        <p className={c('intro')}>
          Everyone with access to the field data for Johan Sverdrup. Select
          people in the table to review or change their access, or add someone
          new.
        </p>
      </div>
      <div className={c('actions')}>
        <button type="button" className={c('button')} data-variant="secondary">
          <Icon data={download} />
          Export
        </button>
        <button type="button" className={c('button')} data-variant="primary">
          <Icon data={add} />
          Add person
        </button>
      </div>
    </div>
  )
}
