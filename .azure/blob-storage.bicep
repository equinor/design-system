param storageAccountName string
param name string

resource container 'Microsoft.Storage/storageAccounts/blobServices/containers@2022-09-01' = {
  name: '${storageAccountName}/${name}'
  properties: {
    publicAccess: 'None'
    metadata: {}
  }
}

output name string = container.name
