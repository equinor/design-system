param location string

targetScope = 'subscription'

resource rgdev 'Microsoft.Resources/resourceGroups@2021-04-01' = {
  name: 'rg-eds-dev'
  location: location
}

resource rgprod 'Microsoft.Resources/resourceGroups@2021-04-01' = {
  name: 'rg-eds-prod'
  location: location
}

module storagedev './storage-account-webenabled.bicep' = {
  name: 'storageDeploymentDev'
  scope: rgdev
  params: {
    storageAccountName: 'edsstorybookdev'
    location: location
  }
}

module storageprod './storage-account-webenabled.bicep' = {
  name: 'storageDeploymentProd'
  scope: rgprod
  params: {
    storageAccountName: 'edsstorybookprod'
    location: location
  }
}

module storagelabs './storage-account-webenabled.bicep' = {
  name: 'storageDeploymentLabs'
  scope: rgprod
  params: {
    storageAccountName: 'edsstorybooklabs'
    location: location
  }
}

module kvdev './keyvault.bicep' = {
  name: 'keyVaultDevDeployment'
  scope: rgdev
  params: {
    location: location
    name: 'kv-eds-dev'
    /* adminRoleId: '00482a5a-887f-4fb3-b363-3b7fe8e74483'
    principalId: '7edc6ba6-04f6-4111-91ab-27a91ce2f4cc' */
  }
}

module kvprod './keyvault.bicep' = {
  name: 'keyVaultProdDeployment'
  scope: rgprod
  params: {
    location: location
    name: 'kv-eds-prod'
    /*  adminRoleId: '00482a5a-887f-4fb3-b363-3b7fe8e74483'
    principalId: '7edc6ba6-04f6-4111-91ab-27a91ce2f4cc' */
  }
}
