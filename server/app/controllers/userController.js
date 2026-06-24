import User from "../models/User.js";
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'

export const health = async (req, res) =>{

    res.status(200).json({
        message : 'route is healthy'
    })
}



export const registerUser = async (req, res) =>{

    try {

        const {name, email, mobile, password} = req.body

        const existingUser = await User.findOne({email})

        if(existingUser){
            return res.status(409).json({
                message : 'user already exist'
            })
        }
        
        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await User.create({
            name,
            email,
            mobile,
            password : hashedPassword
        })

        res.status(201).json({
            message : 'user registered successfully',
            user
        })
    } catch (error) {
        res.status(500).json({
            message : error.message
        })
    }
}

export const loginUser = async (req, res) =>{
    try {
        
        const {email, password} = req.body;

        const user = await User.findOne({email})

        if(!user){
            return res.status(409).json({
                message : 'user not found'
            })
        }

        const isMatch = await bcrypt.compare(password, user.password)

        if(!isMatch){
            return res.status(401).json({
                message : 'Invalid credentials'
            })
        }

        const token = jwt.sign(
        {
            id: user._id,
            role: user.role
        },
            process.env.JWT_SECRET,
        {
            expiresIn: '7d'
        }
        )

        res.status(200).json({
            message : "user logged-in successfully",
            token
        })

        

    } catch (error) {
        res.status(500).json({
            message : error.message
        })
    }
}

export const updateProfile = async (req, res) =>{
    try {
        
        const {collegeName, department, year} = req.body

        const user = await User.findByIdAndUpdate(req.user.id,{
            collegeName,
            department,
            year
        },
        {new : true}
    )

    if (
        !user.collegeName ||
        !user.department ||
        !user.year
    ) {
        return res.status(400).json({
            message: 'Please complete your profile first'
        })
    }

    const safeUser = await User.findById(user._id)
        .select('-password');

        res.status(200).json({
            message: 'profile updated',
            user: safeUser
        });


    } catch (error) {
        res.status(500).json({
            message: error.message
        })    
    }
}

export const getProfile = async (req, res) => {
    try {

        const user = await User.findById(
            req.user.id
        ).select('-password')

        res.status(200).json({
            user
        })

    } catch (error) {
        res.status(500).json({
            message: error.message
        })
    }
}

export const makeAdmin = async (req, res) => {
    try {
        const user = await User.findByIdAndUpdate(
            req.params.id,
            { role: "admin" },
            { new: true }
        );

        if (!user) {
            return res.status(404).json({
                message: "User not found"
            });
        }

        res.status(200).json({
            message: "User promoted to admin",
            user
        });

    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};

export const getUsers = async (req, res) => {
    try {
        const users = await User.find()
            .select('-password')

        res.status(200).json(users)

    } catch (error) {
        res.status(500).json({
            message: error.message
        })
    }
}

export const deleteUser = async (req, res) => {
    try {

        const user = await User.findByIdAndDelete(req.params.id)

        if (!user) {
            return res.status(404).json({
                message: 'User not found'
            })
        }

        res.status(200).json({
            message: 'User deleted successfully'
        })

    } catch (error) {
        res.status(500).json({
            message: error.message
        })
    }
}