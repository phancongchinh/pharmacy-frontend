/// <reference types="vite/client" />

declare global {
  interface Window {
    google: {
      accounts: {
        id: {
          initialize: (config: any) => void
          prompt: (callback?: (notification: any) => void) => void
          renderButton: (element: HTMLElement, options: any) => void
          cancel: () => void
        }
        oauth2: {
          initTokenClient: (config: any) => {
            requestAccessToken: () => void
          }
        }
      }
    }
  }
}

interface ImportMetaEnv {
  readonly VITE_GOOGLE_CLIENT_ID: string
  // add more env variables here as needed
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
