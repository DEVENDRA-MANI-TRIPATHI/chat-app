import User from '../models/user.model.js';
import bycrypt from "bcryptjs";
import generateTokenAndSetCookie from '../utils/generateToken.js';

export const signup = async (req, res) => {
    try {
        const { fullName, username, password, confirmPassword,gender } = req.body;
        
        if (password !== confirmPassword) {
            return res.status(400).json({ error: "Password Does not match" });
        }

        const user = await User.findOne({ username });

        if (user) {
            return res.status(400).json({ error: "user already exists" });
        }

        //Hash password
        const salt = await bycrypt.genSalt(10);
        const hassedPassword=await bycrypt.hash(password,salt)

        // https://avatar-placeholder.iran.liara.run/

		const boyProfilePic = `https://avatar.iran.liara.run/public/boy?username=${username}`;
        const girlProfilePic = `https://avatar.iran.liara.run/public/girl?username=${username}`;
        
        const newUser = new User({
            fullName,
            username,
            password:hassedPassword,
            gender,
            profilePic:gender==="male"?boyProfilePic:girlProfilePic
        })

        if (newUser) {

            //Generate Token 
            generateTokenAndSetCookie(newUser._id,res);
            await newUser.save();

            res.status(201).json({
                _id: newUser.id,
                fullName: newUser.fullName,
                username: newUser.username,
                profilePic: newUser.profilePic
            });
        }

    } catch (error) {
        console.log("Error in SignUp controller",error.message);
        res.status(500).json({ error: "Internal server Error" });
    }
}
export const login = async(req, res) => {
    try {
        const { username, password } = req.body;
        const user = await User.findOne({ username });
        const isPasswordCorrect = await bycrypt.compare(password, user.password || "");
        if (!user || !isPasswordCorrect) {
            return res.status(400).json({ error: "Invalid username or password" });
        }

        generateTokenAndSetCookie(user._id, res)
            ;
        res.status(200).json({
            _id: user._id,
            fullName: user.fullName,
            username: user.username,
            profilePic: user.profilePic
        });
    } catch (error) {
        console.log("Error in Login controller", error.message);
        res.status(500).json({ error: "Internal Server Error" });
    }
}
export const logout = async(req, res) => {
    try {
        res.cookie("jwt", "", { maxAge: 0 });
        res.status(200).json({
            message: "logged out successfully"
        });
    } catch (error) {
        console.log("Error in Logout controller", error.message);
        res.status(500).json({ error: "Internal Server Error" });
    }
}