param location string = resourceGroup().location
param profileName string
param endpointName string

@allowed([
  'Standard_Verizon'
  'Premium_Verizon'
])
@description('The storage account sku name.')
param cdnSku string = 'Premium_Verizon'

resource cdnprofile 'Microsoft.Cdn/profiles@2022-11-01-preview' = {
  name: profileName
  location: location
  sku: {
    name: cdnSku
  }
}

var originHostName = '${cdnprofile.name}.blob.${environment().suffixes.storage}'

resource cdnendpoint 'Microsoft.Cdn/profiles/endpoints@2022-05-01-preview' = {
  name: endpointName
  parent: cdnprofile
  location: location
  tags: {
    Environment: 'Prod'
  }
  properties: {
    originHostHeader: originHostName
    isHttpAllowed: false
    isHttpsAllowed: true
    origins: [
      {
        name: replace(originHostName, '.', '-')
        properties: {
          enabled: true
          hostName: originHostName
          httpPort: 80
          httpsPort: 443
        }
      }
    ]
  }
}

