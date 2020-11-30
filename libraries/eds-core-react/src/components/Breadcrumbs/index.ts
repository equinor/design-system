import { Breadcrumbs as BaseComponent, BreadcrumbsProps } from './Breadcrumbs'
import { Breadcrumb } from './Breadcrumb'

type BreadcrumbsCompoundProps = typeof BaseComponent & {
  Breadcrumb: typeof Breadcrumb
}

const Breadcrumbs = BaseComponent as BreadcrumbsCompoundProps

Breadcrumbs.Breadcrumb = Breadcrumb

export { Breadcrumbs }
export type { BreadcrumbsProps }
