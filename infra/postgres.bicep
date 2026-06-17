// PostgreSQL Flexible Server.
// NOTE: server parameters (the ~570 "configurations" resources in the export) are
// deliberately omitted — those are server defaults and should not be managed in code.
// Only add a configuration resource for a parameter you have intentionally changed.

@description('Server name.')
param name string

@description('Azure region.')
param location string

@description('Administrator login name.')
param administratorLogin string

@description('Administrator password. Pass via secure parameter — never hardcode or commit.')
@secure()
param administratorPassword string

@description('PostgreSQL major version.')
param version string = '17'

@description('Compute SKU name.')
param skuName string = 'Standard_B2s'

@description('Compute tier.')
param skuTier string = 'Burstable'

@description('Storage size in GB.')
param storageSizeGB int = 32

@description('Backup retention in days.')
param backupRetentionDays int = 7

@description('Resource tags.')
param tags object = {}

resource server 'Microsoft.DBforPostgreSQL/flexibleServers@2024-08-01' = {
  name: name
  location: location
  tags: tags
  sku: {
    name: skuName
    tier: skuTier
  }
  properties: {
    administratorLogin: administratorLogin
    administratorLoginPassword: administratorPassword
    version: version
    authConfig: {
      activeDirectoryAuth: 'Disabled'
      passwordAuth: 'Enabled'
    }
    storage: {
      storageSizeGB: storageSizeGB
      autoGrow: 'Disabled'
    }
    backup: {
      backupRetentionDays: backupRetentionDays
      geoRedundantBackup: 'Disabled'
    }
    highAvailability: {
      mode: 'Disabled'
    }
    network: {
      publicNetworkAccess: 'Enabled'
    }
  }
}

// Application database (matches the "postgres" db that exists; add your own as needed).
resource appDatabase 'Microsoft.DBforPostgreSQL/flexibleServers/databases@2024-08-01' = {
  parent: server
  name: 'postgres'
}

// Allow Azure services (matches existing firewall rule). 0.0.0.0 = Azure-internal.
resource allowAzure 'Microsoft.DBforPostgreSQL/flexibleServers/firewallRules@2024-08-01' = {
  parent: server
  name: 'AllowAllAzureServicesAndResourcesWithinAzureIps'
  properties: {
    startIpAddress: '0.0.0.0'
    endIpAddress: '0.0.0.0'
  }
}

output id string = server.id
output fqdn string = server.properties.fullyQualifiedDomainName
