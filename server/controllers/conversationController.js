import {prisma} from "../prisma/index.js";

/**
 * What does this function do?
 * (Describe its main purpose in 1-2 sentences.)
 *
 * What inputs does it expect?
 * (Mention what parameters or data it uses, e.g., req.user.id.)
 *
 * What does it return or send back?
 * (Explain the response, like data sent or status codes.)
 *
 */


/**
 * 1. This component fetches all the conversation a user has
 *
 * 2. It expects the users token to be passed in through the front-end
 *
 * 3. It returns an array containing all the conversations a users has. If successful then 200
 * @param req
 * @param res
 * @returns {Promise<void>}
 */



export const loadConversations = async (req, res) => {
    try {

        const userIdFromToken = req.user.id; // Get user token

        // Get all private conversations
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

        // Get all group conversations
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

        // Merge the conversatiosn
        const allConversations = [...privateConversations, ...groupConversations];

        // Sort them by the one with the latest message
        allConversations.sort((a, b) => {
            const aTime = a.messages[0]?.created_at || new Date(0);
            const bTime = b.messages[0]?.created_at || new Date(0);
            return bTime - aTime;
        });

        // Send it
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


/**
 * What does this function do?
 * This function creates a new conversation with several users, aka. a group chat
 *
 * What inputs does it expect?
 * It expects the users token and the array of users in the new conversation sent through the body
 *
 * What does it return or send back?
 * It returns nothing but a 200 status code if successful and message that is displayed in the front-end
 */


export const createGroupConversation = async (req, res) => {

    try {

        const participants = req.body.participants; // All the participants of the new conversation
        let groupName = req.body.groupName // Name of the group if provided
        const userId = req.user.id; // Id from token

        if (!participants) // No participants? Return
            return res.status(400).json({
                error: "Participants does not exist"
            })

        // Scrape id´s of members
        const groupMembersIds = [
            userId,
            ...participants.map(participant => participant.id)
        ];

        // If there is not a group name provided, set the username of each participant as default
        if (!groupName) {
            groupName = participants.map(p => p.username).join(', ') + ', ' + req.user.user_metadata.username;
        }

        // Create the new conversation
        const newGroupConversation = await prisma.conversation.create({
            data: {
                admin_id: userId,
                name: groupName,
                is_group: true
            }
        })

        // Add all the participants to the new conversation
        await prisma.conversationMember.createMany({
            data: groupMembersIds.map(memberId => ({
                conversation_id: newGroupConversation.id,
                user_id: memberId
            }))
        });

        // Successful
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

/**
 * What does this function do?
 * This functions create a new conversation between two users, 1-on-1
 *
 * What inputs does it expect?
 * Besides the users token it expects an array containing the user object of the other user
 *
 * What does it return or send back?
 * It returns nothing but a message if successful
 *
 */


export const createPrivateConversation = async (req, res) => {
    try {

        const userIdFromToken = req.user.id; // Get id from token
        const participants = req.body.participants; // Get the other user

        // If participants are missing or the length is not 1, return
        if (!participants || participants.length !== 1) {
            return res.status(400).json({ error: "Invalid number of participants" });
        }

        const participantId = participants[0].id; // Get the id of the other user

        // Create the conversation
        const conversation = await prisma.conversation.create({
            data: {
                is_group: false,
            },
        });

        // Add all the members to the conversation
        await prisma.conversationMember.createMany({
            data: [
                { conversation_id: conversation.id, user_id: userIdFromToken },
                { conversation_id: conversation.id, user_id: participantId },
            ],
            skipDuplicates: true,
        });

        // Success
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


/**
 * What does this function do?
 * This functions fetches all the messages in a conversation once a users wants to chat
 *
 * What inputs does it expect?
 * The users token and the id of the conversation passed through the parameter
 *
 * What does it return or send back?
 * It returns the conversation including messages, members and a message
 */

export const fetchConversationMessages = async (req, res) => {

    try {

        const conversationId = req.params.conversation_id; // The id of the conversation
        const userId = req.user.id; // User id from token

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

        if (!conversationExists) // If the conversation does not exist, return
            return res.status(404).json({
                error: "Conversation does not exist",
                message: 'The conversation does not exist'
            })

        // Check that the user is actually in the conversation
        const userIsInConvo = await prisma.conversationMember.findUnique({
            where: {
                conversation_id_user_id: {
                    conversation_id: conversationId,
                    user_id: userId
                }
            }
        });

        if (!userIsInConvo) // User is not in the conversation, return
            return res.status(403).json({
                error: "Conversation does not exist",
                message: 'Unauthorized action'
            })

        let conversation;

        // Is the conversation a group?
        if (conversationExists.is_group) {
            // Yes, include all members data
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
            // No, only include the data of the other member
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
                    },
                    messages: {
                        include: {
                            sender: true
                        }
                    }
                }
            })
        }

        // Get all the messages for that conversation
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


/**
 * What does this function do?
 * This function kicks users from a conversation
 *
 * What inputs does it expect?
 * The token of the user and the id of the kicked user through req.body
 *
 * What does it return or send back?
 * Nothing besides a message and 200 status code
 */

export const kickUserFromConversation = async (req, res) => {

    try {

        const conversationId = req.params.conversation_id; // Id of the conversation
        const deletedUserId = req.body.deletedUser.id; // The id of the user that will be deleted
        const deletedUsername = req.body.deletedUser.username; // The username of that deleted user
        const userId = req.user.id; // Token of the user

        // Check if the conversation exists
        const conversationExists = await prisma.conversation.findUnique({
            where: {
                id: conversationId,
                admin_id: userId
            }
        })

        // If the conversation does not exist, return
        if (!conversationExists) {
            return res.status(404).json({
                message: "The conversation does not exist"
            });
        }

        // If the user is not admin of the conversation, then return
        if (conversationExists.admin_id !== userId) {
            return res.status(403).json({
                message: "Unauthorized action, only admin can kick users"
            });
        }

        // Delete the kicked member from conversation
        await prisma.conversationMember.delete({
            where: {
                conversation_id_user_id: {
                    conversation_id: conversationId,
                    user_id: deletedUserId
                }
            }
        })

        // Update the name of the group and remove the old username
        let updatedGroupName = conversationExists.name
            .split(', ')
            .filter(name => name !== deletedUsername)
            .join(', ');

        // Update conversation name
        await prisma.conversation.update({
            where: {
                id: conversationId,
            },
            data: {
                name: updatedGroupName,
            }
        });

        // Success
        res.status(200).json({
            message: `Successfully kicked ${deletedUsername} out of the conversation`,
        })

    } catch (err) {
        console.error(err);
        res.status(500).json({
            message: 'Error while kicking user from conversation',
            err: err
        })
    }
}


/**
 * What does this function do?
 * This function is used for deleting conversation
 *
 * What inputs does it expect?
 * The token of the user and the id of the conversation through the parameters
 *
 * What does it return or send back?
 * Just a 200:code and a success message
 */

export const deleteConversation = async (req, res) => {

    try {

        const conversationId = req.params.conversation_id; // Id of conversation that will be deleted
        const userIdFromToken = req.user.id; // Id from token

        // Check if conversation exists
        const conversationExists = await prisma.conversation.findUnique({
            where: {
                id: conversationId,
                admin_id: userIdFromToken
            }
        })

        // If the conversation does not exist, return
        if (!conversationExists)
            return res.status(404).json({
                message: "The conversation does not exist",
            })

        // If the user is not the admin of the conversation, return
        if (conversationExists.admin_id !== userIdFromToken)
            return res.status(403).json({
                message: "Unauthorized action, only admin delete conversations",
            })

        // Delete the conversation
        await prisma.conversation.delete({
            where: {
                id: conversationId,
                admin_id: userIdFromToken
            }
        })

        // Return a message
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

/**
 * What does this function do?
 * This function is used for adding members to a current conversation
 *
 * What inputs does it expect?
 * The token of the user and an object of the other user passed in the body
 *
 * What does it return or send back?
 * Success message and the data of the added user
 */

export const addMemberToConversation = async (req, res) => {

    try {

        const conversationId = req.params.conversation_id; // Id of the conversation
        const userIdFromToken = req.user.id; // Id from token
        const addedUserId = req.body.user.id; // Id of the user that will be added
        const addedUsername = req.body.user.username; // Username of the user that will be added

        // Check if conversation exists
        const conversationExists = await prisma.conversation.findUnique({
            where: {
                id: conversationId,
                admin_id: userIdFromToken
            }
        })

        // If the conversation does not exist, return
        if (!conversationExists) {
            return res.status(404).json({
                message: "The conversation does not exist",
            })
        }

        // If the user is not admin of the conversation, return
        if (conversationExists.admin_id !== userIdFromToken) {
            return res.status(403).json({
                message: "Unauthorized action, only admin can add users"
            })
        }

        // Check if user is already in the conversation
        const userIsAlreadyInConversation = await prisma.conversationMember.findUnique({
            where: {
                conversation_id_user_id: {
                    conversation_id: conversationId,
                    user_id: addedUserId,
                }
            }
        });

        // Yes, just return with a message
        if (userIsAlreadyInConversation) {
            res.status(200).send({
                message: "User is already in group",
            })
        }

        // No, insert the user into the conversation
        const addedUserData = await prisma.conversationMember.create({
            data: {
                conversation_id: conversationId,
                user_id: addedUserId
            }, include: {
                user: true
            }
        });


        let updatedGroupName = conversationExists.name || ""; // Update the name if there is none

        // Add the existing names into an array
        const existingNames = updatedGroupName.split(',').map(n => n.trim());

        if (!existingNames.includes(addedUsername)) {
            existingNames.push(addedUsername);
        }

        // Update the name of the conversation
        await prisma.conversation.update({
            where: {
                id: conversationId,
            },
            data: {
                name: existingNames.join(', '),
            }
        });

        res.status(200).send({
            message: `Successfully added ${addedUsername} to the conversation`,
            addedUser: addedUserData
        })

    } catch (err) {
        console.error(err);
        res.status(500).json({
            err: err,
            message: 'Internal server error while adding member to conversation',
        })
    }
}



export const loadNewConversationCard  = async (req, res) => {

    try {

        const conversationId = req.body.conversation.conversation_id;
        const userIdFromToken = req.user.id;

        const conversationExists = await prisma.conversation.findUnique({
            where: {
                id: conversationId,
            }
        })

        if (!conversationExists)
            return res.status(404).json({
                message: "The conversation does not exist",
            })


        const isMember = await prisma.conversationMember.findUnique({
            where: {
                conversation_id_user_id: {
                    conversation_id: conversationId,
                    user_id: userIdFromToken,
                }
            }
        })

        if (!isMember)
            return res.status(403).json({
                message: "Unauthorized action, not member of conversation",
            })

        let newConvoInfo;

        if (conversationExists.is_group) {
            newConvoInfo = await prisma.conversation.findUnique({
                where: {
                    id: conversationId,
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
        } else {
            newConvoInfo = await prisma.conversation.findUnique({
                where: {
                    id: conversationId,
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
        }

        res.status(200).send({
            message: "Successfully added group",
            newConvo: newConvoInfo
        })

    } catch (err) {
        console.error(err);
        res.status(500).json({
            message: 'Internal server error while adding new conversation',
            err: err
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

export const latestMessage = async (req, res) => {

    try {

        const userId = req.user.id;
        const conversationId = req.params.conversation_id;

        const conversationExists = await prisma.conversation.findUnique({
            where: {
                id: conversationId,
            },
            include: {
                members: true,
                messages: {
                    orderBy: {
                        created_at: 'desc'
                    },
                    include: {
                        sender: true
                    },
                    take: 1
                }
            }
        })

        if (!conversationExists)
            return res.status(404).send({
                message: 'Conversation does not exist'
            })

        const memberIds = conversationExists.members.map(m => m.user_id);

        if  (memberIds.some(m => m.user_id === userId))
            res.status(403).send({
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
                }
            })
        }

        return res.status(200).send({
            message: "Successfully the latest message",
            conversation: conversation
        })

    } catch (err) {
        console.error(err);
        res.status(500).json({
            message: 'Internal server error while retrieving the latest message',
            error: err
        })
    }

}