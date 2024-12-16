import React, { useState, useRef  } from "react";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import { app } from "../firebase";
import { Toaster, toast } from "sonner";
import { Progress } from "flowbite-react";

const UploadDocument = () => {
  const [files, setFiles] = useState([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const fileInputRef = useRef(null);

  const [imageFileUploadProgress, setImageFileUploadProgress] = useState(null);
  const [imageFileUploadError, setImageFileUploadError] = useState(null);
  const [imageFileUploading, setImageFileUploading] = useState(false);

  // Handle file input change (when files are selected via input)
  const handleFileChange = (event) => {
    const selectedFiles = Array.from(event.target.files);
    // Filter out duplicate filenames
  const filteredFiles = selectedFiles.filter(
    (newFile) => !files.some((existingFile) => existingFile.name === newFile.name)
  );

  if (filteredFiles.length < selectedFiles.length) {
    alert("Some files were not added because they have duplicate names.");
  }

  setFiles((prevFiles) => [...prevFiles, ...filteredFiles]);
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

  // Filter out duplicate filenames
  const filteredFiles = droppedFiles.filter(
    (newFile) => !files.some((existingFile) => existingFile.name === newFile.name)
  );

  if (filteredFiles.length < droppedFiles.length) {
    alert("Some files were not added because they have duplicate names.");
  }

  setFiles((prevFiles) => [...prevFiles, ...filteredFiles]);
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
        const storage = getStorage(app);
        const fileName = title + " - " + file.name;
        const storageRef = ref(storage, `/files/${fileName}`);
        // Upload the file to Firebase Storage
        const uploadTask = uploadBytesResumable(storageRef, file);
        // Get the download URL
        uploadTask.on(
          "state_changed",
          (snapshot) => {
            const progress =
              (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
    
            setImageFileUploadProgress(progress.toFixed(0));
            setImageFileUploading(true);
          },
          
          (error) => {
            setImageFileUploadError(
              "Could not upload image (File must be less than 2MB)"
            );
            toast.error("Could not upload file (File must be less than 2MB)");
            setImageFileUploadProgress(null);
            setImageFileUploading(false);
          },
          () => {
            
            getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
              fileUrls.push(downloadURL);
              setImageFileUploading(false);
            });
          }
        );
      } catch (error) {
        console.error("Error uploading file:", error);
        alert("An error occurred while uploading files.");
        return;
      }
    }

    // Now that we have all download URLs, send them to MongoDB
    const formData = {
      title,
      description,
      files: [fileUrls], // Store the URLs in MongoDB
    };

    console.log(formData);

    

    // try {
    //   const response = await fetch("https://your-server-endpoint.com/upload", {
    //     method: "POST",
    //     headers: { "Content-Type": "application/json" },
    //     body: JSON.stringify(formData),
    //   });

    //   if (response.ok) {
    //     alert("Files uploaded successfully!");
    //     setFiles([]);
    //     setTitle("");
    //   } else {
    //     alert("Failed to upload files.");
    //   }
    // } catch (error) {
    //   console.error("Error saving data:", error);
    //   alert("An error occurred while saving data.");
    // }
  };

  return (
    <div className="w-9/12 mx-auto">
    <div className="flex flex-col items-center min-h-screen p-6">
      <div className="bg-white shadow-md rounded-lg p-8 w-full max-w-lg">
        <h3 className="text-2xl font-bold text-gray-800 mb-4 text-center">
          Upload Documents
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
            placeholder="Enter a document title"
          />
        </div>
        <div className="mb-4">
          <label
            htmlFor="description"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Description
          </label>
          <input
            id="description"
            type="text"
            value={description}
            onChange={(e) => setDescription(e.target.value)} // Update title state
            className="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg focus:outline-none focus:ring focus:ring-blue-300"
            placeholder="Enter a document description"
          />
        </div>
        {title ? (<><div
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
        /></>) : (<></>)}
        

        <div className="mb-4">
          <h4 className="text-lg font-medium text-gray-700 mb-2">Selected Files:</h4>
          <ul className="list-disc pl-5 space-y-2 text-sm text-gray-600">
          {imageFileUploading ? (
            <Progress
            progress={imageFileUploadProgress}
            progressLabelPosition="inside"
            size="lg"
            labelProgress
          />
          ) : (
          <></>
          )}
          

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
    </div>
  );
};


export default UploadDocument;
