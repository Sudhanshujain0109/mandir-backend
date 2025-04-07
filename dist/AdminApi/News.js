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
const express = require('express');
const HelperFunction_1 = require("../Middleware/HelperFunction");
const DBConfig_1 = require("../Config/DBConfig");
const image_upload_1 = require("../Middleware/image_upload");
const NewsController = express.Router();
NewsController.get("/news/list", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const isVerified = (0, HelperFunction_1.verifyToken)(req);
    if (isVerified === true) {
        const page = parseInt(req.query.page, 10) || 1;
        const pageSize = parseInt(req.query.pageSize, 10) || 10;
        const offset = (page - 1) * pageSize;
        let getEvents = "Select * FROM news LIMIT ?, ?";
        DBConfig_1.connection.query(getEvents, [offset, pageSize], (err, result) => __awaiter(void 0, void 0, void 0, function* () {
            if (err) {
                res.json({
                    status: 500,
                    message: "Internal server error",
                    data: err
                });
            }
            const countQuery = `SELECT COUNT(*) AS total FROM news`;
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
        }));
    }
    else {
        res.json({
            status: 401,
            message: "Unauthenticated",
            data: null
        });
    }
}));
NewsController.post("/news/search", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const isVerified = (0, HelperFunction_1.verifyToken)(req);
    if (isVerified === true) {
        const { query } = req.body;
        let getEvents = "Select * FROM news WHERE title LIKE ?";
        DBConfig_1.connection.query(getEvents, [`%${query}%`], (err, result) => __awaiter(void 0, void 0, void 0, function* () {
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
                    message: "News fetched successfully",
                    data: result,
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
}));
NewsController.post("/news/details", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const isVerified = (0, HelperFunction_1.verifyToken)(req);
    if (isVerified === true) {
        const request = req.query.id;
        let getEvents = "Select * FROM news WHERE id = ?";
        DBConfig_1.connection.query(getEvents, [request], (err, result) => __awaiter(void 0, void 0, void 0, function* () {
            if (err) {
                res.json({
                    status: 500,
                    message: "Internal server error",
                    data: err
                });
            }
            res.json({
                status: 200,
                message: "news get successfully",
                data: result
            });
        }));
    }
    else {
        res.json({
            status: 401,
            message: "Unauthenticated",
            data: null
        });
    }
}));
NewsController.post("/news/add", image_upload_1.upload.single("file"), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const isVerified = (0, HelperFunction_1.verifyToken)(req);
    if (isVerified === true) {
        if (req.file) {
            let request = req.body;
            let filePath = req.file.filename;
            request.image = filePath;
            request.created_at = new Date().toUTCString();
            let addEvent = "INSERT INTO news SET ?";
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
                        message: "news add successfully",
                        data: {}
                    });
                }
            }));
        }
        else {
            res.json({
                status: 404,
                message: "No file uploaded",
                data: null
            });
        }
    }
    else {
        res.json({
            status: 401,
            message: "Unauthenticated",
            data: null
        });
    }
}));
NewsController.post("/news/change-status", (req, res) => {
    const isVerified = (0, HelperFunction_1.verifyToken)(req);
    if (isVerified == true) {
        let request = req.body;
        const updateQuery = 'UPDATE news SET is_active = ? WHERE id = ?';
        const getEvent = 'Select * FROM news WHERE id = ?';
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
});
NewsController.post("/news/delete-status", (req, res) => {
    const isVerified = (0, HelperFunction_1.verifyToken)(req);
    if (isVerified == true) {
        let request = req.body;
        const updateQuery = 'UPDATE news SET is_delete = ? WHERE id = ?';
        const getEvent = 'Select * FROM news WHERE id = ?';
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
                    else {
                        res.json({
                            status: 200,
                            message: "Event deleted",
                            data: null
                        });
                    }
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
NewsController.post("/news/edit", image_upload_1.upload.single("file"), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const isVerified = (0, HelperFunction_1.verifyToken)(req);
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
            values = [title, content, image, id];
        }
        else {
            addEvent = "UPDATE news SET title = ?, content = ? WHERE id = ?";
            values = [title, content, id];
        }
        DBConfig_1.connection.query(addEvent, values, (err, result) => __awaiter(void 0, void 0, void 0, function* () {
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
                    message: "news Updated success fully",
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
}));
exports.default = NewsController;
//# sourceMappingURL=News.js.map