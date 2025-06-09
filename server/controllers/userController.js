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

        const { user_id, uuid } = req.params;
        const { bio } = req.body;

        console.log('Updating bio:', bio);

        if (user_id !== uuid) {
            return res.status(400).json({ message: 'Unauthorized' });
        }

        if (!bio) return next(); // No bio to update

        await prisma.user.update({
            where: { id: user_id },
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
        const { user_id, uuid } = req.params;

        if (user_id !== uuid) {
            console.log('Crashar här');
            return res.status(400).json({ message: 'Unauthorized' });
        }

        const avatarFile = req.file;
        console.log('Updating avatar:', avatarFile);

        if (!avatarFile) {
            // No avatar uploaded, just return success
            return res.status(200).json({ message: 'Profile updated.' });
        }

        console.log('Updating avatar:', avatarFile);

        await prisma.user.update({
            where: { id: user_id },
            data: {
                avatar: avatarFile.path, // or .path, depending on your DB
            },
        });

        return res.status(200).json({ message: 'Profile updated with avatar.' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: err.message });
    }
};