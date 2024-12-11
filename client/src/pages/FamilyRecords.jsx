import React, { useState, useRef  } from "react";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { initializeApp } from "firebase/app";

const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_AUTH_DOMAIN",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_STORAGE_BUCKET",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "YOUR_APP_ID",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const storage = getStorage(app);

const FamilyRecords = () => {
  const [files, setFiles] = useState([]);
  const [title, setTitle] = useState("");
  const fileInputRef = useRef(null);

  // Handle file input change (when files are selected via input)
  const handleFileChange = (event) => {
    const selectedFiles = Array.from(event.target.files);
    setFiles((prevFiles) => [...prevFiles, ...selectedFiles]);
  };

  // Handle file removal from the list
  const handleRemoveFile = (index) => {
    setFiles((prevFiles) => prevFiles.filter((_, i) => i !== index));
  };

  // Handle drag over event to allow dropping files
  const handleDragOver = (event) => {
    event.preventDefault();
  };

  // Handle drop event to process the dropped files
  const handleDrop = (event) => {
    event.preventDefault();
    const droppedFiles = Array.from(event.dataTransfer.files);
    setFiles((prevFiles) => [...prevFiles, ...droppedFiles]);
  };

  // Trigger the file input when the drop zone is clicked
  const handleDropZoneClick = () => {
    fileInputRef.current.click();
  };

  // Handle file upload
  const handleUpload = async () => {
    if (!title.trim()) {
      alert("Please enter a title before uploading.");
      return;
    }

    // Upload files to Firebase Storage and get download URLs
    const fileUrls = [];
    for (let file of files) {
      try {
        // Create a storage reference
        const storageRef = ref(storage, `uploads/${file.name}`);
        // Upload the file to Firebase Storage
        await uploadBytes(storageRef, file);
        // Get the download URL
        const downloadURL = await getDownloadURL(storageRef);
        fileUrls.push(downloadURL);
      } catch (error) {
        console.error("Error uploading file:", error);
        alert("An error occurred while uploading files.");
        return;
      }
    }

    // Now that we have all download URLs, send them to MongoDB
    const formData = {
      title,
      files: { filenames: fileUrls }, // Store the URLs in MongoDB
    };

    try {
      const response = await fetch("https://your-server-endpoint.com/upload", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        alert("Files uploaded successfully!");
        setFiles([]);
        setTitle("");
      } else {
        alert("Failed to upload files.");
      }
    } catch (error) {
      console.error("Error saving data:", error);
      alert("An error occurred while saving data.");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-6">
      <div className="bg-white shadow-md rounded-lg p-8 w-full max-w-lg">
        <h3 className="text-2xl font-bold text-gray-800 mb-4 text-center">
          Upload Multiple Files
        </h3>

        {/* Title input field */}
        <div className="mb-4">
          <label
            htmlFor="title"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Title
          </label>
          <input
            id="title"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)} // Update title state
            className="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg focus:outline-none focus:ring focus:ring-blue-300"
            placeholder="Enter a title"
          />
        </div>

        <div
          className="mb-4 p-6 border-2 border-dashed border-gray-400 rounded-lg text-center cursor-pointer hover:bg-gray-50"
          onDragOver={handleDragOver}
          onDrop={handleDrop}
          onClick={handleDropZoneClick}
        >
          <p className="text-sm text-gray-600">Drag and drop files here</p>
          <p className="text-xs text-gray-500">(Or click to select files)</p>
        </div>

        <input
          type="file"
          multiple
          ref={fileInputRef}
          onChange={handleFileChange}
          className="hidden"
        />

        <div className="mb-4">
          <h4 className="text-lg font-medium text-gray-700 mb-2">Selected Files:</h4>
          <ul className="list-disc pl-5 space-y-2 text-sm text-gray-600">
            {files.map((file, index) => (
              <li key={index} className="flex items-center justify-between">
                <span>{file.name}</span>
                <button
                  onClick={() => handleRemoveFile(index)}
                  className="ml-2 text-red-500 hover:text-red-700"
                >
                  Remove
                </button>
              </li>
            ))}
          </ul>
        </div>

        <button
          onClick={handleUpload}
          disabled={files.length === 0 || !title.trim()}
          className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg font-medium hover:bg-blue-700 focus:outline-none focus:ring focus:ring-blue-300 disabled:bg-gray-400"
        >
          Upload Files
        </button>
      </div>
    </div>
  );
};


export default FamilyRecords;
