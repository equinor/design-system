import React, { FC, useState } from 'react'
import { usePopper, Manager, Popper, Reference  } from 'react-popper'


export const BasicPopper () =>  {
    return(
      <Manager>
        <Reference>{({ ref }) => <div ref={ref}>Reference element</div>}</Reference>
          <Popper>
            {({ ref, style }) => (
              <div ref={ref} style={style}>
                foo bar
              </div>
            )}
          </Popper>
      </Manager>
    )
  };


export const Hook: FC = () => {
  const [referenceElement, setReferenceElement] = useState(null)
  const [popperElement, setPopperElement] = useState(null)
  const [arrowElement, setArrowElement] = useState(null)

  const { styles, attributes } = usePopper(referenceElement, popperElement, {
    modifiers: [{ name: 'arrow', options: { element: arrowElement } }],
  })

  return (
    <>
      <button type="button" ref={setReferenceElement as any}>
        Hook ref
      </button>

      <div
        ref={setPopperElement as any}
        style={styles.popper}
        {...attributes.popper}
      >
        Hook element
        <div ref={setArrowElement as any} style={styles.arrow} />
      </div>
    </>
  )
}
