import {prisma} from "../prisma/index.js";
import conversation from "express/lib/view.js";

export const loadConversations = async (req, res) => {
    try {




        const userIdFromToken = req.user.id;


        const privateConversations = await prisma.conversation.findMany({
            where: {
                members: {
                    some: {
                        user_id: userIdFromToken
                    }
                },
                is_group: false
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
                    include: {
                        sender: true
                    },
                    take: 1
                }
            },
        })

        const groupConversations = await prisma.conversation.findMany({
            where: {
                members: {
                    some: {
                        user_id: userIdFromToken
                    }
                },
                is_group: true
            },
            include: {
                members: {
                    include: {
                        user: true
                    }
                },
                messages: {
                    orderBy: {
                        created_at: 'desc'
                    },
                    include: {
                        sender: true
                    },
                    take: 1
                }
            },
        })


        const allConversations = [...privateConversations, ...groupConversations];

        allConversations.sort((a, b) => {
            const aTime = a.messages[0]?.created_at || new Date(0);
            const bTime = b.messages[0]?.created_at || new Date(0);
            return bTime - aTime;
        });

        res.status(200).json({
            conversations: allConversations,
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

        let conversation;

        if (conversationExists.is_group) {
            conversation = await prisma.conversation.findUnique({
                where: {
                    id: conversationId,
                },
                include: {
                    members: {
                        include: {
                            user: true
                        }
                    }
                }
            })
        } else {
            conversation = await prisma.conversation.findUnique({
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
        }

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
            conversation: conversation,
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


export const kickUserFromConversation = async (req, res) => {

    try {

        const conversationId = req.params.conversation_id;
        const deletedUserId = req.body.deletedUser.id;
        const deletedUsername = req.body.deletedUser.username;
        const userId = req.user.id;

        const conversationExists = await prisma.conversation.findUnique({
            where: {
                id: conversationId,
                admin_id: userId
            }
        })

        if (!conversationExists || conversationExists.admin_id !== userId) {
            return res.status(403).json({
                message: "Unauthorized action, only admin can kick users"
            });
        }

        await prisma.conversationMember.delete({
            where: {
                conversation_id_user_id: {
                    conversation_id: conversationId,
                    user_id: deletedUserId
                }
            }
        })


        let updatedGroupName = conversationExists.name
            .split(', ')
            .filter(name => name !== deletedUsername)
            .join(', ');

        await prisma.conversation.update({
            where: {
                id: conversationId,
            },
            data: {
                name: updatedGroupName,
            }
        });


    } catch (err) {
        console.error(err);
        res.status(500).json({
            message: 'Error while kicking user from conversation',
            err: err
        })
    }
}

export const deleteConversation = async (req, res) => {


    try {

        const conversationId = req.params.conversation_id;
        const userIdFromToken = req.user.id;

        const conversationExists = await prisma.conversation.findUnique({
            where: {
                id: conversationId,
                admin_id: userIdFromToken
            }
        })

        if (!conversationExists || conversationExists.admin_id !== userIdFromToken)
            return res.status(403).json({
                message: "Unauthorized action, only admin delete conversations",
            })


        await prisma.conversation.delete({
            where: {
                id: conversationId,
                admin_id: userIdFromToken
            }
        })

        res.status(200).send({
            message: "Successfully deleted group",
        })

    } catch (err) {
        console.error(err);
        res.status(500).json({
            message: 'Internal server error while deleting conversation',
            err: err
        })
    }
}


export const addMemberToConversation = async (req, res) => {

    try {

        const conversationId = req.params.conversation_id;
        const userIdFromToken = req.user.id;
        const addedUserId = req.body.user.id;
        const addedUsername = req.body.user.username;

        const conversationExists = await prisma.conversation.findUnique({
            where: {
                id: conversationId,
                admin_id: userIdFromToken
            }
        })

        if (!conversationExists || conversationExists.admin_id !== userIdFromToken) {
            return res.status(403).json({
                message: "Unauthorized action, only admin can add users"
            })
        }

        const userIsAlreadyInConversation = await prisma.conversationMember.findUnique({
            where: {
                conversation_id_user_id: {
                    conversation_id: conversationId,
                    user_id: addedUserId,
                }
            }
        });

        if (userIsAlreadyInConversation) {
            res.status(200).send({
                message: "User is already in group",
            })
        }

        await prisma.conversationMember.create({
            data: {
                conversation_id: conversationId,
                user_id: addedUserId
            }
        });

        let updatedGroupName = conversationExists.name || "";


        const existingNames = updatedGroupName.split(',').map(n => n.trim());

        if (!existingNames.includes(addedUsername)) {
            existingNames.push(addedUsername);
        }

        await prisma.conversation.update({
            where: {
                id: conversationId,
            },
            data: {
                name: existingNames.join(', '),
            }
        });

        res.status(200).send({
            message: "Successfully added member to conversation",
        })

    } catch (err) {
        console.error(err);
        res.status(500).json({
            err: err,
            message: 'Internal server error while adding member to conversation',
        })
    }
}






export const searchForNewGroupMembers = async (req, res) => {

    try {

        const conversationId = req.params.conversation_id;
        const searchQuery = req.query.q
        const userIdFromToken = req.user.id;

        const userIsAdmin = await prisma.conversation.findUnique({
            where: {
                id: conversationId,
                admin_id: userIdFromToken
            }
        })

        if (!userIsAdmin) {
            res.status(403).send({
                message: 'Unauthorized action'
            })
        }

        const conversation = await prisma.conversation.findUnique({
            where: {
                id: conversationId,
                admin_id: userIdFromToken
            },
            include: {
                members: true
            }
        })

        if (!conversation) {
            res.status(404).send({
                message: 'The conversation does not exist'
            })
        }


        const memberIds = conversation.members.map(m => m.user_id);

        const results = await prisma.user.findMany({
            where: {
                username: {
                    contains: searchQuery,
                    mode: 'insensitive'
                },
                id: {
                    notIn: [...memberIds, userIdFromToken]
                }
            }
        });

        res.status(200).send({
            message: "Successfully retrieved users",
            results
        })

    } catch (err) {
        console.log(err);
        res.status(500).json({err: err, message: "Server error"});
    }
}