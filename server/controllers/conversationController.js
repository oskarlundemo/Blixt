import {prisma} from "../prisma/index.js";


export const loadConversations = async (req, res) => {
    try {
        const userIdFromToken = req.user.id;

        const conversations = await prisma.privateConversation.findMany({
            where: {
                OR: [
                    { user1_id: userIdFromToken },
                    { user2_id: userIdFromToken },
                ],
            },
            include: {
                user1: true,
                user2: true,
            },
        });

        const enrichedConversations = await Promise.all(
            conversations.map(async (conversation) => {
                const latestMessage = await prisma.privateMessages.findFirst({
                    where: {
                        conversation_id: conversation.id,
                    },
                    orderBy: {
                        created_at: 'desc',
                    },
                    include: {
                        sender: true,
                    },
                });

                const otherUser =
                    conversation.user1_id === userIdFromToken
                        ? conversation.user2
                        : conversation.user1;

                return {
                    id: conversation.id,
                    latestMessage,
                    otherUser,
                };
            })
        );

        res.status(200).json(enrichedConversations);
    } catch (err) {
        console.error(err);
        res.status(500).json({
            error: "Internal server error",
            details: err.message,
        });
    }
};

