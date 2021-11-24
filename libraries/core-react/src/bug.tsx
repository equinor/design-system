import { useState } from 'react'
import { Story } from '@storybook/react'
import { RadioProps, EdsProviderProps } from '.'

export const Compact: Story<RadioProps> = () => {
  const [density, setDensity] = useState<EdsProviderProps['density']>(
    'comfortable',
  )
}
