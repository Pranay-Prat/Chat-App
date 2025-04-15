import { create } from "zustand";
import toast from "react-hot-toast";
import { axiosInstance } from "../lib/axios";
export const useChatStore = create((set,get) => ({
    messages:[],
    users:[],
    selectedUser:null,
    isUserLoading:false,
    isMessagesLoading:false,
    getUsers: async () => {
        set({isUserLoading:true})
        try {
            const response = await axiosInstance.get('/messages/user')
            set({users:response.data})
        } catch (error) {
            toast.error(error?.response?.data?.message || 'Something went wrong')
        } finally {
            set({isUserLoading:false})
        }
    },
    getMessages: async (userId) => {
        set({isMessagesLoading:true})
        try {
            const response = await axiosInstance.get(`/messages/${userId}`)
            set({messages:response.data})
        } catch (error) {
            toast.error(error?.response?.data?.message || 'Something went wrong')
        } finally {
            set({isMessagesLoading:false})
        }   
    },
    sendMessage: async (messageData) => {
        const {selectedUser, messages} = get()
        try {
            const response = await axiosInstance.post(`/messages/send/${selectedUser._id}`,messageData)
            set({messages:[...messages,response.data]})
        } catch (error) {
            toast.error(error?.response?.data?.message || 'Something went wrong')
        }
    },
    setSelectedUser: (selectedUser) => set({selectedUser}),
   
}))