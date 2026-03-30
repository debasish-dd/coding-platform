import jwt from "jsonwebtoken";
import { db } from "../libs/db.js";

export const isUserLoggedIn = async (req, res, next) => {
  try {
    const token = req.cookies.jwt_token;
    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized: No token provided",
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    console.error("Error in isLogin:", error);
    return res.status(401).json({
      success: false,
      message: "Unauthorized: Invalid token, please login again",
    });
  }
};

export const isAdmin = async (req, res, next) => {

  try {
    const userId = req.user.id;
    const user = await db.user.findUnique({
      where: {
        id: userId
      },
       select : {
        role: true
       }
    })

    if (!user || user.role!=="ADMIN") {
      return res.status(403).json({
        success: false,
        message: "Forbidden: You do not have permission to perform this action",
      })
      next()
    }
  } catch (error) {
    console.error("Error in isAdmin:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error while checking admin privileges",
    });
  }

}