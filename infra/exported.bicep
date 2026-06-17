param flexibleServers_palette365_name string
param serverfarms_ASP_rgpalette365dev_97a4_name string
param sites_api_palette365_name string
param staticSites_admin_name string
param staticSites_info_name string
param staticSites_ui_buyer_name string
param staticSites_ui_seller_name string
param vaults_palette365_name string

resource flexibleServers_palette365_name_resource 'Microsoft.DBforPostgreSQL/flexibleServers@2026-01-01-preview' = {
  location: 'West Europe'
  name: flexibleServers_palette365_name
  properties: {
    administratorLogin: 'timhe'
    authConfig: {
      activeDirectoryAuth: 'Disabled'
      passwordAuth: 'Enabled'
    }
    availabilityZone: '2'
    backup: {
      backupRetentionDays: 7
      geoRedundantBackup: 'Disabled'
    }
    dataEncryption: {
      type: 'SystemManaged'
    }
    highAvailability: {
      mode: 'Disabled'
    }
    maintenanceWindow: {
      customWindow: 'Disabled'
      dayOfWeek: 0
      startHour: 0
      startMinute: 0
    }
    network: {
      publicNetworkAccess: 'Enabled'
    }
    replica: {
      role: 'Primary'
    }
    replicationRole: 'Primary'
    storage: {
      autoGrow: 'Disabled'
      iops: 120
      storageSizeGB: 32
      tier: 'P4'
    }
    version: '17'
  }
  sku: {
    name: 'Standard_B2s'
    tier: 'Burstable'
  }
  tags: {
    app: 'database'
    env: 'dev'
  }
}

resource vaults_palette365_name_resource 'Microsoft.KeyVault/vaults@2026-03-01-preview' = {
  location: 'westeurope'
  name: vaults_palette365_name
  properties: {
    accessPolicies: []
    enableRbacAuthorization: true
    enableSoftDelete: true
    enabledForDeployment: false
    enabledForDiskEncryption: false
    enabledForTemplateDeployment: false
    networkAcls: {
      bypass: 'None'
      defaultAction: 'Allow'
      ipRules: []
      virtualNetworkRules: []
    }
    provisioningState: 'Succeeded'
    publicNetworkAccess: 'Enabled'
    sku: {
      family: 'A'
      name: 'standard'
    }
    softDeleteRetentionInDays: 90
    tenantId: '7591651d-6db1-41c5-a02e-9ef25afd8745'
    vaultUri: 'https://${vaults_palette365_name}.vault.azure.net/'
  }
}

resource serverfarms_ASP_rgpalette365dev_97a4_name_resource 'Microsoft.Web/serverfarms@2024-11-01' = {
  kind: 'linux'
  location: 'West Europe'
  name: serverfarms_ASP_rgpalette365dev_97a4_name
  properties: {
    asyncScalingEnabled: false
    elasticScaleEnabled: false
    hyperV: false
    isSpot: false
    isXenon: false
    maximumElasticWorkerCount: 1
    perSiteScaling: false
    reserved: true
    targetWorkerCount: 0
    targetWorkerSizeId: 0
    zoneRedundant: false
  }
  sku: {
    capacity: 1
    family: 'B'
    name: 'B2'
    size: 'B2'
    tier: 'Basic'
  }
  tags: {
    app: 'api'
    env: 'dev'
  }
}

resource staticSites_admin_name_resource 'Microsoft.Web/staticSites@2024-11-01' = {
  location: 'West Europe'
  name: staticSites_admin_name
  properties: {
    allowConfigFileUpdates: true
    branch: 'main'
    enterpriseGradeCdnStatus: 'Disabled'
    provider: 'GitHub'
    repositoryUrl: 'https://github.com/hdqeing/palette'
    stagingEnvironmentPolicy: 'Enabled'
  }
  sku: {
    name: 'Free'
    tier: 'Free'
  }
}

resource staticSites_info_name_resource 'Microsoft.Web/staticSites@2024-11-01' = {
  location: 'West Europe'
  name: staticSites_info_name
  properties: {
    allowConfigFileUpdates: true
    branch: 'main'
    enterpriseGradeCdnStatus: 'Disabled'
    provider: 'GitHub'
    repositoryUrl: 'https://github.com/hdqeing/palette'
    stagingEnvironmentPolicy: 'Enabled'
  }
  sku: {
    name: 'Free'
    tier: 'Free'
  }
}

resource staticSites_ui_buyer_name_resource 'Microsoft.Web/staticSites@2024-11-01' = {
  location: 'West Europe'
  name: staticSites_ui_buyer_name
  properties: {
    allowConfigFileUpdates: true
    branch: 'main'
    enterpriseGradeCdnStatus: 'Disabled'
    provider: 'GitHub'
    repositoryUrl: 'https://github.com/hdqeing/palette'
    stagingEnvironmentPolicy: 'Enabled'
  }
  sku: {
    name: 'Standard'
    tier: 'Standard'
  }
}

resource staticSites_ui_seller_name_resource 'Microsoft.Web/staticSites@2024-11-01' = {
  location: 'West Europe'
  name: staticSites_ui_seller_name
  properties: {
    allowConfigFileUpdates: true
    branch: 'main'
    enterpriseGradeCdnStatus: 'Disabled'
    provider: 'GitHub'
    repositoryUrl: 'https://github.com/hdqeing/palette'
    stagingEnvironmentPolicy: 'Enabled'
  }
  sku: {
    name: 'Free'
    tier: 'Free'
  }
}

resource flexibleServers_palette365_name_Default 'Microsoft.DBforPostgreSQL/flexibleServers/advancedThreatProtectionSettings@2026-01-01-preview' = {
  parent: flexibleServers_palette365_name_resource
  name: 'Default'
  properties: {
    state: 'Disabled'
  }
}

resource flexibleServers_palette365_name_backup_639165257211521126 'Microsoft.DBforPostgreSQL/flexibleServers/backups@2026-01-01-preview' = {
  parent: flexibleServers_palette365_name_resource
  name: 'backup_639165257211521126'
}

resource flexibleServers_palette365_name_backup_639166119458164832 'Microsoft.DBforPostgreSQL/flexibleServers/backups@2026-01-01-preview' = {
  parent: flexibleServers_palette365_name_resource
  name: 'backup_639166119458164832'
}

resource flexibleServers_palette365_name_backup_639166982969460269 'Microsoft.DBforPostgreSQL/flexibleServers/backups@2026-01-01-preview' = {
  parent: flexibleServers_palette365_name_resource
  name: 'backup_639166982969460269'
}

resource flexibleServers_palette365_name_backup_639167847104178776 'Microsoft.DBforPostgreSQL/flexibleServers/backups@2026-01-01-preview' = {
  parent: flexibleServers_palette365_name_resource
  name: 'backup_639167847104178776'
}

resource flexibleServers_palette365_name_backup_639168711588161525 'Microsoft.DBforPostgreSQL/flexibleServers/backups@2026-01-01-preview' = {
  parent: flexibleServers_palette365_name_resource
  name: 'backup_639168711588161525'
}

resource flexibleServers_palette365_name_backup_639169576068327306 'Microsoft.DBforPostgreSQL/flexibleServers/backups@2026-01-01-preview' = {
  parent: flexibleServers_palette365_name_resource
  name: 'backup_639169576068327306'
}

resource flexibleServers_palette365_name_backup_639170440449300097 'Microsoft.DBforPostgreSQL/flexibleServers/backups@2026-01-01-preview' = {
  parent: flexibleServers_palette365_name_resource
  name: 'backup_639170440449300097'
}

resource flexibleServers_palette365_name_allow_alter_system 'Microsoft.DBforPostgreSQL/flexibleServers/configurations@2026-01-01-preview' = {
  parent: flexibleServers_palette365_name_resource
  name: 'allow_alter_system'
  properties: {
    source: 'system-default'
    value: 'on'
  }
}

resource flexibleServers_palette365_name_allow_in_place_tablespaces 'Microsoft.DBforPostgreSQL/flexibleServers/configurations@2026-01-01-preview' = {
  parent: flexibleServers_palette365_name_resource
  name: 'allow_in_place_tablespaces'
  properties: {
    source: 'system-default'
    value: 'off'
  }
}

resource flexibleServers_palette365_name_allow_system_table_mods 'Microsoft.DBforPostgreSQL/flexibleServers/configurations@2026-01-01-preview' = {
  parent: flexibleServers_palette365_name_resource
  name: 'allow_system_table_mods'
  properties: {
    source: 'system-default'
    value: 'off'
  }
}

resource flexibleServers_palette365_name_anon_algorithm 'Microsoft.DBforPostgreSQL/flexibleServers/configurations@2026-01-01-preview' = {
  parent: flexibleServers_palette365_name_resource
  name: 'anon.algorithm'
  properties: {
    source: 'system-default'
    value: 'sha256'
  }
}

resource flexibleServers_palette365_name_anon_k_anonymity_provider 'Microsoft.DBforPostgreSQL/flexibleServers/configurations@2026-01-01-preview' = {
  parent: flexibleServers_palette365_name_resource
  name: 'anon.k_anonymity_provider'
  properties: {
    source: 'system-default'
    value: 'k_anonymity'
  }
}

resource flexibleServers_palette365_name_anon_masking_policies 'Microsoft.DBforPostgreSQL/flexibleServers/configurations@2026-01-01-preview' = {
  parent: flexibleServers_palette365_name_resource
  name: 'anon.masking_policies'
  properties: {
    source: 'system-default'
    value: 'anon'
  }
}

resource flexibleServers_palette365_name_anon_maskschema 'Microsoft.DBforPostgreSQL/flexibleServers/configurations@2026-01-01-preview' = {
  parent: flexibleServers_palette365_name_resource
  name: 'anon.maskschema'
  properties: {
    source: 'system-default'
    value: 'mask'
  }
}

resource flexibleServers_palette365_name_anon_privacy_by_default 'Microsoft.DBforPostgreSQL/flexibleServers/configurations@2026-01-01-preview' = {
  parent: flexibleServers_palette365_name_resource
  name: 'anon.privacy_by_default'
  properties: {
    source: 'system-default'
    value: 'off'
  }
}

resource flexibleServers_palette365_name_anon_restrict_to_trusted_schemas 'Microsoft.DBforPostgreSQL/flexibleServers/configurations@2026-01-01-preview' = {
  parent: flexibleServers_palette365_name_resource
  name: 'anon.restrict_to_trusted_schemas'
  properties: {
    source: 'system-default'
    value: 'on'
  }
}

resource flexibleServers_palette365_name_anon_salt 'Microsoft.DBforPostgreSQL/flexibleServers/configurations@2026-01-01-preview' = {
  parent: flexibleServers_palette365_name_resource
  name: 'anon.salt'
  properties: {
    source: 'system-default'
  }
}

resource flexibleServers_palette365_name_anon_sourceschema 'Microsoft.DBforPostgreSQL/flexibleServers/configurations@2026-01-01-preview' = {
  parent: flexibleServers_palette365_name_resource
  name: 'anon.sourceschema'
  properties: {
    source: 'system-default'
    value: 'public'
  }
}

resource flexibleServers_palette365_name_anon_strict_mode 'Microsoft.DBforPostgreSQL/flexibleServers/configurations@2026-01-01-preview' = {
  parent: flexibleServers_palette365_name_resource
  name: 'anon.strict_mode'
  properties: {
    source: 'system-default'
    value: 'on'
  }
}

resource flexibleServers_palette365_name_anon_transparent_dynamic_masking 'Microsoft.DBforPostgreSQL/flexibleServers/configurations@2026-01-01-preview' = {
  parent: flexibleServers_palette365_name_resource
  name: 'anon.transparent_dynamic_masking'
  properties: {
    source: 'system-default'
    value: 'off'
  }
}

resource flexibleServers_palette365_name_application_name 'Microsoft.DBforPostgreSQL/flexibleServers/configurations@2026-01-01-preview' = {
  parent: flexibleServers_palette365_name_resource
  name: 'application_name'
  properties: {
    source: 'system-default'
  }
}

resource flexibleServers_palette365_name_archive_cleanup_command 'Microsoft.DBforPostgreSQL/flexibleServers/configurations@2026-01-01-preview' = {
  parent: flexibleServers_palette365_name_resource
  name: 'archive_cleanup_command'
  properties: {
    source: 'system-default'
  }
}

resource flexibleServers_palette365_name_archive_command 'Microsoft.DBforPostgreSQL/flexibleServers/configurations@2026-01-01-preview' = {
  parent: flexibleServers_palette365_name_resource
  name: 'archive_command'
  properties: {
    source: 'user-override'
    value: 'BlobLogUpload.sh %f %p'
  }
}

resource flexibleServers_palette365_name_archive_library 'Microsoft.DBforPostgreSQL/flexibleServers/configurations@2026-01-01-preview' = {
  parent: flexibleServers_palette365_name_resource
  name: 'archive_library'
  properties: {
    source: 'system-default'
  }
}

resource flexibleServers_palette365_name_archive_mode 'Microsoft.DBforPostgreSQL/flexibleServers/configurations@2026-01-01-preview' = {
  parent: flexibleServers_palette365_name_resource
  name: 'archive_mode'
  properties: {
    source: 'user-override'
    value: 'always'
  }
}

resource flexibleServers_palette365_name_archive_timeout 'Microsoft.DBforPostgreSQL/flexibleServers/configurations@2026-01-01-preview' = {
  parent: flexibleServers_palette365_name_resource
  name: 'archive_timeout'
  properties: {
    source: 'system-default'
    value: '300'
  }
}

resource flexibleServers_palette365_name_array_nulls 'Microsoft.DBforPostgreSQL/flexibleServers/configurations@2026-01-01-preview' = {
  parent: flexibleServers_palette365_name_resource
  name: 'array_nulls'
  properties: {
    source: 'system-default'
    value: 'on'
  }
}

resource flexibleServers_palette365_name_authentication_timeout 'Microsoft.DBforPostgreSQL/flexibleServers/configurations@2026-01-01-preview' = {
  parent: flexibleServers_palette365_name_resource
  name: 'authentication_timeout'
  properties: {
    source: 'user-override'
    value: '30'
  }
}

resource flexibleServers_palette365_name_auto_explain_log_analyze 'Microsoft.DBforPostgreSQL/flexibleServers/configurations@2026-01-01-preview' = {
  parent: flexibleServers_palette365_name_resource
  name: 'auto_explain.log_analyze'
  properties: {
    source: 'system-default'
    value: 'off'
  }
}

resource flexibleServers_palette365_name_auto_explain_log_buffers 'Microsoft.DBforPostgreSQL/flexibleServers/configurations@2026-01-01-preview' = {
  parent: flexibleServers_palette365_name_resource
  name: 'auto_explain.log_buffers'
  properties: {
    source: 'system-default'
    value: 'off'
  }
}

resource flexibleServers_palette365_name_auto_explain_log_format 'Microsoft.DBforPostgreSQL/flexibleServers/configurations@2026-01-01-preview' = {
  parent: flexibleServers_palette365_name_resource
  name: 'auto_explain.log_format'
  properties: {
    source: 'system-default'
    value: 'text'
  }
}

resource flexibleServers_palette365_name_auto_explain_log_level 'Microsoft.DBforPostgreSQL/flexibleServers/configurations@2026-01-01-preview' = {
  parent: flexibleServers_palette365_name_resource
  name: 'auto_explain.log_level'
  properties: {
    source: 'system-default'
    value: 'log'
  }
}

resource flexibleServers_palette365_name_auto_explain_log_min_duration 'Microsoft.DBforPostgreSQL/flexibleServers/configurations@2026-01-01-preview' = {
  parent: flexibleServers_palette365_name_resource
  name: 'auto_explain.log_min_duration'
  properties: {
    source: 'system-default'
    value: '-1'
  }
}

resource flexibleServers_palette365_name_auto_explain_log_nested_statements 'Microsoft.DBforPostgreSQL/flexibleServers/configurations@2026-01-01-preview' = {
  parent: flexibleServers_palette365_name_resource
  name: 'auto_explain.log_nested_statements'
  properties: {
    source: 'system-default'
    value: 'off'
  }
}

resource flexibleServers_palette365_name_auto_explain_log_parameter_max_length 'Microsoft.DBforPostgreSQL/flexibleServers/configurations@2026-01-01-preview' = {
  parent: flexibleServers_palette365_name_resource
  name: 'auto_explain.log_parameter_max_length'
  properties: {
    source: 'system-default'
    value: '-1'
  }
}

resource flexibleServers_palette365_name_auto_explain_log_settings 'Microsoft.DBforPostgreSQL/flexibleServers/configurations@2026-01-01-preview' = {
  parent: flexibleServers_palette365_name_resource
  name: 'auto_explain.log_settings'
  properties: {
    source: 'system-default'
    value: 'off'
  }
}

resource flexibleServers_palette365_name_auto_explain_log_timing 'Microsoft.DBforPostgreSQL/flexibleServers/configurations@2026-01-01-preview' = {
  parent: flexibleServers_palette365_name_resource
  name: 'auto_explain.log_timing'
  properties: {
    source: 'system-default'
    value: 'on'
  }
}

resource flexibleServers_palette365_name_auto_explain_log_triggers 'Microsoft.DBforPostgreSQL/flexibleServers/configurations@2026-01-01-preview' = {
  parent: flexibleServers_palette365_name_resource
  name: 'auto_explain.log_triggers'
  properties: {
    source: 'system-default'
    value: 'off'
  }
}

resource flexibleServers_palette365_name_auto_explain_log_verbose 'Microsoft.DBforPostgreSQL/flexibleServers/configurations@2026-01-01-preview' = {
  parent: flexibleServers_palette365_name_resource
  name: 'auto_explain.log_verbose'
  properties: {
    source: 'system-default'
    value: 'off'
  }
}

resource flexibleServers_palette365_name_auto_explain_log_wal 'Microsoft.DBforPostgreSQL/flexibleServers/configurations@2026-01-01-preview' = {
  parent: flexibleServers_palette365_name_resource
  name: 'auto_explain.log_wal'
  properties: {
    source: 'system-default'
    value: 'off'
  }
}

resource flexibleServers_palette365_name_auto_explain_sample_rate 'Microsoft.DBforPostgreSQL/flexibleServers/configurations@2026-01-01-preview' = {
  parent: flexibleServers_palette365_name_resource
  name: 'auto_explain.sample_rate'
  properties: {
    source: 'system-default'
    value: '1.0'
  }
}

resource flexibleServers_palette365_name_autovacuum 'Microsoft.DBforPostgreSQL/flexibleServers/configurations@2026-01-01-preview' = {
  parent: flexibleServers_palette365_name_resource
  name: 'autovacuum'
  properties: {
    source: 'system-default'
    value: 'on'
  }
}

resource flexibleServers_palette365_name_autovacuum_analyze_scale_factor 'Microsoft.DBforPostgreSQL/flexibleServers/configurations@2026-01-01-preview' = {
  parent: flexibleServers_palette365_name_resource
  name: 'autovacuum_analyze_scale_factor'
  properties: {
    source: 'system-default'
    value: '0.1'
  }
}

resource flexibleServers_palette365_name_autovacuum_analyze_threshold 'Microsoft.DBforPostgreSQL/flexibleServers/configurations@2026-01-01-preview' = {
  parent: flexibleServers_palette365_name_resource
  name: 'autovacuum_analyze_threshold'
  properties: {
    source: 'system-default'
    value: '50'
  }
}

resource flexibleServers_palette365_name_autovacuum_freeze_max_age 'Microsoft.DBforPostgreSQL/flexibleServers/configurations@2026-01-01-preview' = {
  parent: flexibleServers_palette365_name_resource
  name: 'autovacuum_freeze_max_age'
  properties: {
    source: 'system-default'
    value: '200000000'
  }
}

resource flexibleServers_palette365_name_autovacuum_max_workers 'Microsoft.DBforPostgreSQL/flexibleServers/configurations@2026-01-01-preview' = {
  parent: flexibleServers_palette365_name_resource
  name: 'autovacuum_max_workers'
  properties: {
    source: 'system-default'
    value: '3'
  }
}

resource flexibleServers_palette365_name_autovacuum_multixact_freeze_max_age 'Microsoft.DBforPostgreSQL/flexibleServers/configurations@2026-01-01-preview' = {
  parent: flexibleServers_palette365_name_resource
  name: 'autovacuum_multixact_freeze_max_age'
  properties: {
    source: 'system-default'
    value: '400000000'
  }
}

resource flexibleServers_palette365_name_autovacuum_naptime 'Microsoft.DBforPostgreSQL/flexibleServers/configurations@2026-01-01-preview' = {
  parent: flexibleServers_palette365_name_resource
  name: 'autovacuum_naptime'
  properties: {
    source: 'system-default'
    value: '60'
  }
}

resource flexibleServers_palette365_name_autovacuum_vacuum_cost_delay 'Microsoft.DBforPostgreSQL/flexibleServers/configurations@2026-01-01-preview' = {
  parent: flexibleServers_palette365_name_resource
  name: 'autovacuum_vacuum_cost_delay'
  properties: {
    source: 'system-default'
    value: '2'
  }
}

resource flexibleServers_palette365_name_autovacuum_vacuum_cost_limit 'Microsoft.DBforPostgreSQL/flexibleServers/configurations@2026-01-01-preview' = {
  parent: flexibleServers_palette365_name_resource
  name: 'autovacuum_vacuum_cost_limit'
  properties: {
    source: 'system-default'
    value: '-1'
  }
}

resource flexibleServers_palette365_name_autovacuum_vacuum_insert_scale_factor 'Microsoft.DBforPostgreSQL/flexibleServers/configurations@2026-01-01-preview' = {
  parent: flexibleServers_palette365_name_resource
  name: 'autovacuum_vacuum_insert_scale_factor'
  properties: {
    source: 'system-default'
    value: '0.2'
  }
}

resource flexibleServers_palette365_name_autovacuum_vacuum_insert_threshold 'Microsoft.DBforPostgreSQL/flexibleServers/configurations@2026-01-01-preview' = {
  parent: flexibleServers_palette365_name_resource
  name: 'autovacuum_vacuum_insert_threshold'
  properties: {
    source: 'system-default'
    value: '1000'
  }
}

resource flexibleServers_palette365_name_autovacuum_vacuum_scale_factor 'Microsoft.DBforPostgreSQL/flexibleServers/configurations@2026-01-01-preview' = {
  parent: flexibleServers_palette365_name_resource
  name: 'autovacuum_vacuum_scale_factor'
  properties: {
    source: 'system-default'
    value: '0.2'
  }
}

resource flexibleServers_palette365_name_autovacuum_vacuum_threshold 'Microsoft.DBforPostgreSQL/flexibleServers/configurations@2026-01-01-preview' = {
  parent: flexibleServers_palette365_name_resource
  name: 'autovacuum_vacuum_threshold'
  properties: {
    source: 'system-default'
    value: '50'
  }
}

resource flexibleServers_palette365_name_autovacuum_work_mem 'Microsoft.DBforPostgreSQL/flexibleServers/configurations@2026-01-01-preview' = {
  parent: flexibleServers_palette365_name_resource
  name: 'autovacuum_work_mem'
  properties: {
    source: 'system-default'
    value: '-1'
  }
}

resource flexibleServers_palette365_name_azure_accepted_password_auth_method 'Microsoft.DBforPostgreSQL/flexibleServers/configurations@2026-01-01-preview' = {
  parent: flexibleServers_palette365_name_resource
  name: 'azure.accepted_password_auth_method'
  properties: {
    source: 'system-default'
    value: 'md5,scram-sha-256'
  }
}

resource flexibleServers_palette365_name_azure_enable_temp_tablespaces_on_local_ssd 'Microsoft.DBforPostgreSQL/flexibleServers/configurations@2026-01-01-preview' = {
  parent: flexibleServers_palette365_name_resource
  name: 'azure.enable_temp_tablespaces_on_local_ssd'
  properties: {
    source: 'system-default'
    value: 'on'
  }
}

resource flexibleServers_palette365_name_azure_extensions 'Microsoft.DBforPostgreSQL/flexibleServers/configurations@2026-01-01-preview' = {
  parent: flexibleServers_palette365_name_resource
  name: 'azure.extensions'
  properties: {
    source: 'system-default'
  }
}

resource flexibleServers_palette365_name_azure_fabric_mirror_enabled 'Microsoft.DBforPostgreSQL/flexibleServers/configurations@2026-01-01-preview' = {
  parent: flexibleServers_palette365_name_resource
  name: 'azure.fabric_mirror_enabled'
  properties: {
    source: 'system-default'
    value: 'off'
  }
}

resource flexibleServers_palette365_name_azure_migration_copy_with_binary 'Microsoft.DBforPostgreSQL/flexibleServers/configurations@2026-01-01-preview' = {
  parent: flexibleServers_palette365_name_resource
  name: 'azure.migration_copy_with_binary'
  properties: {
    source: 'system-default'
    value: 'off'
  }
}

