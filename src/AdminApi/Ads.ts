import { connection } from "../Config/DBConfig";
import { verifyToken } from "../Middleware/HelperFunction";
import { upload } from "../Middleware/image_upload";

const express = require('express')

const Ads = express.Router()

Ads.post("/admin/add-ads", upload.single("file"), async (req, res) => {
    let isVerify = verifyToken(req);
    if (isVerify === true) {
        if (req.file) {
            let { screen, file , title , mobile } = req.body;
            let filePath = req.file.filename;

            file = filePath;

            connection.query("INSERT INTO ads SET ?", { screen: screen, file: file , title:title , mobile:mobile }, async (err, result) => {
                if (err) {
                    res.json({
                        status: 500,
                        message: "Internal Srver Error",
                        data: err
                    })
                } else {
                    res.json({
                        status: 200,
                        message: "Success",
                        data: result
                    })
                }
            })
        } else {
            res.json({
                status: 400,
                message: "No File",
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

Ads.post("/ad-status", (req, res) => {
    const isVerified = verifyToken(req)
    if (isVerified == true) {
        let request = req.body;
        const updateQuery = 'UPDATE ads SET is_active = ? WHERE id = ?'
        const getEvent = 'Select * FROM ads WHERE id = ?'
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

Ads.post("/delete-ad", (req, res) => {
    const isVerified = verifyToken(req)
    if (isVerified == true) {
        let request = req.body;
        const updateQuery = 'UPDATE ads SET is_delete = ? WHERE id = ?'
        const getEvent = 'Select * FROM ads WHERE id = ?'
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

Ads.get("/admin/get-ads", async (req, res) => {

    let isVerify = verifyToken(req);

    if (isVerify === true) {
        connection.query("SELECT * FROM ads", async (err, result) => {
            if (err) {
                res.json({
                    status: 500,
                    message: "Internal Srver Error",
                    data: err
                })
            } else {
                res.json({
                    status: 200,
                    message: "Success",
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

Ads.post("/search_ads",(req,res)=>{
    let isVerify = verifyToken(req);
    if(isVerify === true) {
        connection.query("SELECT * FROM ads WHERE is_active = ? AND is_delete = ? And title LIKE ?",[1,0,`%${req.body.search}%`], async (err, result) => {
            if (err) {
                res.json({
                    status: 500,
                    message: "Internal Srver Error",
                    data: err
                })
            } else {
                res.json({
                    status: 200,
                    message: "Success",
                    data: result
                })
            }
        })
    }else {
        res.json({
            status: 401,
            message: "Unauthenticated",
            data: null
        })
    }
})

Ads.post("/edit-ad", upload.single("file"), (req, res) => {
    const isVerified = verifyToken(req)
    if (isVerified === true) {
        let { id, section ,file } = req.body;
        let updateQuery = ''
        let body ;
        if (req.file) {
            let filePath = req.file.filename;
            file = filePath;
            updateQuery = 'UPDATE ads SET file = ? , screen = ? WHERE id = ?'
            body = [file,section,id]

        } else {
            body = [section,id]
            updateQuery = 'UPDATE ads SET screen = ? WHERE id = ?'

        }
        connection.query(updateQuery, body, async (err, result) => {
            if (err) {
                res.json({
                    status: 500,
                    message: "Internal server error",
                    data: err
                })
            }else{
                res.json({
                    status: 200,
                    message: "ad Updated",
                    data: null
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

export default Ads;