// This file needs to be run when subscription is new. With owner rights.
// az account set --subscription 918bb82f-406f-4a8b-b12e-fe2559a56dbc
// az deployment sub create --location northeurope --name customContributor --template-file initial-role-setup.bicep

targetScope = 'subscription'

@description('Array of actions for the roleDefinition')
param actions array = [
  '*'
]

@description('Array of notActions for the roleDefinition')
param notActions array = [
  'Microsoft.Authorization/*/Delete'
  'Microsoft.Authorization/elevateAccess/Action'
  'Microsoft.Blueprint/blueprintAssignments/write'
  'Microsoft.Blueprint/blueprintAssignments/delete'
  'Microsoft.Compute/galleries/share/action'
]

@description('Friendly name of the role definition')
param roleName string = 'Custom Contributor'

@description('Detailed description of the role definition')
param roleDescription string = 'Contributor with permission to do role assignements'

var roleDefName = guid(subscription().id, string(actions), string(notActions))

resource roleDef 'Microsoft.Authorization/roleDefinitions@2022-04-01' = {
  name: roleDefName
  properties: {
    roleName: roleName
    description: roleDescription
    type: 'customRole'
    permissions: [
      {
        actions: actions
        notActions: notActions
      }
    ]
    assignableScopes: [
      subscription().id
    ]
  }
}
