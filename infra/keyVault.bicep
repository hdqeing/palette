// Key Vault — manages the vault resource only.
// Secret VALUES are deliberately not managed in code (see main.bicep note).
// RBAC-authorized; grant access to identities via role assignments, not access policies.

@description('Key Vault name.')
param name string

@description('Azure region.')
param location string

@description('Entra ID tenant ID for the vault.')
param tenantId string = subscription().tenantId

@description('Resource tags.')
param tags object = {}

resource vault 'Microsoft.KeyVault/vaults@2024-11-01' = {
  name: name
  location: location
  tags: tags
  properties: {
    tenantId: tenantId
    sku: {
      family: 'A'
      name: 'standard'
    }
    enableRbacAuthorization: true
    enableSoftDelete: true
    softDeleteRetentionInDays: 90
    enabledForDeployment: false
    enabledForDiskEncryption: false
    enabledForTemplateDeployment: false
    publicNetworkAccess: 'Enabled'
    networkAcls: {
      bypass: 'None'
      defaultAction: 'Allow'
      ipRules: []
      virtualNetworkRules: []
    }
  }
}

output id string = vault.id
output uri string = vault.properties.vaultUri
