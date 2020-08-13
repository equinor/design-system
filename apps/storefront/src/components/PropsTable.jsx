import React from 'react'
import PropTypes from 'prop-types'
import RDPropsTable from 'react-docgen-props-table'

const PropsTable = ({ props }) => {
  return <RDPropsTable props={props}></RDPropsTable>
}

PropsTable.propTypes = {
  props: PropTypes.object.isRequired,
}

export default PropsTable // eslint-disable-line
