import {prisma} from "../prisma/index.js";


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

        res.status(200).json(matchingUsers);

    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: err.message,
        })
    }
}


export const getAllPosts = async (req, res) => {

    try {

        const userIdFromToken = req.user.id;

        const posts = await prisma.post.findMany({
            where: {
                user_id: {
                    not: userIdFromToken,
                }
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