import express, { response } from 'express';
import { connection } from '../Config/DBConfig';
const bcrypt = require('bcrypt');
const AdminAuthRoute = express.Router();
const env = require('dotenv')
env.config()
const jwt = require('jsonwebtoken');

AdminAuthRoute.post("/admin/admin-login", async (req, res) => {
    let request = req.body;
    console.log(request, "body");
    try {
        if(request){

            const findUser = 'SELECT * FROM admin WHERE email = ?'
        
            connection.query(findUser, [request.email], async (err, result) => {
                if (err) {

                    console.log(err,"error db");
                    
                    res.json({
                        status: 503,
                        message: "internal server error",
                        data: err
                    })
                }
                
                console.log(result)
                let existUser = result[0];
                if (existUser) {
        
                    let isCompared = await bcrypt.compare(request.password, existUser.password)
        
                    if (isCompared === true) {
                        let jwtSecretKey = process.env.JWT_SECRET_KEY;
                        let data = {
                            userId: existUser.id,
                            email:  existUser.email
                        }
        
                        const token = jwt.sign(data, jwtSecretKey);
                        console.log(token);
                        
                        
                        res.json({
                            status: 200,
                            message: "User Logged in",
                            data: token
                        })
                    } else {
                        res.json({
                            status: 401,
                            message: "Incorrect password",
                            data: null
                        })
                    }
                } else {
                    res.json({
                        status: 404,
                        message: "user not found",
                        data: null
                    })
                }
        
            })
        }else{
            res.json({
                status: 404,
                message: "Request is empty",
                data: null
            })
        } 
    } catch (error) {
         console.log(error)
    }
    

})

export default AdminAuthRoute;