export interface ApiResponse<T> {
  status: number;
  message: string;
  data: T;
  timestamp: number;
}

export type LoginResponse = {
  $id: string;
  jwtToken: string;
  refreshToken: string;
  campusCode: string;
  role: string;
  email: string;
  name: string;
  image: string;
};
