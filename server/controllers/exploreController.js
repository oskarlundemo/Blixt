import {prisma} from "../prisma/index.js";

/**
 * What does this function do?
 * It searches through the db for users that match the given string
 *
 * What inputs does it expect?
 * Token and search query
 *
 * What does it return or send back?
 * Success message and an array of matching users
 */



export const fetchMatchingUsers = async (req, res) => {

    try {

        const userIdFromToken = req.user.id;
        const searchQuery = req.query.q;

        const matchingUsers = await prisma.user.findMany({
            where: {
                username: {
                    contains: searchQuery,
                    mode: 'insensitive'
                },
                id: {
                    not: userIdFromToken,
                }
            },
            take: 10,
        })

        res.status(200).json(
            {
                results: matchingUsers,
                message: 'Users found successfully.'
            }
        );

    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: 'There was an error while fetching users.',
        })
    }
}

/**
 * What does this function do?
 * Fetches all the posts that hove been made, but not by the user
 *
 * What inputs does it expect?
 * Token and search query
 *
 * What does it return or send back?
 * Success message and an array of matching users
 */


export const getAllPosts = async (req, res) => {

    try {

        const userIdFromToken = req.user.id;

        const posts = await prisma.post.findMany({
            where: {
                user_id: {
                    not: userIdFromToken,
                },
                archived: false
            },
            include: {
                images: true,
                poster: true,
            }
        })

        res.status(200).json(posts);

    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: err.message,
        })
    }

}