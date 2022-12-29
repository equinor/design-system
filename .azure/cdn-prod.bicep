param location string = resourceGroup().location
param profileName string
param endpointName string
param hostName string
param vaultName string
param certificateName string

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

var customDomainName = replace(hostName, '.', '-')

resource customdomainprod 'Microsoft.Cdn/profiles/endpoints/customDomains@2022-11-01-preview' = {
  name: customDomainName
  parent: cdnendpoint
  properties: {
    hostName: hostName
  }
}

// Resource reference to the Azure Key Vault certificate. Expected to be in format of /subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/Microsoft.KeyVault/vaults/{vaultName}/secrets/{certificateName}
//var certificateId = '/subscriptions/${subscription().id}/resourceGroups/${resourceGroup().name}/providers/Microsoft.KeyVault/vaults/${vaultName}/secrets/${certificateName}'

// Expect certificate to exist
resource certificate 'Microsoft.KeyVault/vaults/secrets@2022-07-01' existing = {
  name: '${vaultName}/${certificateName}'
}

resource certificateprod 'Microsoft.Cdn/profiles/secrets@2022-11-01-preview' = {
  name: 'certificateProd'
  parent: cdnprofile
  properties: {
    parameters: {
      type: 'CustomerCertificate'
      secretSource: {
        id: certificate.id
      }
      useLatestVersion: true
    }
  }
}
