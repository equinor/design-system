@description('Specifies the Azure location where the key vault should be created.')
param location string = resourceGroup().location

resource keyVault 'Microsoft.KeyVault/vaults@2022-07-01' = {
  name: 'kv-eds'
  location: location
  properties: {
    sku: {
      family: 'A'
      name: 'standard'
    }
    tenantId: subscription().tenantId

    enableRbacAuthorization: true // Using RBAC for access control
    accessPolicies: [
      {
        objectId: '8e3af657-a8ff-443c-a75c-2fe8c4bcb635'
        tenantId: subscription().tenantId
        permissions: {
          secrets: [
            'all'
          ]
          certificates: [
            'all'
          ]
          keys: [
            'all'
          ]
        }
      }
    ]

    enabledForDeployment: true // VMs can retrieve certificates
    enabledForTemplateDeployment: true // ARM can retrieve values

    enablePurgeProtection: true // Not allowing to purge key vault or its objects after deletion
    enableSoftDelete: true
    softDeleteRetentionInDays: 7
    createMode: 'default' // Creating or updating the key vault (not recovering)
  }
}
