import { LogLevel } from "@azure/msal-browser";

const clientId = import.meta.env.VITE_AZURE_CLIENT_ID;
const tenantId = import.meta.env.VITE_AZURE_TENANT_ID;
const redirectUri = import.meta.env.VITE_AZURE_REDIRECT_URI;

export const msalConfig = {
    auth: {
        clientId,
        authority: `https://login.microsoftonline.com/${tenantId}`,
        redirectUri,
        postLogoutRedirectUri: redirectUri,
        navigateToLoginRequestUrl: false,
    },
    cache: {
        cacheLocation: 'sessionStorage',
        storeAuthStateInCookie: false,
    },
    system: {
        loggerOptions: {
            loggerCallback: (level, message, containsPii) => {
                if (containsPii) return;
                switch (level) {
                    case LogLevel.Error:   console.error(message); return;
                    case LogLevel.Info:    console.info(message);  return;
                    case LogLevel.Verbose: console.debug(message); return;
                    case LogLevel.Warning: console.warn(message);  return;
                    default: return;
                }
            }
        }
    }
};

export const loginRequest = {
    scopes: [`api://${clientId}/access_as_admin`],
};