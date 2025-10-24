import React, { type ReactNode } from 'react'
import SearchBar from '@theme-original/SearchBar'
import styles from './SearchBar.module.css'

export default function SearchBarWrapper(): ReactNode {
  return (
    <>
      <div className={`search-bar ${styles.searchMainContainer}`}>
        <SearchBar />
      </div>
    </>
  )
}
