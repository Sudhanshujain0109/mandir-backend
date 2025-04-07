import express from 'express';
import { verifyToken } from '../Middleware/HelperFunction';
import { connection } from '../Config/DBConfig';
import { upload } from '../Middleware/image_upload';
const EventController = express.Router();


EventController.get("/events/list", async (req, res) => {
    const isVerified = verifyToken(req)
    if (isVerified === true) {
        const page = parseInt(req.query.page as string, 10) || 1;
        const pageSize = parseInt(req.query.pageSize as string, 10) || 10;
        const offset = (page - 1) * pageSize;


        let getEvents = "Select * FROM events LIMIT ?, ?";
        connection.query(getEvents, [offset, pageSize], async (err, result) => {
            if (err) {
                res.json({
                    status: 500,
                    message: "Internal server error",
                    data: err
                })
            } else {
                const countQuery = `SELECT COUNT(*) AS total FROM events`;

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
                            message: "Events fetched successfully",
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
    } else {
        res.json({
            status: 401,
            message: "Unauthenticated",
            data: null
        })
    }
})

EventController.post("/events/search", async (req, res) => {
    const isVerified = verifyToken(req)
    if (isVerified === true) {
        const { query } = req.body
        console.log(query, "query");

        let getEvents = "Select * FROM events WHERE name LIKE ?";
        connection.query(getEvents, [`%${query}%`], async (err, result) => {
            if (err) {
                res.json({
                    status: 500,
                    message: "Internal server error",
                    data: err
                })
            } else {
                console.log(err, "err");

                res.json({
                    status: 200,
                    message: "Events fetched successfully",
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

EventController.post("/events/details", async (req, res) => {
    const isVerified = verifyToken(req)
    if (isVerified === true) {
        const request = req.body.id;
        let getEvents = "Select * FROM events WHERE id = ?";
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
                message: "events get success fully",
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



EventController.post("/events/add", upload.single("file"), async (req, res) => {
    const isVerified = verifyToken(req)
    if (isVerified === true) {
        console.log(req.headers);

        if (req.file) {
            console.log(req.file);
            let filePath = req.file.filename;
            let request = req.body;
            request.image = filePath;
            request.created_at = new Date()
            console.log(request, "request");



            let addEvent = "INSERT INTO events SET ?";
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
                        message: "events get success fully",
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
    } else {
        res.json({
            status: 401,
            message: "Unauthenticated",
            data: null
        })
    }
})

EventController.post("/events/edit", upload.single("file"), async (req, res) => {
    const isVerified = verifyToken(req)
    if (isVerified === true) {
        console.log(req.headers);
        let request = req.body;
        let { id, name, start_date, end_date, description, type, address, image } = request;
        let addEvent;
        let values;
        if (req.file) {
            let filePath = req.file.filename;

           image = filePath;
            addEvent = "UPDATE events SET name = ?, start_date = ?, end_date = ?, description = ?,type = ?,address = ?,image = ? WHERE id = ?";
            values = [name, start_date, end_date, description, type, address, image, id]
        } else {
            addEvent = "UPDATE events SET name = ?, start_date = ?, end_date = ?, description = ?,type = ?,address = ? WHERE id = ?";
            values = [name, start_date, end_date, description, type, address, id]
        }
        connection.query(addEvent, values, async (err, result) => {
            if (err) {
                res.json({
                    status: 500,
                    message: "Internal server error",
                    data: err
                })
            } else {
                res.json({
                    status: 200,
                    message: "events Updated success fully",
                    data: result
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

EventController.post("/events/change-status", (req, res) => {
    const isVerified = verifyToken(req)
    if (isVerified == true) {
        let request = req.body;
        const updateQuery = 'UPDATE events SET is_active = ? WHERE id = ?'
        const getEvent = 'Select * FROM events WHERE id = ?'
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
    } else {
        res.json({
            status: 401,
            message: "Unauthenticated",
            data: null
        })
    }
})

EventController.post("/events/delete-status", (req, res) => {
    const isVerified = verifyToken(req)
    if (isVerified == true) {
        let request = req.body;
        const updateQuery = 'UPDATE events SET is_delete = ? WHERE id = ?'
        const getEvent = 'Select * FROM events WHERE id = ?'
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
                        message: "Event deleted",
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
export default EventController;