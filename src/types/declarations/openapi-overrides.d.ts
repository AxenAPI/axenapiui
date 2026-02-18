declare module '@shared/openapi' {
  export * from '@shared/api/adapters';
}

declare module '*/backend-info.json' {
  interface BackendInfo {
    backendVersion: string;
    buildDate: string;
    updatedAt: string;
  }
  const value: BackendInfo;
  export default value;
}
