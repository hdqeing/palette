// Web App — Linux container, system-assigned identity, HTTPS only.
// Custom domain (hostNameBindings) and TLS bindings are NOT managed here; see main.bicep note.

@description('Web app name.')
param name string

@description('Azure region.')
param location string

@description('Resource ID of the App Service Plan.')
param serverFarmId string

@description('Full container image reference, e.g. docker.io/org/api:tag.')
param containerImage string

@description('App settings as a name->value map. Key Vault references are allowed as values (they are pointers, not secrets, and safe to commit).')
param appSettings object = {}

@description('Resource tags.')
param tags object = {}

resource site 'Microsoft.Web/sites@2024-11-01' = {
  name: name
  location: location
  tags: tags
  kind: 'app,linux,container'
  identity: {
    type: 'SystemAssigned'
  }
  properties: {
    serverFarmId: serverFarmId
    reserved: true
    httpsOnly: true
    keyVaultReferenceIdentity: 'SystemAssigned'
    publicNetworkAccess: 'Enabled'
    siteConfig: {
      linuxFxVersion: 'DOCKER|${containerImage}'
      alwaysOn: true
      minTlsVersion: '1.2'
      ftpsState: 'FtpsOnly'
      acrUseManagedIdentityCreds: false
      numberOfWorkers: 1
    }
  }
}

// App settings as a SEPARATE child resource. Important: do not also define
// appSettings inside siteConfig above — managing them in two places causes
// deployments to overwrite each other. Keep the image in siteConfig, settings here.
resource appSettingsConfig 'Microsoft.Web/sites/config@2024-11-01' = {
  parent: site
  name: 'appsettings'
  properties: appSettings
}

output id string = site.id
output principalId string = site.identity.principalId
output defaultHostname string = site.properties.defaultHostName
