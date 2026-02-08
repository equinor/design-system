'use client'

import { Button, Search, Accordion } from '@equinor/eds-core-react'
import { add } from '@equinor/eds-icons'
import { Icon } from '@equinor/eds-core-react'
import { useState } from 'react'
import './component-sidebar.css'

Icon.add({ add })

type ComponentCategory = {
  title: string
  items: { label: string; href?: string; active?: boolean }[]
}

type ComponentSidebarProps = {
  categories: ComponentCategory[]
  onRequestComponent?: () => void
}

export const ComponentSidebar = ({
  categories,
  onRequestComponent,
}: ComponentSidebarProps) => {
  const [searchQuery, setSearchQuery] = useState('')

  return (
    <aside className="component-sidebar">
      <div className="sidebar-request">
        <Button
          variant="outlined"
          onClick={onRequestComponent}
          fullWidth
        >
          <Icon data={add} size={16} />
          Request Missing Components
        </Button>
      </div>

      <div className="sidebar-search">
        <Search
          placeholder="Search components"
          value={searchQuery}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            setSearchQuery(e.target.value)
          }
        />
      </div>

      <nav className="sidebar-nav">
        {categories.map((category) => (
          <Accordion key={category.title} className="sidebar-accordion">
            <Accordion.Item>
              <Accordion.Header>{category.title}</Accordion.Header>
              <Accordion.Panel>
                <ul className="sidebar-items">
                  {category.items.map((item) => (
                    <li
                      key={item.label}
                      className={item.active ? 'active' : ''}
                    >
                      {item.href ? (
                        <a href={item.href}>{item.label}</a>
                      ) : (
                        <span>{item.label}</span>
                      )}
                    </li>
                  ))}
                </ul>
              </Accordion.Panel>
            </Accordion.Item>
          </Accordion>
        ))}
      </nav>
    </aside>
  )
}