resource flexibleServers_palette365_name_azure_migration_skip_analyze 'Microsoft.DBforPostgreSQL/flexibleServers/configurations@2026-01-01-preview' = {
  parent: flexibleServers_palette365_name_resource
  name: 'azure.migration_skip_analyze'
  properties: {
    source: 'system-default'
    value: 'off'
  }
}

resource flexibleServers_palette365_name_azure_migration_skip_extensions 'Microsoft.DBforPostgreSQL/flexibleServers/configurations@2026-01-01-preview' = {
  parent: flexibleServers_palette365_name_resource
  name: 'azure.migration_skip_extensions'
  properties: {
    source: 'system-default'
    value: 'off'
  }
}

resource flexibleServers_palette365_name_azure_migration_skip_large_objects 'Microsoft.DBforPostgreSQL/flexibleServers/configurations@2026-01-01-preview' = {
  parent: flexibleServers_palette365_name_resource
  name: 'azure.migration_skip_large_objects'
  properties: {
    source: 'system-default'
    value: 'off'
  }
}

resource flexibleServers_palette365_name_azure_migration_skip_role_user 'Microsoft.DBforPostgreSQL/flexibleServers/configurations@2026-01-01-preview' = {
  parent: flexibleServers_palette365_name_resource
  name: 'azure.migration_skip_role_user'
  properties: {
    source: 'system-default'
    value: 'on'
  }
}

resource flexibleServers_palette365_name_azure_migration_table_split_size 'Microsoft.DBforPostgreSQL/flexibleServers/configurations@2026-01-01-preview' = {
  parent: flexibleServers_palette365_name_resource
  name: 'azure.migration_table_split_size'
  properties: {
    source: 'system-default'
    value: '20480'
  }
}

resource flexibleServers_palette365_name_azure_service_principal_id 'Microsoft.DBforPostgreSQL/flexibleServers/configurations@2026-01-01-preview' = {
  parent: flexibleServers_palette365_name_resource
  name: 'azure.service_principal_id'
  properties: {
    source: 'system-default'
  }
}

resource flexibleServers_palette365_name_azure_service_principal_tenant_id 'Microsoft.DBforPostgreSQL/flexibleServers/configurations@2026-01-01-preview' = {
  parent: flexibleServers_palette365_name_resource
  name: 'azure.service_principal_tenant_id'
  properties: {
    source: 'system-default'
  }
}

resource flexibleServers_palette365_name_azure_single_to_flex_migration 'Microsoft.DBforPostgreSQL/flexibleServers/configurations@2026-01-01-preview' = {
  parent: flexibleServers_palette365_name_resource
  name: 'azure.single_to_flex_migration'
  properties: {
    source: 'system-default'
    value: 'off'
  }
}

resource flexibleServers_palette365_name_azure_cdc_change_batch_buffer_size 'Microsoft.DBforPostgreSQL/flexibleServers/configurations@2026-01-01-preview' = {
  parent: flexibleServers_palette365_name_resource
  name: 'azure_cdc.change_batch_buffer_size'
  properties: {
    source: 'system-default'
    value: '16'
  }
}

resource flexibleServers_palette365_name_azure_cdc_change_batch_export_timeout 'Microsoft.DBforPostgreSQL/flexibleServers/configurations@2026-01-01-preview' = {
  parent: flexibleServers_palette365_name_resource
  name: 'azure_cdc.change_batch_export_timeout'
  properties: {
    source: 'system-default'
    value: '30'
  }
}

resource flexibleServers_palette365_name_azure_cdc_max_fabric_mirrors 'Microsoft.DBforPostgreSQL/flexibleServers/configurations@2026-01-01-preview' = {
  parent: flexibleServers_palette365_name_resource
  name: 'azure_cdc.max_fabric_mirrors'
  properties: {
    source: 'system-default'
    value: '3'
  }
}

resource flexibleServers_palette365_name_azure_cdc_max_snapshot_workers 'Microsoft.DBforPostgreSQL/flexibleServers/configurations@2026-01-01-preview' = {
  parent: flexibleServers_palette365_name_resource
  name: 'azure_cdc.max_snapshot_workers'
  properties: {
    source: 'system-default'
    value: '3'
  }
}

resource flexibleServers_palette365_name_azure_cdc_onelake_buffer_size 'Microsoft.DBforPostgreSQL/flexibleServers/configurations@2026-01-01-preview' = {
  parent: flexibleServers_palette365_name_resource
  name: 'azure_cdc.onelake_buffer_size'
  properties: {
    source: 'system-default'
    value: '100'
  }
}

resource flexibleServers_palette365_name_azure_cdc_parquet_compression 'Microsoft.DBforPostgreSQL/flexibleServers/configurations@2026-01-01-preview' = {
  parent: flexibleServers_palette365_name_resource
  name: 'azure_cdc.parquet_compression'
  properties: {
    source: 'system-default'
    value: 'zstd'
  }
}

resource flexibleServers_palette365_name_azure_cdc_snapshot_buffer_size 'Microsoft.DBforPostgreSQL/flexibleServers/configurations@2026-01-01-preview' = {
  parent: flexibleServers_palette365_name_resource
  name: 'azure_cdc.snapshot_buffer_size'
  properties: {
    source: 'system-default'
    value: '1000'
  }
}

resource flexibleServers_palette365_name_azure_cdc_snapshot_export_timeout 'Microsoft.DBforPostgreSQL/flexibleServers/configurations@2026-01-01-preview' = {
  parent: flexibleServers_palette365_name_resource
  name: 'azure_cdc.snapshot_export_timeout'
  properties: {
    source: 'system-default'
    value: '180'
  }
}

resource flexibleServers_palette365_name_azure_storage_allow_network_access 'Microsoft.DBforPostgreSQL/flexibleServers/configurations@2026-01-01-preview' = {
  parent: flexibleServers_palette365_name_resource
  name: 'azure_storage.allow_network_access'
  properties: {
    source: 'system-default'
    value: 'on'
  }
}

resource flexibleServers_palette365_name_azure_storage_blob_block_size_mb 'Microsoft.DBforPostgreSQL/flexibleServers/configurations@2026-01-01-preview' = {
  parent: flexibleServers_palette365_name_resource
  name: 'azure_storage.blob_block_size_mb'
  properties: {
    source: 'system-default'
    value: '128'
  }
}

resource flexibleServers_palette365_name_azure_storage_log_level 'Microsoft.DBforPostgreSQL/flexibleServers/configurations@2026-01-01-preview' = {
  parent: flexibleServers_palette365_name_resource
  name: 'azure_storage.log_level'
  properties: {
    source: 'system-default'
    value: 'log'
  }
}

resource flexibleServers_palette365_name_azure_storage_public_account_access 'Microsoft.DBforPostgreSQL/flexibleServers/configurations@2026-01-01-preview' = {
  parent: flexibleServers_palette365_name_resource
  name: 'azure_storage.public_account_access'
  properties: {
    source: 'system-default'
    value: 'on'
  }
}

resource flexibleServers_palette365_name_backend_flush_after 'Microsoft.DBforPostgreSQL/flexibleServers/configurations@2026-01-01-preview' = {
  parent: flexibleServers_palette365_name_resource
  name: 'backend_flush_after'
  properties: {
    source: 'system-default'
    value: '256'
  }
}

resource flexibleServers_palette365_name_backslash_quote 'Microsoft.DBforPostgreSQL/flexibleServers/configurations@2026-01-01-preview' = {
  parent: flexibleServers_palette365_name_resource
  name: 'backslash_quote'
  properties: {
    source: 'system-default'
    value: 'safe_encoding'
  }
}

resource flexibleServers_palette365_name_backtrace_functions 'Microsoft.DBforPostgreSQL/flexibleServers/configurations@2026-01-01-preview' = {
  parent: flexibleServers_palette365_name_resource
  name: 'backtrace_functions'
  properties: {
    source: 'system-default'
  }
}

resource flexibleServers_palette365_name_bgwriter_delay 'Microsoft.DBforPostgreSQL/flexibleServers/configurations@2026-01-01-preview' = {
  parent: flexibleServers_palette365_name_resource
  name: 'bgwriter_delay'
  properties: {
    source: 'system-default'
    value: '20'
  }
}

resource flexibleServers_palette365_name_bgwriter_flush_after 'Microsoft.DBforPostgreSQL/flexibleServers/configurations@2026-01-01-preview' = {
  parent: flexibleServers_palette365_name_resource
  name: 'bgwriter_flush_after'
  properties: {
    source: 'system-default'
    value: '64'
  }
}

resource flexibleServers_palette365_name_bgwriter_lru_maxpages 'Microsoft.DBforPostgreSQL/flexibleServers/configurations@2026-01-01-preview' = {
  parent: flexibleServers_palette365_name_resource
  name: 'bgwriter_lru_maxpages'
  properties: {
    source: 'system-default'
    value: '100'
  }
}

resource flexibleServers_palette365_name_bgwriter_lru_multiplier 'Microsoft.DBforPostgreSQL/flexibleServers/configurations@2026-01-01-preview' = {
  parent: flexibleServers_palette365_name_resource
  name: 'bgwriter_lru_multiplier'
  properties: {
    source: 'system-default'
    value: '2'
  }
}

resource flexibleServers_palette365_name_block_size 'Microsoft.DBforPostgreSQL/flexibleServers/configurations@2026-01-01-preview' = {
  parent: flexibleServers_palette365_name_resource
  name: 'block_size'
  properties: {
    source: 'system-default'
    value: '8192'
  }
}

resource flexibleServers_palette365_name_bonjour 'Microsoft.DBforPostgreSQL/flexibleServers/configurations@2026-01-01-preview' = {
  parent: flexibleServers_palette365_name_resource
  name: 'bonjour'
  properties: {
    source: 'system-default'
    value: 'off'
  }
}

resource flexibleServers_palette365_name_bonjour_name 'Microsoft.DBforPostgreSQL/flexibleServers/configurations@2026-01-01-preview' = {
  parent: flexibleServers_palette365_name_resource
  name: 'bonjour_name'
  properties: {
    source: 'system-default'
  }
}

resource flexibleServers_palette365_name_bytea_output 'Microsoft.DBforPostgreSQL/flexibleServers/configurations@2026-01-01-preview' = {
  parent: flexibleServers_palette365_name_resource
  name: 'bytea_output'
  properties: {
    source: 'system-default'
    value: 'hex'
  }
}

resource flexibleServers_palette365_name_check_function_bodies 'Microsoft.DBforPostgreSQL/flexibleServers/configurations@2026-01-01-preview' = {
  parent: flexibleServers_palette365_name_resource
  name: 'check_function_bodies'
  properties: {
    source: 'system-default'
    value: 'on'
  }
}

resource flexibleServers_palette365_name_checkpoint_completion_target 'Microsoft.DBforPostgreSQL/flexibleServers/configurations@2026-01-01-preview' = {
  parent: flexibleServers_palette365_name_resource
  name: 'checkpoint_completion_target'
  properties: {
    source: 'system-default'
    value: '0.9'
  }
}

resource flexibleServers_palette365_name_checkpoint_flush_after 'Microsoft.DBforPostgreSQL/flexibleServers/configurations@2026-01-01-preview' = {
  parent: flexibleServers_palette365_name_resource
  name: 'checkpoint_flush_after'
  properties: {
    source: 'system-default'
    value: '32'
  }
}

resource flexibleServers_palette365_name_checkpoint_timeout 'Microsoft.DBforPostgreSQL/flexibleServers/configurations@2026-01-01-preview' = {
  parent: flexibleServers_palette365_name_resource
  name: 'checkpoint_timeout'
  properties: {
    source: 'system-default'
    value: '600'
  }
}

resource flexibleServers_palette365_name_checkpoint_warning 'Microsoft.DBforPostgreSQL/flexibleServers/configurations@2026-01-01-preview' = {
  parent: flexibleServers_palette365_name_resource
  name: 'checkpoint_warning'
  properties: {
    source: 'system-default'
    value: '30'
  }
}

resource flexibleServers_palette365_name_client_connection_check_interval 'Microsoft.DBforPostgreSQL/flexibleServers/configurations@2026-01-01-preview' = {
  parent: flexibleServers_palette365_name_resource
  name: 'client_connection_check_interval'
  properties: {
    source: 'system-default'
    value: '0'
  }
}

resource flexibleServers_palette365_name_client_encoding 'Microsoft.DBforPostgreSQL/flexibleServers/configurations@2026-01-01-preview' = {
  parent: flexibleServers_palette365_name_resource
  name: 'client_encoding'
  properties: {
    source: 'system-default'
    value: 'UTF8'
  }
}

resource flexibleServers_palette365_name_client_min_messages 'Microsoft.DBforPostgreSQL/flexibleServers/configurations@2026-01-01-preview' = {
  parent: flexibleServers_palette365_name_resource
  name: 'client_min_messages'
  properties: {
    source: 'system-default'
    value: 'notice'
  }
}

resource flexibleServers_palette365_name_cluster_name 'Microsoft.DBforPostgreSQL/flexibleServers/configurations@2026-01-01-preview' = {
  parent: flexibleServers_palette365_name_resource
  name: 'cluster_name'
  properties: {
    source: 'system-default'
  }
}

resource flexibleServers_palette365_name_commit_delay 'Microsoft.DBforPostgreSQL/flexibleServers/configurations@2026-01-01-preview' = {
  parent: flexibleServers_palette365_name_resource
  name: 'commit_delay'
  properties: {
    source: 'system-default'
    value: '0'
  }
}

resource flexibleServers_palette365_name_commit_siblings 'Microsoft.DBforPostgreSQL/flexibleServers/configurations@2026-01-01-preview' = {
  parent: flexibleServers_palette365_name_resource
  name: 'commit_siblings'
  properties: {
    source: 'system-default'
    value: '5'
  }
}

resource flexibleServers_palette365_name_commit_timestamp_buffers 'Microsoft.DBforPostgreSQL/flexibleServers/configurations@2026-01-01-preview' = {
  parent: flexibleServers_palette365_name_resource
  name: 'commit_timestamp_buffers'
  properties: {
    source: 'user-override'
    value: '256'
  }
}

resource flexibleServers_palette365_name_compute_query_id 'Microsoft.DBforPostgreSQL/flexibleServers/configurations@2026-01-01-preview' = {
  parent: flexibleServers_palette365_name_resource
  name: 'compute_query_id'
  properties: {
    source: 'system-default'
    value: 'auto'
  }
}

resource flexibleServers_palette365_name_config_file 'Microsoft.DBforPostgreSQL/flexibleServers/configurations@2026-01-01-preview' = {
  parent: flexibleServers_palette365_name_resource
  name: 'config_file'
  properties: {
    source: 'user-override'
    value: '/datadrive/pg/data/postgresql.conf'
  }
}

resource flexibleServers_palette365_name_connection_throttle_bucket_limit 'Microsoft.DBforPostgreSQL/flexibleServers/configurations@2026-01-01-preview' = {
  parent: flexibleServers_palette365_name_resource
  name: 'connection_throttle.bucket_limit'
  properties: {
    source: 'system-default'
    value: '2000'
  }
}

resource flexibleServers_palette365_name_connection_throttle_enable 'Microsoft.DBforPostgreSQL/flexibleServers/configurations@2026-01-01-preview' = {
  parent: flexibleServers_palette365_name_resource
  name: 'connection_throttle.enable'
  properties: {
    source: 'system-default'
    value: 'off'
  }
}

resource flexibleServers_palette365_name_connection_throttle_factor_bias 'Microsoft.DBforPostgreSQL/flexibleServers/configurations@2026-01-01-preview' = {
  parent: flexibleServers_palette365_name_resource
  name: 'connection_throttle.factor_bias'
  properties: {
    source: 'system-default'
    value: '0.8'
  }
}

resource flexibleServers_palette365_name_connection_throttle_hash_entries_max 'Microsoft.DBforPostgreSQL/flexibleServers/configurations@2026-01-01-preview' = {
  parent: flexibleServers_palette365_name_resource
  name: 'connection_throttle.hash_entries_max'
  properties: {
    source: 'system-default'
    value: '500'
  }
}

resource flexibleServers_palette365_name_connection_throttle_reset_time 'Microsoft.DBforPostgreSQL/flexibleServers/configurations@2026-01-01-preview' = {
  parent: flexibleServers_palette365_name_resource
  name: 'connection_throttle.reset_time'
  properties: {
    source: 'system-default'
    value: '120'
  }
}

resource flexibleServers_palette365_name_connection_throttle_restore_factor 'Microsoft.DBforPostgreSQL/flexibleServers/configurations@2026-01-01-preview' = {
  parent: flexibleServers_palette365_name_resource
  name: 'connection_throttle.restore_factor'
  properties: {
    source: 'system-default'
    value: '2'
  }
}

resource flexibleServers_palette365_name_connection_throttle_update_time 'Microsoft.DBforPostgreSQL/flexibleServers/configurations@2026-01-01-preview' = {
  parent: flexibleServers_palette365_name_resource
  name: 'connection_throttle.update_time'
  properties: {
    source: 'system-default'
    value: '20'
  }
}

resource flexibleServers_palette365_name_constraint_exclusion 'Microsoft.DBforPostgreSQL/flexibleServers/configurations@2026-01-01-preview' = {
  parent: flexibleServers_palette365_name_resource
  name: 'constraint_exclusion'
  properties: {
    source: 'system-default'
    value: 'partition'
  }
}

resource flexibleServers_palette365_name_cpu_index_tuple_cost 'Microsoft.DBforPostgreSQL/flexibleServers/configurations@2026-01-01-preview' = {
  parent: flexibleServers_palette365_name_resource
  name: 'cpu_index_tuple_cost'
  properties: {
    source: 'system-default'
    value: '0.005'
  }
}

resource flexibleServers_palette365_name_cpu_operator_cost 'Microsoft.DBforPostgreSQL/flexibleServers/configurations@2026-01-01-preview' = {
  parent: flexibleServers_palette365_name_resource
  name: 'cpu_operator_cost'
  properties: {
    source: 'system-default'
    value: '0.0025'
  }
}

resource flexibleServers_palette365_name_cpu_tuple_cost 'Microsoft.DBforPostgreSQL/flexibleServers/configurations@2026-01-01-preview' = {
  parent: flexibleServers_palette365_name_resource
  name: 'cpu_tuple_cost'
  properties: {
    source: 'system-default'
    value: '0.01'
  }
}

resource flexibleServers_palette365_name_createrole_self_grant 'Microsoft.DBforPostgreSQL/flexibleServers/configurations@2026-01-01-preview' = {
  parent: flexibleServers_palette365_name_resource
  name: 'createrole_self_grant'
  properties: {
    source: 'system-default'
  }
}

resource flexibleServers_palette365_name_credcheck_auth_delay_ms 'Microsoft.DBforPostgreSQL/flexibleServers/configurations@2026-01-01-preview' = {
  parent: flexibleServers_palette365_name_resource
  name: 'credcheck.auth_delay_ms'
  properties: {
    source: 'system-default'
    value: '0'
  }
}

resource flexibleServers_palette365_name_credcheck_auth_failure_cache_size 'Microsoft.DBforPostgreSQL/flexibleServers/configurations@2026-01-01-preview' = {
  parent: flexibleServers_palette365_name_resource
  name: 'credcheck.auth_failure_cache_size'
  properties: {
    source: 'system-default'
    value: '1024'
  }
}

resource flexibleServers_palette365_name_credcheck_encrypted_password_allowed 'Microsoft.DBforPostgreSQL/flexibleServers/configurations@2026-01-01-preview' = {
  parent: flexibleServers_palette365_name_resource
  name: 'credcheck.encrypted_password_allowed'
  properties: {
    source: 'system-default'
    value: 'off'
  }
}

resource flexibleServers_palette365_name_credcheck_history_max_size 'Microsoft.DBforPostgreSQL/flexibleServers/configurations@2026-01-01-preview' = {
  parent: flexibleServers_palette365_name_resource
  name: 'credcheck.history_max_size'
  properties: {
    source: 'system-default'
    value: '65535'
  }
}

resource flexibleServers_palette365_name_credcheck_max_auth_failure 'Microsoft.DBforPostgreSQL/flexibleServers/configurations@2026-01-01-preview' = {
  parent: flexibleServers_palette365_name_resource
  name: 'credcheck.max_auth_failure'
  properties: {
    source: 'system-default'
    value: '0'
  }
}

resource flexibleServers_palette365_name_credcheck_no_password_logging 'Microsoft.DBforPostgreSQL/flexibleServers/configurations@2026-01-01-preview' = {
  parent: flexibleServers_palette365_name_resource
  name: 'credcheck.no_password_logging'
  properties: {
    source: 'system-default'
    value: 'on'
  }
}

resource flexibleServers_palette365_name_credcheck_password_contain 'Microsoft.DBforPostgreSQL/flexibleServers/configurations@2026-01-01-preview' = {
  parent: flexibleServers_palette365_name_resource
  name: 'credcheck.password_contain'
  properties: {
    source: 'system-default'
  }
}

resource flexibleServers_palette365_name_credcheck_password_contain_username 'Microsoft.DBforPostgreSQL/flexibleServers/configurations@2026-01-01-preview' = {
  parent: flexibleServers_palette365_name_resource
  name: 'credcheck.password_contain_username'
  properties: {
    source: 'system-default'
    value: 'on'
  }
}

resource flexibleServers_palette365_name_credcheck_password_ignore_case 'Microsoft.DBforPostgreSQL/flexibleServers/configurations@2026-01-01-preview' = {
  parent: flexibleServers_palette365_name_resource
  name: 'credcheck.password_ignore_case'
  properties: {
    source: 'system-default'
    value: 'off'
  }
}

resource flexibleServers_palette365_name_credcheck_password_min_digit 'Microsoft.DBforPostgreSQL/flexibleServers/configurations@2026-01-01-preview' = {
  parent: flexibleServers_palette365_name_resource
  name: 'credcheck.password_min_digit'
  properties: {
    source: 'system-default'
    value: '0'
  }
}

resource flexibleServers_palette365_name_credcheck_password_min_length 'Microsoft.DBforPostgreSQL/flexibleServers/configurations@2026-01-01-preview' = {
  parent: flexibleServers_palette365_name_resource
  name: 'credcheck.password_min_length'
  properties: {
    source: 'system-default'
    value: '1'
  }
}

resource flexibleServers_palette365_name_credcheck_password_min_lower 'Microsoft.DBforPostgreSQL/flexibleServers/configurations@2026-01-01-preview' = {
  parent: flexibleServers_palette365_name_resource
  name: 'credcheck.password_min_lower'
  properties: {
    source: 'system-default'
    value: '0'
  }
}

resource flexibleServers_palette365_name_credcheck_password_min_repeat 'Microsoft.DBforPostgreSQL/flexibleServers/configurations@2026-01-01-preview' = {
  parent: flexibleServers_palette365_name_resource
  name: 'credcheck.password_min_repeat'
  properties: {
    source: 'system-default'
    value: '0'
  }
}

resource flexibleServers_palette365_name_credcheck_password_min_special 'Microsoft.DBforPostgreSQL/flexibleServers/configurations@2026-01-01-preview' = {
  parent: flexibleServers_palette365_name_resource
  name: 'credcheck.password_min_special'
  properties: {
    source: 'system-default'
    value: '0'
  }
}

resource flexibleServers_palette365_name_credcheck_password_min_upper 'Microsoft.DBforPostgreSQL/flexibleServers/configurations@2026-01-01-preview' = {
  parent: flexibleServers_palette365_name_resource
  name: 'credcheck.password_min_upper'
  properties: {
    source: 'system-default'
    value: '0'
  }
}

resource flexibleServers_palette365_name_credcheck_password_not_contain 'Microsoft.DBforPostgreSQL/flexibleServers/configurations@2026-01-01-preview' = {
  parent: flexibleServers_palette365_name_resource
  name: 'credcheck.password_not_contain'
  properties: {
    source: 'system-default'
  }
}

resource flexibleServers_palette365_name_credcheck_password_reuse_history 'Microsoft.DBforPostgreSQL/flexibleServers/configurations@2026-01-01-preview' = {
  parent: flexibleServers_palette365_name_resource
  name: 'credcheck.password_reuse_history'
  properties: {
    source: 'system-default'
    value: '0'
  }
}

resource flexibleServers_palette365_name_credcheck_password_reuse_interval 'Microsoft.DBforPostgreSQL/flexibleServers/configurations@2026-01-01-preview' = {
  parent: flexibleServers_palette365_name_resource
  name: 'credcheck.password_reuse_interval'
  properties: {
    source: 'system-default'
    value: '0'
  }
}

resource flexibleServers_palette365_name_credcheck_password_valid_max 'Microsoft.DBforPostgreSQL/flexibleServers/configurations@2026-01-01-preview' = {
  parent: flexibleServers_palette365_name_resource
  name: 'credcheck.password_valid_max'
  properties: {
    source: 'system-default'
    value: '0'
  }
}

resource flexibleServers_palette365_name_credcheck_password_valid_until 'Microsoft.DBforPostgreSQL/flexibleServers/configurations@2026-01-01-preview' = {
  parent: flexibleServers_palette365_name_resource
  name: 'credcheck.password_valid_until'
  properties: {
    source: 'system-default'
    value: '0'
  }
}

