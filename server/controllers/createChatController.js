import {prisma} from "../prisma/index.js";


/**
 * Flytta denna
 * @param req
 * @param res
 * @returns {Promise<*>}
 */

export const searchForUsers = async (req, res) => {
    try {
        const userId = req.user.id;
        const searchQuery = req.query.q;

        const searchResults = await prisma.user.findMany({
            where: {
                username: {
                    contains: searchQuery,
                    mode: 'insensitive'
                },
                id: {
                    not: userId,
                }
            },
            take: 10,
        })

        if (!searchResults) {
            return res.status(404).send({
                error: 'No users found',
            })
        }

        return res.status(200).json({
            searchResults
        })

    } catch (err) {
        console.log(err)
        return res.status(500).send({
            error: 'Server error occured while filtering users',
        })
    }
}


/**
 * Kan raderas
 * @param req
 * @param res
 * @returns {Promise<*>}
 */

export const createGroupChat = async (req, res) => {

    try {

        const participants = req.body.participants;
        let groupName = req.body.groupName
        const userId = req.user.id;

        const groupMembersIds = [
            userId,
            ...participants.map(participant => participant.id)
        ];

        if (!groupName) {
            groupName = participants.map(p => p.username).join(', ') + ', ' + req.user.username;
        }

        const newGroup = await prisma.groupChats.create({
            data: {
                admin_id: userId,
                name: groupName,
            }
        })

        await prisma.groupMember.createMany({
            data: groupMembersIds.map(memberId => ({
                group_id: newGroup.id,
                member_id: memberId
            }))
        })

        res.status(200).json({
            groupId: newGroup.id,
            message: 'Group created successfully.'
        })

    } catch (err) {
        console.log(err)
        return res.status(500).send({
            error: 'Server error occured while creating group',
        })
    }
}

