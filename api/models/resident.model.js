import mongoose from 'mongoose';


const residentSchema = new mongoose.Schema({
    firstname: {
        type: String,
        required: true,
    }, 
    middlename: {
        type: String,
    }, 
    lastname: {
        type: String,
        required: true,
    },
    residentPicture: {
        type: String,
        default:
          'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png',
      },
    alias: {
        type: String,
    },
    placeOfBirth: {
        type: String,
        required: true,
    },
    birthday: {
        type: String,
        required: true,
    },
    age: {
        type: String,
    },
    civilStatus: {
        type: String,
        required: true,
    },
    gender: {
        type: String,
        required: true,
    },
    voterStatus: {
        type: String,
    },
    occupation: {
        type: String,
    },
    educationAttainment: {
        type: String,
    },
    email: {
        type: String,
    },
    contactNumber: {
        type: String,
    },
    citizenship: {
        type: String,
        required: true,
    },
    address: {
        type: String,
        required: true,
    },
    lengthOfStay: {
        type: String,
    },
    householdNo: {
        type: String,
    },
    precinctNo: {
        type: String,
    },
}, {timestamps: true}
);

const Resident = mongoose.model('Resident', residentSchema);

export default Resident;