import {
  forwardRef,
  useContext,
  useRef,
  useState,
  useCallback,
  useEffect,
  ReactElement,
  HTMLAttributes,
  ButtonHTMLAttributes,
  RefAttributes,
  cloneElement,
  Children as ReactChildren,
} from 'react'
import styled from 'styled-components'
import { useCombinedRefs } from '@equinor/eds-utils'
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
  overflow-x: ${({ scrollable }) => (scrollable ? 'auto' : 'hidden')};
  scroll-snap-type: x mandatory;
  overscroll-behavior-x: contain;

  @media (prefers-reduced-motion: no-preference) {
    scroll-behavior: smooth;
  }
  @media (hover: none) {
    overflow-x: scroll;
    -webkit-overflow-scrolling: touch;
    scrollbar-width: 0;
    & ::-webkit-scrollbar {
      width: 0;
      height: 0;
    }
  }
`

export type TabListProps = {
  /** Sets the width of the tabs */
  variant?: Variants
  /** adds scrollbar if tabs overflow on non-touch devices */
  scrollable?: boolean
} & HTMLAttributes<HTMLDivElement>

type TabChild = {
  disabled?: boolean
  index?: number
} & ButtonHTMLAttributes<HTMLButtonElement> &
  RefAttributes<HTMLButtonElement> &
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
    scrollable = false,
    tabsFocused,
  } = useContext(TabsContext)

  const currentTab = useRef(activeTab)

  const [arrowNavigating, setArrowNavigating] = useState(false)
  const selectedTabRef = useCallback(
    (node: HTMLElement) => {
      if (
        (node !== null && tabsFocused) ||
        (node !== null && arrowNavigating)
      ) {
        setArrowNavigating(false)
        node.focus()
      }
    },
    [arrowNavigating, tabsFocused],
  )

  useEffect(() => {
    currentTab.current = activeTab
  }, [activeTab])

  const Tabs = ReactChildren.map(children, (child: TabChild, index: number) => {
    const tabRef =
      index === activeTab
        ? // eslint-disable-next-line react-hooks/rules-of-hooks
          useCombinedRefs<HTMLButtonElement>(child.ref, selectedTabRef)
        : child.ref

    return cloneElement(child, {
      id: `${tabsId}-tab-${index + 1}`,
      'aria-controls': `${tabsId}-panel-${index + 1}`,
      active: index === activeTab,
      index,
      onClick: () => handleChange(index),
      ref: tabRef,
    })
  })

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
    setArrowNavigating(true)
    handleChange(nextTab === undefined ? fallbackTab : nextTab)
  }

  const handleKeyPress = (event: React.KeyboardEvent<HTMLDivElement>) => {
    const { key } = event
    if (key === 'ArrowLeft') {
      event.preventDefault()
      handleTabsChange('left', lastFocusableChild)
    }
    if (key === 'ArrowRight') {
      event.preventDefault()
      handleTabsChange('right', firstFocusableChild)
    }
  }

  return (
    <StyledTabList
      onKeyDown={handleKeyPress}
      ref={ref}
      {...props}
      variant={variant}
      scrollable={scrollable}
    >
      {Tabs}
    </StyledTabList>
  )
})

export { TabList }
