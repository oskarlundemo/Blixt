import {prisma} from "../prisma/index.js";


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

    const conversationId = Number(req.params.conversationId);

    try {
        const conversation = await prisma.conversation.findUnique({
            where: { id: conversationId },
            include: {
                messages: {
                    where: {type: 'GROUP'},
                    orderBy: { created_at: 'asc' },
                    include: { sender: true, attachments: true }
                }
            }
        });

        if (!conversation) {
            return res.status(404).json({ message: "Conversation not found" });
        }

        return res.json(conversation.messages);
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




export const createGroupMessage = async (req, res) => {

    try {



    } catch (err) {
        console.error(err);
    }
}