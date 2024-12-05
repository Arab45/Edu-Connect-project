const multer = require("multer");
const path = require("path");

const subjectStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'public/files/imgs/subjects');
  },
  filename: (req, file, cb) => {
    cb(
      null,
      file.originalname.replace(/[^a-zA-Z0-9_.,]/g, "") +
        "_" +
        Date.now() +
        path.extname(file.originalname)
    );
  },
});

const imageUpload = multer({ storage: subjectStorage });
const subjectImgUpload = imageUpload.fields([
  { name: "subject_image", maxCount: 1 },
  //   { name: "images", maxCount: 5 },
]);

const imageSubject = multer({
  storage: multer.diskStorage({}),
  fileFilter: (req, file, cb) => {
    let ext = path.extename(file.originalname);
    if(ext === ".jpg" && ext === ".jpeg" && ext === ".png" && ext === ".pdf") {
      cb(new Error("Unsopported file type!"), false);
      return;
    }
    cb(null, true);
  }
})

module.exports = {
    subjectImgUpload,
    imageSubject
};


