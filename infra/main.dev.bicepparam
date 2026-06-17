using 'main.bicep'

param env = 'dev'

// Postgres
param postgresName = 'palette365'
param postgresAdminLogin = 'timhe'
// Do NOT hardcode the password here. Supply it at deploy time, e.g.:
//   az deployment group create ... -p postgresAdminPassword=$PG_PASSWORD
// or wire it from a GitHub Actions secret. The line below reads an env var
// via the CLI getSecret pattern is not available in .bicepparam, so pass on CLI.
param postgresAdminPassword = '' // <-- override on the command line / CI; leave empty here

// Key Vault
param keyVaultName = 'palette365'

// App Service
param appServicePlanName = 'ASP-rgpalette365dev-97a4'
param webAppName = 'api-palette365'
param containerImage = 'docker.io/dingqinghe/api:751926887ef1a978c1e4f40995a6e8c98d948527'

// Web app application settings.
// Plain values + Key Vault references. The @Microsoft.KeyVault(...) strings are
// POINTERS to secrets, not the secrets themselves — safe to keep in source control.
// The web app's managed identity resolves them at runtime (via the Key Vault
// Secrets User role assignment in main.bicep).
param webAppSettings = {
  // --- platform / container ---
  WEBSITES_PORT: '8080'
  WEBSITES_ENABLE_APP_SERVICE_STORAGE: 'false'
  WEBSITE_HTTPLOGGING_RETENTION_DAYS: '3'

  // --- app config (non-secret) ---
  SPRING_PROFILES_ACTIVE: 'dev'
  CORS_ALLOWEDORIGINS: 'https://www.palletly.de,https://seller.palletly.de,https://admin.palletly.de'
  DDL_AUTO: 'none'

  // --- database (non-secret bits) ---
  DB_SERVER: 'palette365.postgres.database.azure.com'
  DB_PORT: '5432'
  DB_NAME: 'postgres'
  DB_USERNAME: 'timhe'

  // --- mail (non-secret bits) ---
  SPRING_MAIL_HOST: 'smtp.eu.mailgun.org'
  SPRING_MAIL_PORT: '587'
  SPRING_MAIL_USERNAME: 'noreply@mail.palette365.de'
  SPRING_MAIL_PROPERTIES_MAIL_SMTP_AUTH: 'true'
  SPRING_MAIL_PROPERTIES_MAIL_SMTP_STARTTLS_ENABLE: 'false'

  // --- Entra / OAuth2 (non-secret) ---
  SPRING_SECURITY_OAUTH2_RESOURCESERVER_JWT_ENTRA_AUDIENCE: '02d84ec3-f7fd-46d0-994a-9f2f1f81fdcf'
  SPRING_SECURITY_OAUTH2_RESOURCESERVER_JWT_ENTRA_ISSUER_URI: 'https://login.microsoftonline.com/d13e89a2-46ab-48c5-ba97-7fdad1035704/v2.0'

  // --- Key Vault references (pointers, not secrets) ---
  DB_PASSWORD: '@Microsoft.KeyVault(VaultName=palette365;SecretName=db-password)'
  SPRING_DATASOURCE_URL: '@Microsoft.KeyVault(VaultName=palette365;SecretName=conn-string)'
  SPRING_MAIL_PASSWORD: '@Microsoft.KeyVault(VaultName=palette365;SecretName=mail-password)'
  SECURITY_JWT_SECRETKEY: '@Microsoft.KeyVault(VaultName=palette365;SecretName=secret-key)'
  AZURE_STORAGE_ACCOUNT_KEY: '@Microsoft.KeyVault(VaultName=palette365;SecretName=azure-storage-account-key)'
  AZURE_STORAGE_CONNECTIONSTRING: '@Microsoft.KeyVault(VaultName=palette365;SecretName=az-storage-conn-string)'
}

// Static sites
param staticSiteRepoUrl = 'https://github.com/hdqeing/palette'
param staticSiteNames = [
  'admin'
  'info'
  'ui-buyer'
  'ui-seller'
]
