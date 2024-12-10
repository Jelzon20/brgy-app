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

  export const updateResident = async (req, res, next) => {
  
    try {
      await Resident.findByIdAndUpdate(
        req.params.resident_id,
        {
          $set: {
            first_name: req.body.first_name,
            middle_name: req.body.middle_name,
            last_name: req.body.last_name,
            residentPicture: req.body.residentPicture,
            place_of_birth: req.body.place_of_birth,
            birthday: req.body.birthday,
            age: req.body.age,
            relationship: req.body.relationship,
            civil_status: req.body.civil_status,
            gender: req.body.gender,
            voter_status: req.body.voter_status,
            occupation: req.body.occupation,
            education_attainment: req.body.education_attainment,
            email: req.body.email,
            contact_number: req.body.contact_number,
            citizenship: req.body.citizenship,
            fp_method: req.body.fp_method,
            pwd: req.body.pwd,
            fourps: req.body.fourps,
            prev_address: req.body.prev_address,
            cur_address: req.body.cur_address,
            length_of_stay: req.body.length_of_stay,
            household_no: req.body.household_no,
            precinct_no: req.body.precinct_no
          },
        },
        { new: true }
      );
      res.json('Resident record has been updated successfully.');
    } catch (error) {
      next(error);
    }
  }

  export const deleteResident = async (req, res, next) => {

        try {
          const deletedRecord = await Resident.findByIdAndDelete(req.params.resident_id);
          if (deletedRecord) {
            res.json('Resident record has been deleted successfully.');
          } else {
            next(errorHandler(400, "No record found with the given ID."));
          }
        } catch (error) {
          next(error);
        }

  }