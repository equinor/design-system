import React, { createContext } from 'react'

const AccordionContext = createContext({
  headerLevel: '',
  chevronPosition: '',
})

const AccordionProvider = AccordionContext.Provider
const AccordionConsumer = AccordionContext.Consumer

export { AccordionContext, AccordionProvider, AccordionConsumer }
