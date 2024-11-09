const META = {
    BASE_URL: import.meta.env.PUBLIC_ENV__META__BASE_URL ?? '',
    BACKEND: import.meta.env.VITE__META__BACKEND ?? 'http://localhost:8080',
    CHECKSUM_KEY: import.meta.env.PUBLIC_ENV__META__CHECKSUM_KEY ?? '',
    GOOGLE_CLIENT_KEY: import.meta.env.PUBLIC_ENV__META__GOOGLE_CLIENT_KEY,
  }
  
  export { META }
  