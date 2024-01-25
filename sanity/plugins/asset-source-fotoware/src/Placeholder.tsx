import { forwardRef } from 'react'
import { ErrorMessage } from './components'

const PlacholderAssetSource = forwardRef<HTMLDivElement>((props: any, ref) => {
  const { onClose } = props
  return (
    <ErrorMessage onClose={onClose} ref={ref}>
      <p>This feature is not (yet) available in this studio. Please contact support if this is unexpected.</p>
    </ErrorMessage>
  )
})

PlacholderAssetSource.displayName = 'PlacholderAssetSource'

export default PlacholderAssetSource
