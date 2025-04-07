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
const image_upload_1 = require("../Middleware/image_upload");
const express = require('express');
const Ads = express.Router();
Ads.post("/admin/add-ads", image_upload_1.upload.single("file"), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let isVerify = (0, HelperFunction_1.verifyToken)(req);
    if (isVerify === true) {
        if (req.file) {
            let { screen, file, title, mobile } = req.body;
            let filePath = req.file.filename;
            file = filePath;
            DBConfig_1.connection.query("INSERT INTO ads SET ?", { screen: screen, file: file, title: title, mobile: mobile }, (err, result) => __awaiter(void 0, void 0, void 0, function* () {
                if (err) {
                    res.json({
                        status: 500,
                        message: "Internal Srver Error",
                        data: err
                    });
                }
                else {
                    res.json({
                        status: 200,
                        message: "Success",
                        data: result
                    });
                }
            }));
        }
        else {
            res.json({
                status: 400,
                message: "No File",
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
Ads.post("/ad-status", (req, res) => {
    const isVerified = (0, HelperFunction_1.verifyToken)(req);
    if (isVerified == true) {
        let request = req.body;
        const updateQuery = 'UPDATE ads SET is_active = ? WHERE id = ?';
        const getEvent = 'Select * FROM ads WHERE id = ?';
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
                res.json({
                    status: 200,
                    message: "Status Updated",
                    data: null
                });
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
Ads.post("/delete-ad", (req, res) => {
    const isVerified = (0, HelperFunction_1.verifyToken)(req);
    if (isVerified == true) {
        let request = req.body;
        const updateQuery = 'UPDATE ads SET is_delete = ? WHERE id = ?';
        const getEvent = 'Select * FROM ads WHERE id = ?';
        DBConfig_1.connection.query(getEvent, [request.id], (err, result) => __awaiter(void 0, void 0, void 0, function* () {
            if (err) {
                res.json({
                    status: 500,
                    message: "Internal server error",
                    data: err
                });
            }
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
                    message: "User deleted",
                    data: null
                });
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
Ads.get("/admin/get-ads", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let isVerify = (0, HelperFunction_1.verifyToken)(req);
    if (isVerify === true) {
        DBConfig_1.connection.query("SELECT * FROM ads", (err, result) => __awaiter(void 0, void 0, void 0, function* () {
            if (err) {
                res.json({
                    status: 500,
                    message: "Internal Srver Error",
                    data: err
                });
            }
            else {
                res.json({
                    status: 200,
                    message: "Success",
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
Ads.post("/search_ads", (req, res) => {
    let isVerify = (0, HelperFunction_1.verifyToken)(req);
    if (isVerify === true) {
        DBConfig_1.connection.query("SELECT * FROM ads WHERE is_active = ? AND is_delete = ? And title LIKE ?", [1, 0, `%${req.body.search}%`], (err, result) => __awaiter(void 0, void 0, void 0, function* () {
            if (err) {
                res.json({
                    status: 500,
                    message: "Internal Srver Error",
                    data: err
                });
            }
            else {
                res.json({
                    status: 200,
                    message: "Success",
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
});
Ads.post("/edit-ad", image_upload_1.upload.single("file"), (req, res) => {
    const isVerified = (0, HelperFunction_1.verifyToken)(req);
    if (isVerified === true) {
        let { id, section, file } = req.body;
        let updateQuery = '';
        let body;
        if (req.file) {
            let filePath = req.file.filename;
            file = filePath;
            updateQuery = 'UPDATE ads SET file = ? , screen = ? WHERE id = ?';
            body = [file, section, id];
        }
        else {
            body = [section, id];
            updateQuery = 'UPDATE ads SET screen = ? WHERE id = ?';
        }
        DBConfig_1.connection.query(updateQuery, body, (err, result) => __awaiter(void 0, void 0, void 0, function* () {
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
                    message: "ad Updated",
                    data: null
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
});
exports.default = Ads;
//# sourceMappingURL=Ads.js.map