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
    storageAccountName: 'edsstorybookdev'
    location: location
  }
}

module storageprod './storage-account-webenabled.bicep' = {
  name: 'storageDeploymentProd'
  scope: rg
  params: {
    storageAccountName: 'edsstorybookprod'
    location: location
  }
}

module storagelabs './storage-account-webenabled.bicep' = {
  name: 'storageDeploymentLabs'
  scope: rg
  params: {
    storageAccountName: 'edsstorybooklabs'
    location: location
  }
}

module kvtest './keyvault.bicep' = {
  name: 'keyVaultTestDeployment'
  scope: rg
  params: {
    location: location
    name: 'kv-eds-test'
    adminRoleId: '00482a5a-887f-4fb3-b363-3b7fe8e74483'
    principalId: '7edc6ba6-04f6-4111-91ab-27a91ce2f4cc'
  }
}

module kvprod './keyvault.bicep' = {
  name: 'keyVaultProdDeployment'
  scope: rg
  params: {
    location: location
    name: 'kv-eds-prod'
    adminRoleId: '00482a5a-887f-4fb3-b363-3b7fe8e74483'
    principalId: '7edc6ba6-04f6-4111-91ab-27a91ce2f4cc'
  }
}
