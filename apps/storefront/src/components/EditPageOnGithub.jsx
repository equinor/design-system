import React from 'react'
import PropTypes from 'prop-types'
import { useThemeUI } from 'theme-ui'

export const EditPageOnGithub = ({ slug }) => {
  const context = useThemeUI()
  const { theme } = context

  return (
    <a
      href={`https://github.com/equinor/design-system/blob/develop/apps/storefront/${slug}`}
      style={{
        display: 'block',
        marginTop: '3rem',
        color: theme.colors.primary,
      }}
    >
      <span role="img" aria-label="Pencil">
        ✏️
      </span>{' '}
      Edit this page on GitHub
    </a>
  )
}

EditPageOnGithub.propTypes = {
  slug: PropTypes.string.isRequired,
}
