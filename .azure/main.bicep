param location string

targetScope = 'subscription'

resource rg 'Microsoft.Resources/resourceGroups@2021-04-01' = {
  name: 'rg-eds'
  location: location
}

module storagedev './storage-account-webenabled.bicep' = {
  name: 'storageDeploymentDev'
  scope: rg
  params: {
    storageAccountName: 'dev'
    location: location
  }
}

module storageprod './storage-account-webenabled.bicep' = {
  name: 'storageDeploymentProd'
  scope: rg
  params: {
    storageAccountName: 'prod'
    location: location
  }
}
module storagelabs './storage-account-webenabled.bicep' = {
  name: 'storageDeploymentLabs'
  scope: rg
  params: {
    storageAccountName: 'labs'
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
