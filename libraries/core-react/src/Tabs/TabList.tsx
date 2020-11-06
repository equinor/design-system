import React, {
  forwardRef,
  useContext,
  useRef,
  useCallback,
  useEffect,
  ReactElement,
  HTMLAttributes,
} from 'react'
import styled from 'styled-components'
import { useCombinedRefs } from '../_common/useCombinedRefs'
import { TabsContext } from './Tabs.context'
import { Variants } from './Tabs.types'

type VariantsRecord = {
  fullWidth: string
  minWidth: string
}

const variants: VariantsRecord = {
  fullWidth: 'minmax(1%, 360px)',
  minWidth: 'max-content',
}

type StyledProps = TabListProps

const StyledTabList = styled.div.attrs(
  (): HTMLAttributes<HTMLDivElement> => ({
    role: 'tablist',
  }),
)<StyledProps>`
  display: grid;
  grid-auto-flow: column;
  grid-auto-columns: ${({ variant }) => variants[variant] as VariantsRecord};
`

type TabListProps = {
  /** Sets the width of the tabs */
  variant?: Variants
} & HTMLAttributes<HTMLDivElement>

type TabChild = {
  disabled?: boolean
  index?: number
} & JSX.IntrinsicElements['button'] &
  ReactElement

const TabList = forwardRef<HTMLDivElement, TabListProps>(function TabsList(
  { children = [], ...props },
  ref,
) {
  const {
    activeTab,
    handleChange,
    tabsId,
    variant = 'minWidth',
    tabsFocused,
  } = useContext(TabsContext)

  const currentTab = useRef(activeTab)

  const selectedTabRef = useCallback(
    (node: HTMLElement) => {
      if (node !== null && tabsFocused) {
        node.focus()
      }
    },
    [tabsFocused],
  )

  useEffect(() => {
    currentTab.current = activeTab
  }, [activeTab])

  const Tabs = React.Children.map(
    children,
    (child: TabChild, index: number) => {
      const tabRef =
        index === activeTab
          ? useCombinedRefs(child.ref, selectedTabRef)
          : child.ref

      return React.cloneElement(child, {
        id: `${tabsId}-tab-${index + 1}`,
        'aria-controls': `${tabsId}-panel-${index + 1}`,
        active: index === activeTab,
        index,
        onClick: () => handleChange(index),
        ref: tabRef,
      })
    },
  )

  const focusableChildren: number[] = Tabs.filter((child: TabChild) => {
    const childProps = child.props as TabChild
    return !childProps.disabled
  }).map((child: TabChild) => {
    const childProps = child.props as TabChild
    return childProps.index
  })

  const firstFocusableChild = focusableChildren[0]
  const lastFocusableChild = focusableChildren[focusableChildren.length - 1]

  const handleTabsChange = (direction, fallbackTab) => {
    const i = direction === 'left' ? 1 : -1
    const nextTab =
      focusableChildren[focusableChildren.indexOf(currentTab.current) - i]
    handleChange(nextTab === undefined ? fallbackTab : nextTab)
  }

  const handleKeyPress = (event: React.KeyboardEvent<HTMLDivElement>) => {
    const { key } = event
    if (key === 'ArrowLeft') {
      handleTabsChange('left', lastFocusableChild)
    }
    if (key === 'ArrowRight') {
      handleTabsChange('right', firstFocusableChild)
    }
  }

  return (
    <StyledTabList
      onKeyDown={handleKeyPress}
      ref={ref}
      {...props}
      variant={variant}
    >
      {Tabs}
    </StyledTabList>
  )
})

export { TabList }
