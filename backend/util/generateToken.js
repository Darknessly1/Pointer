// import jwt from "jsonwebtoken";

// const generateTokenAndSetCookies = (userId, res) => {
//     const token = jwt.sign({userId}, process.env.JWT_SECRET, {
//         expiresIn: "15d",
//     }); 

//     res.cookie("jwt", token, {
//         maxAge: 15 * 24 * 60 * 60 * 1000,
//         httpOnly: true,
//         sameSite: "strict",
//         secure: process.env.NODE_ENV !== "development",
//     })
// }; 


// export default generateTokenAndSetCookies;


import jwt from 'jsonwebtoken';

const generateToken = (userId) => {
    return jwt.sign({ id: userId }, process.env.JWT_SECRET, { expiresIn: '1h' });
};

export default generateToken;