import { persist } from "zustand/middleware";
import { create } from "zustand";

interface AuthState {
  accessToken: string | null;
  refreshToken: string | null;
  role: string | null;
  name: string | null;
  email: string | null;
  image: string;
  setAuthData: (
    accessToken: string,
    refreshToken: string,
    role: string,
    name: string,
    email: string,
    image: string,
  ) => void;
  clearTokens: () => void;
  updateToken: (accessToken: string, refreshToken: string) => void;
}

const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      accessToken: null,
      refreshToken: null,
      role: null,
      name: null,
      email: null,
      image: "",
      setAuthData: (
        accessToken: string,
        refreshToken: string,
        role: string,
        name: string,
        email: string,
        image: string,
      ) =>
        set({
          accessToken,
          refreshToken,
          role,
          name,
          email,
          image,
        }),
      clearTokens: () =>
        set({
          accessToken: null,
          refreshToken: null,
          role: null,
          name: null,
          email: null,
          image: "",
        }),
      getRole: () => get().role,
      updateToken: (accessToken: string, refreshToken: string) =>
        set({
          accessToken,

          refreshToken,
        }),
    }),
    {
      name: "auth-storage", // Key to store in localStorage
    },
  ),
);

export default useAuthStore;
