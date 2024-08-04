"use client";

import { Camera } from "react-camera-pro";
import React, { useState, useRef } from "react";
import { Box } from "@mui/material";
import axios from "axios"; // Import axios for making HTTP requests
import { CldUploadWidget } from "next-cloudinary";

// const uploadToCloudinary = async (photo, folderName) => {
//   try {
//     const apiUrl = "/api/upload/route.js"; // Update the API URL to match the backend route
//     const data = {
//       photo: photo,
//       folderName: folderName,
//     };

//     const response = await axios.post(apiUrl, data);
//     return response.data.url;
//   } catch (error) {
//     console.error("Error uploading image to Cloudinary:", error);
//     return null;
//   }
// };

export default function CameraPage() {
  const camera = useRef(null);
  const [image, setImages] = useState(null);

  const takeAndUploadPhoto = async () => {
    const photo = camera.current.takePhoto();
    // const imageUrl = await uploadToCloudinary(photo, "pantry-tracker");
    // if (imageUrl) {
    //   setImages(imageUrl);
    setImages(photo);
    // Call GPT-4 to describe the uploaded image here
    // }
  };

  const saveImage = (imageUrl) => {
    // Logic to save the image
    // For example, you can create a download link for the image
    const link = document.createElement("a");
    link.href = imageUrl;
    link.download = "image.jpg";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div>
      <Box
        width="100vw"
        height="100vh"
        display="flex"
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
        gap={5}
      >
        <Box
          width="100vw"
          height="100vh"
          display="flex"
          flexDirection="row"
          alignItems="center"
          justifyContent="center"
          gap={5}
          bgcolor="lightblue"
        >
          <Camera
            ref={camera}
            aspectRatio={16 / 9}
            faceDetection="environment"
            style={{ width: "40%", height: "100%" }}
          />
          <div
            style={{
              width: "40%",
              display: "flex",
              flexDirection: "column",
              gap: "20px",
              justifyContent: "center",
              padding: "10px",
              margin: "10px",
              justifyContent: "center",
              alignContent: "center",
              backgroundColor: "lightgrey",
              borderRadius: "10px",
              boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
            }}
          >
            <div
              style={{
                width: "40%",
                display: "flex",
                flexDirection: "column",
                gap: "20px",
                padding: "10px",
                margin: "10px",
                justifyContent: "center",
                alignContent: "center",
                backgroundColor: "lightgrey",
                borderRadius: "10px",
                boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
              }}
            >
              <button onClick={takeAndUploadPhoto}>Take Photo</button>
              <button
                onClick={() => (window.location.href = "http://localhost:3000")}
              >
                Go Back
              </button>
            </div>

            {image && (
              <div style={{ position: "relative" }}>
                <img
                  src={image}
                  style={{ width: "100%" }}
                  alt="Image preview"
                />
                <button
                  onClick={() => saveImage(image)}
                  style={{
                    position: "absolute",
                    bottom: 10,
                    left: 10,
                    backgroundColor: "transparent",
                    color: "white",
                    border: "1px solid white",
                    padding: "5px 10px",
                    borderRadius: "5px",
                    cursor: "pointer",
                  }}
                >
                  Save Image
                </button>
              </div>
            )}
          </div>
        </Box>
        {/* <CldUploadWidget uploadPreset="pantry-tracker">
          {({ open }) => {
            return (
              <button
                onClick={open}
                style={{
                  backgroundColor: "blue",
                  color: "white",
                  padding: "10px 20px",
                  border: "none",
                  borderRadius: "5px",
                  cursor: "pointer",
                }}
              >
                Upload an Image
              </button>
            );
          }}
        </CldUploadWidget> */}
      </Box>
    </div>
  );
}
