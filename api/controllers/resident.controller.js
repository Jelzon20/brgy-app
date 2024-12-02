import Resident from "../models/resident.model.js";
import { errorHandler } from "../utils/error.js";



export const addResident = async (req, res, next) => {

    const { firstname, middlename, lastname, alias, placeOfBirth, 
        birthday, age, civilStatus, gender, voterStatus, occupation, educationAttainment, 
        email, contactNumber, citizenship, address, lengthOfStay, householdNo, precinctNo } = req.body;
  
    if (
      !firstname || firstname == "" ||
      !lastname || lastname == "" || 
      !placeOfBirth || placeOfBirth == "" || 
      !birthday || birthday == "" || 
      !civilStatus || civilStatus == "" || 
      !gender || gender == "" || 
      !citizenship || citizenship == "" || 
      !address || address == ""
    ) {
      next(errorHandler(400, 'Please fill out the required fields.'));
      return; 
    }
  
    const newResident = new Resident({
      ...req.body,
    });
    try {
      await newResident.save();
      res.json('New resident has been added successfully.');
    } catch (error) {
      next(error);
    }
  };


  export const getResidents = async (req, res, next) => {
    try {
      const sortDirection = req.query.sort === "asc" ? 1 : -1;
  
      const residents = await Resident.find()
        .sort({ createdAt: sortDirection });

        const residentsMap = residents.map((resident) => {
          const { ...rest } = resident._doc;
          return rest;
        });
    
        res.status(200).json({
          residents: residentsMap,
        });
    } catch (error) {
      next(error);
    }
  };


  export const getResident = async (req, res, next) => {
    try {
      const resident = await Resident.findById(req.params.residentId);
      if (!resident) {
        return next(errorHandler(404, "User not found"));
      }
      const { ...rest } = resident._doc;
      res.status(200).json(rest);
    } catch (error) {
      next(error);
    }
  };