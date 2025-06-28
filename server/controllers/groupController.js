import {prisma} from "../prisma/index.js";


export const kickGroupMember = async (req, res) => {

    try {
        const userIdFromToken = req.user.id;
        const deletedUserId = req.body.deletedUser.id;
        const deletedUsername = req.body.deletedUser.username;
        const groupId = parseInt(req.params.group_id);

        if (!userIdFromToken) {
            res.status(401).send({
                message: "User not found"
            })
        }

        const isGroupAdmin = await prisma.groupChats.findUnique({
            where: {
                admin_id: userIdFromToken,
                id: groupId
            }
        })

        if (!isGroupAdmin) {
            res.status(403).send({
                message: "Unauthorized action"
            })
        }

        await prisma.groupMember.delete({
            where: {
                group_id_member_id: {
                    group_id: groupId,
                    member_id: deletedUserId
                }
            }
        });

        res.status(200).send({
            message: `Successfully kicked ${deletedUsername}!`
        })

    } catch (err) {
        console.log(err);
        res.status(500).json({err: err, message: "Server error while kicking user"});
    }
}



export const searchMembers = async (req, res) => {


    try {

        const groupId = parseInt(req.params.group_id);
        const searchQuery = req.query.q
        const userIdFromToken = req.user.id;

        const userIsAdmin = prisma.groupChats.findUnique({
            where: {
                group_id: groupId,
                admin_id: userIdFromToken
            }
        })

        if (!userIsAdmin) {
            res.status(403).send({
                message: 'Unathorized action'
            })
        }

        const group = await prisma.groupChats.findUnique({
            where: { id: groupId },
            include: {
                GroupMembers: {
                    select: {
                        member_id: true
                    }
                }
            }
        });

        const memberIds = group.GroupMembers.map(m => m.member_id);

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



export const deleteGroup = async (req, res) => {


    try {

        const userIdFromToken = req.user.id;
        const groupId = parseInt(req.params.group_id);

        const groupExists = await prisma.groupChats.findUnique({
            where: {
                id: groupId,
            }
        })

        if (!groupExists) {
            res.status(404).send({
                message: "Group not found"
            })
        }

        const isAdmin = await prisma.groupChats.findUnique({
            where: {
                id: groupId,
                admin_id: userIdFromToken
            }
        })

        if (!isAdmin) {
            res.status(403).send({
                message: "Unauthorized action"
            })
        }

        await prisma.groupChats.delete({
            where: {
                id: groupId,
                admin_id: userIdFromToken
            }
        })

        res.status(200).send({
            message: "Successfully deleted group",
        })

    } catch (err) {
        console.log(err);
        res.status(500).json({err: err, message: "Server error deleting group"});
    }
}


export const addMember = async (req, res) => {

    try {

        const groupId = parseInt(req.params.group_id);
        const userIdFromToken = req.user.id;
        const addedUserId = req.body.user.id
        const addedUsername = req.body.user.username;

        const userExists = await prisma.user.findUnique({
            where: {
                id: addedUserId,
            }
        })

        if (!userExists) {
            res.status(404).send({
                message: "User not found"
            })
        }

        const groupExists = await prisma.groupChats.findUnique({
            where: {
                id: groupId,
                admin_id: userIdFromToken
            }
        })

        if (!groupExists) {
            res.status(403).send({
                message: 'Unauthorized action'
            })
        }

        const newGroupMember = await prisma.groupMember.create({
            data: {
                group_id: groupId,
                member_id: addedUserId,
            }, include: {
                Member: true
            }
        })

        res.status(200).send({
            message: `Successfully added ${addedUsername}`,
            member: newGroupMember,
        })

    } catch (err) {
        console.log(err);
        res.status(500).json({err: err, message: "Server error while adding user"});
    }
}