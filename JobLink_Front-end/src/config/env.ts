const META = {
  BASE_URL: (import.meta.env.PUBLIC_ENV__META__BASE_URL ?? "") as string,
  BACKEND: (import.meta.env.PUBLIC_ENV__META__BACKEND ?? "") as string,
};

export { META };
