import { BlockStyleDefinition } from 'sanity'

const bigTitle = {
  title: 'Large',
  value: 'normal',
  component: ({ children }: { children: React.ReactNode }) => {
    return <span style={{ fontSize: '42px' }}>{children}</span>
  },
}

export const defaultBannerBigTitletStyle: BlockStyleDefinition[] = [
  bigTitle,
  {
    title: 'Extra Large',
    value: 'extraLarge',
    component: ({ children }: { children: React.ReactNode }) => {
      return <span style={{ fontSize: '56px' }}>{children}</span>
    },
  },
]

export const fiftyFiftyBigTitleStyle: BlockStyleDefinition[] = [bigTitle]
