// pages/api/upload.js

import cloudinary from "cloudinary";

cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY,
  api_secret: process.env.NEXT_PUBLIC_CLOUDINARY_API_SECRET,
});

export default async function handler(req, res) {
  if (req.method === "POST") {
    const { photo, folderName } = req.body;
    try {
      const result = await cloudinary.uploader.upload(photo, {
        folder: folderName,
      });
      res.status(200).json({ url: result.secure_url });
    } catch (error) {
      console.error("Error:", error);
      res.status(500).json({ error: "Failed to upload image" });
    }
  } else {
    res.status(405).json({ error: "Method not allowed" });
  }
}