resource flexibleServers_palette365_name_credcheck_reset_superuser 'Microsoft.DBforPostgreSQL/flexibleServers/configurations@2026-01-01-preview' = {
  parent: flexibleServers_palette365_name_resource
  name: 'credcheck.reset_superuser'
  properties: {
    source: 'system-default'
    value: 'on'
  }
}

resource flexibleServers_palette365_name_credcheck_username_contain 'Microsoft.DBforPostgreSQL/flexibleServers/configurations@2026-01-01-preview' = {
  parent: flexibleServers_palette365_name_resource
  name: 'credcheck.username_contain'
  properties: {
    source: 'system-default'
  }
}

resource flexibleServers_palette365_name_credcheck_username_contain_password 'Microsoft.DBforPostgreSQL/flexibleServers/configurations@2026-01-01-preview' = {
  parent: flexibleServers_palette365_name_resource
  name: 'credcheck.username_contain_password'
  properties: {
    source: 'system-default'
    value: 'on'
  }
}

resource flexibleServers_palette365_name_credcheck_username_ignore_case 'Microsoft.DBforPostgreSQL/flexibleServers/configurations@2026-01-01-preview' = {
  parent: flexibleServers_palette365_name_resource
  name: 'credcheck.username_ignore_case'
  properties: {
    source: 'system-default'
    value: 'off'
  }
}

resource flexibleServers_palette365_name_credcheck_username_min_digit 'Microsoft.DBforPostgreSQL/flexibleServers/configurations@2026-01-01-preview' = {
  parent: flexibleServers_palette365_name_resource
  name: 'credcheck.username_min_digit'
  properties: {
    source: 'system-default'
    value: '0'
  }
}

resource flexibleServers_palette365_name_credcheck_username_min_length 'Microsoft.DBforPostgreSQL/flexibleServers/configurations@2026-01-01-preview' = {
  parent: flexibleServers_palette365_name_resource
  name: 'credcheck.username_min_length'
  properties: {
    source: 'system-default'
    value: '1'
  }
}

resource flexibleServers_palette365_name_credcheck_username_min_lower 'Microsoft.DBforPostgreSQL/flexibleServers/configurations@2026-01-01-preview' = {
  parent: flexibleServers_palette365_name_resource
  name: 'credcheck.username_min_lower'
  properties: {
    source: 'system-default'
    value: '0'
  }
}

resource flexibleServers_palette365_name_credcheck_username_min_repeat 'Microsoft.DBforPostgreSQL/flexibleServers/configurations@2026-01-01-preview' = {
  parent: flexibleServers_palette365_name_resource
  name: 'credcheck.username_min_repeat'
  properties: {
    source: 'system-default'
    value: '0'
  }
}

resource flexibleServers_palette365_name_credcheck_username_min_special 'Microsoft.DBforPostgreSQL/flexibleServers/configurations@2026-01-01-preview' = {
  parent: flexibleServers_palette365_name_resource
  name: 'credcheck.username_min_special'
  properties: {
    source: 'system-default'
    value: '0'
  }
}

resource flexibleServers_palette365_name_credcheck_username_min_upper 'Microsoft.DBforPostgreSQL/flexibleServers/configurations@2026-01-01-preview' = {
  parent: flexibleServers_palette365_name_resource
  name: 'credcheck.username_min_upper'
  properties: {
    source: 'system-default'
    value: '0'
  }
}

resource flexibleServers_palette365_name_credcheck_username_not_contain 'Microsoft.DBforPostgreSQL/flexibleServers/configurations@2026-01-01-preview' = {
  parent: flexibleServers_palette365_name_resource
  name: 'credcheck.username_not_contain'
  properties: {
    source: 'system-default'
  }
}

resource flexibleServers_palette365_name_credcheck_whitelist 'Microsoft.DBforPostgreSQL/flexibleServers/configurations@2026-01-01-preview' = {
  parent: flexibleServers_palette365_name_resource
  name: 'credcheck.whitelist'
  properties: {
    source: 'system-default'
  }
}

resource flexibleServers_palette365_name_credcheck_whitelist_auth_failure 'Microsoft.DBforPostgreSQL/flexibleServers/configurations@2026-01-01-preview' = {
  parent: flexibleServers_palette365_name_resource
  name: 'credcheck.whitelist_auth_failure'
  properties: {
    source: 'system-default'
  }
}

resource flexibleServers_palette365_name_cron_database_name 'Microsoft.DBforPostgreSQL/flexibleServers/configurations@2026-01-01-preview' = {
  parent: flexibleServers_palette365_name_resource
  name: 'cron.database_name'
  properties: {
    source: 'system-default'
    value: 'postgres'
  }
}

resource flexibleServers_palette365_name_cron_enable_superuser_jobs 'Microsoft.DBforPostgreSQL/flexibleServers/configurations@2026-01-01-preview' = {
  parent: flexibleServers_palette365_name_resource
  name: 'cron.enable_superuser_jobs'
  properties: {
    source: 'system-default'
    value: 'off'
  }
}

resource flexibleServers_palette365_name_cron_host 'Microsoft.DBforPostgreSQL/flexibleServers/configurations@2026-01-01-preview' = {
  parent: flexibleServers_palette365_name_resource
  name: 'cron.host'
  properties: {
    source: 'user-override'
    value: '/tmp'
  }
}

resource flexibleServers_palette365_name_cron_launch_active_jobs 'Microsoft.DBforPostgreSQL/flexibleServers/configurations@2026-01-01-preview' = {
  parent: flexibleServers_palette365_name_resource
  name: 'cron.launch_active_jobs'
  properties: {
    source: 'system-default'
    value: 'on'
  }
}

resource flexibleServers_palette365_name_cron_log_min_messages 'Microsoft.DBforPostgreSQL/flexibleServers/configurations@2026-01-01-preview' = {
  parent: flexibleServers_palette365_name_resource
  name: 'cron.log_min_messages'
  properties: {
    source: 'user-override'
    value: 'warning'
  }
}

resource flexibleServers_palette365_name_cron_log_run 'Microsoft.DBforPostgreSQL/flexibleServers/configurations@2026-01-01-preview' = {
  parent: flexibleServers_palette365_name_resource
  name: 'cron.log_run'
  properties: {
    source: 'system-default'
    value: 'on'
  }
}

resource flexibleServers_palette365_name_cron_log_statement 'Microsoft.DBforPostgreSQL/flexibleServers/configurations@2026-01-01-preview' = {
  parent: flexibleServers_palette365_name_resource
  name: 'cron.log_statement'
  properties: {
    source: 'system-default'
    value: 'on'
  }
}

resource flexibleServers_palette365_name_cron_max_running_jobs 'Microsoft.DBforPostgreSQL/flexibleServers/configurations@2026-01-01-preview' = {
  parent: flexibleServers_palette365_name_resource
  name: 'cron.max_running_jobs'
  properties: {
    source: 'system-default'
    value: '32'
  }
}

resource flexibleServers_palette365_name_cron_timezone 'Microsoft.DBforPostgreSQL/flexibleServers/configurations@2026-01-01-preview' = {
  parent: flexibleServers_palette365_name_resource
  name: 'cron.timezone'
  properties: {
    source: 'system-default'
    value: 'GMT'
  }
}

resource flexibleServers_palette365_name_cron_use_background_workers 'Microsoft.DBforPostgreSQL/flexibleServers/configurations@2026-01-01-preview' = {
  parent: flexibleServers_palette365_name_resource
  name: 'cron.use_background_workers'
  properties: {
    source: 'system-default'
    value: 'off'
  }
}

resource flexibleServers_palette365_name_cursor_tuple_fraction 'Microsoft.DBforPostgreSQL/flexibleServers/configurations@2026-01-01-preview' = {
  parent: flexibleServers_palette365_name_resource
  name: 'cursor_tuple_fraction'
  properties: {
    source: 'system-default'
    value: '0.1'
  }
}

resource flexibleServers_palette365_name_data_checksums 'Microsoft.DBforPostgreSQL/flexibleServers/configurations@2026-01-01-preview' = {
  parent: flexibleServers_palette365_name_resource
  name: 'data_checksums'
  properties: {
    source: 'user-override'
    value: 'on'
  }
}

resource flexibleServers_palette365_name_data_directory 'Microsoft.DBforPostgreSQL/flexibleServers/configurations@2026-01-01-preview' = {
  parent: flexibleServers_palette365_name_resource
  name: 'data_directory'
  properties: {
    source: 'user-override'
    value: '/datadrive/pg/data'
  }
}

resource flexibleServers_palette365_name_data_directory_mode 'Microsoft.DBforPostgreSQL/flexibleServers/configurations@2026-01-01-preview' = {
  parent: flexibleServers_palette365_name_resource
  name: 'data_directory_mode'
  properties: {
    source: 'user-override'
    value: '0700'
  }
}

resource flexibleServers_palette365_name_data_sync_retry 'Microsoft.DBforPostgreSQL/flexibleServers/configurations@2026-01-01-preview' = {
  parent: flexibleServers_palette365_name_resource
  name: 'data_sync_retry'
  properties: {
    source: 'system-default'
    value: 'off'
  }
}

resource flexibleServers_palette365_name_DateStyle 'Microsoft.DBforPostgreSQL/flexibleServers/configurations@2026-01-01-preview' = {
  parent: flexibleServers_palette365_name_resource
  name: 'DateStyle'
  properties: {
    source: 'system-default'
    value: 'ISO, MDY'
  }
}

resource flexibleServers_palette365_name_db_user_namespace 'Microsoft.DBforPostgreSQL/flexibleServers/configurations@2026-01-01-preview' = {
  parent: flexibleServers_palette365_name_resource
  name: 'db_user_namespace'
  properties: {
    source: 'system-default'
    value: 'off'
  }
}

resource flexibleServers_palette365_name_deadlock_timeout 'Microsoft.DBforPostgreSQL/flexibleServers/configurations@2026-01-01-preview' = {
  parent: flexibleServers_palette365_name_resource
  name: 'deadlock_timeout'
  properties: {
    source: 'system-default'
    value: '1000'
  }
}

resource flexibleServers_palette365_name_debug_assertions 'Microsoft.DBforPostgreSQL/flexibleServers/configurations@2026-01-01-preview' = {
  parent: flexibleServers_palette365_name_resource
  name: 'debug_assertions'
  properties: {
    source: 'system-default'
    value: 'off'
  }
}

resource flexibleServers_palette365_name_debug_discard_caches 'Microsoft.DBforPostgreSQL/flexibleServers/configurations@2026-01-01-preview' = {
  parent: flexibleServers_palette365_name_resource
  name: 'debug_discard_caches'
  properties: {
    source: 'system-default'
    value: '0'
  }
}

resource flexibleServers_palette365_name_debug_io_direct 'Microsoft.DBforPostgreSQL/flexibleServers/configurations@2026-01-01-preview' = {
  parent: flexibleServers_palette365_name_resource
  name: 'debug_io_direct'
  properties: {
    source: 'system-default'
  }
}

resource flexibleServers_palette365_name_debug_logical_replication_streaming 'Microsoft.DBforPostgreSQL/flexibleServers/configurations@2026-01-01-preview' = {
  parent: flexibleServers_palette365_name_resource
  name: 'debug_logical_replication_streaming'
  properties: {
    source: 'system-default'
    value: 'buffered'
  }
}

resource flexibleServers_palette365_name_debug_parallel_query 'Microsoft.DBforPostgreSQL/flexibleServers/configurations@2026-01-01-preview' = {
  parent: flexibleServers_palette365_name_resource
  name: 'debug_parallel_query'
  properties: {
    source: 'system-default'
    value: 'off'
  }
}

resource flexibleServers_palette365_name_debug_pretty_print 'Microsoft.DBforPostgreSQL/flexibleServers/configurations@2026-01-01-preview' = {
  parent: flexibleServers_palette365_name_resource
  name: 'debug_pretty_print'
  properties: {
    source: 'system-default'
    value: 'on'
  }
}

resource flexibleServers_palette365_name_debug_print_parse 'Microsoft.DBforPostgreSQL/flexibleServers/configurations@2026-01-01-preview' = {
  parent: flexibleServers_palette365_name_resource
  name: 'debug_print_parse'
  properties: {
    source: 'system-default'
    value: 'off'
  }
}

resource flexibleServers_palette365_name_debug_print_plan 'Microsoft.DBforPostgreSQL/flexibleServers/configurations@2026-01-01-preview' = {
  parent: flexibleServers_palette365_name_resource
  name: 'debug_print_plan'
  properties: {
    source: 'system-default'
    value: 'off'
  }
}

resource flexibleServers_palette365_name_debug_print_rewritten 'Microsoft.DBforPostgreSQL/flexibleServers/configurations@2026-01-01-preview' = {
  parent: flexibleServers_palette365_name_resource
  name: 'debug_print_rewritten'
  properties: {
    source: 'system-default'
    value: 'off'
  }
}

resource flexibleServers_palette365_name_default_statistics_target 'Microsoft.DBforPostgreSQL/flexibleServers/configurations@2026-01-01-preview' = {
  parent: flexibleServers_palette365_name_resource
  name: 'default_statistics_target'
  properties: {
    source: 'system-default'
    value: '100'
  }
}

resource flexibleServers_palette365_name_default_table_access_method 'Microsoft.DBforPostgreSQL/flexibleServers/configurations@2026-01-01-preview' = {
  parent: flexibleServers_palette365_name_resource
  name: 'default_table_access_method'
  properties: {
    source: 'system-default'
    value: 'heap'
  }
}

resource flexibleServers_palette365_name_default_tablespace 'Microsoft.DBforPostgreSQL/flexibleServers/configurations@2026-01-01-preview' = {
  parent: flexibleServers_palette365_name_resource
  name: 'default_tablespace'
  properties: {
    source: 'system-default'
  }
}

resource flexibleServers_palette365_name_default_text_search_config 'Microsoft.DBforPostgreSQL/flexibleServers/configurations@2026-01-01-preview' = {
  parent: flexibleServers_palette365_name_resource
  name: 'default_text_search_config'
  properties: {
    source: 'system-default'
    value: 'pg_catalog.english'
  }
}

resource flexibleServers_palette365_name_default_toast_compression 'Microsoft.DBforPostgreSQL/flexibleServers/configurations@2026-01-01-preview' = {
  parent: flexibleServers_palette365_name_resource
  name: 'default_toast_compression'
  properties: {
    source: 'user-override'
    value: 'lz4'
  }
}

resource flexibleServers_palette365_name_default_transaction_deferrable 'Microsoft.DBforPostgreSQL/flexibleServers/configurations@2026-01-01-preview' = {
  parent: flexibleServers_palette365_name_resource
  name: 'default_transaction_deferrable'
  properties: {
    source: 'system-default'
    value: 'off'
  }
}

resource flexibleServers_palette365_name_default_transaction_isolation 'Microsoft.DBforPostgreSQL/flexibleServers/configurations@2026-01-01-preview' = {
  parent: flexibleServers_palette365_name_resource
  name: 'default_transaction_isolation'
  properties: {
    source: 'system-default'
    value: 'read committed'
  }
}

resource flexibleServers_palette365_name_default_transaction_read_only 'Microsoft.DBforPostgreSQL/flexibleServers/configurations@2026-01-01-preview' = {
  parent: flexibleServers_palette365_name_resource
  name: 'default_transaction_read_only'
  properties: {
    source: 'system-default'
    value: 'off'
  }
}

resource flexibleServers_palette365_name_duckdb_max_memory 'Microsoft.DBforPostgreSQL/flexibleServers/configurations@2026-01-01-preview' = {
  parent: flexibleServers_palette365_name_resource
  name: 'duckdb.max_memory'
  properties: {
    source: 'system-default'
    value: '1024'
  }
}

resource flexibleServers_palette365_name_duckdb_max_workers_per_postgres_scan 'Microsoft.DBforPostgreSQL/flexibleServers/configurations@2026-01-01-preview' = {
  parent: flexibleServers_palette365_name_resource
  name: 'duckdb.max_workers_per_postgres_scan'
  properties: {
    source: 'system-default'
    value: '2'
  }
}

resource flexibleServers_palette365_name_duckdb_memory_limit 'Microsoft.DBforPostgreSQL/flexibleServers/configurations@2026-01-01-preview' = {
  parent: flexibleServers_palette365_name_resource
  name: 'duckdb.memory_limit'
  properties: {
    source: 'system-default'
    value: '1024'
  }
}

resource flexibleServers_palette365_name_duckdb_threads 'Microsoft.DBforPostgreSQL/flexibleServers/configurations@2026-01-01-preview' = {
  parent: flexibleServers_palette365_name_resource
  name: 'duckdb.threads'
  properties: {
    source: 'system-default'
    value: '-1'
  }
}

resource flexibleServers_palette365_name_duckdb_worker_threads 'Microsoft.DBforPostgreSQL/flexibleServers/configurations@2026-01-01-preview' = {
  parent: flexibleServers_palette365_name_resource
  name: 'duckdb.worker_threads'
  properties: {
    source: 'system-default'
    value: '-1'
  }
}

resource flexibleServers_palette365_name_dynamic_library_path 'Microsoft.DBforPostgreSQL/flexibleServers/configurations@2026-01-01-preview' = {
  parent: flexibleServers_palette365_name_resource
  name: 'dynamic_library_path'
  properties: {
    source: 'system-default'
    value: '$libdir'
  }
}

resource flexibleServers_palette365_name_dynamic_shared_memory_type 'Microsoft.DBforPostgreSQL/flexibleServers/configurations@2026-01-01-preview' = {
  parent: flexibleServers_palette365_name_resource
  name: 'dynamic_shared_memory_type'
  properties: {
    source: 'system-default'
    value: 'posix'
  }
}

resource flexibleServers_palette365_name_effective_cache_size 'Microsoft.DBforPostgreSQL/flexibleServers/configurations@2026-01-01-preview' = {
  parent: flexibleServers_palette365_name_resource
  name: 'effective_cache_size'
  properties: {
    source: 'system-default'
    value: '393216'
  }
}

resource flexibleServers_palette365_name_effective_io_concurrency 'Microsoft.DBforPostgreSQL/flexibleServers/configurations@2026-01-01-preview' = {
  parent: flexibleServers_palette365_name_resource
  name: 'effective_io_concurrency'
  properties: {
    source: 'system-default'
    value: '1'
  }
}

resource flexibleServers_palette365_name_enable_async_append 'Microsoft.DBforPostgreSQL/flexibleServers/configurations@2026-01-01-preview' = {
  parent: flexibleServers_palette365_name_resource
  name: 'enable_async_append'
  properties: {
    source: 'system-default'
    value: 'on'
  }
}

resource flexibleServers_palette365_name_enable_bitmapscan 'Microsoft.DBforPostgreSQL/flexibleServers/configurations@2026-01-01-preview' = {
  parent: flexibleServers_palette365_name_resource
  name: 'enable_bitmapscan'
  properties: {
    source: 'system-default'
    value: 'on'
  }
}

resource flexibleServers_palette365_name_enable_gathermerge 'Microsoft.DBforPostgreSQL/flexibleServers/configurations@2026-01-01-preview' = {
  parent: flexibleServers_palette365_name_resource
  name: 'enable_gathermerge'
  properties: {
    source: 'system-default'
    value: 'on'
  }
}

resource flexibleServers_palette365_name_enable_group_by_reordering 'Microsoft.DBforPostgreSQL/flexibleServers/configurations@2026-01-01-preview' = {
  parent: flexibleServers_palette365_name_resource
  name: 'enable_group_by_reordering'
  properties: {
    source: 'system-default'
    value: 'on'
  }
}

resource flexibleServers_palette365_name_enable_hashagg 'Microsoft.DBforPostgreSQL/flexibleServers/configurations@2026-01-01-preview' = {
  parent: flexibleServers_palette365_name_resource
  name: 'enable_hashagg'
  properties: {
    source: 'system-default'
    value: 'on'
  }
}

resource flexibleServers_palette365_name_enable_hashjoin 'Microsoft.DBforPostgreSQL/flexibleServers/configurations@2026-01-01-preview' = {
  parent: flexibleServers_palette365_name_resource
  name: 'enable_hashjoin'
  properties: {
    source: 'system-default'
    value: 'on'
  }
}

resource flexibleServers_palette365_name_enable_incremental_sort 'Microsoft.DBforPostgreSQL/flexibleServers/configurations@2026-01-01-preview' = {
  parent: flexibleServers_palette365_name_resource
  name: 'enable_incremental_sort'
  properties: {
    source: 'system-default'
    value: 'on'
  }
}

resource flexibleServers_palette365_name_enable_indexonlyscan 'Microsoft.DBforPostgreSQL/flexibleServers/configurations@2026-01-01-preview' = {
  parent: flexibleServers_palette365_name_resource
  name: 'enable_indexonlyscan'
  properties: {
    source: 'system-default'
    value: 'on'
  }
}

resource flexibleServers_palette365_name_enable_indexscan 'Microsoft.DBforPostgreSQL/flexibleServers/configurations@2026-01-01-preview' = {
  parent: flexibleServers_palette365_name_resource
  name: 'enable_indexscan'
  properties: {
    source: 'system-default'
    value: 'on'
  }
}

resource flexibleServers_palette365_name_enable_material 'Microsoft.DBforPostgreSQL/flexibleServers/configurations@2026-01-01-preview' = {
  parent: flexibleServers_palette365_name_resource
  name: 'enable_material'
  properties: {
    source: 'system-default'
    value: 'on'
  }
}

resource flexibleServers_palette365_name_enable_memoize 'Microsoft.DBforPostgreSQL/flexibleServers/configurations@2026-01-01-preview' = {
  parent: flexibleServers_palette365_name_resource
  name: 'enable_memoize'
  properties: {
    source: 'system-default'
    value: 'on'
  }
}

resource flexibleServers_palette365_name_enable_mergejoin 'Microsoft.DBforPostgreSQL/flexibleServers/configurations@2026-01-01-preview' = {
  parent: flexibleServers_palette365_name_resource
  name: 'enable_mergejoin'
  properties: {
    source: 'system-default'
    value: 'on'
  }
}

resource flexibleServers_palette365_name_enable_nestloop 'Microsoft.DBforPostgreSQL/flexibleServers/configurations@2026-01-01-preview' = {
  parent: flexibleServers_palette365_name_resource
  name: 'enable_nestloop'
  properties: {
    source: 'system-default'
    value: 'on'
  }
}

resource flexibleServers_palette365_name_enable_parallel_append 'Microsoft.DBforPostgreSQL/flexibleServers/configurations@2026-01-01-preview' = {
  parent: flexibleServers_palette365_name_resource
  name: 'enable_parallel_append'
  properties: {
    source: 'system-default'
    value: 'on'
  }
}

resource flexibleServers_palette365_name_enable_parallel_hash 'Microsoft.DBforPostgreSQL/flexibleServers/configurations@2026-01-01-preview' = {
  parent: flexibleServers_palette365_name_resource
  name: 'enable_parallel_hash'
  properties: {
    source: 'system-default'
    value: 'on'
  }
}

resource flexibleServers_palette365_name_enable_partition_pruning 'Microsoft.DBforPostgreSQL/flexibleServers/configurations@2026-01-01-preview' = {
  parent: flexibleServers_palette365_name_resource
  name: 'enable_partition_pruning'
  properties: {
    source: 'system-default'
    value: 'on'
  }
}

resource flexibleServers_palette365_name_enable_partitionwise_aggregate 'Microsoft.DBforPostgreSQL/flexibleServers/configurations@2026-01-01-preview' = {
  parent: flexibleServers_palette365_name_resource
  name: 'enable_partitionwise_aggregate'
  properties: {
    source: 'system-default'
    value: 'off'
  }
}

resource flexibleServers_palette365_name_enable_partitionwise_join 'Microsoft.DBforPostgreSQL/flexibleServers/configurations@2026-01-01-preview' = {
  parent: flexibleServers_palette365_name_resource
  name: 'enable_partitionwise_join'
  properties: {
    source: 'system-default'
    value: 'off'
  }
}

resource flexibleServers_palette365_name_enable_presorted_aggregate 'Microsoft.DBforPostgreSQL/flexibleServers/configurations@2026-01-01-preview' = {
  parent: flexibleServers_palette365_name_resource
  name: 'enable_presorted_aggregate'
  properties: {
    source: 'system-default'
    value: 'on'
  }
}

resource flexibleServers_palette365_name_enable_seqscan 'Microsoft.DBforPostgreSQL/flexibleServers/configurations@2026-01-01-preview' = {
  parent: flexibleServers_palette365_name_resource
  name: 'enable_seqscan'
  properties: {
    source: 'system-default'
    value: 'on'
  }
}

resource flexibleServers_palette365_name_enable_sort 'Microsoft.DBforPostgreSQL/flexibleServers/configurations@2026-01-01-preview' = {
  parent: flexibleServers_palette365_name_resource
  name: 'enable_sort'
  properties: {
    source: 'system-default'
    value: 'on'
  }
}

