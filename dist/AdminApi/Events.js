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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const HelperFunction_1 = require("../Middleware/HelperFunction");
const DBConfig_1 = require("../Config/DBConfig");
const image_upload_1 = require("../Middleware/image_upload");
const EventController = express_1.default.Router();
EventController.get("/events/list", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const isVerified = (0, HelperFunction_1.verifyToken)(req);
    if (isVerified === true) {
        const page = parseInt(req.query.page, 10) || 1;
        const pageSize = parseInt(req.query.pageSize, 10) || 10;
        const offset = (page - 1) * pageSize;
        let getEvents = "Select * FROM events LIMIT ?, ?";
        DBConfig_1.connection.query(getEvents, [offset, pageSize], (err, result) => __awaiter(void 0, void 0, void 0, function* () {
            if (err) {
                res.json({
                    status: 500,
                    message: "Internal server error",
                    data: err
                });
            }
            else {
                const countQuery = `SELECT COUNT(*) AS total FROM events`;
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
}));
EventController.post("/events/search", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const isVerified = (0, HelperFunction_1.verifyToken)(req);
    if (isVerified === true) {
        const { query } = req.body;
        console.log(query, "query");
        let getEvents = "Select * FROM events WHERE name LIKE ?";
        DBConfig_1.connection.query(getEvents, [`%${query}%`], (err, result) => __awaiter(void 0, void 0, void 0, function* () {
            if (err) {
                res.json({
                    status: 500,
                    message: "Internal server error",
                    data: err
                });
            }
            else {
                console.log(err, "err");
                res.json({
                    status: 200,
                    message: "Events fetched successfully",
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
EventController.post("/events/details", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const isVerified = (0, HelperFunction_1.verifyToken)(req);
    if (isVerified === true) {
        const request = req.body.id;
        let getEvents = "Select * FROM events WHERE id = ?";
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
                message: "events get success fully",
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
EventController.post("/events/add", image_upload_1.upload.single("file"), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const isVerified = (0, HelperFunction_1.verifyToken)(req);
    if (isVerified === true) {
        console.log(req.headers);
        if (req.file) {
            console.log(req.file);
            let filePath = req.file.filename;
            let request = req.body;
            request.image = filePath;
            request.created_at = new Date();
            console.log(request, "request");
            let addEvent = "INSERT INTO events SET ?";
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
                        message: "events get success fully",
                        data: result[0]
                    });
                }
            }));
        }
        else {
            console.log(req.file, "req.file");
            console.log(req.files, "req.files");
            console.log(req.body, "req.body");
            res.json({
                status: 404,
                message: "No Image Uploaded",
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
EventController.post("/events/edit", image_upload_1.upload.single("file"), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const isVerified = (0, HelperFunction_1.verifyToken)(req);
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
            values = [name, start_date, end_date, description, type, address, image, id];
        }
        else {
            addEvent = "UPDATE events SET name = ?, start_date = ?, end_date = ?, description = ?,type = ?,address = ? WHERE id = ?";
            values = [name, start_date, end_date, description, type, address, id];
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
                    message: "events Updated success fully",
                    data: result
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
EventController.post("/events/change-status", (req, res) => {
    const isVerified = (0, HelperFunction_1.verifyToken)(req);
    if (isVerified == true) {
        let request = req.body;
        const updateQuery = 'UPDATE events SET is_active = ? WHERE id = ?';
        const getEvent = 'Select * FROM events WHERE id = ?';
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
EventController.post("/events/delete-status", (req, res) => {
    const isVerified = (0, HelperFunction_1.verifyToken)(req);
    if (isVerified == true) {
        let request = req.body;
        const updateQuery = 'UPDATE events SET is_delete = ? WHERE id = ?';
        const getEvent = 'Select * FROM events WHERE id = ?';
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
exports.default = EventController;
//# sourceMappingURL=Events.js.map