import {prisma} from "../prisma/index.js";


export const createNewPost = async (req, res) => {

    try {

        if (!req.files?.length) {
            return res.status(400).json({ error: 'Missing files' });
        }

        const files = req.files;
        const caption = req.body.caption;
        const userId = req.params.user_id

        console.log(userId);

        const user = await prisma.user.findFirst({
            where: {
                id: userId,
            }
        })

        if (!user)
            console.log('No user' + user)

        const newPost = await prisma.post.create({
            data: {
                caption: caption,
                user_id: userId,
            }
        })


        console.log(newPost);

        const imagesData = files.map((file, index) => ({
            post_id: newPost.id,
            url: file.path,
            index: index
        }));

        await prisma.images.createMany({ data: imagesData });

        res.status(200).json({ message: 'Post succuesfully created!'});

    } catch (err) {
        console.log(err);
        res.status(500).json({ error: 'Server error' });
    }
}