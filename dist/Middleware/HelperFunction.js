"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateRendomString = exports.verifyToken = exports.generateOTP = void 0;
const env = require('dotenv');
env.config();
const jwt = require('jsonwebtoken');
function generateOTP(length) {
    var digits = '0123456789';
    let OTP = '';
    for (let i = 0; i < length; i++) {
        OTP += digits[Math.floor(Math.random() * 10)];
    }
    return OTP;
}
exports.generateOTP = generateOTP;
const verifyToken = (req) => {
    let tokenHeaderKey = process.env.TOKEN_HEADER_KEY;
    let jwtSecretKey = process.env.JWT_SECRET_KEY;
    try {
        console.log(req.headers.authorization.slice(7));
        const verified = jwt.verify(req.headers.authorization.slice(7), jwtSecretKey);
        if (verified) {
            return true;
        }
        else {
            // Access Denied
            return false;
        }
    }
    catch (error) {
        // Access Denied
        return false;
    }
};
exports.verifyToken = verifyToken;
const generateRendomString = () => {
    const charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+";
    let password = "";
    for (let i = 0; i < 10; i++) {
        const randomIndex = Math.floor(Math.random() * charset.length);
        password += charset[randomIndex];
    }
    return password;
};
exports.generateRendomString = generateRendomString;
//# sourceMappingURL=HelperFunction.js.map