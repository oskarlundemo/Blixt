import {prisma} from "../prisma/index.js";

export const loadConversations = async (req, res) => {
    try {

        const userIdFromToken = req.user.id;
        const conversations = await prisma.conversation.findMany({
            where: {
                members: {
                    some: {
                        user_id: userIdFromToken
                    }
                }
            },
            include: {
                members: {
                    where: {
                        user_id: {
                            not: userIdFromToken
                        }
                    }, include: {
                        user: true
                    }
                },
                messages: {
                    orderBy: {
                        created_at: 'desc'
                    },
                    take: 1
                }
            }
        })

        res.status(200).json({
            conversations
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({
            error: "Internal server error",
            details: err.message,
        });
    }
};


export const createGroupConversation = async (req, res) => {

    try {

        const participants = req.body.participants;
        let groupName = req.body.groupName
        const userId = req.user.id;

        if (!participants)
            return res.status(400).json({
                error: "Participants does not exist"
            })

        const groupMembersIds = [
            userId,
            ...participants.map(participant => participant.id)
        ];

        if (!groupName) {
            groupName = participants.map(p => p.username).join(', ') + ', ' + req.user.user_metadata.username;
        }

        const newGroupConversation = await prisma.conversation.create({
            data: {
                admin_id: userId,
                name: groupName,
                is_group: true
            }
        })

        await prisma.conversationMember.createMany({
            data: groupMembersIds.map(memberId => ({
                conversation_id: newGroupConversation.id,
                user_id: memberId
            }))
        });

        res.status(200).json({
            message: 'Group conversation created successfully.'
        })

    } catch (err) {
        console.error(err);
        res.status(500).json({
            error: "Internal server error",
            message: "Error creating group conversation"
        })
    }
}



export const createPrivateConversation = async (req, res) => {
    try {

        const userIdFromToken = req.user.id;
        const participants = req.body.participants;

        if (!participants || participants.length !== 1) {
            return res.status(400).json({ error: "Invalid number of participants" });
        }

        const participantId = participants[0].id;

        const conversation = await prisma.conversation.create({
            data: {
                is_group: false,
            },
        });

        await prisma.conversationMember.createMany({
            data: [
                { conversation_id: conversation.id, user_id: userIdFromToken },
                { conversation_id: conversation.id, user_id: participantId },
            ],
            skipDuplicates: true,
        });

        res.status(200).json({
            message: "Private conversation successfully created",
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({
            error: "Internal server error",
            message: "Error creating private conversation",
        });
    }
};



export const fetchConversationMessages = async (req, res) => {

    try {

        const conversationId = req.params.conversation_id;
        const userId = req.user.id;

        const conversationExists = await prisma.conversation.findUnique({
            where: {
                id: conversationId,
            },
            include: {
                members: {
                    where: {
                        user_id: {
                            not: userId
                        }
                    }, include: {
                        user: true
                    }
                }
            }
        })

        if (!conversationExists)
            return res.status(404).json({
                error: "Conversation does not exist",
                message: 'The conversation does not exist'
            })

        const userIsInConvo = await prisma.conversationMember.findUnique({
            where: {
                conversation_id_user_id: {
                    conversation_id: conversationId,
                    user_id: userId
                }
            }
        });

        if (!userIsInConvo)
            return res.status(403).json({
                error: "Conversation does not exist",
                message: 'Unauthorized action'
            })

        const messages = await prisma.conversation.findUnique({
            where: {
                id: conversationId,
            },
            include: {
                messages: {
                    include: {
                        sender: true
                    }
                }
            }
        });

        res.status(200).json({
            conversation: conversationExists,
            members: conversationExists.members,
            messages: messages.messages,
            message: 'Messages retrieved successfully'
        })

    } catch (err) {
        console.error(err);
        res.status(500).json({
            err: "Internal server error while loading conversation",
            status: 500
        })
    }
}
