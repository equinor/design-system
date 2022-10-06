param location string

targetScope = 'subscription'

resource rg 'Microsoft.Resources/resourceGroups@2021-04-01' = {
  name: 'rg-eds'
  location: location
}

module stg './storybook.bicep' = {
  name: 'storageDeployment'
  scope: rg
  params: {
    storageAccountName: 'st-storybook'
    location: location
  }
}

module kv './keyvault.bicep' = {
  name: 'keyVaultDeployment'
  scope: rg
  params: {
    location: location
  }
}
