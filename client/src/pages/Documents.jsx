import React, { useState, useEffect, useRef  } from "react";
import { Toaster, toast } from "sonner";
import { Pagination, TextInput } from "flowbite-react";
import UpdateDocumentModal from "../components/modals/ViewEditDocumentModal";

import Loading from "../components/Loading";

const Documents = () => {
  const [documents, setDocuments] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState(null);
  
    const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    fetchDocuments();
  }, []);

  const fetchDocuments = async () => {
 
    try {
      const res = await fetch(`/api/document/getDocuments?page=${page}&search=${searchTerm}`);
      const data = await res.json();
  
      // Check if documents is an array and total is a valid number
      if (res.ok && (Array.isArray(data.documents) && typeof data.total === 'number')) {
        setDocuments(data.documents);
        setTotalPages(Math.ceil(data.total / 10));
      } else {
        console.error('API response format is incorrect:', data);
        toast.error('Failed to load documents.');
        
      }
    } catch (error) {
      console.error('Error fetching documents:', error);
      toast.error('An error occurred while fetching documents.');
    }
  };

  const handleUpdate = (documentId) => {
    const doc = documents.find((doc) => doc._id === documentId);
    setSelectedDocument(doc);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedDocument(null);
  };

  const handleSave = async (updatedDocument) => {
    const title = updatedDocument.title;
    const description = updatedDocument.description;

    // const updatedFiles = [updatedDocument.files];

    console.log(updatedDocument);

    try {

      const res = await fetch(`/api/document/updateDocument/${selectedDocument._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedDocument),
      });
      const data = await res.json();
      if (res.ok) {
        toast.success("Document updated successfully");
        setIsModalOpen(false);
        // fetchDocuments();
        // Update the document in the state without re-fetching the entire list
        // setDocuments((prevDocuments) =>
        //   prevDocuments.map((doc) =>
        //     doc._id === selectedDocument._id
        //       ? { ...doc, ...updatedDocument }  // Update only the specific document
        //       : doc  // Leave other documents unchanged
        //   )
        // );
        fetchDocuments();
      } else {
        toast.error(data.message || "Error updating document");
      }
    } catch (error) {
      toast.error("An error occurred while updating the document zz");
    }
  };


  // const handleDelete = async (id) => {
  //   if (!window.confirm("Are you sure you want to delete this document?")) return;

  //   try {
  //     const res = await fetch(`/api/document/${id}`, { method: "DELETE" });
  //     if (res.ok) {
  //       toast.success("Document deleted successfully.");
  //       fetchDocuments(); // Refresh the list
  //     } else {
  //       toast.error("Failed to delete document.");
  //     }
  //   } catch (error) {
  //     console.error("Error deleting document:", error);
  //     toast.error("An error occurred while deleting the document.");
  //   }
  // };

  return (
    <div className="container mx-auto p-6">
  <Toaster richColors position="top-center" expand={true} />

  {isLoading ? (<Loading />) : <><div className="flex justify-between items-center mb-4">
    <h1 className="text-2xl font-bold">Document List</h1>
    <TextInput
      type="text"
      placeholder="Search by title or description"
      value={searchTerm}
      onChange={(e) => setSearchTerm(e.target.value)}
    />
  </div>

  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
    {documents && documents.map((doc) => (
      <div key={doc._id} className="p-4 bg-white rounded-lg shadow">
        <h2 className="text-lg font-bold">{doc.title}</h2>
        <p className="text-sm text-gray-600">{doc.description}</p>
        <ul className="mt-2">
          {doc && doc.files.map((url, idx) => {
          
              // Step 1: Extract the filename by splitting at the last '/' and ignoring the 'files/' part
            // const fileNameWithQuery = url.substring(url.lastIndexOf(  '/o/') + 3).split('?')[0]; // +3 to remove '/o/'
            // const fileNameSubString = fileNameWithQuery.split("files").join("");

            // Step 2: Decode the URI component
            const displayName = decodeURIComponent(url);
        
            

            return (
              <li key={idx}>
                <a
                  href={url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-500 hover:underline"
                >
                  {displayName}
                </a>
              </li>
            );
          })}
        </ul>
        <div className="mt-4 flex space-x-2">
          <button
            onClick={() => handleUpdate(doc._id)}
            className="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600"
          >
            Update
          </button>
          <button
            onClick={() => handleDelete(doc._id)}
            className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
          >
            Delete
          </button>
        </div>
      </div>
    ))}
  </div>

   {/* Modal for Updating Document */}
   <UpdateDocumentModal
        document={selectedDocument}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSave={handleSave}
      />

  <div className="mt-6 flex justify-center">
    <Pagination
      currentPage={page}
      totalPages={totalPages}
      onPageChange={(page) => setPage(page)}
    />
  </div></>}
  
</div>


  )
};

export default Documents;
