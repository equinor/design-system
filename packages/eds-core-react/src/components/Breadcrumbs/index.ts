import { Breadcrumbs as BaseComponent, BreadcrumbsProps } from './Breadcrumbs'
import { Breadcrumb, BreadcrumbProps } from './Breadcrumb'

type BreadcrumbsCompoundProps = typeof BaseComponent & {
  Breadcrumb: typeof Breadcrumb
}

const Breadcrumbs = BaseComponent as BreadcrumbsCompoundProps

Breadcrumbs.Breadcrumb = Breadcrumb

Breadcrumbs.Breadcrumb.displayName = 'Breadcrumbs.Breadcrumb'

export { Breadcrumbs, Breadcrumb }
export type { BreadcrumbsProps, BreadcrumbProps }
