import FeatureFlags from './../../FeatureFlags'
import { dataset as sanityDataset } from '../../sanity.client'

export const dataset = sanityDataset
export const Flags = FeatureFlags(dataset)
