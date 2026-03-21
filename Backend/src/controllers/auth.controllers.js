import bcrypt from "bcryptjs";
import { db } from "../libs/db.js";
import { UserRole } from "@prisma/client"; 

export const registerUser = async (req, res) => {
  try {
      const {name, email, password} = req.body;
      const existingUser = await db.user.findUnique({
        where: { email}
      })
      if (existingUser) {
        return res.status(400).json({
            success: false,
            message: "user already exists"
        })
      }

      const hashedPassword = await bcrypt.hash(password , 10);
      const newUser = await db.user.create({
        data: {
            email,
            password :hashedPassword,
            name,
            role: UserRole.USER

        }
      })
      const token = jwt.sign({
        id: newUser.id,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "7d"
      }
    )

    res.cookie("jwt_token", token , {
      httpOnly: true,
      sameSite: "strict",
      secure: process.env.NODE_ENV !== "development",
      maxAge: 7 * 24* 60 * 60* 1000 //7 days
    })

    return res.status(201).json({
      success: true,
      message: "user created succesfully",
      user: {
        name: newUser.name,
        email: newUser.email,
        role: newUser.role
      }
    })

  } catch (error) {
    console.error("Error in registerUser:", error);
    return res.status(500).json({
      success: false,
      message: "internal server error, while registering user"
    })

  }
}


export const loginUser = async (req, res) => {
    
}


export const forgetPassword = async (req, res) => {
    
}


export const verifyUser = async (req, res) => {
    
}


export const getUser = async (req, res) => {
    
}