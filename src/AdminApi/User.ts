import express, { response } from 'express';
import { connection } from '../Config/DBConfig';
import { generateRendomString, verifyToken } from '../Middleware/HelperFunction';
import { sendMail } from '../Middleware/smtp_mail';
const XLSX = require('xlsx');
const multer = require('multer');
const UserController = express.Router();
const storage = multer.memoryStorage(); // Store files in memory for parsing.
const upload = multer({ storage: storage }).single('file'); // 'file' should match the 'name' attribute
const Joi = require('joi');

/**
* @api {get} /user Request User information
* @apiName GetUser
* @apiGroup User
*/
UserController.get("/get-users", (req, res) => {

    const isVerified = verifyToken(req)
    
    console.log(isVerified);

    if (isVerified === true) {

        const page = parseInt(req.query.page as string, 10) || 1;
        const pageSize = parseInt(req.query.pageSize as string, 10) || 10;
        const offset = (page - 1) * pageSize;



        const query = `SELECT id,full_name,email,phone,gotra,address,occupation,age,gender,postal_address,is_active,is_delete,created_at FROM users  LIMIT ?, ?`;
            console.log(page,"page");
            

        connection.query(query,[offset, pageSize], (err, result) => {
            if (err) {
                res.json({
                    status: 500,
                    message: "Internal server error",
                    data: err
                })
            }
            const countQuery = `SELECT COUNT(*) AS total FROM users`;
            
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
                    console.log({
                        status: 200,
                        message: "Users fetched successfully",
                        data: {
                            users: result,
                            pagination: {
                                page: page,
                                pageSize: pageSize,
                                totalPages: totalPages,
                                totalUsers: totalUsers
                            }
                        }
                    },"response");
                    
                    res.json({
                        status: 200,
                        message: "Users fetched successfully",
                        data: {
                            users: result,
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
                
            // res.json({
            //     status: 200,
            //     message: "Users get successully",
            //     data: result
            // })
        })
    } else {
        res.json({
            status: 401,
            message: "Unauthenticated",
            data: null
        })
    }

})




UserController.post('/get-file', upload, (req, res) => {
    if (!req.file) {
        return res.json({
            status: 400,
            message: 'No file uploaded.'
        });
    }
    if (req.file.mimetype !== 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet') {
        return res.json({
            status: 400,
            message: 'Uploaded file is not an Excel file.'
        });
    }
    const isVerified = verifyToken(req)
    // Parse the uploaded XLS file
    if (isVerified === true) {
        const workbook = XLSX.read(req.file.buffer);
        const sheetName = workbook.SheetNames[0];
        const sheetData = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName]);

        // Filter out empty rows and rows where full_name is empty
        const filteredData = sheetData.filter(row => row.full_name && Object.keys(row).length > 0);

        let created_at = new Date().toUTCString();
        let password = generateRendomString();

        Promise.all(
            filteredData.map((row) => {
                console.log(row, "row");

                const { full_name, phone, email, address, gotra, occupation, age, gender } = row;

                // Check if phone or email already exists
                const checkQuery = 'SELECT * FROM users WHERE phone = ? OR email = ?';
                return new Promise((resolve, reject) => {
                    connection.query(checkQuery, [phone, email], (checkErr, results) => {
                        if (checkErr) {
                            console.error('Error checking existing records:', checkErr);
                            reject(checkErr);
                        } else if (results.length === 0) {
                            // No existing records with the same phone or email, insert the data

                            const insertQuery = 'INSERT INTO users (full_name, phone, email, address, gotra, occupation, age, gender, created_at, password) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)';
                            const values = [full_name, phone, email, address, gotra, occupation, age, gender, created_at, password];

                            connection.query(insertQuery, values, (insertErr) => {
                                if (insertErr) {
                                    console.error('Error inserting data:', insertErr);
                                    reject(insertErr);
                                } else {
                                    resolve('Data inserted successfully.');
                                }
                            });

                        } else {
                            console.log('Record with phone or email already exists:', phone, email);
                            resolve('Record with phone or email already exists.');
                        }
                    });
                });
            })
        )
        .then((results) => {
            res.json({
                status: 200,
                message: 'File uploaded and data processed.', data: null
            });
        })
        .catch((error) => {
            res.json({ status: 500, message: 'An error occurred while processing the data.', data: error });
        });
    } else {
        res.json({
            status: 401,
            message: "Unauthenticated",
            data: null
        });
    }
});


UserController.post("/add-user", (req, res) => {
    const isVerified = verifyToken(req)
    if (isVerified === true) {
        let request = req.body;
        console.log(request, "body");

        if (request) {
            const getUser = "SELECT * FROM users WHERE phone = ? OR email = ?";

            connection.query(getUser, [request.phone, request.email], async (err, result) => {
                if (err) {
                    res.json({
                        status: 503,
                        message: "internal server error",
                        data: err
                    })
                }
                let existUser = result[0];
                if (existUser) {
                    res.json({
                        status: 404,
                        message: "phone or email already exist",
                        data: err
                    })

                } else {
                    const setUser = "INSERT INTO users SET ?";
                    request.created_at = new Date().toUTCString()
                    request.password = generateRendomString(),

                        console.log(request);



                    connection.query(setUser, request, async (err, result) => {
                        console.log(err, "error is");
                        if (err) res.json({
                            status: 500,
                            message: "Internal server error",
                            data: err
                        })

                        const query = "SELECT * FROM users WHERE phone = ?";
                        connection.query(query, [request.phone], async (err, result) => {
                            if (err) {
                                console.log(err);

                                res.json({
                                    status: 500,
                                    message: "Internal server error",
                                    data: err
                                })
                            }
                            sendMail(result[0], "Welcome Mail");

                            res.json({
                                status: 201,
                                message: "user created",
                                data: result[0].id
                            })
                        });

                    })

                }

            })
        } else {
            res.json({
                status: 404,
                message: "request is empty",
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

UserController.post("/edit-user", (req, res) => {
    const isVerified = verifyToken(req)
    if (isVerified === true) {
        const { id, full_name, phone, email, gender, occupation, age, gotra, address, } = req.body;
        const updateQuery = 'UPDATE users SET full_name = ?,phone = ?,email = ?,gender = ?,occupation = ?,age = ?,gotra = ?,address = ? WHERE id = ?'
        connection.query(updateQuery, [full_name, phone, email, gender, occupation, age, gotra, address, id], async (err, result) => {
            if (err) {
                res.json({
                    status: 500,
                    message: "Internal server error",
                    data: err
                })
            }
            res.json({
                status: 200,
                message: "User Updated",
                data: null
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

UserController.post("/user-status", (req, res) => {
    const isVerified = verifyToken(req)
    if (isVerified == true) {
        let request = req.body;
        const updateQuery = 'UPDATE users SET is_active = ? WHERE id = ?'
        const getEvent = 'Select * FROM users WHERE id = ?'
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
                }
                res.json({
                    status: 200,
                    message: "Status Updated",
                    data: null
                })

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

UserController.post("/delete-user", (req, res) => {
    const isVerified = verifyToken(req)
    if (isVerified == true) {
        let request = req.body;
        const updateQuery = 'UPDATE users SET is_delete = ? WHERE id = ?'
        const getEvent = 'Select * FROM users WHERE id = ?'
        connection.query(getEvent, [request.id], async (err, result) => {
            if (err) {
                res.json({
                    status: 500,
                    message: "Internal server error",
                    data: err
                })
            }
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
                    message: "User deleted",
                    data: null
                })

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

export default UserController;