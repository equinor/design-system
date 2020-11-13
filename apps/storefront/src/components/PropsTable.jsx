import React from 'react'

// @TODO: This is the version used before the Typescript migration.
// In theory docz support typescript by adding a typescript: true flag to docz config.
// This didn't work out of the box, at least not when the typescript version of react-core
// is not published on npm.
// We should rewrite to use docz Props component, and test it with the Typescript version
// For the time being we just provide a link to the storybook
/* import PropTypes from 'prop-types'
import RDPropsTable from 'react-docgen-props-table'

const PropsTable = ({ props }) => {
  return <RDPropsTable props={props}></RDPropsTable>
}

PropsTable.propTypes = {
  props: PropTypes.object.isRequired,
} */

const PropsTable = () => {
  return (
    <p>
      Looking for the API table of available props? We got you covered in the{' '}
      <a href="https://eds-storybook-react.azurewebsites.net/">Storybook</a> 👏{' '}
    </p>
  )
}

export default PropsTable // eslint-disable-line
