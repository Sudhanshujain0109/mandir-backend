"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const DBConfig_1 = require("../Config/DBConfig");
const HelperFunction_1 = require("../Middleware/HelperFunction");
const express = require('express');
const AppProfile = express.Router();
AppProfile.get("/app/get-profile", (req, res) => {
    const isVerified = (0, HelperFunction_1.verifyToken)(req);
    if (isVerified === true) {
        console.log(req.query.id, "req.query.id");
        DBConfig_1.connection.query('Select * FROM users WHERE id = ?', [req.query.id], (err, result) => {
            console.log;
            if (err) {
                res.json({
                    status: 500,
                    message: "Internal server error",
                    data: err
                });
            }
            else {
                res.json({
                    status: 200,
                    message: "User fetched successfully",
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
AppProfile.get("/app/get-family", (req, res) => {
    const isVerified = (0, HelperFunction_1.verifyToken)(req);
    if (isVerified) {
        console.log(req.query.id, "req.query.id");
        const getFamilyMembers = "SELECT * FROM family_members WHERE user_id = ?";
        DBConfig_1.connection.query(getFamilyMembers, [parseInt(req.query.id)], (err, result) => {
            if (err) {
                res.json({
                    status: 500,
                    message: "Internal server error",
                    data: err
                });
            }
            else {
                res.json({
                    status: 200,
                    message: "User fetched successfully",
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
exports.default = AppProfile;
//# sourceMappingURL=Users.js.map