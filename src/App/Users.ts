import { connection } from "../Config/DBConfig";
import { verifyToken } from "../Middleware/HelperFunction";

const express = require('express')

const AppProfile = express.Router() 

AppProfile.get("/app/get-profile",(req,res)=>{
    const isVerified = verifyToken(req);
    if(isVerified === true){
	console.log(req.query.id,"req.query.id")
        connection.query('Select * FROM users WHERE id = ?', [req.query.id], (err, result) => {
            console.log
            if (err) {
                res.json({
                    status: 500,
                    message: "Internal server error",
                    data: err
                })
            }
           else{
            res.json({
                status: 200,
                message: "User fetched successfully",
                data: result
            });
           }
        })
    }else{
        res.json({
            status: 401,
            message: "Unauthenticated",
            data: null
        })
    }
})

AppProfile.get("/app/get-family",(req,res)=>{
    const isVerified = verifyToken(req);
    if(isVerified){
console.log(req.query.id,"req.query.id")
        const getFamilyMembers = "SELECT * FROM family_members WHERE user_id = ?"

        connection.query(getFamilyMembers,[parseInt(req.query.id)],(err,result)=>{
            if (err) {
                res.json({
                    status: 500,
                    message: "Internal server error",
                    data: err
                })
            }
           else{
            res.json({
                status: 200,
                message: "User fetched successfully",
                data: result
            });
           }
        })
    }else{
        res.json({
            status: 401,
            message: "Unauthenticated",
            data: null
        })
    }

})

export default AppProfile;