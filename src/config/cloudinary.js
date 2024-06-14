import { v2 as cloudinary } from 'cloudinary';
import multer from 'multer';
import { CloudinaryStorage } from "multer-storage-cloudinary";
// cloudinary.config( {
//     cloud_name: 'ecommer',
//     api_key: '378865246822613',
//     api_secret: '4uRxyZprCSIqNe9JQ18lDu6-CyU'
// } );

// // export default cloudinary


cloudinary.config( {
    cloud_name: 'ecommer',
    api_key: '378865246822613',
    api_secret: '4uRxyZprCSIqNe9JQ18lDu6-CyU'
} );

const storage = new CloudinaryStorage( {
    cloudinary: cloudinary,
    params: {
        folder: 'user_images',
        allowed_formats: [ 'jpg', 'png' ],
    },
} );

const upload = multer( { storage: storage } );
export default upload
