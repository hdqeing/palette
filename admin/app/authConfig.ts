import { LogLevel } from "@azure/msal-browser";

export const msalConfig = {
    auth: {
        clientId: '02d84ec3-f7fd-46d0-994a-9f2f1f81fdcf',
        authority: 'https://login.microsoftonline.com/d13e89a2-46ab-48c5-ba97-7fdad1035704',
        redirectUri: 'https://admin.palletly.de',
        postLogoutRedirectUri: 'https://admin.palletly.de',
        navigateToLoginRequestUrl: false,
    },
    cache: {
        cacheLocation: 'sessionStorage',
        storeAuthStateInCookie: false,
    },
    system: {
        loggerOptions: {
            loggerCallback: (level, message, containsPii) => {
                if (containsPii) {
                    return;
                }
                switch (level) {
                    case LogLevel.Error:
                        console.error(message);
                        return;
                    case LogLevel.Info:
                        console.info(message);
                        return;
                    case LogLevel.Verbose:
                        console.debug(message);
                        return;
                    case LogLevel.Warning:
                        console.warn(message);
                        return;
                    default:
                        return;
                }
            }
        }
    }
}

export const loginRequest = {
    scopes: ['api://02d84ec3-f7fd-46d0-994a-9f2f1f81fdcf/access_as_admin'],
}