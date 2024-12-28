import User from "../models/user.model.js";
import bcryptjs from 'bcryptjs';
import { errorHandler } from "../utils/error.js";
import jwt from 'jsonwebtoken'


export const checkAuth = (req, res, next) => {
  // console.log(req.cookies.access_token);
  const token = req.cookies.access_token;
  if(token) {
      res.json({hasToken: true});
  }else{
    res.json({hasToken: false});
  }
    
};


export const signup = async (req, res, next) => {
    const { email, password } = req.body;
    if (
        !email ||
        !password ||
        email === "" ||
        password === ""
      ) {
        next(errorHandler(400, 'All fields are required'));
      }

      const hashedPassword = bcryptjs.hashSync(password, 10);

      const newUser = new User({
        email, 
        password: hashedPassword, 
      });

      try {
        await newUser.save();
      res.json('Signup successful.');
      } catch (error) {
        next(error)
      }
}


export const signin = async (req, res, next) => {
  const {email, password} = req.body;
  if (!email || !password || email === '' || password === '') {
    next(errorHandler(400, 'All fields are required'));
  }
  try {
    const validUser = await User.findOne({ email })
    
    if (!validUser){
      return next(errorHandler(404, 'User not Found'));
    }
    const validPassword = bcryptjs.compareSync(password, validUser.password);
    if (!validPassword) {
      return next(errorHandler(400, 'Invalid password'))
    }
    const token = jwt.sign(
      { id: validUser._id
      },
      process.env.JWT_SECRET, 
      // jwtOptions
    );

    const { password: pass, ...rest } = validUser._doc;
    
    res
    .status(200)
    .cookie('access_token', token, {
      httpOnly: true,
      secure: true,
      SameSite: "None"
    })
    .json(rest);
  } catch (error) {
    next(error);
  }

}

export const signout = (req, res, next) => {
  try {
    res
      .clearCookie("access_token")
      .status(200)
      .json("User has been signed out");
  } catch (error) {
    next(error);
  }
};