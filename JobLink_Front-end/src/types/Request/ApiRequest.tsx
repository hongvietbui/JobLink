export type LoginRequest = {
  code: string | undefined;
  campusCode: string | null;
};

export type LogoutRequest = {
  refreshToken: string | null;
  accessToken: string | null;
};
