import React from 'react'

export const Page = ({ doc, children }) => {
  console.log('doc', doc)
  console.log('@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@ ZOMG')
  return (
    <div style={{ backgroundColor: 'green' }} data-testid="page">
      {doc.toc && <div>Stupid</div>}
      {children}
    </div>
  )
}
