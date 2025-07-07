import {prisma} from "../prisma/index.js";



export const createMessage = async (req, res) => {

    try {

        const userId = req.user.id;
        const conversationId = req.params.conversation_id;
        const message = req.body.message;

        const userIsInConvo = await prisma.conversationMember.findUnique({
            where: {
                conversation_id_user_id: {
                    user_id: userId,
                    conversation_id: conversationId
                },
            }
        })

        if (!userIsInConvo) {
            return res.status(403).json({ message: "Unauthorized action, user is not allowed in conversation" });
        }

        await prisma.message.create({
            data: {
                conversation_id: conversationId,
                content: message,
                sender_id: userId,
            }
        })

        res.status(200).json({messages: 'Message successfully created'});

    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: "Failed to create message" });
    }
}

export const fetchEnrichedMessage = async (req, res) => {

    try {

        const messageId = parseInt(req.body.message.id);
        const conversationId = req.params.conversation_id;

        const newMessage = await prisma.message.findUnique({
            where: { id: messageId, conversation_id: conversationId },
            include: {
                sender: true,
                attachments: true,
            }
        })

        if (!newMessage) {
            return res.status(404).json({ message: "Message not found" });
        }

        return res.status(200).json(newMessage);

    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Failed to fetch enriched messages" });
    }
}

export const sendGif = async (req, res) => {

    try {

        const userIdFromToken = req.user.id;
        const conversationId = req.params.conversation_id;
        console.log(conversationId);
        const gif = req.body.gif;

        await prisma.message.create({
            data: {
                conversation_id: conversationId,
                sender_id: userIdFromToken,
                content: gif.url,
            }
        })

        return res.status(200).json({ message: 'Gif successfully sent' });

    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: "Failed to send gif in group chat" });
    }
}