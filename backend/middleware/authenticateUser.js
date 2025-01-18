import jwt from "jsonwebtoken";

export const authenticateUser  = (req, res, next) => {
    const token = req.headers.authorization?.split(" ")[1]; 

    if (!token) {
        return res.status(401).json({ message: "Authentication token is missing" });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        console.log("Decoded user:", decoded);
        req.user = { id: decoded.id }; 
        next();
    } catch (error) {
        console.error("Token verification error:", error.message); 
        res.status(401).json({ message: "Invalid token" });
    }
};