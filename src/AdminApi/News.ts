const express = require('express')
import { verifyToken } from '../Middleware/HelperFunction';
import { connection } from '../Config/DBConfig';
import { upload } from '../Middleware/image_upload';
const NewsController = express.Router()

NewsController.get("/news/list", async (req, res) => {
    const isVerified = verifyToken(req)
    if (isVerified === true) {
        const page = parseInt(req.query.page as string, 10) || 1;
        const pageSize = parseInt(req.query.pageSize as string, 10) || 10;
        const offset = (page - 1) * pageSize;

        let getEvents = "Select * FROM news LIMIT ?, ?";
        connection.query(getEvents, [offset, pageSize], async (err, result) => {
            if (err) {
                res.json({
                    status: 500,
                    message: "Internal server error",
                    data: err
                })
            }

            const countQuery = `SELECT COUNT(*) AS total FROM news`;

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
                        message: "News fetched successfully",
                        data: {
                            news: result,
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
        })
    } else {
        res.json({
            status: 401,
            message: "Unauthenticated",
            data: null
        })
    }
})

NewsController.post("/news/search", async (req, res) => {
    const isVerified = verifyToken(req)
    if (isVerified === true) {
        const { query } = req.body
        let getEvents = "Select * FROM news WHERE title LIKE ?";
        connection.query(getEvents, [`%${query}%`], async (err, result) => {
            if (err) {
                res.json({
                    status: 500,
                    message: "Internal server error",
                    data: err
                })
            }else{
                res.json({
                    status: 200,
                    message: "News fetched successfully",
                    data: result,
    
    
                });
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

NewsController.post("/news/details", async (req, res) => {
    const isVerified = verifyToken(req)
    if (isVerified === true) {
        const request = req.query.id;

        let getEvents = "Select * FROM news WHERE id = ?";
        connection.query(getEvents, [request], async (err, result) => {
            if (err) {
                res.json({
                    status: 500,
                    message: "Internal server error",
                    data: err
                })
            }
            res.json({
                status: 200,
                message: "news get successfully",
                data: result
            })
        })
    } else {
        res.json({
            status: 401,
            message: "Unauthenticated",
            data: null
        })
    }
})


NewsController.post("/news/add", upload.single("file"), async (req, res) => {
    const isVerified = verifyToken(req)
    if (isVerified === true) {
       if(req.file){
        let request = req.body;
        let filePath = req.file.filename;
        request.image = filePath;
        request.created_at = new Date().toUTCString()
        let addEvent = "INSERT INTO news SET ?";
        connection.query(addEvent, request, async (err, result) => {
            if (err) {
                res.json({
                    status: 500,
                    message: "Internal server error",
                    data: err
                })
            }else{
                res.json({
                    status: 200,
                    message: "news add successfully",
                    data: {}
                })
            }
            
        })
       }else{
        res.json({
            status: 404,
            message: "No file uploaded",
            data: null
        })
       }
    } else {
        res.json({
            status: 401,
            message: "Unauthenticated",
            data: null
        })
    }
})

NewsController.post("/news/change-status", (req, res) => {
    const isVerified = verifyToken(req)
    if (isVerified == true) {
        let request = req.body;
        const updateQuery = 'UPDATE news SET is_active = ? WHERE id = ?'
        const getEvent = 'Select * FROM news WHERE id = ?'
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
                }else{
                    res.json({
                        status: 200,
                        message: "Status Updated",
                        data: null
                    })
                }
               

            })
        })
    } else {
        res.json({
            status: 401,
            message: "Unauthenticated",
            data: null
        })
    }
})

NewsController.post("/news/delete-status", (req, res) => {
    const isVerified = verifyToken(req)
    if (isVerified == true) {
        let request = req.body;
        const updateQuery = 'UPDATE news SET is_delete = ? WHERE id = ?'
        const getEvent = 'Select * FROM news WHERE id = ?'
        connection.query(getEvent, [request.id], async (err, result) => {
            if (err) {
                res.json({
                    status: 500,
                    message: "Internal server error",
                    data: err
                })
            }else{
                const eventData = result[0];
            connection.query(updateQuery, [!eventData.is_delete, request.id], async (err, result) => {
                if (err) {
                    res.json({
                        status: 500,
                        message: "Internal server error",
                        data: err
                    })
                }else{
                    res.json({
                        status: 200,
                        message: "Event deleted",
                        data: null
                    })
                }
                

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

NewsController.post("/news/edit", upload.single("file"), async (req, res) => {
    const isVerified = verifyToken(req)
    if (isVerified === true) {
        console.log(req.headers);
        let request = req.body;
        let addEvent;
        let values;
        let { id, title, content, image } = request;

        if (req.file) {
            console.log(req.file);
            let filePath = req.file.filename;
           
            image = filePath;
            addEvent = "UPDATE news SET title = ?, content = ?, image = ? WHERE id = ?";
            values = [title, content, image, id]
        }else{
            addEvent = "UPDATE news SET title = ?, content = ? WHERE id = ?";
            values = [title, content, id]
        }
            connection.query(addEvent, values, async (err, result) => {
                if (err) {
                    res.json({
                        status: 500,
                        message: "Internal server error",
                        data: err
                    })
                }else{
                    res.json({
                        status: 200,
                        message: "news Updated success fully",
                        data: result[0]
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

export default NewsController