resource flexibleServers_palette365_name_enable_tidscan 'Microsoft.DBforPostgreSQL/flexibleServers/configurations@2026-01-01-preview' = {
  parent: flexibleServers_palette365_name_resource
  name: 'enable_tidscan'
  properties: {
    source: 'system-default'
    value: 'on'
  }
}

resource flexibleServers_palette365_name_escape_string_warning 'Microsoft.DBforPostgreSQL/flexibleServers/configurations@2026-01-01-preview' = {
  parent: flexibleServers_palette365_name_resource
  name: 'escape_string_warning'
  properties: {
    source: 'system-default'
    value: 'on'
  }
}

resource flexibleServers_palette365_name_event_source 'Microsoft.DBforPostgreSQL/flexibleServers/configurations@2026-01-01-preview' = {
  parent: flexibleServers_palette365_name_resource
  name: 'event_source'
  properties: {
    source: 'system-default'
    value: 'PostgreSQL'
  }
}

resource flexibleServers_palette365_name_event_triggers 'Microsoft.DBforPostgreSQL/flexibleServers/configurations@2026-01-01-preview' = {
  parent: flexibleServers_palette365_name_resource
  name: 'event_triggers'
  properties: {
    source: 'system-default'
    value: 'on'
  }
}

resource flexibleServers_palette365_name_exit_on_error 'Microsoft.DBforPostgreSQL/flexibleServers/configurations@2026-01-01-preview' = {
  parent: flexibleServers_palette365_name_resource
  name: 'exit_on_error'
  properties: {
    source: 'system-default'
    value: 'off'
  }
}

resource flexibleServers_palette365_name_external_pid_file 'Microsoft.DBforPostgreSQL/flexibleServers/configurations@2026-01-01-preview' = {
  parent: flexibleServers_palette365_name_resource
  name: 'external_pid_file'
  properties: {
    source: 'system-default'
  }
}

resource flexibleServers_palette365_name_extra_float_digits 'Microsoft.DBforPostgreSQL/flexibleServers/configurations@2026-01-01-preview' = {
  parent: flexibleServers_palette365_name_resource
  name: 'extra_float_digits'
  properties: {
    source: 'system-default'
    value: '1'
  }
}

resource flexibleServers_palette365_name_from_collapse_limit 'Microsoft.DBforPostgreSQL/flexibleServers/configurations@2026-01-01-preview' = {
  parent: flexibleServers_palette365_name_resource
  name: 'from_collapse_limit'
  properties: {
    source: 'system-default'
    value: '8'
  }
}

resource flexibleServers_palette365_name_fsync 'Microsoft.DBforPostgreSQL/flexibleServers/configurations@2026-01-01-preview' = {
  parent: flexibleServers_palette365_name_resource
  name: 'fsync'
  properties: {
    source: 'system-default'
    value: 'on'
  }
}

resource flexibleServers_palette365_name_full_page_writes 'Microsoft.DBforPostgreSQL/flexibleServers/configurations@2026-01-01-preview' = {
  parent: flexibleServers_palette365_name_resource
  name: 'full_page_writes'
  properties: {
    source: 'system-default'
    value: 'on'
  }
}

resource flexibleServers_palette365_name_geqo 'Microsoft.DBforPostgreSQL/flexibleServers/configurations@2026-01-01-preview' = {
  parent: flexibleServers_palette365_name_resource
  name: 'geqo'
  properties: {
    source: 'system-default'
    value: 'on'
  }
}

resource flexibleServers_palette365_name_geqo_effort 'Microsoft.DBforPostgreSQL/flexibleServers/configurations@2026-01-01-preview' = {
  parent: flexibleServers_palette365_name_resource
  name: 'geqo_effort'
  properties: {
    source: 'system-default'
    value: '5'
  }
}

resource flexibleServers_palette365_name_geqo_generations 'Microsoft.DBforPostgreSQL/flexibleServers/configurations@2026-01-01-preview' = {
  parent: flexibleServers_palette365_name_resource
  name: 'geqo_generations'
  properties: {
    source: 'system-default'
    value: '0'
  }
}

resource flexibleServers_palette365_name_geqo_pool_size 'Microsoft.DBforPostgreSQL/flexibleServers/configurations@2026-01-01-preview' = {
  parent: flexibleServers_palette365_name_resource
  name: 'geqo_pool_size'
  properties: {
    source: 'system-default'
    value: '0'
  }
}

resource flexibleServers_palette365_name_geqo_seed 'Microsoft.DBforPostgreSQL/flexibleServers/configurations@2026-01-01-preview' = {
  parent: flexibleServers_palette365_name_resource
  name: 'geqo_seed'
  properties: {
    source: 'system-default'
    value: '0'
  }
}

resource flexibleServers_palette365_name_geqo_selection_bias 'Microsoft.DBforPostgreSQL/flexibleServers/configurations@2026-01-01-preview' = {
  parent: flexibleServers_palette365_name_resource
  name: 'geqo_selection_bias'
  properties: {
    source: 'system-default'
    value: '2'
  }
}

resource flexibleServers_palette365_name_geqo_threshold 'Microsoft.DBforPostgreSQL/flexibleServers/configurations@2026-01-01-preview' = {
  parent: flexibleServers_palette365_name_resource
  name: 'geqo_threshold'
  properties: {
    source: 'system-default'
    value: '12'
  }
}

resource flexibleServers_palette365_name_gin_fuzzy_search_limit 'Microsoft.DBforPostgreSQL/flexibleServers/configurations@2026-01-01-preview' = {
  parent: flexibleServers_palette365_name_resource
  name: 'gin_fuzzy_search_limit'
  properties: {
    source: 'system-default'
    value: '0'
  }
}

resource flexibleServers_palette365_name_gin_pending_list_limit 'Microsoft.DBforPostgreSQL/flexibleServers/configurations@2026-01-01-preview' = {
  parent: flexibleServers_palette365_name_resource
  name: 'gin_pending_list_limit'
  properties: {
    source: 'system-default'
    value: '4096'
  }
}

resource flexibleServers_palette365_name_gss_accept_delegation 'Microsoft.DBforPostgreSQL/flexibleServers/configurations@2026-01-01-preview' = {
  parent: flexibleServers_palette365_name_resource
  name: 'gss_accept_delegation'
  properties: {
    source: 'system-default'
    value: 'off'
  }
}

resource flexibleServers_palette365_name_hash_mem_multiplier 'Microsoft.DBforPostgreSQL/flexibleServers/configurations@2026-01-01-preview' = {
  parent: flexibleServers_palette365_name_resource
  name: 'hash_mem_multiplier'
  properties: {
    source: 'system-default'
    value: '2'
  }
}

resource flexibleServers_palette365_name_hba_file 'Microsoft.DBforPostgreSQL/flexibleServers/configurations@2026-01-01-preview' = {
  parent: flexibleServers_palette365_name_resource
  name: 'hba_file'
  properties: {
    source: 'user-override'
    value: '/datadrive/pg/data/pg_hba.conf'
  }
}

resource flexibleServers_palette365_name_hot_standby 'Microsoft.DBforPostgreSQL/flexibleServers/configurations@2026-01-01-preview' = {
  parent: flexibleServers_palette365_name_resource
  name: 'hot_standby'
  properties: {
    source: 'system-default'
    value: 'on'
  }
}

resource flexibleServers_palette365_name_hot_standby_feedback 'Microsoft.DBforPostgreSQL/flexibleServers/configurations@2026-01-01-preview' = {
  parent: flexibleServers_palette365_name_resource
  name: 'hot_standby_feedback'
  properties: {
    source: 'system-default'
    value: 'off'
  }
}

resource flexibleServers_palette365_name_huge_page_size 'Microsoft.DBforPostgreSQL/flexibleServers/configurations@2026-01-01-preview' = {
  parent: flexibleServers_palette365_name_resource
  name: 'huge_page_size'
  properties: {
    source: 'system-default'
    value: '0'
  }
}

resource flexibleServers_palette365_name_huge_pages 'Microsoft.DBforPostgreSQL/flexibleServers/configurations@2026-01-01-preview' = {
  parent: flexibleServers_palette365_name_resource
  name: 'huge_pages'
  properties: {
    source: 'system-default'
    value: 'try'
  }
}

resource flexibleServers_palette365_name_huge_pages_status 'Microsoft.DBforPostgreSQL/flexibleServers/configurations@2026-01-01-preview' = {
  parent: flexibleServers_palette365_name_resource
  name: 'huge_pages_status'
  properties: {
    source: 'user-override'
    value: 'off'
  }
}

resource flexibleServers_palette365_name_icu_validation_level 'Microsoft.DBforPostgreSQL/flexibleServers/configurations@2026-01-01-preview' = {
  parent: flexibleServers_palette365_name_resource
  name: 'icu_validation_level'
  properties: {
    source: 'system-default'
    value: 'warning'
  }
}

resource flexibleServers_palette365_name_ident_file 'Microsoft.DBforPostgreSQL/flexibleServers/configurations@2026-01-01-preview' = {
  parent: flexibleServers_palette365_name_resource
  name: 'ident_file'
  properties: {
    source: 'user-override'
    value: '/datadrive/pg/data/pg_ident.conf'
  }
}

resource flexibleServers_palette365_name_idle_in_transaction_session_timeout 'Microsoft.DBforPostgreSQL/flexibleServers/configurations@2026-01-01-preview' = {
  parent: flexibleServers_palette365_name_resource
  name: 'idle_in_transaction_session_timeout'
  properties: {
    source: 'system-default'
    value: '0'
  }
}

resource flexibleServers_palette365_name_idle_session_timeout 'Microsoft.DBforPostgreSQL/flexibleServers/configurations@2026-01-01-preview' = {
  parent: flexibleServers_palette365_name_resource
  name: 'idle_session_timeout'
  properties: {
    source: 'system-default'
    value: '0'
  }
}

resource flexibleServers_palette365_name_ignore_checksum_failure 'Microsoft.DBforPostgreSQL/flexibleServers/configurations@2026-01-01-preview' = {
  parent: flexibleServers_palette365_name_resource
  name: 'ignore_checksum_failure'
  properties: {
    source: 'system-default'
    value: 'off'
  }
}

resource flexibleServers_palette365_name_ignore_invalid_pages 'Microsoft.DBforPostgreSQL/flexibleServers/configurations@2026-01-01-preview' = {
  parent: flexibleServers_palette365_name_resource
  name: 'ignore_invalid_pages'
  properties: {
    source: 'system-default'
    value: 'off'
  }
}

resource flexibleServers_palette365_name_ignore_system_indexes 'Microsoft.DBforPostgreSQL/flexibleServers/configurations@2026-01-01-preview' = {
  parent: flexibleServers_palette365_name_resource
  name: 'ignore_system_indexes'
  properties: {
    source: 'system-default'
    value: 'off'
  }
}

resource flexibleServers_palette365_name_in_hot_standby 'Microsoft.DBforPostgreSQL/flexibleServers/configurations@2026-01-01-preview' = {
  parent: flexibleServers_palette365_name_resource
  name: 'in_hot_standby'
  properties: {
    source: 'system-default'
    value: 'off'
  }
}

resource flexibleServers_palette365_name_integer_datetimes 'Microsoft.DBforPostgreSQL/flexibleServers/configurations@2026-01-01-preview' = {
  parent: flexibleServers_palette365_name_resource
  name: 'integer_datetimes'
  properties: {
    source: 'system-default'
    value: 'on'
  }
}

resource flexibleServers_palette365_name_intelligent_tuning 'Microsoft.DBforPostgreSQL/flexibleServers/configurations@2026-01-01-preview' = {
  parent: flexibleServers_palette365_name_resource
  name: 'intelligent_tuning'
  properties: {
    source: 'system-default'
    value: 'off'
  }
}

resource flexibleServers_palette365_name_intelligent_tuning_metric_targets 'Microsoft.DBforPostgreSQL/flexibleServers/configurations@2026-01-01-preview' = {
  parent: flexibleServers_palette365_name_resource
  name: 'intelligent_tuning.metric_targets'
  properties: {
    source: 'system-default'
    value: 'none'
  }
}

resource flexibleServers_palette365_name_IntervalStyle 'Microsoft.DBforPostgreSQL/flexibleServers/configurations@2026-01-01-preview' = {
  parent: flexibleServers_palette365_name_resource
  name: 'IntervalStyle'
  properties: {
    source: 'system-default'
    value: 'postgres'
  }
}

resource flexibleServers_palette365_name_io_combine_limit 'Microsoft.DBforPostgreSQL/flexibleServers/configurations@2026-01-01-preview' = {
  parent: flexibleServers_palette365_name_resource
  name: 'io_combine_limit'
  properties: {
    source: 'system-default'
    value: '16'
  }
}

resource flexibleServers_palette365_name_jit 'Microsoft.DBforPostgreSQL/flexibleServers/configurations@2026-01-01-preview' = {
  parent: flexibleServers_palette365_name_resource
  name: 'jit'
  properties: {
    source: 'system-default'
    value: 'off'
  }
}

resource flexibleServers_palette365_name_jit_above_cost 'Microsoft.DBforPostgreSQL/flexibleServers/configurations@2026-01-01-preview' = {
  parent: flexibleServers_palette365_name_resource
  name: 'jit_above_cost'
  properties: {
    source: 'system-default'
    value: '100000'
  }
}

resource flexibleServers_palette365_name_jit_debugging_support 'Microsoft.DBforPostgreSQL/flexibleServers/configurations@2026-01-01-preview' = {
  parent: flexibleServers_palette365_name_resource
  name: 'jit_debugging_support'
  properties: {
    source: 'system-default'
    value: 'off'
  }
}

resource flexibleServers_palette365_name_jit_dump_bitcode 'Microsoft.DBforPostgreSQL/flexibleServers/configurations@2026-01-01-preview' = {
  parent: flexibleServers_palette365_name_resource
  name: 'jit_dump_bitcode'
  properties: {
    source: 'system-default'
    value: 'off'
  }
}

resource flexibleServers_palette365_name_jit_expressions 'Microsoft.DBforPostgreSQL/flexibleServers/configurations@2026-01-01-preview' = {
  parent: flexibleServers_palette365_name_resource
  name: 'jit_expressions'
  properties: {
    source: 'system-default'
    value: 'on'
  }
}

resource flexibleServers_palette365_name_jit_inline_above_cost 'Microsoft.DBforPostgreSQL/flexibleServers/configurations@2026-01-01-preview' = {
  parent: flexibleServers_palette365_name_resource
  name: 'jit_inline_above_cost'
  properties: {
    source: 'system-default'
    value: '500000'
  }
}

resource flexibleServers_palette365_name_jit_optimize_above_cost 'Microsoft.DBforPostgreSQL/flexibleServers/configurations@2026-01-01-preview' = {
  parent: flexibleServers_palette365_name_resource
  name: 'jit_optimize_above_cost'
  properties: {
    source: 'system-default'
    value: '500000'
  }
}

resource flexibleServers_palette365_name_jit_profiling_support 'Microsoft.DBforPostgreSQL/flexibleServers/configurations@2026-01-01-preview' = {
  parent: flexibleServers_palette365_name_resource
  name: 'jit_profiling_support'
  properties: {
    source: 'system-default'
    value: 'off'
  }
}

resource flexibleServers_palette365_name_jit_provider 'Microsoft.DBforPostgreSQL/flexibleServers/configurations@2026-01-01-preview' = {
  parent: flexibleServers_palette365_name_resource
  name: 'jit_provider'
  properties: {
    source: 'system-default'
    value: 'llvmjit'
  }
}

resource flexibleServers_palette365_name_jit_tuple_deforming 'Microsoft.DBforPostgreSQL/flexibleServers/configurations@2026-01-01-preview' = {
  parent: flexibleServers_palette365_name_resource
  name: 'jit_tuple_deforming'
  properties: {
    source: 'system-default'
    value: 'on'
  }
}

resource flexibleServers_palette365_name_join_collapse_limit 'Microsoft.DBforPostgreSQL/flexibleServers/configurations@2026-01-01-preview' = {
  parent: flexibleServers_palette365_name_resource
  name: 'join_collapse_limit'
  properties: {
    source: 'system-default'
    value: '8'
  }
}

resource flexibleServers_palette365_name_krb_caseins_users 'Microsoft.DBforPostgreSQL/flexibleServers/configurations@2026-01-01-preview' = {
  parent: flexibleServers_palette365_name_resource
  name: 'krb_caseins_users'
  properties: {
    source: 'system-default'
    value: 'off'
  }
}

resource flexibleServers_palette365_name_krb_server_keyfile 'Microsoft.DBforPostgreSQL/flexibleServers/configurations@2026-01-01-preview' = {
  parent: flexibleServers_palette365_name_resource
  name: 'krb_server_keyfile'
  properties: {
    source: 'system-default'
  }
}

resource flexibleServers_palette365_name_lc_messages 'Microsoft.DBforPostgreSQL/flexibleServers/configurations@2026-01-01-preview' = {
  parent: flexibleServers_palette365_name_resource
  name: 'lc_messages'
  properties: {
    source: 'user-override'
    value: 'en_US.utf8'
  }
}

resource flexibleServers_palette365_name_lc_monetary 'Microsoft.DBforPostgreSQL/flexibleServers/configurations@2026-01-01-preview' = {
  parent: flexibleServers_palette365_name_resource
  name: 'lc_monetary'
  properties: {
    source: 'system-default'
    value: 'en_US.utf-8'
  }
}

resource flexibleServers_palette365_name_lc_numeric 'Microsoft.DBforPostgreSQL/flexibleServers/configurations@2026-01-01-preview' = {
  parent: flexibleServers_palette365_name_resource
  name: 'lc_numeric'
  properties: {
    source: 'system-default'
    value: 'en_US.utf-8'
  }
}

resource flexibleServers_palette365_name_lc_time 'Microsoft.DBforPostgreSQL/flexibleServers/configurations@2026-01-01-preview' = {
  parent: flexibleServers_palette365_name_resource
  name: 'lc_time'
  properties: {
    source: 'user-override'
    value: 'en_US.utf8'
  }
}

resource flexibleServers_palette365_name_listen_addresses 'Microsoft.DBforPostgreSQL/flexibleServers/configurations@2026-01-01-preview' = {
  parent: flexibleServers_palette365_name_resource
  name: 'listen_addresses'
  properties: {
    source: 'user-override'
    value: '*'
  }
}

resource flexibleServers_palette365_name_lo_compat_privileges 'Microsoft.DBforPostgreSQL/flexibleServers/configurations@2026-01-01-preview' = {
  parent: flexibleServers_palette365_name_resource
  name: 'lo_compat_privileges'
  properties: {
    source: 'system-default'
    value: 'off'
  }
}

resource flexibleServers_palette365_name_local_preload_libraries 'Microsoft.DBforPostgreSQL/flexibleServers/configurations@2026-01-01-preview' = {
  parent: flexibleServers_palette365_name_resource
  name: 'local_preload_libraries'
  properties: {
    source: 'system-default'
  }
}

resource flexibleServers_palette365_name_lock_timeout 'Microsoft.DBforPostgreSQL/flexibleServers/configurations@2026-01-01-preview' = {
  parent: flexibleServers_palette365_name_resource
  name: 'lock_timeout'
  properties: {
    source: 'system-default'
    value: '0'
  }
}

resource flexibleServers_palette365_name_log_autovacuum_min_duration 'Microsoft.DBforPostgreSQL/flexibleServers/configurations@2026-01-01-preview' = {
  parent: flexibleServers_palette365_name_resource
  name: 'log_autovacuum_min_duration'
  properties: {
    source: 'system-default'
    value: '-1'
  }
}

resource flexibleServers_palette365_name_log_checkpoints 'Microsoft.DBforPostgreSQL/flexibleServers/configurations@2026-01-01-preview' = {
  parent: flexibleServers_palette365_name_resource
  name: 'log_checkpoints'
  properties: {
    source: 'system-default'
    value: 'on'
  }
}

resource flexibleServers_palette365_name_log_connections 'Microsoft.DBforPostgreSQL/flexibleServers/configurations@2026-01-01-preview' = {
  parent: flexibleServers_palette365_name_resource
  name: 'log_connections'
  properties: {
    source: 'system-default'
    value: 'on'
  }
}

resource flexibleServers_palette365_name_log_destination 'Microsoft.DBforPostgreSQL/flexibleServers/configurations@2026-01-01-preview' = {
  parent: flexibleServers_palette365_name_resource
  name: 'log_destination'
  properties: {
    source: 'system-default'
    value: 'stderr'
  }
}

resource flexibleServers_palette365_name_log_directory 'Microsoft.DBforPostgreSQL/flexibleServers/configurations@2026-01-01-preview' = {
  parent: flexibleServers_palette365_name_resource
  name: 'log_directory'
  properties: {
    source: 'system-default'
    value: 'log'
  }
}

resource flexibleServers_palette365_name_log_disconnections 'Microsoft.DBforPostgreSQL/flexibleServers/configurations@2026-01-01-preview' = {
  parent: flexibleServers_palette365_name_resource
  name: 'log_disconnections'
  properties: {
    source: 'system-default'
    value: 'on'
  }
}

resource flexibleServers_palette365_name_log_duration 'Microsoft.DBforPostgreSQL/flexibleServers/configurations@2026-01-01-preview' = {
  parent: flexibleServers_palette365_name_resource
  name: 'log_duration'
  properties: {
    source: 'system-default'
    value: 'off'
  }
}

resource flexibleServers_palette365_name_log_error_verbosity 'Microsoft.DBforPostgreSQL/flexibleServers/configurations@2026-01-01-preview' = {
  parent: flexibleServers_palette365_name_resource
  name: 'log_error_verbosity'
  properties: {
    source: 'system-default'
    value: 'default'
  }
}

resource flexibleServers_palette365_name_log_executor_stats 'Microsoft.DBforPostgreSQL/flexibleServers/configurations@2026-01-01-preview' = {
  parent: flexibleServers_palette365_name_resource
  name: 'log_executor_stats'
  properties: {
    source: 'system-default'
    value: 'off'
  }
}

resource flexibleServers_palette365_name_log_file_mode 'Microsoft.DBforPostgreSQL/flexibleServers/configurations@2026-01-01-preview' = {
  parent: flexibleServers_palette365_name_resource
  name: 'log_file_mode'
  properties: {
    source: 'user-override'
    value: '0600'
  }
}

resource flexibleServers_palette365_name_log_filename 'Microsoft.DBforPostgreSQL/flexibleServers/configurations@2026-01-01-preview' = {
  parent: flexibleServers_palette365_name_resource
  name: 'log_filename'
  properties: {
    source: 'system-default'
    value: 'postgresql-%Y-%m-%d_%H%M%S.log'
  }
}

resource flexibleServers_palette365_name_log_hostname 'Microsoft.DBforPostgreSQL/flexibleServers/configurations@2026-01-01-preview' = {
  parent: flexibleServers_palette365_name_resource
  name: 'log_hostname'
  properties: {
    source: 'system-default'
    value: 'off'
  }
}

resource flexibleServers_palette365_name_log_line_prefix 'Microsoft.DBforPostgreSQL/flexibleServers/configurations@2026-01-01-preview' = {
  parent: flexibleServers_palette365_name_resource
  name: 'log_line_prefix'
  properties: {
    source: 'system-default'
    value: '%t-%c-'
  }
}

resource flexibleServers_palette365_name_log_lock_waits 'Microsoft.DBforPostgreSQL/flexibleServers/configurations@2026-01-01-preview' = {
  parent: flexibleServers_palette365_name_resource
  name: 'log_lock_waits'
  properties: {
    source: 'system-default'
    value: 'off'
  }
}

resource flexibleServers_palette365_name_log_min_duration_sample 'Microsoft.DBforPostgreSQL/flexibleServers/configurations@2026-01-01-preview' = {
  parent: flexibleServers_palette365_name_resource
  name: 'log_min_duration_sample'
  properties: {
    source: 'system-default'
    value: '-1'
  }
}

resource flexibleServers_palette365_name_log_min_duration_statement 'Microsoft.DBforPostgreSQL/flexibleServers/configurations@2026-01-01-preview' = {
  parent: flexibleServers_palette365_name_resource
  name: 'log_min_duration_statement'
  properties: {
    source: 'system-default'
    value: '-1'
  }
}

resource flexibleServers_palette365_name_log_min_error_statement 'Microsoft.DBforPostgreSQL/flexibleServers/configurations@2026-01-01-preview' = {
  parent: flexibleServers_palette365_name_resource
  name: 'log_min_error_statement'
  properties: {
    source: 'system-default'
    value: 'error'
  }
}

resource flexibleServers_palette365_name_log_min_messages 'Microsoft.DBforPostgreSQL/flexibleServers/configurations@2026-01-01-preview' = {
  parent: flexibleServers_palette365_name_resource
  name: 'log_min_messages'
  properties: {
    source: 'system-default'
    value: 'warning'
  }
}

