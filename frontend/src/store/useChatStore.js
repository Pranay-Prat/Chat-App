import { create } from "zustand";
import toast from "react-hot-toast";
import { axiosInstance } from "../lib/axios";
import {useAuthStore} from "./useAuthStore";

export const useChatStore = create((set, get) => ({
    messages: [],
    users: [],
    selectedUser: null,
    isUserLoading: false,
    isMessagesLoading: false,
    getUsers: async () => {
        set({isUserLoading: true})
        try {
            const response = await axiosInstance.get('/messages/user')
            set({users: response.data.filteredUsers})
        } catch (error) {
            console.error("Error fetching users:", error)
            toast.error(error?.response?.data?.message || 'Something went wrong')
            set({users: []})
        } finally {
            set({isUserLoading: false})
        }
    },
    getMessages: async (userId) => {
        set({isMessagesLoading: true})
        try {
            const response = await axiosInstance.get(`/messages/${userId}`)
            set({messages: response.data.messages})
            console.log("Messages:", response.data.messages)
        } catch (error) {
            toast.error(error?.response?.data?.message || 'Something went wrong')
        } finally {
            set({isMessagesLoading: false})
        }   
    },
    sendMessage: async (messageData) => {
        const {selectedUser, messages} = get()
        try {
            const response = await axiosInstance.post(`/messages/send/${selectedUser._id}`, messageData)
            set({messages: [...messages, response.data]})
        } catch (error) {
            toast.error(error?.response?.data?.message || 'Something went wrong')
        }
    },
    subscribeToMessages: () => {
        const {selectedUser} = get()
        if(!selectedUser) return;
        const socket = useAuthStore.getState().socket;
        socket.on("newMessage", (newMessage) => {
            if(newMessage.senderId !== selectedUser._id) return;
            set({
                messages: [...get().messages, newMessage]
            })
        })
    }, 
    unsubscribeFromMessages: () => {
        const socket = useAuthStore.getState().socket;
        socket.off("newMessage");
    },
    setSelectedUser: (selectedUser) => set({selectedUser}),
}))