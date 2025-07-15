import {prisma} from "../prisma/index.js";


/**
 * What does this function do?
 * Inserts a new message in a conversation into the db
 *
 * What inputs does it expect?
 * Token and the message sent through the body
 *
 * What does it return or send back?
 * If successful then a message
 */

export const createMessage = async (req, res) => {

    try {

        const userId = req.user.id; // Id from token
        const conversationId = req.params.conversation_id; // Id for conversation
        const message = req.body.message; // Message in the body


        // Check if the user is in the conversation
        const userIsInConvo = await prisma.conversationMember.findUnique({
            where: {
                conversation_id_user_id: {
                    user_id: userId,
                    conversation_id: conversationId
                },
            }
        })

        if (!userIsInConvo) { // Not in the conversation, return
            return res.status(403).json({ message: "Unauthorized action, user is not allowed in conversation" });
        }

        // Insert the new message
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

/**
 * What does this function do?
 * Fetches complimentary data when the supabase realtime client triggers an insert
 *
 * What inputs does it expect?
 * Token and the conversation id from the parameters
 *
 * What does it return or send back?
 * The data of the message
 */

export const fetchEnrichedMessage = async (req, res) => {

    try {

        const messageId = parseInt(req.body.message.id); // Get the id of the new conversation
        const conversationId = req.params.conversation_id; // Get the id of the conversation where it was sent

        // Query the data
        const newMessage = await prisma.message.findUnique({
            where: { id: messageId, conversation_id: conversationId },
            include: {
                sender: true,
                attachments: true,
            }
        })

        if (!newMessage) { // If it does not exit, return
            return res.status(404).json({ message: "Message not found" });
        }

        return res.status(200).json(newMessage);

    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Failed to fetch enriched messages" });
    }
}

/**
 * What does this function do?
 * Insert a gif when a user sends one in the conversation
 *
 * What inputs does it expect?
 * Token and the gif object through the body
 *
 * What does it return or send back?
 * Success message
 */

export const sendGif = async (req, res) => {

    try {

        const userIdFromToken = req.user.id; // Id from token
        const conversationId = req.params.conversation_id; // Id of conversation
        const gif = req.body.gif; // Gif sent in the body

        // Create the message
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