import {prisma} from "../prisma/index.js";
import {parse} from "dotenv";


export const fetchPrivateMessages = async (req, res) => {

    const userId = req.user.id;
    const username = decodeURIComponent(req.params.username);

    try {
        const otherUser = await prisma.user.findUnique({
            where: { username },
        });

        if (!otherUser) {
            return res.status(404).json({ message: "User not found" });
        }

        const messages = await prisma.privateMessages.findMany({
            where: {
                OR: [
                    {sender_id: userId, receiver_id: otherUser.id,},
                    {sender_id: otherUser.id, receiver_id: userId,}
                ]
            },
            orderBy: {
                created_at: 'asc',
            },
            include: {
                attachments: true,
                sender: true,
                receiver: true,
            }
        })

        return res.status(200).json({messages, otherUser});

    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: "Failed to fetch messages" });
    }
};


export const fetchMessagesByConversation = async (req, res) => {

    const group_id = parseInt(req.params.group_id);
    const userIdFromToken = req.user.id;

    try {

        const groupExists = await prisma.groupChats.findUnique({
            where: {
                id: group_id,
            },
            include: {
                GroupMembers: {
                    include: {
                        Member: true
                    }
                }
            }
        })

        if (!groupExists) {
            return res.status(404).json({ message: "Group not found" });
        }

        const isGroupMember = await prisma.groupMember.findMany({
            where: {
                group_id: group_id,
                member_id: userIdFromToken,
            }
        })

        if (!isGroupMember) {
            return res.status(403).json({ message: 'User is not allowed' });
        }

        const groupMessages = await prisma.groupMessage.findMany({
            where: {
                group_id: group_id,
            },
            orderBy: {
                created_at: 'asc',
            },
            include: {
                attachments: true,
                sender: true,
            }
        })

        return res.json({messages: groupMessages, group: groupExists});
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: "Failed to fetch conversation messages" });
    }
};


export const createPrivateMessage = async (req, res) => {
    try {
        const username = decodeURIComponent(req.params.username);
        const senderId = req.user.id;
        const {message} = req.body;

        const otherUser = await prisma.user.findUnique({
            where: { username },
        });

        if (!otherUser) {
            return res.status(404).json({ message: "User not found" });
        }

        const [user1_id, user2_id] = [senderId, otherUser.id].sort();

        let conversation = await prisma.privateConversation.findFirst({
            where: {
                user1_id,
                user2_id
            }
        });

        if (!conversation) {
            conversation = await prisma.privateConversation.create({
                data: {
                    user1_id,
                    user2_id
                }
            });
        }


        await prisma.privateMessages.create({
            data: {
                sender_id: senderId,
                receiver_id: otherUser.id,
                content: message,
                conversation_id: conversation.id
            },
        })

        return res.status(200).json({ message: 'Message successfully created' });

    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: "Failed to send private message" });
    }
};


export const fetchEnrichedPrivateMessage = async (req, res) => {


    try {

        const userIdFromToken = req.user.id;
        const messageId = parseInt(req.body.message.id)

        const newMessage = await prisma.privateMessages.findUnique({
            where: { id: messageId },
            include: {
                sender: true,
                attachments: true,
            }
        })

        if (!newMessage) {
            return res.status(404).json({ message: "Message not found" });
        }

        if (newMessage.sender_id !== userIdFromToken && newMessage.receiver_id !== userIdFromToken) {
            return res.status(403).json({ message: "Unauthorized action" });
        }

        return res.status(200).json(newMessage);

    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Failed to fetch enriched messages" });
    }
}


export const fetchEnrichedGroupMessage = async (req, res) => {

    try {

        const messageId = parseInt(req.body.message.id)

        const newMessage = await prisma.groupMessage.findUnique({
            where: {id: messageId},
            include: {
                sender: true,
                attachments: true,
            }
        })

        if (!newMessage) {
            return res.status(404).json({ message: "Message not found" });
        }

        return res.status(200).json(newMessage);

    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: "Failed to fetch enriched group messages" });
    }
}




export const createGroupMessage = async (req, res) => {

    try {

        const userId = req.user.id;
        const groupId = parseInt(req.params.group_id);
        const message = req.body.message

        const group = await prisma.groupChats.findUnique({
            where: {
                id: groupId,
            }
        })

        if (!group) {
            return res.status(404).json({ message: "Group not found" });
        }

        const isGroupMember = await prisma.groupMember.findMany({
            where: {
                group_id: groupId,
                member_id: userId
            }
        })

        if (!isGroupMember) {
            return res.status(403).json({ message: "Unathorized action" });
        }

        await prisma.groupMessage.create({
            data: {
                group_id: groupId,
                sender_id: userId,
                content: message,
            }
        })

        return res.status(200).json({ message: 'Message successfully created' });

    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Failed to create group message" });
    }
}


export const sendGifPrivateChat = async (req, res) => {
    try {

        const userIdFromToken = req.user.id;
        const username = decodeURIComponent(req.params.username);
        const gif = req.body.gif;

        const recipient = await prisma.user.findUnique({
            where: {
                username: username,
            }
        })

        if (!recipient) {
            return res.status(404).json({ message: "Receipiant not found" });
        }

        await prisma.privateMessages.create({
            data: {
                receiver_id: recipient.id,
                sender_id: userIdFromToken,
                content: gif.url,
            }
        })

        return res.status(200).json({ message: 'Gif successfully sent' });

    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: "Failed to send gif private chat" });
    }
}


export const sendGifGroupChat = async (req, res) => {

    try {

        const userIdFromToken = req.user.id;
        const groupId = parseInt(req.params.group_id);
        const gif = req.body.gif;

        const isMember = await prisma.groupMember.findUnique({
            where: {
                group_id_member_id: {
                    group_id: groupId,
                    member_id: userIdFromToken,
                }
            }
        });

        if (!isMember) {
            return res.status(403).json({ message: "Unathorized action" });
        }

        await prisma.groupMessage.create({
            data: {
                group_id: groupId,
                sender_id: userIdFromToken,
                content: gif.url,
            }
        })

        return res.status(200).json({ message: 'Gif successfully sent' });

    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: "Failed to send gif in group chat" });
    }
}