resource flexibleServers_palette365_name_log_parameter_max_length 'Microsoft.DBforPostgreSQL/flexibleServers/configurations@2026-01-01-preview' = {
  parent: flexibleServers_palette365_name_resource
  name: 'log_parameter_max_length'
  properties: {
    source: 'system-default'
    value: '-1'
  }
}

resource flexibleServers_palette365_name_log_parameter_max_length_on_error 'Microsoft.DBforPostgreSQL/flexibleServers/configurations@2026-01-01-preview' = {
  parent: flexibleServers_palette365_name_resource
  name: 'log_parameter_max_length_on_error'
  properties: {
    source: 'system-default'
    value: '0'
  }
}

resource flexibleServers_palette365_name_log_parser_stats 'Microsoft.DBforPostgreSQL/flexibleServers/configurations@2026-01-01-preview' = {
  parent: flexibleServers_palette365_name_resource
  name: 'log_parser_stats'
  properties: {
    source: 'system-default'
    value: 'off'
  }
}

resource flexibleServers_palette365_name_log_planner_stats 'Microsoft.DBforPostgreSQL/flexibleServers/configurations@2026-01-01-preview' = {
  parent: flexibleServers_palette365_name_resource
  name: 'log_planner_stats'
  properties: {
    source: 'system-default'
    value: 'off'
  }
}

resource flexibleServers_palette365_name_log_recovery_conflict_waits 'Microsoft.DBforPostgreSQL/flexibleServers/configurations@2026-01-01-preview' = {
  parent: flexibleServers_palette365_name_resource
  name: 'log_recovery_conflict_waits'
  properties: {
    source: 'system-default'
    value: 'off'
  }
}

resource flexibleServers_palette365_name_log_replication_commands 'Microsoft.DBforPostgreSQL/flexibleServers/configurations@2026-01-01-preview' = {
  parent: flexibleServers_palette365_name_resource
  name: 'log_replication_commands'
  properties: {
    source: 'system-default'
    value: 'on'
  }
}

resource flexibleServers_palette365_name_log_rotation_age 'Microsoft.DBforPostgreSQL/flexibleServers/configurations@2026-01-01-preview' = {
  parent: flexibleServers_palette365_name_resource
  name: 'log_rotation_age'
  properties: {
    source: 'user-override'
    value: '60'
  }
}

resource flexibleServers_palette365_name_log_rotation_size 'Microsoft.DBforPostgreSQL/flexibleServers/configurations@2026-01-01-preview' = {
  parent: flexibleServers_palette365_name_resource
  name: 'log_rotation_size'
  properties: {
    source: 'user-override'
    value: '102400'
  }
}

resource flexibleServers_palette365_name_log_startup_progress_interval 'Microsoft.DBforPostgreSQL/flexibleServers/configurations@2026-01-01-preview' = {
  parent: flexibleServers_palette365_name_resource
  name: 'log_startup_progress_interval'
  properties: {
    source: 'system-default'
    value: '10000'
  }
}

resource flexibleServers_palette365_name_log_statement 'Microsoft.DBforPostgreSQL/flexibleServers/configurations@2026-01-01-preview' = {
  parent: flexibleServers_palette365_name_resource
  name: 'log_statement'
  properties: {
    source: 'system-default'
    value: 'none'
  }
}

resource flexibleServers_palette365_name_log_statement_sample_rate 'Microsoft.DBforPostgreSQL/flexibleServers/configurations@2026-01-01-preview' = {
  parent: flexibleServers_palette365_name_resource
  name: 'log_statement_sample_rate'
  properties: {
    source: 'system-default'
    value: '1'
  }
}

resource flexibleServers_palette365_name_log_statement_stats 'Microsoft.DBforPostgreSQL/flexibleServers/configurations@2026-01-01-preview' = {
  parent: flexibleServers_palette365_name_resource
  name: 'log_statement_stats'
  properties: {
    source: 'system-default'
    value: 'off'
  }
}

resource flexibleServers_palette365_name_log_temp_files 'Microsoft.DBforPostgreSQL/flexibleServers/configurations@2026-01-01-preview' = {
  parent: flexibleServers_palette365_name_resource
  name: 'log_temp_files'
  properties: {
    source: 'system-default'
    value: '-1'
  }
}

resource flexibleServers_palette365_name_log_timezone 'Microsoft.DBforPostgreSQL/flexibleServers/configurations@2026-01-01-preview' = {
  parent: flexibleServers_palette365_name_resource
  name: 'log_timezone'
  properties: {
    source: 'user-override'
    value: 'UTC'
  }
}

resource flexibleServers_palette365_name_log_transaction_sample_rate 'Microsoft.DBforPostgreSQL/flexibleServers/configurations@2026-01-01-preview' = {
  parent: flexibleServers_palette365_name_resource
  name: 'log_transaction_sample_rate'
  properties: {
    source: 'system-default'
    value: '0'
  }
}

resource flexibleServers_palette365_name_log_truncate_on_rotation 'Microsoft.DBforPostgreSQL/flexibleServers/configurations@2026-01-01-preview' = {
  parent: flexibleServers_palette365_name_resource
  name: 'log_truncate_on_rotation'
  properties: {
    source: 'system-default'
    value: 'off'
  }
}

resource flexibleServers_palette365_name_logfiles_download_enable 'Microsoft.DBforPostgreSQL/flexibleServers/configurations@2026-01-01-preview' = {
  parent: flexibleServers_palette365_name_resource
  name: 'logfiles.download_enable'
  properties: {
    source: 'system-default'
    value: 'off'
  }
}

resource flexibleServers_palette365_name_logfiles_retention_days 'Microsoft.DBforPostgreSQL/flexibleServers/configurations@2026-01-01-preview' = {
  parent: flexibleServers_palette365_name_resource
  name: 'logfiles.retention_days'
  properties: {
    source: 'system-default'
    value: '3'
  }
}

resource flexibleServers_palette365_name_logging_collector 'Microsoft.DBforPostgreSQL/flexibleServers/configurations@2026-01-01-preview' = {
  parent: flexibleServers_palette365_name_resource
  name: 'logging_collector'
  properties: {
    source: 'system-default'
    value: 'off'
  }
}

resource flexibleServers_palette365_name_logical_decoding_work_mem 'Microsoft.DBforPostgreSQL/flexibleServers/configurations@2026-01-01-preview' = {
  parent: flexibleServers_palette365_name_resource
  name: 'logical_decoding_work_mem'
  properties: {
    source: 'system-default'
    value: '65536'
  }
}

resource flexibleServers_palette365_name_maintenance_io_concurrency 'Microsoft.DBforPostgreSQL/flexibleServers/configurations@2026-01-01-preview' = {
  parent: flexibleServers_palette365_name_resource
  name: 'maintenance_io_concurrency'
  properties: {
    source: 'system-default'
    value: '10'
  }
}

resource flexibleServers_palette365_name_maintenance_work_mem 'Microsoft.DBforPostgreSQL/flexibleServers/configurations@2026-01-01-preview' = {
  parent: flexibleServers_palette365_name_resource
  name: 'maintenance_work_mem'
  properties: {
    source: 'system-default'
    value: '157696'
  }
}

resource flexibleServers_palette365_name_max_connections 'Microsoft.DBforPostgreSQL/flexibleServers/configurations@2026-01-01-preview' = {
  parent: flexibleServers_palette365_name_resource
  name: 'max_connections'
  properties: {
    source: 'system-default'
    value: '429'
  }
}

resource flexibleServers_palette365_name_max_files_per_process 'Microsoft.DBforPostgreSQL/flexibleServers/configurations@2026-01-01-preview' = {
  parent: flexibleServers_palette365_name_resource
  name: 'max_files_per_process'
  properties: {
    source: 'system-default'
    value: '1000'
  }
}

resource flexibleServers_palette365_name_max_function_args 'Microsoft.DBforPostgreSQL/flexibleServers/configurations@2026-01-01-preview' = {
  parent: flexibleServers_palette365_name_resource
  name: 'max_function_args'
  properties: {
    source: 'system-default'
    value: '100'
  }
}

resource flexibleServers_palette365_name_max_identifier_length 'Microsoft.DBforPostgreSQL/flexibleServers/configurations@2026-01-01-preview' = {
  parent: flexibleServers_palette365_name_resource
  name: 'max_identifier_length'
  properties: {
    source: 'system-default'
    value: '63'
  }
}

resource flexibleServers_palette365_name_max_index_keys 'Microsoft.DBforPostgreSQL/flexibleServers/configurations@2026-01-01-preview' = {
  parent: flexibleServers_palette365_name_resource
  name: 'max_index_keys'
  properties: {
    source: 'system-default'
    value: '32'
  }
}

resource flexibleServers_palette365_name_max_locks_per_transaction 'Microsoft.DBforPostgreSQL/flexibleServers/configurations@2026-01-01-preview' = {
  parent: flexibleServers_palette365_name_resource
  name: 'max_locks_per_transaction'
  properties: {
    source: 'system-default'
    value: '64'
  }
}

resource flexibleServers_palette365_name_max_logical_replication_workers 'Microsoft.DBforPostgreSQL/flexibleServers/configurations@2026-01-01-preview' = {
  parent: flexibleServers_palette365_name_resource
  name: 'max_logical_replication_workers'
  properties: {
    source: 'system-default'
    value: '4'
  }
}

resource flexibleServers_palette365_name_max_notify_queue_pages 'Microsoft.DBforPostgreSQL/flexibleServers/configurations@2026-01-01-preview' = {
  parent: flexibleServers_palette365_name_resource
  name: 'max_notify_queue_pages'
  properties: {
    source: 'system-default'
    value: '1048576'
  }
}

resource flexibleServers_palette365_name_max_parallel_apply_workers_per_subscription 'Microsoft.DBforPostgreSQL/flexibleServers/configurations@2026-01-01-preview' = {
  parent: flexibleServers_palette365_name_resource
  name: 'max_parallel_apply_workers_per_subscription'
  properties: {
    source: 'system-default'
    value: '2'
  }
}

resource flexibleServers_palette365_name_max_parallel_maintenance_workers 'Microsoft.DBforPostgreSQL/flexibleServers/configurations@2026-01-01-preview' = {
  parent: flexibleServers_palette365_name_resource
  name: 'max_parallel_maintenance_workers'
  properties: {
    source: 'system-default'
    value: '2'
  }
}

resource flexibleServers_palette365_name_max_parallel_workers 'Microsoft.DBforPostgreSQL/flexibleServers/configurations@2026-01-01-preview' = {
  parent: flexibleServers_palette365_name_resource
  name: 'max_parallel_workers'
  properties: {
    source: 'system-default'
    value: '8'
  }
}

resource flexibleServers_palette365_name_max_parallel_workers_per_gather 'Microsoft.DBforPostgreSQL/flexibleServers/configurations@2026-01-01-preview' = {
  parent: flexibleServers_palette365_name_resource
  name: 'max_parallel_workers_per_gather'
  properties: {
    source: 'system-default'
    value: '2'
  }
}

resource flexibleServers_palette365_name_max_pred_locks_per_page 'Microsoft.DBforPostgreSQL/flexibleServers/configurations@2026-01-01-preview' = {
  parent: flexibleServers_palette365_name_resource
  name: 'max_pred_locks_per_page'
  properties: {
    source: 'system-default'
    value: '2'
  }
}

resource flexibleServers_palette365_name_max_pred_locks_per_relation 'Microsoft.DBforPostgreSQL/flexibleServers/configurations@2026-01-01-preview' = {
  parent: flexibleServers_palette365_name_resource
  name: 'max_pred_locks_per_relation'
  properties: {
    source: 'system-default'
    value: '-2'
  }
}

resource flexibleServers_palette365_name_max_pred_locks_per_transaction 'Microsoft.DBforPostgreSQL/flexibleServers/configurations@2026-01-01-preview' = {
  parent: flexibleServers_palette365_name_resource
  name: 'max_pred_locks_per_transaction'
  properties: {
    source: 'system-default'
    value: '64'
  }
}

resource flexibleServers_palette365_name_max_prepared_transactions 'Microsoft.DBforPostgreSQL/flexibleServers/configurations@2026-01-01-preview' = {
  parent: flexibleServers_palette365_name_resource
  name: 'max_prepared_transactions'
  properties: {
    source: 'system-default'
    value: '0'
  }
}

resource flexibleServers_palette365_name_max_replication_slots 'Microsoft.DBforPostgreSQL/flexibleServers/configurations@2026-01-01-preview' = {
  parent: flexibleServers_palette365_name_resource
  name: 'max_replication_slots'
  properties: {
    source: 'system-default'
    value: '10'
  }
}

resource flexibleServers_palette365_name_max_slot_wal_keep_size 'Microsoft.DBforPostgreSQL/flexibleServers/configurations@2026-01-01-preview' = {
  parent: flexibleServers_palette365_name_resource
  name: 'max_slot_wal_keep_size'
  properties: {
    source: 'system-default'
    value: '-1'
  }
}

resource flexibleServers_palette365_name_max_stack_depth 'Microsoft.DBforPostgreSQL/flexibleServers/configurations@2026-01-01-preview' = {
  parent: flexibleServers_palette365_name_resource
  name: 'max_stack_depth'
  properties: {
    source: 'user-override'
    value: '2048'
  }
}

resource flexibleServers_palette365_name_max_standby_archive_delay 'Microsoft.DBforPostgreSQL/flexibleServers/configurations@2026-01-01-preview' = {
  parent: flexibleServers_palette365_name_resource
  name: 'max_standby_archive_delay'
  properties: {
    source: 'system-default'
    value: '30000'
  }
}

resource flexibleServers_palette365_name_max_standby_streaming_delay 'Microsoft.DBforPostgreSQL/flexibleServers/configurations@2026-01-01-preview' = {
  parent: flexibleServers_palette365_name_resource
  name: 'max_standby_streaming_delay'
  properties: {
    source: 'system-default'
    value: '30000'
  }
}

resource flexibleServers_palette365_name_max_sync_workers_per_subscription 'Microsoft.DBforPostgreSQL/flexibleServers/configurations@2026-01-01-preview' = {
  parent: flexibleServers_palette365_name_resource
  name: 'max_sync_workers_per_subscription'
  properties: {
    source: 'system-default'
    value: '2'
  }
}

resource flexibleServers_palette365_name_max_wal_senders 'Microsoft.DBforPostgreSQL/flexibleServers/configurations@2026-01-01-preview' = {
  parent: flexibleServers_palette365_name_resource
  name: 'max_wal_senders'
  properties: {
    source: 'system-default'
    value: '10'
  }
}

resource flexibleServers_palette365_name_max_wal_size 'Microsoft.DBforPostgreSQL/flexibleServers/configurations@2026-01-01-preview' = {
  parent: flexibleServers_palette365_name_resource
  name: 'max_wal_size'
  properties: {
    source: 'system-default'
    value: '2048'
  }
}

resource flexibleServers_palette365_name_max_worker_processes 'Microsoft.DBforPostgreSQL/flexibleServers/configurations@2026-01-01-preview' = {
  parent: flexibleServers_palette365_name_resource
  name: 'max_worker_processes'
  properties: {
    source: 'system-default'
    value: '8'
  }
}

resource flexibleServers_palette365_name_metrics_autovacuum_diagnostics 'Microsoft.DBforPostgreSQL/flexibleServers/configurations@2026-01-01-preview' = {
  parent: flexibleServers_palette365_name_resource
  name: 'metrics.autovacuum_diagnostics'
  properties: {
    source: 'system-default'
    value: 'off'
  }
}

resource flexibleServers_palette365_name_metrics_collector_database_activity 'Microsoft.DBforPostgreSQL/flexibleServers/configurations@2026-01-01-preview' = {
  parent: flexibleServers_palette365_name_resource
  name: 'metrics.collector_database_activity'
  properties: {
    source: 'system-default'
    value: 'off'
  }
}

resource flexibleServers_palette365_name_metrics_pgbouncer_diagnostics 'Microsoft.DBforPostgreSQL/flexibleServers/configurations@2026-01-01-preview' = {
  parent: flexibleServers_palette365_name_resource
  name: 'metrics.pgbouncer_diagnostics'
  properties: {
    source: 'system-default'
    value: 'off'
  }
}

resource flexibleServers_palette365_name_min_dynamic_shared_memory 'Microsoft.DBforPostgreSQL/flexibleServers/configurations@2026-01-01-preview' = {
  parent: flexibleServers_palette365_name_resource
  name: 'min_dynamic_shared_memory'
  properties: {
    source: 'system-default'
    value: '0'
  }
}

resource flexibleServers_palette365_name_min_parallel_index_scan_size 'Microsoft.DBforPostgreSQL/flexibleServers/configurations@2026-01-01-preview' = {
  parent: flexibleServers_palette365_name_resource
  name: 'min_parallel_index_scan_size'
  properties: {
    source: 'system-default'
    value: '64'
  }
}

resource flexibleServers_palette365_name_min_parallel_table_scan_size 'Microsoft.DBforPostgreSQL/flexibleServers/configurations@2026-01-01-preview' = {
  parent: flexibleServers_palette365_name_resource
  name: 'min_parallel_table_scan_size'
  properties: {
    source: 'system-default'
    value: '1024'
  }
}

resource flexibleServers_palette365_name_min_wal_size 'Microsoft.DBforPostgreSQL/flexibleServers/configurations@2026-01-01-preview' = {
  parent: flexibleServers_palette365_name_resource
  name: 'min_wal_size'
  properties: {
    source: 'system-default'
    value: '80'
  }
}

resource flexibleServers_palette365_name_multixact_member_buffers 'Microsoft.DBforPostgreSQL/flexibleServers/configurations@2026-01-01-preview' = {
  parent: flexibleServers_palette365_name_resource
  name: 'multixact_member_buffers'
  properties: {
    source: 'system-default'
    value: '32'
  }
}

resource flexibleServers_palette365_name_multixact_offset_buffers 'Microsoft.DBforPostgreSQL/flexibleServers/configurations@2026-01-01-preview' = {
  parent: flexibleServers_palette365_name_resource
  name: 'multixact_offset_buffers'
  properties: {
    source: 'system-default'
    value: '16'
  }
}

resource flexibleServers_palette365_name_notify_buffers 'Microsoft.DBforPostgreSQL/flexibleServers/configurations@2026-01-01-preview' = {
  parent: flexibleServers_palette365_name_resource
  name: 'notify_buffers'
  properties: {
    source: 'system-default'
    value: '16'
  }
}

resource flexibleServers_palette365_name_parallel_leader_participation 'Microsoft.DBforPostgreSQL/flexibleServers/configurations@2026-01-01-preview' = {
  parent: flexibleServers_palette365_name_resource
  name: 'parallel_leader_participation'
  properties: {
    source: 'system-default'
    value: 'on'
  }
}

resource flexibleServers_palette365_name_parallel_setup_cost 'Microsoft.DBforPostgreSQL/flexibleServers/configurations@2026-01-01-preview' = {
  parent: flexibleServers_palette365_name_resource
  name: 'parallel_setup_cost'
  properties: {
    source: 'system-default'
    value: '1000'
  }
}

resource flexibleServers_palette365_name_parallel_tuple_cost 'Microsoft.DBforPostgreSQL/flexibleServers/configurations@2026-01-01-preview' = {
  parent: flexibleServers_palette365_name_resource
  name: 'parallel_tuple_cost'
  properties: {
    source: 'system-default'
    value: '0.1'
  }
}

resource flexibleServers_palette365_name_password_encryption 'Microsoft.DBforPostgreSQL/flexibleServers/configurations@2026-01-01-preview' = {
  parent: flexibleServers_palette365_name_resource
  name: 'password_encryption'
  properties: {
    source: 'system-default'
    value: 'scram-sha-256'
  }
}

resource flexibleServers_palette365_name_pg_hint_plan_debug_print 'Microsoft.DBforPostgreSQL/flexibleServers/configurations@2026-01-01-preview' = {
  parent: flexibleServers_palette365_name_resource
  name: 'pg_hint_plan.debug_print'
  properties: {
    source: 'system-default'
    value: 'off'
  }
}

resource flexibleServers_palette365_name_pg_hint_plan_enable_hint 'Microsoft.DBforPostgreSQL/flexibleServers/configurations@2026-01-01-preview' = {
  parent: flexibleServers_palette365_name_resource
  name: 'pg_hint_plan.enable_hint'
  properties: {
    source: 'system-default'
    value: 'on'
  }
}

resource flexibleServers_palette365_name_pg_hint_plan_enable_hint_table 'Microsoft.DBforPostgreSQL/flexibleServers/configurations@2026-01-01-preview' = {
  parent: flexibleServers_palette365_name_resource
  name: 'pg_hint_plan.enable_hint_table'
  properties: {
    source: 'system-default'
    value: 'off'
  }
}

resource flexibleServers_palette365_name_pg_hint_plan_message_level 'Microsoft.DBforPostgreSQL/flexibleServers/configurations@2026-01-01-preview' = {
  parent: flexibleServers_palette365_name_resource
  name: 'pg_hint_plan.message_level'
  properties: {
    source: 'system-default'
    value: 'log'
  }
}

resource flexibleServers_palette365_name_pg_hint_plan_parse_messages 'Microsoft.DBforPostgreSQL/flexibleServers/configurations@2026-01-01-preview' = {
  parent: flexibleServers_palette365_name_resource
  name: 'pg_hint_plan.parse_messages'
  properties: {
    source: 'system-default'
    value: 'info'
  }
}

resource flexibleServers_palette365_name_pg_partman_bgw_analyze 'Microsoft.DBforPostgreSQL/flexibleServers/configurations@2026-01-01-preview' = {
  parent: flexibleServers_palette365_name_resource
  name: 'pg_partman_bgw.analyze'
  properties: {
    source: 'system-default'
    value: 'off'
  }
}

resource flexibleServers_palette365_name_pg_partman_bgw_dbname 'Microsoft.DBforPostgreSQL/flexibleServers/configurations@2026-01-01-preview' = {
  parent: flexibleServers_palette365_name_resource
  name: 'pg_partman_bgw.dbname'
  properties: {
    source: 'system-default'
  }
}

resource flexibleServers_palette365_name_pg_partman_bgw_interval 'Microsoft.DBforPostgreSQL/flexibleServers/configurations@2026-01-01-preview' = {
  parent: flexibleServers_palette365_name_resource
  name: 'pg_partman_bgw.interval'
  properties: {
    source: 'system-default'
    value: '3600'
  }
}

resource flexibleServers_palette365_name_pg_partman_bgw_jobmon 'Microsoft.DBforPostgreSQL/flexibleServers/configurations@2026-01-01-preview' = {
  parent: flexibleServers_palette365_name_resource
  name: 'pg_partman_bgw.jobmon'
  properties: {
    source: 'system-default'
    value: 'on'
  }
}

resource flexibleServers_palette365_name_pg_partman_bgw_maintenance_wait 'Microsoft.DBforPostgreSQL/flexibleServers/configurations@2026-01-01-preview' = {
  parent: flexibleServers_palette365_name_resource
  name: 'pg_partman_bgw.maintenance_wait'
  properties: {
    source: 'system-default'
    value: '0'
  }
}

resource flexibleServers_palette365_name_pg_partman_bgw_role 'Microsoft.DBforPostgreSQL/flexibleServers/configurations@2026-01-01-preview' = {
  parent: flexibleServers_palette365_name_resource
  name: 'pg_partman_bgw.role'
  properties: {
    source: 'system-default'
  }
}

resource flexibleServers_palette365_name_pg_prewarm_autoprewarm 'Microsoft.DBforPostgreSQL/flexibleServers/configurations@2026-01-01-preview' = {
  parent: flexibleServers_palette365_name_resource
  name: 'pg_prewarm.autoprewarm'
  properties: {
    source: 'system-default'
    value: 'on'
  }
}

resource flexibleServers_palette365_name_pg_prewarm_autoprewarm_interval 'Microsoft.DBforPostgreSQL/flexibleServers/configurations@2026-01-01-preview' = {
  parent: flexibleServers_palette365_name_resource
  name: 'pg_prewarm.autoprewarm_interval'
  properties: {
    source: 'system-default'
    value: '300'
  }
}

resource flexibleServers_palette365_name_pg_qs_emit_query_text 'Microsoft.DBforPostgreSQL/flexibleServers/configurations@2026-01-01-preview' = {
  parent: flexibleServers_palette365_name_resource
  name: 'pg_qs.emit_query_text'
  properties: {
    source: 'system-default'
    value: 'off'
  }
}

resource flexibleServers_palette365_name_pg_qs_interval_length_minutes 'Microsoft.DBforPostgreSQL/flexibleServers/configurations@2026-01-01-preview' = {
  parent: flexibleServers_palette365_name_resource
  name: 'pg_qs.interval_length_minutes'
  properties: {
    source: 'system-default'
    value: '15'
  }
}

resource flexibleServers_palette365_name_pg_qs_is_enabled_fs 'Microsoft.DBforPostgreSQL/flexibleServers/configurations@2026-01-01-preview' = {
  parent: flexibleServers_palette365_name_resource
  name: 'pg_qs.is_enabled_fs'
  properties: {
    source: 'system-default'
    value: 'on'
  }
}

