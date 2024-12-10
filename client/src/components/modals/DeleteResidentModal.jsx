import React from 'react'
import { Modal, Button, Select, Datepicker } from "flowbite-react";
import { useRef, useState, useEffect } from "react";
import { Toaster, toast } from "sonner";
import Loading from '../../components/Loading';


const DeleteResidentModal = ({delete_resident_id, isDeleteModalOpen, onCloseDeleteModal}) => {
   
    const [isLoading, setIsLoading] = useState(false);

      const handleDelete = async (e) => {
        e.preventDefault();

        try {
            setIsLoading(true);
            const res = await fetch(`/api/resident/deleteResident/${delete_resident_id}`, {
              method: "DELETE",
              headers: {
                "Content-Type": "application/json",
              },
            });
            const data = await res.json();
            if (!res.ok) {
              setIsLoading(false);
              toast.error(data.message);
              
            } else {
              setIsLoading(false);
              toast.success(data);
              onCloseDeleteModal();
              setTimeout(() => {
                window.location.reload();
              }, 2000);
              
  
            }
          } catch (error) {
            setIsLoading(false);
            toast.error(error.message);
          }
    
      };
  return (
    <Modal
        show={isDeleteModalOpen}
        onClose={onCloseDeleteModal}
        popup
        size='lg'
      >
        <Modal.Header>
            Delete Resident Data
        </Modal.Header>
        <Modal.Body>
       
      <Toaster richColors position="top-center" expand={true} />
      {isLoading ? (<Loading />) : (
        <div className="text-gray-700 mt-6  ">
            Are you sure you want to delete this record? This action cannot be undone.
          </div>
      )}


        </Modal.Body>
        <Modal.Footer>
          {/* Cancel Button */}
          <Button color="gray" onClick={() => onCloseDeleteModal()}>
            Cancel
          </Button>

          {/* Confirm Deletion Button */}
          <Button color="failure" onClick={handleDelete}>
            Delete
          </Button>
        </Modal.Footer>
      </Modal>
  )
}

export default DeleteResidentModal