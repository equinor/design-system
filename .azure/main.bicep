param location string = resourceGroup().location

module kv './keyvault.bicep' = {
  name: 'keyVaultDeployment'
  params: {
    location: location
  }
}
