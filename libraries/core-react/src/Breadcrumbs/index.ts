import { Breadcrumbs as BaseComponent } from './Breadcrumbs'
import { Breadcrumb } from './Breadcrumb'

type BreadcrumbsTypes = typeof BaseComponent & {
  Breadcrumb: typeof Breadcrumb
}

const Breadcrumbs = BaseComponent as BreadcrumbsTypes

Breadcrumbs.Breadcrumb = Breadcrumb

export { Breadcrumbs }
