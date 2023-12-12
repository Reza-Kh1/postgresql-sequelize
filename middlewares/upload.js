import multer from "multer";
const maxFile = 10 * 1000 * 1000;
const maxFiles = 100 * 1000 * 1000;
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    return cb(null, "public/img");
  },
  filename: function (req, file, cb) {
    return cb(null, Date.now() + "-" + file.originalname);
  },
});
export const uploadImage = multer({
  storage: storage,
  limits: { fieldSize: maxFile }, // محدودیت حجم عکس 1 مگابایت
}).single("file");
export const uploadImages = multer({
  storage,
  limits: { fileSize: maxFiles },
}).array("file", 10);
