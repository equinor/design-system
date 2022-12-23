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

module ststorybookdev './storage-account-webenabled.bicep' = {
  name: 'stStrybookDev'
  scope: rgdev
  params: {
    storageAccountName: 's478stedsstorybookdev'
    location: location
  }
}

module ststorybookprod './storage-account-webenabled.bicep' = {
  name: 'stStorybookProd'
  scope: rgprod
  params: {
    storageAccountName: 's478stedsstorybookprod'
    location: location
  }
}

module ststorybooklabs './storage-account-webenabled.bicep' = {
  name: 'stStorybookLabs'
  scope: rgprod
  params: {
    storageAccountName: 's478stedsstorybooklabs'
    location: location
  }
}

module startefactsdev './storage-account.bicep' = {
  name: 'stArtefacstDev'
  scope: rgdev
  params: {
    storageAccountName: 's478stedsartefactsdev'
    location: location
  }
}

module blobartefactsdev 'blob-storage.bicep' = {
  name: 'blobArtefactsDev'
  scope: rgdev
  dependsOn: [ startefactsdev ]
  params: {
    name: 'eds-artefacts-dev'
    storageAccountName: startefactsdev.outputs.name
  }
}

module cdnprofileartefactsdev 'cdn-profile.bicep' = {
  name: 'cdnProfileArtefactsDev'
  scope: rgdev
  dependsOn: [ blobartefactsdev ]
  params: {
    name: 'S478-afd-edsartefacts-dev'
    location: 'Global'
  }
}

module cdneartefactsdev 'cdn-endpoint.bicep' = {
  name: 'cdneArtefactsDev'
  scope: rgdev
  dependsOn: [ blobartefactsdev, cdnprofileartefactsdev ]
  params: {
    location: 'Global'
    name: 'S478-cdne-edsartefacts-dev'
    cdnProfileName: cdnprofileartefactsdev.outputs.name
    origin: 'https://${startefactsdev.outputs.name}.blob.${environment()}'
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
