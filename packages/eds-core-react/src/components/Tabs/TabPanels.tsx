import {
  forwardRef,
  ReactElement,
  useContext,
  HTMLAttributes,
  cloneElement,
  Children as ReactChildren,
} from 'react'
import { TabsContext } from './Tabs.context'

export type TabPanelsProps = {
  conditionalRender?: boolean
} & HTMLAttributes<HTMLDivElement>

const TabPanels = forwardRef<HTMLDivElement, TabPanelsProps>(function TabPanels(
  { children, conditionalRender, ...props },
  ref,
) {
  const { activeTab, tabsId } = useContext(TabsContext)

  const Panels = ReactChildren.map(children, (child: ReactElement, $index) => {
    if (conditionalRender && activeTab !== $index) return null
    return cloneElement(child, {
      id: `${tabsId}-panel-${$index + 1}`,
      'aria-labelledby': `${tabsId}-tab-${$index + 1}`,
      hidden: activeTab !== $index,
    })
  })

  return (
    <div ref={ref} {...props}>
      {Panels}
    </div>
  )
})

export { TabPanels }
