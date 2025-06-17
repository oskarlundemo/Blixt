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

        const usersGroups = await prisma.groupMember.findMany({
            where: {
                member_id: userIdFromToken,
            }
        })

        const groupIds = usersGroups.map(gm => gm.group_id);

        const groupChats = await prisma.groupChats.findMany({
            where: {
                id: {
                    in: groupIds
                }
            },
            include: {
                GroupMessages: {
                    include: {
                        sender: true,
                    },
                    orderBy: {
                        created_at: 'desc',
                    },
                    take: 1
                },
                GroupMembers: {
                    include: {
                        Member: true,
                    }
                }
            },
        });

        const formattedGroupChats = groupChats.map(gm => {
            const latestMessage = gm.GroupMessages[0] || null;
            return {
                group: {
                    id: gm.id,
                    name: gm.name,
                    avatar: gm.avatar,
                },
                latestMessage: latestMessage
                    ? {
                        id: latestMessage.id,
                        content: latestMessage.content,
                        created_at: latestMessage.created_at,
                        sender: {
                            id: latestMessage.sender.id,
                            username: latestMessage.sender.username,
                            avatar: latestMessage.sender.avatar,
                        }
                    }
                    : null,
                members: gm.GroupMembers.map(gmMember => ({
                    id: gmMember.Member.id,
                    username: gmMember.Member.username,
                    avatar: gmMember.Member.avatar,
                })),
            };
        });


        const allConversations = [...enrichedConversations, ...formattedGroupChats];

        res.status(200).json(allConversations);
    } catch (err) {
        console.error(err);
        res.status(500).json({
            error: "Internal server error",
            details: err.message,
        });
    }
};

