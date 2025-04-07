import { connection } from "../Config/DBConfig";
import { verifyToken } from "../Middleware/HelperFunction";

const express = require('express')

const ContentRouter = express.Router()

ContentRouter.get("/get-content",(req,res)=>{
    let isVerify = verifyToken(req);

    if(isVerify===true){
        connection.query("SELECT * FROM app_content",(err,result)=>{
            if(err){
                console.log(err,"erro")
                res.json({
                    status: 500,
                    message: "Internal Srver Error",
                    data: err
                })
            }else{
                console.log(result,"res")
                res.json({
                    status: 200,
                    message: "Success",
                    data: result
                })
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

ContentRouter.post("/add-content", (req, res) => {
    let isVerify = verifyToken(req);
    const { text, id } = req.body;

    if (isVerify === true) {
        // First, check if the record exists
        connection.query("SELECT * FROM app_content WHERE id = ?", [id], (err, results) => {
            if (err) {
                console.log(err, "err");
                res.json({
                    status: 500,
                    message: "Internal Server Error",
                    data: err
                });
            } else {
                if (results.length > 0) {
                    // Record exists, update it
                    connection.query("UPDATE app_content SET text = ? WHERE id = ?", [text, id], (err, result) => {
                        if (err) {
                            console.log(err, "err");
                            res.json({
                                status: 500,
                                message: "Internal Server Error",
                                data: err
                            });
                        } else {
                            console.log(result, "res");
                            res.json({
                                status: 200,
                                message: "Success",
                                data: result
                            });
                        }
                    });
                } else {
                    // Record does not exist, insert it
                    connection.query("INSERT INTO app_content (id, text) VALUES (?, ?)", [id, text], (err, result) => {
                        if (err) {
                            console.log(err, "err");
                            res.json({
                                status: 500,
                                message: "Internal Server Error",
                                data: err
                            });
                        } else {
                            console.log(result, "res");
                            res.json({
                                status: 200,
                                message: "Success",
                                data: result
                            });
                        }
                    });
                }
            }
        });
    } else {
        res.json({
            status: 401,
            message: "Unauthenticated",
            data: null
        });
    }
});


export default ContentRouter;