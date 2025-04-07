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
const AppEvents = express.Router();
AppEvents.get("/app/eventsList", (req, res) => {
    const isVerified = (0, HelperFunction_1.verifyToken)(req);
    console.log(req.query, "req.query");
    console.log(req.params, "req.query");
    console.log(req.headers.authorization, "req.headers");
    if (isVerified === true) {
        const page = parseInt(req.query.page, 10) || 1;
        const pageSize = parseInt(req.query.pageSize, 10) || 10;
        const offset = (page - 1) * pageSize;
        let getAppEvents = "Select * FROM events WHERE is_active = ? AND is_delete = ? ORDER BY created_at DESC LIMIT ?, ?";
        DBConfig_1.connection.query(getAppEvents, [1, 0, offset, pageSize], (err, result) => __awaiter(void 0, void 0, void 0, function* () {
            if (err) {
                res.json({
                    status: 500,
                    message: "Internal server error",
                    data: err
                });
            }
            else {
                const countQuery = `SELECT COUNT(*) AS total FROM events WHERE is_active = ? AND is_delete = ?`;
                DBConfig_1.connection.query(countQuery, [1, 0], (countErr, countResult) => {
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
                            message: "AppEvents fetched successfully",
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
});
exports.default = AppEvents;
//# sourceMappingURL=Events.js.map