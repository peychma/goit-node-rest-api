const multer = require("multer");
const path = require("path");

const tempDir = path.join(__dirname, "../", "tmp");
const multerConfig = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, tempDir);
    },
    filename: (req, file, cb) => {
        cb(null, file.originalname);
    }
});

const fileFilter = (req, file, cb) => {
    if (file.mimetype.startsWith("image/")) {
        cb(null, true);
    } else {
        cb(new Error("Not an image! Please upload an image."), false);
    }
};

const upload = multer({
    storage: multerConfig,
    fileFilter,
    limits: {
        fileSize: 1024 * 1024
    }
});

module.exports = { upload };
