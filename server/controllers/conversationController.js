import {prisma} from "../prisma/index.js";


export const loadConversations = async (req, res) => {
    try {
        const userIdFromToken = req.user.id;

        const conversationParticipants = await prisma.conversationParticipant.findMany({
            where: {
                userId: userIdFromToken,
            },
            include: {
                conversation: {
                    include: {
                        participants: {
                            include: {
                                user: true, // Get all user data
                            },
                        },
                        messages: {
                            orderBy: {
                                created_at: 'desc',
                            },
                            include: {
                                sender: true
                            },
                            take: 1,
                        },
                    },
                },
            },
        });

        const conversations = conversationParticipants.map((cp) => {
            const { conversation } = cp;
            const otherParticipants = conversation.participants.filter(
                (p) => p.userId !== userIdFromToken
            );

            return {
                ...conversation,
                participants: otherParticipants,
                latestMessage: conversation.messages[0]
            };
        });

        if (conversations.length === 0) {
            return res.status(404).json({
                status: 404,
                message: 'No conversations found.',
            });
        }

        res.status(200).json(conversations);

    } catch (err) {
        console.error(err);
        res.status(500).json({
            error: 'Internal server error',
            details: err.message,
        });
    }
};


