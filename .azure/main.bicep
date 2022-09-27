param location string

targetScope = 'subscription'

resource rg 'Microsoft.Resources/resourceGroups@2021-04-01' = {
  name: 'rg-eds'
  location: location
}

module stg './storage.bicep' = {
  name: 'storageDeployment'
  scope: rg
  params: {
    storageAccountName: 'steds'
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
