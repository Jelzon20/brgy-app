import React, { useEffect, useState, useRef } from "react";
import { Modal, Button } from "flowbite-react";
import { useDropzone } from "react-dropzone";
import { Toaster, toast } from "sonner";
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { app } from "../../firebase"; // Your Firebase initialization
import { Progress } from "flowbite-react"; // Optional for UI feedback

const FileUpload = ({ document, isOpen, onClose, fetchDocuments }) => {
  const [previousFiles, setPreviousFiles] = useState([]);
  const [files, setFiles] = useState([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [uploadProgress, setUploadProgress] = useState({});
  const [uploadedUrls, setUploadedUrls] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const storage = getStorage(app);

  useEffect(() => {
    if (isOpen && document) {
      setTitle(document.title || "");
      setDescription(document.description || "");
      setPreviousFiles(document.files || []);
    }
  }, [isOpen, document]);

  // const onDrop = (acceptedFiles) => {

  //   const newFiles = acceptedFiles.map((file) => ({
  //     file,
  //     name: file.name,
  //     preview: URL.createObjectURL(file), // For image previews if needed
  //   }));
  
  //   // Add new files to state
  //   setFiles((prev) => [...prev, ...newFiles]);
 
  //     // Loop through the newFiles array and upload each file
  //     newFiles.forEach((fileObj) => uploadFile(fileObj.file)); // Pass only file to uploadFile
   
  // };
  
  const onDrop = (acceptedFiles) => {

    const newFiles = acceptedFiles.map((file) => ({
      file,
      name: file.name,
      preview: URL.createObjectURL(file), // For image previews if needed
    }));
  
    // Add new files to state
    setFiles((prev) => [...prev, ...newFiles]);
 
      // Loop through the newFiles array and upload each file
      newFiles.forEach((fileObj) => uploadFile(fileObj.file)); // Pass only file to uploadFile
   
  };
  

  const uploadFile = (file) => {
    setIsLoading(true);
    const storageRef = ref(storage, `files/${file.name}`);
    const uploadTask = uploadBytesResumable(storageRef, file);
  
    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress = Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100);
        setUploadProgress((prev) => ({ ...prev, [file.name]: progress }));
      },
      (error) => {
        console.error("Upload error:", error);
        setIsLoading(false);
      },
      async () => {
        const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
        setUploadedUrls((prev) => [...prev, downloadURL]);
        setIsLoading(false);
      }
    );
  };


  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: "*", 
    multiple: true,
  });

  const removeFile = (name) => {
    // Use functional update to ensure no cascading state update issues
    setFiles((prev) => prev.filter((file) => file.name !== name));
  };

  const removePreviousFile = (idx) => {
    // Use functional update to avoid potential rendering issues
    setPreviousFiles((prev) => prev.filter((_, i) => i !== idx));

  };

  const handleUpload = async () => {
    if (!title.trim()) {
      toast.error("Please enter a title before uploading.");
      return;
    }

    const bindedFiles = [...previousFiles, ...uploadedUrls];

    const formData = {
      title,
      description,
      files: bindedFiles,
    };

    try {
      setIsLoading(true);

      const res = await fetch(`/api/document/updateDocument/${document._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (res.ok) {
        
        setTitle("");
        setDescription("");
        setPreviousFiles([]);
        setFiles([]);
        fetchDocuments();
        toast.success("Document updated successfully");
        setTimeout(() => {
          window.location.reload(); // Reload the page after 2 seconds
          
        }, 1000);
        setIsLoading(false);
        onClose(); // Close the modal after successful update
        
        
      } else {
        toast.error(data.message);
        setIsLoading(false);
      }
    } catch (error) {
      console.error(error);
      toast.error("Error updating document");
      setIsLoading(false);
    }
  };

  return isOpen ? (
    
      <Modal show={isOpen} onClose={onClose} size="lg">
      <Modal.Header><strong>Update Document</strong></Modal.Header>
      <Modal.Body>
      <Toaster richColors position="top-center" expand={true} />
        
        <div className="mb-4">
          <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
            Title
          </label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg focus:outline-none focus:ring"
          />
        </div>

        <div className="mb-4">
          <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
            Description
          </label>
          <input
            type="text"
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg focus:outline-none focus:ring"
          />
        </div>

        <div
          {...getRootProps()}
          className="border-2 border-dashed border-gray-400 p-6 text-center rounded-lg"
        >
          <input {...getInputProps()} />
          <p>Drag and drop files here, or click to select files</p>
        </div>
        <ul className="mt-4">
          {document && files.map(({ name }) => (
            <li key={name} className="flex items-center space-x-4 truncate">
              <span>{name}</span>
              <Progress progress={uploadProgress[name] || 0} size="sm" className="w-32" />
            </li>
          ))}
        </ul>
       

<ul>
  {previousFiles && previousFiles.map((file, index) => {
    // Extract the filename from the URL
    const filename = decodeURIComponent(file.split('files').pop().split('?')[0]);


    const fileNameSubString = filename.split("files").join("");

            // Step 2: Decode the URI component
            const displayName = decodeURIComponent(fileNameSubString);

    return (
      <li key={index} className="flex items-center justify-between">
        <a href={file} target="_blank" rel="noopener noreferrer" className="text-blue-600 text-ellipsis overflow-hidden">
          {displayName}
        </a>
        <span><button
                onClick={() => removePreviousFile(index)}
                className="text-red-500 hover:underline"
              >
                X
              </button></span>
        
      </li>
    );
  })}
</ul>
        {/* <div className="mt-4">
          <h3 className="text-lg font-bold">Uploaded URLs:</h3> */}
          {/* <ul>
            {uploadedUrls &&  uploadedUrls.map((url, index) => (
              
              <li key={index}>
                <a href={url} target="_blank" rel="noopener noreferrer" className="text-blue-600">
                  {url}
                </a>
              </li>
            ))}
          </ul> */}

{/* <ul>
  {uploadedUrls && uploadedUrls.map((name, index) => {
    // Extract the filename from the URL
    const filename = decodeURIComponent(name.split('/').pop().split('?')[0]);

    const fileNameSubString = filename.split("files").join("");

            // Step 2: Decode the URI component
            const displayName = decodeURIComponent(fileNameSubString);

    return (
      <li key={index}>
        <a href={name} target="_blank" rel="noopener noreferrer" className="text-blue-600">
          {displayName}
        </a>
      </li>
    );
  })}
</ul> */}
{/* 
        </div> */}
        
      </Modal.Body>

      <Modal.Footer>
      {isLoading ? (
          <strong> Uploading...</strong>
        ) : (
          <div className="flex justify-end space-x-2">
            <button onClick={onClose} className="px-4 py-2 bg-gray-500 text-white rounded-lg">
              Cancel
            </button>
            <button
              onClick={handleUpload}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg"
            >
              Save
            </button>
          </div>
        )}
      </Modal.Footer>

      </Modal>
      
  ) : null;
};

export default FileUpload;
