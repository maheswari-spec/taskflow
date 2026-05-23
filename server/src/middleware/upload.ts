import multer from "multer"
import { CloudinaryStorage } from "multer-storage-cloudinary"

import cloudinary from "../config/cloudinary"

const storage = new CloudinaryStorage({
  cloudinary,

  params: async () => ({
    folder: "teamsync",
    allowed_formats: ["jpg", "jpeg", "png", "pdf"],
  }),
})

const upload = multer({ storage })

export default upload