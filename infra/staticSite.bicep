// Static Web App (Free tier, GitHub-linked).
// Custom domains are intentionally NOT managed here — see note in main.bicep.

@description('Name of the static site, e.g. "admin", "info", "ui-buyer", "ui-seller".')
param name string

@description('Azure region.')
param location string

@description('GitHub repository URL backing this static site.')
param repositoryUrl string

@description('Git branch that triggers builds.')
param branch string = 'main'

@description('Resource tags.')
param tags object = {}

resource site 'Microsoft.Web/staticSites@2024-11-01' = {
  name: name
  location: location
  tags: tags
  sku: {
    name: 'Free'
    tier: 'Free'
  }
  properties: {
    allowConfigFileUpdates: true
    branch: branch
    provider: 'GitHub'
    repositoryUrl: repositoryUrl
    stagingEnvironmentPolicy: 'Enabled'
    enterpriseGradeCdnStatus: 'Disabled'
  }
}

output id string = site.id
output defaultHostname string = site.properties.defaultHostname
