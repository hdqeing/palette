// Linux App Service Plan (Basic B2).

@description('App Service Plan name.')
param name string

@description('Azure region.')
param location string

@description('SKU name, e.g. B1, B2, S1.')
param skuName string = 'B2'

@description('Resource tags.')
param tags object = {}

resource plan 'Microsoft.Web/serverfarms@2024-11-01' = {
  name: name
  location: location
  tags: tags
  kind: 'linux'
  sku: {
    name: skuName
  }
  properties: {
    reserved: true // required for Linux
  }
}

output id string = plan.id
