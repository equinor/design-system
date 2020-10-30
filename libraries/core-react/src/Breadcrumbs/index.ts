import { Breadcrumbs as BaseComponent } from './Breadcrumbs'
import { Breadcrumb } from './Breadcrumb'

type BreadcrumbsProps = typeof BaseComponent & {
  Breadcrumb: typeof Breadcrumb
}

const Breadcrumbs = BaseComponent as BreadcrumbsProps

Breadcrumbs.Breadcrumb = Breadcrumb

export { Breadcrumbs, BreadcrumbsProps }
