// =============================================================================
// main.bicep — palette365 infrastructure
// Scope: resource group. Deploy with:
//   az deployment group what-if -g <rg> -f infra/main.bicep -p infra/main.dev.bicepparam
// =============================================================================
//
// WHAT THIS MANAGES:
//   - PostgreSQL flexible server (+ one db + Azure-services firewall rule)
//   - Key Vault (the vault resource only)
//   - App Service Plan (Linux B2)
//   - Web App (Linux container)
//   - 4 static web apps (admin, info, ui-buyer, ui-seller)
//
// WHAT THIS DELIBERATELY DOES NOT MANAGE (and why):
//   - Key Vault SECRET VALUES — secrets aren't in source control. Set them
//     manually or from your app/CI. Bicep manages the vault, not its contents.
//   - Postgres server PARAMETERS — the ~570 "configurations" in the export are
//     Azure defaults. Only add one if you intentionally override it.
//   - Custom DOMAINS & TLS bindings (hostNameBindings, customDomains,
//     certificates) — these depend on DNS state and managed certs that are
//     fiddly to express idempotently. Manage them in the portal for now, or add
//     later once the core deploys cleanly. This is the pragmatic startup choice.
//   - basicPublishingCredentialsPolicies, sitecontainers, backups, ATP settings
//     — runtime/managed sub-resources, not infrastructure.
// =============================================================================

targetScope = 'resourceGroup'

@description('Azure region for all resources.')
param location string = resourceGroup().location

@description('Environment short name, e.g. dev / prod.')
param env string = 'dev'

// ---- Postgres ----
@description('Postgres server name.')
param postgresName string

@description('Postgres admin login.')
param postgresAdminLogin string

@description('Postgres admin password. Supply securely at deploy time; never commit.')
@secure()
param postgresAdminPassword string

// ---- Key Vault ----
@description('Key Vault name.')
param keyVaultName string

// ---- App Service ----
@description('App Service Plan name.')
param appServicePlanName string

@description('Web app name.')
param webAppName string

@description('Container image for the web app, e.g. docker.io/org/api:tag.')
param containerImage string

@description('Web app application settings (name->value). Key Vault references allowed.')
param webAppSettings object = {}

// ---- Static sites ----
@description('GitHub repo backing the static sites.')
param staticSiteRepoUrl string

@description('Static site names to create.')
param staticSiteNames array

var commonTags = {
  env: env
}

module postgres 'modules/postgres.bicep' = {
  name: 'postgres'
  params: {
    name: postgresName
    location: location
    administratorLogin: postgresAdminLogin
    administratorPassword: postgresAdminPassword
    tags: union(commonTags, { app: 'database' })
  }
}

module keyVault 'modules/keyVault.bicep' = {
  name: 'keyVault'
  params: {
    name: keyVaultName
    location: location
    tags: commonTags
  }
}

module plan 'modules/appServicePlan.bicep' = {
  name: 'appServicePlan'
  params: {
    name: appServicePlanName
    location: location
    tags: union(commonTags, { app: 'api' })
  }
}

module webApp 'modules/webApp.bicep' = {
  name: 'webApp'
  params: {
    name: webAppName
    location: location
    serverFarmId: plan.outputs.id
    containerImage: containerImage
    appSettings: webAppSettings
    tags: union(commonTags, { app: 'api' })
  }
}

module staticSites 'modules/staticSite.bicep' = [for siteName in staticSiteNames: {
  name: 'staticSite-${siteName}'
  params: {
    name: siteName
    location: location
    repositoryUrl: staticSiteRepoUrl
  }
}]

// Grant the web app's identity permission to read Key Vault secrets
// (Key Vault Secrets User role). Lets the app use Key Vault references.
resource kvRef 'Microsoft.KeyVault/vaults@2024-11-01' existing = {
  name: keyVaultName
}

resource secretsUser 'Microsoft.Authorization/roleAssignments@2022-04-01' = {
  scope: kvRef
  name: guid(kvRef.id, webApp.outputs.principalId, 'Key Vault Secrets User')
  properties: {
    roleDefinitionId: subscriptionResourceId(
      'Microsoft.Authorization/roleDefinitions',
      '4633458b-17de-408a-b874-0445c86b69e6' // Key Vault Secrets User
    )
    principalId: webApp.outputs.principalId
    principalType: 'ServicePrincipal'
  }
  dependsOn: [
    keyVault
  ]
}

output postgresFqdn string = postgres.outputs.fqdn
output webAppHostname string = webApp.outputs.defaultHostname
output keyVaultUri string = keyVault.outputs.uri
