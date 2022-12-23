param location string = resourceGroup().location
param name string
param originHostName string
param cdnProfileName string

resource cdnendpoint 'Microsoft.Cdn/profiles/endpoints@2022-05-01-preview' = {
  name: '${cdnProfileName}/${name}'
  location: location
  tags: {
    Environment: 'Dev'
  }
  properties: {
    originHostHeader: originHostName
    contentTypesToCompress: [
      'application/eot'
      'application/font'
      'application/font-sfnt'
      'application/javascript'
      'application/json'
      'application/opentype'
      'application/otf'
      'application/pkcs7-mime'
      'application/truetype'
      'application/ttf'
      'application/vnd.ms-fontobject'
      'application/xhtml+xml'
      'application/xml'
      'application/xml+rss'
      'application/x-font-opentype'
      'application/x-font-truetype'
      'application/x-font-ttf'
      'application/x-httpd-cgi'
      'application/x-javascript'
      'application/x-mpegurl'
      'application/x-opentype'
      'application/x-otf'
      'application/x-perl'
      'application/x-ttf'
      'font/eot'
      'font/ttf'
      'font/otf'
      'font/opentype'
      'image/svg+xml'
      'text/css'
      'text/csv'
      'text/html'
      'text/javascript'
      'text/js'
      'text/plain'
      'text/richtext'
      'text/tab-separated-values'
      'text/xml'
      'text/x-script'
      'text/x-component'
      'text/x-java-source'
    ]
    isCompressionEnabled: true
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
    queryStringCachingBehavior: 'IgnoreQueryString'
  }
}
