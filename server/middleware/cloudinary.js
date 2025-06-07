

import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryStorage } from 'multer-storage-cloudinary';

const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: 'blixt',
        allowed_formats: ['jpeg', 'png', 'jpg'],
        transformation: [{ width: 1080, height: 1080, crop: 'limit' }],
    },
});

export { cloudinary, storage };
