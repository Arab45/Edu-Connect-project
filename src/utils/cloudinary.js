const cloudinary = require('cloudinary').v2;

cloudinary.config({
    cloud_name: process.env.CLODINARY_NAME,
    api_key: process.env.COUDINARY_API_KEY,
    api_secrete: process.env.CLOUDINARY_API_SECRETE
});

module.exports = { cloudinary };