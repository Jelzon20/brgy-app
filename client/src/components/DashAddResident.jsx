import React from 'react'
import { Button } from 'flowbite-react'
import defaultImg from '../assets/default-img.png'
import { useEffect, useRef, useState } from "react";
import { CircularProgressbar } from "react-circular-progressbar";

export default function DashAddResident() {
    const filePickerRef = useRef();
    const [imageFile, setImageFile] = useState(null);
  const [imageFileUrl, setImageFileUrl] = useState(null);
  const [imageFileUploadProgress, setImageFileUploadProgress] = useState(null);
  const [imageFileUploadError, setImageFileUploadError] = useState(null);
  const [imageFileUploading, setImageFileUploading] = useState(false);

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
          setImageFile(file);
          setImageFileUrl(URL.createObjectURL(file));
        }
      };
  return (
    <div className="max-w-max mx-auto grid grid-cols-1 px-4 pt-6 xl:grid-cols-3 xl:gap-4 dark:bg-gray-900">
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
                className="relative w-32 h-32 self-center cursor-pointer shadow-md overflow-hidden rounded-full"
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
                  src={imageFileUrl || defaultImg}
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
            <h3 className="mb-4 text-xl font-semibold dark:text-white">Other Info</h3>
            <div className="mb-4">
                <label htmlFor="household" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Household No.</label>
                <input type="text" name="household" id="household" className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500" placeholder="" required />
            </div>
            <div className="mb-6">
                <label htmlFor="precinct" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Precinct No.</label>
                <input type="text" name="precinct" id="precinct" className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500" placeholder="" required />
            </div>
        </div>
    </div>  
    <div className="col-span-2">
        <div className="p-4 mb-4 bg-white border border-gray-200 rounded-lg shadow-sm 2xl:col-span-2 dark:border-gray-700 sm:p-6 dark:bg-gray-800">
            <h3 className="mb-4 text-xl font-semibold dark:text-white">General information</h3>
            <form action="#">
                <div className="grid grid-cols-6 gap-6">
                    <div className="col-span-6 sm:col-span-2">
                        <label htmlFor="first_name" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">First Name</label>
                        <input type="text" name="first_name" id="first_name" className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500" placeholder="" required />
                    </div>
                    <div className="col-span-6 sm:col-span-2">
                        <label htmlFor="middle-name" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Middle Name</label>
                        <input type="text" name="middle_name" id="middle_name" className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500" placeholder="" required />
                    </div>
                    <div className="col-span-6 sm:col-span-2">
                        <label htmlFor="last-name" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Last Name</label>
                        <input type="text" name="last_name" id="last_name" className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500" placeholder="" required />
                    </div>
                    <div className="col-span-6 sm:col-span-2">
                        <label htmlFor="alias" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Alias</label>
                        <input type="text" name="alias" id="alias" className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500" placeholder="" required />
                    </div>
                    <div className="col-span-6 sm:col-span-2">
                        <label htmlFor="place_of_birth" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Place of Birth</label>
                        <input type="text" name="place_of_birth" id="place_of_birth" className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500" placeholder="" required />
                    </div>
                    <div className="col-span-6 sm:col-span-2">
                        <label htmlFor="birthday" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Birthday</label>
                        <input type="text" name="birthday" id="birthday" className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500" placeholder="" required />
                    </div>
                    <div className="col-span-6 sm:col-span-2">
                        <label htmlFor="age" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Age</label>
                        <input type="age" name="age" id="age" className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500" placeholder="" required />
                    </div>
                    <div className="col-span-6 sm:col-span-2">
                        <label htmlFor="civil_status" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Civil Status</label>
                        <input type="civil_status" name="civil_status" id="civil_status" className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500" placeholder="" required />
                    </div>
                    <div className="col-span-6 sm:col-span-2">
                        <label htmlFor="gender" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Gender</label>
                        <input type="gender" name="gender" id="gender" className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500" placeholder="" required />
                    </div>
                    <div className="col-span-6 sm:col-span-2">
                        <label htmlFor="voter_status" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Voter Status</label>
                        <input type="text" name="voter_status" id="voter_status" className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500" placeholder="" required />
                    </div>
                    <div className="col-span-6 sm:col-span-2">
                        <label htmlFor="occupation" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Occupation</label>
                        <input type="text" name="occupation" id="occupation" className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500" placeholder="" required />
                    </div>
                    <div className="col-span-6 sm:col-span-2">
                        <label htmlFor="education" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Highest Educational Attainment</label>
                        <input type="text" name="education" id="education" className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500" placeholder="" required />
                    </div>
                    <div className="col-span-6 sm:col-span-2">
                        <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Email</label>
                        <input type="email" name="email" id="email" className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500" placeholder="" required />
                    </div>
                    <div className="col-span-6 sm:col-span-2">
                        <label htmlFor="contact" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Contact Number</label>
                        <input type="email" name="contact" id="contact" className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500" placeholder="" required />
                    </div>
                    <div className="col-span-6 sm:col-span-2">
                        <label htmlFor="citizenship" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Citizenship</label>
                        <input type="email" name="citizenship" id="citizenship" className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500" placeholder="" required />
                    </div>
                    <div className="col-span-6 sm:col-span-4">
                        <label htmlFor="address" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Address</label>
                        <input type="email" name="address" id="address" className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500" placeholder="" required />
                    </div>
                    <div className="col-span-6 sm:col-span-2">
                        <label htmlFor="stay" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Length of stay</label>
                        <input type="email" name="stay" id="stay" className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500" placeholder="" required />
                    </div>
                </div>
                <div className="mt-10 flex items-center justify-center">
                        <Button
                            type="submit"
                            className="w-60 bg-indigo-950 dark:bg-orange-600"
                        >
                            Save all
                        </Button>
                    </div>
            </form>
        </div>
       
    </div>
{/*     
</div> */}

</div>
  );
}
