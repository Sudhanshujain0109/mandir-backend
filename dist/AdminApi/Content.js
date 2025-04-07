"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const DBConfig_1 = require("../Config/DBConfig");
const HelperFunction_1 = require("../Middleware/HelperFunction");
const express = require('express');
const ContentRouter = express.Router();
ContentRouter.get("/get-content", (req, res) => {
    let isVerify = (0, HelperFunction_1.verifyToken)(req);
    if (isVerify === true) {
        DBConfig_1.connection.query("SELECT * FROM app_content", (err, result) => {
            if (err) {
                console.log(err, "erro");
                res.json({
                    status: 500,
                    message: "Internal Srver Error",
                    data: err
                });
            }
            else {
                console.log(result, "res");
                res.json({
                    status: 200,
                    message: "Success",
                    data: result
                });
            }
        });
    }
    else {
        res.json({
            status: 401,
            message: "Unauthenticated",
            data: null
        });
    }
});
ContentRouter.post("/add-content", (req, res) => {
    let isVerify = (0, HelperFunction_1.verifyToken)(req);
    const { text, id } = req.body;
    if (isVerify === true) {
        // First, check if the record exists
        DBConfig_1.connection.query("SELECT * FROM app_content WHERE id = ?", [id], (err, results) => {
            if (err) {
                console.log(err, "err");
                res.json({
                    status: 500,
                    message: "Internal Server Error",
                    data: err
                });
            }
            else {
                if (results.length > 0) {
                    // Record exists, update it
                    DBConfig_1.connection.query("UPDATE app_content SET text = ? WHERE id = ?", [text, id], (err, result) => {
                        if (err) {
                            console.log(err, "err");
                            res.json({
                                status: 500,
                                message: "Internal Server Error",
                                data: err
                            });
                        }
                        else {
                            console.log(result, "res");
                            res.json({
                                status: 200,
                                message: "Success",
                                data: result
                            });
                        }
                    });
                }
                else {
                    // Record does not exist, insert it
                    DBConfig_1.connection.query("INSERT INTO app_content (id, text) VALUES (?, ?)", [id, text], (err, result) => {
                        if (err) {
                            console.log(err, "err");
                            res.json({
                                status: 500,
                                message: "Internal Server Error",
                                data: err
                            });
                        }
                        else {
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
    }
    else {
        res.json({
            status: 401,
            message: "Unauthenticated",
            data: null
        });
    }
});
exports.default = ContentRouter;
//# sourceMappingURL=Content.js.map