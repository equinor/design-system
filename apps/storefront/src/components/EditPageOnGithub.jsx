import React from 'react'
import PropTypes from 'prop-types'
import { useThemeUI } from 'theme-ui'
import { Icon } from '@equinor/eds-core-react'
import { edit_text } from '@equinor/eds-icons'
import styled from 'styled-components'

Icon.add({ edit_text })

const Link = styled.a`
  display: flex;
  align-items: center;
  margin-top: 3rem;
  color: ${(props) => props.color || '#007079'};

  & > svg {
    margin-right: 8px;
  }
`

export const EditPageOnGithub = ({ slug }) => {
  const context = useThemeUI()
  const { theme } = context

  return (
    <Link
      color={theme.colors.primary}
      href={`https://github.com/equinor/design-system/blob/develop/apps/storefront/${slug}`}
    >
      <Icon name="edit_text" size={16} />
      Edit this page on GitHub
    </Link>
  )
}

EditPageOnGithub.propTypes = {
  slug: PropTypes.string.isRequired,
}
