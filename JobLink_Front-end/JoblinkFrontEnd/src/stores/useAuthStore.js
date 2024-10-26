import { persist } from 'zustand/middleware'
import { create } from 'zustand'
import agent from '@/lib/axios';

const useAuthStore = create()(
  persist(
    (set, get) => ({
      id: null,
      username: null,
      email: null,
      firstName: null,
      lastName: null,
      phoneNumber: null,
      avatar: null,
      refreshToken: null,
      accountBalance: null,
      setAuthData: (
        id,
        username,
        email,
        firstName,
        lastName,
        phoneNumber,
        avatar,
        refreshToken,
        accountBalance
      ) =>
        set({
          id,
          username,
          email,
          firstName,
          lastName,
          phoneNumber,
          avatar,
          refreshToken,
          accountBalance
        }),
      clearTokens: () =>
        set({
          id: null,
          username: null,
          email: null,
          firstName: null,
          lastName: null,
          phoneNumber: null,
          avatar: null,
          refreshToken: null,
          accountBalance: null
        }),
      refreshUserData: async () => {
        try {
          const response = await agent.User.me(); // Replace with your API call to get user data
          set({
             accountBalance:response.accountBalance
          }
           
          )
        } catch (error) {
          console.error('Failed to refresh user data:', error);
        }
      },
    }),
    {
      name: 'auth-storage', // Key to store in localStorage
    },
  ),
)
export default useAuthStore
