import {
  forwardRef,
  useContext,
  useRef,
  useState,
  useCallback,
  ReactElement,
  HTMLAttributes,
  cloneElement,
  Children as ReactChildren,
  isValidElement,
} from 'react'
import styled from 'styled-components'
import { mergeRefs } from '@equinor/eds-utils'
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

type StyledProps = {
  $variant?: Variants
  $scrollable?: boolean
}

const StyledTabList = styled.div.attrs(
  (): HTMLAttributes<HTMLDivElement> => ({
    role: 'tablist',
  }),
)<StyledProps>`
  display: grid;
  grid-auto-flow: column;
  grid-auto-columns: ${({ $variant }) => variants[$variant] as VariantsRecord};
  overflow-x: ${({ $scrollable }) => ($scrollable ? 'auto' : 'hidden')};
  scroll-snap-type: x mandatory;
  overscroll-behavior-x: contain;

  @media (prefers-reduced-motion: no-preference) {
    scroll-behavior: smooth;
  }
  @media (hover: none) {
    overflow-x: scroll;
    -webkit-overflow-scrolling: touch;
    scrollbar-width: none;
    & ::-webkit-scrollbar {
      width: 0;
      height: 0;
    }
  }
`

export type TabListProps = HTMLAttributes<HTMLDivElement>

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

  const currentTab = useRef<number>(0)

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

  const Tabs =
    ReactChildren.map(children, (child, $index) => {
      if (!isValidElement(child)) {
        return null
      }

      type ChildPropsWithRef = {
        value?: string | number
        disabled?: boolean
        ref?: React.Ref<HTMLButtonElement>
        [key: string]: unknown
      }

      const childProps = child.props as ChildPropsWithRef
      const controlledActive = childProps.value
      const isActive = controlledActive
        ? controlledActive === activeTab
        : $index === activeTab

      const childRef = childProps?.ref || null
      const tabRef =
        isActive && childRef
          ? mergeRefs<HTMLButtonElement>(childRef, selectedTabRef)
          : isActive
            ? selectedTabRef
            : childRef

      if (isActive) currentTab.current = $index

      return cloneElement(child, {
        id: `${tabsId}-tab-${$index + 1}`,
        'aria-controls': `${tabsId}-panel-${$index + 1}`,
        active: isActive,
        $index,
        onClick: () =>
          handleChange(
            controlledActive !== undefined ? controlledActive : $index,
          ),
        ref: tabRef,
      } as Record<string, unknown>)
    }) ?? []

  const focusableChildren: number[] = Tabs.filter((child: ReactElement) => {
    type ChildPropsWithDisabled = {
      disabled?: boolean
      [key: string]: unknown
    }
    const childProps = child.props as ChildPropsWithDisabled
    return !childProps.disabled
  }).map((child: ReactElement) => {
    type ChildPropsWithIndex = {
      $index?: number
      [key: string]: unknown
    }
    const childProps = child.props as ChildPropsWithIndex
    return childProps.$index
  })

  const firstFocusableChild = focusableChildren[0]
  const lastFocusableChild = focusableChildren[focusableChildren.length - 1]

  const handleTabsChange = (
    direction: 'left' | 'right',
    fallbackTab: number,
  ) => {
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
      $variant={variant}
      $scrollable={scrollable}
    >
      {Tabs}
    </StyledTabList>
  )
})

export { TabList }
