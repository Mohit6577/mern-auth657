import User from '../models/user.model.js'
import bcryptjs from 'bcryptjs';
import { errorHandler } from '../utils/error.js';
import jwt from 'jsonwebtoken';

export const signup = async(req,res,next) =>{
    const { username,email,password } = req.body;
    const hasedPassword = bcryptjs.hashSync(password, 10)
    const newUser = new User({username,email,password:hasedPassword});
    try {
        await newUser.save()
        res.status(201).json({message:"User created succesfully"}) 
    } catch (error) {
        next(error);
    }
}

export const signin = async(req,res,next)=>{
    const {email,password} =req.body;
    try {
        const valideUser = await User.findOne({email});
        if (!valideUser) return next(errorHandler(404,'user not found'));
        const validPassword = bcryptjs.compareSync(password,valideUser.password)
        if (!validPassword) return next(errorHandler(401,'wrong credentials'))
        const token = jwt.sign({id:valideUser._id},process.env.JWT_SECRET,)
        const { password: hasedPassword, ...rest } = valideUser._doc;
        const expiryDate= new Date(Date.now() + 3600000); //1hour
        res.cookie('access_token',token,{httpOnly:true,expires:expiryDate})
        .status(200)
        .json(rest)
        } catch (error) {
        next(error)  
    }
}

export const google= async(req,res,next)=>{
    try {
        const user = await User.findOne({email:req.body.email})
        if (user){
            const token = jwt.sign({id: user._id},process.env.JWT_SECRET);
            const {password,hashedPassword,...rest} = user._doc;
            const expiryDate = new Date(Date.now() +3600000);
            res.cookie('access_token',token,{httpOnly:true,
            expires:expiryDate}).status(200)
            .json(rest)
        } else{
            const generatedPassword = Math.random().toString(36).slice(-8) + Math.random().toString(36).slice(-8);
            const hasedPassword = bcryptjs.hashSync(generatedPassword,10);
            const newUser = new User
            ({
                username:req.body.name.split(' ').join('').toLowerCase() + Math.random().toString(36).slice(-8),
                email:req.body.email,password:hasedPassword,
                profilePicture:req.body.photo
            });
            await newUser.save();
            const token = jwt.sign({id:newUser._id},process.env.JWT_SECRET);
            const {password:hasedPassword2,...rest} = newUser._doc;
            const expiryDate = new Date(Date.now() + 3600000);
            res.cookie('access_token',token,{
                httpOnly:true,
                expires:expiryDate,
            })
            .status(200)
            .json(rest)
        }
    } catch (error) {
        next(error)
    }
}