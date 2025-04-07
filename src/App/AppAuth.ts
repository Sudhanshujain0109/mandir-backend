import { connection } from "../Config/DBConfig"
import { generateOTP, verifyToken } from "../Middleware/HelperFunction"
import { upload } from "../Middleware/image_upload";
const jwt = require('jsonwebtoken');

const express = require('express')

const AppAuth = express.Router()

const env = require('dotenv')
env.config()

AppAuth.post('/app/send-otp', async (req, res) => {
    console.log(req,"skgjslgjsfgjsfjgj")
    const { phone } = req.body;

    console.log(req.body);
    

    const countQuery = `SELECT * FROM users WHERE phone = ?`

    connection.query(countQuery, [phone], (err, result) => {
        if (err) {
            res.json({
                status: 500,
                message: "Internal Server Error",
                data: err
            })
        }
        console.log(result,"result");
        
        let existUser = result[0];
        if (existUser) {
            if (existUser.is_active == 1) {
                if (existUser.is_delete == 0) {
                    const otp = 1234 //generateOTP(4);
                    const updateUser = `UPDATE users SET otp = ${otp} WHERE phone = ?`
                    connection.query(updateUser, [phone], (err, result) => {
                        if (err) {
                            console.log("err",err);
                            
                            res.json({
                                status: 500,
                                message: "Internal Server Error",
                                data: err
                            })
                        } else {
                            console.log(otp, "otp")
                            res.json({
                                status: 200,
                                message: "Otp Sent Successfully",
                                otp: otp,
                            })
                        }
                        
                    })
                }else{
                    res.json({
                        status: 404,
                        message: "Account Deleted",
                        data: null
                    })
                }
            }else{
                res.json({
                    status: 404,
                    message: "Account is deactivated,contact admin",
                    data: null
                })
            }
        } else {
            res.json({
                status: 404,
                message: "No User Found",
                data: null
            })
        }


    })

})


AppAuth.post("/app/verify_otp", async (req, res) => {
    const { phone, otp } = req.body;

    const countQuery = `SELECT * FROM users WHERE phone = ?`
    connection.query(countQuery, [phone], (err, result) => {
        if (err) {
            res.json({
                status: 500,
                message: "Internal Server Error",
                data: err
            })
        }
        let existUser = result[0];
        if (existUser.otp == otp) {
            let jwtSecretKey = process.env.JWT_SECRET_KEY;
            let data = {
                userId: existUser.id,
                email: existUser.phone
            }

            const token = jwt.sign(data, jwtSecretKey);
            
            res.json({
                status: 200,
                message: "OTP verified successfully",
                data: existUser,
                token:token
            })
        } else {
            res.json({
                status: 404,
                message: "Invalid OTP",
                data: null
            })
        }
    })

})


AppAuth.post("/app/complete-profile", (req, res) => {
    console.log("In tersrtssfsfgsfg")
    const isVerified = verifyToken(req)
    if (isVerified === true) {
        console.log(req.file,"req.file");
        console.log(req.body,"req.body");
        
        
        let { id, full_name, email, gender, occupation, age, image, gotra, address,married,anni } = req.body;
        console.log(married, "married");

        const updateQuery = 'UPDATE users SET full_name = ?,email = ?,gender = ?,occupation = ?,age = ?,image = ?,gotra = ?,address = ?,isProfileCompleted = ?,married = ?,anni = ? WHERE id = ?'
        connection.query(updateQuery, [full_name, email, gender, occupation, age, image, gotra, address,1,married,anni, id], async (err, result) => {
            if (err) {
                res.json({
                    status: 500,
                    message: "Internal server error",
                    data: err
                })
            } else {
                connection.query('SELECT * FROM users WHERE id = ?',[id],(err,result)=>{
                    if (err) {
                        res.json({
                            status: 500,
                            message: "Internal server error",
                            data: err
                        })
                    }else{
                        let existUser = result[0];
                        res.json({
                            status: 200,
                            message: "User Data",
                            data: existUser
                        })
                    }
                })

                
            }
        })
    } else {
        res.json({
            status: 401,
            message: "UnAuthenticated",
            data: null
        })
    }


})




export default AppAuth