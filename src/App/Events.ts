import { connection } from "../Config/DBConfig"
import { verifyToken } from "../Middleware/HelperFunction"

const express = require('express')

const AppEvents = express.Router() 

AppEvents.get("/app/eventsList",(req,res)=>{
    const isVerified = verifyToken(req)
    console.log(req.query,"req.query");
    console.log(req.params,"req.query");

    console.log(req.headers.authorization,"req.headers");
    
    
    if(isVerified === true){
        const page = parseInt(req.query.page as string, 10) || 1;
        const pageSize = parseInt(req.query.pageSize as string, 10) || 10;
        const offset = (page - 1) * pageSize;
        let getAppEvents = "Select * FROM events WHERE is_active = ? AND is_delete = ? ORDER BY created_at DESC LIMIT ?, ?";
        connection.query(getAppEvents,[1,0,offset, pageSize], async (err, result) =>{
            if (err) {
                res.json({
                    status: 500,
                    message: "Internal server error",
                    data: err
                })
            }else{
                const countQuery = `SELECT COUNT(*) AS total FROM events WHERE is_active = ? AND is_delete = ?`;
            connection.query(countQuery,[1,0], (countErr, countResult) => {
                if (countErr) {
                    res.status(500).json({
                        status: 500,
                        message: "Internal server error",
                        data: countErr
                    });
                } else {
                    const totalUsers = countResult[0].total;
                    const totalPages = Math.ceil(totalUsers / pageSize);
                   
                    res.json({
                        status: 200,
                        message: "AppEvents fetched successfully",
                        data: {
                            events: result,
                            pagination: {
                                page: page,
                                pageSize: pageSize,
                                totalPages: totalPages,
                                totalUsers: totalUsers
                            }
                        }
                    });
                }
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



export default AppEvents
