param hostName string
param cdnEndpointName string

var name = replace(hostName, '.', '-')

resource customdomainprod 'Microsoft.Cdn/profiles/endpoints/customDomains@2022-11-01-preview' = {
  name: '${cdnEndpointName}/${name}'
  properties: {
    hostName: hostName
  }
}

/* resource example_wildcard_2019 'Microsoft.Cdn/profiles/secrets@2022-11-01-preview' = {
  name: 'KeyVault1'
  properties: {
    parameters: {
      type: 'CustomerCertificate'
      certificateAuthority: 'OU=http://certs.godaddy.com/repository/'
      secretSource: {
        id: '/subscriptions/xxxxxxxxxxxxxxxxxxxxxx/resourceGroups/BIBProdPSEARG01/providers/Microsoft.KeyVault/vaults/xxxxxxxx/certificates/certName/xxxxxxxxxxxxxxxxxxxxxxxxxx'
      }
      secretVersion: ''
      subjectAlternativeNames: [
        '*.example.com'
        'example.com'
      ]
      useLatestVersion: false
    }
  }
  dependsOn: [
    test_researchcdn_example_com
  ]

}
 */
