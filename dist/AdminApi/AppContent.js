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
const AppContentRouter = express.Router();
AppContentRouter.get("/app/get-content", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const isVerified = (0, HelperFunction_1.verifyToken)(req);
    if (isVerified === true) {
        DBConfig_1.connection.query("SELECT * FROM content", (err, result) => {
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
}));
AppContentRouter.post("/app/add-content", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const isVerified = (0, HelperFunction_1.verifyToken)(req);
    if (isVerified === true) {
        const { id, section, content } = req.body;
        console.log(id, section, content, "sdata");
        // First, check if the record exists
        DBConfig_1.connection.query("SELECT * FROM content WHERE section = ?", [section], (err, results) => {
            if (err) {
                res.json({
                    status: 500,
                    message: "Internal server error",
                    data: err
                });
            }
            else {
                if (results.length > 0) {
                    // Record exists, update it
                    DBConfig_1.connection.query("UPDATE content SET content = ? WHERE section = ? AND id = ?", [content, section, id], (err, result) => {
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
                                message: "Success",
                                data: null
                            });
                        }
                    });
                }
                else {
                    // Record does not exist, insert it
                    DBConfig_1.connection.query("INSERT INTO content (section, content) VALUES (?, ?)", [section, content], (err, result) => {
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
                                message: "Success",
                                data: null
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
}));
exports.default = AppContentRouter;
//# sourceMappingURL=AppContent.js.map