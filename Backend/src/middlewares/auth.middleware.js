import jwt from "jsonwebtoken";

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