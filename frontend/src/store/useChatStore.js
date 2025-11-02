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
    // presence & typing
    isTyping: false,
    // receipts map: { [messageId]: 'sent' | 'delivered' | 'read' }
    messageStatusById: {},
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
            // messages fetched from server are delivered to this client
            const msgs = response.data.messages || [];
            const nextStatus = { ...get().messageStatusById };
            msgs.forEach(m => { if (m._id && !nextStatus[m._id]) nextStatus[m._id] = 'delivered'; });
            set({messages: msgs, messageStatusById: nextStatus})
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
            const newMsg = response.data;
            // mark as 'sent' locally
            const status = { ...get().messageStatusById };
            if (newMsg?._id) status[newMsg._id] = 'sent';
            set({messages: [...messages, newMsg], messageStatusById: status})
        } catch (error) {
            toast.error(error?.response?.data?.message || 'Something went wrong')
        }
    },
    // Socket subscriptions
    subscribeToMessages: () => {
        const {selectedUser} = get()
        const socket = useAuthStore.getState().socket;
        if(!selectedUser || !socket) return;

        socket.on("newMessage", (newMessage) => {
            // Accept only for current conversation
            if(newMessage.senderId !== selectedUser._id && newMessage.recieverId !== selectedUser._id) return;
            set({ messages: [...get().messages, newMessage] })
        });

        // Optional receipts support (no-op if server doesn't emit)
        socket.on("message:delivered", ({ ids = [] }) => {
            const status = { ...get().messageStatusById };
            ids.forEach(id => { status[id] = 'delivered'; });
            set({ messageStatusById: status });
        });
        socket.on("message:read", ({ ids = [] }) => {
            const status = { ...get().messageStatusById };
            ids.forEach(id => { status[id] = 'read'; });
            set({ messageStatusById: status });
        });

        // Typing indicator (no-op if server doesn't emit)
        socket.on("typing", ({ from, isTyping }) => {
            if (!selectedUser || from !== selectedUser._id) return;
            set({ isTyping: !!isTyping });
        });
    },
    unsubscribeFromMessages: () => {
        const socket = useAuthStore.getState().socket;
        if(!socket) return;
        socket.off("newMessage");
        socket.off("message:delivered");
        socket.off("message:read");
        socket.off("typing");
    },

    // Client emitters (server may or may not handle yet)
    sendTyping: (isTyping) => {
        const socket = useAuthStore.getState().socket;
        const { selectedUser } = get();
        if (!socket || !selectedUser) return;
        socket.emit("typing", { to: selectedUser._id, isTyping: !!isTyping });
        set({ isTyping: !!isTyping });
    },
    markConversationRead: () => {
        const socket = useAuthStore.getState().socket;
        const { messages, selectedUser } = get();
        if (!socket || !selectedUser) return;
        const unreadIds = messages.filter(m => m.senderId === selectedUser._id).map(m => m._id).filter(Boolean);
        if (unreadIds.length) {
            socket.emit("message:read", { ids: unreadIds, with: selectedUser._id });
        }
        const status = { ...get().messageStatusById };
        unreadIds.forEach(id => { status[id] = 'read'; });
        set({ messageStatusById: status });
    },
    setSelectedUser: (selectedUser) => set({selectedUser}),
}))