import { Request, Response } from "express"
import bcrypt from "bcrypt"
import prisma from "../prisma/prisma"
import jwt from "jsonwebtoken"
export const signup = async (req: Request, res: Response) => {
  try {
    const { name, email, password } = req.body

    // check existing user
    const existingUser = await prisma.user.findUnique({
      where: {
        email,
      },
    })

    if (existingUser) {
      return res.status(400).json({
        message: "User already exists",
      })
    }

    // hash password
    const hashedPassword = await bcrypt.hash(password, 10)

    // create user
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
      },
    })

    res.status(201).json({
      message: "User created successfully",
      user,
    })
  } catch (error) {
    res.status(500).json({
      message: "Internal server error",
      error,
    })
  }
}
export const login = async (req: Request, res: Response) => {
    try {
      const { email, password } = req.body
  
      // check user exists
      const user = await prisma.user.findUnique({
        where: {
          email,
        },
      })
  
      if (!user) {
        return res.status(404).json({
          message: "User not found",
        })
      }
  
      // compare password
      const isPasswordValid = await bcrypt.compare(
        password,
        user.password
      )
  
      if (!isPasswordValid) {
        return res.status(401).json({
          message: "Invalid credentials",
        })
      }
  
      // generate jwt token
      const token = jwt.sign(
        {
          userId: user.id,
        },
        process.env.JWT_SECRET as string,
        {
          expiresIn: "7d",
        }
      )
  
      res.status(200).json({
        message: "Login successful",
        token,
        user,
      })
    } catch (error) {
      res.status(500).json({
        message: "Server error",
        error,
      })
    }
  }