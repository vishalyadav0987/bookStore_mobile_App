import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';

// 🔁 Change this to your machine's IP (run `ipconfig` or `ifconfig`)
const BASE_URL = 'http://localhost:4000';

export const useAuthStore = create((set) => ({
    user: null,
    isLoading: false,
    token: null,


    register: async (name, email, password) => {
        set({ isLoading: true });
        try {
            const response = await fetch(`${BASE_URL}/api/v1/auth/sign-up`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    name,
                    email,
                    password,
                }),
            });

            const text = await response.text();

            let data;

            try {
                data = JSON.parse(text);
                // console.log(data.user);

            } catch (err) {
                throw new Error('Server did not return JSON:\n' + text);
            }

            if (response.ok) {
                set({
                    user: data.user,
                    token: data.token,
                    isLoading: false,
                });

                await AsyncStorage.setItem('user', JSON.stringify(data.user));
                await AsyncStorage.setItem('token', data.token);

                return {
                    success: true,
                    message: data.message,
                    user: data.user
                };
            } else {
                throw new Error(data.message || 'Something went wrong!!');
            }

        } catch (error) {
            console.error('Registration error:', error.message);
            set({ isLoading: false });
            return {
                success: false,
                error: error.message,
            };
        }
    },

    loginUser: async (email, password) => {
        set({ isLoading: true });
      
        try {
          const response = await fetch(`${BASE_URL}/api/v1/auth/sign-in`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email, password }),
          });
      
          const text = await response.text();
          let data;
      
          try {
            data = JSON.parse(text);
          } catch (err) {
            throw new Error('Server did not return valid JSON:\n' + text);
          }
      
          if (response.ok) {
            set({
              user: data.data,
              token: data.token,
              isLoading: false,
            });
      
            await AsyncStorage.setItem('user', JSON.stringify(data.data));
            await AsyncStorage.setItem('token', data.token);
      
            return {
              success: true,
              message: data.message,
              
            };
          } else {
            throw new Error(data.message || 'Login failed');
          }
        } catch (err) {
          console.error('Login error:', err.message);
          set({ isLoading: false });
          return {
            success: false,
            error: err.message,
          };
        }
      },
      


    checkAuth: async () => {
        try {
            const token = await AsyncStorage.getItem('token');
            const userJson = await AsyncStorage.getItem('user');
            const user = userJson ? JSON.parse(userJson) : null;
            if (token && user) {
                set({
                    user: user,
                    token: token,
                })
            }

        } catch (error) {
            console.error('Error checking auth:', error.message);

        }
    },

    logoutUser: async () => {
        try {
            await AsyncStorage.removeItem('token');
            await AsyncStorage.removeItem('user');
            set({
                user: null,
                token: null,
            })
        } catch (error) {
            console.error('Error logging out:', error.message);

        }
    }





}));
