import {prisma} from "../prisma/index.js";


export const enrichToken = async (req, res) => {


    try {
        const {user_id} = req.params;
        const user = await prisma.user.findUnique({
            where: {
                id: user_id,
            }
        })

        res.status(200).json(user);

    } catch (err) {
        console.error(err);
        res.status(500).json({
            message: err.message,
        })
    }
}