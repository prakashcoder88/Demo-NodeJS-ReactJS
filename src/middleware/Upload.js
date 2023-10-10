const multer = require("multer");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    if (file.fieldname === "document") {
      cb(null, "public/document");
    }
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  },
});

let Upload = multer({ storage: storage }).fields([{ name: "document" }]);

async function uploadfile(req, res, next) {
  Upload(req, res, async (error) => {
    if (error) {
      res.status(400).json({
        status: 400,
        message: "File not Upload",
      });
    } else {
      if (req.files && req.files.document) {
        req.documentUrl = req.files.document.map((file) => {
          const documents = `${file.originalname}`;
          return documents;
        });
      }
      next();
    }
  });
}

module.exports = uploadfile;
