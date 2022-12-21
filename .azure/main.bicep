param location string

targetScope = 'subscription'

resource rgdev 'Microsoft.Resources/resourceGroups@2021-04-01' = {
  name: 'S478-rg-eds-dev'
  location: location
}

resource rgprod 'Microsoft.Resources/resourceGroups@2021-04-01' = {
  name: 'S478-rg-eds-prod'
  location: location
}

module storagedev './storage-account-webenabled.bicep' = {
  name: 'S478stedsdev'
  scope: rgdev
  params: {
    storageAccountName: 'edsstorybookdev'
    location: location
  }
}

module storageprod './storage-account-webenabled.bicep' = {
  name: 'S478stedsprod'
  scope: rgprod
  params: {
    storageAccountName: 'edsstorybookprod'
    location: location
  }
}

module storagelabs './storage-account-webenabled.bicep' = {
  name: 'S478stedsprodlabs'
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
    name: 'S478-kv-eds-dev'
    /* adminRoleId: '00482a5a-887f-4fb3-b363-3b7fe8e74483'
    principalId: '7edc6ba6-04f6-4111-91ab-27a91ce2f4cc' */
  }
}

module kvprod './keyvault.bicep' = {
  name: 'keyVaultProdDeployment'
  scope: rgprod
  params: {
    location: location
    name: 'S478-kv-eds-prod'
    /*  adminRoleId: '00482a5a-887f-4fb3-b363-3b7fe8e74483'
    principalId: '7edc6ba6-04f6-4111-91ab-27a91ce2f4cc' */
  }
}
