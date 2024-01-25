import BrandmasterPlugin from './src/BrandmasterAssetSource'
import Icon from './src/Icon'
import { definePlugin } from 'sanity'
import type { AssetSource } from 'sanity'

const plugin = {
  icon: Icon,
  name: 'brandmaster',
  title: 'Brandmaster',
  component: BrandmasterPlugin,
}

export const BrandmasterAssetSource = definePlugin({
  name: 'brandmaster',
  form: {
    file: {
      assetSources: (prev) => [...prev, plugin as AssetSource],
    },
    image: {
      assetSources: (prev) => [...prev, plugin as AssetSource],
    },
  },
})
