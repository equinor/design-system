param location string = resourceGroup().location
param name string

@allowed([
  'Standard_Microsoft'
  'Standard_Verizon'
  'Premium_Verizon'
])
@description('The storage account sku name.')
param cdnSku string = 'Standard_Microsoft'

resource cdnprofile 'Microsoft.Cdn/profiles@2022-11-01-preview' = {
  name: name
  location: location
  sku: {
    name: cdnSku
  }
}

output name string = cdnprofile.name
