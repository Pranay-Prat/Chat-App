import {create} from 'zustand';
import { axiosInstance } from '../lib/axios.js';
import toast from 'react-hot-toast';
import { io } from 'socket.io-client';  
const BASE_URL = import.meta.env.MODE === 'development' ? `${import.meta.env.VITE_REACT_APP_BACKEND_URL}` : '/';
export const useAuthStore = create((set,get) => ({
    authUser: null,
    isCheckingAuth: true,
    isSigningUp: false,
    isLoggingIn: false,
    isUpdatingProfile: false,
    onlineUsers: [],
    socket:null,
    checkAuth: async () => {
        try {
            const response = await axiosInstance.get('/auth/check');
            set({ authUser: response.data});
            get().connectSocket()
        } catch (error) {
            set({authUser:null})
            console.log("Error checking auth:", error.message);
            }finally{
                set({isCheckingAuth:false})
            }
        },
    signup: async (formData) => {
        set({ isSigningUp: true });
            try {
                const response = await axiosInstance.post('/auth/signup', formData);
                toast.success('Account created successfully!');
                set({ authUser: response.data });
                get().connectSocket()
            } catch (error) {
                console.log("Error signing up:", error.message);
                toast.error(error?.response?.data?.message || 'Error signing up');
            } finally {
                set({ isSigningUp: false });
            }
        },
    logout: async() =>{
        try {
            await axiosInstance.post('/auth/logout');
            set({ authUser: null });
            toast.success('Logged out successfully!');
            get().disconnectSocket()
        } catch (error) {
            console.log("Error logging out:", error.message);
            toast.error(error?.response?.data?.message || 'Error logging out');
        }
    },
    login: async(formData) =>{
        set({ isLoggingIn: true });
        try {
            const response = await axiosInstance.post('/auth/login', formData);
            set({ authUser: response.data });
            toast.success('Logged in successfully!');
            get().connectSocket()
        } catch (error) {
            console.log("Error logging in:", error.message);
            toast.error(error?.response?.data?.message || 'Error logging in');
            
        }finally {
            set({ isLoggingIn: false });
        }
    },
    updateProfile: async(data)=>{
        set({ isUpdatingProfile: true });
        try {
            const response = await axiosInstance.put('/auth/update-profile', data);
            set({ authUser: response.data });
            toast.success('Profile updated successfully!');
        } catch (error) {
            console.log("Error updating profile:", error.message);
            toast.error(error?.response?.data?.message || 'Error updating profile');
        }finally {
            set({ isUpdatingProfile: false });
        }

    },
    connectSocket:()=>{
        const {authUser} = get()
        if(!authUser || get().socket?.connected) return;
        const socket = io(BASE_URL,{
            withCredentials: true,
        })
        socket.connect()
        set({socket:socket})
        socket.on('getOnlineUsers',(userIds)=>{
            set({onlineUsers:userIds})
            console.log("Online Users:", userIds);

        })

    },
    disconnectSocket:()=>{
        if(get().socket?.connected) get().socket.disconnect();
        
    }
    }));