resource flexibleServers_palette365_name_pg_qs_max_captured_queries 'Microsoft.DBforPostgreSQL/flexibleServers/configurations@2026-01-01-preview' = {
  parent: flexibleServers_palette365_name_resource
  name: 'pg_qs.max_captured_queries'
  properties: {
    source: 'system-default'
    value: '500'
  }
}

resource flexibleServers_palette365_name_pg_qs_max_plan_size 'Microsoft.DBforPostgreSQL/flexibleServers/configurations@2026-01-01-preview' = {
  parent: flexibleServers_palette365_name_resource
  name: 'pg_qs.max_plan_size'
  properties: {
    source: 'system-default'
    value: '7500'
  }
}

resource flexibleServers_palette365_name_pg_qs_max_query_text_length 'Microsoft.DBforPostgreSQL/flexibleServers/configurations@2026-01-01-preview' = {
  parent: flexibleServers_palette365_name_resource
  name: 'pg_qs.max_query_text_length'
  properties: {
    source: 'system-default'
    value: '6000'
  }
}

resource flexibleServers_palette365_name_pg_qs_parameters_capture_mode 'Microsoft.DBforPostgreSQL/flexibleServers/configurations@2026-01-01-preview' = {
  parent: flexibleServers_palette365_name_resource
  name: 'pg_qs.parameters_capture_mode'
  properties: {
    source: 'system-default'
    value: 'capture_parameterless_only'
  }
}

resource flexibleServers_palette365_name_pg_qs_query_capture_mode 'Microsoft.DBforPostgreSQL/flexibleServers/configurations@2026-01-01-preview' = {
  parent: flexibleServers_palette365_name_resource
  name: 'pg_qs.query_capture_mode'
  properties: {
    source: 'system-default'
    value: 'none'
  }
}

resource flexibleServers_palette365_name_pg_qs_retention_period_in_days 'Microsoft.DBforPostgreSQL/flexibleServers/configurations@2026-01-01-preview' = {
  parent: flexibleServers_palette365_name_resource
  name: 'pg_qs.retention_period_in_days'
  properties: {
    source: 'system-default'
    value: '7'
  }
}

resource flexibleServers_palette365_name_pg_qs_store_query_plans 'Microsoft.DBforPostgreSQL/flexibleServers/configurations@2026-01-01-preview' = {
  parent: flexibleServers_palette365_name_resource
  name: 'pg_qs.store_query_plans'
  properties: {
    source: 'system-default'
    value: 'off'
  }
}

resource flexibleServers_palette365_name_pg_qs_track_utility 'Microsoft.DBforPostgreSQL/flexibleServers/configurations@2026-01-01-preview' = {
  parent: flexibleServers_palette365_name_resource
  name: 'pg_qs.track_utility'
  properties: {
    source: 'system-default'
    value: 'on'
  }
}

resource flexibleServers_palette365_name_pg_stat_statements_max 'Microsoft.DBforPostgreSQL/flexibleServers/configurations@2026-01-01-preview' = {
  parent: flexibleServers_palette365_name_resource
  name: 'pg_stat_statements.max'
  properties: {
    source: 'system-default'
    value: '5000'
  }
}

resource flexibleServers_palette365_name_pg_stat_statements_save 'Microsoft.DBforPostgreSQL/flexibleServers/configurations@2026-01-01-preview' = {
  parent: flexibleServers_palette365_name_resource
  name: 'pg_stat_statements.save'
  properties: {
    source: 'system-default'
    value: 'on'
  }
}

resource flexibleServers_palette365_name_pg_stat_statements_track 'Microsoft.DBforPostgreSQL/flexibleServers/configurations@2026-01-01-preview' = {
  parent: flexibleServers_palette365_name_resource
  name: 'pg_stat_statements.track'
  properties: {
    source: 'system-default'
    value: 'none'
  }
}

resource flexibleServers_palette365_name_pg_stat_statements_track_planning 'Microsoft.DBforPostgreSQL/flexibleServers/configurations@2026-01-01-preview' = {
  parent: flexibleServers_palette365_name_resource
  name: 'pg_stat_statements.track_planning'
  properties: {
    source: 'system-default'
    value: 'off'
  }
}

resource flexibleServers_palette365_name_pg_stat_statements_track_utility 'Microsoft.DBforPostgreSQL/flexibleServers/configurations@2026-01-01-preview' = {
  parent: flexibleServers_palette365_name_resource
  name: 'pg_stat_statements.track_utility'
  properties: {
    source: 'system-default'
    value: 'on'
  }
}

resource flexibleServers_palette365_name_pgaadauth_enable_group_sync 'Microsoft.DBforPostgreSQL/flexibleServers/configurations@2026-01-01-preview' = {
  parent: flexibleServers_palette365_name_resource
  name: 'pgaadauth.enable_group_sync'
  properties: {
    source: 'system-default'
    value: 'off'
  }
}

resource flexibleServers_palette365_name_pgaudit_log 'Microsoft.DBforPostgreSQL/flexibleServers/configurations@2026-01-01-preview' = {
  parent: flexibleServers_palette365_name_resource
  name: 'pgaudit.log'
  properties: {
    source: 'system-default'
    value: 'none'
  }
}

resource flexibleServers_palette365_name_pgaudit_log_catalog 'Microsoft.DBforPostgreSQL/flexibleServers/configurations@2026-01-01-preview' = {
  parent: flexibleServers_palette365_name_resource
  name: 'pgaudit.log_catalog'
  properties: {
    source: 'system-default'
    value: 'on'
  }
}

resource flexibleServers_palette365_name_pgaudit_log_client 'Microsoft.DBforPostgreSQL/flexibleServers/configurations@2026-01-01-preview' = {
  parent: flexibleServers_palette365_name_resource
  name: 'pgaudit.log_client'
  properties: {
    source: 'system-default'
    value: 'off'
  }
}

resource flexibleServers_palette365_name_pgaudit_log_level 'Microsoft.DBforPostgreSQL/flexibleServers/configurations@2026-01-01-preview' = {
  parent: flexibleServers_palette365_name_resource
  name: 'pgaudit.log_level'
  properties: {
    source: 'system-default'
    value: 'log'
  }
}

resource flexibleServers_palette365_name_pgaudit_log_parameter 'Microsoft.DBforPostgreSQL/flexibleServers/configurations@2026-01-01-preview' = {
  parent: flexibleServers_palette365_name_resource
  name: 'pgaudit.log_parameter'
  properties: {
    source: 'system-default'
    value: 'off'
  }
}

resource flexibleServers_palette365_name_pgaudit_log_parameter_max_size 'Microsoft.DBforPostgreSQL/flexibleServers/configurations@2026-01-01-preview' = {
  parent: flexibleServers_palette365_name_resource
  name: 'pgaudit.log_parameter_max_size'
  properties: {
    source: 'system-default'
    value: '0'
  }
}

resource flexibleServers_palette365_name_pgaudit_log_relation 'Microsoft.DBforPostgreSQL/flexibleServers/configurations@2026-01-01-preview' = {
  parent: flexibleServers_palette365_name_resource
  name: 'pgaudit.log_relation'
  properties: {
    source: 'system-default'
    value: 'off'
  }
}

resource flexibleServers_palette365_name_pgaudit_log_rows 'Microsoft.DBforPostgreSQL/flexibleServers/configurations@2026-01-01-preview' = {
  parent: flexibleServers_palette365_name_resource
  name: 'pgaudit.log_rows'
  properties: {
    source: 'system-default'
    value: 'off'
  }
}

resource flexibleServers_palette365_name_pgaudit_log_statement 'Microsoft.DBforPostgreSQL/flexibleServers/configurations@2026-01-01-preview' = {
  parent: flexibleServers_palette365_name_resource
  name: 'pgaudit.log_statement'
  properties: {
    source: 'system-default'
    value: 'on'
  }
}

resource flexibleServers_palette365_name_pgaudit_log_statement_once 'Microsoft.DBforPostgreSQL/flexibleServers/configurations@2026-01-01-preview' = {
  parent: flexibleServers_palette365_name_resource
  name: 'pgaudit.log_statement_once'
  properties: {
    source: 'system-default'
    value: 'off'
  }
}

resource flexibleServers_palette365_name_pgaudit_role 'Microsoft.DBforPostgreSQL/flexibleServers/configurations@2026-01-01-preview' = {
  parent: flexibleServers_palette365_name_resource
  name: 'pgaudit.role'
  properties: {
    source: 'system-default'
  }
}

resource flexibleServers_palette365_name_pglogical_batch_inserts 'Microsoft.DBforPostgreSQL/flexibleServers/configurations@2026-01-01-preview' = {
  parent: flexibleServers_palette365_name_resource
  name: 'pglogical.batch_inserts'
  properties: {
    source: 'system-default'
    value: 'on'
  }
}

resource flexibleServers_palette365_name_pglogical_conflict_log_level 'Microsoft.DBforPostgreSQL/flexibleServers/configurations@2026-01-01-preview' = {
  parent: flexibleServers_palette365_name_resource
  name: 'pglogical.conflict_log_level'
  properties: {
    source: 'system-default'
    value: 'log'
  }
}

resource flexibleServers_palette365_name_pglogical_conflict_resolution 'Microsoft.DBforPostgreSQL/flexibleServers/configurations@2026-01-01-preview' = {
  parent: flexibleServers_palette365_name_resource
  name: 'pglogical.conflict_resolution'
  properties: {
    source: 'system-default'
    value: 'apply_remote'
  }
}

resource flexibleServers_palette365_name_pglogical_extra_connection_options 'Microsoft.DBforPostgreSQL/flexibleServers/configurations@2026-01-01-preview' = {
  parent: flexibleServers_palette365_name_resource
  name: 'pglogical.extra_connection_options'
  properties: {
    source: 'system-default'
  }
}

resource flexibleServers_palette365_name_pglogical_synchronous_commit 'Microsoft.DBforPostgreSQL/flexibleServers/configurations@2026-01-01-preview' = {
  parent: flexibleServers_palette365_name_resource
  name: 'pglogical.synchronous_commit'
  properties: {
    source: 'system-default'
    value: 'off'
  }
}

resource flexibleServers_palette365_name_pglogical_temp_directory 'Microsoft.DBforPostgreSQL/flexibleServers/configurations@2026-01-01-preview' = {
  parent: flexibleServers_palette365_name_resource
  name: 'pglogical.temp_directory'
  properties: {
    source: 'system-default'
  }
}

resource flexibleServers_palette365_name_pglogical_use_spi 'Microsoft.DBforPostgreSQL/flexibleServers/configurations@2026-01-01-preview' = {
  parent: flexibleServers_palette365_name_resource
  name: 'pglogical.use_spi'
  properties: {
    source: 'system-default'
    value: 'off'
  }
}

resource flexibleServers_palette365_name_pgms_stats_is_enabled_fs 'Microsoft.DBforPostgreSQL/flexibleServers/configurations@2026-01-01-preview' = {
  parent: flexibleServers_palette365_name_resource
  name: 'pgms_stats.is_enabled_fs'
  properties: {
    source: 'system-default'
    value: 'on'
  }
}

resource flexibleServers_palette365_name_pgms_wait_sampling_history_period 'Microsoft.DBforPostgreSQL/flexibleServers/configurations@2026-01-01-preview' = {
  parent: flexibleServers_palette365_name_resource
  name: 'pgms_wait_sampling.history_period'
  properties: {
    source: 'system-default'
    value: '100'
  }
}

resource flexibleServers_palette365_name_pgms_wait_sampling_is_enabled_fs 'Microsoft.DBforPostgreSQL/flexibleServers/configurations@2026-01-01-preview' = {
  parent: flexibleServers_palette365_name_resource
  name: 'pgms_wait_sampling.is_enabled_fs'
  properties: {
    source: 'system-default'
    value: 'on'
  }
}

resource flexibleServers_palette365_name_pgms_wait_sampling_query_capture_mode 'Microsoft.DBforPostgreSQL/flexibleServers/configurations@2026-01-01-preview' = {
  parent: flexibleServers_palette365_name_resource
  name: 'pgms_wait_sampling.query_capture_mode'
  properties: {
    source: 'system-default'
    value: 'none'
  }
}

resource flexibleServers_palette365_name_plan_cache_mode 'Microsoft.DBforPostgreSQL/flexibleServers/configurations@2026-01-01-preview' = {
  parent: flexibleServers_palette365_name_resource
  name: 'plan_cache_mode'
  properties: {
    source: 'system-default'
    value: 'auto'
  }
}

resource flexibleServers_palette365_name_port 'Microsoft.DBforPostgreSQL/flexibleServers/configurations@2026-01-01-preview' = {
  parent: flexibleServers_palette365_name_resource
  name: 'port'
  properties: {
    source: 'system-default'
    value: '5432'
  }
}

resource flexibleServers_palette365_name_post_auth_delay 'Microsoft.DBforPostgreSQL/flexibleServers/configurations@2026-01-01-preview' = {
  parent: flexibleServers_palette365_name_resource
  name: 'post_auth_delay'
  properties: {
    source: 'system-default'
    value: '0'
  }
}

resource flexibleServers_palette365_name_postgis_gdal_enabled_drivers 'Microsoft.DBforPostgreSQL/flexibleServers/configurations@2026-01-01-preview' = {
  parent: flexibleServers_palette365_name_resource
  name: 'postgis.gdal_enabled_drivers'
  properties: {
    source: 'system-default'
    value: 'DISABLE_ALL'
  }
}

resource flexibleServers_palette365_name_pre_auth_delay 'Microsoft.DBforPostgreSQL/flexibleServers/configurations@2026-01-01-preview' = {
  parent: flexibleServers_palette365_name_resource
  name: 'pre_auth_delay'
  properties: {
    source: 'system-default'
    value: '0'
  }
}

resource flexibleServers_palette365_name_primary_conninfo 'Microsoft.DBforPostgreSQL/flexibleServers/configurations@2026-01-01-preview' = {
  parent: flexibleServers_palette365_name_resource
  name: 'primary_conninfo'
  properties: {
    source: 'system-default'
  }
}

resource flexibleServers_palette365_name_primary_slot_name 'Microsoft.DBforPostgreSQL/flexibleServers/configurations@2026-01-01-preview' = {
  parent: flexibleServers_palette365_name_resource
  name: 'primary_slot_name'
  properties: {
    source: 'system-default'
  }
}

resource flexibleServers_palette365_name_quote_all_identifiers 'Microsoft.DBforPostgreSQL/flexibleServers/configurations@2026-01-01-preview' = {
  parent: flexibleServers_palette365_name_resource
  name: 'quote_all_identifiers'
  properties: {
    source: 'system-default'
    value: 'off'
  }
}

resource flexibleServers_palette365_name_random_page_cost 'Microsoft.DBforPostgreSQL/flexibleServers/configurations@2026-01-01-preview' = {
  parent: flexibleServers_palette365_name_resource
  name: 'random_page_cost'
  properties: {
    source: 'system-default'
    value: '2'
  }
}

resource flexibleServers_palette365_name_recovery_end_command 'Microsoft.DBforPostgreSQL/flexibleServers/configurations@2026-01-01-preview' = {
  parent: flexibleServers_palette365_name_resource
  name: 'recovery_end_command'
  properties: {
    source: 'system-default'
  }
}

resource flexibleServers_palette365_name_recovery_init_sync_method 'Microsoft.DBforPostgreSQL/flexibleServers/configurations@2026-01-01-preview' = {
  parent: flexibleServers_palette365_name_resource
  name: 'recovery_init_sync_method'
  properties: {
    source: 'system-default'
    value: 'fsync'
  }
}

resource flexibleServers_palette365_name_recovery_min_apply_delay 'Microsoft.DBforPostgreSQL/flexibleServers/configurations@2026-01-01-preview' = {
  parent: flexibleServers_palette365_name_resource
  name: 'recovery_min_apply_delay'
  properties: {
    source: 'system-default'
    value: '0'
  }
}

resource flexibleServers_palette365_name_recovery_prefetch 'Microsoft.DBforPostgreSQL/flexibleServers/configurations@2026-01-01-preview' = {
  parent: flexibleServers_palette365_name_resource
  name: 'recovery_prefetch'
  properties: {
    source: 'system-default'
    value: 'try'
  }
}

resource flexibleServers_palette365_name_recovery_target 'Microsoft.DBforPostgreSQL/flexibleServers/configurations@2026-01-01-preview' = {
  parent: flexibleServers_palette365_name_resource
  name: 'recovery_target'
  properties: {
    source: 'system-default'
  }
}

resource flexibleServers_palette365_name_recovery_target_action 'Microsoft.DBforPostgreSQL/flexibleServers/configurations@2026-01-01-preview' = {
  parent: flexibleServers_palette365_name_resource
  name: 'recovery_target_action'
  properties: {
    source: 'system-default'
    value: 'pause'
  }
}

resource flexibleServers_palette365_name_recovery_target_inclusive 'Microsoft.DBforPostgreSQL/flexibleServers/configurations@2026-01-01-preview' = {
  parent: flexibleServers_palette365_name_resource
  name: 'recovery_target_inclusive'
  properties: {
    source: 'system-default'
    value: 'on'
  }
}

resource flexibleServers_palette365_name_recovery_target_lsn 'Microsoft.DBforPostgreSQL/flexibleServers/configurations@2026-01-01-preview' = {
  parent: flexibleServers_palette365_name_resource
  name: 'recovery_target_lsn'
  properties: {
    source: 'system-default'
  }
}

resource flexibleServers_palette365_name_recovery_target_name 'Microsoft.DBforPostgreSQL/flexibleServers/configurations@2026-01-01-preview' = {
  parent: flexibleServers_palette365_name_resource
  name: 'recovery_target_name'
  properties: {
    source: 'system-default'
  }
}

resource flexibleServers_palette365_name_recovery_target_time 'Microsoft.DBforPostgreSQL/flexibleServers/configurations@2026-01-01-preview' = {
  parent: flexibleServers_palette365_name_resource
  name: 'recovery_target_time'
  properties: {
    source: 'system-default'
  }
}

resource flexibleServers_palette365_name_recovery_target_timeline 'Microsoft.DBforPostgreSQL/flexibleServers/configurations@2026-01-01-preview' = {
  parent: flexibleServers_palette365_name_resource
  name: 'recovery_target_timeline'
  properties: {
    source: 'system-default'
    value: 'latest'
  }
}

resource flexibleServers_palette365_name_recovery_target_xid 'Microsoft.DBforPostgreSQL/flexibleServers/configurations@2026-01-01-preview' = {
  parent: flexibleServers_palette365_name_resource
  name: 'recovery_target_xid'
  properties: {
    source: 'system-default'
  }
}

resource flexibleServers_palette365_name_recursive_worktable_factor 'Microsoft.DBforPostgreSQL/flexibleServers/configurations@2026-01-01-preview' = {
  parent: flexibleServers_palette365_name_resource
  name: 'recursive_worktable_factor'
  properties: {
    source: 'system-default'
    value: '10'
  }
}

resource flexibleServers_palette365_name_remove_temp_files_after_crash 'Microsoft.DBforPostgreSQL/flexibleServers/configurations@2026-01-01-preview' = {
  parent: flexibleServers_palette365_name_resource
  name: 'remove_temp_files_after_crash'
  properties: {
    source: 'system-default'
    value: 'on'
  }
}

resource flexibleServers_palette365_name_require_secure_transport 'Microsoft.DBforPostgreSQL/flexibleServers/configurations@2026-01-01-preview' = {
  parent: flexibleServers_palette365_name_resource
  name: 'require_secure_transport'
  properties: {
    source: 'system-default'
    value: 'on'
  }
}

resource flexibleServers_palette365_name_reserved_connections 'Microsoft.DBforPostgreSQL/flexibleServers/configurations@2026-01-01-preview' = {
  parent: flexibleServers_palette365_name_resource
  name: 'reserved_connections'
  properties: {
    source: 'system-default'
    value: '5'
  }
}

resource flexibleServers_palette365_name_restart_after_crash 'Microsoft.DBforPostgreSQL/flexibleServers/configurations@2026-01-01-preview' = {
  parent: flexibleServers_palette365_name_resource
  name: 'restart_after_crash'
  properties: {
    source: 'system-default'
    value: 'on'
  }
}

resource flexibleServers_palette365_name_restore_command 'Microsoft.DBforPostgreSQL/flexibleServers/configurations@2026-01-01-preview' = {
  parent: flexibleServers_palette365_name_resource
  name: 'restore_command'
  properties: {
    source: 'system-default'
  }
}

resource flexibleServers_palette365_name_restrict_nonsystem_relation_kind 'Microsoft.DBforPostgreSQL/flexibleServers/configurations@2026-01-01-preview' = {
  parent: flexibleServers_palette365_name_resource
  name: 'restrict_nonsystem_relation_kind'
  properties: {
    source: 'system-default'
  }
}

resource flexibleServers_palette365_name_row_security 'Microsoft.DBforPostgreSQL/flexibleServers/configurations@2026-01-01-preview' = {
  parent: flexibleServers_palette365_name_resource
  name: 'row_security'
  properties: {
    source: 'system-default'
    value: 'on'
  }
}

resource flexibleServers_palette365_name_scram_iterations 'Microsoft.DBforPostgreSQL/flexibleServers/configurations@2026-01-01-preview' = {
  parent: flexibleServers_palette365_name_resource
  name: 'scram_iterations'
  properties: {
    source: 'system-default'
    value: '4096'
  }
}

resource flexibleServers_palette365_name_search_path 'Microsoft.DBforPostgreSQL/flexibleServers/configurations@2026-01-01-preview' = {
  parent: flexibleServers_palette365_name_resource
  name: 'search_path'
  properties: {
    source: 'system-default'
    value: '"$user", public'
  }
}

resource flexibleServers_palette365_name_segment_size 'Microsoft.DBforPostgreSQL/flexibleServers/configurations@2026-01-01-preview' = {
  parent: flexibleServers_palette365_name_resource
  name: 'segment_size'
  properties: {
    source: 'system-default'
    value: '131072'
  }
}

resource flexibleServers_palette365_name_send_abort_for_crash 'Microsoft.DBforPostgreSQL/flexibleServers/configurations@2026-01-01-preview' = {
  parent: flexibleServers_palette365_name_resource
  name: 'send_abort_for_crash'
  properties: {
    source: 'system-default'
    value: 'off'
  }
}

resource flexibleServers_palette365_name_send_abort_for_kill 'Microsoft.DBforPostgreSQL/flexibleServers/configurations@2026-01-01-preview' = {
  parent: flexibleServers_palette365_name_resource
  name: 'send_abort_for_kill'
  properties: {
    source: 'system-default'
    value: 'off'
  }
}

resource flexibleServers_palette365_name_seq_page_cost 'Microsoft.DBforPostgreSQL/flexibleServers/configurations@2026-01-01-preview' = {
  parent: flexibleServers_palette365_name_resource
  name: 'seq_page_cost'
  properties: {
    source: 'system-default'
    value: '1'
  }
}

resource flexibleServers_palette365_name_serializable_buffers 'Microsoft.DBforPostgreSQL/flexibleServers/configurations@2026-01-01-preview' = {
  parent: flexibleServers_palette365_name_resource
  name: 'serializable_buffers'
  properties: {
    source: 'system-default'
    value: '32'
  }
}

resource flexibleServers_palette365_name_server_encoding 'Microsoft.DBforPostgreSQL/flexibleServers/configurations@2026-01-01-preview' = {
  parent: flexibleServers_palette365_name_resource
  name: 'server_encoding'
  properties: {
    source: 'user-override'
    value: 'UTF8'
  }
}

resource flexibleServers_palette365_name_server_version 'Microsoft.DBforPostgreSQL/flexibleServers/configurations@2026-01-01-preview' = {
  parent: flexibleServers_palette365_name_resource
  name: 'server_version'
  properties: {
    source: 'user-override'
    value: '17.8'
  }
}

resource flexibleServers_palette365_name_server_version_num 'Microsoft.DBforPostgreSQL/flexibleServers/configurations@2026-01-01-preview' = {
  parent: flexibleServers_palette365_name_resource
  name: 'server_version_num'
  properties: {
    source: 'user-override'
    value: '170008'
  }
}

resource flexibleServers_palette365_name_session_preload_libraries 'Microsoft.DBforPostgreSQL/flexibleServers/configurations@2026-01-01-preview' = {
  parent: flexibleServers_palette365_name_resource
  name: 'session_preload_libraries'
  properties: {
    source: 'system-default'
  }
}

resource flexibleServers_palette365_name_session_replication_role 'Microsoft.DBforPostgreSQL/flexibleServers/configurations@2026-01-01-preview' = {
  parent: flexibleServers_palette365_name_resource
  name: 'session_replication_role'
  properties: {
    source: 'system-default'
    value: 'origin'
  }
}

resource flexibleServers_palette365_name_shared_buffers 'Microsoft.DBforPostgreSQL/flexibleServers/configurations@2026-01-01-preview' = {
  parent: flexibleServers_palette365_name_resource
  name: 'shared_buffers'
  properties: {
    source: 'system-default'
    value: '131072'
  }
}

