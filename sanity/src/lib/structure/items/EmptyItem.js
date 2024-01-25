import { error_outlined } from '@equinor/eds-icons'
import { EdsIcon } from '../../../../icons'

export const EmptyItem = (S) =>
  S.listItem()
    .icon(() => EdsIcon(error_outlined))
    .title('NOT FOUND')
