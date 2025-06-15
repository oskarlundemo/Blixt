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

        const conversation = await prisma.conversation.findFirst({
            where: {
                isGroup: false,
                AND: [
                    {
                        participants: {
                            some: {
                                userId: userId
                            }
                        }
                    },
                    {
                        participants: {
                            some: {
                                userId: otherUser.id
                            }
                        }
                    }
                ]
            },
            include: {
                messages: {
                    where: { type: 'PRIVATE' },
                    orderBy: { created_at: 'asc' },
                    include: { sender: true, attachments: true }
                }
            }
        });

        return res.status(200).json({conversation, otherUser});

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
        const userId = req.user.id;
        const {message} = req.body;

        const otherUser = await prisma.user.findUnique({
            where: { username },
        });

        if (!otherUser) {
            return res.status(404).json({ message: "User not found" });
        }

        // Find existing private conversation
        let conversation = await prisma.conversation.findFirst({
            where: {
                isGroup: false,
                participants: {
                    some: { userId: userId },
                    // NOTE: 'AND' inside 'participants' doesn't work — combine with outer 'AND'
                },
                AND: {
                    participants: {
                        some: { userId: otherUser.id }
                    }
                }
            },
            include: {
                messages: {
                    where: { type: 'PRIVATE' },
                    orderBy: { created_at: 'asc' },
                    include: { sender: true, attachments: true }
                }
            }
        });


        if (!conversation) {
            conversation = await prisma.conversation.create({
                data: {
                    isGroup: false,
                    participants: {
                        createMany: {
                            data: [
                                { userId: userId },
                                { userId: otherUser.id }
                            ]
                        }
                    }
                }
            });
        }

        await prisma.message.create({
            data: {
                conversationId: conversation.id,
                sender_id: userId,
                type: 'PRIVATE',
                content: message
            }
        });

        return res.status(200).json({ message: 'Message successfully created' });

    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: "Failed to send private message" });
    }
};


export const fetchEnrichedMessage = async (req, res) => {


    try {

        console.log('BODY:', req.body);

        const messageId = req.body.messageData.id;
        const conversationId = req.body.messageData.conversationId;

        const conversation = await prisma.message.findFirst({
            where: {
                conversationId: conversationId,
                id: messageId
            }
        })

        if (!conversation) {
            return res.status(404).json({ message: "Conversation not found" });
        }


        const newMessage = await prisma.message.findUnique({
            where: {
                id: messageId
            },
            include: {
                sender: true,
                attachments: true,

            }
        })

        res.status(200).json(newMessage);


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