resource flexibleServers_palette365_name_shared_memory_size 'Microsoft.DBforPostgreSQL/flexibleServers/configurations@2026-01-01-preview' = {
  parent: flexibleServers_palette365_name_resource
  name: 'shared_memory_size'
  properties: {
    source: 'user-override'
    value: '1131'
  }
}

resource flexibleServers_palette365_name_shared_memory_size_in_huge_pages 'Microsoft.DBforPostgreSQL/flexibleServers/configurations@2026-01-01-preview' = {
  parent: flexibleServers_palette365_name_resource
  name: 'shared_memory_size_in_huge_pages'
  properties: {
    source: 'user-override'
    value: '566'
  }
}

resource flexibleServers_palette365_name_shared_memory_type 'Microsoft.DBforPostgreSQL/flexibleServers/configurations@2026-01-01-preview' = {
  parent: flexibleServers_palette365_name_resource
  name: 'shared_memory_type'
  properties: {
    source: 'system-default'
    value: 'mmap'
  }
}

resource flexibleServers_palette365_name_shared_preload_libraries 'Microsoft.DBforPostgreSQL/flexibleServers/configurations@2026-01-01-preview' = {
  parent: flexibleServers_palette365_name_resource
  name: 'shared_preload_libraries'
  properties: {
    source: 'user-override'
    value: 'pg_cron,pg_stat_statements'
  }
}

resource flexibleServers_palette365_name_squeeze_max_xlock_time 'Microsoft.DBforPostgreSQL/flexibleServers/configurations@2026-01-01-preview' = {
  parent: flexibleServers_palette365_name_resource
  name: 'squeeze.max_xlock_time'
  properties: {
    source: 'system-default'
    value: '0'
  }
}

resource flexibleServers_palette365_name_squeeze_worker_autostart 'Microsoft.DBforPostgreSQL/flexibleServers/configurations@2026-01-01-preview' = {
  parent: flexibleServers_palette365_name_resource
  name: 'squeeze.worker_autostart'
  properties: {
    source: 'system-default'
  }
}

resource flexibleServers_palette365_name_squeeze_worker_role 'Microsoft.DBforPostgreSQL/flexibleServers/configurations@2026-01-01-preview' = {
  parent: flexibleServers_palette365_name_resource
  name: 'squeeze.worker_role'
  properties: {
    source: 'system-default'
  }
}

resource flexibleServers_palette365_name_squeeze_workers_per_database 'Microsoft.DBforPostgreSQL/flexibleServers/configurations@2026-01-01-preview' = {
  parent: flexibleServers_palette365_name_resource
  name: 'squeeze.workers_per_database'
  properties: {
    source: 'system-default'
    value: '1'
  }
}

resource flexibleServers_palette365_name_ssl 'Microsoft.DBforPostgreSQL/flexibleServers/configurations@2026-01-01-preview' = {
  parent: flexibleServers_palette365_name_resource
  name: 'ssl'
  properties: {
    source: 'user-override'
    value: 'on'
  }
}

resource flexibleServers_palette365_name_ssl_ca_file 'Microsoft.DBforPostgreSQL/flexibleServers/configurations@2026-01-01-preview' = {
  parent: flexibleServers_palette365_name_resource
  name: 'ssl_ca_file'
  properties: {
    source: 'user-override'
    value: '/datadrive/certs/ca.pem'
  }
}

resource flexibleServers_palette365_name_ssl_cert_file 'Microsoft.DBforPostgreSQL/flexibleServers/configurations@2026-01-01-preview' = {
  parent: flexibleServers_palette365_name_resource
  name: 'ssl_cert_file'
  properties: {
    source: 'user-override'
    value: '/datadrive/certs/cert.pem'
  }
}

resource flexibleServers_palette365_name_ssl_ciphers 'Microsoft.DBforPostgreSQL/flexibleServers/configurations@2026-01-01-preview' = {
  parent: flexibleServers_palette365_name_resource
  name: 'ssl_ciphers'
  properties: {
    source: 'user-override'
    value: 'ECDHE-ECDSA-AES256-GCM-SHA384:ECDHE-RSA-AES256-GCM-SHA384:ECDHE-ECDSA-CHACHA20-POLY1305:ECDHE-RSA-CHACHA20-POLY1305:ECDHE-ECDSA-AES128-GCM-SHA256:ECDHE-RSA-AES128-GCM-SHA256'
  }
}

resource flexibleServers_palette365_name_ssl_crl_dir 'Microsoft.DBforPostgreSQL/flexibleServers/configurations@2026-01-01-preview' = {
  parent: flexibleServers_palette365_name_resource
  name: 'ssl_crl_dir'
  properties: {
    source: 'system-default'
  }
}

resource flexibleServers_palette365_name_ssl_crl_file 'Microsoft.DBforPostgreSQL/flexibleServers/configurations@2026-01-01-preview' = {
  parent: flexibleServers_palette365_name_resource
  name: 'ssl_crl_file'
  properties: {
    source: 'system-default'
  }
}

resource flexibleServers_palette365_name_ssl_dh_params_file 'Microsoft.DBforPostgreSQL/flexibleServers/configurations@2026-01-01-preview' = {
  parent: flexibleServers_palette365_name_resource
  name: 'ssl_dh_params_file'
  properties: {
    source: 'system-default'
  }
}

resource flexibleServers_palette365_name_ssl_ecdh_curve 'Microsoft.DBforPostgreSQL/flexibleServers/configurations@2026-01-01-preview' = {
  parent: flexibleServers_palette365_name_resource
  name: 'ssl_ecdh_curve'
  properties: {
    source: 'system-default'
    value: 'prime256v1'
  }
}

resource flexibleServers_palette365_name_ssl_key_file 'Microsoft.DBforPostgreSQL/flexibleServers/configurations@2026-01-01-preview' = {
  parent: flexibleServers_palette365_name_resource
  name: 'ssl_key_file'
  properties: {
    source: 'user-override'
    value: '/datadrive/certs/key.pem'
  }
}

resource flexibleServers_palette365_name_ssl_library 'Microsoft.DBforPostgreSQL/flexibleServers/configurations@2026-01-01-preview' = {
  parent: flexibleServers_palette365_name_resource
  name: 'ssl_library'
  properties: {
    source: 'system-default'
    value: 'OpenSSL'
  }
}

resource flexibleServers_palette365_name_ssl_max_protocol_version 'Microsoft.DBforPostgreSQL/flexibleServers/configurations@2026-01-01-preview' = {
  parent: flexibleServers_palette365_name_resource
  name: 'ssl_max_protocol_version'
  properties: {
    source: 'system-default'
  }
}

resource flexibleServers_palette365_name_ssl_min_protocol_version 'Microsoft.DBforPostgreSQL/flexibleServers/configurations@2026-01-01-preview' = {
  parent: flexibleServers_palette365_name_resource
  name: 'ssl_min_protocol_version'
  properties: {
    source: 'system-default'
    value: 'TLSv1.2'
  }
}

resource flexibleServers_palette365_name_ssl_passphrase_command 'Microsoft.DBforPostgreSQL/flexibleServers/configurations@2026-01-01-preview' = {
  parent: flexibleServers_palette365_name_resource
  name: 'ssl_passphrase_command'
  properties: {
    source: 'system-default'
  }
}

resource flexibleServers_palette365_name_ssl_passphrase_command_supports_reload 'Microsoft.DBforPostgreSQL/flexibleServers/configurations@2026-01-01-preview' = {
  parent: flexibleServers_palette365_name_resource
  name: 'ssl_passphrase_command_supports_reload'
  properties: {
    source: 'system-default'
    value: 'off'
  }
}

resource flexibleServers_palette365_name_ssl_prefer_server_ciphers 'Microsoft.DBforPostgreSQL/flexibleServers/configurations@2026-01-01-preview' = {
  parent: flexibleServers_palette365_name_resource
  name: 'ssl_prefer_server_ciphers'
  properties: {
    source: 'system-default'
    value: 'on'
  }
}

resource flexibleServers_palette365_name_standard_conforming_strings 'Microsoft.DBforPostgreSQL/flexibleServers/configurations@2026-01-01-preview' = {
  parent: flexibleServers_palette365_name_resource
  name: 'standard_conforming_strings'
  properties: {
    source: 'system-default'
    value: 'on'
  }
}

resource flexibleServers_palette365_name_statement_timeout 'Microsoft.DBforPostgreSQL/flexibleServers/configurations@2026-01-01-preview' = {
  parent: flexibleServers_palette365_name_resource
  name: 'statement_timeout'
  properties: {
    source: 'system-default'
    value: '0'
  }
}

resource flexibleServers_palette365_name_stats_fetch_consistency 'Microsoft.DBforPostgreSQL/flexibleServers/configurations@2026-01-01-preview' = {
  parent: flexibleServers_palette365_name_resource
  name: 'stats_fetch_consistency'
  properties: {
    source: 'system-default'
    value: 'cache'
  }
}

resource flexibleServers_palette365_name_subtransaction_buffers 'Microsoft.DBforPostgreSQL/flexibleServers/configurations@2026-01-01-preview' = {
  parent: flexibleServers_palette365_name_resource
  name: 'subtransaction_buffers'
  properties: {
    source: 'user-override'
    value: '256'
  }
}

resource flexibleServers_palette365_name_summarize_wal 'Microsoft.DBforPostgreSQL/flexibleServers/configurations@2026-01-01-preview' = {
  parent: flexibleServers_palette365_name_resource
  name: 'summarize_wal'
  properties: {
    source: 'system-default'
    value: 'off'
  }
}

resource flexibleServers_palette365_name_superuser_reserved_connections 'Microsoft.DBforPostgreSQL/flexibleServers/configurations@2026-01-01-preview' = {
  parent: flexibleServers_palette365_name_resource
  name: 'superuser_reserved_connections'
  properties: {
    source: 'system-default'
    value: '10'
  }
}

resource flexibleServers_palette365_name_sync_replication_slots 'Microsoft.DBforPostgreSQL/flexibleServers/configurations@2026-01-01-preview' = {
  parent: flexibleServers_palette365_name_resource
  name: 'sync_replication_slots'
  properties: {
    source: 'system-default'
    value: 'off'
  }
}

resource flexibleServers_palette365_name_synchronize_seqscans 'Microsoft.DBforPostgreSQL/flexibleServers/configurations@2026-01-01-preview' = {
  parent: flexibleServers_palette365_name_resource
  name: 'synchronize_seqscans'
  properties: {
    source: 'system-default'
    value: 'on'
  }
}

resource flexibleServers_palette365_name_synchronized_standby_slots 'Microsoft.DBforPostgreSQL/flexibleServers/configurations@2026-01-01-preview' = {
  parent: flexibleServers_palette365_name_resource
  name: 'synchronized_standby_slots'
  properties: {
    source: 'system-default'
  }
}

resource flexibleServers_palette365_name_synchronous_commit 'Microsoft.DBforPostgreSQL/flexibleServers/configurations@2026-01-01-preview' = {
  parent: flexibleServers_palette365_name_resource
  name: 'synchronous_commit'
  properties: {
    source: 'system-default'
    value: 'on'
  }
}

resource flexibleServers_palette365_name_synchronous_standby_names 'Microsoft.DBforPostgreSQL/flexibleServers/configurations@2026-01-01-preview' = {
  parent: flexibleServers_palette365_name_resource
  name: 'synchronous_standby_names'
  properties: {
    source: 'system-default'
  }
}

resource flexibleServers_palette365_name_syslog_facility 'Microsoft.DBforPostgreSQL/flexibleServers/configurations@2026-01-01-preview' = {
  parent: flexibleServers_palette365_name_resource
  name: 'syslog_facility'
  properties: {
    source: 'system-default'
    value: 'local0'
  }
}

resource flexibleServers_palette365_name_syslog_ident 'Microsoft.DBforPostgreSQL/flexibleServers/configurations@2026-01-01-preview' = {
  parent: flexibleServers_palette365_name_resource
  name: 'syslog_ident'
  properties: {
    source: 'system-default'
    value: 'postgres'
  }
}

resource flexibleServers_palette365_name_syslog_sequence_numbers 'Microsoft.DBforPostgreSQL/flexibleServers/configurations@2026-01-01-preview' = {
  parent: flexibleServers_palette365_name_resource
  name: 'syslog_sequence_numbers'
  properties: {
    source: 'system-default'
    value: 'on'
  }
}

resource flexibleServers_palette365_name_syslog_split_messages 'Microsoft.DBforPostgreSQL/flexibleServers/configurations@2026-01-01-preview' = {
  parent: flexibleServers_palette365_name_resource
  name: 'syslog_split_messages'
  properties: {
    source: 'system-default'
    value: 'on'
  }
}

resource flexibleServers_palette365_name_tcp_keepalives_count 'Microsoft.DBforPostgreSQL/flexibleServers/configurations@2026-01-01-preview' = {
  parent: flexibleServers_palette365_name_resource
  name: 'tcp_keepalives_count'
  properties: {
    source: 'system-default'
    value: '9'
  }
}

resource flexibleServers_palette365_name_tcp_keepalives_idle 'Microsoft.DBforPostgreSQL/flexibleServers/configurations@2026-01-01-preview' = {
  parent: flexibleServers_palette365_name_resource
  name: 'tcp_keepalives_idle'
  properties: {
    source: 'system-default'
    value: '120'
  }
}

resource flexibleServers_palette365_name_tcp_keepalives_interval 'Microsoft.DBforPostgreSQL/flexibleServers/configurations@2026-01-01-preview' = {
  parent: flexibleServers_palette365_name_resource
  name: 'tcp_keepalives_interval'
  properties: {
    source: 'system-default'
    value: '30'
  }
}

resource flexibleServers_palette365_name_tcp_user_timeout 'Microsoft.DBforPostgreSQL/flexibleServers/configurations@2026-01-01-preview' = {
  parent: flexibleServers_palette365_name_resource
  name: 'tcp_user_timeout'
  properties: {
    source: 'system-default'
    value: '0'
  }
}

resource flexibleServers_palette365_name_temp_buffers 'Microsoft.DBforPostgreSQL/flexibleServers/configurations@2026-01-01-preview' = {
  parent: flexibleServers_palette365_name_resource
  name: 'temp_buffers'
  properties: {
    source: 'system-default'
    value: '1024'
  }
}

resource flexibleServers_palette365_name_temp_file_limit 'Microsoft.DBforPostgreSQL/flexibleServers/configurations@2026-01-01-preview' = {
  parent: flexibleServers_palette365_name_resource
  name: 'temp_file_limit'
  properties: {
    source: 'system-default'
    value: '-1'
  }
}

resource flexibleServers_palette365_name_temp_tablespaces 'Microsoft.DBforPostgreSQL/flexibleServers/configurations@2026-01-01-preview' = {
  parent: flexibleServers_palette365_name_resource
  name: 'temp_tablespaces'
  properties: {
    source: 'system-default'
  }
}

resource flexibleServers_palette365_name_timescaledb_bgw_launcher_poll_time 'Microsoft.DBforPostgreSQL/flexibleServers/configurations@2026-01-01-preview' = {
  parent: flexibleServers_palette365_name_resource
  name: 'timescaledb.bgw_launcher_poll_time'
  properties: {
    source: 'system-default'
    value: '60000'
  }
}

resource flexibleServers_palette365_name_timescaledb_disable_load 'Microsoft.DBforPostgreSQL/flexibleServers/configurations@2026-01-01-preview' = {
  parent: flexibleServers_palette365_name_resource
  name: 'timescaledb.disable_load'
  properties: {
    source: 'system-default'
    value: 'off'
  }
}

resource flexibleServers_palette365_name_timescaledb_max_background_workers 'Microsoft.DBforPostgreSQL/flexibleServers/configurations@2026-01-01-preview' = {
  parent: flexibleServers_palette365_name_resource
  name: 'timescaledb.max_background_workers'
  properties: {
    source: 'system-default'
    value: '16'
  }
}

resource flexibleServers_palette365_name_timescaledb_osm_disable_load 'Microsoft.DBforPostgreSQL/flexibleServers/configurations@2026-01-01-preview' = {
  parent: flexibleServers_palette365_name_resource
  name: 'timescaledb_osm.disable_load'
  properties: {
    source: 'system-default'
    value: 'off'
  }
}

resource flexibleServers_palette365_name_TimeZone 'Microsoft.DBforPostgreSQL/flexibleServers/configurations@2026-01-01-preview' = {
  parent: flexibleServers_palette365_name_resource
  name: 'TimeZone'
  properties: {
    source: 'system-default'
    value: 'UTC'
  }
}

resource flexibleServers_palette365_name_timezone_abbreviations 'Microsoft.DBforPostgreSQL/flexibleServers/configurations@2026-01-01-preview' = {
  parent: flexibleServers_palette365_name_resource
  name: 'timezone_abbreviations'
  properties: {
    source: 'user-override'
    value: 'Default'
  }
}

resource flexibleServers_palette365_name_trace_connection_negotiation 'Microsoft.DBforPostgreSQL/flexibleServers/configurations@2026-01-01-preview' = {
  parent: flexibleServers_palette365_name_resource
  name: 'trace_connection_negotiation'
  properties: {
    source: 'system-default'
    value: 'off'
  }
}

resource flexibleServers_palette365_name_trace_notify 'Microsoft.DBforPostgreSQL/flexibleServers/configurations@2026-01-01-preview' = {
  parent: flexibleServers_palette365_name_resource
  name: 'trace_notify'
  properties: {
    source: 'system-default'
    value: 'off'
  }
}

resource flexibleServers_palette365_name_trace_sort 'Microsoft.DBforPostgreSQL/flexibleServers/configurations@2026-01-01-preview' = {
  parent: flexibleServers_palette365_name_resource
  name: 'trace_sort'
  properties: {
    source: 'system-default'
    value: 'off'
  }
}

resource flexibleServers_palette365_name_track_activities 'Microsoft.DBforPostgreSQL/flexibleServers/configurations@2026-01-01-preview' = {
  parent: flexibleServers_palette365_name_resource
  name: 'track_activities'
  properties: {
    source: 'system-default'
    value: 'on'
  }
}

resource flexibleServers_palette365_name_track_activity_query_size 'Microsoft.DBforPostgreSQL/flexibleServers/configurations@2026-01-01-preview' = {
  parent: flexibleServers_palette365_name_resource
  name: 'track_activity_query_size'
  properties: {
    source: 'system-default'
    value: '1024'
  }
}

resource flexibleServers_palette365_name_track_commit_timestamp 'Microsoft.DBforPostgreSQL/flexibleServers/configurations@2026-01-01-preview' = {
  parent: flexibleServers_palette365_name_resource
  name: 'track_commit_timestamp'
  properties: {
    source: 'system-default'
    value: 'off'
  }
}

resource flexibleServers_palette365_name_track_counts 'Microsoft.DBforPostgreSQL/flexibleServers/configurations@2026-01-01-preview' = {
  parent: flexibleServers_palette365_name_resource
  name: 'track_counts'
  properties: {
    source: 'system-default'
    value: 'on'
  }
}

resource flexibleServers_palette365_name_track_functions 'Microsoft.DBforPostgreSQL/flexibleServers/configurations@2026-01-01-preview' = {
  parent: flexibleServers_palette365_name_resource
  name: 'track_functions'
  properties: {
    source: 'system-default'
    value: 'none'
  }
}

resource flexibleServers_palette365_name_track_io_timing 'Microsoft.DBforPostgreSQL/flexibleServers/configurations@2026-01-01-preview' = {
  parent: flexibleServers_palette365_name_resource
  name: 'track_io_timing'
  properties: {
    source: 'system-default'
    value: 'off'
  }
}

resource flexibleServers_palette365_name_track_wal_io_timing 'Microsoft.DBforPostgreSQL/flexibleServers/configurations@2026-01-01-preview' = {
  parent: flexibleServers_palette365_name_resource
  name: 'track_wal_io_timing'
  properties: {
    source: 'system-default'
    value: 'off'
  }
}

resource flexibleServers_palette365_name_transaction_buffers 'Microsoft.DBforPostgreSQL/flexibleServers/configurations@2026-01-01-preview' = {
  parent: flexibleServers_palette365_name_resource
  name: 'transaction_buffers'
  properties: {
    source: 'user-override'
    value: '256'
  }
}

resource flexibleServers_palette365_name_transaction_deferrable 'Microsoft.DBforPostgreSQL/flexibleServers/configurations@2026-01-01-preview' = {
  parent: flexibleServers_palette365_name_resource
  name: 'transaction_deferrable'
  properties: {
    source: 'system-default'
    value: 'off'
  }
}

resource flexibleServers_palette365_name_transaction_isolation 'Microsoft.DBforPostgreSQL/flexibleServers/configurations@2026-01-01-preview' = {
  parent: flexibleServers_palette365_name_resource
  name: 'transaction_isolation'
  properties: {
    source: 'system-default'
    value: 'read committed'
  }
}

resource flexibleServers_palette365_name_transaction_read_only 'Microsoft.DBforPostgreSQL/flexibleServers/configurations@2026-01-01-preview' = {
  parent: flexibleServers_palette365_name_resource
  name: 'transaction_read_only'
  properties: {
    source: 'system-default'
    value: 'off'
  }
}

resource flexibleServers_palette365_name_transaction_timeout 'Microsoft.DBforPostgreSQL/flexibleServers/configurations@2026-01-01-preview' = {
  parent: flexibleServers_palette365_name_resource
  name: 'transaction_timeout'
  properties: {
    source: 'system-default'
    value: '0'
  }
}

resource flexibleServers_palette365_name_transform_null_equals 'Microsoft.DBforPostgreSQL/flexibleServers/configurations@2026-01-01-preview' = {
  parent: flexibleServers_palette365_name_resource
  name: 'transform_null_equals'
  properties: {
    source: 'system-default'
    value: 'off'
  }
}

resource flexibleServers_palette365_name_unix_socket_directories 'Microsoft.DBforPostgreSQL/flexibleServers/configurations@2026-01-01-preview' = {
  parent: flexibleServers_palette365_name_resource
  name: 'unix_socket_directories'
  properties: {
    source: 'user-override'
    value: '/tmp,/tmp/tuning_sockets'
  }
}

resource flexibleServers_palette365_name_unix_socket_group 'Microsoft.DBforPostgreSQL/flexibleServers/configurations@2026-01-01-preview' = {
  parent: flexibleServers_palette365_name_resource
  name: 'unix_socket_group'
  properties: {
    source: 'system-default'
  }
}

resource flexibleServers_palette365_name_unix_socket_permissions 'Microsoft.DBforPostgreSQL/flexibleServers/configurations@2026-01-01-preview' = {
  parent: flexibleServers_palette365_name_resource
  name: 'unix_socket_permissions'
  properties: {
    source: 'user-override'
    value: '0777'
  }
}

resource flexibleServers_palette365_name_update_process_title 'Microsoft.DBforPostgreSQL/flexibleServers/configurations@2026-01-01-preview' = {
  parent: flexibleServers_palette365_name_resource
  name: 'update_process_title'
  properties: {
    source: 'system-default'
    value: 'on'
  }
}

resource flexibleServers_palette365_name_vacuum_buffer_usage_limit 'Microsoft.DBforPostgreSQL/flexibleServers/configurations@2026-01-01-preview' = {
  parent: flexibleServers_palette365_name_resource
  name: 'vacuum_buffer_usage_limit'
  properties: {
    source: 'system-default'
    value: '2048'
  }
}

resource flexibleServers_palette365_name_vacuum_cost_delay 'Microsoft.DBforPostgreSQL/flexibleServers/configurations@2026-01-01-preview' = {
  parent: flexibleServers_palette365_name_resource
  name: 'vacuum_cost_delay'
  properties: {
    source: 'system-default'
    value: '0'
  }
}

resource flexibleServers_palette365_name_vacuum_cost_limit 'Microsoft.DBforPostgreSQL/flexibleServers/configurations@2026-01-01-preview' = {
  parent: flexibleServers_palette365_name_resource
  name: 'vacuum_cost_limit'
  properties: {
    source: 'system-default'
    value: '200'
  }
}

resource flexibleServers_palette365_name_vacuum_cost_page_dirty 'Microsoft.DBforPostgreSQL/flexibleServers/configurations@2026-01-01-preview' = {
  parent: flexibleServers_palette365_name_resource
  name: 'vacuum_cost_page_dirty'
  properties: {
    source: 'system-default'
    value: '20'
  }
}

resource flexibleServers_palette365_name_vacuum_cost_page_hit 'Microsoft.DBforPostgreSQL/flexibleServers/configurations@2026-01-01-preview' = {
  parent: flexibleServers_palette365_name_resource
  name: 'vacuum_cost_page_hit'
  properties: {
    source: 'system-default'
    value: '1'
  }
}

resource flexibleServers_palette365_name_vacuum_cost_page_miss 'Microsoft.DBforPostgreSQL/flexibleServers/configurations@2026-01-01-preview' = {
  parent: flexibleServers_palette365_name_resource
  name: 'vacuum_cost_page_miss'
  properties: {
    source: 'system-default'
    value: '10'
  }
}

