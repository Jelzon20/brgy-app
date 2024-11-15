import User from "../models/user.model.js";
import bcryptjs from 'bcryptjs';


export const signup = async (req, res) => {
    const { firstName, lastName, email, password } = req.body;
    if (
        !email ||
        !password ||
        email === "" ||
        password === "" ||
        !firstName ||
        !lastName ||
        firstName === "" ||
        lastName === ""
      ) {
        // next(errorHandler(400, 'All fields are required'));
        return res.status(400).json({ message: 'All fields are required.'});
      }

      const hashedPassword = bcryptjs.hashSync(password, 10);

      const newUser = new User({
        email, 
        password: hashedPassword, 
        firstName, 
        lastName
      });

      try {
        await newUser.save();
      res.json('Signup successful.');
      } catch (error) {
        res.status(500).json({ message: error.message});
      }
}