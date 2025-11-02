import User from "../models/user.model.js";
import Message from "../models/message.model.js";
import cloudinary from "../lib/cloudinary.js";
import { getRecieverSockcetId, io } from "../lib/socket.js";
export const getUsersForSidebar = async (req, res) => {
    try {
        const loggedInUserId = req.user._id;
        const users = await User.find({ _id: { $ne: loggedInUserId } })
            .select("fullName email profilePic createdAt")
            .lean();

        // For each user, compute unread count and latest message metadata
        const withMeta = await Promise.all(
            users.map(async (u) => {
                const [unreadCount, lastMsg] = await Promise.all([
                    Message.countDocuments({ senderId: u._id, recieverId: loggedInUserId, readAt: { $in: [null, undefined] } }),
                    Message.findOne({
                        $or: [
                            { senderId: loggedInUserId, recieverId: u._id },
                            { senderId: u._id, recieverId: loggedInUserId },
                        ],
                    })
                        .sort({ createdAt: -1 })
                        .select("text image createdAt readAt deliveredAt senderId recieverId")
                        .lean(),
                ]);

                let lastMessagePreview = null;
                if (lastMsg) lastMessagePreview = lastMsg.text ? lastMsg.text : lastMsg.image ? "Photo" : null;

                return {
                    ...u,
                    unreadCount,
                    lastMessageAt: lastMsg?.createdAt || null,
                    lastMessagePreview,
                };
            })
        );

        // Sort users by lastMessageAt desc (fallback: by name)
        withMeta.sort((a, b) => {
            if (a.lastMessageAt && b.lastMessageAt) return new Date(b.lastMessageAt) - new Date(a.lastMessageAt);
            if (a.lastMessageAt) return -1;
            if (b.lastMessageAt) return 1;
            return a.fullName.localeCompare(b.fullName);
        });

        res.status(200).json({ filteredUsers: withMeta });
    } catch (error) {
        console.error("Error in getUserForSidebar: ", error.message);
        res.status(500).json({ error: "Internal Server Error" });
    }
};
export const getMessages = async(req,res)=>{
    try {
        const {id:userToChatId} = req.params
        const myId = req.user._id
        const messages = await Message.find({
            $or:[
                {
                    senderId:myId, recieverId:userToChatId
                },
                {
                    senderId:userToChatId, recieverId:myId
                }
            ]
        })
        res.status(200).json({messages})
    } catch (error) {
        console.log("Error in getMessage: ",error.message);
        res.status(500).json({error:"Internal Server Error"})
    }
}
export const sendMessage = async(req,res)=>{
    try {
        const {text,image} = req.body
        const {id:recieverId} = req.params
        const senderId = req.user._id
        let imageUrl;
        if(image){
            const uploadResponse = await cloudinary.uploader.upload(image)
            imageUrl = uploadResponse.secure_url
        }
        const newMessage = new Message({
            senderId,
            recieverId,
            text,
            image:imageUrl
        })
        await newMessage.save()
        const recieverSocketId = getRecieverSockcetId(recieverId)
        if(recieverSocketId){
            io.to(recieverSocketId).emit('newMessage',newMessage)
            // Mark as delivered and notify sender if online
            newMessage.deliveredAt = new Date();
            await newMessage.save();
            const senderSocketId = getRecieverSockcetId(senderId);
            if (senderSocketId) {
                io.to(senderSocketId).emit('message:delivered', { ids: [newMessage._id] });
            }
        }
        res.status(201).json(newMessage)
    } catch (error) {
        console.log("Error in sendMessage: ",error.message)
        res.status(500).json({error: "Internal Server Error"})
    }
}