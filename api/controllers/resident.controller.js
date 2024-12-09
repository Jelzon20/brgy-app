import Resident from "../models/resident.model.js";
import { errorHandler } from "../utils/error.js";



export const addResident = async (req, res, next) => {

    const { first_name, middle_name, last_name, residentPicture, place_of_birth, 
      birthday, age, relationship, civil_status, gender, voter_status, occupation, 
      education_attainment, email, contact_number, citizenship, fp_method, pwd, fourps,
      prev_address, cur_address, length_of_stay, household_no, precinct_no } = req.body;

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