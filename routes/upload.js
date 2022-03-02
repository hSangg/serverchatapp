const express = require("express")
const multer = require("multer")
const router = express.Router()

const storage = multer.diskStorage({
  destination: (req, res, cb) => {
    cb(null, "public/images")
  },
  filename: (req, res, cb) => {
    cb(null, req.body.filename)
  },
})

const upload = multer({ storage: storage })

router.post("/", upload.single("file"), (req, res) => {
  try {
    return res
      .status(200)
      .json({ success: true, message: "File uploaded successfully" })
  } catch (error) {
    console.log(error)
  }
})

module.exports = router
