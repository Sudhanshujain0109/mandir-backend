import { connection } from "../Config/DBConfig";
import { verifyToken } from "../Middleware/HelperFunction";
import { upload } from "../Middleware/image_upload";

const express = require('express')

const Jeenvani = express.Router()

Jeenvani.get("/jeenvani/list",(req,res)=>{
    try{
        const isVerified = verifyToken(req)
        if (isVerified === true) {

            const page = parseInt(req.query.page as string, 10) || 1;

            const pageSize = parseInt(req.query.pageSize as string, 10) || 10;
            const offset = (page - 1) * pageSize;
    
    
            let getEvents = "Select * FROM jeenvani LIMIT ?, ?";

            connection.query(getEvents, [offset, pageSize], async (err, result) => {
                if (err) {
                    res.json({
                        status: 500,
                        message: "Internal server error",
                        data: err
                    })
                } else {
                    const countQuery = `SELECT COUNT(*) AS total FROM jeenvani`;
    
                    connection.query(countQuery, (countErr, countResult) => {
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
                                message: "Jeenvani fetched successfully",
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
    }catch(e){
        res.json({
            status: 500,
            message: e ,
            data: null
        })
    }
})

Jeenvani.post("/jeenvani/change-status",(req,res)=>{
    try {
        const isVerified = verifyToken(req)
        if (isVerified === true) {
            let request = req.body;
            const updateQuery = 'UPDATE jeenvani SET is_active = ? WHERE id = ?'
            const getEvent = 'Select * FROM jeenvani WHERE id = ?'

            connection.query(getEvent, [request.id], async (err, result) => {
                if (err) {
                    res.json({
                        status: 500,
                        message: "Internal server error",
                        data: err
                    })
                }
                const eventData = result[0];
                connection.query(updateQuery, [!eventData.is_active, request.id], async (err, result) => {
                    if (err) {
                        res.json({
                            status: 500,
                            message: "Internal server error",
                            data: err
                        })
                    } else {
                        res.json({
                            status: 200,
                            message: "Status Updated",
                            data: null
                        })
                    }
    
    
                })
            })
        }else{
            res.json({
                status: 401,
                message: "Unauthenticated",
                data: null
            })
        }
        
    } catch (error) {
        res.json({
            status: 500,
            message: error,
            data: null
        })
    }
})

Jeenvani.post('/jeenvani/add', upload.single("file"),(req,res)=>{
    try {
        const isVerified = verifyToken(req)
        if (isVerified === true) {
            if (req.file) {
                console.log(req.file);
                let filePath = req.file.filename;
                let request = req.body;
                request.file = filePath;
                request.created_at = new Date()
                console.log(request, "request");
    
                let addEvent = "INSERT INTO jeenvani SET ?";
                connection.query(addEvent, request, async (err, result) => {
                    if (err) {
                        res.json({
                            status: 500,
                            message: "Internal server error",
                            data: err
                        })
                    } else {
                        res.json({
                            status: 200,
                            message: "jeenvani get success fully",
                            data: result[0]
                        })
                    }
    
                })
            } else {
                console.log(req.file, "req.file");
                console.log(req.files, "req.files");
                console.log(req.body, "req.body");
    
                res.json({
                    status: 404,
                    message: "No Image Uploaded",
                    data: null
                })
            }
        }else{
            res.json({
                status: 401,
                message: "Unauthenticated",
                data: null
            })
        }
    } catch (error) {
        res.json({
            status: 500,
            message: error,
            data: null
        })
    }
})

Jeenvani.post("/jeenvani/delete-status", (req, res) => {
    const isVerified = verifyToken(req)
    if (isVerified == true) {
        let request = req.body;
        const updateQuery = 'UPDATE jeenvani SET is_delete = ? WHERE id = ?'
        const getEvent = 'Select * FROM jeenvani WHERE id = ?'
        connection.query(getEvent, [request.id], async (err, result) => {
            if (err) {
                res.json({
                    status: 500,
                    message: "Internal server error",
                    data: err
                })
            } else {
                const eventData = result[0];
                connection.query(updateQuery, [!eventData.is_delete, request.id], async (err, result) => {
                    if (err) {
                        res.json({
                            status: 500,
                            message: "Internal server error",
                            data: err
                        })
                    }
                    res.json({
                        status: 200,
                        message: "Jeenvani deleted",
                        data: null
                    })

                })
            }

        })
    } else {
        res.json({
            status: 401,
            message: "Unauthenticated",
            data: null
        })
    }
})

export default Jeenvani;