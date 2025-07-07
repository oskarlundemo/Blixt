import {prisma} from "../prisma/index.js";
import err from "multer/lib/multer-error.js";


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


export const updateBio = async (req, res, next) => {
    try {

        const userFromToken = req.user;
        const { bio } = req.body;

        console.log('Updating bio:', bio);

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


export const updateAvatar = async (req, res) => {
    try {

        const userFromToken = req.user;

        const avatarFile = req.file;
        console.log('Updating avatar:', avatarFile);

        if (!avatarFile) {
            return res.status(200).json({ message: 'Profile updated.' });
        }

        await prisma.user.update({
            where: { id: userFromToken.id },
            data: {
                avatar: avatarFile.path,
            },
        });

        console.log('Updating avatar:', avatarFile);

        return res.status(200).json({ message: 'Profile updated with avatar.' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: err.message });
    }
};

