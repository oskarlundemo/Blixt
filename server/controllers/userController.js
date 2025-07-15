import {prisma} from "../prisma/index.js";


/**
 * What does this function do?
 * This component enriches the token that supabase creates, adding the whole user object to it
 *
 * What inputs does it expect?
 * Id is taken in through the parameters
 *
 * What does it return or send back?
 * It returns the user object with the complementary data
 */

export const enrichToken = async (req, res) => {

    try {
        const {user_id} = req.params; // Get the id

        // Find the user
        const user = await prisma.user.findUnique({
            where: {
                id: user_id,
            }
        })

        res.status(200).json(user);

    } catch (err) {
        console.error(err);
        res.status(500).json({
            message: `An error occurred while enriching token: ${err.code}`,
        })
    }
}


/**
 * What does this function do?
 * This function updates the bio of user when they want to update it
 *
 * What inputs does it expect?
 * The token of the user and the bio in the body
 *
 * What does it return or send back?
 * Nothing, it just moves on to the next middleware
 */

export const updateBio = async (req, res, next) => {
    try {

        const userFromToken = req.user; // Id of user
        const { bio } = req.body; // Bio

        if (!bio) return next(); // No bio to update

        await prisma.user.update({
            where: { id: userFromToken.id },
            data: { bio },
        });

        next();

    } catch (err) {
        console.error(err);
        res.status(500).json({ message: err.message });
    }
};


/**
 * What does this function do?
 * This function updates the avatar for a user when they want to switch
 *
 * What inputs does it expect?
 * Token from the user and the file passed in through multer
 *
 * What does it return or send back?
 * Nothing, just goes to the next middleware
 */


export const updateAvatar = async (req, res) => {
    try {

        const userFromToken = req.user; // Id of the user
        const avatarFile = req.file; // The file from multer

        // No file provided
        if (!avatarFile) {
            return res.status(200).json({ message: 'No file provided!' });
        }

        // Update the actual reference in the db
        await prisma.user.update({
            where: { id: userFromToken.id },
            data: {
                avatar: avatarFile.path,
            },
        });

        return res.status(200).json({ message: 'Avatar updated!' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: err.message });
    }
};


/**
 * What does this function do?
 * This function filters through the database after users that match the provided search string
 *
 * What inputs does it expect?
 * The token and the search query
 *
 * What does it return or send back?
 * It returns an array contain ovjects of other users on the plattform
 */


export const searchForUsers = async (req, res) => {
    try {

        const userId = req.user.id; // Of the user
        const searchQuery = req.query.q; // The search string

        // Find all the profiles that match, excluding the user
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

        // No results
        if (!searchResults) {
            return res.status(404).send({
                message: 'No users matched that search',
            })
        }

        // Return the list of user objects
        return res.status(200).json({
            searchResults
        })

    } catch (err) {
        console.log(err)
        return res.status(500).send({
            error: 'Server error occurred while filtering users',
        })
    }
}