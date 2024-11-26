import Resident from "../models/resident.model.js";
import { errorHandler } from "../utils/error.js";



export const addResident = async (req, res, next) => {

    const { firstname, middlename, lastname, alias, placeOfBirth, 
        birthday, age, civilStatus, gender, voterStatus, occupation, educationAttainment, 
        email, contactNumber, citizenship, address, lengthOfStay, householdNo, precinctNo} = req.body;
  
    if (
      !firstname || firstname == "" ||
      !lastname || lastname == "" || 
      !lastname || lastname == "" || 
      !lastname || lastname == "" || 
      !lastname || lastname == "" || 
      !lastname || lastname == "" || 
      !lastname || lastname == "" || 
      !lastname || lastname == "" || 
      !lastname || lastname == "" || 
      !lastname || lastname == "" || 
      !lastname || lastname == "" || 
      !lastname || lastname == "" || 
      !lastname || lastname == "" || 
      !lastname || lastname == "" || 
      !lastname || lastname == "" || 
      !lastname || lastname == "" || 
      !lastname || lastname == "" || 
      !lastname || lastname == ""

  
    ) {
      next(errorHandler(400, 'All fields are required'));
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