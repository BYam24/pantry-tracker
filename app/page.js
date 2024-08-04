"use client"; //make client site app

// import styles from "./page.module.css";   commenting out bc we will not be using css since our components are all imported from material ui

import { useState, useEffect, useRef } from "react";
import Upload from "./upload/page";
import {
  collection,
  getDocs,
  query,
  getDoc,
  setDoc,
  deleteDoc,
  updateDoc,
  doc,
} from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

import { firestore, storage } from "../firebase"; // Import storage from Firebase
import {
  Box,
  Typography,
  Modal,
  TextField,
  Button,
  Stack,
} from "@mui/material";
import Link from "next/link"; // Import Link from react-router-dom

import handleImageDescription from "./chatgpt/chat";

export default function Home() {
  const [inventory, setInventory] = useState([]);
  const [open, setOpen] = useState(false);
  const [itemName, setItemName] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedItem, setSelectedItem] = useState(null);

  const filteredInventory = inventory.filter((item) =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const updateInventory = async () => {
    const snapshot = query(collection(firestore, "inventory"));
    const data = await getDocs(snapshot);
    const newInventory = data.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    setInventory(newInventory);
  };

  const removeItem = async (item) => {
    const docRef = doc(collection(firestore, "inventory"), item);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      const { quantity } = docSnap.data();
      if (quantity == 1) {
        await deleteDoc(docRef);
      } else {
        await setDoc(docRef, { name: item, quantity: quantity - 1 });
      }
    }
    await updateInventory();
  };

  const addItem = async (itemName, image) => {
    const docRef = doc(firestore, "inventory", itemName.toLowerCase());
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      await updateDoc(docRef, { quantity: docSnap.data().quantity + 1 });
      if (image) {
        // Upload image to Firebase Storage
        const imageRef = ref(storage, `images/${itemName.toLowerCase()}`);
        try {
          await uploadBytes(imageRef, inputImage.current);
          const imageUrl = await getDownloadURL(imageRef);
          await updateDoc(docRef, { image: imageUrl });

          console.log("File Uploaded Successfully");
        } catch (error) {
          console.error("Error uploading the file", error);
        }
      }
    } else {
      await setDoc(docRef, { name: itemName.toLowerCase(), quantity: 1 });
      if (image) {
        // Upload image to Firebase Storage

        const imageRef = ref(storage, `images/${itemName.toLowerCase()}`);
        try {
          await uploadBytes(imageRef, inputImage.current);
          const imageUrl = await getDownloadURL(imageRef);
          await updateDoc(docRef, { image: imageUrl });

          console.log("File Uploaded Successfully");
        } catch (error) {
          console.error("Error uploading the file", error);
        }
      }
    }
    await updateInventory();
  };

  useEffect(() => {
    updateInventory();
  }, []);

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const inputImage = useRef(null);

  const ImageUploadForm = () => {
    const [image, setImage] = useState(null);

    const handleImageChange = (e) => {
      if (e.target.files[0]) {
        setImage(e.target.files[0]);
        // inputImage.current = URL.createObjectURL(e.target.files[0]); // Set inputImage to the uploaded image
        inputImage.current = e.target.files[0];
      }
    };

    return (
      <div>
        <input type="file" onChange={handleImageChange} />
      </div>
    );
  };

  const handleItemClick = (item) => {
    setSelectedItem(item);
  };

  const handleCloseModal = () => {
    setSelectedItem(null);
  };

  return (
    <Box
      width="100vw"
      height="100vh"
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      gap={2}
      bgcolor="white"
    >
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        direction="row"
        gap={2}
        bgcolor="white"
        border="2px solid black"
        boxShadow={24}
        p={2}
      >
        <Typography variant="h6">Search</Typography>
        <input
          flex="1"
          type="text"
          placeholder="Search items..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </Box>

      <Modal open={open} onClose={handleClose}>
        <Box
          position="absolute"
          top="50%"
          left="50%"
          width="80vw"
          display="flex"
          flexDirection="column"
          gap={3}
          bgcolor="white"
          border="2px solid black"
          boxShadow={24}
          p={4}
          sx={{ transform: "translate(-50%, -50%)" }}
        >
          <Typography variant="h6">Add Item</Typography>
          <Stack direction="row" width="100%" spacing={2}>
            <TextField
              variant="outlined"
              fullWidth
              label="Item Name"
              value={itemName}
              onChange={(e) => setItemName(e.target.value)}
            />

            <ImageUploadForm />
            <Button
              variant="outlined"
              color="primary"
              onClick={() => {
                addItem(itemName, inputImage.current);
                setItemName("");
                handleClose();
              }}
            >
              Add Item
            </Button>
          </Stack>
        </Box>
      </Modal>

      <Box border="1px solid #333">
        <Box
          width="800px"
          bgcolor="#ADD8E6"
          display="flex"
          justifyContent="center"
          alignItems="center"
          padding="10px"
        >
          <Typography variant="h2">Pantry Tracker</Typography>
        </Box>

        <Stack
          width="800px"
          height="300px"
          overflow="auto"
          direction="column"
          spacing={2}
        >
          {filteredInventory.map(({ name, quantity, image }) => (
            <Box
              key={name}
              width="100%"
              height={30}
              minWidth="150px"
              bgcolor="#f0f0f0"
              display="flex"
              justifyContent="space-between"
              alignItems="center"
              padding={5}
              onClick={() => {
                // Handle item click only if there is an image
                if (image) {
                  handleItemClick(image);
                }
              }}
            >
              <Typography
                variant="h3"
                color="black"
                textAlign="center"
                sx={{ flex: 1 }}
              >
                {name.charAt(0).toUpperCase() + name.slice(1)}
              </Typography>
              <Typography
                variant="h3"
                color="black"
                textAlign="center"
                sx={{ flex: 1 }}
              >
                {quantity}
              </Typography>

              {/* {image && (
                <img src={image} alt={name} style={{ width: 50, height: 50 }} />
              )} */}

              <Stack direction="row" spacing={2} sx={{ flex: 1 }}>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={() => addItem(name)}
                >
                  Add
                </Button>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={() => removeItem(name)}
                >
                  Remove
                </Button>
              </Stack>
            </Box>
          ))}
        </Stack>
      </Box>
      <Button
        variant="contained"
        color="primary"
        onClick={() => {
          handleOpen();
        }}
      >
        Add New Item
      </Button>

      <Button variant="contained" color="primary">
        <Link href="/camera" style={{ textDecoration: "none", color: "white" }}>
          Scan Item
        </Link>
      </Button>

      <Modal open={selectedItem !== null} onClose={handleCloseModal}>
        <Box bgcolor="white">
          {selectedItem && (
            <div
              style={{
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
                gap: "10px",
              }}
            >
              <img
                src={selectedItem}
                style={{ width: "500px" }}
                alt="Selected Item"
              />

              <Typography variant="caption" style={{ padding: "10px" }}>
                {handleImageDescription(selectedItem)}
              </Typography>
            </div>
          )}
        </Box>
      </Modal>
    </Box>
  );
}
