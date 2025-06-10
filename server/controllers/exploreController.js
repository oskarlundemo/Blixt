import {prisma} from "../prisma/index.js";


export const fetchMatchingUsers = async (req, res) => {

    try {

        const {user_id} = req.params;
        const searchQuery = req.query.q;

        const matchingUsers = await prisma.user.findMany({
            where: {
                username: {
                    contains: searchQuery,
                    mode: 'insensitive'
                },
                id: {
                    not: user_id
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