resource flexibleServers_palette365_name_vacuum_failsafe_age 'Microsoft.DBforPostgreSQL/flexibleServers/configurations@2026-01-01-preview' = {
  parent: flexibleServers_palette365_name_resource
  name: 'vacuum_failsafe_age'
  properties: {
    source: 'system-default'
    value: '1600000000'
  }
}

resource flexibleServers_palette365_name_vacuum_freeze_min_age 'Microsoft.DBforPostgreSQL/flexibleServers/configurations@2026-01-01-preview' = {
  parent: flexibleServers_palette365_name_resource
  name: 'vacuum_freeze_min_age'
  properties: {
    source: 'system-default'
    value: '50000000'
  }
}

resource flexibleServers_palette365_name_vacuum_freeze_table_age 'Microsoft.DBforPostgreSQL/flexibleServers/configurations@2026-01-01-preview' = {
  parent: flexibleServers_palette365_name_resource
  name: 'vacuum_freeze_table_age'
  properties: {
    source: 'system-default'
    value: '150000000'
  }
}

resource flexibleServers_palette365_name_vacuum_multixact_failsafe_age 'Microsoft.DBforPostgreSQL/flexibleServers/configurations@2026-01-01-preview' = {
  parent: flexibleServers_palette365_name_resource
  name: 'vacuum_multixact_failsafe_age'
  properties: {
    source: 'system-default'
    value: '1600000000'
  }
}

resource flexibleServers_palette365_name_vacuum_multixact_freeze_min_age 'Microsoft.DBforPostgreSQL/flexibleServers/configurations@2026-01-01-preview' = {
  parent: flexibleServers_palette365_name_resource
  name: 'vacuum_multixact_freeze_min_age'
  properties: {
    source: 'system-default'
    value: '5000000'
  }
}

resource flexibleServers_palette365_name_vacuum_multixact_freeze_table_age 'Microsoft.DBforPostgreSQL/flexibleServers/configurations@2026-01-01-preview' = {
  parent: flexibleServers_palette365_name_resource
  name: 'vacuum_multixact_freeze_table_age'
  properties: {
    source: 'system-default'
    value: '150000000'
  }
}

resource flexibleServers_palette365_name_wal_block_size 'Microsoft.DBforPostgreSQL/flexibleServers/configurations@2026-01-01-preview' = {
  parent: flexibleServers_palette365_name_resource
  name: 'wal_block_size'
  properties: {
    source: 'system-default'
    value: '8192'
  }
}

resource flexibleServers_palette365_name_wal_buffers 'Microsoft.DBforPostgreSQL/flexibleServers/configurations@2026-01-01-preview' = {
  parent: flexibleServers_palette365_name_resource
  name: 'wal_buffers'
  properties: {
    source: 'system-default'
    value: '2048'
  }
}

resource flexibleServers_palette365_name_wal_compression 'Microsoft.DBforPostgreSQL/flexibleServers/configurations@2026-01-01-preview' = {
  parent: flexibleServers_palette365_name_resource
  name: 'wal_compression'
  properties: {
    source: 'system-default'
    value: 'on'
  }
}

resource flexibleServers_palette365_name_wal_consistency_checking 'Microsoft.DBforPostgreSQL/flexibleServers/configurations@2026-01-01-preview' = {
  parent: flexibleServers_palette365_name_resource
  name: 'wal_consistency_checking'
  properties: {
    source: 'system-default'
  }
}

resource flexibleServers_palette365_name_wal_decode_buffer_size 'Microsoft.DBforPostgreSQL/flexibleServers/configurations@2026-01-01-preview' = {
  parent: flexibleServers_palette365_name_resource
  name: 'wal_decode_buffer_size'
  properties: {
    source: 'system-default'
    value: '524288'
  }
}

resource flexibleServers_palette365_name_wal_init_zero 'Microsoft.DBforPostgreSQL/flexibleServers/configurations@2026-01-01-preview' = {
  parent: flexibleServers_palette365_name_resource
  name: 'wal_init_zero'
  properties: {
    source: 'system-default'
    value: 'on'
  }
}

resource flexibleServers_palette365_name_wal_keep_size 'Microsoft.DBforPostgreSQL/flexibleServers/configurations@2026-01-01-preview' = {
  parent: flexibleServers_palette365_name_resource
  name: 'wal_keep_size'
  properties: {
    source: 'user-override'
    value: '400'
  }
}

resource flexibleServers_palette365_name_wal_level 'Microsoft.DBforPostgreSQL/flexibleServers/configurations@2026-01-01-preview' = {
  parent: flexibleServers_palette365_name_resource
  name: 'wal_level'
  properties: {
    source: 'system-default'
    value: 'replica'
  }
}

resource flexibleServers_palette365_name_wal_log_hints 'Microsoft.DBforPostgreSQL/flexibleServers/configurations@2026-01-01-preview' = {
  parent: flexibleServers_palette365_name_resource
  name: 'wal_log_hints'
  properties: {
    source: 'system-default'
    value: 'off'
  }
}

resource flexibleServers_palette365_name_wal_receiver_create_temp_slot 'Microsoft.DBforPostgreSQL/flexibleServers/configurations@2026-01-01-preview' = {
  parent: flexibleServers_palette365_name_resource
  name: 'wal_receiver_create_temp_slot'
  properties: {
    source: 'system-default'
    value: 'off'
  }
}

resource flexibleServers_palette365_name_wal_receiver_status_interval 'Microsoft.DBforPostgreSQL/flexibleServers/configurations@2026-01-01-preview' = {
  parent: flexibleServers_palette365_name_resource
  name: 'wal_receiver_status_interval'
  properties: {
    source: 'system-default'
    value: '10'
  }
}

resource flexibleServers_palette365_name_wal_receiver_timeout 'Microsoft.DBforPostgreSQL/flexibleServers/configurations@2026-01-01-preview' = {
  parent: flexibleServers_palette365_name_resource
  name: 'wal_receiver_timeout'
  properties: {
    source: 'system-default'
    value: '60000'
  }
}

resource flexibleServers_palette365_name_wal_recycle 'Microsoft.DBforPostgreSQL/flexibleServers/configurations@2026-01-01-preview' = {
  parent: flexibleServers_palette365_name_resource
  name: 'wal_recycle'
  properties: {
    source: 'system-default'
    value: 'on'
  }
}

resource flexibleServers_palette365_name_wal_retrieve_retry_interval 'Microsoft.DBforPostgreSQL/flexibleServers/configurations@2026-01-01-preview' = {
  parent: flexibleServers_palette365_name_resource
  name: 'wal_retrieve_retry_interval'
  properties: {
    source: 'system-default'
    value: '5000'
  }
}

resource flexibleServers_palette365_name_wal_segment_size 'Microsoft.DBforPostgreSQL/flexibleServers/configurations@2026-01-01-preview' = {
  parent: flexibleServers_palette365_name_resource
  name: 'wal_segment_size'
  properties: {
    source: 'system-default'
    value: '16777216'
  }
}

resource flexibleServers_palette365_name_wal_sender_timeout 'Microsoft.DBforPostgreSQL/flexibleServers/configurations@2026-01-01-preview' = {
  parent: flexibleServers_palette365_name_resource
  name: 'wal_sender_timeout'
  properties: {
    source: 'system-default'
    value: '60000'
  }
}

resource flexibleServers_palette365_name_wal_skip_threshold 'Microsoft.DBforPostgreSQL/flexibleServers/configurations@2026-01-01-preview' = {
  parent: flexibleServers_palette365_name_resource
  name: 'wal_skip_threshold'
  properties: {
    source: 'system-default'
    value: '2048'
  }
}

resource flexibleServers_palette365_name_wal_summary_keep_time 'Microsoft.DBforPostgreSQL/flexibleServers/configurations@2026-01-01-preview' = {
  parent: flexibleServers_palette365_name_resource
  name: 'wal_summary_keep_time'
  properties: {
    source: 'system-default'
    value: '14400'
  }
}

resource flexibleServers_palette365_name_wal_sync_method 'Microsoft.DBforPostgreSQL/flexibleServers/configurations@2026-01-01-preview' = {
  parent: flexibleServers_palette365_name_resource
  name: 'wal_sync_method'
  properties: {
    source: 'system-default'
    value: 'fdatasync'
  }
}

resource flexibleServers_palette365_name_wal_writer_delay 'Microsoft.DBforPostgreSQL/flexibleServers/configurations@2026-01-01-preview' = {
  parent: flexibleServers_palette365_name_resource
  name: 'wal_writer_delay'
  properties: {
    source: 'system-default'
    value: '200'
  }
}

resource flexibleServers_palette365_name_wal_writer_flush_after 'Microsoft.DBforPostgreSQL/flexibleServers/configurations@2026-01-01-preview' = {
  parent: flexibleServers_palette365_name_resource
  name: 'wal_writer_flush_after'
  properties: {
    source: 'system-default'
    value: '128'
  }
}

resource flexibleServers_palette365_name_work_mem 'Microsoft.DBforPostgreSQL/flexibleServers/configurations@2026-01-01-preview' = {
  parent: flexibleServers_palette365_name_resource
  name: 'work_mem'
  properties: {
    source: 'system-default'
    value: '4096'
  }
}

resource flexibleServers_palette365_name_xmlbinary 'Microsoft.DBforPostgreSQL/flexibleServers/configurations@2026-01-01-preview' = {
  parent: flexibleServers_palette365_name_resource
  name: 'xmlbinary'
  properties: {
    source: 'system-default'
    value: 'base64'
  }
}

resource flexibleServers_palette365_name_xmloption 'Microsoft.DBforPostgreSQL/flexibleServers/configurations@2026-01-01-preview' = {
  parent: flexibleServers_palette365_name_resource
  name: 'xmloption'
  properties: {
    source: 'system-default'
    value: 'content'
  }
}

resource flexibleServers_palette365_name_zero_damaged_pages 'Microsoft.DBforPostgreSQL/flexibleServers/configurations@2026-01-01-preview' = {
  parent: flexibleServers_palette365_name_resource
  name: 'zero_damaged_pages'
  properties: {
    source: 'system-default'
    value: 'off'
  }
}

resource flexibleServers_palette365_name_azure_maintenance 'Microsoft.DBforPostgreSQL/flexibleServers/databases@2026-01-01-preview' = {
  parent: flexibleServers_palette365_name_resource
  name: 'azure_maintenance'
  properties: {
    charset: 'UTF8'
    collation: 'en_US.utf8'
  }
}

resource flexibleServers_palette365_name_azure_sys 'Microsoft.DBforPostgreSQL/flexibleServers/databases@2026-01-01-preview' = {
  parent: flexibleServers_palette365_name_resource
  name: 'azure_sys'
  properties: {
    charset: 'UTF8'
    collation: 'en_US.utf8'
  }
}

resource flexibleServers_palette365_name_postgres 'Microsoft.DBforPostgreSQL/flexibleServers/databases@2026-01-01-preview' = {
  parent: flexibleServers_palette365_name_resource
  name: 'postgres'
  properties: {
    charset: 'UTF8'
    collation: 'en_US.utf8'
  }
}

resource flexibleServers_palette365_name_AllowAllAzureServicesAndResourcesWithinAzureIps_2026_4_9_16_5_7 'Microsoft.DBforPostgreSQL/flexibleServers/firewallRules@2026-01-01-preview' = {
  parent: flexibleServers_palette365_name_resource
  name: 'AllowAllAzureServicesAndResourcesWithinAzureIps_2026-4-9_16-5-7'
  properties: {
    endIpAddress: '0.0.0.0'
    startIpAddress: '0.0.0.0'
  }
}

resource flexibleServers_palette365_name_ClientIPAddress_2026_3_28_14_25_15 'Microsoft.DBforPostgreSQL/flexibleServers/firewallRules@2026-01-01-preview' = {
  parent: flexibleServers_palette365_name_resource
  name: 'ClientIPAddress_2026-3-28_14-25-15'
  properties: {
    endIpAddress: '92.208.108.168'
    startIpAddress: '92.208.108.168'
  }
}

resource vaults_palette365_name_jwt_key 'Microsoft.KeyVault/vaults/keys@2026-03-01-preview' = {
  parent: vaults_palette365_name_resource
  location: 'westeurope'
  name: 'jwt-key'
  properties: {
    attributes: {
      enabled: true
      exportable: false
    }
  }
}

resource vaults_palette365_name_az_storage_conn_string 'Microsoft.KeyVault/vaults/secrets@2026-03-01-preview' = {
  parent: vaults_palette365_name_resource
  location: 'westeurope'
  name: 'az-storage-conn-string'
  properties: {
    attributes: {
      enabled: true
    }
  }
}

resource vaults_palette365_name_azure_storage_account_key 'Microsoft.KeyVault/vaults/secrets@2026-03-01-preview' = {
  parent: vaults_palette365_name_resource
  location: 'westeurope'
  name: 'azure-storage-account-key'
  properties: {
    attributes: {
      enabled: true
    }
  }
}

resource vaults_palette365_name_conn_string 'Microsoft.KeyVault/vaults/secrets@2026-03-01-preview' = {
  parent: vaults_palette365_name_resource
  location: 'westeurope'
  name: 'conn-string'
  properties: {
    attributes: {
      enabled: true
    }
  }
}

resource vaults_palette365_name_db_password 'Microsoft.KeyVault/vaults/secrets@2026-03-01-preview' = {
  parent: vaults_palette365_name_resource
  location: 'westeurope'
  name: 'db-password'
  properties: {
    attributes: {
      enabled: true
    }
  }
}

resource vaults_palette365_name_mail_password 'Microsoft.KeyVault/vaults/secrets@2026-03-01-preview' = {
  parent: vaults_palette365_name_resource
  location: 'westeurope'
  name: 'mail-password'
  properties: {
    attributes: {
      enabled: true
    }
  }
}

resource vaults_palette365_name_secret_key 'Microsoft.KeyVault/vaults/secrets@2026-03-01-preview' = {
  parent: vaults_palette365_name_resource
  location: 'westeurope'
  name: 'secret-key'
  properties: {
    attributes: {
      enabled: true
    }
  }
}

resource sites_api_palette365_name_resource 'Microsoft.Web/sites@2024-11-01' = {
  identity: {
    type: 'SystemAssigned'
  }
  kind: 'app,linux,container'
  location: 'West Europe'
  name: sites_api_palette365_name
  properties: {
    autoGeneratedDomainNameLabelScope: 'TenantReuse'
    clientAffinityEnabled: false
    clientAffinityProxyEnabled: false
    clientCertEnabled: false
    clientCertMode: 'Required'
    containerSize: 0
    customDomainVerificationId: '4AC1062FA8510E5FC007976BC436D7B61EA07EBFFCB8F40E582470C52B75A968'
    dailyMemoryTimeQuota: 0
    dnsConfiguration: {}
    enabled: true
    endToEndEncryptionEnabled: false
    hostNameSslStates: [
      {
        hostType: 'Standard'
        name: 'api.palletly.de'
        sslState: 'SniEnabled'
        thumbprint: '821265288F7A7476B5751B41941A11AC127EAD48'
      }
      {
        hostType: 'Repository'
        name: '${sites_api_palette365_name}-epd7djg9hrcad3cy.scm.westeurope-01.azurewebsites.net'
        sslState: 'Disabled'
      }
      {
        hostType: 'Standard'
        name: '${sites_api_palette365_name}-epd7djg9hrcad3cy.westeurope-01.azurewebsites.net'
        sslState: 'Disabled'
      }
      {
        hostType: 'Standard'
        name: 'palletly.de'
        sslState: 'SniEnabled'
        thumbprint: 'D55F97926B9E282340CD9BD7DF55BD9F5440D0D1'
      }
    ]
    hostNamesDisabled: false
    httpsOnly: true
    hyperV: false
    ipMode: 'IPv4'
    isXenon: false
    keyVaultReferenceIdentity: 'SystemAssigned'
    outboundVnetRouting: {
      allTraffic: false
      applicationTraffic: false
      backupRestoreTraffic: false
      contentShareTraffic: false
      imagePullTraffic: false
    }
    publicNetworkAccess: 'Enabled'
    redundancyMode: 'None'
    reserved: true
    scmSiteAlsoStopped: false
    serverFarmId: serverfarms_ASP_rgpalette365dev_97a4_name_resource.id
    siteConfig: {
      acrUseManagedIdentityCreds: false
      alwaysOn: true
      functionAppScaleLimit: 0
      http20Enabled: false
      linuxFxVersion: 'DOCKER|docker.io/dingqinghe/api:751926887ef1a978c1e4f40995a6e8c98d948527'
      minimumElasticInstanceCount: 1
      numberOfWorkers: 1
    }
    sshEnabled: true
    storageAccountRequired: false
  }
  tags: {
    app: 'api'
    env: 'dev'
  }
}

resource sites_api_palette365_name_ftp 'Microsoft.Web/sites/basicPublishingCredentialsPolicies@2024-11-01' = {
  parent: sites_api_palette365_name_resource
  location: 'West Europe'
  name: 'ftp'
  properties: {
    allow: false
  }
  tags: {
    app: 'api'
    env: 'dev'
  }
}

resource sites_api_palette365_name_scm 'Microsoft.Web/sites/basicPublishingCredentialsPolicies@2024-11-01' = {
  parent: sites_api_palette365_name_resource
  location: 'West Europe'
  name: 'scm'
  properties: {
    allow: false
  }
  tags: {
    app: 'api'
    env: 'dev'
  }
}

resource sites_api_palette365_name_web 'Microsoft.Web/sites/config@2024-11-01' = {
  parent: sites_api_palette365_name_resource
  location: 'West Europe'
  name: 'web'
  properties: {
    acrUseManagedIdentityCreds: false
    alwaysOn: true
    autoHealEnabled: false
    azureStorageAccounts: {}
    defaultDocuments: [
      'Default.htm'
      'Default.html'
      'Default.asp'
      'index.htm'
      'index.html'
      'iisstart.htm'
      'default.aspx'
      'index.php'
      'hostingstart.html'
    ]
    detailedErrorLoggingEnabled: false
    elasticWebAppScaleLimit: 0
    experiments: {
      rampUpRules: []
    }
    ftpsState: 'FtpsOnly'
    functionsRuntimeScaleMonitoringEnabled: false
    http20Enabled: false
    http20ProxyFlag: 0
    httpLoggingEnabled: true
    ipSecurityRestrictions: [
      {
        action: 'Allow'
        description: 'Allow all access'
        ipAddress: 'Any'
        name: 'Allow all'
        priority: 2147483647
      }
    ]
    linuxFxVersion: 'DOCKER|docker.io/dingqinghe/api:751926887ef1a978c1e4f40995a6e8c98d948527'
    loadBalancing: 'LeastRequests'
    localMySqlEnabled: false
    logsDirectorySizeLimit: 100
    managedPipelineMode: 'Integrated'
    managedServiceIdentityId: 22289
    minTlsVersion: '1.2'
    minimumElasticInstanceCount: 1
    netFrameworkVersion: 'v4.0'
    numberOfWorkers: 1
    preWarmedInstanceCount: 0
    publicNetworkAccess: 'Enabled'
    publishingUsername: 'REDACTED'
    remoteDebuggingEnabled: false
    remoteDebuggingVersion: 'VS2022'
    requestTracingEnabled: false
    scmIpSecurityRestrictions: [
      {
        action: 'Allow'
        description: 'Allow all access'
        ipAddress: 'Any'
        name: 'Allow all'
        priority: 2147483647
      }
    ]
    scmIpSecurityRestrictionsUseMain: false
    scmMinTlsVersion: '1.2'
    scmType: 'None'
    use32BitWorkerProcess: true
    virtualApplications: [
      {
        physicalPath: 'site\\wwwroot'
        preloadEnabled: true
        virtualPath: '/'
      }
    ]
    vnetPrivatePortsCount: 0
    vnetRouteAllEnabled: false
    webSocketsEnabled: false
  }
  tags: {
    app: 'api'
    env: 'dev'
  }
}

resource sites_api_palette365_name_api_palletly_de 'Microsoft.Web/sites/hostNameBindings@2024-11-01' = {
  parent: sites_api_palette365_name_resource
  location: 'West Europe'
  name: 'api.palletly.de'
  properties: {
    hostNameType: 'Verified'
    siteName: 'api-palette365'
    sslState: 'SniEnabled'
    thumbprint: '821265288F7A7476B5751B41941A11AC127EAD48'
  }
}

resource sites_api_palette365_name_sites_api_palette365_name_epd7djg9hrcad3cy_westeurope_01_azurewebsites_net 'Microsoft.Web/sites/hostNameBindings@2024-11-01' = {
  parent: sites_api_palette365_name_resource
  location: 'West Europe'
  name: '${sites_api_palette365_name}-epd7djg9hrcad3cy.westeurope-01.azurewebsites.net'
  properties: {
    hostNameType: 'Verified'
    siteName: 'api-palette365'
  }
}

resource sites_api_palette365_name_palletly_de 'Microsoft.Web/sites/hostNameBindings@2024-11-01' = {
  parent: sites_api_palette365_name_resource
  location: 'West Europe'
  name: 'palletly.de'
  properties: {
    hostNameType: 'Verified'
    siteName: 'api-palette365'
    sslState: 'SniEnabled'
    thumbprint: 'D55F97926B9E282340CD9BD7DF55BD9F5440D0D1'
  }
}

resource sites_api_palette365_name_main 'Microsoft.Web/sites/sitecontainers@2024-11-01' = {
  parent: sites_api_palette365_name_resource
  location: 'West Europe'
  name: 'main'
  properties: {
    authType: 'Anonymous'
    environmentVariables: []
    image: 'docker.io/dingqinghe/api:f299b554d87ad2219fd611a61e059340e5274236'
    inheritAppSettingsAndConnectionStrings: true
    isMain: true
    targetPort: '8081'
    volumeMounts: []
  }
}

resource staticSites_admin_name_default 'Microsoft.Web/staticSites/basicAuth@2024-11-01' = {
  parent: staticSites_admin_name_resource
  location: 'West Europe'
  name: 'default'
  properties: {
    applicableEnvironmentsMode: 'SpecifiedEnvironments'
  }
}

resource staticSites_info_name_default 'Microsoft.Web/staticSites/basicAuth@2024-11-01' = {
  parent: staticSites_info_name_resource
  location: 'West Europe'
  name: 'default'
  properties: {
    applicableEnvironmentsMode: 'SpecifiedEnvironments'
  }
}

resource staticSites_ui_buyer_name_default 'Microsoft.Web/staticSites/basicAuth@2024-11-01' = {
  parent: staticSites_ui_buyer_name_resource
  location: 'West Europe'
  name: 'default'
  properties: {
    applicableEnvironmentsMode: 'SpecifiedEnvironments'
  }
}

resource staticSites_ui_seller_name_default 'Microsoft.Web/staticSites/basicAuth@2024-11-01' = {
  parent: staticSites_ui_seller_name_resource
  location: 'West Europe'
  name: 'default'
  properties: {
    applicableEnvironmentsMode: 'SpecifiedEnvironments'
  }
}

resource staticSites_admin_name_staticSites_admin_name_palletly_de 'Microsoft.Web/staticSites/customDomains@2024-11-01' = {
  parent: staticSites_admin_name_resource
  location: 'West Europe'
  name: '${staticSites_admin_name}.palletly.de'
  properties: {}
}

resource staticSites_info_name_staticSites_info_name_palette365_de 'Microsoft.Web/staticSites/customDomains@2024-11-01' = {
  parent: staticSites_info_name_resource
  location: 'West Europe'
  name: '${staticSites_info_name}.palette365.de'
  properties: {}
}

resource staticSites_info_name_palette365_de 'Microsoft.Web/staticSites/customDomains@2024-11-01' = {
  parent: staticSites_info_name_resource
  location: 'West Europe'
  name: 'palette365.de'
  properties: {}
}

resource staticSites_ui_buyer_name_palletly_de 'Microsoft.Web/staticSites/customDomains@2024-11-01' = {
  parent: staticSites_ui_buyer_name_resource
  location: 'West Europe'
  name: 'palletly.de'
  properties: {}
}

resource staticSites_ui_seller_name_palletly_de 'Microsoft.Web/staticSites/customDomains@2024-11-01' = {
  parent: staticSites_ui_seller_name_resource
  location: 'West Europe'
  name: 'palletly.de'
  properties: {}
}

resource staticSites_ui_seller_name_seller_palletly_de 'Microsoft.Web/staticSites/customDomains@2024-11-01' = {
  parent: staticSites_ui_seller_name_resource
  location: 'West Europe'
  name: 'seller.palletly.de'
  properties: {}
}

resource staticSites_ui_buyer_name_www_palletly_de 'Microsoft.Web/staticSites/customDomains@2024-11-01' = {
  parent: staticSites_ui_buyer_name_resource
  location: 'West Europe'
  name: 'www.palletly.de'
  properties: {}
}
