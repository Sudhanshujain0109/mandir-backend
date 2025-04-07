"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const DBConfig_1 = require("../Config/DBConfig");
const HelperFunction_1 = require("../Middleware/HelperFunction");
const express = require('express');
const Occupation = express.Router();
Occupation.get("/occupation/list", (req, res) => {
    try {
        const isVerified = (0, HelperFunction_1.verifyToken)(req);
        if (isVerified === true) {
            const page = parseInt(req.query.page, 10) || 1;
            const pageSize = parseInt(req.query.pageSize, 10) || 10;
            const offset = (page - 1) * pageSize;
            let getEvents = "Select * FROM occupation LIMIT ?, ?";
            DBConfig_1.connection.query(getEvents, [offset, pageSize], (err, result) => __awaiter(void 0, void 0, void 0, function* () {
                if (err) {
                    res.json({
                        status: 500,
                        message: "Internal server error",
                        data: err
                    });
                }
                else {
                    const countQuery = `SELECT COUNT(*) AS total FROM occupation`;
                    DBConfig_1.connection.query(countQuery, (countErr, countResult) => {
                        if (countErr) {
                            res.status(500).json({
                                status: 500,
                                message: "Internal server error",
                                data: countErr
                            });
                        }
                        else {
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
            }));
        }
        else {
            res.json({
                status: 401,
                message: "Unauthenticated",
                data: null
            });
        }
    }
    catch (e) {
        res.json({
            status: 500,
            message: e,
            data: null
        });
    }
});
Occupation.post("/occupation/change-status", (req, res) => {
    try {
        const isVerified = (0, HelperFunction_1.verifyToken)(req);
        if (isVerified === true) {
            let request = req.body;
            const updateQuery = 'UPDATE occupation SET is_active = ? WHERE id = ?';
            const getEvent = 'Select * FROM occupation WHERE id = ?';
            DBConfig_1.connection.query(getEvent, [request.id], (err, result) => __awaiter(void 0, void 0, void 0, function* () {
                if (err) {
                    res.json({
                        status: 500,
                        message: "Internal server error",
                        data: err
                    });
                }
                const eventData = result[0];
                DBConfig_1.connection.query(updateQuery, [!eventData.is_active, request.id], (err, result) => __awaiter(void 0, void 0, void 0, function* () {
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
                            message: "Status Updated",
                            data: null
                        });
                    }
                }));
            }));
        }
        else {
            res.json({
                status: 401,
                message: "Unauthenticated",
                data: null
            });
        }
    }
    catch (error) {
        res.json({
            status: 500,
            message: error,
            data: null
        });
    }
});
Occupation.post('/occupation/add', (req, res) => {
    try {
        const isVerified = (0, HelperFunction_1.verifyToken)(req);
        if (isVerified === true) {
            let request = req.body;
            request.created_at = new Date();
            let addEvent = "INSERT INTO occupation SET ?";
            console.log(request, "request");
            DBConfig_1.connection.query(addEvent, request, (err, result) => __awaiter(void 0, void 0, void 0, function* () {
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
                        message: "occupation get successfully",
                        data: result[0]
                    });
                }
            }));
        }
        else {
            res.json({
                status: 401,
                message: "Unauthenticated",
                data: null
            });
        }
    }
    catch (error) {
        res.json({
            status: 500,
            message: error,
            data: null
        });
    }
});
Occupation.post("/occupation/delete-status", (req, res) => {
    const isVerified = (0, HelperFunction_1.verifyToken)(req);
    if (isVerified == true) {
        let request = req.body;
        const updateQuery = 'UPDATE occupation SET is_delete = ? WHERE id = ?';
        const getEvent = 'Select * FROM occupation WHERE id = ?';
        DBConfig_1.connection.query(getEvent, [request.id], (err, result) => __awaiter(void 0, void 0, void 0, function* () {
            if (err) {
                res.json({
                    status: 500,
                    message: "Internal server error",
                    data: err
                });
            }
            else {
                const eventData = result[0];
                DBConfig_1.connection.query(updateQuery, [!eventData.is_delete, request.id], (err, result) => __awaiter(void 0, void 0, void 0, function* () {
                    if (err) {
                        res.json({
                            status: 500,
                            message: "Internal server error",
                            data: err
                        });
                    }
                    res.json({
                        status: 200,
                        message: "Event deleted",
                        data: null
                    });
                }));
            }
        }));
    }
    else {
        res.json({
            status: 401,
            message: "Unauthenticated",
            data: null
        });
    }
});
Occupation.get("/app/get-occupation", (req, res) => {
    const query = "SELECT * FROM occupation";
    DBConfig_1.connection.query(query, (err, result) => {
        if (err) {
            console.error('Error executing query:', err);
            return res.status(500).json({
                status: 500,
                message: 'An error occurred while fetching occupations.',
                data: null
            });
        }
        res.status(200).json({
            status: 200,
            message: 'Occupations fetched successfully.',
            data: result
        });
    });
});
exports.default = Occupation;
//# sourceMappingURL=occupation.js.map