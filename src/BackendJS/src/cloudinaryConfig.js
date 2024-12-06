const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const multer = require('multer');

cloudinary.config({ 
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
    api_key: process.env.CLOUDINARY_API_KEY, 
    api_secret: process.env.CLOUDINARY_API_SECRET
});

const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: 'YapBookPosts',
        allowedFormats: ['jpeg', 'png', 'jpg', 'gif', 'webp']
    },
});

const upload = multer({ storage: storage });

function extractPublicId(url) {
    if (!url) {
        return null; // had an issue with React recognizing the term 'split'. made sure to return null in case of no URL
    }
    const urlParts = url.split('/');
    const filePart = urlParts[urlParts.length - 1];
    const publicId = filePart.split('.')[0];
    return publicId;
}


module.exports = { cloudinary, upload, extractPublicId }