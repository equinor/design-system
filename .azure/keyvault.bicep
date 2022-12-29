@description('Specifies the Azure location where the key vault should be created.')
param location string = resourceGroup().location
param name string
/* param adminRoleId string
param principalId string */

resource keyVault 'Microsoft.KeyVault/vaults@2022-07-01' = {
  name: name
  location: location
  properties: {
    sku: {
      family: 'A'
      name: 'standard'
    }
    tenantId: subscription().tenantId

    enableRbacAuthorization: true // Using RBAC for access control

    enabledForDeployment: true // VMs can retrieve certificates
    enabledForTemplateDeployment: true // ARM can retrieve values

    enablePurgeProtection: true // Not allowing to purge key vault or its objects after deletion
    enableSoftDelete: true
    softDeleteRetentionInDays: 7
    createMode: 'default' // Creating or updating the key vault (not recovering)
  }
}

output name string = keyVault.name

/* resource roleDefinition 'Microsoft.Authorization/roleDefinitions@2022-04-01' existing = {
  scope: resourceGroup()
  name: adminRoleId
}

resource RoleAssignment 'Microsoft.Authorization/roleAssignments@2022-04-01' = {
  name: guid(location, name, adminRoleId, principalId)
  properties: {
    roleDefinitionId: roleDefinition.id
    principalId: principalId
    principalType: 'User'
  }
}
 */
