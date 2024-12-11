import React from 'react'
import { Modal, Button, Select, Datepicker } from "flowbite-react";
import { useRef, useState, useEffect } from "react";
import { CircularProgressbar } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import { app } from "../../firebase";
import { Toaster, toast } from "sonner";
import Loading from '../../components/Loading';
import moment from "moment/moment.js";


const ViewEditResidentModal = ({resident_id, onClose, isOpen}) => {
    const [age, setAge] = useState('');
    const [resident, setResident] = useState([]);
    const filePickerRef = useRef();
    const [imageFile, setImageFile] = useState(null);
    const [imageFileUrl, setImageFileUrl] = useState(null);
    const [imageFileUploadProgress, setImageFileUploadProgress] = useState(null);
    const [imageFileUploadError, setImageFileUploadError] = useState(null);
    const [imageFileUploading, setImageFileUploading] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        const handleViewUser = async (resident_id) => {
            setIsLoading(true);
            try {
              const res = await fetch(`/api/resident/getResident/${resident_id}`);
              const data = await res.json();
              if (res.ok) {
                setResident(data);
                setIsLoading(false);
                console.log(data)
                }

            } catch (error) {
              toast.error(error.message)
            }
          };
          handleViewUser(resident_id);
      }, [resident_id])

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
          setImageFile(file);
          setImageFileUrl(URL.createObjectURL(file));
        }
      };
      useEffect(() => {
        if (imageFile) {
          uploadImage();
        }
      }, [imageFile]);
    
      const uploadImage = async () => {
        // service firebase.storage {
        //   match /b/{bucket}/o {
        //     match /{allPaths=**} {
        //       allow read;
        //       allow write: if
        //       request.resource.size < 2 * 1024 * 1024 &&
        //       request.resource.contentType.matches('image/.*');
        //     }
        //   }
        // }
        setImageFileUploading(true);
        setImageFileUploadError(null);
        const storage = getStorage(app);
        const fileName = imageFile.name;
        const storageRef = ref(storage, `/images/${fileName}`);
        const uploadTask = uploadBytesResumable(storageRef, imageFile);
        uploadTask.on(
          "state_changed",
          (snapshot) => {
            const progress =
              (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
    
            setImageFileUploadProgress(progress.toFixed(0));
          },
          (error) => {
            setImageFileUploadError(
              "Could not upload image (File must be less than 2MB)"
            );
            toast.error("Could not upload file (File must be less than 2MB)");
            setImageFileUploadProgress(null);
            setImageFile(null);
            setImageFileUrl(null);
            setImageFileUploading(false);
          },
          () => {
            getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
              setImageFileUrl(downloadURL);
                // setFormData({ ...formData, residentPicture: downloadURL });
                setResident((prev) => ({ ...prev, residentPicture: downloadURL }));
              setImageFileUploading(false);
            });
          }
        );
      };
    
      const handleDateChange = (date) => {
        // const { name } = e.target;
        // const { value } = e.target;
    
        const birthDate = new Date(date);
        const convertedDate = moment(birthDate).format("MM/DD/YYYY");
        const today = new Date();
          let calculatedAge = today.getFullYear() - birthDate.getFullYear();
    
          const isBeforeBirthdayThisYear =
          today.getMonth() < birthDate.getMonth() ||
          (today.getMonth() === birthDate.getMonth() && today.getDate() < birthDate.getDate());
    
            if (isBeforeBirthdayThisYear) {
              calculatedAge--;
            }
            setAge(calculatedAge);
    
        //     // setFormData({ ...formData, birthday: convertedDate, age: calculatedAge });
            setResident((prev) => ({ ...prev, birthday: convertedDate, age: calculatedAge }));
        //     console.log(convertedDate);
      };
      const handleChange = (e) => {
        const { name } = e.target;
        const { value } = e.target;
        if (
         
            name === "first_name" ||
            name === "middle_name" ||
            name === "last_name" ||
            name === "citizenship" ||  
            name === "occupation"
        ) {
          const re = /^[a-zA-Z \.]*$/;
          if (!re.test(value)) {
            e.target.value = "";
            toast.error("Field only accepts letters");
            return;
          } else {
            setResident((prev) => ({ ...prev, [e.target.name]: e.target.value.trim() }));
          }
        } else if (name === "contact_number" || name === "length_of_stay" || name === "household_no") {
          var number = Number(value);
          if (Number.isNaN(number)) {
            e.target.value = "";
            toast.error("Field only accepts numbers");
          } else {
            setFormData({ ...formData, id: value.trim() });
          }
        }
        setResident((prev) => ({ ...prev, [e.target.name]: e.target.value.trim() }));
      };


      const handleUpdate = async (e) => {
        e.preventDefault();
    
        if (Object.keys(resident ).length === 0) {
          toast.error("No changes made in sign in info");
          return;
        }
        if (imageFileUploading) {
          toast.error("Please wait for image to upload");
          return;
        }
    
        try {
          setIsLoading(true);
          const res = await fetch(`/api/resident/updateResident/${resident_id}`, {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(resident),
          });
          const data = await res.json();
          if (!res.ok) {
            setIsLoading(false);
            toast.error(data.message);
            
          } else {
            setIsLoading(false);
            toast.success(data);
            setAge('')
            onClose();

            
          }
        } catch (error) {
          setIsLoading(false);
          toast.error(error.message);
        }
      };
  return (
    <Modal
        show={isOpen}
        onClose={onClose}
        popup
        size='xxl'
      >
        <Modal.Header>
            View/Edit Resident Info
        </Modal.Header>
        <Modal.Body>
        <form onSubmit={handleUpdate} className="w-9/12 mx-auto">
      <Toaster richColors position="top-center" expand={true} />
      {isLoading ? (<Loading />) : (
        <div className="max-w-full mx-auto grid grid-cols-1 px-4 pt-6 xl:grid-cols-3 xl:gap-4 dark:bg-gray-900">
        {/* <div className="grid grid-cols-1 px-4 pt-6 xl:grid-cols-3 xl:gap-4 dark:bg-gray-900"> */}
        {/* <!-- Right Content --> */}
        
        <div className="col-span-full xl:col-auto">
          <div className="p-4 mb-4 bg-white border border-gray-200 rounded-lg shadow-sm 2xl:col-span-2 dark:border-gray-700 sm:p-6 dark:bg-gray-800">
            <div className="items-center flex  flex-col  sm:flex xl:block 2xl:flex sm:space-x-4 xl:space-x-0 2xl:space-x-4">
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                ref={filePickerRef}
                hidden
              />
              <div className="flex items-center justify-center">
                <div
                  className="relative w-56 h-56 self-center cursor-pointer shadow-md overflow-hidden rounded-full"
                  onClick={() => filePickerRef.current.click()}
                >
                  {imageFileUploadProgress && (
                    <CircularProgressbar
                      value={imageFileUploadProgress || 0}
                      text={`${imageFileUploadProgress}%`}
                      strokeWidth={5}
                      styles={{
                        root: {
                          width: "100%",
                          height: "100%",
                          position: "absolute",
                          top: 0,
                          left: 0,
                        },
                        path: {
                          stroke: `rgba(62, 152, 199, ${
                            imageFileUploadProgress / 100
                          })`,
                        },
                      }}
                    />
                  )}
                  <img
                    src={(resident && resident.residentPicture) || imageFileUrl}
                    alt="user"
                    className={`rounded-full w-full h-full object-cover border-8 border-[lightgray] ${
                      imageFileUploadProgress &&
                      imageFileUploadProgress < 100 &&
                      "opacity-60"
                    }`}
                  />
                </div>
              </div>
              <div>
                <div className="mt-4 mb-2 text-sm text-gray-500 dark:text-gray-400">
                  JPG or PNG. Max size of 800K
                </div>
              </div>
            </div>
          </div>

          <div className="p-4 mb-4 bg-white border border-gray-200 rounded-lg shadow-sm 2xl:col-span-2 dark:border-gray-700 sm:p-6 dark:bg-gray-800">
            <h3 className="mb-4 text-xl font-semibold dark:text-white">
              Other Info
            </h3>
            <div className="mb-4">
              <label
                htmlFor="household"
                className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
              >
                Household No.
              </label>
              <input
                type="text"
                onChange={handleChange}

                value={resident && resident.household_no}
                name="household_no"
                className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                required
              />
            </div>
            <div className="mb-6">
              <label
                htmlFor="precinct_no"
                className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
              >
                Precinct No.
              </label>
              <input
              onChange={handleChange}
              
                type="text"
                value={resident && resident.precinct_no}
                name="precinct_no"
                className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                placeholder=""
                required
              />
            </div>
          </div>
        </div>
        <div className="col-span-2">
          <div className="p-4 mb-4 bg-white border border-gray-200 rounded-lg shadow-sm 2xl:col-span-2 dark:border-gray-700 sm:p-6 dark:bg-gray-800">
            <h3 className="mb-4 text-xl font-semibold dark:text-white">
              General information
            </h3>

            <div className="grid grid-cols-6 gap-6">
              <div className="col-span-6 sm:col-span-2">
                <label
                  htmlFor="firstname"
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >
                  First Name
                </label>
                <input
                  type="text"
                  value={resident && resident.first_name}
                  onChange={handleChange}
                  name="first_name"
                  className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                  placeholder=""
                  required
                />
              </div>
              <div className="col-span-6 sm:col-span-2">
                <label
                  htmlFor="middle_name"
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >
                  Middle Name
                </label>
                <input
                
                  type="text"
                  value={resident && resident.middle_name}
                  onChange={handleChange}
                  name="middle_name"
                  className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                  placeholder=""
                  required
                />
              </div>
              <div className="col-span-6 sm:col-span-2">
                <label
                  htmlFor="last_name"
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >
                  Last Name
                </label>
                <input
                
                  type="text"
                  value={resident && resident.last_name}
                  onChange={handleChange}
                  name="last_name"
                  className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                  placeholder=""
                  required
                />
              </div>
              <div className="col-span-6 sm:col-span-2">
                <label
                  htmlFor="place_of_birth"
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >
                  Place of Birth
                </label>
                <input
                
                  type="text"
                  value={resident && resident.place_of_birth}
                  onChange={handleChange}
                  name="place_of_birth"
                  className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                  placeholder=""
                  required
                />
              </div>
              <div className="col-span-6 sm:col-span-2">
                <label
                  htmlFor="birthday"
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >
                  Birthday: <b>{resident && resident.birthday}</b>
                </label>
                <Datepicker
                  name="birthday"
                //   value={resident && resident.birthday}
                  onChange={handleDateChange}
                //   className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                required
                />
              </div>
              <div className="col-span-6 sm:col-span-2">
                <label
                  htmlFor="age"
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >
                  Age
                </label>
                <input
                
                  type="text"
                  name="age"
                  value={age || resident.age}
                  onChange={handleChange}
                  readOnly
                  className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                  required
                />
              </div>
              <div className="col-span-6 sm:col-span-2">
                <label
                  htmlFor="relationship"
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >
                  Relationship
                </label>
                <Select
                  name="relationship"
                  value={resident && resident.relationship}
                  onChange={handleChange}
                  required
                  // className="bg-gray-50 border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500  w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                >
                  <option value="">Select here</option>
                  <option value="Father">Father</option>
                  <option value="Mother">Mother</option>
                  <option value="Son">Son</option>
                  <option value="Daughter">Daughter</option>
                  <option value="Other Member">Other Member</option>
                </Select>
              </div>
              <div className="col-span-6 sm:col-span-2">
                <label
                  htmlFor="civil_status"
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >
                  Civil Status
                </label>
                <Select
                  name="civil_status"
                  value={resident && resident.civil_status}
                  onChange={handleChange}
                  required
                  // className="bg-gray-50 border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500  w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                >
                  <option value="">Select here</option>
                  <option value="Single">Single</option>
                  <option value="Married">Married</option>
                  <option value="Widow">Widow</option>
                  <option value="Separated">Separated</option>
                  <option value="Live In">Live In</option>
                </Select>
              </div>
              <div className="col-span-6 sm:col-span-2">
                <label
                  htmlFor="gender"
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >
                  Gender
                </label>
                <Select
                  name="gender"
                  value={resident && resident.gender}
                  onChange={handleChange}
                  required
                  // className="bg-gray-50 border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500  w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                >
                  <option value="">Select here</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                 
                </Select>
              </div>
              <div className="col-span-6 sm:col-span-2">
                <label
                  htmlFor="voter_status"
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >
                  Voter Status
                </label>
                <Select
                  name="voter_status"
                  value={resident && resident.voter_status}
                  onChange={handleChange}
                  required
                  // className="bg-gray-50 border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500  w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                >
                  <option value="">Select here</option>
                  <option value="Yes, registered here">Yes, registered here</option>
                  <option value="Yes, outside Abucay">Yes, outside Abucay</option>
                  <option value="No">No</option>
                 
                </Select>
              </div>
              <div className="col-span-6 sm:col-span-2">
                <label
                  htmlFor="occupation"
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >
                  Occupation
                </label>
                <input
                  type="text"
                  value={resident && resident.occupation}
                  onChange={handleChange}
                  name="occupation"
                  className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                  placeholder=""
                  required
                />
              </div>
              <div className="col-span-6 sm:col-span-2">
                <label
                  htmlFor="education_attainment"
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >
                  Highest Educational Attainment
                </label>
                <input
                  type="text"
                  value={resident && resident.education_attainment}
                  onChange={handleChange}
                  name="education_attainment"
                  className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                  placeholder=""
                  required
                />
              </div>
              <div className="col-span-6 sm:col-span-2">
                <label
                  htmlFor="email"
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >
                  Email
                </label>
                <input
                  type="email"
                  value={resident && resident.email}
                  onChange={handleChange}
                  name="email"
                  className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                  placeholder=""
                  required
                />
              </div>
              <div className="col-span-6 sm:col-span-2">
                <label
                  htmlFor="contact"
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >
                  Contact Number
                </label>
                <input
                  type="text"
                  value={resident && resident.contact_number}
                  onChange={handleChange}
                  name="contact_number"
                  className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                  placeholder=""
                  required
                />
              </div>
              <div className="col-span-6 sm:col-span-2">
                <label
                  htmlFor="citizenship"
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >
                  Citizenship
                </label>
                <input
                  type="text"
                  value={resident && resident.citizenship}
                  onChange={handleChange}
                  name="citizenship"
                  className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                  placeholder=""
                  required
                />
              </div>
              <div className="col-span-6 sm:col-span-2">
                <label
                  htmlFor="fp_method"
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >
                  Family Planning Method
                </label>
                <Select
                  name="fp_method"
                  value={resident && resident.fp_method}
                  onChange={handleChange}
                  required
                  // className="bg-gray-50 border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500  w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                >
                  <option value="">Select here</option>
                  <option value="Vasectomy">Vasectomy</option>
                  <option value="Tubal Ligate">Tubal Ligate</option>
                  <option value="Implant">Implant</option>
                  <option value="Condom">Condom</option>
                  <option value="IUD">IUD</option>
                  <option value="Pill">Pill</option>
                  <option value="Injectable">Injectable</option>
                  <option value="NFP">NFP</option>
                </Select>
              </div>
              <div className="col-span-6 sm:col-span-2">
                <label
                  htmlFor="pwd"
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >
                  PWD
                </label>
                <Select
                  name="pwd"
                  value={resident && resident.pwd}
                  onChange={handleChange}
                  required
                  // className="bg-gray-50 border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500  w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                >
                  <option value="">Select here</option>
                  <option value="Yes">Yes</option>
                  <option value="No">No</option>
                 
                </Select>
              </div>
              <div className="col-span-6 sm:col-span-2">
                <label
                  htmlFor="fourps"
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >
                  4 Ps
                </label>
                <Select
                  name="fourps"
                  
                  value={resident && resident.fourps}
                  onChange={handleChange}
                  required
                  // className="bg-gray-50 border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500  w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                >
                  <option value="">Select here</option>
                  <option value="Yes">Yes</option>
                  <option value="No">No</option>
                 
                </Select>
              </div>
              <div className="col-span-6 sm:col-span-6">
                <label
                  htmlFor="prev_address"
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >
                  Previous Address
                </label>
                <input
                name="prev_address"
                  type="text"
                  value={resident && resident.prev_address}
                  onChange={handleChange}
                  className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                  placeholder=""
                  required
                />
              </div>
              <div className="col-span-6 sm:col-span-4">
                <label
                  htmlFor="cur_address"
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >
                  Current Address
                </label>
                <input
                  type="text"
                  value={resident && resident.cur_address}
                  onChange={handleChange}
                  name="cur_address"
                  className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                  placeholder=""
                  required
                />
              </div>
              <div className="col-span-6 sm:col-span-2">
                <label
                  htmlFor="length_of_stay"
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >
                  Length of stay (in years)
                </label>
                <input
                  type="text"
                  value={resident && resident.length_of_stay}
                  onChange={handleChange}
                  name="length_of_stay"
                  className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                  placeholder=""
                  required
                />
              </div>
            </div>
            <div className="mt-10 flex items-center justify-center">
              <Button
                type="submit"
                className="w-60 bg-indigo-950 dark:bg-orange-600"
              >
                Update
              </Button>
            </div>
          </div>
        </div>
      </div>)}
      
    </form>
        </Modal.Body>
      </Modal>
  )
}

export default ViewEditResidentModal