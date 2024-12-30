import React, { useState } from "react";
import { useDropzone } from "react-dropzone";
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { app } from "../../firebase"; // Your Firebase initialization
import { Progress } from "flowbite-react"; // Optional for UI feedback

const FileUpload = () => {
  const [files, setFiles] = useState([]);
  const [uploadProgress, setUploadProgress] = useState({});
  const [uploadedUrls, setUploadedUrls] = useState([]);

  const storage = getStorage(app);

  const onDrop = (acceptedFiles) => {
    const newFiles = acceptedFiles.map((file) => ({
      file,
      name: file.name,
      preview: URL.createObjectURL(file), // For image previews if needed
    }));

    setFiles((prev) => [...prev, ...newFiles]);
    newFiles.forEach((fileObj) => uploadFile(fileObj.file));
  };

  const uploadFile = (file) => {
    const storageRef = ref(storage, `uploads/${file.name}`);
    const uploadTask = uploadBytesResumable(storageRef, file);

    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress = Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100);
        setUploadProgress((prev) => ({ ...prev, [file.name]: progress }));
      },
      (error) => {
        console.error("Upload error:", error);
      },
      async () => {
        const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
        setUploadedUrls((prev) => [...prev, downloadURL]);
      }
    );
  };

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: "image/*", // Restrict to images only; adjust as needed
    multiple: true,
  });

  const removeFile = (name) => {
    setFiles((prev) => prev.filter((file) => file.name !== name));
    setUploadProgress((prev) => {
      const updatedProgress = { ...prev };
      delete updatedProgress[name];
      return updatedProgress;
    });
  };

  return (
    <div>
      <div
        {...getRootProps()}
        className="border-2 border-dashed border-gray-400 p-6 text-center rounded-lg"
      >
        <input {...getInputProps()} />
        <p>Drag and drop files here, or click to select files</p>
      </div>
      <ul className="mt-4">
        {files.map(({ name, preview }) => (
          <li key={name} className="flex items-center space-x-4">
            <img src={preview} alt={name} className="w-16 h-16 object-cover rounded-md" />
            <span>{name}</span>
            <Progress progress={uploadProgress[name] || 0} size="sm" className="w-32" />
            <button
              onClick={() => removeFile(name)}
              className="text-red-500 hover:underline"
            >
              Remove
            </button>
          </li>
        ))}
      </ul>
      <div className="mt-4">
        <h3 className="text-lg font-bold">Uploaded URLs:</h3>
        <ul>
          {uploadedUrls.map((url, index) => (
            <li key={index}>
              <a href={url} target="_blank" rel="noopener noreferrer" className="text-blue-600">
                {url}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default FileUpload;
